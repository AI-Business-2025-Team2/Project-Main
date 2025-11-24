import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'login_screen.dart'; // 로그아웃 후 이동할 화면

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  // 화면에 표시할 상태 변수들 (초기값)
  String nickname = "로딩중...";
  String email = "";
  int level = 1;
  int xp = 0;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchUserProfile(); // 화면 켜지면 내 정보 가져오기
  }

  // 📡 내 정보 가져오기 (API)
  Future<void> _fetchUserProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) {
      // 토큰 없으면 로그인 화면으로 쫓아냄
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
        headers: {
          "Authorization": "Bearer $token", // 🔑 출입증 제시
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          nickname = data['nickname'];
          email = data['email'];
          level = data['level'];
          xp = data['xp'];
          isLoading = false;
        });
      } else {
        // 토큰 만료 등으로 실패 시
        _logout();
      }
    } catch (e) {
      print("프로필 로딩 실패: $e");
      setState(() { isLoading = false; });
    }
  }

  // 🚪 로그아웃 함수
  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token'); // 토큰 삭제
    
    if (!mounted) return;
    // 로그인 화면으로 이동 (뒤로가기 불가)
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => const LoginScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FD),
      appBar: AppBar(
        title: const Text('내 프로필', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: false,
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () {
              // 설정 화면 (추후 구현)
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 20),
            
            // 1. 유저 정보 섹션
            Center(
              child: Column(
                children: [
                  // 아바타 (랜덤 이미지 API 활용, 시드값을 닉네임으로 해서 고정된 이미지 제공)
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.grey[200],
                      border: Border.all(color: const Color(0xFF8B5CF6), width: 3),
                      image: DecorationImage(
                        // 닉네임에 따라 다른 캐릭터가 나오도록 URL 설정
                        image: NetworkImage('https://api.dicebear.com/7.x/avataaars/png?seed=$nickname'),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // 닉네임 (DB 데이터)
                  Text(
                    nickname,
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    email,
                    style: const TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 12),
                  // 레벨 뱃지 (DB 데이터)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3E8FF),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      'Lv. $level 초보 투자자 🐣',
                      style: const TextStyle(
                        color: Color(0xFF7C3AED),
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 30),

            // 2. 게이미피케이션 스탯 (DB 데이터)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _buildStatCard('연속 학습', '3일', Icons.local_fire_department, Colors.orange), // (나중에 streak 연동)
                  const SizedBox(width: 12),
                  _buildStatCard('총 경험치', '$xp XP', Icons.bolt, Colors.yellow[700]!),
                  const SizedBox(width: 12),
                  _buildStatCard('학습 레벨', '$level', Icons.stars, Colors.blue),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // 3. 메뉴 리스트
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(color: Colors.grey.withOpacity(0.05), blurRadius: 10, spreadRadius: 2),
                ],
              ),
              child: Column(
                children: [
                  _buildListTile(Icons.favorite_border, '관심 키워드 설정', '반도체, 부동산'),
                  const Divider(height: 1, thickness: 0.5),
                  _buildListTile(Icons.history, '최근 학습 기록', ''),
                  const Divider(height: 1, thickness: 0.5),
                  _buildListTile(Icons.notifications_none, '알림 설정', 'ON'),
                ],
              ),
            ),
            
            const SizedBox(height: 30),
            
            // 로그아웃 버튼
            TextButton(
              onPressed: _logout,
              child: const Text(
                '로그아웃',
                style: TextStyle(color: Colors.redAccent, fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.grey.withOpacity(0.05), blurRadius: 10, spreadRadius: 2),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 4),
            Text(label, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildListTile(IconData icon, String title, String trailingText) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(color: const Color(0xFFF8F9FD), borderRadius: BorderRadius.circular(8)),
        child: Icon(icon, color: const Color(0xFF8B5CF6), size: 20),
      ),
      title: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (trailingText.isNotEmpty) Text(trailingText, style: const TextStyle(color: Colors.grey, fontSize: 14)),
          const SizedBox(width: 8),
          const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
        ],
      ),
      onTap: () {},
    );
  }
}