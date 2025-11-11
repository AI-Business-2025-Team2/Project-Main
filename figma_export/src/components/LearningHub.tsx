import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BookOpen, PlayCircle, Award, ChevronRight, CheckCircle, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';
import { QuizComponent } from './QuizComponent';

const lessons = [
  {
    id: 1,
    title: 'Introduction to Macroeconomics',
    category: 'Economics',
    level: 'Beginner',
    duration: '15 min',
    progress: 100,
    completed: true,
    lessons: 8
  },
  {
    id: 2,
    title: 'Understanding GDP and Economic Growth',
    category: 'Economics',
    level: 'Beginner',
    duration: '20 min',
    progress: 60,
    completed: false,
    lessons: 6
  },
  {
    id: 3,
    title: 'Financial Statement Analysis',
    category: 'Accounting',
    level: 'Intermediate',
    duration: '30 min',
    progress: 0,
    completed: false,
    lessons: 10
  },
  {
    id: 4,
    title: 'Investment Strategies and Portfolio Management',
    category: 'Finance',
    level: 'Intermediate',
    duration: '25 min',
    progress: 0,
    completed: false,
    lessons: 9
  },
  {
    id: 5,
    title: 'Advanced Financial Derivatives',
    category: 'Finance',
    level: 'Advanced',
    duration: '40 min',
    progress: 0,
    completed: false,
    lessons: 12,
    locked: true
  }
];

const keyTerms = [
  { term: 'GDP', definition: 'Gross Domestic Product - total value of goods produced in a country' },
  { term: 'Inflation', definition: 'Rate at which general price levels rise over time' },
  { term: 'ROI', definition: 'Return on Investment - measure of profitability' },
  { term: 'EBITDA', definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization' },
  { term: 'Liquidity', definition: 'How easily an asset can be converted to cash' },
  { term: 'Bear Market', definition: 'Market condition where prices are falling or expected to fall' }
];

export function LearningHub({ compact = false }: { compact?: boolean }) {
  const [showQuiz, setShowQuiz] = useState(false);
  
  if (compact) {
    return (
      <div className="space-y-4">
        {/* Progress Overview */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Your Progress</h3>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Overall Progress</span>
                <span className="text-gray-900">32%</span>
              </div>
              <Progress value={32} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="text-center">
                <div className="text-2xl text-gray-900">12</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-gray-900">8</div>
                <div className="text-xs text-gray-500">In Progress</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Today's Challenge */}
        <Card className="p-5 bg-gradient-to-br from-purple-500 to-blue-600 text-white border-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-purple-100 mb-1">Daily Challenge</p>
              <h3 className="text-white">Economic Quiz</h3>
            </div>
            <Award className="w-6 h-6 text-yellow-300" />
          </div>
          <p className="text-sm text-purple-100 mb-4">Test your knowledge and earn points!</p>
          <Button variant="secondary" size="sm" className="w-full">
            Start Challenge
          </Button>
        </Card>

        {/* Quick Lessons */}
        <Card className="p-5">
          <h3 className="text-gray-900 mb-3">Continue Learning</h3>
          <div className="space-y-2">
            {lessons.slice(0, 3).map((lesson) => (
              <div key={lesson.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{lesson.title}</p>
                  {lesson.progress > 0 && (
                    <Progress value={lesson.progress} className="h-1 mt-1" />
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (showQuiz) {
    return <QuizComponent onClose={() => setShowQuiz(false)} />;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Learning Hub</h2>
        <p className="text-sm text-gray-500">Master economics, finance, and accounting at your own pace</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-900">Courses Completed</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl text-gray-900">12</div>
          <p className="text-sm text-gray-500 mt-1">+3 this week</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-900">Study Streak</h3>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl text-gray-900">7 days</div>
          <p className="text-sm text-gray-500 mt-1">Keep it up!</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-900">Quiz Score</h3>
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl text-gray-900">85%</div>
          <p className="text-sm text-gray-500 mt-1">Average score</p>
        </Card>
      </div>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-0">
          <div className="grid md:grid-cols-2 gap-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="p-5 relative">
                {lesson.locked && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Complete previous lessons</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">{lesson.category}</Badge>
                  <Badge variant="outline" className="text-xs">{lesson.level}</Badge>
                </div>

                <h3 className="text-gray-900 mb-2">{lesson.title}</h3>
                
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {lesson.lessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <PlayCircle className="w-4 h-4" />
                    {lesson.duration}
                  </span>
                </div>

                {lesson.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-900">{lesson.progress}%</span>
                    </div>
                    <Progress value={lesson.progress} className="h-2" />
                  </div>
                )}

                <Button 
                  className="w-full" 
                  variant={lesson.completed ? "outline" : "default"}
                  disabled={lesson.locked}
                >
                  {lesson.completed ? 'Review' : lesson.progress > 0 ? 'Continue' : 'Start Lesson'}
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flashcards" className="mt-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyTerms.map((item, index) => (
              <Card key={index} className="p-5 cursor-pointer hover:shadow-md transition-shadow">
                <div className="text-center">
                  <h3 className="text-gray-900 mb-3">{item.term}</h3>
                  <p className="text-sm text-gray-600">{item.definition}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="mt-0">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setShowQuiz(true)}>
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-blue-600">New</Badge>
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-gray-900 mb-2">Daily Economics Quiz</h3>
              <p className="text-sm text-gray-600 mb-4">Test your knowledge with 10 questions</p>
              <Button className="w-full">Start Quiz</Button>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary">Completed</Badge>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-900 mb-2">Financial Ratios Quiz</h3>
              <p className="text-sm text-gray-600 mb-2">Your score: 85%</p>
              <p className="text-xs text-gray-500 mb-4">Completed yesterday</p>
              <Button variant="outline" className="w-full">Review Answers</Button>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary">Completed</Badge>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-900 mb-2">Accounting Basics Quiz</h3>
              <p className="text-sm text-gray-600 mb-2">Your score: 92%</p>
              <p className="text-xs text-gray-500 mb-4">Completed 2 days ago</p>
              <Button variant="outline" className="w-full">Review Answers</Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
