import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Bookmark, ExternalLink, TrendingUp, Clock, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const newsData = [
  {
    id: 1,
    title: 'Federal Reserve Signals Potential Rate Cuts in 2025',
    source: 'Bloomberg',
    category: 'Monetary Policy',
    summary: 'The Federal Reserve indicated a shift in policy stance, suggesting possible interest rate reductions as inflation shows signs of cooling.',
    time: '2 hours ago',
    trending: true,
    image: 'finance economy'
  },
  {
    id: 2,
    title: 'Global GDP Growth Projections Revised Upward',
    source: 'Reuters',
    category: 'Economics',
    summary: 'International Monetary Fund raises global economic growth forecast, citing stronger-than-expected performance in emerging markets.',
    time: '4 hours ago',
    trending: true,
    image: 'global business'
  },
  {
    id: 3,
    title: 'Tech Sector Leads Market Rally as Earnings Exceed Expectations',
    source: 'Financial Times',
    category: 'Markets',
    summary: 'Major technology companies report strong quarterly earnings, driving broader market indices to new highs.',
    time: '6 hours ago',
    trending: false,
    image: 'technology stocks'
  },
  {
    id: 4,
    title: 'Understanding IFRS 17: New Accounting Standards for Insurance',
    source: 'The Economist',
    category: 'Accounting',
    summary: 'A comprehensive look at the implementation of IFRS 17 and its impact on insurance company financial reporting.',
    time: '8 hours ago',
    trending: false,
    image: 'accounting documents'
  },
  {
    id: 5,
    title: 'Cryptocurrency Regulation: What Businesses Need to Know',
    source: 'Bloomberg',
    category: 'Finance',
    summary: 'New regulatory framework proposed for digital assets, aiming to balance innovation with investor protection.',
    time: '10 hours ago',
    trending: false,
    image: 'cryptocurrency digital'
  },
  {
    id: 6,
    title: 'Corporate Tax Reform Proposals Gain Momentum',
    source: 'Reuters',
    category: 'Taxation',
    summary: 'Legislators propose significant changes to corporate tax structure, potentially affecting business investment decisions.',
    time: '12 hours ago',
    trending: false,
    image: 'tax business'
  }
];

export function NewsFeed() {
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredNews = filterCategory === 'all' 
    ? newsData 
    : newsData.filter(item => item.category === filterCategory);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Personalized News Feed</h2>
        <p className="text-sm text-gray-500">Curated economic, finance, and accounting news just for you</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input placeholder="Search news..." className="sm:max-w-xs" />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Economics">Economics</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Accounting">Accounting</SelectItem>
            <SelectItem value="Markets">Markets</SelectItem>
            <SelectItem value="Monetary Policy">Monetary Policy</SelectItem>
            <SelectItem value="Taxation">Taxation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* News Cards */}
      <div className="space-y-4">
        {filteredNews.map((news) => (
          <Card key={news.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{news.category}</Badge>
                    <span className="text-xs text-gray-500">{news.source}</span>
                    {news.trending && (
                      <Badge className="bg-red-500 text-white text-xs gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={() => toggleBookmark(news.id)}
                    className={`flex-shrink-0 ${bookmarked.includes(news.id) ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    <Bookmark className="w-5 h-5" fill={bookmarked.includes(news.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <h3 className="text-gray-900 mb-2">{news.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{news.summary}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {news.time}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button size="sm" className="h-8 gap-1">
                      <ExternalLink className="w-4 h-4" />
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Daily Summary */}
      <Card className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="text-gray-900 mb-2">📊 Today's Market Summary</h3>
        <p className="text-sm text-gray-600 mb-3">
          Markets showed mixed performance today with tech stocks leading gains. The Federal Reserve's dovish comments 
          boosted investor sentiment. Global economic indicators suggest steady growth ahead.
        </p>
        <Button variant="outline" size="sm">View Full Summary</Button>
      </Card>
    </div>
  );
}
