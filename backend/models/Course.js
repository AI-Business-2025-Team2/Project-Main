const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },       // 강의 제목 (예: 금융 기초)
  description: { type: String },                 // 강의 설명
  iconName: { type: String, default: 'book' },   // 아이콘 이름 (Flutter에서 매핑용)
  colorHex: { type: String, default: '0xFF2196F3' }, // 배경색 Hex 코드
  totalLectures: { type: Number, default: 0 },   // 총 강의 수
  progress: { type: Number, default: 0 },        // 진행률 (0 ~ 100)
});

module.exports = mongoose.model('Course', CourseSchema);