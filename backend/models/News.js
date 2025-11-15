const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  category: { type: String, required: true },   // 예: 금융
  source: { type: String, required: true },     // 예: 한국경제
  title: { type: String, required: true },      // 예: 제목
  summary: { type: String, required: true },    // 예: 요약
  tags: [{ type: String }],                     // 예: ['금리', '물가']
  createdAt: { type: Date, default: Date.now }  // 생성 시간
});

// 이 스키마를 'News'라는 이름의 모델로 내보냅니다.
module.exports = mongoose.model('News', NewsSchema);