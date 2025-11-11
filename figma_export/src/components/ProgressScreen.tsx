import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Flame, Zap, TrendingUp, Target, Award, Star, Calendar, Sparkles } from 'lucide-react';

const achievements = [
  { 
    id: 1, 
    emoji: '🔥', 
    title: '7일 연속', 
    description: '7일 연속 학습하기', 
    earned: true,
    date: '2일 전'
  },
  { 
    id: 2, 
    emoji: '⚡', 
    title: '빠른 학습자', 
    description: '하루에 5개 레슨 완료', 
    earned: true,
    date: '5일 전'
  },
  { 
    id: 3, 
    emoji: '🎯', 
    title: '완벽한 점수', 
    description: '레슨에서 100점 달성', 
    earned: true,
    date: '1주일 전'
  },
  { 
    id: 4, 
    emoji: '📚', 
    title: '지식 탐구자', 
    description: '50개 개념 학습하기', 
    earned: false 
  },
  { 
    id: 5, 
    emoji: '💎', 
    title: '경제 전문가', 
    description: '레벨 10 도달하기', 
    earned: false 
  },
  { 
    id: 6, 
    emoji: '🌟', 
    title: '완벽한 한 달', 
    description: '30일 연속 학습하기', 
    earned: false 
  }
];

const weeklyData = [
  { day: '월', xp: 120, lessons: 3 },
  { day: '화', xp: 80, lessons: 2 },
  { day: '수', xp: 150, lessons: 4 },
  { day: '목', xp: 100, lessons: 2 },
  { day: '금', xp: 180, lessons: 5 },
  { day: '토', xp: 60, lessons: 1 },
  { day: '일', xp: 90, lessons: 2 }
];

interface ProgressScreenProps {
  userXP: number;
  streak: number;
  completedLessons?: number;
  learnedConcepts?: number;
}

export function ProgressScreen({ userXP, streak, completedLessons = 12, learnedConcepts = 48 }: ProgressScreenProps) {
  const currentLevel = Math.floor(userXP / 500) + 1;
  const xpForNextLevel = currentLevel * 500;
  const xpProgress = ((userXP % 500) / 500) * 100;
  const maxWeeklyXP = Math.max(...weeklyData.map(d => d.xp));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-gray-900">나의 진도</h1>
            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">정말 잘하고 있어요! 계속 화이팅! 📊✨</p>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Level & XP */}
        <Card className="p-5 bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 border-4 border-yellow-300 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg animate-pulse">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">레벨 {currentLevel} 🎯</h2>
                <p className="text-sm text-gray-600">경제 학습자</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 border-0 rounded-full shadow-md">
              <Zap className="w-4 h-4 mr-1" />
              {userXP} XP
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>레벨 {currentLevel + 1}까지 진행률</span>
              <span className="bg-white px-2 py-1 rounded-full text-amber-700">{xpForNextLevel - userXP} XP 필요</span>
            </div>
            <Progress value={xpProgress} className="h-3 rounded-full" />
          </div>
        </Card>

        {/* Streak */}
        <Card className="p-5 bg-gradient-to-r from-orange-100 via-red-100 to-rose-100 border-4 border-orange-300 rounded-3xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-rose-500 flex items-center justify-center shadow-lg">
              <Flame className="w-8 h-8 text-white animate-bounce" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">{streak}일 연속 🔥</h3>
              <p className="text-sm text-gray-600">연속 기록을 이어가세요! 오늘도 학습해요! 💪</p>
            </div>
          </div>
        </Card>

        {/* Weekly Activity */}
        <Card className="p-5 border-2 border-purple-200 rounded-3xl bg-gradient-to-br from-white to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 flex items-center gap-2">
              이번 주 활동 📅
            </h3>
            <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 rounded-full">
              <TrendingUp className="w-3 h-3" />
              780 XP
            </Badge>
          </div>

          <div className="flex items-end justify-between gap-2 h-32 mb-3">
            {weeklyData.map((day, index) => {
              const height = (day.xp / maxWeeklyXP) * 100;
              const isToday = index === 4; // Friday for demo

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1" style={{ height: '100%', justifyContent: 'flex-end' }}>
                    <div 
                      className={`w-full rounded-t-xl transition-all shadow-sm ${
                        isToday 
                          ? 'bg-gradient-to-t from-purple-500 via-pink-500 to-rose-500' 
                          : 'bg-gradient-to-t from-purple-400 to-pink-400'
                      }`}
                      style={{ height: `${height}%`, minHeight: '8px' }}
                    />
                  </div>
                  <span className={`text-xs ${isToday ? 'text-purple-700 bg-purple-100 px-2 py-1 rounded-full' : 'text-gray-600'}`}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-100">
            <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
              <div className="text-2xl text-purple-900">{completedLessons}</div>
              <div className="text-xs text-purple-700">레슨 완료 📚</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
              <div className="text-2xl text-purple-900">{learnedConcepts}</div>
              <div className="text-xs text-purple-700">개념 학습 💡</div>
            </div>
          </div>
        </Card>

        {/* Goals */}
        <Card className="p-5 border-2 border-purple-200 rounded-3xl bg-gradient-to-br from-white to-blue-50">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-700" />
            <h3 className="text-gray-900">주간 목표 🎯</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">20개 레슨 완료하기</span>
                <span className="text-gray-900 bg-purple-100 px-2 py-1 rounded-full">17/20</span>
              </div>
              <Progress value={85} className="h-3 rounded-full" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">1000 XP 획득하기</span>
                <span className="text-gray-900 bg-purple-100 px-2 py-1 rounded-full">780/1000</span>
              </div>
              <Progress value={78} className="h-3 rounded-full" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">7일 연속 학습</span>
                <span className="text-green-600 flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                  <Flame className="w-3 h-3" />
                  7/7 ✓
                </span>
              </div>
              <Progress value={100} className="h-3 rounded-full" />
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-5 border-2 border-purple-200 rounded-3xl bg-gradient-to-br from-white to-amber-50">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h3 className="text-gray-900">업적 🏆</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-yellow-400 scale-100 shadow-md'
                    : 'bg-gray-50 border-gray-200 opacity-50 scale-95'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.emoji}</div>
                <div className="text-xs text-gray-900 mb-1">{achievement.title}</div>
                {achievement.earned && achievement.date && (
                  <div className="text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full">{achievement.date}</div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 rounded-3xl shadow-lg">
            <Calendar className="w-6 h-6 text-blue-700 mx-auto mb-2" />
            <div className="text-2xl text-blue-900">23</div>
            <div className="text-xs text-blue-700 mt-1">활동일 📅</div>
          </Card>

          <Card className="p-4 text-center bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300 rounded-3xl shadow-lg">
            <Award className="w-6 h-6 text-green-700 mx-auto mb-2" />
            <div className="text-2xl text-green-900">3</div>
            <div className="text-xs text-green-700 mt-1">획득 배지 🎖️</div>
          </Card>
        </div>
      </div>
    </div>
  );
}