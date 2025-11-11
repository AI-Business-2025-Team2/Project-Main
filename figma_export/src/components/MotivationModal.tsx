import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Sparkles, Heart, Flame } from 'lucide-react';
import studyingPenguin from 'figma:asset/1e1ceeb224e0593417129a2f2dfeca5bf03874ac.png';
import cryingPenguin from 'figma:asset/259d069f072671c1f338e939eba5ccd8ebcb7098.png';

interface MotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'streak' | 'comeback' | 'milestone' | 'missed';
  streak?: number;
  daysAway?: number;
}

const motivationMessages = {
  streak: {
    image: studyingPenguin,
    title: '🔥 대단해요!',
    messages: [
      '연속 학습 기록을 이어가고 있어요!',
      '정말 열심히 하고 있어요!',
      '이 기세를 유지해봐요!',
      '당신은 할 수 있어요!'
    ],
    buttonText: '계속 학습하기! 💪',
    bgGradient: 'from-orange-100 via-amber-100 to-yellow-100',
    borderColor: 'border-orange-300'
  },
  comeback: {
    image: cryingPenguin,
    title: '😢 그리웠어요...',
    messages: [
      '오랜만이에요! 다시 만나서 반가워요!',
      '펭귄이 많이 기다렸어요...',
      '오늘부터 다시 시작해봐요!',
      '포기하지 마세요! 함께 해요!'
    ],
    buttonText: '다시 시작하기! 🌟',
    bgGradient: 'from-blue-100 via-indigo-100 to-purple-100',
    borderColor: 'border-blue-300'
  },
  milestone: {
    image: studyingPenguin,
    title: '🎉 축하해요!',
    messages: [
      '멋진 이정표를 달성했어요!',
      '정말 자랑스러워요!',
      '계속 이렇게 열심히 해봐요!',
      '당신은 최고예요!'
    ],
    buttonText: '감사해요! ✨',
    bgGradient: 'from-purple-100 via-pink-100 to-rose-100',
    borderColor: 'border-purple-300'
  },
  missed: {
    image: cryingPenguin,
    title: '💙 보고 싶었어요',
    messages: [
      '어제 학습을 놓쳤네요...',
      '펭귄이 슬퍼하고 있어요 😢',
      '오늘은 함께 공부해요!',
      '다시 시작하는 건 언제나 환영이에요!'
    ],
    buttonText: '오늘 학습하기! 💝',
    bgGradient: 'from-cyan-100 via-blue-100 to-indigo-100',
    borderColor: 'border-cyan-300'
  }
};

export function MotivationModal({ isOpen, onClose, type, streak = 0, daysAway = 0 }: MotivationModalProps) {
  if (!isOpen) return null;

  const config = motivationMessages[type];
  const message = config.messages[Math.floor(Math.random() * config.messages.length)];

  const getSubtitle = () => {
    if (type === 'streak' && streak > 0) {
      return `${streak}일 연속 학습 중이에요! 🔥`;
    }
    if (type === 'comeback' && daysAway > 0) {
      return `${daysAway}일 만에 돌아오셨네요!`;
    }
    if (type === 'missed') {
      return '연속 기록이 끊어졌어요...';
    }
    return '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card 
        className={`w-full max-w-sm bg-gradient-to-br ${config.bgGradient} border-4 ${config.borderColor} rounded-3xl shadow-2xl animate-slide-up relative overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-all z-10"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Character Image */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <img 
                src={config.image} 
                alt="Penguin character" 
                className="w-48 h-48 object-contain animate-bounce-slow"
              />
              {type === 'streak' && (
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Flame className="w-6 h-6 text-white" />
                </div>
              )}
              {(type === 'comeback' || type === 'missed') && (
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-gray-900 mb-2">
            {config.title}
          </h2>

          {/* Subtitle */}
          {getSubtitle() && (
            <p className="text-sm text-gray-700 mb-3 bg-white/70 px-4 py-2 rounded-full inline-block">
              {getSubtitle()}
            </p>
          )}

          {/* Message */}
          <p className="text-gray-800 mb-6 leading-relaxed bg-white/70 p-4 rounded-2xl">
            {message}
          </p>

          {/* Special Message for Streak */}
          {type === 'streak' && streak >= 7 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-amber-200 to-orange-200 rounded-2xl border-2 border-orange-400">
              <p className="text-sm text-orange-900">
                <Sparkles className="w-4 h-4 inline mr-1" />
                일주일 연속! 정말 대단해요!
                <Sparkles className="w-4 h-4 inline ml-1" />
              </p>
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {config.buttonText}
          </Button>
        </div>
      </Card>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
