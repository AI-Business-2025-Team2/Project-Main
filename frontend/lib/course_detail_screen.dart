import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'lesson_screen.dart';

class CourseDetailScreen extends StatefulWidget {
  final String courseId; // 받아온 코스 ID
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
  List<String> completedLessonIds = []; // 완료한 레슨 ID 목록
  int totalLessonsCount = 0; // 총 강의 수 (진도율 계산용)
  int myCompletedCountInThisCourse = 0; // 이 코스에서 완료한 수

  @override
  void initState() {
    super.initState();
    lessonList = fetchLessons(); // 강의 목록 로딩
    _fetchMyProgress(); // 내 진도 로딩
  }

  // 1. 서버에서 챕터(Lesson) 목록 가져오기
  Future<List<dynamic>> fetchLessons() async {
    String baseUrl = _getBaseUrl();

    // API 호출: /api/courses/:id/lessons
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

  // 2. 내 정보(완료한 강의 목록) 가져오기
  Future<void> _fetchMyProgress() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) return;

    String baseUrl = _getBaseUrl();

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/user/me'),
        headers: {"Authorization": "Bearer $token"},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          // 서버에서 받은 완료 리스트 저장
          completedLessonIds = List<String>.from(data['completedLessons']);
        });
        _calculateProgress(); // 진도율 재계산
      }
    } catch (e) {
      print("진도 로딩 실패: $e");
    }
  }

  // 진도율 계산 (현재 코스 기준)
  void _calculateProgress() async {
    // lessonList가 완료된 후에 계산해야 정확함
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

  // Base URL 도우미 함수
  String _getBaseUrl() {
    if (kIsWeb) return 'http://localhost:3000';
    if (Platform.isAndroid) return 'http://10.0.2.2:3000';
    return 'http://localhost:3000';
  }

  @override
  Widget build(BuildContext context) {
    // 진도율 퍼센트 계산 (0.0 ~ 1.0)
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
      ),
      body: Column(
        children: [
          // 상단 헤더 (진행도 표시)
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
                // 진행바
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

          // 챕터 리스트 (서버 데이터 + 잠금 로직)
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

                    // ✅ 잠금 해제 로직 구현
                    // 1. 현재 강의가 완료되었는지?
                    bool isCompleted = completedLessonIds.contains(lessonId);
                    
                    // 2. 잠겨있는지?
                    // 첫 번째 강의(index 0)는 무조건 열림.
                    // 그 이후 강의는 "바로 앞 강의"가 완료 목록에 있어야 열림.
                    bool isLocked = false;
                    if (index > 0) {
                      String prevLessonId = lessons[index - 1]['_id'];
                      if (!completedLessonIds.contains(prevLessonId)) {
                        isLocked = true;
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
                            // 잠기면 회색, 아니면 주제색(연하게)
                            color: isLocked ? Colors.grey[200] : widget.color.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            // 아이콘 결정: 완료(체크) > 잠김(자물쇠) > 진행가능(재생)
                            isCompleted ? Icons.check : (isLocked ? Icons.lock : Icons.play_arrow),
                            color: isCompleted ? Colors.green : (isLocked ? Colors.grey : widget.color),
                          ),
                        ),
                        title: Text(
                          'Chapter ${lesson['chapterIndex']}. ${lesson['title']}',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: isLocked ? Colors.grey : Colors.black, // 잠기면 흐리게
                          ),
                        ),
                        subtitle: Text(
                          lesson['duration'] ?? '10분',
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                        trailing: isLocked 
                          ? null // 잠기면 화살표 없음
                          : const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                        
                        onTap: isLocked 
                          ? () {
                              // 잠긴 강의 클릭 시
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('🔒 이전 강의를 먼저 학습해주세요!')),
                              );
                            } 
                          : () async {
                              // 열린 강의 클릭 시 -> 학습 화면으로 이동
                              // await를 써서 학습을 마치고 돌아올 때까지 기다림
                              await Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => LessonScreen(lessonData: lesson),
                                ),
                              );
                              // 돌아오면 진도 정보를 다시 서버에서 가져와 화면 갱신 (체크 표시 등)
                              _fetchMyProgress();
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