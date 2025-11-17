import 'package:flutter/material.dart';
import 'quiz_screen.dart';

class LessonScreen extends StatelessWidget {
  final String chapterTitle;
  final int chapterIndex;

  const LessonScreen({
    super.key,
    required this.chapterTitle,
    required this.chapterIndex,
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
        // 상단 진행바 (Progress Bar)
        title: ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: (chapterIndex + 1) / 10, // 예: 1강이면 10%, 2강이면 20%
            backgroundColor: Colors.grey[200],
            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF8B5CF6)),
            minHeight: 6,
          ),
        ),
      ),
      // 하단 고정 버튼
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ElevatedButton(
            onPressed: () {
              // 퀴즈 화면으로 이동! (Replace를 써서 뒤로가기 시 학습 화면 건너뛰기)
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const QuizScreen()),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF8B5CF6),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Row( // 아이콘 추가해서 좀 더 있어 보이게
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
            // 챕터 번호
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFF3E8FF),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Chapter ${chapterIndex + 1}',
                style: const TextStyle(color: Color(0xFF7C3AED), fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 16),
            
            // 강의 제목
            Text(
              chapterTitle,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, height: 1.3),
            ),
            const SizedBox(height: 30),

            // 본문 내용 (더미 데이터)
            const Text(
              '경제 활동의 기본이 되는 "돈"이란 과연 무엇일까요?\n\n우리는 매일 돈을 쓰고, 벌고, 저축합니다. 하지만 돈의 본질에 대해 깊게 생각해본 적은 많지 않습니다. 경제학에서 돈, 즉 화폐는 크게 세 가지 기능을 가집니다.\n\n첫째, 교환의 매개 수단입니다. 물물교환의 불편함을 없애주죠.\n둘째, 가치의 척도입니다. 사과의 가치와 자동차의 가치를 숫자로 비교할 수 있게 해줍니다.\n셋째, 가치의 저장 수단입니다. 열심히 일한 대가를 미래를 위해 보관할 수 있죠.',
              style: TextStyle(fontSize: 16, height: 1.8, color: Colors.black87),
            ),
            const SizedBox(height: 20),
            
            // 중간 이미지 (시각 자료)
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                'https://source.unsplash.com/random/800x400/?money,coins',
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => 
                  Container(height: 200, color: Colors.grey[200], child: const Icon(Icons.image)),
              ),
            ),
            const SizedBox(height: 20),
            
            const Text(
              '현대 사회에서는 실물 화폐를 넘어, 신용카드나 모바일 페이, 더 나아가 암호화폐까지 화폐의 형태가 진화하고 있습니다. 이번 챕터에서는 이러한 화폐의 역사와 미래에 대해 자세히 알아보겠습니다.',
              style: TextStyle(fontSize: 16, height: 1.8, color: Colors.black87),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}