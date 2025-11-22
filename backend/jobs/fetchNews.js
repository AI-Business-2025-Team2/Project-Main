const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const axios = require('axios');
const mongoose = require('mongoose');
const News = require('../models/News');
const { OpenAI } = require('openai'); // 1. OpenAI 모듈 불러오기

// 2. OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 3. AI 분석 함수 (새로 추가)
async function analyzeNewsWithAI(articleText) {
  if (!articleText || articleText.trim() === "") {
    // 분석할 텍스트가 없으면 기본값 반환
    return {
      aiSummary: "요약할 내용이 없습니다.",
      keyConcepts: [{ term: "내용 없음", explanation: "기사 본문을 제공받지 못했습니다." }]
    };
  }

  // 4. AI에게 보낼 명령 (Prompt)
  const prompt = `
    당신은 전문적인 금융 뉴스 분석가입니다. 
    아래 제공된 뉴스 기사 텍스트를 분석하여, 반드시 다음 JSON 형식에 맞춰 한국어(Korean)로 응답해 주세요:

    {
      "aiSummary": "기사 내용을 3줄로 요약한 텍스트. (반드시 한글로 작성, 각 줄은 줄바꿈 문자 '\\n'으로 구분)",
      "keyConcepts": [
        {"term": "핵심 용어 1", "explanation": "해당 용어에 대한 쉬운 설명 (한글)"},
        {"term": "핵심 용어 2", "explanation": "해당 용어에 대한 쉬운 설명 (한글)"}
      ]
    }

    [기사 텍스트]:
    "${articleText}"
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106", // JSON 모드를 지원하는 모델
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // 5. JSON 형식으로만 응답하도록 강제
    });

    const aiResult = response.choices[0].message.content;
    return JSON.parse(aiResult); // JSON 문자열을 객체로 변환

  } catch (aiError) {
    console.error("❌ OpenAI 분석 중 에러:", aiError.message);
    // AI가 실패해도 기본값 반환
    return {
      aiSummary: "AI 요약 생성에 실패했습니다.",
      keyConcepts: [{ term: "오류", explanation: "AI 분석 중 오류가 발생했습니다." }]
    };
  }
}

// 6. DB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB 연결 성공 (수집기)'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 7. 뉴스 수집 및 저장 함수 (수정됨)
async function fetchAndSaveNews() {
  console.log('📰 AI 뉴스 수집을 시작합니다...');
  
  const API_KEY = process.env.NEWS_API_KEY;
  const URL = `https://newsapi.org/v2/everything?q=finance&language=en&sortBy=publishedAt&pageSize=5&apiKey=${API_KEY}`; // (테스트를 위해 5개로 줄임)

  try {
    const response = await axios.get(URL);
    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      console.log('가져올 새 뉴스가 없습니다.');
      return;
    }
    console.log(`총 ${articles.length}개의 기사를 가져왔습니다. AI 분석을 시작합니다...`);

    for (const article of articles) {
      // NewsAPI의 content나 description을 AI에 넘김
      const textToAnalyze = article.content || article.description || "";
      
      // 8. AI 분석 실행!
      const aiData = await analyzeNewsWithAI(textToAnalyze);

      const newNews = new News({
        title: article.title,
        originalUrl: article.url,
        imageUrl: article.urlToImage,
        source: article.source.name,
        category: 'Finance',
        publishedAt: new Date(article.publishedAt),
        content: textToAnalyze, // (나중에 스크래핑한 본문으로 대체)
        
        // 9. AI가 생성한 데이터 저장
        aiSummary: aiData.aiSummary,
        keyConcepts: aiData.keyConcepts
      });

      try {
        await newNews.save();
        console.log(`✅ AI 분석/저장 성공: ${article.title.substring(0, 20)}...`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`👌 이미 존재함: ${article.title.substring(0, 20)}...`);
        } else {
          console.error('DB 저장 중 에러:', error.message);
        }
      }
    }

    console.log('🎉 AI 뉴스 수집 및 저장이 완료되었습니다.');

  } catch (error) {
    console.error('NewsAPI에서 데이터를 가져오는 중 오류 발생:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

fetchAndSaveNews();