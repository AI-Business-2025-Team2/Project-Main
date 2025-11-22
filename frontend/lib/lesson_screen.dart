import 'package:flutter/material.dart';
import 'quiz_screen.dart';

class LessonScreen extends StatelessWidget {
  // 서버에서 받은 Lesson 데이터 통째로 (title, content, quiz 등 포함)
  final Map<String, dynamic> lessonData;

  const LessonScreen({
    super.key,
    required this.lessonData,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text("학습 중", style: TextStyle(color: Colors.black, fontSize: 16)),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ElevatedButton(
            onPressed: () {
              // 👇 [중요] 퀴즈 데이터가 있으면 QuizScreen으로 넘김
              if (lessonData['quiz'] != null) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => QuizScreen(quizData: lessonData['quiz']),
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('이 강의에는 퀴즈가 없습니다.')));
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF8B5CF6),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.quiz),
                SizedBox(width: 8),
                Text('퀴즈 풀고 완료하기', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(color: const Color(0xFFF3E8FF), borderRadius: BorderRadius.circular(8)),
              child: Text(
                'Chapter ${lessonData['chapterIndex']}',
                style: const TextStyle(color: Color(0xFF7C3AED), fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 16),
            
            // 진짜 제목 표시
            Text(
              lessonData['title'] ?? '제목 없음',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, height: 1.3),
            ),
            const SizedBox(height: 30),

            // 진짜 본문 내용 표시
            Text(
              lessonData['content'] ?? '내용이 없습니다.',
              style: const TextStyle(fontSize: 16, height: 1.8, color: Colors.black87),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}