const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  chapterIndex: { type: Number, required: true },
  title: { type: String, required: true },
  duration: { type: String, default: "10분" },
  
  // 📖 학습 본문 (데이터에 본문이 없어서 임시 텍스트로 채울 예정)
  content: { type: String, required: true },      
  
  // ❓ 퀴즈 데이터 (배열로 변경!)
  quizzes: [{
    question: { type: String, required: true },
    options: [{ type: String }], // 보기 4개
    answerIndex: { type: Number, required: true } // 정답 번호 (0~3)
  }]
});

module.exports = mongoose.model('Lesson', LessonSchema);