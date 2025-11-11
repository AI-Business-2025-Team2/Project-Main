import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowLeft, Bookmark, Share2, Lightbulb, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { ConceptModal } from './ConceptModal';
import { ArticleQuiz } from './ArticleQuiz';
import { ScrollArea } from './ui/scroll-area';

interface Article {
  id: number;
  title: string;
  source: string;
  category: string;
  time: string;
  summary: string;
  keyTerms: string[];
  readTime: string;
}

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

const conceptDefinitions: Record<string, { definition: string; example: string; relatedTerms: string[] }> = {
  'Federal Reserve': {
    definition: 'The central banking system of the United States, responsible for monetary policy, regulating banks, and maintaining financial stability.',
    example: 'The Federal Reserve adjusts interest rates to control inflation and support economic growth.',
    relatedTerms: ['monetary policy', 'interest rate', 'central bank']
  },
  'interest rate': {
    definition: 'The percentage charged by a lender for borrowing money, or earned by an investor on their investment.',
    example: 'If the Fed raises interest rates to 5%, borrowing becomes more expensive, which can slow economic growth.',
    relatedTerms: ['Federal Reserve', 'monetary policy', 'inflation']
  },
  'inflation': {
    definition: 'The rate at which the general level of prices for goods and services rises, eroding purchasing power.',
    example: 'With 3% inflation, something that costs $100 today will cost about $103 next year.',
    relatedTerms: ['purchasing power', 'monetary policy', 'central bank']
  },
  'monetary policy': {
    definition: 'Actions taken by a central bank to influence the money supply and interest rates to achieve economic goals.',
    example: 'The Fed uses monetary policy tools like changing interest rates to manage inflation and unemployment.',
    relatedTerms: ['Federal Reserve', 'interest rate', 'fiscal policy']
  },
  'GDP': {
    definition: 'Gross Domestic Product - the total value of all goods and services produced within a country during a specific period.',
    example: 'US GDP grew by 2.5% last quarter, indicating healthy economic expansion.',
    relatedTerms: ['economic growth', 'productivity', 'output']
  },
  'IMF': {
    definition: 'International Monetary Fund - an organization that promotes global monetary cooperation and financial stability.',
    example: 'The IMF provides financial assistance to countries facing economic crises.',
    relatedTerms: ['World Bank', 'global economy', 'exchange rate']
  },
  'economic growth': {
    definition: 'An increase in the production of goods and services in an economy over time, typically measured by GDP.',
    example: 'Strong economic growth of 4% indicates the economy is expanding rapidly.',
    relatedTerms: ['GDP', 'productivity', 'development']
  },
  'emerging markets': {
    definition: 'Economies in developing countries that are becoming more engaged with global markets as they grow.',
    example: 'Countries like India, Brazil, and Indonesia are considered emerging markets with high growth potential.',
    relatedTerms: ['developing economy', 'economic growth', 'foreign investment']
  }
};

export function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [learnedTerms, setLearnedTerms] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const markAsLearned = (term: string) => {
    if (!learnedTerms.includes(term)) {
      setLearnedTerms([...learnedTerms, term]);
    }
  };

  const highlightTerms = (text: string) => {
    let result = text;
    article.keyTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(regex, `<mark class="highlight-term">${term}</mark>`);
    });
    return result;
  };

  if (showQuiz) {
    return <ArticleQuiz article={article} onBack={() => setShowQuiz(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setBookmarked(!bookmarked)}
              className={bookmarked ? 'text-blue-600' : 'text-gray-600'}
            >
              <Bookmark className="w-6 h-6" fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <button className="text-gray-600">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="px-4 py-6">
          {/* Article Meta */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{article.category}</Badge>
            <span className="text-xs text-gray-500">{article.source}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.time}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-gray-900 mb-4">{article.title}</h1>

          {/* Key Terms Banner */}
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Key Economic Concepts</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Tap on highlighted terms to learn more
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {learnedTerms.length}/{article.keyTerms.length} learned
                  </span>
                  <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${(learnedTerms.length / article.keyTerms.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Article Content */}
          <div className="prose prose-sm max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              {article.summary}
            </p>

            <p 
              className="text-gray-700 leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ 
                __html: highlightTerms(
                  'The Federal Reserve has indicated a potential shift in its monetary policy stance, suggesting that interest rate reductions may be on the horizon. This comes as recent inflation data has shown sustained cooling, easing concerns about persistent price pressures in the economy.'
                )
              }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('highlight-term')) {
                  const term = target.textContent || '';
                  setSelectedConcept(term);
                }
              }}
            />

            <p 
              className="text-gray-700 leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ 
                __html: highlightTerms(
                  'Fed officials have emphasized a data-dependent approach, carefully monitoring economic indicators before making any policy adjustments. The central bank\'s dual mandate of maximum employment and stable prices continues to guide their decision-making process.'
                )
              }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('highlight-term')) {
                  const term = target.textContent || '';
                  setSelectedConcept(term);
                }
              }}
            />

            <p className="text-gray-700 leading-relaxed">
              Market participants are closely watching upcoming economic releases, including employment figures and consumer price index data, which will provide further insight into the Fed's future policy trajectory.
            </p>
          </div>

          {/* Discovered Terms */}
          <Card className="p-4 mb-6">
            <h3 className="text-gray-900 mb-3">Terms in This Article</h3>
            <div className="space-y-2">
              {article.keyTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => setSelectedConcept(term)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-900">{term}</span>
                  </span>
                  {learnedTerms.includes(term) && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </ScrollArea>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={() => setShowQuiz(true)}
            className="w-full gap-2"
            size="lg"
          >
            <CheckCircle className="w-5 h-5" />
            Test Your Knowledge
          </Button>
        </div>
      </div>

      {/* Concept Modal */}
      {selectedConcept && conceptDefinitions[selectedConcept] && (
        <ConceptModal
          term={selectedConcept}
          data={conceptDefinitions[selectedConcept]}
          onClose={() => setSelectedConcept(null)}
          onMarkLearned={markAsLearned}
          isLearned={learnedTerms.includes(selectedConcept)}
        />
      )}

      <style>{`
        .highlight-term {
          background-color: #dbeafe;
          color: #1e40af;
          padding: 2px 4px;
          border-radius: 3px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .highlight-term:hover {
          background-color: #bfdbfe;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
