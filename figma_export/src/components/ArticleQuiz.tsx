import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, CheckCircle, XCircle, Award, Trophy } from 'lucide-react';
import { useState } from 'react';

interface Article {
  id: number;
  title: string;
  keyTerms: string[];
}

interface ArticleQuizProps {
  article: Article;
  onBack: () => void;
}

const quizQuestions = [
  {
    question: 'What is the primary role of the Federal Reserve?',
    options: [
      'Regulate international trade',
      'Set monetary policy and maintain financial stability',
      'Collect federal taxes',
      'Approve government budgets'
    ],
    correctAnswer: 1,
    explanation: 'The Federal Reserve is the central bank of the United States, responsible for monetary policy, regulating banks, and maintaining financial stability.'
  },
  {
    question: 'When interest rates rise, what typically happens to borrowing?',
    options: [
      'Borrowing becomes cheaper',
      'Borrowing becomes more expensive',
      'Borrowing rates stay the same',
      'Only business loans are affected'
    ],
    correctAnswer: 1,
    explanation: 'Higher interest rates make borrowing more expensive for consumers and businesses, which can slow economic activity.'
  },
  {
    question: 'What does sustained cooling inflation mean?',
    options: [
      'Prices are rising faster',
      'Prices are falling rapidly (deflation)',
      'The rate of price increases is slowing down',
      'Economic growth is accelerating'
    ],
    correctAnswer: 2,
    explanation: 'Cooling inflation means the rate at which prices are rising is decreasing, though prices are still increasing, just at a slower pace.'
  }
];

export function ArticleQuiz({ article, onBack }: ArticleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    const percentage = (score / quizQuestions.length) * 100;
    const points = score * 10;

    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-white border-b border-gray-200">
          <div className="flex items-center px-4 py-3">
            <button onClick={onBack} className="p-2 -ml-2">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h2 className="text-gray-900 ml-2">Quiz Results</h2>
          </div>
        </header>

        <div className="p-4">
          <div className="text-center py-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
              {percentage >= 70 ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <Award className="w-12 h-12 text-white" />
              )}
            </div>
            
            <h2 className="text-gray-900 mb-2">
              {percentage >= 70 ? 'Great Job! 🎉' : 'Keep Learning! 📚'}
            </h2>
            <p className="text-gray-600 mb-8">
              {percentage >= 70 
                ? 'You have a solid understanding of these concepts!' 
                : 'Review the concepts and try again to improve your score.'}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="p-4">
                <div className="text-3xl text-blue-600">{score}</div>
                <div className="text-xs text-gray-600 mt-1">Correct</div>
              </Card>
              <Card className="p-4">
                <div className="text-3xl text-gray-900">{percentage.toFixed(0)}%</div>
                <div className="text-xs text-gray-600 mt-1">Score</div>
              </Card>
              <Card className="p-4">
                <div className="text-3xl text-green-600">+{points}</div>
                <div className="text-xs text-gray-600 mt-1">Points</div>
              </Card>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200 mb-6 text-left">
              <h3 className="text-gray-900 mb-2">📚 Key Takeaways</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {article.keyTerms.slice(0, 3).map((term, index) => (
                  <li key={index}>• Understanding {term}</li>
                ))}
              </ul>
            </Card>

            <div className="space-y-3">
              <Button onClick={onBack} className="w-full">
                Back to Article
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                  setScore(0);
                  setCompleted(false);
                }}
              >
                Retake Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={onBack} className="p-2 -ml-2">
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <Badge variant="secondary">
              Question {currentQuestion + 1}/{quizQuestions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <div className="p-4">
        <Card className="p-6 mb-6">
          <h3 className="text-gray-900 mb-6">{question.question}</h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showResult = showExplanation;

              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && setSelectedAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : isSelected
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white active:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {showExplanation && (
          <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
            <h4 className="text-gray-900 mb-2">💡 Explanation</h4>
            <p className="text-sm text-gray-700">{question.explanation}</p>
          </Card>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-md mx-auto">
            {!showExplanation ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="w-full"
                size="lg"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext} className="w-full" size="lg">
                {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
