import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Send, Sparkles, BookOpen, TrendingUp, Calculator, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';

const suggestedQuestions = [
  'Explain what GDP is in simple terms',
  'How do I calculate ROI?',
  'What is the difference between revenue and profit?',
  'Explain the concept of opportunity cost',
  'What are the main financial statements?',
  'How does inflation affect the economy?'
];

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI Economics & Finance Tutor. I'm here to help you understand complex concepts in simple terms. Feel free to ask me anything about economics, finance, or accounting!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('gdp')) {
      return "**GDP (Gross Domestic Product)** is the total value of all goods and services produced within a country during a specific period, usually a year.\n\nThink of it as a country's economic report card. It measures:\n- Consumer spending\n- Business investments\n- Government spending\n- Net exports (exports - imports)\n\n**Formula:** GDP = C + I + G + (X - M)\n\n**Example:** If a country produces $1 trillion worth of goods and services in a year, its GDP is $1 trillion.\n\nA rising GDP typically indicates economic growth and prosperity!";
    } else if (lowerQuestion.includes('roi')) {
      return "**ROI (Return on Investment)** measures how much profit or loss you've made on an investment relative to its cost.\n\n**Formula:**\nROI = (Net Profit / Cost of Investment) × 100%\n\n**Example:**\nIf you invest $1,000 and earn $1,200:\n- Net Profit = $1,200 - $1,000 = $200\n- ROI = ($200 / $1,000) × 100% = 20%\n\nA positive ROI means you made money, negative means you lost money. Higher ROI is generally better, but always consider risk!";
    } else if (lowerQuestion.includes('inflation')) {
      return "**Inflation** is the rate at which the general level of prices for goods and services rises, decreasing purchasing power.\n\n**Key Points:**\n- When inflation is high, your money buys less\n- Central banks try to control inflation through monetary policy\n- Moderate inflation (2-3%) is considered healthy for the economy\n\n**Example:** If inflation is 3%, something that costs $100 today will cost about $103 next year.\n\n**Effects:**\n- Reduces purchasing power\n- Can erode savings\n- May lead to higher interest rates";
    } else if (lowerQuestion.includes('revenue') && lowerQuestion.includes('profit')) {
      return "Great question! Let me explain the difference:\n\n**Revenue** is the total income from sales before any expenses are deducted.\n- Also called \"top line\" or \"gross income\"\n- Example: If you sell 100 products at $10 each, revenue = $1,000\n\n**Profit** is what remains after subtracting all expenses from revenue.\n- Also called \"net income\" or \"bottom line\"\n- Example: If revenue is $1,000 and expenses are $600, profit = $400\n\n**Formula:** Profit = Revenue - Total Expenses\n\nYou can have high revenue but low (or negative) profit if expenses are high!";
    } else if (lowerQuestion.includes('opportunity cost')) {
      return "**Opportunity Cost** is the value of the next best alternative you give up when making a choice.\n\n**Simple Example:**\n- You have $100 and 2 options:\n  - Invest in Stock A (potential return: 10%)\n  - Invest in Stock B (potential return: 7%)\n- If you choose Stock B, the opportunity cost is the 10% return from Stock A\n\n**Real-life Example:**\n- If you spend an evening studying economics, the opportunity cost might be:\n  - Not watching a movie\n  - Not earning money from a part-time job\n  - Not spending time with friends\n\nEvery choice has an opportunity cost!";
    } else if (lowerQuestion.includes('financial statement')) {
      return "The three main **Financial Statements** are:\n\n**1. Income Statement (Profit & Loss)**\n- Shows revenue, expenses, and profit over a period\n- Answers: \"Did we make money?\"\n\n**2. Balance Sheet**\n- Shows assets, liabilities, and equity at a point in time\n- Answers: \"What do we own and owe?\"\n- Formula: Assets = Liabilities + Equity\n\n**3. Cash Flow Statement**\n- Shows cash inflows and outflows\n- Answers: \"Where did the cash come from and go?\"\n- Categories: Operating, Investing, Financing\n\nThese three statements together give a complete financial picture of a business!";
    } else {
      return "That's an interesting question! Let me help you understand that concept better.\n\nBased on your question, I'd recommend breaking it down into smaller parts:\n\n1. First, identify the key terms and concepts\n2. Look at real-world examples\n3. Try to apply it to a practical situation\n\nCould you provide more details about what specific aspect you'd like to explore? I'm here to help make complex topics simple and clear!";
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">AI Tutor</h2>
        <p className="text-sm text-gray-500">Ask me anything about economics, finance, or accounting</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900">EconAI Tutor</h3>
                  <p className="text-xs text-gray-500">Always ready to help</p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Online
                </Badge>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="flex-shrink-0">
                      {message.type === 'ai' ? (
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                          <Sparkles className="w-4 h-4" />
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-gray-200">U</AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`flex-1 rounded-2xl p-4 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white ml-12'
                          : 'bg-gray-100 text-gray-900 mr-12'
                      }`}
                    >
                      <div className="whitespace-pre-line">{message.content}</div>
                      <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask a question..."
                  className="min-h-[60px] resize-none"
                />
                <Button onClick={handleSend} size="icon" className="h-[60px] w-[60px]">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Suggested Questions */}
          <Card className="p-5">
            <h3 className="text-gray-900 mb-3">Suggested Questions</h3>
            <div className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                >
                  <MessageSquare className="w-4 h-4 inline mr-2 text-gray-400" />
                  {question}
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Topics */}
          <Card className="p-5">
            <h3 className="text-gray-900 mb-3">Popular Topics</h3>
            <div className="space-y-2">
              <Badge variant="outline" className="mr-2 mb-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                Macroeconomics
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2">
                <Calculator className="w-3 h-3 mr-1" />
                Financial Ratios
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2">
                <BookOpen className="w-3 h-3 mr-1" />
                Accounting Principles
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2">
                Investment Strategies
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2">
                Market Analysis
              </Badge>
            </div>
          </Card>

          {/* Daily Challenge */}
          <Card className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <h3 className="text-gray-900 mb-2">💡 Today's Challenge</h3>
            <p className="text-sm text-gray-600 mb-3">
              Can you explain the concept of "compound interest" to someone who's never heard of it?
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Take Challenge
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
