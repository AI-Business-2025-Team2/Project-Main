import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // 배경색을 살짝 다르게 주어 구분감 주기
      backgroundColor: const Color(0xFFF8F9FD),
      appBar: AppBar(
        title: const Text(
          '내 프로필',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: false,
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () {
              // 설정 화면 이동 로직 (나중에 구현)
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 20),
            
            // 1. 유저 정보 섹션 (아바타 + 레벨)
            Center(
              child: Column(
                children: [
                  // 프로필 이미지 (현재는 아이콘으로 대체)
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.grey[200],
                      border: Border.all(color: const Color(0xFF8B5CF6), width: 3),
                      image: const DecorationImage(
                        image: NetworkImage('https://api.dicebear.com/7.x/avataaars/png?seed=Felix'), // 랜덤 아바타 API
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // 닉네임
                  const Text(
                    '금융마스터',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  // 레벨 뱃지
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3E8FF),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'Lv. 3 초보 투자자 🐣',
                      style: TextStyle(
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

            // 2. 게이미피케이션 스탯 (학습 현황)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _buildStatCard('연속 학습', '12일', Icons.local_fire_department, Colors.orange),
                  const SizedBox(width: 12),
                  _buildStatCard('총 경험치', '1,250 XP', Icons.bolt, Colors.yellow[700]!),
                  const SizedBox(width: 12),
                  _buildStatCard('읽은 뉴스', '45개', Icons.article_outlined, Colors.blue),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // 3. 메뉴 리스트 (설정 등)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.05),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Column(
                children: [
                  _buildListTile(Icons.favorite_border, '관심 키워드 설정', '반도체, 부동산'),
                  const Divider(height: 1, thickness: 0.5),
                  _buildListTile(Icons.history, '최근 학습 기록', ''),
                  const Divider(height: 1, thickness: 0.5),
                  _buildListTile(Icons.notifications_none, '알림 설정', 'ON'),
                  const Divider(height: 1, thickness: 0.5),
                  _buildListTile(Icons.headset_mic_outlined, '고객센터', ''),
                ],
              ),
            ),
            
            const SizedBox(height: 30),
            
            // 로그아웃 버튼
            TextButton(
              onPressed: () {},
              child: const Text(
                '로그아웃',
                style: TextStyle(color: Colors.grey, fontSize: 14),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  // 스탯 카드 위젯 (작은 네모 박스들)
  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.05),
              blurRadius: 10,
              spreadRadius: 2,
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(color: Colors.grey[600], fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }

  // 리스트 메뉴 위젯
  Widget _buildListTile(IconData icon, String title, String trailingText) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: const Color(0xFFF8F9FD),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: const Color(0xFF8B5CF6), size: 20),
      ),
      title: Text(
        title,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (trailingText.isNotEmpty)
            Text(
              trailingText,
              style: const TextStyle(color: Colors.grey, fontSize: 14),
            ),
          const SizedBox(width: 8),
          const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
        ],
      ),
      onTap: () {},
    );
  }
}