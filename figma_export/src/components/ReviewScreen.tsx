import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Brain, Clock, TrendingDown, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

const reviewItems = [
  {
    id: 1,
    term: '통화정책',
    category: '경제학',
    lastReviewed: '5일 전',
    strength: 40,
    needsReview: true,
    dueToday: true
  },
  {
    id: 2,
    term: '재정정책',
    category: '경제학',
    lastReviewed: '3일 전',
    strength: 60,
    needsReview: true,
    dueToday: true
  },
  {
    id: 3,
    term: '강세장',
    category: '금융시장',
    lastReviewed: '7일 전',
    strength: 30,
    needsReview: true,
    dueToday: false
  },
  {
    id: 4,
    term: 'EBITDA',
    category: '회계',
    lastReviewed: '2일 전',
    strength: 75,
    needsReview: false,
    dueToday: false
  },
  {
    id: 5,
    term: '물가상승률',
    category: '경제학',
    lastReviewed: '1일 전',
    strength: 90,
    needsReview: false,
    dueToday: false
  }
];

interface ReviewScreenProps {
  onXPEarned: (xp: number) => void;
}

export function ReviewScreen({ onXPEarned }: ReviewScreenProps) {
  const dueTodayCount = reviewItems.filter(item => item.dueToday).length;
  const weakConcepts = reviewItems.filter(item => item.strength < 70).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-gray-900">스마트 복습</h1>
            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">반복 학습으로 지식을 더욱 단단하게! 🧠✨</p>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Review Summary */}
        <Card className="p-5 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 border-4 border-purple-300 rounded-3xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg animate-pulse">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">복습 세션 📚</h3>
              <p className="text-sm text-gray-600">
                {dueTodayCount}개 개념이 복습 준비 완료! 💪
              </p>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95" size="lg">
            <Sparkles className="w-4 h-4 mr-2" />
            복습 시작하기! ✨
          </Button>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 border-2 border-orange-300 rounded-3xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-700" />
              <h3 className="text-gray-900">오늘 복습 ⏰</h3>
            </div>
            <div className="text-3xl text-orange-900">{dueTodayCount}</div>
            <p className="text-xs text-orange-700 mt-1">복습할 개념 📝</p>
          </Card>

          <Card className="p-4 border-2 border-red-300 rounded-3xl bg-gradient-to-br from-red-100 to-rose-100 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-700" />
              <h3 className="text-gray-900">약한 부분 💪</h3>
            </div>
            <div className="text-3xl text-red-900">{weakConcepts}</div>
            <p className="text-xs text-red-700 mt-1">연습 필요 🎯</p>
          </Card>
        </div>

        {/* Priority Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900 flex items-center gap-2">
              우선 복습 항목 🔥
            </h2>
            <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-0 rounded-full">
              <AlertCircle className="w-3 h-3" />
              {dueTodayCount}개 예정
            </Badge>
          </div>

          <div className="space-y-3">
            {reviewItems
              .filter(item => item.dueToday)
              .map((item) => (
                <Card key={item.id} className="p-4 border-4 border-orange-300 bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 mb-1">{item.term}</h3>
                      <Badge variant="secondary" className="text-xs mb-2 bg-white/70 border-0 rounded-full">
                        {item.category}
                      </Badge>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-700">
                          <span>이해도</span>
                          <span className="bg-white/70 px-2 py-0.5 rounded-full">{item.strength}%</span>
                        </div>
                        <Progress value={item.strength} className="h-3 rounded-full" />
                      </div>

                      <p className="text-xs text-gray-600 mt-2 bg-white/50 px-2 py-1 rounded-full inline-block">
                        마지막 복습: {item.lastReviewed}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* All Concepts */}
        <div>
          <h2 className="text-gray-900 mb-3">전체 복습 항목 📋</h2>
          <div className="space-y-2">
            {reviewItems
              .filter(item => !item.dueToday)
              .map((item) => (
                <Card key={item.id} className="p-4 border-2 border-purple-200 rounded-3xl bg-gradient-to-r from-white to-purple-50/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                      item.strength >= 70 ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300' : 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300'
                    }`}>
                      {item.strength >= 70 ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Brain className="w-5 h-5 text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-gray-900">{item.term}</h3>
                        <Badge variant="outline" className="text-xs border-2 border-purple-300 rounded-full bg-purple-50">
                          {item.strength}%
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-purple-100 border-0 rounded-full">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          • {item.lastReviewed}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="p-5 bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-blue-300 rounded-3xl shadow-lg">
          <h3 className="text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            간격 반복 학습법이란? 🧠
          </h3>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex items-start gap-2 bg-white/70 p-3 rounded-2xl">
              <span className="text-blue-600 text-lg">💡</span>
              <span>어려운 개념은 더 자주 복습해요</span>
            </li>
            <li className="flex items-start gap-2 bg-white/70 p-3 rounded-2xl">
              <span className="text-blue-600 text-lg">⏰</span>
              <span>잘 아는 개념은 간격을 두고 복습해요</span>
            </li>
            <li className="flex items-start gap-2 bg-white/70 p-3 rounded-2xl">
              <span className="text-blue-600 text-lg">✨</span>
              <span>최적의 타이밍으로 장기 기억을 만들어요</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}