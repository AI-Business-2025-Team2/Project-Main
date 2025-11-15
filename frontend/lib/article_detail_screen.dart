import 'package:flutter/material.dart';
import 'quiz_screen.dart'; // 퀴즈 화면으로 넘어가기 위해 필요

class ArticleDetailScreen extends StatelessWidget {
  final String title;
  final String source;
  final String time;
  final String category;

  // 생성자에서 뉴스 정보를 받도록 설정
  const ArticleDetailScreen({
    super.key,
    required this.title,
    required this.source,
    required this.time,
    required this.category,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      // 상단바 (뒤로가기, 공유, 북마크)
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.bookmark_border, color: Colors.black)),
          IconButton(onPressed: () {}, icon: const Icon(Icons.share, color: Colors.black)),
        ],
      ),
      // 하단 고정 버튼 (퀴즈 풀기)
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ElevatedButton(
            onPressed: () {
              // 퀴즈 화면으로 이동
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const QuizScreen()),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF8B5CF6), // 보라색
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 0,
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.edit_note),
                SizedBox(width: 8),
                Text('이 뉴스로 퀴즈 풀기 (50 XP)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. 카테고리 및 출처
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF3E8FF),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(category, style: const TextStyle(color: Color(0xFF7C3AED), fontWeight: FontWeight.bold, fontSize: 12)),
                ),
                const SizedBox(width: 10),
                Text('$source · $time', style: const TextStyle(color: Colors.grey, fontSize: 14)),
              ],
            ),
            const SizedBox(height: 16),

            // 2. 제목
            Text(
              title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, height: 1.4, letterSpacing: -0.5),
            ),
            const SizedBox(height: 20),

            // 3. 대표 이미지 (임시 이미지)
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.network(
                'https://source.unsplash.com/random/800x400/?finance,news', // 랜덤 금융 이미지
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => 
                  Container(height: 200, color: Colors.grey[200], child: const Icon(Icons.image_not_supported)),
              ),
            ),
            const SizedBox(height: 24),

            // 4. 본문 내용 (가짜 데이터)
            const Text(
              '''한국은행이 8개월 연속 기준금리를 3.5%로 유지했습니다. 금융통화위원회는 최근 소비자물가 상승률이 2%대로 안정되는 추세를 보이며, 경기 회복세를 고려해 신중한 통화정책 기조를 이어가기로 결정했습니다.

이번 결정은 시장의 예상과 일치하는 결과로, 전문가들은 당분간 금리 인하보다는 현 수준 유지가 계속될 것으로 전망하고 있습니다.

특히 이창용 한국은행 총재는 기자회견에서 "물가 안정 목표에 수렴하고 있다는 확신이 들 때까지 긴축 기조를 유지할 것"이라고 강조했습니다.

한편, 이번 동결 결정으로 인해 미국과의 금리 차이는 당분간 현 수준(2.0%p)을 유지하게 되었습니다. 이는 외국인 자본 유출 우려를 어느 정도 잠재울 수 있을 것으로 보입니다.''',
              style: TextStyle(fontSize: 16, height: 1.8, color: Colors.black87),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}