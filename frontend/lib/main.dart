import 'dart:convert'; // JSON 변환용
import 'dart:io';      // OS 확인용 (Android vs iOS)
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http; // 방금 설치한 http 패키지
import 'quiz_screen.dart'; // 퀴즈 화면

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI News App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF8B5CF6)),
        scaffoldBackgroundColor: const Color(0xFFF8F9FD),
        useMaterial3: true,
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const HomeNewsFeed(), 
    const Center(child: Text('학습 화면 준비중')),
    const Center(child: Text('복습 화면 준비중')),
    const Center(child: Text('프로필 화면 준비중')),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: _screens[_selectedIndex],
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        selectedItemColor: const Color(0xFF8B5CF6),
        unselectedItemColor: Colors.grey,
        onTap: (index) => setState(() => _selectedIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_filled), label: '홈'),
          BottomNavigationBarItem(icon: Icon(Icons.book), label: '학습'),
          BottomNavigationBarItem(icon: Icon(Icons.star), label: '복습'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '프로필'),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------
// 📡 서버 통신 로직이 추가된 뉴스 피드
// ---------------------------------------------------------
class HomeNewsFeed extends StatefulWidget {
  const HomeNewsFeed({super.key});

  @override
  State<HomeNewsFeed> createState() => _HomeNewsFeedState();
}

class _HomeNewsFeedState extends State<HomeNewsFeed> {
  // 뉴스 데이터를 저장할 변수 (Future)
  late Future<List<dynamic>> newsList;

  @override
  void initState() {
    super.initState();
    newsList = fetchNews(); // 앱이 켜지면 데이터 가져오기 시작!
  }

  // 서버에서 뉴스 가져오는 함수 (수정됨)
  Future<List<dynamic>> fetchNews() async {
    String baseUrl;

    // 1. 웹 브라우저인지 먼저 확인 (순서 중요!)
    if (kIsWeb) {
      baseUrl = 'http://localhost:3000';
    } 
    // 2. 웹이 아니라면 모바일(Android)인지 확인
    else if (Platform.isAndroid) {
      baseUrl = 'http://10.0.2.2:3000'; 
    } 
    // 3. 그 외 (iOS, 데스크탑 등)
    else {
      baseUrl = 'http://localhost:3000';
    }
    
    final url = Uri.parse('$baseUrl/api/news');
    
    print('📡 서버에 요청 보냄: $url');

    final response = await http.get(url);

    if (response.statusCode == 200) {
      print('✅ 데이터 수신 성공!');
      return json.decode(response.body);
    } else {
      throw Exception('데이터를 불러오는데 실패했습니다.');
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 상단 헤더
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('오늘의 경제 뉴스 ✨', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text('뉴스로 배우는 경제 공부! 📚', style: TextStyle(fontSize: 14, color: Colors.grey)),
                ],
              ),
              Row(
                children: [
                  IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_none)),
                  IconButton(onPressed: () {}, icon: const Icon(Icons.settings_outlined)),
                ],
              )
            ],
          ),
          const SizedBox(height: 20),

          // 🔥 FutureBuilder: 데이터를 기다렸다가 화면을 그려주는 위젯
          FutureBuilder<List<dynamic>>(
            future: newsList,
            builder: (context, snapshot) {
              // 1. 로딩 중일 때
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              // 2. 에러 났을 때
              else if (snapshot.hasError) {
                return Center(child: Text('에러 발생: ${snapshot.error}'));
              }
              // 3. 데이터가 없을 때
              else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                return const Center(child: Text('뉴스가 없습니다.'));
              }

              // 4. 데이터 도착! (리스트로 보여주기)
              final news = snapshot.data!;
              return ListView.separated(
                physics: const NeverScrollableScrollPhysics(), // 스크롤은 전체 화면에 맡김
                shrinkWrap: true, // 내용물만큼만 공간 차지
                itemCount: news.length,
                separatorBuilder: (context, index) => const SizedBox(height: 16),
                itemBuilder: (context, index) {
                  var item = news[index];
                  return NewsCard(
                    category: item['category'] ?? '뉴스',
                    source: item['source'] ?? '언론사',
                    time: item['time'] ?? '방금 전',
                    title: item['title'] ?? '제목 없음',
                    summary: item['summary'] ?? '내용 없음',
                    tags: List<String>.from(item['tags'] ?? []),
                    showButton: index == 0, // 첫 번째 뉴스에만 버튼 표시 (예시)
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }
}

// 뉴스 카드 위젯 (디자인 그대로 유지)
class NewsCard extends StatelessWidget {
  final String category;
  final String source;
  final String time;
  final String title;
  final String summary;
  final List<String> tags;
  final bool showButton;

  const NewsCard({
    super.key,
    required this.category,
    required this.source,
    required this.time,
    required this.title,
    required this.summary,
    required this.tags,
    this.showButton = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3E8FF),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(category, style: const TextStyle(color: Color(0xFF8B5CF6), fontWeight: FontWeight.bold, fontSize: 12)),
              ),
              const SizedBox(width: 8),
              Text('$source · $time', style: const TextStyle(color: Colors.grey, fontSize: 12)),
              const Spacer(),
              const Text('📈 인기', style: TextStyle(color: Colors.orange, fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, height: 1.3)),
          const SizedBox(height: 8),
          Text(summary, style: TextStyle(fontSize: 14, color: Colors.grey[700], height: 1.5), maxLines: 3, overflow: TextOverflow.ellipsis),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: tags.map((tag) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(color: const Color(0xFFF3E8FF), borderRadius: BorderRadius.circular(20)),
              child: Text(tag, style: const TextStyle(color: Color(0xFF7C3AED), fontSize: 12)),
            )).toList(),
          ),
          if (showButton) ...[
            const SizedBox(height: 20),
            Container(
              width: double.infinity,
              height: 50,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFAC55FF), Color(0xFFFF4F8B)]),
                borderRadius: BorderRadius.circular(25),
              ),
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => const QuizScreen()));
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.auto_awesome, color: Colors.white, size: 20),
                    SizedBox(width: 8),
                    Text('학습 시작하고 50 XP 받기', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                    SizedBox(width: 4),
                    Icon(Icons.favorite_border, color: Colors.white, size: 20),
                  ],
                ),
              ),
            ),
          ]
        ],
      ),
    );
  }
}