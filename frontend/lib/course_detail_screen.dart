import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'lesson_screen.dart';

class CourseDetailScreen extends StatefulWidget {
  final String courseId;
  final String title;
  final Color color;

  const CourseDetailScreen({
    super.key,
    required this.courseId,
    required this.title,
    required this.color,
  });

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  late Future<List<dynamic>> lessonList;
  List<String> completedLessonIds = [];
  int totalLessonsCount = 0;
  int myCompletedCountInThisCourse = 0;
  
  // 관리자 모드 변수
  bool _isAdminMode = false;

  @override
  void initState() {
    super.initState();
    lessonList = fetchLessons();
    _loadAllSettings(); // 설정과 진도를 한 번에 로딩
  }

  // 통합 로딩 함수
  Future<void> _loadAllSettings() async {
    final prefs = await SharedPreferences.getInstance();
    
    // 1. 관리자 모드 확인
    bool admin = prefs.getBool('isAdminMode') ?? false;
    print("🔓 관리자 모드 상태: $admin"); // 터미널 로그 확인용

    // 2. 내 진도 확인
    final token = prefs.getString('token');
    List<String> completed = [];
    
    if (token != null) {
      String baseUrl = _getBaseUrl();
      try {
        final response = await http.get(
          Uri.parse('$baseUrl/api/user/me'),
          headers: {"Authorization": "Bearer $token"},
        );
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          completed = List<String>.from(data['completedLessons']);
        }
      } catch (e) {
        print("진도 로딩 실패: $e");
      }
    }

    // 3. 상태 업데이트 (화면 갱신)
    if (mounted) {
      setState(() {
        _isAdminMode = admin;
        completedLessonIds = completed;
      });
      _calculateProgress();
    }
  }

  // 강의 목록 API
  Future<List<dynamic>> fetchLessons() async {
    String baseUrl = _getBaseUrl();
    final url = Uri.parse('$baseUrl/api/courses/${widget.courseId}/lessons');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      setState(() {
        totalLessonsCount = data.length;
      });
      return data;
    } else {
      throw Exception('강의 목록을 불러오지 못했습니다.');
    }
  }

  void _calculateProgress() async {
    final lessons = await lessonList;
    int count = 0;
    for (var lesson in lessons) {
      if (completedLessonIds.contains(lesson['_id'])) {
        count++;
      }
    }
    setState(() {
      myCompletedCountInThisCourse = count;
    });
  }

  String _getBaseUrl() {
    if (kIsWeb) return 'http://localhost:3000';
    if (Platform.isAndroid) return 'http://10.0.2.2:3000';
    return 'http://localhost:3000';
  }

  @override
  Widget build(BuildContext context) {
    double progressPercent = totalLessonsCount == 0 ? 0 : myCompletedCountInThisCourse / totalLessonsCount;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FD),
      appBar: AppBar(
        backgroundColor: widget.color,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(widget.title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        actions: [
          // (선택사항) 관리자 모드인지 상단에 작게 표시
          if (_isAdminMode)
            const Padding(
              padding: EdgeInsets.only(right: 16.0),
              child: Center(child: Text("ADMIN ON", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
            )
        ],
      ),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 30),
            decoration: BoxDecoration(
              color: widget.color,
              borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(30), bottomRight: Radius.circular(30)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('나의 학습 진행도', style: TextStyle(color: Colors.white70, fontSize: 14)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(
                      '$myCompletedCountInThisCourse/$totalLessonsCount 강 완료',
                      style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                      child: Text('${(progressPercent * 100).toInt()}%', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: LinearProgressIndicator(
                    value: progressPercent,
                    backgroundColor: Colors.black.withOpacity(0.1),
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                    minHeight: 8,
                  ),
                ),
              ],
            ),
          ),

          Expanded(
            child: FutureBuilder<List<dynamic>>(
              future: lessonList,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('오류: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('등록된 강의가 없습니다.'));
                }

                final lessons = snapshot.data!;

                return ListView.builder(
                  padding: const EdgeInsets.all(20),
                  itemCount: lessons.length,
                  itemBuilder: (context, index) {
                    var lesson = lessons[index];
                    String lessonId = lesson['_id'];

                    bool isCompleted = completedLessonIds.contains(lessonId);
                    
                    // 🔐 잠금 로직 (핵심 부분)
                    bool isLocked = false;
                    
                    // 관리자 모드가 아닐 때만 잠금 체크 수행
                    if (!_isAdminMode) {
                      if (index > 0) {
                        String prevLessonId = lessons[index - 1]['_id'];
                        if (!completedLessonIds.contains(prevLessonId)) {
                          isLocked = true;
                        }
                      }
                    }

                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.05), blurRadius: 10, spreadRadius: 2)],
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                        leading: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: isLocked ? Colors.grey[200] : widget.color.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            isCompleted ? Icons.check : (isLocked ? Icons.lock : Icons.play_arrow),
                            color: isCompleted ? Colors.green : (isLocked ? Colors.grey : widget.color),
                          ),
                        ),
                        title: Text(
                          'Chapter ${lesson['chapterIndex']}. ${lesson['title']}',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: isLocked ? Colors.grey : Colors.black,
                          ),
                        ),
                        subtitle: Text(
                          lesson['duration'] ?? '10분',
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                        trailing: isLocked 
                          ? null 
                          : const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                        
                        onTap: isLocked 
                          ? () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('🔒 이전 강의를 먼저 학습해주세요!')),
                              );
                            } 
                          : () async {
                              await Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => LessonScreen(lessonData: lesson),
                                ),
                              );
                              _loadAllSettings(); // 돌아오면 진도 새로고침
                            },
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}