import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Bell, Bookmark, TrendingUp, Clock, Lightbulb, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArticleDetail } from './ArticleDetail';

const newsArticles = [
  {
    id: 1,
    title: 'Federal Reserve Signals Rate Cuts as Inflation Cools',
    source: 'Bloomberg',
    category: 'Monetary Policy',
    time: '2h ago',
    summary: 'The Federal Reserve indicated a potential shift in monetary policy, suggesting interest rate reductions may be on the horizon as inflation data shows sustained cooling.',
    keyTerms: ['Federal Reserve', 'interest rate', 'inflation', 'monetary policy'],
    readTime: '4 min read',
    trending: true
  },
  {
    id: 2,
    title: 'IMF Raises Global GDP Growth Forecast',
    source: 'Reuters',
    category: 'Economics',
    time: '5h ago',
    summary: 'The International Monetary Fund has revised its global economic outlook upward, citing stronger-than-expected performance in emerging markets.',
    keyTerms: ['IMF', 'GDP', 'economic growth', 'emerging markets'],
    readTime: '3 min read',
    trending: true
  },
  {
    id: 3,
    title: 'Tech Earnings Drive Market Rally',
    source: 'Financial Times',
    category: 'Markets',
    time: '8h ago',
    summary: 'Major technology companies exceeded earnings expectations, pushing major stock indices to record highs amid renewed investor confidence.',
    keyTerms: ['earnings', 'stock market', 'investor confidence', 'equity'],
    readTime: '5 min read',
    trending: false
  },
  {
    id: 4,
    title: 'Understanding New IFRS 17 Standards',
    source: 'The Economist',
    category: 'Accounting',
    time: '12h ago',
    summary: 'Insurance companies face significant changes in financial reporting as IFRS 17 implementation continues globally.',
    keyTerms: ['IFRS', 'financial reporting', 'accounting standards', 'compliance'],
    readTime: '6 min read',
    trending: false
  },
  {
    id: 5,
    title: 'Central Banks Face Inflation Dilemma',
    source: 'Bloomberg',
    category: 'Economics',
    time: '1d ago',
    summary: 'Central banks worldwide are navigating the challenging balance between controlling inflation and supporting economic growth.',
    keyTerms: ['central bank', 'inflation', 'economic growth', 'fiscal policy'],
    readTime: '4 min read',
    trending: false
  }
];

export function NewsFeedMobile() {
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<typeof newsArticles[0] | null>(null);

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (selectedArticle) {
    return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-gray-900">Economic News</h1>
              <p className="text-xs text-gray-500">Learn while you read</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600 text-white text-sm">U</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Concepts learned today</p>
              <p className="text-gray-900">5 new terms</p>
            </div>
            <Badge className="bg-blue-600">+12 pts</Badge>
          </div>
        </div>
      </header>

      {/* Quick Filter */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar bg-white border-b border-gray-100">
        <Badge variant="default" className="whitespace-nowrap">All News</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Monetary Policy</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Markets</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Economics</Badge>
        <Badge variant="outline" className="whitespace-nowrap">Accounting</Badge>
      </div>

      {/* News Feed */}
      <div className="p-4 space-y-4">
        {/* Today's Digest */}
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">📊 Today's Digest</h3>
              <p className="text-sm text-gray-600 mb-3">
                Markets rally on Fed comments • GDP forecasts revised • Tech earnings strong
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Read Summary
              </Button>
            </div>
          </div>
        </Card>

        {/* News Articles */}
        {newsArticles.map((article) => (
          <Card 
            key={article.id} 
            className="p-4 active:bg-gray-50 transition-colors"
            onClick={() => setSelectedArticle(article)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                {article.trending && (
                  <Badge className="bg-red-500 text-xs gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </Badge>
                )}
              </div>
              <button
                onClick={(e) => toggleBookmark(article.id, e)}
                className={bookmarked.includes(article.id) ? 'text-blue-600' : 'text-gray-400'}
              >
                <Bookmark 
                  className="w-5 h-5" 
                  fill={bookmarked.includes(article.id) ? 'currentColor' : 'none'} 
                />
              </button>
            </div>

            <h3 className="text-gray-900 mb-2">{article.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.summary}</p>

            {/* Key Terms Preview */}
            <div className="flex flex-wrap gap-1 mb-3">
              {article.keyTerms.slice(0, 3).map((term, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                >
                  <Lightbulb className="w-3 h-3" />
                  {term}
                </span>
              ))}
              {article.keyTerms.length > 3 && (
                <span className="px-2 py-1 text-blue-600 text-xs">
                  +{article.keyTerms.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span>{article.source}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.time}
                </span>
              </div>
              <span className="flex items-center gap-1 text-blue-600">
                {article.readTime}
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
