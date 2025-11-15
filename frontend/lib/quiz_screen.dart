import 'package:flutter/material.dart';

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  // 선택된 답의 인덱스 (-1은 선택 안 함)
  int _selectedOptionIndex = -1;
  // 정답 확인 여부
  bool _isSubmitted = false;

  // 더미 퀴즈 데이터
  final String question = "한국은행이 이번에 유지하기로 결정한\n기준금리는 몇 %인가요?";
  final List<String> options = ["2.5%", "3.0%", "3.5%", "3.75%"];
  final int correcterAnswerIndex = 2; // 3.5%가 정답

  void _checkAnswer() {
    setState(() {
      _isSubmitted = true;
    });

    // 정답 시 축하 메시지 (SnackBar)
    if (_selectedOptionIndex == correcterAnswerIndex) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🎉 정답입니다! +50 XP 획득!'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 2),
        ),
      );
    } else {
       ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('😢 아쉽네요. 다시 읽어볼까요?'),
          backgroundColor: Colors.redAccent,
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("오늘의 퀴즈"),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.pop(context), // 닫기 버튼
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 진행바 (Progress Bar)
            LinearProgressIndicator(
              value: 0.5, // 50% 진행
              backgroundColor: Colors.grey[200],
              color: const Color(0xFF8B5CF6),
              borderRadius: BorderRadius.circular(10),
            ),
            const SizedBox(height: 30),

            // 질문 텍스트
            const Text(
              "Q. 핵심 개념 체크",
              style: TextStyle(color: Color(0xFF8B5CF6), fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Text(
              question,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, height: 1.4),
            ),
            const SizedBox(height: 40),

            // 보기 리스트
            ...List.generate(options.length, (index) {
              bool isSelected = _selectedOptionIndex == index;
              bool isCorrect = index == correcterAnswerIndex;
              
              // 색상 결정 로직
              Color borderColor = Colors.grey.shade300;
              Color bgColor = Colors.white;
              IconData? icon;

              if (_isSubmitted) {
                if (isCorrect) {
                  borderColor = Colors.green;
                  bgColor = Colors.green.shade50;
                  icon = Icons.check_circle;
                } else if (isSelected && !isCorrect) {
                  borderColor = Colors.red;
                  bgColor = Colors.red.shade50;
                  icon = Icons.cancel;
                }
              } else if (isSelected) {
                borderColor = const Color(0xFF8B5CF6);
                bgColor = const Color(0xFFF3E8FF);
              }

              return GestureDetector(
                onTap: _isSubmitted ? null : () {
                  setState(() {
                    _selectedOptionIndex = index;
                  });
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: bgColor,
                    border: Border.all(color: borderColor, width: 2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Text(
                        options[index],
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          color: Colors.black87,
                        ),
                      ),
                      const Spacer(),
                      if (_isSubmitted && (isCorrect || (isSelected && !isCorrect)))
                        Icon(icon, color: isCorrect ? Colors.green : Colors.red),
                    ],
                  ),
                ),
              );
            }),
            
            const Spacer(),

            // 제출 버튼
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: (_selectedOptionIndex == -1 || _isSubmitted) ? null : _checkAnswer,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8B5CF6),
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: Colors.grey[300],
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text("정답 확인하기", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}