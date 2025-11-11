import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, Sparkles } from 'lucide-react';

const sentences = [
  {
    text: '___은(는) 통화정책을 설정하여 물가를 조절하고 경제 성장을 지원해요.',
    blank: '한국은행',
    options: ['한국은행', '기획재정부', '국회', '금융위원회']
  },
  {
    text: '___이(가) 상승하면 돈의 구매력이 시간이 지날수록 감소해요.',
    blank: '물가',
    options: ['물가', '디플레이션', '금리', 'GDP']
  },
  {
    text: '중앙은행은 ___을(를) 사용하여 통화량과 금리에 영향을 미쳐요.',
    blank: '통화정책',
    options: ['통화정책', '재정정책', '무역정책', '조세정책']
  },
  {
    text: '___이(가) 높아지면 소비자와 기업의 대출 비용이 더 비싸져요.',
    blank: '금리',
    options: ['금리', '세율', '실업률', '환율']
  }
];

interface FillInBlankLessonProps {
  keyTerms: string[];
  onComplete: (xp: number, correct: boolean) => void;
}

export function FillInBlankLesson({ keyTerms, onComplete }: FillInBlankLessonProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = sentences[currentQuestion];
  const isCorrect = selectedAnswer === question.blank;

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < sentences.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onComplete(15, isCorrect);
    }
  };

  return (
    <div className="max-w-md mx-auto pb-24">
      <div className="mb-6 text-center">
        <h2 className="text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          빈칸 채우기
          <Sparkles className="w-5 h-5 text-purple-600" />
        </h2>
        <p className="text-sm text-gray-600">
          알맞은 용어로 문장을 완성하세요! ✏️
        </p>
        <p className="text-xs text-gray-500 mt-2 bg-purple-100 px-4 py-2 rounded-full inline-block">
          문제 {currentQuestion + 1} / {sentences.length}
        </p>
      </div>

      <Card className="p-6 mb-6 border-4 border-purple-200 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
        <p className="text-gray-900 leading-relaxed text-center">
          {question.text.split('___').map((part, index) => (
            <span key={index}>
              {part}
              {index < question.text.split('___').length - 1 && (
                <span className="inline-block min-w-[120px] mx-1 px-3 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border-b-4 border-purple-500 rounded-xl shadow-md">
                  {selectedAnswer || '___'}
                </span>
              )}
            </span>
          ))}
        </p>
      </Card>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === question.blank;

          return (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(option)}
              disabled={showResult}
              className={`w-full p-4 rounded-2xl border-4 text-left transition-all duration-300 transform ${
                showResult
                  ? isCorrectOption
                    ? 'border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 scale-105'
                    : isSelected && !isCorrect
                    ? 'border-red-400 bg-gradient-to-r from-red-100 to-rose-100'
                    : 'border-gray-200 bg-white opacity-50'
                  : isSelected
                  ? 'border-purple-400 bg-gradient-to-r from-purple-100 to-pink-100 scale-105 shadow-lg'
                  : 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-md hover:scale-105 active:scale-95'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{option}</span>
                {showResult && isCorrectOption && (
                  <CheckCircle className="w-6 h-6 text-green-500 animate-bounce" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <Card className={`p-4 mb-6 rounded-3xl border-4 animate-fade-in ${
          isCorrect 
            ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-300' 
            : 'bg-gradient-to-br from-orange-100 to-amber-100 border-orange-300'
        }`}>
          <p className={`text-sm ${isCorrect ? 'text-green-900' : 'text-orange-900'}`}>
            {isCorrect 
              ? '✨ 완벽해요! 정답이에요! 🎉' 
              : `정답은 "${question.blank}"이에요. 계속 배워가요! 💪`}
          </p>
        </Card>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-purple-100 p-4">
        <div className="max-w-md mx-auto">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              정답 확인하기!
            </Button>
          ) : (
            <Button onClick={handleNext} className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95" size="lg">
              {currentQuestion < sentences.length - 1 ? '✨ 다음 문제' : '🎉 계속하기'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
