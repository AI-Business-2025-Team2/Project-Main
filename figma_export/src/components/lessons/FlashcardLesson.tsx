import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { RotateCw, ChevronRight, Sparkles } from 'lucide-react';

const conceptData: Record<string, { definition: string; example: string }> = {
  '기준금리': {
    definition: '중앙은행이 금융기관에 돈을 빌려줄 때 적용하는 기준이 되는 금리예요.',
    example: '한국은행이 기준금리를 3.5%로 정하면, 시중 은행들의 대출 금리도 함께 영향을 받아요.'
  },
  '통화정책': {
    definition: '중앙은행이 통화량과 금리를 조절하여 물가와 경제를 안정시키는 정책이에요.',
    example: '물가가 너무 오르면 한국은행이 금리를 올려서 돈의 흐름을 조절해요.'
  },
  '물가상승률': {
    definition: '일정 기간 동안 물가 수준이 얼마나 상승했는지 나타내는 비율이에요.',
    example: '물가상승률이 3%라면, 작년에 1만원이던 물건이 올해는 1만 300원이 됐다는 뜻이에요.'
  },
  '코스피': {
    definition: '한국 주식시장의 대표 지수로, 상장 기업들의 주가를 종합한 지표예요.',
    example: '코스피가 2,700포인트라는 것은 한국 주식시장 전체의 가치를 숫자로 나타낸 거예요.'
  },
  'GDP': {
    definition: '국내총생산으로, 한 나라에서 일정 기간 생산된 모든 재화와 서비스의 가치예요.',
    example: '한국의 GDP가 3% 성장했다는 것은 경제 규모가 작년보다 3% 커졌다는 의미예요.'
  },
  '영업이익': {
    definition: '기업이 주된 영업활동으로 벌어들인 이익이에요.',
    example: '삼성전자가 영업이익 8조 원을 기록했다는 것은 본업인 제품 판매로 8조 원의 이익을 냈다는 뜻이에요.'
  },
  'K-IFRS': {
    definition: '한국에서 적용되는 국제회계기준으로, 기업의 재무제표를 작성하는 규칙이에요.',
    example: 'K-IFRS를 따르면 전 세계 투자자들이 한국 기업의 재무 상태를 쉽게 이해할 수 있어요.'
  },
  '가상자산': {
    definition: '블록체인 기술을 기반으로 발행되고 거래되는 디지털 형태의 자산이에요.',
    example: '비트코인, 이더리움 같은 암호화폐가 대표적인 가상자산이에요.'
  }
};

interface FlashcardLessonProps {
  keyTerms: string[];
  onComplete: (xp: number, correct: boolean) => void;
}

export function FlashcardLesson({ keyTerms, onComplete }: FlashcardLessonProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const availableTerms = keyTerms.filter(term => conceptData[term]);
  const currentTerm = availableTerms[currentCardIndex];
  const data = conceptData[currentTerm];

  const handleNext = () => {
    if (currentCardIndex < availableTerms.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      onComplete(15, true);
    }
  };

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">이 용어들의 플래시카드가 준비 중이에요.</p>
        <Button onClick={() => onComplete(0, true)} className="mt-4">계속하기</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          핵심 용어 학습
          <Sparkles className="w-5 h-5 text-purple-600" />
        </h2>
        <p className="text-sm text-gray-600 bg-purple-100 px-4 py-2 rounded-full inline-block">
          카드 {currentCardIndex + 1} / {availableTerms.length} 📚
        </p>
      </div>

      {/* Flashcard */}
      <div 
        className="perspective-1000 mb-8 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-80 transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <Card className={`absolute inset-0 p-8 flex flex-col items-center justify-center backface-hidden border-4 border-purple-200 rounded-3xl bg-gradient-to-br from-white to-purple-50 shadow-xl ${isFlipped ? 'hidden' : ''}`}>
            <div className="text-center">
              <p className="text-sm text-purple-600 mb-4 bg-purple-100 px-4 py-2 rounded-full inline-block">💡 용어</p>
              <h2 className="text-gray-900 mb-8">{currentTerm}</h2>
              <div className="flex items-center justify-center gap-2 text-purple-600 bg-purple-100 px-4 py-3 rounded-2xl">
                <RotateCw className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-sm">탭해서 뜻 보기! ✨</span>
              </div>
            </div>
          </Card>

          {/* Back */}
          <Card className={`absolute inset-0 p-8 flex flex-col justify-center backface-hidden bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-300 rounded-3xl shadow-xl ${!isFlipped ? 'hidden' : ''}`}>
            <div>
              <p className="text-sm text-purple-700 mb-3 bg-white px-3 py-2 rounded-full inline-block">📖 뜻</p>
              <p className="text-gray-900 mb-6 bg-white/70 p-4 rounded-2xl">{data.definition}</p>
              
              <p className="text-sm text-purple-700 mb-3 bg-white px-3 py-2 rounded-full inline-block">💡 예시</p>
              <p className="text-sm text-gray-800 italic bg-white p-4 rounded-2xl border-2 border-purple-200">
                "{data.example}"
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {!isFlipped && (
          <Button 
            variant="outline" 
            onClick={() => setIsFlipped(true)} 
            className="w-full rounded-2xl border-2 border-purple-300 hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            size="lg"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            정답 확인하기 🎯
          </Button>
        )}
        
        {isFlipped && (
          <Button 
            onClick={handleNext} 
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            size="lg"
          >
            {currentCardIndex < availableTerms.length - 1 ? '✨ 다음 카드' : '🎉 계속하기'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
