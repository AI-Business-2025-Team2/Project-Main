import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { X, CheckCircle, XCircle, Award } from 'lucide-react';
import { useState } from 'react';

const quizQuestions = [
  {
    id: 1,
    question: 'What does GDP stand for?',
    options: [
      'Gross Domestic Product',
      'General Development Plan',
      'Global Distribution Process',
      'Government Debt Portfolio'
    ],
    correctAnswer: 0,
    explanation: 'GDP stands for Gross Domestic Product, which measures the total value of all goods and services produced within a country.'
  },
  {
    id: 2,
    question: 'Which financial statement shows a company\'s assets, liabilities, and equity?',
    options: [
      'Income Statement',
      'Cash Flow Statement',
      'Balance Sheet',
      'Statement of Retained Earnings'
    ],
    correctAnswer: 2,
    explanation: 'The Balance Sheet provides a snapshot of a company\'s financial position at a specific point in time, showing what it owns (assets) and owes (liabilities and equity).'
  },
  {
    id: 3,
    question: 'What is the formula for calculating ROI (Return on Investment)?',
    options: [
      '(Revenue / Cost) × 100',
      '(Net Profit / Cost of Investment) × 100',
      '(Total Sales / Investment) × 100',
      '(Profit Margin / Investment) × 100'
    ],
    correctAnswer: 1,
    explanation: 'ROI is calculated as (Net Profit / Cost of Investment) × 100. This shows the percentage return on your investment.'
  },
  {
    id: 4,
    question: 'What is inflation?',
    options: [
      'The rate at which prices decrease over time',
      'The rate at which the economy grows',
      'The rate at which prices increase over time',
      'The rate at which unemployment rises'
    ],
    correctAnswer: 2,
    explanation: 'Inflation is the rate at which the general level of prices for goods and services rises, causing purchasing power to fall.'
  },
  {
    id: 5,
    question: 'Which accounting equation must always balance?',
    options: [
      'Revenue - Expenses = Profit',
      'Assets = Liabilities + Equity',
      'Income - Costs = Net Profit',
      'Sales - Returns = Net Sales'
    ],
    correctAnswer: 1,
    explanation: 'The fundamental accounting equation is Assets = Liabilities + Equity. This must always be in balance.'
  }
];

interface QuizComponentProps {
  onClose: () => void;
}

export function QuizComponent({ onClose }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  if (quizCompleted) {
    const percentage = (score / quizQuestions.length) * 100;
    
    return (
      <Card className="max-w-2xl mx-auto p-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-gray-900 mb-2">Quiz Completed! 🎉</h2>
          <p className="text-gray-600 mb-6">Great job on completing the quiz!</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl text-blue-600">{score}</div>
              <div className="text-sm text-gray-600 mt-1">Correct</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-3xl text-red-600">{quizQuestions.length - score}</div>
              <div className="text-sm text-gray-600 mt-1">Incorrect</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-3xl text-green-600">{percentage.toFixed(0)}%</div>
              <div className="text-sm text-gray-600 mt-1">Score</div>
            </div>
          </div>
          
          {percentage >= 80 ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="text-green-800">Excellent work! You have a strong understanding of these concepts.</p>
            </div>
          ) : percentage >= 60 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
              <p className="text-yellow-800">Good job! Consider reviewing the topics you missed.</p>
            </div>
          ) : (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-6">
              <p className="text-orange-800">Keep practicing! Review the lessons and try again.</p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Back to Learning
            </Button>
            <Button className="flex-1" onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setScore(0);
              setAnsweredQuestions([]);
              setQuizCompleted(false);
            }}>
              Retake Quiz
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900">Daily Economics Quiz</h2>
            <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {quizQuestions.length}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="p-6">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-3">Economics</Badge>
          <h3 className="text-gray-900 mb-4">{question.question}</h3>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showResult = showExplanation;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
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
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <h4 className="text-gray-900 mb-2">Explanation</h4>
            <p className="text-sm text-gray-700">{question.explanation}</p>
          </div>
        )}

        <div className="flex gap-3">
          {!showExplanation ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="w-full"
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="w-full">
              {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
