import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, Sparkles } from 'lucide-react';

const matchingPairs = [
  { term: '한국은행', definition: '대한민국의 중앙은행' },
  { term: '물가상승률', definition: '시간에 따른 물가 상승 비율' },
  { term: '금리', definition: '돈을 빌리는 데 드는 비용' },
  { term: '통화정책', definition: '통화량을 조절하는 정책' }
];

interface MatchingLessonProps {
  keyTerms: string[];
  onComplete: (xp: number, correct: boolean) => void;
}

export function MatchingLesson({ keyTerms, onComplete }: MatchingLessonProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrongMatches, setWrongMatches] = useState<string[]>([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<string[]>([]);

  useEffect(() => {
    const defs = [...matchingPairs.map(p => p.definition)];
    setShuffledDefinitions(defs.sort(() => Math.random() - 0.5));
  }, []);

  const handleTermClick = (term: string) => {
    if (matches[term]) return;
    
    if (selectedTerm === term) {
      setSelectedTerm(null);
    } else {
      setSelectedTerm(term);
      if (selectedDefinition) {
        checkMatch(term, selectedDefinition);
      }
    }
  };

  const handleDefinitionClick = (definition: string) => {
    if (Object.values(matches).includes(definition)) return;
    
    if (selectedDefinition === definition) {
      setSelectedDefinition(null);
    } else {
      setSelectedDefinition(definition);
      if (selectedTerm) {
        checkMatch(selectedTerm, definition);
      }
    }
  };

  const checkMatch = (term: string, definition: string) => {
    const correctPair = matchingPairs.find(p => p.term === term);
    
    if (correctPair && correctPair.definition === definition) {
      setMatches(prev => ({ ...prev, [term]: definition }));
      setSelectedTerm(null);
      setSelectedDefinition(null);
      setWrongMatches([]);
    } else {
      setWrongMatches([term, definition]);
      setTimeout(() => {
        setWrongMatches([]);
        setSelectedTerm(null);
        setSelectedDefinition(null);
      }, 1000);
    }
  };

  const allMatched = Object.keys(matches).length === matchingPairs.length;

  return (
    <div className="max-w-md mx-auto pb-24">
      <div className="mb-6 text-center">
        <h2 className="text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          짝 맞추기
          <Sparkles className="w-5 h-5 text-purple-600" />
        </h2>
        <p className="text-sm text-gray-600">
          용어와 정의를 연결하세요! 🔗
        </p>
        <p className="text-xs text-gray-500 mt-2 bg-purple-100 px-4 py-2 rounded-full inline-block">
          {Object.keys(matches).length} / {matchingPairs.length} 완료
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Terms Column */}
        <div className="space-y-3">
          <h3 className="text-sm text-purple-700 mb-2 bg-purple-100 px-3 py-2 rounded-full text-center">용어 📚</h3>
          {matchingPairs.map((pair) => (
            <button
              key={pair.term}
              onClick={() => handleTermClick(pair.term)}
              disabled={!!matches[pair.term]}
              className={`w-full p-3 rounded-2xl border-4 text-left transition-all duration-300 transform ${
                matches[pair.term]
                  ? 'border-green-400 bg-gradient-to-br from-green-100 to-emerald-100 scale-105 shadow-lg'
                  : wrongMatches.includes(pair.term)
                  ? 'border-red-400 bg-gradient-to-br from-red-100 to-rose-100 shake'
                  : selectedTerm === pair.term
                  ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 scale-105 shadow-lg'
                  : 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-md hover:scale-105 active:scale-95'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-900">{pair.term}</span>
                {matches[pair.term] && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 animate-bounce" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Definitions Column */}
        <div className="space-y-3">
          <h3 className="text-sm text-pink-700 mb-2 bg-pink-100 px-3 py-2 rounded-full text-center">정의 💡</h3>
          {shuffledDefinitions.map((definition, index) => {
            const isMatched = Object.values(matches).includes(definition);
            
            return (
              <button
                key={index}
                onClick={() => handleDefinitionClick(definition)}
                disabled={isMatched}
                className={`w-full p-3 rounded-2xl border-4 text-left transition-all duration-300 transform ${
                  isMatched
                    ? 'border-green-400 bg-gradient-to-br from-green-100 to-emerald-100 scale-105 shadow-lg'
                    : wrongMatches.includes(definition)
                    ? 'border-red-400 bg-gradient-to-br from-red-100 to-rose-100 shake'
                    : selectedDefinition === definition
                    ? 'border-pink-400 bg-gradient-to-br from-pink-100 to-rose-100 scale-105 shadow-lg'
                    : 'border-pink-200 bg-white hover:border-pink-300 hover:shadow-md hover:scale-105 active:scale-95'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-900">{definition}</span>
                  {isMatched && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 animate-bounce" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <Card className="p-5 mb-6 bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-300 rounded-3xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500 animate-bounce" />
            <div>
              <h4 className="text-gray-900">완벽한 매칭! 🎉</h4>
              <p className="text-sm text-gray-700">모든 짝을 정확하게 맞췄어요! 훌륭해요! ✨</p>
            </div>
          </div>
        </Card>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-purple-100 p-4">
        <div className="max-w-md mx-auto">
          <Button
            onClick={() => onComplete(20, allMatched)}
            disabled={!allMatched}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            계속하기! ✨
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.3s;
        }
      `}</style>
    </div>
  );
}
