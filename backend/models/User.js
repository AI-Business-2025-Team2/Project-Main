const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true },
  
  // 게임 요소
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  
  // 📅 [추가] 공부한 날짜들을 기록 (YYYY-MM-DD 문자열로 저장)
  studyHistory: [{ type: String }], 
  
  // 학습 기록
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  bookmarkedNews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);