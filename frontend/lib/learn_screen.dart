import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart'; // kIsWeb 사용을 위해
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'course_detail_screen.dart';
import 'lesson_screen.dart'; // 배너 클릭 시 바로 학습 화면으로 가기 위해

class LearnScreen extends StatefulWidget {
  const LearnScreen({super.key});

  @override
  State<LearnScreen> createState() => _LearnScreenState();
}

class _LearnScreenState extends State<LearnScreen> {
  late Future<List<dynamic>> courseList;
  Map<String, dynamic>? nextLessonData; // 이어서 학습할 데이터
  bool isLoadingNextLesson = true;

  @override
  void initState() {
    super.initState();
    courseList = fetchCourses(); // 코스 목록 로딩
    _fetchNextLesson(); // 다음 강의 정보 로딩
  }

  // 1. 다음 강의 정보 가져오기 API (이어서 학습하기)
  Future<void> _fetchNextLesson() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    
    // 로그인을 안 했으면 배너를 로딩하지 않음
    if (token == null) {
      setState(() { isLoadingNextLesson = false; });
      return;
    }

    String baseUrl = _getBaseUrl();
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/user/next-lesson'),
        headers: {"Authorization": "Bearer $token"},
      );
      
      if (response.statusCode == 200) {
        setState(() {
          nextLessonData = jsonDecode(response.body);
          isLoadingNextLesson = false;
        });
      } else {
        setState(() { isLoadingNextLesson = false; });
      }
    } catch (e) {
      print("다음 강의 로딩 실패: $e");
      setState(() { isLoadingNextLesson = false; });
    }
  }

  // 2. 전체 코스 목록 가져오기 API
  Future<List<dynamic>> fetchCourses() async {
    String baseUrl = _getBaseUrl();
    final url = Uri.parse('$baseUrl/api/courses');
    
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('강의 목록을 불러오지 못했습니다.');
      }
    } catch (e) {
      throw Exception('서버 연결 실패: $e');
    }
  }

  // 3. 아이콘 이름 문자열 -> Flutter IconData 변환
  IconData getIconData(String iconName) {
    switch (iconName) {
      case 'account_balance': return Icons.account_balance;
      case 'show_chart': return Icons.show_chart;
      case 'apartment': return Icons.apartment;
      case 'currency_bitcoin': return Icons.currency_bitcoin;
      case 'shield': return Icons.shield;
      case 'public': return Icons.public;
      default: return Icons.book;
    }
  }

  // 4. Base URL 도우미 함수
  String _getBaseUrl() {
    if (kIsWeb) return 'http://localhost:3000';
    if (Platform.isAndroid) return 'http://10.0.2.2:3000';
    return 'http://localhost:3000';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FD),
      appBar: AppBar(
        title: const Text(
          '경제 학습소 🎓',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. 검색창
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: const TextField(
                decoration: InputDecoration(
                  border: InputBorder.none,
                  icon: Icon(Icons.search, color: Colors.grey),
                  hintText: '배우고 싶은 개념을 검색해보세요',
                  hintStyle: TextStyle(color: Colors.grey),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // 2. 이어서 학습하기 배너
            const Text(
              '이어서 학습하기',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            _buildContinueCard(),

            const SizedBox(height: 30),

            // 3. 분야별 학습 그리드
            const Text(
              '분야별 학습',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            FutureBuilder<List<dynamic>>(
              future: courseList,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return const Center(child: Text('데이터를 불러올 수 없습니다.'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('강의 목록이 없습니다.'));
                }

                final courses = snapshot.data!;

                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 1.1,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                  ),
                  itemCount: courses.length,
                  itemBuilder: (context, index) {
                    var course = courses[index];
                    // Hex String -> Color 변환
                    String hexColor = course['colorHex'] ?? '0xFF2196F3';
                    Color cardColor = Color(int.parse(hexColor));
                    
                    return CategoryCard(
                      icon: getIconData(course['iconName'] ?? 'book'),
                      color: cardColor,
                      title: course['title'] ?? '제목 없음',
                      count: '${course['totalLectures']}강',
                      onTap: () async {
                        // 상세 화면으로 이동 (돌아올 때까지 대기)
                        await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => CourseDetailScreen(
                              courseId: course['_id'],
                              title: course['title'],
                              color: cardColor,
                            ),
                          ),
                        );
                        // 상세 화면에서 퀴즈를 풀고 왔을 수 있으니, 배너를 새로고침
                        _fetchNextLesson();
                      },
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  // 이어서 학습하기 카드 위젯
  Widget _buildContinueCard() {
    if (isLoadingNextLesson) {
      return const SizedBox(height: 150, child: Center(child: CircularProgressIndicator()));
    }

    // 학습할 데이터가 없거나, 로그인을 안 한 경우
    if (nextLessonData == null || nextLessonData!['hasLesson'] == false) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "학습 기록이 없거나\n모든 강의를 완료했습니다! 🎉",
              style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              nextLessonData != null ? "새로운 강의를 선택해보세요." : "로그인 후 학습을 시작해보세요.",
              style: const TextStyle(color: Colors.black54),
            ),
          ],
        ),
      );
    }

    // 학습할 데이터가 있는 경우
    var lesson = nextLessonData!['lesson'];
    String courseTitle = nextLessonData!['courseTitle'];
    Color color = Color(int.parse(nextLessonData!['courseColor']));

    return GestureDetector(
      onTap: () async {
        // 배너 클릭 시 바로 해당 레슨 화면으로 이동
        await Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => LessonScreen(lessonData: lesson)),
        );
        // 돌아오면 배너 갱신 (다음 챕터로 바뀌어야 하니까)
        _fetchNextLesson();
      },
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [color, color.withOpacity(0.7)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.3),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.play_arrow, color: Colors.white),
                ),
                const SizedBox(width: 12),
                Text(
                  courseTitle,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const Spacer(),
                const Text(
                  'Start',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Text(
              'Chapter ${lesson['chapterIndex']}. ${lesson['title']}',
              style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              '터치하여 바로 시작하기',
              style: TextStyle(color: Colors.white70, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }
}

// 카테고리 카드 위젯 (수정된 버전)
class CategoryCard extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String count;
  final VoidCallback onTap; // 클릭 이벤트를 받기 위해 추가

  const CategoryCard({
    super.key,
    required this.icon,
    required this.color,
    required this.title,
    required this.count,
    required this.onTap, // 생성자 필수값
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 32),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text(
                count,
                style: const TextStyle(color: Colors.grey, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }
}