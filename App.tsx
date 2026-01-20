
import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, Country, Question, QuizState } from './types';
import { fetchCountries } from './services/api';
import Home from './components/Home';
import LearnMode from './components/LearnMode';
import QuizMode from './components/QuizMode';
import StudyMode from './components/StudyMode';
import { Globe, BookOpen, Trophy, Flag } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.HOME);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const data = await fetchCountries();
      setCountries(data);
      setLoading(false);
    };
    init();
  }, []);

  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Mapping the world...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 transition-colors duration-500">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-slate-800/50 px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setMode(GameMode.HOME)}
        >
          <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Globe size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Global<span className="text-indigo-400">Explorer</span></h1>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setMode(GameMode.LEARN)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${mode === GameMode.LEARN ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen size={18} />
            <span className="text-sm font-medium">Learn</span>
          </button>
          <button 
            onClick={() => setMode(GameMode.STUDY)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${mode === GameMode.STUDY ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Flag size={18} />
            <span className="text-sm font-medium">Flags</span>
          </button>
          <button 
            onClick={() => setMode(GameMode.QUIZ)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${mode === GameMode.QUIZ ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Trophy size={18} />
            <span className="text-sm font-medium">Quiz</span>
          </button>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {mode === GameMode.HOME && <Home countries={countries} onStart={handleModeChange} />}
        {mode === GameMode.LEARN && <LearnMode countries={countries} />}
        {mode === GameMode.QUIZ && <QuizMode countries={countries} onBack={() => setMode(GameMode.HOME)} />}
        {mode === GameMode.STUDY && <StudyMode countries={countries} />}
      </main>

      {/* Mobile Nav */}
      <footer className="md:hidden glass-card border-t border-slate-800/50 px-6 py-3 flex justify-between items-center fixed bottom-0 left-0 right-0">
         <button onClick={() => setMode(GameMode.LEARN)} className={`flex flex-col items-center ${mode === GameMode.LEARN ? 'text-indigo-400' : 'text-slate-500'}`}>
            <BookOpen size={20} />
            <span className="text-[10px] mt-1 uppercase tracking-wider font-bold">Learn</span>
         </button>
         <button onClick={() => setMode(GameMode.STUDY)} className={`flex flex-col items-center ${mode === GameMode.STUDY ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Flag size={20} />
            <span className="text-[10px] mt-1 uppercase tracking-wider font-bold">Flags</span>
         </button>
         <button onClick={() => setMode(GameMode.QUIZ)} className={`flex flex-col items-center ${mode === GameMode.QUIZ ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Trophy size={20} />
            <span className="text-[10px] mt-1 uppercase tracking-wider font-bold">Quiz</span>
         </button>
      </footer>
    </div>
  );
};

export default App;
