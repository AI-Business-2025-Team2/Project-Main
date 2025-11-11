import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BookOpen, Lock, CheckCircle, Star, Network, Sparkles } from 'lucide-react';

const conceptCategories = [
  {
    id: 1,
    title: '통화정책 기초',
    description: '중앙은행과 금리 정책 배우기',
    concepts: 8,
    learned: 8,
    xp: 400,
    color: 'from-blue-500 to-blue-600',
    locked: false
  },
  {
    id: 2,
    title: '경제 지표',
    description: 'GDP, 물가, 실업률 이해하기',
    concepts: 12,
    learned: 7,
    xp: 600,
    color: 'from-purple-500 to-purple-600',
    locked: false
  },
  {
    id: 3,
    title: '금융 시장',
    description: '주식, 채권, 시장 역학 알아보기',
    concepts: 15,
    learned: 3,
    xp: 750,
    color: 'from-green-500 to-green-600',
    locked: false
  },
  {
    id: 4,
    title: '회계 기초',
    description: '재무제표와 대차대조표 배우기',
    concepts: 10,
    learned: 0,
    xp: 500,
    color: 'from-orange-500 to-orange-600',
    locked: true
  }
];

const recentlyLearned = [
  { term: '기준금리', category: '통화정책', time: '2시간 전' },
  { term: '물가상승률', category: '경제 지표', time: '5시간 전' },
  { term: '코스피', category: '금융 시장', time: '1일 전' },
  { term: 'GDP', category: '경제 지표', time: '1일 전' }
];

interface LearnScreenProps {
  onXPEarned: (xp: number) => void;
}

export function LearnScreen({ onXPEarned }: LearnScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-gray-900">학습 지도</h1>
            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">경제 개념을 탐험하고 마스터하세요 📚✨</p>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Concept Map Preview */}
        <Card className="p-5 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 border-4 border-purple-200 rounded-3xl shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">개념 네트워크 🔗</h3>
              <p className="text-sm text-gray-600">
                경제 개념들이 어떻게 연결되는지 확인하세요
              </p>
            </div>
          </div>
          
          {/* Simple concept visualization */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full shadow-md">
              물가상승률
            </div>
            <div className="w-4 h-px bg-gray-300" />
            <div className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs rounded-full shadow-md">
              기준금리
            </div>
            <div className="w-4 h-px bg-gray-300" />
            <div className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-full shadow-md">
              GDP
            </div>
          </div>
          
          <button className="w-full text-center text-sm text-purple-700 bg-white/70 px-4 py-2.5 rounded-2xl hover:bg-white transition-all hover:shadow-md">
            전체 지도 탐험하기 ✨ →
          </button>
        </Card>

        {/* Learning Categories */}
        <div>
          <h2 className="text-gray-900 mb-3 flex items-center gap-2">
            학습 경로 🎯
          </h2>
          <div className="space-y-3">
            {conceptCategories.map((category) => {
              const progress = (category.learned / category.concepts) * 100;
              const isCompleted = category.learned === category.concepts;

              return (
                <Card 
                  key={category.id}
                  className={`p-4 border-2 border-purple-200 rounded-3xl ${
                    category.locked 
                      ? 'opacity-60' 
                      : 'hover:shadow-xl active:scale-[0.98] hover:border-purple-300'
                  } transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30`}
                >
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      {category.locked ? (
                        <Lock className="w-6 h-6 text-white" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-gray-900">{category.title}</h3>
                        {!category.locked && (
                          <Badge className="bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 border-0 flex-shrink-0 rounded-full shadow-md">
                            {category.xp} XP
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>

                      {category.locked ? (
                        <div className="flex items-center gap-2 bg-purple-100 px-3 py-2 rounded-2xl">
                          <Lock className="w-4 h-4 text-purple-600" />
                          <span className="text-xs text-purple-700">
                            이전 경로를 완료하면 잠금 해제돼요! 🔓
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span>📚 {category.learned} / {category.concepts} 개념</span>
                            <span className="bg-purple-100 px-2 py-1 rounded-full text-purple-700">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-3 rounded-full" />
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recently Learned */}
        <div>
          <h2 className="text-gray-900 mb-3 flex items-center gap-2">
            최근 학습 내용 ⏱️
          </h2>
          <div className="space-y-2">
            {recentlyLearned.map((item, index) => (
              <Card key={index} className="p-3 border-2 border-purple-200 rounded-2xl hover:shadow-md transition-all bg-gradient-to-r from-white to-purple-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center border-2 border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{item.term}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-purple-100 px-2 py-1 rounded-full">{item.time}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center border-2 border-purple-200 rounded-3xl bg-gradient-to-br from-white to-blue-50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-2 border-2 border-blue-300">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl text-gray-900">48</div>
            <div className="text-xs text-gray-600 mt-1">전체 개념 📚</div>
          </Card>

          <Card className="p-4 text-center border-2 border-purple-200 rounded-3xl bg-gradient-to-br from-white to-green-50 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mx-auto mb-2 border-2 border-green-300">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl text-gray-900">18</div>
            <div className="text-xs text-gray-600 mt-1">마스터 완료 ✅</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
