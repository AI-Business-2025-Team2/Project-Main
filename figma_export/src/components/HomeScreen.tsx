import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Bell, Settings, Lightbulb, Clock, TrendingUp, Sparkles, Heart } from 'lucide-react';
import { useState } from 'react';
import { ArticleReader } from './ArticleReader';
import { LessonFlow } from './LessonFlow';

const newsArticles = [
  {
    id: 1,
    headline: '한국은행, 기준금리 3.5% 동결... 물가 안정세 주목',
    summary: '한국은행이 8개월 연속 기준금리를 3.5%로 유지했습니다. 금융통화위원회는 최근 소비자물가 상승률이 2%대로 안정되는 추세를 보이며, 경기 회복세를 고려해 신중한 통화정책 기조를 이어가기로 결정했습니다.',
    source: '한국경제',
    time: '2시간 전',
    category: '금융',
    keyTerms: ['기준금리', '통화정책', '물가상승률', '금융통화위원회'],
    xp: 50,
    duration: '5분'
  },
  {
    id: 2,
    headline: '코스피 2,700선 돌파... 외국인 순매수 지속',
    summary: '코스피 지수가 2,700선을 돌파하며 3개월 만에 최고치를 경신했습니다. 반도체 대형주를 중심으로 외국인 투자자들의 순매수세가 이어지면서 시장 전반에 긍정적인 분위기가 형성되고 있습니다.',
    source: '이데일리',
    time: '4시간 전',
    category: '증권',
    keyTerms: ['코스피', '주가지수', '외국인투자', '순매수'],
    xp: 50,
    duration: '4분'
  },
  {
    id: 3,
    headline: '2024년 4분기 GDP 성장률 3.2% 기록... 예상치 상회',
    summary: '한국의 4분기 국내총생산(GDP) 성장률이 전년 동기 대비 3.2%를 기록하며 시장 예상치인 2.8%를 크게 웃돌았습니다. 수출 증가와 내수 소비 회복이 성장을 견인한 것으로 분석됩니다.',
    source: '매일경제',
    time: '6시간 전',
    category: '경제',
    keyTerms: ['GDP', '경제성장률', '국내총생산', '내수'],
    xp: 60,
    duration: '6분'
  },
  {
    id: 4,
    headline: '삼성전자, 반도체 수요 회복으로 영업이익 급증 전망',
    summary: '삼성전자가 1분기 실적 가이던스를 발표하며 메모리 반도체 가격 상승과 수요 회복에 따라 영업이익이 전분기 대비 50% 이상 증가할 것으로 예상된다고 밝혔습니다. 시장은 반도체 업황 회복의 신호로 해석하고 있습니다.',
    source: '서울경제',
    time: '8시간 전',
    category: '기업',
    keyTerms: ['영업이익', '반도체', '실적', '수익성'],
    xp: 50,
    duration: '5분'
  },
  {
    id: 5,
    headline: 'K-IFRS 새 회계기준 시행... 상장사 재무제표 투명성 강화',
    summary: '올해부터 국제회계기준(K-IFRS) 개정안이 시행되면서 상장기업들의 재무제표 작성 기준이 더욱 엄격해졌습니다. 새로운 기준은 수익 인식과 리스 회계처리 방식을 개선해 투자자들의 기업 재무상태 파악을 돕습니다.',
    source: '파이낸셜뉴스',
    time: '10시간 전',
    category: '회계',
    keyTerms: ['K-IFRS', '회계기준', '재무제표', '수익인식'],
    xp: 70,
    duration: '7분'
  },
  {
    id: 6,
    headline: '가상자산 과세 2년 유예... 암호화폐 시장 안도',
    summary: '정부가 가상자산 소득에 대한 과세 시행을 2년 유예하기로 결정했습니다. 시장 인프라 구축과 투자자 보호 체계 마련에 더 많은 시간이 필요하다는 판단에 따른 것으로, 암호화폐 투자자들은 환영하는 분위기입니다.',
    source: '조선비즈',
    time: '12시간 전',
    category: '재정',
    keyTerms: ['가상자산', '과세', '암호화폐', '세금'],
    xp: 60,
    duration: '6분'
  }
];

interface HomeScreenProps {
  userXP: number;
  streak: number;
  onLessonComplete: (earnedXP: number) => void;
}

export function HomeScreen({ userXP, streak, onLessonComplete }: HomeScreenProps) {
  const [selectedArticle, setSelectedArticle] = useState<typeof newsArticles[0] | null>(null);
  const [showLesson, setShowLesson] = useState(false);
  const [visibleArticles, setVisibleArticles] = useState(4);

  // Show article reader
  if (selectedArticle && !showLesson) {
    return (
      <ArticleReader
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
        onStartLearning={() => setShowLesson(true)}
      />
    );
  }

  // Show lesson flow
  if (selectedArticle && showLesson) {
    return (
      <LessonFlow 
        lesson={selectedArticle} 
        onComplete={(earnedXP) => {
          onLessonComplete(earnedXP);
          setSelectedArticle(null);
          setShowLesson(false);
        }} 
      />
    );
  }

  const loadMore = () => {
    setVisibleArticles(prev => Math.min(prev + 2, newsArticles.length));
  };

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-gray-900">오늘의 경제 뉴스</h1>
                <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">뉴스로 배우는 경제 공부! 📚✨</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 hover:bg-purple-100 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 relative">
                <Bell className="w-5 h-5 text-purple-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
              </button>
              <button className="p-2.5 hover:bg-purple-100 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95">
                <Settings className="w-5 h-5 text-purple-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Scroll Feed */}
      <main className="px-4 py-4">
        <div className="space-y-4">
          {newsArticles.slice(0, visibleArticles).map((article, index) => (
            <Card 
              key={article.id} 
              className="p-5 hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 rounded-3xl transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-white to-purple-50/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Category & Time */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 rounded-full">
                  {article.category}
                </Badge>
                <span className="text-xs text-gray-500">{article.source}</span>
                <span className="text-xs text-gray-300">•</span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {article.time}
                </div>
                {article.id <= 2 && (
                  <>
                    <span className="text-xs text-gray-300">•</span>
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <TrendingUp className="w-3 h-3 animate-pulse" />
                      <span>인기</span>
                    </div>
                  </>
                )}
              </div>

              {/* Headline */}
              <h3 className="text-gray-900 mb-3 leading-snug">{article.headline}</h3>

              {/* Summary */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {article.summary}
              </p>

              {/* Highlighted Terms */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-gray-600">배울 핵심 개념:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.keyTerms.map((term, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm border-2 border-purple-200 hover:scale-105 transition-transform duration-200"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              {/* Read Article Button */}
              <Button 
                onClick={() => setSelectedArticle(article)}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                학습 시작하고 {article.xp} XP 받기
                <Heart className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {visibleArticles < newsArticles.length && (
          <div className="mt-6 text-center">
            <Button 
              onClick={loadMore}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-2xl border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              더 많은 기사 보기!
            </Button>
          </div>
        )}

        {visibleArticles >= newsArticles.length && (
          <div className="mt-6 text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl border-2 border-purple-200">
            <p className="text-sm text-purple-900">
              🎉 오늘의 모든 기사를 확인했어요!
            </p>
            <p className="text-xs text-purple-700 mt-1">
              내일 새로운 기사로 만나요! ✨
            </p>
          </div>
        )}
      </main>
    </div>
  );
}