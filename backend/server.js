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
  // 1. 뉴스 데이터 (보존 모드 - 주석 유지)
  // await News.deleteMany({}); 
  
  // 2. 코스 및 레슨 데이터 초기화 (개발용: 싹 지우고 다시 생성)
  await Course.deleteMany({});
  await Lesson.deleteMany({});
  console.log('📦 코스 및 레슨 데이터를 새로 생성합니다...');

  // (1) 코스 생성
  const courses = await Course.insertMany([
    {
      title: '금융 기초',
      description: '돈의 흐름과 기본 용어 정복',
      iconName: 'account_balance',
      colorHex: '0xFF2196F3', // 파랑
      totalLectures: 3,
      progress: 0
    },
    {
      title: '주식 투자',
      description: '차트 보는 법부터 매매까지',
      iconName: 'show_chart',
      colorHex: '0xFFF44336', // 빨강
      totalLectures: 2,
      progress: 0
    }
  ]);

  // (2) 레슨 생성 (금융 기초 코스에 연결)
  const financeCourseId = courses[0]._id; // 방금 만든 '금융 기초'의 ID

  await Lesson.insertMany([
    {
      courseId: financeCourseId,
      chapterIndex: 1,
      title: "돈이란 무엇인가?",
      duration: "5분",
      content: "돈은 교환의 매개체이자 가치의 척도입니다. 과거에는 조개껍데기나 소금을 사용했지만...",
      quiz: {
        question: "돈의 3대 기능이 아닌 것은?",
        options: ["교환의 매개", "가치 저장", "가치 척도", "기분 전환"],
        answerIndex: 3
      }
    },
    {
      courseId: financeCourseId,
      chapterIndex: 2,
      title: "금리의 이해",
      duration: "8분",
      content: "금리는 돈의 가격입니다. 내가 돈을 빌려 쓰면 그 대가로 이자를 내야 하는데, 이때 적용되는 비율을 금리라고 합니다...",
      quiz: {
        question: "금리가 올라가면 일반적으로 발생하는 현상은?",
        options: ["예금 증가", "대출 증가", "소비 폭발", "물가 폭등"],
        answerIndex: 0
      }
    },
    {
      courseId: financeCourseId,
      chapterIndex: 3,
      title: "인플레이션과 디플레이션",
      duration: "10분",
      content: "인플레이션은 물가가 지속적으로 오르는 현상이고, 디플레이션은 반대로 물가가 내리는 현상입니다...",
      quiz: {
        question: "물가가 지속적으로 상승하는 현상을 무엇이라 하는가?",
        options: ["인플레이션", "디플레이션", "스태그플레이션", "리세션"],
        answerIndex: 0
      }
    }
  ]);

  console.log('✨ 학습 데이터 생성 완료!');
}

// DB 연결 후 시딩 실행
mongoose.connection.once('open', seedDatabase);

// 서버 시작
app.listen(port, () => {
  console.log(`🚀 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});