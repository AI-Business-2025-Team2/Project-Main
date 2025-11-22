const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // 어떤 코스의 강의인지 (연결고리)
  chapterIndex: { type: Number, required: true }, // 챕터 번호 (1강, 2강...)
  title: { type: String, required: true },        // 챕터 제목
  duration: { type: String, default: "10분" },    // 소요 시간
  
  // 📖 학습 본문
  content: { type: String, required: true },      
  
  // ❓ 퀴즈 데이터 (이 챕터를 다 읽고 풀 문제)
  quiz: {
    question: { type: String, required: true },
    options: [{ type: String }], // 보기 4개
    answerIndex: { type: Number, required: true } // 정답 번호 (0~3)
  }
});

module.exports = mongoose.model('Lesson', LessonSchema);