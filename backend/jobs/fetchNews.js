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
  // 1. 텍스트가 너무 짧거나 없으면 기본값 반환 (API 비용 절약)
  if (!articleText || articleText.length < 50) {
    return {
      aiSummary: "기사 본문 내용이 부족하여 요약할 수 없습니다. 원문 링크를 확인해주세요.",
      keyConcepts: []
    };
  }

  // 2. 강력해진 프롬프트 (수정됨)
  const prompt = `
    역할: 당신은 친절하고 유능한 뉴스 큐레이터입니다.
    
    목표: 
    사용자가 제공한 뉴스 텍스트를 읽고, 일반인도 이해하기 쉽게 한국어로 요약하고 핵심 용어를 설명해주세요.
    
    제약 조건 (반드시 지킬 것):
    1. 기사 내용이 금융과 직접적인 관련이 없어 보이더라도, 절대 거절하지 말고 내용을 요약하세요.
    2. 입력된 텍스트가 중간에 잘려있더라도, 주어진 내용만으로 최대한 문맥을 파악하여 요약하세요.
    3. 응답은 반드시 아래 JSON 형식으로만 출력하세요. (마크다운, 인사말 금지)
    
    출력 JSON 형식:
    {
      "aiSummary": "기사 내용을 3줄로 요약한 텍스트. (한글 작성, 각 줄은 줄바꿈 문자 '\\n'으로 구분, 명사형 종결 어미 사용 지양하고 '~했습니다' 체 사용)",
      "keyConcepts": [
        {"term": "용어1", "explanation": "해당 용어에 대한 초등학생도 이해할 수 있는 쉬운 설명 (한글)"},
        {"term": "용어2", "explanation": "해당 용어에 대한 초등학생도 이해할 수 있는 쉬운 설명 (한글)"}
      ]
    }

    [분석할 기사 텍스트]:
    "${articleText.replace(/"/g, "'")}" 
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 👈 모델 변경! (gpt-3.5-turbo -> gpt-4o-mini)
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, // JSON 강제 모드
      temperature: 0.7, // 창의성 조절 (약간 낮춰서 안정적으로)
    });

    const aiResult = response.choices[0].message.content;
    return JSON.parse(aiResult);

  } catch (aiError) {
    console.error("❌ OpenAI 분석 중 에러:", aiError.message);
    // 에러 발생 시에도 앱이 죽지 않도록 기본값 반환
    return {
      aiSummary: "AI 분석 서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      keyConcepts: []
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