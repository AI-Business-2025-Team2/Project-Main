import { useState, useEffect } from 'react';
import { Home, BookOpen, RotateCcw, User, Sparkles } from 'lucide-react';
import { HomeScreen } from './components/HomeScreen';
import { LearnScreen } from './components/LearnScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { MotivationModal } from './components/MotivationModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userXP, setUserXP] = useState(1250);
  const [streak, setStreak] = useState(7);
  const [completedLessons, setCompletedLessons] = useState(12);
  const [learnedConcepts, setLearnedConcepts] = useState(48);
  
  // Motivation Modal State
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationType, setMotivationType] = useState<'streak' | 'comeback' | 'milestone' | 'missed'>('streak');
  const [lastVisit, setLastVisit] = useState<string | null>(null);

  // Check for motivation triggers on app load
  useEffect(() => {
    const storedLastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    
    if (storedLastVisit) {
      const lastVisitDate = new Date(storedLastVisit);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Same day - check for streak milestone
        if (streak > 0 && streak % 7 === 0) {
          setMotivationType('milestone');
          setShowMotivation(true);
        }
      } else if (daysDiff === 1) {
        // Came back next day - celebrate streak
        if (streak >= 3) {
          setMotivationType('streak');
          setShowMotivation(true);
        }
      } else if (daysDiff > 1 && daysDiff <= 7) {
        // Missed days but came back
        setMotivationType('comeback');
        setShowMotivation(true);
      } else if (daysDiff > 7) {
        // Long absence
        setMotivationType('missed');
        setShowMotivation(true);
      }
    } else {
      // First time visitor - welcome with studying penguin
      setMotivationType('streak');
      setShowMotivation(true);
    }
    
    localStorage.setItem('lastVisit', today);
    setLastVisit(today);
  }, []);

  const handleLessonComplete = (earnedXP: number) => {
    setUserXP(prev => prev + earnedXP);
    setCompletedLessons(prev => prev + 1);
    setLearnedConcepts(prev => prev + 4); // Assume 4 concepts per lesson
    
    // Check for streak milestone
    const newCompletedLessons = completedLessons + 1;
    if (newCompletedLessons % 5 === 0) {
      setMotivationType('milestone');
      setShowMotivation(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20 max-w-md mx-auto">
      {/* Motivation Modal */}
      <MotivationModal
        isOpen={showMotivation}
        onClose={() => setShowMotivation(false)}
        type={motivationType}
        streak={streak}
        daysAway={lastVisit ? Math.floor((new Date().getTime() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24)) : 0}
      />

      {/* Main Content */}
      <main className="min-h-screen">
        {activeTab === 'home' && (
          <HomeScreen 
            userXP={userXP} 
            streak={streak} 
            onLessonComplete={handleLessonComplete}
          />
        )}
        {activeTab === 'learn' && <LearnScreen onXPEarned={(xp) => setUserXP(prev => prev + xp)} />}
        {activeTab === 'review' && <ReviewScreen onXPEarned={(xp) => setUserXP(prev => prev + xp)} />}
        {activeTab === 'profile' && (
          <ProfileScreen 
            userXP={userXP} 
            streak={streak}
            completedLessons={completedLessons}
            learnedConcepts={learnedConcepts}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-purple-100 shadow-lg z-50">
        <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300 transform ${
              activeTab === 'home' 
                ? 'text-purple-600 bg-gradient-to-br from-purple-100 to-pink-100 scale-105 shadow-md' 
                : 'text-gray-500 hover:text-purple-500 hover:scale-105 active:scale-95'
            }`}
          >
            <Home className={`w-6 h-6 ${activeTab === 'home' ? 'animate-bounce' : ''}`} />
            <span className="text-xs">홈</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300 transform ${
              activeTab === 'learn' 
                ? 'text-purple-600 bg-gradient-to-br from-purple-100 to-pink-100 scale-105 shadow-md' 
                : 'text-gray-500 hover:text-purple-500 hover:scale-105 active:scale-95'
            }`}
          >
            <BookOpen className={`w-6 h-6 ${activeTab === 'learn' ? 'animate-bounce' : ''}`} />
            <span className="text-xs">학습</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300 transform ${
              activeTab === 'review' 
                ? 'text-purple-600 bg-gradient-to-br from-purple-100 to-pink-100 scale-105 shadow-md' 
                : 'text-gray-500 hover:text-purple-500 hover:scale-105 active:scale-95'
            }`}
          >
            <Sparkles className={`w-6 h-6 ${activeTab === 'review' ? 'animate-bounce' : ''}`} />
            <span className="text-xs">복습</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300 transform ${
              activeTab === 'profile' 
                ? 'text-purple-600 bg-gradient-to-br from-purple-100 to-pink-100 scale-105 shadow-md' 
                : 'text-gray-500 hover:text-purple-500 hover:scale-105 active:scale-95'
            }`}
          >
            <User className={`w-6 h-6 ${activeTab === 'profile' ? 'animate-bounce' : ''}`} />
            <span className="text-xs">프로필</span>
          </button>
        </div>
      </nav>
    </div>
  );
}