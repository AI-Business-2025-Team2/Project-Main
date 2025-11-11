import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ArrowLeft, Zap, Award, Star, Sparkles, Trophy, PartyPopper } from 'lucide-react';
import { FlashcardLesson } from './lessons/FlashcardLesson';
import { FillInBlankLesson } from './lessons/FillInBlankLesson';
import { MultipleChoiceLesson } from './lessons/MultipleChoiceLesson';
import { MatchingLesson } from './lessons/MatchingLesson';

interface Lesson {
  id: number;
  title: string;
  xp: number;
  keyTerms: string[];
}

interface LessonFlowProps {
  lesson: Lesson;
  onComplete: (earnedXP: number) => void;
}

type LessonType = 'intro' | 'flashcard' | 'fillblank' | 'multiplechoice' | 'matching' | 'complete';

export function LessonFlow({ lesson, onComplete }: LessonFlowProps) {
  const [currentStep, setCurrentStep] = useState<LessonType>('intro');
  const [earnedXP, setEarnedXP] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const lessonSteps: LessonType[] = ['intro', 'flashcard', 'fillblank', 'multiplechoice', 'matching', 'complete'];
  const currentStepIndex = lessonSteps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / lessonSteps.length) * 100;

  const handleStepComplete = (xpEarned: number = 10, correct: boolean = true) => {
    setEarnedXP(prev => prev + xpEarned);
    setTotalQuestions(prev => prev + 1);
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < lessonSteps.length) {
      setCurrentStep(lessonSteps[nextIndex]);
    }
  };

  // Intro Screen
  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100">
        <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-purple-100 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => onComplete(0)} className="p-2 -ml-2 hover:bg-purple-100 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95">
              <ArrowLeft className="w-6 h-6 text-purple-900" />
            </button>
            <h2 className="text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              시작해볼까요!
            </h2>
            <div className="w-8" />
          </div>
        </header>

        <div className="p-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="p-8 text-center max-w-sm bg-white border-4 border-purple-200 rounded-3xl shadow-2xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
              <Star className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-gray-900 mb-4">✨ 학습 준비 완료!</h2>
            
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 px-4 py-2 rounded-full shadow-md">
                <Zap className="w-5 h-5" />
                <span>+{lesson.xp} XP</span>
              </div>
              <div className="text-sm text-gray-600 bg-purple-100 px-4 py-2 rounded-full">⏱️ ~5분</div>
            </div>

            <div className="mb-6">
              <h3 className="text-gray-900 mb-3">🎯 이런 개념을 배울 거예요:</h3>
              <div className="space-y-2">
                {lesson.keyTerms.slice(0, 4).map((term, index) => (
                  <div key={index} className="flex items-center gap-3 text-left bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-2xl border-2 border-purple-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white">{index + 1}</span>
                    </div>
                    <span className="text-gray-800">{term}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => handleStepComplete(0, true)} 
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              시작하기!
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (currentStep === 'complete') {
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="p-4 flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center max-w-sm bg-white border-4 border-amber-300 rounded-3xl shadow-2xl">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 flex items-center justify-center mx-auto mb-6 animate-bounce shadow-xl">
              <Trophy className="w-14 h-14 text-white" />
            </div>

            <h2 className="text-gray-900 mb-2">🎉 완벽해요!</h2>
            <p className="text-gray-600 mb-6">경제 전문가가 되어가고 있어요! 🌟</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl border-2 border-purple-300 transform hover:scale-105 transition-transform">
                <div className="text-purple-600">{correctAnswers}</div>
                <div className="text-xs text-purple-800 mt-1">✅ 정답</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl border-2 border-green-300 transform hover:scale-105 transition-transform">
                <div className="text-green-600">{accuracy}%</div>
                <div className="text-xs text-green-800 mt-1">🎯 정확도</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl border-2 border-amber-300 transform hover:scale-105 transition-transform">
                <div className="text-amber-600">+{earnedXP}</div>
                <div className="text-xs text-amber-800 mt-1">⚡ XP</div>
              </div>
            </div>

            {accuracy >= 80 ? (
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 rounded-2xl mb-6">
                <p className="text-green-900">🌟 훌륭해요! 정말 잘하고 있어요!</p>
              </div>
            ) : (
              <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300 rounded-2xl mb-6">
                <p className="text-orange-900">💪 좋아요! 계속 연습하면 더 잘할 수 있어요!</p>
              </div>
            )}

            <Button 
              onClick={() => onComplete(earnedXP)} 
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95" 
              size="lg"
            >
              <PartyPopper className="w-5 h-5 mr-2" />
              학습 계속하기!
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Lesson Steps
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-purple-100 z-10 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => onComplete(0)} className="p-2 -ml-2 hover:bg-purple-100 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95">
              <ArrowLeft className="w-6 h-6 text-purple-900" />
            </button>
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-full shadow-md">
              <Zap className="w-5 h-5 text-amber-600 animate-pulse" />
              <span className="text-amber-900">+{earnedXP} XP</span>
            </div>
          </div>
          <Progress value={progress} className="h-3 rounded-full" />
          <p className="text-xs text-center text-gray-600 mt-2">단계 {currentStepIndex + 1} / {lessonSteps.length}</p>
        </div>
      </header>

      <div className="p-4">
        {currentStep === 'flashcard' && (
          <FlashcardLesson 
            keyTerms={lesson.keyTerms} 
            onComplete={handleStepComplete}
          />
        )}
        {currentStep === 'fillblank' && (
          <FillInBlankLesson 
            keyTerms={lesson.keyTerms}
            onComplete={handleStepComplete}
          />
        )}
        {currentStep === 'multiplechoice' && (
          <MultipleChoiceLesson 
            keyTerms={lesson.keyTerms}
            onComplete={handleStepComplete}
          />
        )}
        {currentStep === 'matching' && (
          <MatchingLesson 
            keyTerms={lesson.keyTerms}
            onComplete={handleStepComplete}
          />
        )}
      </div>
    </div>
  );
}