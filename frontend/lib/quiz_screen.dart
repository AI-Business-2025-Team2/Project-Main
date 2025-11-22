import 'package:flutter/material.dart';

class QuizScreen extends StatefulWidget {
  // 서버에서 받은 퀴즈 데이터 (question, options, answerIndex)
  final Map<String, dynamic> quizData;

  const QuizScreen({
    super.key,
    required this.quizData,
  });

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int _selectedOptionIndex = -1;
  bool _isSubmitted = false;

  void _checkAnswer() {
    setState(() {
      _isSubmitted = true;
    });

    // 정답 확인 로직
    // DB에는 answerIndex가 0~3 숫자로 저장되어 있음
    int correctAnswerIndex = widget.quizData['answerIndex'];

    if (_selectedOptionIndex == correctAnswerIndex) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🎉 정답입니다! +50 XP 획득!'), backgroundColor: Colors.green),
      );
    } else {
       ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('😢 오답입니다. 다시 공부해보세요!'), backgroundColor: Colors.redAccent),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // 데이터 바인딩
    String question = widget.quizData['question'];
    List<dynamic> options = widget.quizData['options'];
    int correctAnswerIndex = widget.quizData['answerIndex'];

    return Scaffold(
      appBar: AppBar(
        title: const Text("오늘의 퀴즈"),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            LinearProgressIndicator(
              value: 1.0,
              backgroundColor: Colors.grey[200],
              color: const Color(0xFF8B5CF6),
              borderRadius: BorderRadius.circular(10),
            ),
            const SizedBox(height: 30),

            const Text("Q. 핵심 개념 체크", style: TextStyle(color: Color(0xFF8B5CF6), fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            
            // 진짜 질문 표시
            Text(
              question,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, height: 1.4),
            ),
            const SizedBox(height: 40),

            // 진짜 보기 리스트 표시
            ...List.generate(options.length, (index) {
              bool isSelected = _selectedOptionIndex == index;
              bool isCorrect = index == correctAnswerIndex;
              
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
                        options[index], // 보기 텍스트
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