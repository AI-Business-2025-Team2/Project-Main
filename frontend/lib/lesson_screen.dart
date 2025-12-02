import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart'; // 👈 [추가] 마크다운 패키지
import 'quiz_screen.dart';

class LessonScreen extends StatelessWidget {
  // 서버에서 받은 Lesson 데이터 통째로
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
              var quizzes = lessonData['quizzes'];
  
              if (quizzes != null && (quizzes as List).isNotEmpty) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => QuizScreen(
                      quizList: quizzes,
                      lessonId: lessonData['_id'],
                    ),
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
            
            // 제목
            Text(
              lessonData['title'] ?? '제목 없음',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, height: 1.3),
            ),
            const SizedBox(height: 30),

            // 👇 [수정] 마크다운 위젯으로 교체!
            MarkdownBody(
              data: lessonData['content'] ?? '내용이 없습니다.',
              styleSheet: MarkdownStyleSheet(
                // 본문 스타일
                p: const TextStyle(fontSize: 16, height: 1.8, color: Colors.black87),
                // 헤더 1 (#) 스타일
                h1: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black, height: 2.0),
                // 헤더 2 (##) 스타일
                h2: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87, height: 1.8),
                // 리스트 점(bullet) 스타일
                listBullet: const TextStyle(fontSize: 16, color: Colors.black87),
                // 강조 (**bold**) 스타일
                strong: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF6D28D9)),
              ),
            ),
            
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}