import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowLeft, Clock, Lightbulb, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';

interface Article {
  id: number;
  headline: string;
  summary: string;
  source: string;
  time: string;
  category: string;
  keyTerms: string[];
  xp: number;
  duration: string;
}

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  onStartLearning: () => void;
}

const conceptDefinitions: Record<string, string> = {
  '기준금리': '중앙은행이 금융기관에 돈을 빌려줄 때 적용하는 기준이 되는 금리',
  '통화정책': '중앙은행이 통화량과 금리를 조절하여 물가와 경제를 안정시키는 정책',
  '물가상승률': '일정 기간 동안 물가 수준이 상승한 비율을 나타내는 지표',
  '금융통화위원회': '한국은행의 최고 의사결정 기구로 통화신용정책을 결정',
  '코스피': '한국 주식시장의 대표 지수로 상장 기업들의 주가를 종합한 지표',
  '주가지수': '여러 주식의 가격 변동을 하나의 숫자로 나타낸 지표',
  '외국인투자': '외국인이 국내 주식, 채권 등에 투자하는 것',
  '순매수': '매수액에서 매도액을 뺀 순수한 매수 금액',
  'GDP': '국내총생산, 한 나라에서 일정 기간 생산된 모든 재화와 서비스의 가치',
  '경제성장률': 'GDP가 이전 기간 대비 증가한 비율',
  '국내총생산': '한 나라 안에서 생산된 모든 최종 재화와 서비스의 시장가치 합계',
  '내수': '국내에서 생산된 재화와 서비스를 국내에서 소비하는 것',
  '영업이익': '기업의 주된 영업활동으로 벌어들인 이익',
  '반도체': '전기가 통하는 도체와 통하지 않는 부도체의 중간 성질을 가진 물질',
  '실적': '기업이 일정 기간 동안 달성한 경영 성과',
  '수익성': '기업이 투자한 자본으로 얼마나 이익을 창출하는지 나타내는 지표',
  'K-IFRS': '한국에서 적용되는 국제회계기준',
  '회계기준': '재무제표를 작성할 때 따라야 하는 규칙과 기준',
  '재무제표': '기업의 재무 상태와 경영 성과를 보고하는 문서',
  '수익인식': '기업이 수익을 언제 어떻게 회계 장부에 기록할지 결정하는 기준',
  '가상자산': '블록체인 기술을 기반으로 한 디지털 형태의 자산',
  '과세': '국가가 세금을 부과하는 것',
  '암호화폐': '암호화 기술을 사용한 디지털 화폐',
  '세금': '국가나 지방자치단체가 공공 서비스를 제공하기 위해 국민에게 부과하는 금액'
};

// Full article content based on article ID
const getFullArticleContent = (id: number): string[] => {
  const articles: Record<number, string[]> = {
    1: [
      '한국은행 금융통화위원회는 11일 정례회의를 열고 기준금리를 연 3.5%로 동결했습니다. 이로써 기준금리는 지난해 5월 이후 8개월 연속 동결 기조를 유지하게 됐습니다.',
      '이창용 한국은행 총재는 회의 후 기자간담회에서 "최근 소비자물가 상승률이 2%대 중반으로 안정되는 모습을 보이고 있다"며 "다만 경기 회복세를 고려할 때 성급한 금리 인하는 바람직하지 않다"고 설명했습니다.',
      '통화정책은 중앙은행이 경제 안정을 위해 사용하는 가장 중요한 정책 수단입니다. 기준금리를 인상하면 시중 금리가 올라가 대출이 줄어들고 소비와 투자가 위축되어 물가 상승을 억제할 수 있습니다.',
      '반대로 기준금리를 인하하면 대출이 늘어나고 소비와 투자가 활성화되어 경기를 부양하는 효과가 있습니다. 한국은행은 이러한 통화정책 수단을 활용해 물가 안정과 경제 성장의 균형을 맞추고자 합니다.',
      '시장 전문가들은 한국은행이 상반기 중에는 현재의 금리 수준을 유지할 것으로 전망하고 있습니다. 다만 하반기에는 물가가 더욱 안정되고 미국 연방준비제도의 통화정책 방향이 명확해지면 금리 인하를 검토할 수 있을 것으로 보입니다.'
    ],
    2: [
      '코스피 지수가 2,700선을 돌파하며 3개월 만에 최고치를 기록했습니다. 11일 코스피는 전 거래일 대비 45.8포인트(1.72%) 오른 2,708.24에 거래를 마쳤습니다.',
      '이날 상승을 이끈 것은 반도체 업종이었습니다. 삼성전자가 3.5% 오르며 시가총액 1위 자리를 굳건히 지켰고, SK하이닉스도 4.2% 급등했습니다. 외국인 투자자들이 이틀 연속 순매수를 기록하면서 시장에 긍정적인 분위기가 형성됐습니다.',
      '주가지수는 주식시장 전체의 흐름을 한눈에 파악할 수 있게 해주는 지표입니다. 코스피는 한국거래소 유가증권시장에 상장된 기업들의 주가를 종합하여 계산한 대표 지수로, 1980년 1월 4일을 기준시점(100)으로 삼아 현재의 시장 가치를 나타냅니다.',
      '외국인투자는 국내 증시에 큰 영향을 미치는 요인 중 하나입니다. 외국인 투자자들이 국내 주식을 많이 사들이면 주가가 상승하고, 반대로 매도하면 하락 압력이 생깁니다. 최근 외국인들의 순매수가 이어지면서 코스피가 상승 모멘텀을 얻고 있습니다.',
      '증권가에서는 글로벌 반도체 시장의 회복 기대감과 함께 국내 경제 지표 개선이 맞물리면서 당분간 상승세가 지속될 것으로 전망하고 있습니다.'
    ],
    3: [
      '한국은행이 발표한 2024년 4분기 국내총생산(GDP) 잠정치에 따르면, 실질 GDP 성장률이 전년 동기 대비 3.2%를 기록했습니다. 이는 시장 전문가들의 예상치인 2.8%를 크게 웃도는 수치입니다.',
      'GDP는 한 나라의 경제 규모와 성장세를 나타내는 가장 중요한 지표입니다. 일정 기간(보통 1년) 동안 한 국가 내에서 생산된 모든 최종 재화와 서비스의 시장가치를 합산한 것으로, 경제의 건강 상태를 측정하는 척도입니다.',
      '이번 성장을 견인한 주요 요인은 수출과 내수 소비의 동반 증가입니다. 반도체를 비롯한 IT 제품 수출이 크게 늘어났고, 국내 소비자들의 소비 심리도 개선되면서 소매판매가 증가했습니다.',
      '경제성장률은 이전 기간의 GDP와 비교하여 얼마나 성장했는지를 백분율로 나타낸 것입니다. 3.2%의 성장률은 한국 경제가 견고한 회복세를 보이고 있음을 의미합니다.',
      '정부는 이번 성장률 발표와 관련해 "수출 호조와 내수 회복이 균형을 이루면서 성장세가 지속되고 있다"며 "올해도 3% 이상의 성장률을 달성할 수 있을 것"이라고 전망했습니다.'
    ],
    4: [
      '삼성전자가 2025년 1분기 잠정 실적을 발표했습니다. 영업이익은 약 8조 5천억 원으로 전분기 대비 54% 증가할 것으로 예상됩니다. 이는 메모리 반도체 가격 상승과 출하량 증가에 힘입은 결과입니다.',
      '영업이익은 기업이 본업인 영업활동을 통해 벌어들인 이익을 의미합니다. 매출에서 매출원가와 판매관리비를 뺀 금액으로, 기업의 실질적인 수익 창출 능력을 보여주는 핵심 지표입니다.',
      '반도체 산업은 최근 몇 년간 재고 조정과 수요 감소로 어려움을 겪었으나, 올해 들어 인공지능(AI) 분야의 수요 급증과 함께 본격적인 회복 국면에 접어든 것으로 평가받고 있습니다.',
      '메모리 반도체 가격은 지난해 4분기부터 상승세로 전환했으며, 올해 1분기에도 이러한 추세가 이어지고 있습니다. 데이터센터와 AI 서버용 고부가가치 제품의 수요가 특히 강세를 보이고 있습니다.',
      '증권가에서는 삼성전자의 수익성 개선이 국내 증시 전반에 긍정적인 영향을 미칠 것으로 예상하고 있습니다. 반도체 업황 회복은 관련 중소 부품사와 장비사들에게도 수혜를 줄 것으로 전망됩니다.'
    ],
    5: [
      '올해부터 국제회계기준(K-IFRS)의 새로운 개정안이 시행되면서 상장기업들의 재무제표 작성 방식이 크게 변화했습니다. 특히 수익 인식 기준과 리스 회계처리 방식에서 중요한 변화가 있었습니다.',
      '재무제표는 기업의 재무 상태, 경영 성과, 현금 흐름을 이해관계자들에게 알려주는 공식 문서입니다. 재무상태표, 손익계산서, 현금흐름표, 자본변동표 등으로 구성되며, 투자자들이 기업의 가치를 평가하는 핵심 자료입니다.',
      'K-IFRS는 국제적으로 통용되는 회계기준을 한국 실정에 맞게 도입한 것입니다. 이를 통해 국내 기업들의 재무제표가 국제적으로 비교 가능해지고 투명성이 높아집니다.',
      '새로운 수익인식 기준은 기업이 재화나 서비스를 제공하고 대가를 받을 권리가 확정된 시점에 수익을 인식하도록 규정하고 있습니다. 이는 수익의 인식 시점을 더욱 명확하게 하여 투자자들의 판단을 돕습니다.',
      '회계전문가들은 "새로운 기준이 정착되면 기업 재무정보의 신뢰성이 높아지고, 투자자들의 의사결정에 더욱 유용한 정보를 제공할 수 있을 것"이라고 평가했습니다.'
    ],
    6: [
      '정부가 가상자산(암호화폐) 소득에 대한 과세 시행을 2027년까지 2년 유예하기로 결정했습니다. 당초 올해 1월 시행 예정이었던 가상자산 과세는 시장 인프라 미흡과 투자자 보호 체계 부족을 이유로 재차 연기됐습니다.',
      '가상자산은 블록체인 기술을 기반으로 발행되고 거래되는 디지털 자산을 의미합니다. 비트코인, 이더리움 같은 암호화폐가 대표적이며, 최근에는 NFT(대체불가토큰) 등 다양한 형태로 확장되고 있습니다.',
      '과세는 국가가 공공 서비스를 제공하기 위한 재원을 마련하고자 국민의 소득이나 재산에 세금을 부과하는 것입니다. 가상자산 과세는 암호화폐 거래로 발생한 소득에 대해 세금을 매기는 것을 말합니다.',
      '정부는 과세 유예 기간 동안 거래소 보안 강화, 투자자 보호 제도 마련, 과세 인프라 구축 등을 추진할 계획입니다. 또한 가상자산 거래 내역 추적 시스템을 고도화하여 투명한 과세 기반을 마련하겠다고 밝혔습니다.',
      '암호화폐 투자자들은 이번 유예 조치를 환영하는 분위기입니다. 업계에서는 "과세 시행 전 충분한 준비 기간이 확보된 만큼, 시장 안정화에 기여할 것"이라고 평가했습니다.'
    ]
  };

  return articles[id] || articles[1];
};

export function ArticleReader({ article, onBack, onStartLearning }: ArticleReaderProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const fullContent = getFullArticleContent(article.id);

  const highlightTerms = (text: string) => {
    let result = text;
    article.keyTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'g');
      result = result.replace(regex, `<mark class="highlight-term" data-term="$1">$1</mark>`);
    });
    return result;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-purple-100 z-10 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-purple-100 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95">
            <ArrowLeft className="w-6 h-6 text-purple-900" />
          </button>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 rounded-full">
            {article.category}
          </Badge>
          <div className="w-8" />
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-140px)]">
        <article className="px-4 py-6 max-w-2xl mx-auto">
          {/* Article Meta */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-sm text-gray-600">{article.source}</span>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              {article.time}
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">{article.duration}</span>
            {article.id <= 2 && (
              <>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1 text-sm text-orange-600">
                  <TrendingUp className="w-3 h-3 animate-pulse" />
                  <span>인기</span>
                </div>
              </>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-gray-900 mb-6">{article.headline}</h1>

          {/* Key Terms Notice */}
          <Card className="p-4 mb-6 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200 rounded-3xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-2xl shadow-sm">
                <Lightbulb className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">✨ 학습 모드 활성화!</h3>
                <p className="text-sm text-gray-700 mb-2">
                  핵심 용어가 보라색으로 강조되어 있어요. 탭하면 쉬운 설명을 볼 수 있어요! 🎯
                </p>
                <div className="flex items-center gap-2 text-xs text-purple-700 bg-white/70 px-3 py-2 rounded-full w-fit">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>학습 완료하고 {article.xp} XP 획득! 🎉</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Article Content */}
          <div className="prose prose-sm max-w-none space-y-4">
            {fullContent.map((paragraph, index) => (
              <p
                key={index}
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightTerms(paragraph) }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.classList.contains('highlight-term')) {
                    const term = target.getAttribute('data-term') || target.textContent || '';
                    setSelectedTerm(term);
                  }
                }}
              />
            ))}
          </div>

          {/* Key Concepts Summary */}
          <Card className="p-5 mt-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-200 rounded-3xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-gray-900">이 기사의 핵심 개념</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {article.keyTerms.map((term, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTerm(term)}
                  className="flex items-center gap-2 p-3 bg-white rounded-2xl hover:bg-purple-50 transition-all duration-300 text-left shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 border-2 border-purple-100"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-sm text-gray-900">{term}</span>
                </button>
              ))}
            </div>
          </Card>
        </article>
      </ScrollArea>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-purple-100 p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={onStartLearning}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            학습 시작하기! (+{article.xp} XP)
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Term Definition Tooltip */}
      {selectedTerm && conceptDefinitions[selectedTerm] && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center sm:justify-center animate-fade-in"
          onClick={() => setSelectedTerm(null)}
        >
          <Card 
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 m-0 sm:m-4 shadow-2xl animate-slide-up border-4 border-purple-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-gray-900">{selectedTerm}</h3>
              </div>
              <button 
                onClick={() => setSelectedTerm(null)}
                className="text-gray-400 hover:text-gray-600 text-xl p-1 hover:bg-gray-100 rounded-xl transition-all"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed bg-purple-50/50 p-4 rounded-2xl">
              {conceptDefinitions[selectedTerm]}
            </p>
            <Button 
              onClick={() => setSelectedTerm(null)}
              variant="outline" 
              size="sm"
              className="w-full rounded-2xl border-2 border-purple-200 hover:bg-purple-50"
            >
              이해했어요! 👍
            </Button>
          </Card>
        </div>
      )}

      <style>{`
        .highlight-term {
          background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
          color: #7c3aed;
          padding: 3px 6px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid #a855f7;
        }
        .highlight-term:hover {
          background: linear-gradient(135deg, #e9d5ff 0%, #fbcfe8 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.2);
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
