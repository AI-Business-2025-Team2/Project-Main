import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ArticleDetailScreen extends StatefulWidget {
  final String id; // 👈 [추가] 뉴스 ID가 반드시 필요함!
  final String title;
  final String source;
  final String date;
  final String content;
  final String aiSummary;
  final List<dynamic> keyConcepts;
  final String? imageUrl;

  const ArticleDetailScreen({
    super.key,
    required this.id, // 👈 추가
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
  bool isBookmarked = false; // 현재 북마크 상태

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _checkBookmarkStatus(); // 들어오자마자 북마크 여부 확인
  }

  // 내 정보에서 이 뉴스가 북마크 되어있는지 확인
  Future<void> _checkBookmarkStatus() async {
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
        List<dynamic> bookmarks = data['bookmarkedNews'];
        setState(() {
          // 내 북마크 리스트에 이 뉴스 ID가 있는지 확인
          isBookmarked = bookmarks.contains(widget.id);
        });
      }
    } catch (e) {
      print("북마크 확인 실패: $e");
    }
  }

  // 북마크 토글 버튼 클릭 시
  Future<void> _toggleBookmark() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('로그인이 필요합니다.')));
      return;
    }

    String baseUrl = _getBaseUrl();
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/user/bookmark'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token"
        },
        body: jsonEncode({"newsId": widget.id}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          isBookmarked = data['isBookmarked']; // 서버가 알려준 상태로 업데이트
        });
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(data['message'])));
      }
    } catch (e) {
      print("북마크 요청 실패: $e");
    }
  }

  String _getBaseUrl() {
    if (kIsWeb) return 'http://localhost:3000';
    if (Platform.isAndroid) return 'http://10.0.2.2:3000';
    return 'http://localhost:3000';
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
          IconButton(onPressed: () {}, icon: const Icon(Icons.share_outlined, color: Colors.black)),
          // 👇 [수정] 북마크 버튼 연결
          IconButton(
            onPressed: _toggleBookmark,
            icon: Icon(
              isBookmarked ? Icons.bookmark : Icons.bookmark_border, // 상태에 따라 아이콘 변경
              color: isBookmarked ? const Color(0xFF8B5CF6) : Colors.black,
            ),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF8B5CF6),
          unselectedLabelColor: Colors.grey,
          indicatorColor: const Color(0xFF8B5CF6),
          indicatorWeight: 3,
          tabs: const [Tab(text: "기사 본문"), Tab(text: "AI 튜터"), Tab(text: "메모")],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [_buildArticleTab(), _buildAITab(), _buildMemoTab()],
      ),
    );
  }

  // ... (나머지 _buildArticleTab, _buildAITab, _buildMemoTab 코드는 기존과 동일하므로 유지하세요!)
  // (파일 길이가 너무 길어질까봐 생략합니다. 기존 코드 그대로 두시면 됩니다.)
  // 단, _buildArticleTab 내부에서 widget.id, widget.imageUrl 등을 쓰는 부분은 그대로 작동합니다.
  
  // ------------------------------------------------------------------
  // (편의를 위해 아래 탭 관련 코드를 다시 붙여넣으셔도 됩니다. 기존과 같습니다.)
  // ------------------------------------------------------------------
  Widget _buildArticleTab() {
    List<String> keywords = widget.keyConcepts.map((k) => k['term'].toString()).toList();
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: const Color(0xFFF3E8FF), borderRadius: BorderRadius.circular(4)), child: const Text("경제", style: TextStyle(color: Color(0xFF8B5CF6), fontWeight: FontWeight.bold, fontSize: 12))),
              const SizedBox(width: 10),
              Text("${widget.source} · ${widget.date}", style: const TextStyle(color: Colors.grey, fontSize: 13)),
            ],
          ),
          const SizedBox(height: 16),
          Text(widget.title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, height: 1.4)),
          const SizedBox(height: 20),

          // 👇 [수정] 이미지가 존재하고(null 아님), 빈 문자열이 아닐 때만 표시
          if (widget.imageUrl != null && widget.imageUrl!.isNotEmpty) ...[
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.network(
                widget.imageUrl!,
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
                // 혹시 URL은 있는데 로딩 에러(404 등)가 나면 숨김 처리
                errorBuilder: (context, error, stackTrace) {
                  return const SizedBox.shrink(); 
                },
              ),
            ),
            const SizedBox(height: 24), // 이미지가 있을 때만 간격 띄움
          ],
          
          const SizedBox(height: 24),
          RichText(text: TextSpan(style: const TextStyle(fontSize: 16, height: 1.8, color: Colors.black87), children: _highlightKeywords(widget.content, keywords))),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildAITab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("3줄 요약", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Container(width: double.infinity, padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: const Color(0xFFF8F9FD), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFE2E8F0))), child: Text(widget.aiSummary, style: const TextStyle(fontSize: 15, height: 1.6, color: Colors.black87))),
          const SizedBox(height: 32),
          const Text("핵심 개념 정리", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          if (widget.keyConcepts.isEmpty) const Text("설명할 핵심 개념이 없습니다.", style: TextStyle(color: Colors.grey)),
          ...widget.keyConcepts.map((concept) {
            return Container(margin: const EdgeInsets.only(bottom: 12), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFF1F3F5))), child: Theme(data: Theme.of(context).copyWith(dividerColor: Colors.transparent), child: ExpansionTile(title: Text(concept['term'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF6D28D9))), leading: const Icon(Icons.lightbulb_outline, color: Color(0xFFF59E0B)), children: [Padding(padding: const EdgeInsets.fromLTRB(16, 0, 16, 16), child: Text(concept['explanation'] ?? '', style: const TextStyle(fontSize: 14, color: Colors.black87, height: 1.5)))])));
          }).toList(),
        ],
      ),
    );
  }

  Widget _buildMemoTab() {
    return GestureDetector(onTap: () => FocusScope.of(context).unfocus(), child: Container(color: Colors.transparent, padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [const Text("나만의 메모", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)), const SizedBox(height: 12), Expanded(child: Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: const Color(0xFFFFF9C4).withOpacity(0.3), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFF0E68C))), child: const TextField(maxLines: null, expands: true, decoration: InputDecoration(hintText: "메모를 입력하세요...", border: InputBorder.none))))])));
  }

  List<TextSpan> _highlightKeywords(String text, List<String> keywords) {
    if (keywords.isEmpty) return [TextSpan(text: text)];
    String pattern = keywords.map((k) => RegExp.escape(k)).join('|');
    List<TextSpan> spans = [];
    text.splitMapJoin(RegExp(pattern), onMatch: (Match match) {
      final String keyword = match.group(0)!;
      spans.add(TextSpan(text: keyword, style: const TextStyle(backgroundColor: Color(0xFFFFF3CD), color: Colors.black, fontWeight: FontWeight.bold, decoration: TextDecoration.underline, decorationStyle: TextDecorationStyle.dotted), recognizer: TapGestureRecognizer()..onTap = () { _tabController.animateTo(1); ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("💡 '$keyword'의 뜻을 AI 탭에서 확인해보세요!"))); }));
      return keyword;
    }, onNonMatch: (String nonMatch) { spans.add(TextSpan(text: nonMatch)); return nonMatch; });
    return spans;
  }
}