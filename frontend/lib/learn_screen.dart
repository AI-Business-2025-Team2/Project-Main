import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart'; // kIsWeb 용
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'course_detail_screen.dart';

class LearnScreen extends StatefulWidget {
  const LearnScreen({super.key});

  @override
  State<LearnScreen> createState() => _LearnScreenState();
}

class _LearnScreenState extends State<LearnScreen> {
  late Future<List<dynamic>> courseList;

  @override
  void initState() {
    super.initState();
    courseList = fetchCourses();
  }

  // 서버에서 강의 목록 가져오기
  Future<List<dynamic>> fetchCourses() async {
    String baseUrl;
    if (kIsWeb) {
      baseUrl = 'http://localhost:3000';
    } else if (Platform.isAndroid) {
      baseUrl = 'http://10.0.2.2:3000';
    } else {
      baseUrl = 'http://localhost:3000';
    }

    final url = Uri.parse('$baseUrl/api/courses');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('강의 목록을 불러오지 못했습니다.');
    }
  }

  // 아이콘 이름(String)을 Flutter IconData로 변환하는 헬퍼 함수
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FD),
      appBar: AppBar(
        title: const Text('경제 학습소 🎓', style: TextStyle(fontWeight: FontWeight.bold)),
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
                ),
              ),
            ),
            const SizedBox(height: 24),

            // 2. 이어하기 (가장 진도가 높은 강의 하나를 보여준다고 가정)
            const Text('이어서 학습하기', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            // (이어하기 카드는 일단 정적인 UI 유지하거나, 추후 동적 연결 가능)
            _buildContinueCard(), 

            const SizedBox(height: 30),

            // 3. 분야별 학습 (서버 데이터 연동)
            const Text('분야별 학습', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            
            FutureBuilder<List<dynamic>>(
              future: courseList,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return const Text('데이터를 불러올 수 없습니다.');
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Text('강의 목록이 없습니다.');
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
                    // DB에 저장된 Hex String (ex: '0xFF...')을 Color 객체로 변환
                    Color cardColor = Color(int.parse(course['colorHex']));
                    
                    return CategoryCard(
                      icon: getIconData(course['iconName']),
                      color: cardColor,
                      title: course['title'],
                      count: '${course['totalLectures']}강',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => CourseDetailScreen(
                              courseId: course['_id'], // MongoDB ID 전달
                              title: course['title'],
                              color: cardColor,
                            ),
                          ),
                        );
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

  Widget _buildContinueCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: const Color(0xFF8B5CF6).withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(8)),
                child: const Icon(Icons.menu_book, color: Colors.white),
              ),
              const SizedBox(width: 12),
              const Text('금융 기초', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
              const Spacer(),
              const Text('45%', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 20),
          const Text('Chapter 3. 금리란 무엇인가?', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text('기준금리와 시장금리의 차이를 알아봅시다.', style: TextStyle(color: Colors.white70, fontSize: 14)),
          const SizedBox(height: 20),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: 0.45,
              backgroundColor: Colors.black.withOpacity(0.2),
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }
}

class CategoryCard extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String count;
  final VoidCallback onTap; // 👈 [추가] 클릭 이벤트를 외부에서 받기 위해 변수 추가

  const CategoryCard({
    super.key,
    required this.icon,
    required this.color,
    required this.title,
    required this.count,
    required this.onTap, // 👈 [추가] 생성자에서 필수값으로 받음
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
          onTap: onTap, // 👈 [연결] 받아온 함수를 여기서 실행!
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