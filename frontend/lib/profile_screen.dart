import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String nickname = "로딩중...";
  String email = "";
  int level = 1;
  int xp = 0;
  int streak = 0;
  List<String> studyHistory = []; // 공부한 날짜들 ("2024-05-20")
  bool isLoading = true;
  bool _isAdminMode = false;

  @override
  void initState() {
    super.initState();
    _loadAdminMode();
    _fetchUserProfile();
  }

  Future<void> _loadAdminMode() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _isAdminMode = prefs.getBool('isAdminMode') ?? false;
    });
  }

  Future<void> _toggleAdminMode(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isAdminMode', value);
    setState(() { _isAdminMode = value; });
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(value ? '🔓 관리자 모드 ON' : '🔒 관리자 모드 OFF')));
  }

  Future<void> _fetchUserProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) {
      _logout();
      return;
    }

    String baseUrl;
    if (kIsWeb) baseUrl = 'http://localhost:3000';
    else if (Platform.isAndroid) baseUrl = 'http://10.0.2.2:3000';
    else baseUrl = 'http://localhost:3000';

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/user/me'),
        headers: {"Authorization": "Bearer $token"},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          nickname = data['nickname'];
          email = data['email'];
          level = data['level'];
          xp = data['xp'];
          streak = data['streak'] ?? 0;
          studyHistory = List<String>.from(data['studyHistory'] ?? []);
          isLoading = false;
        });
      } else {
        _logout();
      }
    } catch (e) {
      print("프로필 로딩 실패: $e");
      setState(() { isLoading = false; });
    }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    if (!mounted) return;
    Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => const LoginScreen()), (route) => false);
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    // 다음 레벨까지 필요한 XP 계산 (예: 레벨 * 100)
    int requiredXp = level * 100;
    // 현재 레벨에서의 진행도 (단순화를 위해 누적 XP가 아니라 현재 레벨 구간 XP로 표시하는 게 좋지만, 여기선 전체 XP 기준)
    // UI 표시용: (현재XP % 100) / 100
    double progress = (xp % 100) / 100.0; 

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FD),
      appBar: AppBar(
        title: const Text('내 프로필', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 30),
            
            // 1. 유저 정보 및 레벨 바
            Center(
              child: Column(
                children: [
                  Stack(
                    alignment: Alignment.bottomRight,
                    children: [
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.grey[200],
                          border: Border.all(color: const Color(0xFF8B5CF6), width: 3),
                          image: DecorationImage(
                            image: NetworkImage('https://api.dicebear.com/7.x/avataaars/png?seed=$nickname'),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(color: Colors.blue, shape: BoxShape.circle),
                        child: Text('$level', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(nickname, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(email, style: const TextStyle(fontSize: 14, color: Colors.grey)),
                  
                  const SizedBox(height: 20),
                  
                  // XP 프로그레스 바
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Lv.$level', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF8B5CF6))),
                            Text('${xp % 100} / 100 XP', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                            Text('Lv.${level + 1}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: LinearProgressIndicator(
                            value: progress,
                            minHeight: 12,
                            backgroundColor: Colors.grey[200],
                            color: const Color(0xFF8B5CF6),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 30),

            // 2. 스트릭 캘린더 (주간)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.05), blurRadius: 10, spreadRadius: 2)],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.local_fire_department, color: Colors.orange),
                      const SizedBox(width: 8),
                      Text('$streak일 연속 학습 중! 🔥', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: _buildWeeklyCalendar(),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // 3. 메뉴 리스트 (기존)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
              child: Column(
                children: [
                  SwitchListTile(
                    secondary: const Icon(Icons.admin_panel_settings, color: Colors.redAccent),
                    title: const Text('관리자 모드 (시연용)', style: TextStyle(fontWeight: FontWeight.bold)),
                    value: _isAdminMode,
                    activeColor: const Color(0xFF8B5CF6),
                    onChanged: _toggleAdminMode,
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.logout, color: Colors.red),
                    title: const Text('로그아웃', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                    onTap: _logout,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  // 주간 캘린더 위젯 생성 함수
  List<Widget> _buildWeeklyCalendar() {
    List<String> weekDays = ['월', '화', '수', '목', '금', '토', '일'];
    DateTime now = DateTime.now();
    // 이번 주 월요일 날짜 계산
    DateTime monday = now.subtract(Duration(days: now.weekday - 1));

    return List.generate(7, (index) {
      DateTime day = monday.add(Duration(days: index));
      String dateStr = day.toISOString().split('T')[0]; // "2024-05-21"
      bool isActive = studyHistory.contains(dateStr);
      bool isToday = dateStr == now.toISOString().split('T')[0];

      return Column(
        children: [
          Text(weekDays[index], style: TextStyle(color: isToday ? const Color(0xFF8B5CF6) : Colors.grey, fontWeight: isToday ? FontWeight.bold : FontWeight.normal)),
          const SizedBox(height: 8),
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: isActive ? Colors.orange : (isToday ? Colors.orange.withOpacity(0.2) : Colors.grey[200]),
              shape: BoxShape.circle,
              border: isToday ? Border.all(color: Colors.orange, width: 2) : null,
            ),
            child: isActive ? const Icon(Icons.check, color: Colors.white, size: 20) : null,
          ),
        ],
      );
    });
  }
}

// DateTime 확장 (toISOString이 Dart 기본엔 없어서 간단 구현)
extension DateTimeExtension on DateTime {
  String toISOString() {
    return "${year.toString().padLeft(4, '0')}-${month.toString().padLeft(2, '0')}-${day.toString().padLeft(2, '0')}T00:00:00.000Z";
  }
}