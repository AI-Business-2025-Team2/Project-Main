import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, TrendingUp, BookOpen, Award, Zap, Target, Calendar } from 'lucide-react';

const weeklyActivity = [
  { day: 'Mon', articles: 3, concepts: 5 },
  { day: 'Tue', articles: 2, concepts: 3 },
  { day: 'Wed', articles: 4, concepts: 7 },
  { day: 'Thu', articles: 3, concepts: 4 },
  { day: 'Fri', articles: 5, concepts: 8 },
  { day: 'Sat', articles: 2, concepts: 2 },
  { day: 'Sun', articles: 1, concepts: 1 }
];

const achievements = [
  { icon: '🔥', title: '7-Day Streak', description: 'Read articles 7 days in a row', earned: true },
  { icon: '📚', title: 'Quick Learner', description: 'Learn 10 concepts in one day', earned: true },
  { icon: '⭐', title: 'Quiz Master', description: 'Score 100% on 5 quizzes', earned: false },
  { icon: '🎯', title: 'Economic Expert', description: 'Learn 50 concepts', earned: false }
];

const recentActivity = [
  { action: 'Completed quiz', topic: 'Monetary Policy', score: 100, time: '2h ago' },
  { action: 'Learned concept', topic: 'GDP', score: null, time: '3h ago' },
  { action: 'Read article', topic: 'Federal Reserve Policy', score: null, time: '5h ago' },
  { action: 'Completed quiz', topic: 'Market Analysis', score: 67, time: '1d ago' }
];

export function ProgressDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-gray-900 mb-1">Your Progress</h1>
          <p className="text-xs text-gray-500">Track your learning journey</p>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Overall Stats */}
        <Card className="p-5 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-blue-100 mb-1">Total Points</p>
              <div className="text-4xl">342</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Level 4
            </Badge>
            <div className="flex-1">
              <Progress value={68} className="h-2 bg-white/20" />
            </div>
            <span className="text-sm">68%</span>
          </div>
        </Card>

        {/* This Week Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h3 className="text-gray-900">Articles Read</h3>
            </div>
            <div className="text-3xl text-gray-900">20</div>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-600" />
              <h3 className="text-gray-900">Concepts</h3>
            </div>
            <div className="text-3xl text-gray-900">30</div>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Weekly Activity</h3>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="w-3 h-3" />
              +25%
            </Badge>
          </div>

          <div className="flex items-end justify-between gap-2 h-32 mb-2">
            {weeklyActivity.map((day, index) => {
              const maxValue = Math.max(...weeklyActivity.map(d => d.concepts));
              const height = (day.concepts / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{day.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-600 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              Concepts Learned
            </div>
          </div>
        </Card>

        {/* Streak */}
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-2xl">
              🔥
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">7-Day Streak!</h3>
              <p className="text-sm text-gray-600">Keep learning to maintain your streak</p>
            </div>
          </div>
        </Card>

        {/* Goals */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-gray-700" />
            <h3 className="text-gray-900">This Week's Goals</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Read 25 articles</span>
                <span className="text-gray-900">20/25</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Learn 40 concepts</span>
                <span className="text-gray-900">30/40</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Complete 10 quizzes</span>
                <span className="text-gray-900">6/10</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-gray-700" />
            <h3 className="text-gray-900">Achievements</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <Card 
                key={index}
                className={`p-3 ${
                  achievement.earned 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h4 className="text-sm text-gray-900 mb-1">{achievement.title}</h4>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </Card>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-700" />
            <h3 className="text-gray-900">Recent Activity</h3>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {activity.score !== null ? (
                    <Trophy className="w-5 h-5 text-blue-600" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600 truncate">{activity.topic}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {activity.score !== null && (
                    <div className={`text-sm mb-1 ${
                      activity.score >= 70 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {activity.score}%
                    </div>
                  )}
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
