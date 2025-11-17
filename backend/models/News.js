const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  // 1. 기사 기본 정보
  title: { type: String, required: true },       // 제목
  originalUrl: { type: String, required: true, unique: true }, // 원문 링크 (중복 방지용)
  imageUrl: { type: String },                    // 썸네일 이미지
  source: { type: String, required: true },      // 언론사 (예: 한국경제)
  category: { type: String, default: '경제' },   // 카테고리
  publishedAt: { type: Date, default: Date.now },// 기사 발행일
  
  // 2. 본문 내용 (읽기 탭용)
  content: { type: String, required: true },     // 기사 전문 (또는 긴 요약)

  // 3. AI 분석 데이터 (AI 튜터 탭용)
  aiSummary: { type: String },                   // 3줄 요약
  keyConcepts: [{                                // 핵심 개념 (하이라이트용)
    term: { type: String },                      // 용어 (예: FOMC)
    explanation: { type: String }                // 설명 (예: 연방공개시장위원회...)
  }],

  // 4. 관리용 필드
  // createdAt: 데이터 생성 시간 (이 시간을 기준으로 7일 뒤 자동 삭제됨)
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 } 
});

// 'expires': 60*60*24*7 (초 단위) -> 7일 뒤 DB에서 자동 삭제 설정 (TTL Index)

module.exports = mongoose.model('News', NewsSchema);