import 'package:flutter/material.dart';

class CourseDetailScreen extends StatelessWidget {
  final String title;
  final Color color;

  const CourseDetailScreen({
    super.key,
    required this.title,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FD),
      appBar: AppBar(
        backgroundColor: color, // 강의 주제색으로 상단바 색상 변경
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // 1. 상단 헤더 (진행률 정보)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 30),
            decoration: BoxDecoration(
              color: color,
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(30),
                bottomRight: Radius.circular(30),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '나의 학습 진행도',
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Text(
                      '2/12 강 완료',
                      style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text('15%', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // 진행바
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: LinearProgressIndicator(
                    value: 0.15,
                    backgroundColor: Colors.black.withOpacity(0.1),
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                    minHeight: 8,
                  ),
                ),
              ],
            ),
          ),

          // 2. 챕터 리스트 (커리큘럼)
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: 10, // 예시로 10개 챕터 생성
              itemBuilder: (context, index) {
                // 예시: 첫 2개는 완료, 3번째는 진행 중, 나머지는 잠김
                bool isCompleted = index < 2;
                bool isLocked = index > 2;
                
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(color: Colors.grey.withOpacity(0.05), blurRadius: 10, spreadRadius: 2),
                    ],
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    leading: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: isLocked ? Colors.grey[200] : color.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isCompleted ? Icons.check : (isLocked ? Icons.lock : Icons.play_arrow),
                        color: isLocked ? Colors.grey : color,
                      ),
                    ),
                    title: Text(
                      'Chapter ${index + 1}. 강의 주제 예시입니다',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isLocked ? Colors.grey : Colors.black,
                      ),
                    ),
                    subtitle: Text(
                      isLocked ? '이전 강의를 완료하세요' : '15분 소요',
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                    trailing: isLocked 
                      ? null 
                      : const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                    onTap: isLocked ? null : () {
                      // 나중에 여기서 실제 학습 화면(영상/글)으로 이동
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('학습을 시작합니다! 📖')),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}