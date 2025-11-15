require('dotenv').config(); // .env 파일 불러오기
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const News = require('./models/News');
const Course = require('./models/Course');

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
// 📡 API 만들기
// -------------------------------------------------------

// 1. 뉴스 목록 가져오기 (DB에서 조회)
app.get('/api/news', async (req, res) => {
  try {
    // DB에서 모든 뉴스를 최신순으로 가져옴
    const newsList = await News.find().sort({ createdAt: -1 });
    
    // 프론트엔드 형식에 맞춰서 데이터 가공
    const formattedNews = newsList.map(news => ({
      id: news._id,
      category: news.category,
      source: news.source,
      time: '방금 전', // (나중에 실제 시간 계산 로직 추가 가능)
      title: news.title,
      summary: news.summary,
      tags: news.tags
    }));

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

// -------------------------------------------------------
// 🌱 초기 데이터 자동 생성 (Seeding)
// -------------------------------------------------------
async function seedDatabase() {
  const newsCount = await News.countDocuments();
  
  if (newsCount === 0) {
    console.log('📦 DB가 비어있어서 초기 데이터를 넣습니다...');
    await News.insertMany([
      {
        category: '금융',
        source: '한국경제',
        title: '한국은행, 기준금리 3.5% 동결... 물가 안정세 주목',
        summary: '한국은행이 8개월 연속 기준금리를 3.5%로 유지했습니다. 물가 안정세가 지속될 것으로 보입니다.',
        tags: ['기준금리', '통화정책', '물가상승률']
      },
      {
        category: '증권',
        source: '이데일리',
        title: '코스피 2,700선 돌파... 외국인 순매수 지속',
        summary: '외국인 투자자들의 매수세에 힘입어 코스피가 2,700선을 돌파했습니다.',
        tags: ['코스피', '외국인투자', '반도체']
      },
      {
        category: '부동산',
        source: '매일경제',
        title: '서울 아파트 전세가 3주 연속 상승',
        summary: '서울 주요 지역의 아파트 전세 가격이 상승세를 보이고 있습니다.',
        tags: ['부동산', '전세', '서울아파트']
      }
    ]);
    console.log('✨ 초기 데이터 생성 완료!');
  }

  const courseCount = await Course.countDocuments();
  if (courseCount === 0) {
    console.log('📦 강의 데이터를 생성합니다...');
    await Course.insertMany([
      {
        title: '금융 기초',
        description: '돈의 흐름과 기본 용어 정복',
        iconName: 'account_balance',
        colorHex: '0xFF2196F3', // 파랑
        totalLectures: 12,
        progress: 45
      },
      {
        title: '주식 투자',
        description: '차트 보는 법부터 매매까지',
        iconName: 'show_chart',
        colorHex: '0xFFF44336', // 빨강
        totalLectures: 8,
        progress: 10
      },
      {
        title: '부동산',
        description: '내 집 마련을 위한 필수 지식',
        iconName: 'apartment',
        colorHex: '0xFFFF9800', // 주황
        totalLectures: 5,
        progress: 0
      },
      {
        title: '가상 화폐',
        description: '블록체인과 비트코인의 이해',
        iconName: 'currency_bitcoin',
        colorHex: '0xFFFFC107', // 노랑
        totalLectures: 4,
        progress: 0
      },
       {
        title: '세금/법률',
        description: '알아두면 돈이 되는 절세 꿀팁',
        iconName: 'shield',
        colorHex: '0xFF009688', // 청록
        totalLectures: 6,
        progress: 0
      },
    ]);
    console.log('✨ 강의 데이터 생성 완료!');
  }
  
}
// DB 연결 후 시딩 실행
mongoose.connection.once('open', seedDatabase);

// 서버 시작
app.listen(port, () => {
  console.log(`🚀 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});