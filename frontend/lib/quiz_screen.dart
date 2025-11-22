import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart'; // 저장소

class QuizScreen extends StatefulWidget {
  final Map<String, dynamic> quizData;

  const QuizScreen({super.key, required this.quizData});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int _selectedOptionIndex = -1;
  bool _isSubmitted = false;

  // 정답 확인 및 서버 전송 함수
  Future<void> _checkAnswer() async {
    setState(() { _isSubmitted = true; });

    int correctAnswerIndex = widget.quizData['answerIndex'];

    if (_selectedOptionIndex == correctAnswerIndex) {
      // 🎉 정답! -> 서버에 점수 추가 요청
      await _submitProgress(50); 
      
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🎉 정답입니다! +50 XP 획득!'), backgroundColor: Colors.green),
      );
    } else {
      // 😢 오답
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('😢 오답입니다. 다시 공부해보세요!'), backgroundColor: Colors.redAccent),
      );
    }
  }

  // 서버 API 호출 함수
  Future<void> _submitProgress(int xp) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) return; // 로그안 안했으면 무시 (혹은 로그인 유도)

    String baseUrl;
    if (kIsWeb) baseUrl = 'http://localhost:3000';
    else if (Platform.isAndroid) baseUrl = 'http://10.0.2.2:3000';
    else baseUrl = 'http://localhost:3000';

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/user/progress'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token" // 🔑 출입증 제시
        },
        body: jsonEncode({
          "xpEarned": xp,
          // "lessonId": ... (나중에 레슨 ID도 넘겨주면 완료 처리 가능)
        }),
      );
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print("XP 업데이트 완료: 현재 레벨 ${data['currentLevel']}, XP ${data['currentXp']}");
        if (data['leveledUp'] == true) {
           ScaffoldMessenger.of(context).showSnackBar(
             SnackBar(content: Text('🆙 축하합니다! 레벨 ${data['currentLevel']}로 올랐습니다!'), backgroundColor: Colors.blue),
           );
        }
      }
    } catch (e) {
      print("XP 업데이트 실패: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    // ... (UI 코드는 기존과 동일하므로 생략하거나, 
    //     아까 작성한 파일의 build 메서드 내용을 그대로 쓰세요)
    //     편의를 위해 아래에 build 메서드까지 포함해 드릴까요? -> 네, 안전하게 포함합니다.
    
    String question = widget.quizData['question'];
    List<dynamic> options = widget.quizData['options'];
    int correctAnswerIndex = widget.quizData['answerIndex'];

    return Scaffold(
      appBar: AppBar(
        title: const Text("오늘의 퀴즈"),
        leading: IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            LinearProgressIndicator(value: 1.0, backgroundColor: Colors.grey[200], color: const Color(0xFF8B5CF6), borderRadius: BorderRadius.circular(10)),
            const SizedBox(height: 30),
            const Text("Q. 핵심 개념 체크", style: TextStyle(color: Color(0xFF8B5CF6), fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text(question, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, height: 1.4)),
            const SizedBox(height: 40),
            ...List.generate(options.length, (index) {
              bool isSelected = _selectedOptionIndex == index;
              bool isCorrect = index == correctAnswerIndex;
              Color borderColor = Colors.grey.shade300;
              Color bgColor = Colors.white;
              IconData? icon;
              if (_isSubmitted) {
                if (isCorrect) { borderColor = Colors.green; bgColor = Colors.green.shade50; icon = Icons.check_circle; }
                else if (isSelected && !isCorrect) { borderColor = Colors.red; bgColor = Colors.red.shade50; icon = Icons.cancel; }
              } else if (isSelected) { borderColor = const Color(0xFF8B5CF6); bgColor = const Color(0xFFF3E8FF); }

              return GestureDetector(
                onTap: _isSubmitted ? null : () { setState(() { _selectedOptionIndex = index; }); },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: bgColor, border: Border.all(color: borderColor, width: 2), borderRadius: BorderRadius.circular(12)),
                  child: Row(
                    children: [
                      Text(options[index], style: TextStyle(fontSize: 16, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal, color: Colors.black87)),
                      const Spacer(),
                      if (_isSubmitted && (isCorrect || (isSelected && !isCorrect))) Icon(icon, color: isCorrect ? Colors.green : Colors.red),
                    ],
                  ),
                ),
              );
            }),
            const Spacer(),
            SizedBox(
              width: double.infinity, height: 56,
              child: ElevatedButton(
                onPressed: (_selectedOptionIndex == -1 || _isSubmitted) ? null : _checkAnswer,
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF8B5CF6), foregroundColor: Colors.white, disabledBackgroundColor: Colors.grey[300], shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
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