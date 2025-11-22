import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

class ArticleDetailScreen extends StatefulWidget {
  // 외부에서 전달받을 실제 데이터들
  final String title;
  final String source;
  final String date;
  final String content;
  final String aiSummary;
  final List<dynamic> keyConcepts;
  final String? imageUrl;

  const ArticleDetailScreen({
    super.key,
    required this.title,
    required this.source,
    required this.date,
    required this.content,
    required this.aiSummary,
    required this.keyConcepts,
    this.imageUrl,
  });

  @override
  State<ArticleDetailScreen> createState() => _ArticleDetailScreenState();
}

class _ArticleDetailScreenState extends State<ArticleDetailScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
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
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF8B5CF6),
          unselectedLabelColor: Colors.grey,
          indicatorColor: const Color(0xFF8B5CF6),
          indicatorWeight: 3,
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
          _buildArticleTab(),
          _buildAITab(),
          _buildMemoTab(),
        ],
      ),
    );
  }

  // 1. 기사 탭
  Widget _buildArticleTab() {
    // 핵심 개념의 '용어(term)'만 뽑아서 하이라이트 키워드로 사용
    List<String> keywords = widget.keyConcepts.map((k) => k['term'].toString()).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: const Color(0xFFF3E8FF), borderRadius: BorderRadius.circular(4)),
                child: const Text("경제", style: TextStyle(color: Color(0xFF8B5CF6), fontWeight: FontWeight.bold, fontSize: 12)),
              ),
              const SizedBox(width: 10),
              Text("${widget.source} · ${widget.date}", style: const TextStyle(color: Colors.grey, fontSize: 13)),
            ],
          ),
          const SizedBox(height: 16),
          Text(widget.title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, height: 1.4)),
          const SizedBox(height: 20),
          
          // 이미지 (없으면 회색 박스)
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: widget.imageUrl != null 
              ? Image.network(widget.imageUrl!, height: 200, width: double.infinity, fit: BoxFit.cover)
              : Container(height: 200, width: double.infinity, color: Colors.grey[200], child: const Icon(Icons.image, color: Colors.grey)),
          ),
          const SizedBox(height: 24),

          // 본문 (하이라이트 적용)
          RichText(
            text: TextSpan(
              style: const TextStyle(fontSize: 16, height: 1.8, color: Colors.black87),
              children: _highlightKeywords(widget.content, keywords),
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  // 2. AI 튜터 탭
  Widget _buildAITab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("⚡ 3줄 요약", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F9FD),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Text(
              widget.aiSummary, // 실제 AI 요약 표시
              style: const TextStyle(fontSize: 15, height: 1.6, color: Colors.black87),
            ),
          ),
          const SizedBox(height: 32),
          const Text("💡 핵심 개념 정리", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          
          // 실제 개념 리스트 표시
          if (widget.keyConcepts.isEmpty)
            const Text("설명할 핵심 개념이 없습니다.", style: TextStyle(color: Colors.grey)),

          ...widget.keyConcepts.map((concept) {
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFF1F3F5)),
              ),
              child: Theme(
                data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                child: ExpansionTile(
                  title: Text(
                    concept['term'] ?? '',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF6D28D9)),
                  ),
                  leading: const Icon(Icons.lightbulb_outline, color: Color(0xFFF59E0B)),
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                      child: Text(
                        concept['explanation'] ?? '',
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

  // 3. 메모 탭 (기존과 동일)
  Widget _buildMemoTab() {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
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
                  color: const Color(0xFFFFF9C4).withOpacity(0.3),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFF0E68C)),
                ),
                child: const TextField(
                  maxLines: null,
                  expands: true,
                  decoration: InputDecoration(hintText: "메모를 입력하세요...", border: InputBorder.none),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 하이라이트 로직
  List<TextSpan> _highlightKeywords(String text, List<String> keywords) {
    if (keywords.isEmpty) return [TextSpan(text: text)];
    
    List<TextSpan> spans = [];
    // 특수문자 이스케이프 처리 후 정규식 생성
    String pattern = keywords.map((k) => RegExp.escape(k)).join('|');
    
    text.splitMapJoin(
      RegExp(pattern),
      onMatch: (Match match) {
        final String keyword = match.group(0)!;
        spans.add(
          TextSpan(
            text: keyword,
            style: const TextStyle(
              backgroundColor: Color(0xFFFFF3CD),
              color: Colors.black,
              fontWeight: FontWeight.bold,
              decoration: TextDecoration.underline,
              decorationStyle: TextDecorationStyle.dotted,
            ),
            recognizer: TapGestureRecognizer()..onTap = () {
               _tabController.animateTo(1);
               ScaffoldMessenger.of(context).showSnackBar(
                 SnackBar(content: Text("💡 '$keyword'의 뜻을 AI 탭에서 확인해보세요!")),
               );
            },
          ),
        );
        return keyword;
      },
      onNonMatch: (String nonMatch) {
        spans.add(TextSpan(text: nonMatch));
        return nonMatch;
      },
    );
    return spans;
  }
}