import 'package:flutter/gestures.dart'; // 텍스트 클릭 이벤트를 위해 필요
import 'package:flutter/material.dart';

class ArticleDetailScreen extends StatefulWidget {
  // 실제로는 이전 화면(List)에서 넘겨받거나, ID로 서버에서 조회해야 합니다.
  // 일단 UI 테스트를 위해 데이터를 생성자에서 받지 않고 내부 더미 데이터로 처리하겠습니다.
  const ArticleDetailScreen({super.key});

  @override
  State<ArticleDetailScreen> createState() => _ArticleDetailScreenState();
}

class _ArticleDetailScreenState extends State<ArticleDetailScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // -------------------------------------------------------
  // 📝 임시 데이터 (나중에 백엔드/AI API와 연동될 부분)
  // -------------------------------------------------------
  final String title = "미국 연준, 기준금리 동결... '연내 인하 가능성 열려있다'";
  final String source = "글로벌경제";
  final String date = "2025.11.16";
  final String content = 
      "미국 연방준비제도(Fed)가 기준금리를 현재 수준인 5.25~5.50%로 동결했습니다. "
      "연방공개시장위원회(FOMC)는 성명을 통해 인플레이션이 목표치인 2%를 향해 움직이고 있다는 확신을 얻기 전까지는 금리를 인하하지 않겠다는 입장을 재확인했습니다. "
      "하지만 제롬 파월 의장은 기자회견에서 '긴축적인 통화정책이 경제 활동에 하방 압력을 가하고 있다'고 언급하며 연내 피벗(Pivot) 가능성을 시사했습니다. "
      "시장은 이번 결정을 비둘기파적으로 해석하며 안도 랠리를 보였습니다. "
      "특히 양적긴축(QT) 속도 조절에 대한 논의가 시작되었다는 점이 투자 심리에 긍정적인 영향을 미쳤습니다.";

  // AI가 추출한 핵심 개념 (하이라이트 및 설명용)
  final Map<String, String> keyConcepts = {
    "연방준비제도": "미국의 중앙은행 시스템으로, 달러 발행과 통화 정책을 관장합니다.",
    "기준금리": "중앙은행이 시중 은행과 거래할 때 적용하는 금리로, 한 나라 금리 체계의 기준이 됩니다.",
    "FOMC": "연방공개시장위원회. 미국의 통화정책을 결정하는 최고 의사결정 기구입니다.",
    "피벗": "정책 전환을 의미하며, 여기서는 금리 인상 기조에서 인하 기조로 바꾸는 것을 뜻합니다.",
    "비둘기파": "경제 성장을 위해 금리 인하와 돈을 푸는 정책을 선호하는 성향을 말합니다.",
    "양적긴축": "중앙은행이 보유한 채권을 매각해 시중의 돈을 회수하는 정책입니다.",
  };

  // AI 요약 내용
  final String aiSummary = 
      "1. 미국 연준이 기준금리를 5.25~5.50%로 동결했습니다.\n"
      "2. 인플레이션 목표 달성 전까지 섣부른 인하는 없다고 밝혔습니다.\n"
      "3. 그러나 '피벗(정책 전환)' 가능성과 양적긴축 속도 조절을 시사하며 시장은 이를 긍정적으로 받아들였습니다.";

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this); // 탭 3개 (기사, AI, 메모)
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text("뉴스 학습", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 16)),
        centerTitle: true,
        actions: [
          IconButton(icon: const Icon(Icons.share_outlined, color: Colors.black), onPressed: () {}),
          IconButton(icon: const Icon(Icons.bookmark_border, color: Colors.black), onPressed: () {}),
        ],
        // 탭바 (화면 상단 고정)
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF8B5CF6), // 보라색
          unselectedLabelColor: Colors.grey,
          indicatorColor: const Color(0xFF8B5CF6),
          indicatorWeight: 3,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold),
          tabs: const [
            Tab(text: "기사 본문"),
            Tab(text: "AI 튜터"),
            Tab(text: "메모"),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildArticleTab(),   // 1. 기사 읽기 탭
          _buildAITab(),        // 2. AI 요약 및 개념 탭
          _buildMemoTab(),      // 3. 메모 탭
        ],
      ),
    );
  }

  // -------------------------------------------------------
  // 1. 기사 탭: 하이라이트 텍스트 구현
  // -------------------------------------------------------
  Widget _buildArticleTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 태그 및 날짜
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: const Color(0xFFF3E8FF), borderRadius: BorderRadius.circular(4)),
                child: const Text("경제", style: TextStyle(color: Color(0xFF8B5CF6), fontWeight: FontWeight.bold, fontSize: 12)),
              ),
              const SizedBox(width: 10),
              Text("$source · $date", style: const TextStyle(color: Colors.grey, fontSize: 13)),
            ],
          ),
          const SizedBox(height: 16),
          
          // 제목
          Text(title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, height: 1.4)),
          const SizedBox(height: 20),

          // 이미지
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Container(
              height: 200, 
              width: double.infinity, 
              color: Colors.grey[200],
              child: const Icon(Icons.image, size: 50, color: Colors.grey), // (추후 실제 이미지로 교체)
            ),
          ),
          const SizedBox(height: 24),

          // 🔥 핵심 기능: 하이라이트 처리된 본문
          RichText(
            text: TextSpan(
              style: const TextStyle(fontSize: 16, height: 1.8, color: Colors.black87),
              children: _highlightKeywords(content, keyConcepts.keys.toList()),
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  // -------------------------------------------------------
  // 2. AI 튜터 탭: 요약 및 개념 설명
  // -------------------------------------------------------
  Widget _buildAITab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 요약 섹션
          const Text("⚡ 3줄 요약", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F9FD), // 아주 연한 회색/파랑
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Text(
              aiSummary,
              style: const TextStyle(fontSize: 15, height: 1.6, color: Colors.black87),
            ),
          ),
          
          const SizedBox(height: 32),

          // 핵심 개념 섹션
          const Text("💡 핵심 개념 정리", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          
          // 개념 리스트 생성
          ...keyConcepts.entries.map((entry) {
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFF1F3F5)),
                boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.05), blurRadius: 5, offset: const Offset(0, 2))],
              ),
              child: Theme(
                data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                child: ExpansionTile(
                  title: Text(
                    entry.key, // 용어 이름
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF6D28D9)),
                  ),
                  leading: const Icon(Icons.lightbulb_outline, color: Color(0xFFF59E0B)),
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                      child: Text(
                        entry.value, // 용어 설명
                        style: const TextStyle(fontSize: 14, color: Colors.black87, height: 1.5),
                      ),
                    )
                  ],
                ),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  // -------------------------------------------------------
  // 3. 메모 탭: 간단한 메모장
  // -------------------------------------------------------
  Widget _buildMemoTab() {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(), // 화면 터치시 키보드 내림
      child: Container(
        color: Colors.transparent,
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("📝 나만의 메모", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF9C4).withOpacity(0.3), // 연한 노란색 포스트잇 느낌
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFF0E68C)),
                ),
                child: const TextField(
                  maxLines: null, // 무제한 줄바꿈
                  expands: true,
                  decoration: InputDecoration(
                    hintText: "이 뉴스를 읽으며 든 생각이나,\n기억하고 싶은 내용을 자유롭게 적어보세요.",
                    border: InputBorder.none,
                  ),
                  style: TextStyle(fontSize: 15, height: 1.5),
                ),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("메모가 저장되었습니다!")));
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8B5CF6),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text("저장하기", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // -------------------------------------------------------
  // 🔧 헬퍼 함수: 키워드 하이라이팅 로직
  // -------------------------------------------------------
  List<TextSpan> _highlightKeywords(String text, List<String> keywords) {
    List<TextSpan> spans = [];
    
    // 간단한 파싱 로직: 텍스트를 공백으로 나누고, 키워드가 포함되어 있는지 확인
    // (실제로는 더 정교한 정규식이나 형태소 분석이 필요할 수 있음)
    
    text.splitMapJoin(
      RegExp(keywords.map((k) => RegExp.escape(k)).join('|')), // 키워드 정규식 생성
      onMatch: (Match match) {
        // 키워드인 경우: 스타일 적용 및 클릭 이벤트
        final String keyword = match.group(0)!;
        spans.add(
          TextSpan(
            text: keyword,
            style: const TextStyle(
              backgroundColor: Color(0xFFFFF3CD), // 노란색 형광펜 배경
              color: Colors.black,
              fontWeight: FontWeight.bold,
              decoration: TextDecoration.underline, // 밑줄
              decorationStyle: TextDecorationStyle.dotted,
            ),
            recognizer: TapGestureRecognizer()..onTap = () {
               // 키워드 클릭 시 탭을 AI 탭으로 이동하거나 다이얼로그 띄우기
               _tabController.animateTo(1); // AI 탭으로 이동
               ScaffoldMessenger.of(context).showSnackBar(
                 SnackBar(content: Text("💡 '$keyword'의 뜻을 AI 탭에서 확인해보세요!")),
               );
            },
          ),
        );
        return keyword;
      },
      onNonMatch: (String nonMatch) {
        // 일반 텍스트
        spans.add(TextSpan(text: nonMatch));
        return nonMatch;
      },
    );

    return spans;
  }
}