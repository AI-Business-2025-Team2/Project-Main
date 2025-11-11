import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Lightbulb, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const concepts = [
  {
    term: 'Federal Reserve',
    category: 'Monetary Policy',
    definition: 'The central banking system of the United States',
    learned: true,
    lastReviewed: '2 days ago',
    timesEncountered: 8
  },
  {
    term: 'Inflation',
    category: 'Economics',
    definition: 'Rate at which prices increase over time',
    learned: true,
    lastReviewed: '1 day ago',
    timesEncountered: 12
  },
  {
    term: 'GDP',
    category: 'Economics',
    definition: 'Gross Domestic Product - total economic output',
    learned: true,
    lastReviewed: '3 hours ago',
    timesEncountered: 15
  },
  {
    term: 'Interest Rate',
    category: 'Finance',
    definition: 'Cost of borrowing money or return on investment',
    learned: true,
    lastReviewed: '5 hours ago',
    timesEncountered: 10
  },
  {
    term: 'Monetary Policy',
    category: 'Economics',
    definition: 'Central bank actions to influence money supply',
    learned: false,
    lastReviewed: 'Never',
    timesEncountered: 3
  },
  {
    term: 'Fiscal Policy',
    category: 'Economics',
    definition: 'Government spending and taxation decisions',
    learned: false,
    lastReviewed: 'Never',
    timesEncountered: 2
  },
  {
    term: 'Bull Market',
    category: 'Markets',
    definition: 'Market condition with rising prices and optimism',
    learned: true,
    lastReviewed: '1 week ago',
    timesEncountered: 5
  },
  {
    term: 'IFRS',
    category: 'Accounting',
    definition: 'International Financial Reporting Standards',
    learned: false,
    lastReviewed: 'Never',
    timesEncountered: 1
  }
];

export function ConceptLibrary() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConcepts = concepts.filter(concept =>
    concept.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concept.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const learnedConcepts = filteredConcepts.filter(c => c.learned);
  const toLearnConcepts = filteredConcepts.filter(c => !c.learned);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-gray-900 mb-1">Concept Library</h1>
          <p className="text-xs text-gray-500 mb-4">All your learned economic concepts</p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <div className="text-2xl text-blue-600">{learnedConcepts.length}</div>
          <div className="text-xs text-gray-600 mt-1">Learned</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl text-gray-900">{concepts.length}</div>
          <div className="text-xs text-gray-600 mt-1">Total</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl text-orange-600">{toLearnConcepts.length}</div>
          <div className="text-xs text-gray-600 mt-1">To Learn</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="learned">Learned</TabsTrigger>
            <TabsTrigger value="tolearn">To Learn</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="space-y-3 pb-4">
              {filteredConcepts.map((concept, index) => (
                <ConceptCard key={index} concept={concept} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learned" className="mt-0">
            <div className="space-y-3 pb-4">
              {learnedConcepts.map((concept, index) => (
                <ConceptCard key={index} concept={concept} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tolearn" className="mt-0">
            <div className="space-y-3 pb-4">
              {toLearnConcepts.map((concept, index) => (
                <ConceptCard key={index} concept={concept} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ConceptCard({ concept }: { concept: typeof concepts[0] }) {
  return (
    <Card className="p-4 active:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            concept.learned ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            {concept.learned ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Lightbulb className="w-4 h-4 text-orange-600" />
            )}
          </div>
          <div>
            <h3 className="text-gray-900">{concept.term}</h3>
            <Badge variant="secondary" className="text-xs mt-1">
              {concept.category}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <TrendingUp className="w-3 h-3" />
          {concept.timesEncountered}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{concept.definition}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {concept.lastReviewed}
        </span>
        <span className={concept.learned ? 'text-green-600' : 'text-orange-600'}>
          {concept.learned ? 'Learned' : 'In Progress'}
        </span>
      </div>
    </Card>
  );
}
