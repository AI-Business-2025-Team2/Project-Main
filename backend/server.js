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

// -------------------------------------------------------
// 🌱 초기 데이터 자동 생성 (Seeding)
// -------------------------------------------------------
async function seedDatabase() {

  // await News.deleteMany({}); // 삭제 로직, 실제에서 사용 X
  const newsCount = await News.countDocuments();
  if (newsCount === 0) {
    console.log('📦 뉴스 데이터를 새로 생성합니다 (AI 분석 스타일)...');
    await News.insertMany([
      {
        title: "미국 연준, 기준금리 동결... '연내 인하 가능성 열려있다'",
        originalUrl: "https://example.com/news/1",
        imageUrl: "https://source.unsplash.com/random/800x600/?finance",
        source: "글로벌경제",
        category: "거시경제",
        content: "미국 연방준비제도(Fed)가 기준금리를 현재 수준인 5.25~5.50%로 동결했습니다. 연방공개시장위원회(FOMC)는 성명을 통해 인플레이션이 목표치인 2%를 향해 움직이고 있다는 확신을 얻기 전까지는 금리를 인하하지 않겠다는 입장을 재확인했습니다. 하지만 제롬 파월 의장은...",
        
        // AI 요약
        aiSummary: "1. 미국 연준이 기준금리를 5.25~5.50%로 동결했습니다.\n2. 인플레이션 목표 달성 전까지 섣부른 인하는 없다고 밝혔습니다.\n3. 피벗 가능성을 시사하며 시장은 긍정적으로 반응했습니다.",
        
        // 핵심 개념 (하이라이트 및 설명)
        keyConcepts: [
          { term: "연방준비제도", explanation: "미국의 중앙은행 시스템으로 통화 정책을 관장합니다." },
          { term: "기준금리", explanation: "중앙은행이 시중 은행과 거래할 때 적용하는 금리입니다." },
          { term: "FOMC", explanation: "미국의 통화정책을 결정하는 최고 의사결정 기구입니다." }
        ],
        
        publishedAt: new Date()
      },
      {
        title: "비트코인, 현물 ETF 승인 기대감에 4만 달러 돌파",
        originalUrl: "https://example.com/news/2",
        imageUrl: "https://source.unsplash.com/random/800x600/?bitcoin",
        source: "코인뉴스",
        category: "가상화폐",
        content: "가상화폐 대장주 비트코인이 미국 증권거래위원회(SEC)의 현물 ETF 승인 기대감에 힘입어 4만 달러 선을 돌파했습니다. 이는 지난 2022년 4월 이후 약 20개월 만의 최고치입니다. 전문가들은 ETF가 승인될 경우 기관 자금이 대거 유입될 것으로 전망하고 있습니다.",
        
        aiSummary: "1. 비트코인이 20개월 만에 4만 달러를 돌파했습니다.\n2. 현물 ETF 승인에 대한 기대감이 주요 원인입니다.\n3. 승인 시 기관 자금 유입이 예상됩니다.",
        
        keyConcepts: [
          { term: "현물 ETF", explanation: "실제 비트코인을 보유하고 이를 바탕으로 발행하는 상장지수펀드입니다." },
          { term: "SEC", explanation: "미국 증권거래위원회로, 증권 시장을 감독하는 기관입니다." }
        ],

        publishedAt: new Date()
      }
    ]);
    console.log('✨ 뉴스 데이터 생성 완료 (AI 포맷)!');
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