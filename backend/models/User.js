const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // 1. 기본 계정 정보
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 암호화되어 저장됨
  nickname: { type: String, required: true },
  
  // 2. 게이미피케이션 (게임 요소)
  xp: { type: Number, default: 0 },           // 경험치
  level: { type: Number, default: 1 },        // 레벨
  streak: { type: Number, default: 0 },       // 연속 학습일
  
  // 3. 학습 기록
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // 완료한 강의 ID 목록
  bookmarkedNews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],     // 스크랩한 뉴스 ID 목록
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);