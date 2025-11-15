import 'package:flutter/material.dart';

class ReviewScreen extends StatelessWidget {
  const ReviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // 탭 메뉴(오답노트, 북마크)를 쓰기 위한 컨트롤러
    return DefaultTabController(
      length: 2, 
      child: Scaffold(
        backgroundColor: const Color(0xFFF8F9FD),
        appBar: AppBar(
          title: const Text(
            '복습 노트 📝',
            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black),
          ),
          backgroundColor: Colors.white,
          elevation: 0,
          centerTitle: false,
          // 탭바 디자인
          bottom: const TabBar(
            labelColor: Color(0xFF8B5CF6), // 선택된 탭 색상 (보라색)
            unselectedLabelColor: Colors.grey,
            indicatorColor: Color(0xFF8B5CF6),
            indicatorWeight: 3,
            tabs: [
              Tab(text: '오답 노트'),
              Tab(text: '북마크'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            // 첫 번째 탭: 오답 노트 화면
            IncorrectAnswerList(),
            // 두 번째 탭: 북마크 화면
            BookmarkList(),
          ],
        ),
      ),
    );
  }
}

// -------------------------------------------------------
// 1. 오답 노트 리스트 위젯
// -------------------------------------------------------
class IncorrectAnswerList extends StatelessWidget {
  const IncorrectAnswerList({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.all(20),
      itemCount: 3, // 예시 데이터 3개
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        return Container(
          padding: const EdgeInsets.all(20),
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
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.red[50],
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text('D-Day', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                  const SizedBox(width: 8),
                  const Text('경제 기초', style: TextStyle(color: Colors.grey, fontSize: 12)),
                  const Spacer(),
                  const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                ],
              ),
              const SizedBox(height: 12),
              const Text(
                'Q. 기준금리가 인상되면 일반적으로 주식 시장에는 어떤 영향을 미칠까요?',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, height: 1.4),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () {
                    // 퀴즈 풀기 로직 연결 가능
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF8B5CF6),
                    side: const BorderSide(color: Color(0xFF8B5CF6)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('다시 풀기'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// -------------------------------------------------------
// 2. 북마크 리스트 위젯
// -------------------------------------------------------
class BookmarkList extends StatelessWidget {
  const BookmarkList({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: 5,
      itemBuilder: (context, index) {
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
               BoxShadow(color: Colors.grey.withOpacity(0.05), blurRadius: 10, spreadRadius: 2),
            ],
          ),
          child: Row(
            children: [
              // 썸네일 (작은 네모)
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(12),
                  image: const DecorationImage(
                    image: NetworkImage('https://source.unsplash.com/random/100x100/?finance'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // 텍스트 내용
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '저장한 뉴스 제목이 들어갑니다 ${index + 1}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      '2024.05.20 저장됨',
                      style: TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: () {},
                icon: const Icon(Icons.bookmark, color: Color(0xFF8B5CF6)), // 채워진 북마크 아이콘
              ),
            ],
          ),
        );
      },
    );
  }
}