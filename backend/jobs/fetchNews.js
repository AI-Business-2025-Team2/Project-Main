const path = require('path'); // 1. 'path' 모듈 불러오기
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const axios = require('axios');
const mongoose = require('mongoose');
const News = require('../models/News'); // News 모델 불러오기

// 1. MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB 연결 성공 (수집기)'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 2. 뉴스 수집 및 저장 함수
async function fetchAndSaveNews() {
  console.log('📰 뉴스 수집을 시작합니다...');
  
  const API_KEY = process.env.NEWS_API_KEY;
  const URL = `https://newsapi.org/v2/top-headlines?country=kr&category=business&pageSize=10&apiKey=${API_KEY}`; // 한국(kr) 비즈니스 뉴스 10개

  try {
    const response = await axios.get(URL);
    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      console.log('가져올 새 뉴스가 없습니다.');
      return;
    }

    console.log(`총 ${articles.length}개의 기사를 가져왔습니다.`);

    // 3. 각 기사를 우리 DB 형식에 맞게 가공
    for (const article of articles) {
      // NewsAPI는 'content'를 아주 짧게 주거나 null일 때가 있습니다.
      // 나중에 이 부분을 AI로 채워야 합니다.
      const content = article.content || article.description || "본문 내용이 없습니다.";

      const newNews = new News({
        title: article.title,
        originalUrl: article.url,
        imageUrl: article.urlToImage,
        source: article.source.name,
        category: '경제', // API 카테고리를 그대로 쓰거나 매핑
        publishedAt: new Date(article.publishedAt),
        
        content: content, // (임시: NewsAPI의 짧은 설명으로 대체)
        
        // --- AI가 채워줄 부분 (지금은 임시 데이터) ---
        aiSummary: "AI가 3줄 요약을 생성할 자리입니다. 기사 내용을 확인하세요.",
        keyConcepts: [
          { term: "핵심 개념", explanation: "AI가 자동으로 핵심 개념을 추출할 예정입니다." }
        ]
        // ------------------------------------------
      });

      // 4. DB에 저장 (중복 URL은 저장 안 함)
      try {
        await newNews.save();
        console.log(`✅ 저장 성공: ${article.title.substring(0, 20)}...`);
      } catch (error) {
        if (error.code === 11000) { // 11000은 중복 키 에러
          console.log(`👌 이미 존재함: ${article.title.substring(0, 20)}...`);
        } else {
          console.error('DB 저장 중 에러:', error.message);
        }
      }
    }

    console.log('🎉 뉴스 수집 및 저장이 완료되었습니다.');

  } catch (error) {
    console.error('NewsAPI에서 데이터를 가져오는 중 오류 발생:', error.message);
  } finally {
    // 5. 작업 완료 후 DB 연결 종료
    mongoose.connection.close();
  }
}

// 6. 스크립트 실행
fetchAndSaveNews();