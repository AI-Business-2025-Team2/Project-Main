import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class QuizScreen extends StatefulWidget {
  final List<dynamic> quizList; // 👈 퀴즈 목록 (10개)
  final String lessonId;

  const QuizScreen({
    super.key,
    required this.quizList,
    required this.lessonId,
  });

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int _currentIndex = 0; // 현재 몇 번째 문제인지 (0 ~ 9)
  int _selectedOptionIndex = -1; // 선택한 보기
  bool _isChecked = false; // 정답 확인 여부
  bool _isCorrect = false; // 정답 여부

  // 정답 확인 함수
  void _checkAnswer() {
    setState(() {
      _isChecked = true;
      int correctAnswerIndex = widget.quizList[_currentIndex]['answerIndex'];
      _isCorrect = (_selectedOptionIndex == correctAnswerIndex);
    });

    if (!_isCorrect) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('😢 오답입니다. 다시 시도해보세요!'), backgroundColor: Colors.redAccent, duration: Duration(milliseconds: 500)),
      );
    }
  }

  // 다음 문제로 넘어가기 (또는 최종 완료)
  Future<void> _nextQuestion() async {
    if (_currentIndex < widget.quizList.length - 1) {
      // 다음 문제가 남았으면
      setState(() {
        _currentIndex++;
        _selectedOptionIndex = -1;
        _isChecked = false;
        _isCorrect = false;
      });
    } else {
      // 마지막 문제까지 다 풀었으면 -> 서버 전송 & 종료
      await _submitProgress(100); // 100 XP 지급 (보상 크기 조절 가능)
      
      if (!mounted) return;
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          title: const Text("🎉 강의 완료!"),
          content: const Text("모든 퀴즈를 풀고 경험치를 획득했습니다."),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context); // 다이얼로그 닫기
                Navigator.pop(context); // 퀴즈 화면 닫기 (목록으로)
              },
              child: const Text("확인"),
            )
          ],
        ),
      );
    }
  }

  // 서버 API 호출 (완료 처리)
  Future<void> _submitProgress(int xp) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) return;

    String baseUrl;
    if (kIsWeb) baseUrl = 'http://localhost:3000';
    else if (Platform.isAndroid) baseUrl = 'http://10.0.2.2:3000';
    else baseUrl = 'http://localhost:3000';

    try {
      await http.post(
        Uri.parse('$baseUrl/api/user/progress'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token"
        },
        body: jsonEncode({
          "xpEarned": xp,
          "lessonId": widget.lessonId
        }),
      );
    } catch (e) {
      print("업데이트 실패: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    // 현재 문제 데이터 가져오기
    final currentQuiz = widget.quizList[_currentIndex];
    final String question = currentQuiz['question'];
    final List<dynamic> options = currentQuiz['options'];
    final int correctAnswerIndex = currentQuiz['answerIndex'];

    // 진행률 (0.0 ~ 1.0)
    double progress = (_currentIndex + 1) / widget.quizList.length;

    return Scaffold(
      appBar: AppBar(
        title: Text("퀴즈 (${_currentIndex + 1}/${widget.quizList.length})"),
        leading: IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 진행바
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: LinearProgressIndicator(
                value: progress,
                backgroundColor: Colors.grey[200],
                color: const Color(0xFF8B5CF6),
                minHeight: 10,
              ),
            ),
            const SizedBox(height: 30),
            
            // 질문
            const Text("Q. 핵심 개념 체크", style: TextStyle(color: Color(0xFF8B5CF6), fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text(question, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, height: 1.4)),
            const SizedBox(height: 30),

            // 보기 리스트 (스크롤 가능하게)
            Expanded(
              child: ListView.separated(
                itemCount: options.length,
                separatorBuilder: (context, index) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  bool isSelected = _selectedOptionIndex == index;
                  
                  // 색상 로직:
                  // 확인 전: 선택하면 보라색
                  // 확인 후: 정답이면 초록, 내가 틀린 거 고르면 빨강
                  Color borderColor = Colors.grey.shade300;
                  Color bgColor = Colors.white;
                  IconData? icon;

                  if (_isChecked) {
                    if (index == correctAnswerIndex) {
                      borderColor = Colors.green;
                      bgColor = Colors.green.shade50;
                      icon = Icons.check_circle;
                    } else if (isSelected && index != correctAnswerIndex) {
                      borderColor = Colors.red;
                      bgColor = Colors.red.shade50;
                      icon = Icons.cancel;
                    }
                  } else if (isSelected) {
                    borderColor = const Color(0xFF8B5CF6);
                    bgColor = const Color(0xFFF3E8FF);
                  }

                  return GestureDetector(
                    onTap: _isChecked ? null : () { // 확인 후에는 선택 불가
                      setState(() { _selectedOptionIndex = index; });
                    },
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: bgColor,
                        border: Border.all(color: borderColor, width: 2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              options[index],
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                color: Colors.black87,
                              ),
                            ),
                          ),
                          if (_isChecked && (index == correctAnswerIndex || (isSelected && index != correctAnswerIndex)))
                            Icon(icon, color: index == correctAnswerIndex ? Colors.green : Colors.red),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            // 하단 버튼 (확인하기 -> 다음 문제)
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _selectedOptionIndex == -1 
                  ? null // 선택 안 했으면 비활성
                  : (_isChecked && _isCorrect ? _nextQuestion : _checkAnswer), // 정답이면 다음, 아니면 확인
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8B5CF6),
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: Colors.grey[300],
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: Text(
                  _isChecked && _isCorrect 
                    ? (_currentIndex == widget.quizList.length - 1 ? "완료하고 결과 보기" : "다음 문제")
                    : "정답 확인하기",
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}