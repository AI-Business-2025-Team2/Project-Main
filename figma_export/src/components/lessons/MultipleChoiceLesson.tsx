import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, Lightbulb, Sparkles } from 'lucide-react';

const questions = [
  {
    question: '한국은행의 기준금리가 하는 역할은 무엇일까요?',
    options: [
      '세금을 걷어요',
      '시중 금리의 기준이 되어 경제를 조절해요',
      '정부 예산을 승인해요',
      '국제 무역을 규제해요'
    ],
    correctAnswer: 1,
    explanation: '기준금리는 한국은행이 시중 은행에 돈을 빌려줄 때 적용하는 금리로, 시중 금리 전반에 영향을 미쳐 경제를 조절하는 중요한 수단이에요.'
  },
  {
    question: '물가상승률이 높아지면 어떤 일이 일어날까요?',
    options: [
      '물건 가격이 떨어져요',
      '돈의 가치가 올라가요',
      '같은 돈으로 살 수 있는 물건이 줄어들어요',
      '주가가 항상 올라가요'
    ],
    correctAnswer: 2,
    explanation: '물가상승률이 높다는 것은 물건 가격이 오른다는 뜻이에요. 그러면 같은 돈으로 예전보다 적은 물건을 살 수 있게 되죠.'
  },
  {
    question: 'GDP(국내총생산)는 무엇을 측정하는 지표일까요?',
    options: [
      '실업률',
      '한 나라의 경제 규모와 성장',
      '물가 수준',
      '금리'
    ],
    correctAnswer: 1,
    explanation: 'GDP는 일정 기간 동안 한 나라에서 생산된 모든 재화와 서비스의 가치를 합한 것으로, 경제 규모와 성장을 나타내는 가장 중요한 지표예요.'
  }
];

interface MultipleChoiceLessonProps {
  keyTerms: string[];
  onComplete: (xp: number, correct: boolean) => void;
}

export function MultipleChoiceLesson({ keyTerms, onComplete }: MultipleChoiceLessonProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
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
          객관식 문제
          <Sparkles className="w-5 h-5 text-purple-600" />
        </h2>
        <p className="text-sm text-gray-600">정답을 골라보세요! 🎯</p>
        <p className="text-xs text-gray-500 mt-2 bg-purple-100 px-4 py-2 rounded-full inline-block">
          문제 {currentQuestion + 1} / {questions.length}
        </p>
      </div>

      <Card className="p-6 mb-6 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 border-4 border-purple-200 rounded-3xl shadow-lg">
        <h3 className="text-gray-900 leading-relaxed">{question.question}</h3>
      </Card>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === question.correctAnswer;

          return (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(index)}
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
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  showResult && isCorrectOption
                    ? 'border-green-500 bg-green-500'
                    : isSelected
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300'
                }`}>
                  {(showResult && isCorrectOption) || (isSelected && !showResult) ? (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  ) : null}
                </div>
                <span className="flex-1 text-gray-900">{option}</span>
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
        <Card className="p-5 mb-6 bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-purple-200 rounded-3xl shadow-lg animate-fade-in">
          <div className="flex gap-3">
            <div className="p-2 bg-white rounded-2xl shadow-sm">
              <Lightbulb className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-gray-900 mb-2">
                {isCorrect ? '🎉 정답이에요! 잘했어요!' : '💡 아쉬워요! 이렇게 이해하면 돼요:'}
              </h4>
              <p className="text-sm text-gray-800 bg-white/70 p-3 rounded-2xl">{question.explanation}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-purple-100 p-4">
        <div className="max-w-md mx-auto">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              정답 확인하기!
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95" 
              size="lg"
            >
              {currentQuestion < questions.length - 1 ? '✨ 다음 문제' : '🎉 계속하기'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
