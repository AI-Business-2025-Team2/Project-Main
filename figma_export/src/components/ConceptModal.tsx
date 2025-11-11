import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Lightbulb, CheckCircle, BookOpen, Link2 } from 'lucide-react';

interface ConceptModalProps {
  term: string;
  data: {
    definition: string;
    example: string;
    relatedTerms: string[];
  };
  onClose: () => void;
  onMarkLearned: (term: string) => void;
  isLearned: boolean;
}

export function ConceptModal({ term, data, onClose, onMarkLearned, isLearned }: ConceptModalProps) {
  const handleMarkLearned = () => {
    onMarkLearned(term);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center">
      <div 
        className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-gray-900">{term}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Definition */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <h4 className="text-gray-900">Definition</h4>
            </div>
            <p className="text-gray-700 leading-relaxed">{data.definition}</p>
          </div>

          {/* Example */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-gray-500" />
              <h4 className="text-gray-900">Example</h4>
            </div>
            <Card className="p-3 bg-blue-50 border-blue-200">
              <p className="text-sm text-gray-700">{data.example}</p>
            </Card>
          </div>

          {/* Related Terms */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-4 h-4 text-gray-500" />
              <h4 className="text-gray-900">Related Concepts</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.relatedTerms.map((relatedTerm, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-50">
                  {relatedTerm}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {isLearned ? (
            <Button variant="outline" className="w-full gap-2" disabled>
              <CheckCircle className="w-4 h-4 text-green-500" />
              Concept Learned
            </Button>
          ) : (
            <Button onClick={handleMarkLearned} className="w-full gap-2">
              <CheckCircle className="w-4 h-4" />
              Mark as Learned
            </Button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
