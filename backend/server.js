require('dotenv').config(); // .env 파일 불러오기
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const News = require('./models/News');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// -------------------------------------------------------
// 🔌 MongoDB 연결
// -------------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// -------------------------------------------------------
// 🔐 인증(Auth) 관련 API
// -------------------------------------------------------
const JWT_SECRET = "my_super_secret_key_1234"; // (보안키: 나중에 .env로 이동 추천)

// 1. 회원가입 (POST /api/register)
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    // 이미 있는 이메일인지 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    }

    // 비밀번호 암호화 (해싱)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성
    const newUser = new User({
      email,
      password: hashedPassword,
      nickname,
      xp: 0,
      level: 1
    });

    await newUser.save();
    res.status(201).json({ message: "회원가입 성공! 로그인해주세요." });

  } catch (err) {
    res.status(500).json({ message: "회원가입 중 오류 발생", error: err.message });
  }
});

// 2. 로그인 (POST /api/login)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 유저 찾기
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "이메일 또는 비밀번호가 틀렸습니다." });
    }

    // 비밀번호 확인 (입력값 vs 암호화된 값 비교)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "이메일 또는 비밀번호가 틀렸습니다." });
    }

    // 토큰 발급 (유저 ID를 담음)
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' }); // 7일간 유효

    res.json({
      message: "로그인 성공!",
      token, // 이 토큰을 앱에 저장해야 함
      user: {
        id: user._id,
        nickname: user.nickname,
        xp: user.xp,
        level: user.level
      }
    });

  } catch (err) {
    res.status(500).json({ message: "로그인 중 오류 발생", error: err.message });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ message: "로그인이 필요합니다." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    req.user = user; // 토큰에서 꺼낸 유저 정보(ID)를 요청에 담음
    next();
  });
}

// -------------------------------------------------------
// 👤 유저 정보 및 게이미피케이션 API
// -------------------------------------------------------

// 1. 내 정보 가져오기 (프로필 화면용)
app.get('/api/user/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // 비번 빼고 조회
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. 학습 진행도 업데이트 (퀴즈 정답 시 XP 추가)
app.post('/api/user/progress', authenticateToken, async (req, res) => {
  try {
    const { xpEarned, lessonId } = req.body;
    const user = await User.findById(req.user.userId);

    // 1) XP 추가
    user.xp += xpEarned;

    // 2) 레벨업 로직 (예: 100 XP마다 1 레벨업)
    const newLevel = Math.floor(user.xp / 100) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
      // (여기서 "레벨업 축하" 알림 등을 보낼 수도 있음)
    }

    // 3) 완료한 강의 목록에 추가 (중복 방지)
    if (lessonId && !user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId);
    }

    await user.save();

    res.json({ 
      message: "학습 기록 업데이트 성공!", 
      currentXp: user.xp, 
      currentLevel: user.level,
      leveledUp: newLevel > user.level 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. 뉴스 북마크 토글 (추가/삭제)
app.post('/api/user/bookmark', authenticateToken, async (req, res) => {
  try {
    const { newsId } = req.body;
    const user = await User.findById(req.user.userId);

    // 이미 북마크 되어 있는지 확인
    const index = user.bookmarkedNews.indexOf(newsId);

    if (index === -1) {
      // 없으면 -> 추가 (북마크 설정)
      user.bookmarkedNews.push(newsId);
      await user.save();
      res.json({ message: "북마크에 저장되었습니다.", isBookmarked: true });
    } else {
      // 있으면 -> 삭제 (북마크 해제)
      user.bookmarkedNews.splice(index, 1);
      await user.save();
      res.json({ message: "북마크가 해제되었습니다.", isBookmarked: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------------------------------------
// 📡 API 만들기
// -------------------------------------------------------

// 1. 뉴스 목록 가져오기 (Daily 20 & AI 데이터 포함)
app.get('/api/news', async (req, res) => {
  try {
    // DB에서 최신순으로 정렬하여 상위 20개만 가져옴
    const newsList = await News.find()
      .sort({ publishedAt: -1 }) // 최신 날짜 순
      .limit(20);                // 20개 제한
    
    // 프론트엔드가 쓰기 편하게 데이터 가공
    const formattedNews = newsList.map(news => {
      // 날짜 포맷팅 (예: 2시간 전, 방금 전 등) - 간단하게 구현
      const timeDiff = new Date() - new Date(news.publishedAt);
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
      const timeString = hoursDiff > 24 
        ? `${Math.floor(hoursDiff / 24)}일 전` 
        : (hoursDiff > 0 ? `${hoursDiff}시간 전` : '방금 전');

      return {
        id: news._id,
        title: news.title,
        category: news.category,
        source: news.source,
        time: timeString,          // 계산된 시간 문자열
        summary: news.aiSummary,   // 목록에는 'AI 요약'을 미리 보여주거나, 본문 앞부분 사용
        tags: news.keyConcepts.map(k => k.term), // 태그는 핵심 개념의 용어들로 구성
        imageUrl: news.imageUrl,
        
        // 👇 상세 화면을 위한 데이터도 같이 보냄
        content: news.content,
        aiSummary: news.aiSummary,
        keyConcepts: news.keyConcepts
      };
    });

    res.json(formattedNews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------------------------------------
// 🏫 학습(Course) 관련 API
// -------------------------------------------------------

// 1. 강의 목록 가져오기
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/courses/:id/lessons', async (req, res) => {
  try {
    const courseId = req.params.id;
    // 해당 코스 ID를 가진 레슨들을 챕터 순서대로 가져옴
    const lessons = await Lesson.find({ courseId: courseId }).sort({ chapterIndex: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------------------------------------
// 🌱 초기 데이터 자동 생성 (Seeding)
// -------------------------------------------------------

async function seedDatabase() {
  // 1. 뉴스 데이터 (이미 주석 처리됨)
  // await News.deleteMany({}); 
  
  // 👇 [수정] 아래 줄들을 모두 주석(//) 처리하세요!
  // await Course.deleteMany({});
  // await Lesson.deleteMany({});
  // console.log('📦 코스 및 레슨 데이터를 새로 생성합니다...');
  
  // ... (Course.insertMany, Lesson.insertMany 부분도 모두 주석 처리하거나 지우세요) ...
  
  console.log('✨ (서버) 데이터 초기화를 건너뜁니다.'); 
}

// DB 연결 후 시딩 실행
mongoose.connection.once('open', seedDatabase);

// 서버 시작
app.listen(port, () => {
  console.log(`🚀 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

app.get('/api/user/next-lesson', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // 모든 강의를 순서대로 가져옴 (코스 순 -> 챕터 순)
    // 실제로는 Course 순서도 고려해야 하지만, 여기서는 단순히 모든 Lesson을 가져와서 비교합니다.
    const allLessons = await Lesson.find().sort({ courseId: 1, chapterIndex: 1 });
    
    // 유저가 완료하지 않은 첫 번째 강의를 찾음
    let nextLesson = null;
    for (const lesson of allLessons) {
      if (!user.completedLessons.includes(lesson._id)) {
        nextLesson = lesson;
        break; // 찾았으면 중단
      }
    }

    if (nextLesson) {
      // 그 강의가 속한 코스 정보도 필요하므로 가져옴
      const course = await Course.findById(nextLesson.courseId);
      res.json({
        hasLesson: true,
        lesson: nextLesson,
        courseTitle: course ? course.title : "코스 정보 없음",
        courseColor: course ? course.colorHex : "0xFF8B5CF6"
      });
    } else {
      res.json({ hasLesson: false, message: "모든 강의를 완료했습니다!" });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});