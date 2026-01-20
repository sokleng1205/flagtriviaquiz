
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Country, Question, QuizState } from '../types';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Home as HomeIcon, Trophy, Star, Sparkles, Zap, Volume2, VolumeX } from 'lucide-react';
import { soundService } from '../services/sounds';

interface QuizModeProps {
  countries: Country[];
  onBack: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ countries, onBack }) => {
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [combo, setCombo] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const autoNextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const QUESTIONS_PER_LEVEL = 5;
  const MAX_LEVEL = 10;

  useEffect(() => {
    return () => {
      if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    };
  }, []);

  const generateQuiz = useCallback(() => {
    const questions: Question[] = [];
    const totalQuestionsNeeded = QUESTIONS_PER_LEVEL * MAX_LEVEL;
    
    const pool = [...countries].sort(() => Math.random() - 0.5);
    const selection = [];
    for (let i = 0; i < totalQuestionsNeeded; i++) {
      selection.push(pool[i % pool.length]);
    }

    selection.forEach((country, index) => {
      const types: ('capital' | 'currency' | 'flag')[] = ['capital', 'currency', 'flag'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      let correctAnswer = '';
      let options: string[] = [];

      if (type === 'capital') {
        correctAnswer = country.capital?.[0] || 'N/A';
        const others = countries
          .filter(c => c.name.common !== country.name.common && c.capital)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(c => c.capital[0]);
        options = [correctAnswer, ...others];
      } else if (type === 'currency') {
        correctAnswer = (Object.values(country.currencies)[0] as any)?.name || 'N/A';
        const others = countries
          .filter(c => c.name.common !== country.name.common && c.currencies)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(c => (Object.values(c.currencies)[0] as any)?.name);
        options = [correctAnswer, ...others];
      } else {
        correctAnswer = country.name.common;
        const others = countries
          .filter(c => c.name.common !== country.name.common)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(c => c.name.common);
        options = [correctAnswer, ...others];
      }

      questions.push({
        id: `q-${index}`,
        type,
        country,
        correctAnswer,
        options: options.sort(() => Math.random() - 0.5)
      });
    });

    setQuiz({
      questions,
      currentIndex: 0,
      score: 0,
      level: 1,
      isFinished: false,
      showLevelUp: false
    });
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCombo(0);
  }, [countries]);

  useEffect(() => {
    generateQuiz();
  }, [generateQuiz]);

  const nextQuestion = useCallback(() => {
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }

    setQuiz(prev => {
      if (!prev) return null;
      
      const nextIndex = prev.currentIndex + 1;
      const isLevelComplete = (nextIndex % QUESTIONS_PER_LEVEL) === 0;
      
      if (nextIndex === prev.questions.length) {
        if (soundEnabled) soundService.playTrophy();
        return { ...prev, isFinished: true };
      } else if (isLevelComplete) {
        if (soundEnabled) soundService.playLevelUp();
        return { ...prev, showLevelUp: true };
      } else {
        setSelectedAnswer(null);
        setIsCorrect(null);
        return { ...prev, currentIndex: nextIndex };
      }
    });
  }, [soundEnabled]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null || !quiz) return;
    
    setSelectedAnswer(answer);
    const correct = answer === quiz.questions[quiz.currentIndex].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      if (soundEnabled) soundService.playCorrect();
      setQuiz(prev => prev ? { ...prev, score: prev.score + 1 } : null);
      setCombo(prev => prev + 1);
    } else {
      if (soundEnabled) soundService.playIncorrect();
      setCombo(0);
    }

    autoNextTimerRef.current = setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const proceedToNextLevel = () => {
    if (!quiz) return;
    setQuiz(prev => prev ? { 
      ...prev, 
      currentIndex: prev.currentIndex + 1, 
      level: prev.level + 1,
      showLevelUp: false 
    } : null);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  if (!quiz) return null;

  if (quiz.showLevelUp) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-12 animate-in zoom-in duration-500">
        <div className="relative">
          <div className="w-48 h-48 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(99,102,241,0.5)] rotate-12 transition-transform hover:rotate-0 duration-700">
            <Trophy size={96} className="text-white drop-shadow-lg -rotate-12" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} className="text-amber-400 fill-amber-400 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-7xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">LEVEL UP</h2>
          <p className="text-slate-400 text-2xl font-light">
            Level <span className="text-white font-bold">{quiz.level}</span> Mastered!
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-full font-black text-xl border border-emerald-500/20">
            <Zap size={20} className="fill-current" />
            Accuracy: {Math.round((quiz.score / (quiz.level * QUESTIONS_PER_LEVEL)) * 100)}%
          </div>
        </div>
        <button 
          onClick={proceedToNextLevel}
          className="group relative flex items-center justify-center gap-4 bg-white text-slate-950 px-16 py-6 rounded-[2.5rem] font-black text-3xl transition-all hover:scale-110 active:scale-95 shadow-2xl shadow-white/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          Begin Level {quiz.level + 1}
          <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    );
  }

  if (quiz.isFinished) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-10 animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="w-40 h-40 bg-amber-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30 rotate-3">
             <Trophy size={80} className="text-white -rotate-3" />
          </div>
          <div className="absolute -top-6 -right-6 bg-indigo-600 text-white font-black px-6 py-2 rounded-2xl transform rotate-12 shadow-xl">
            WORLD EXPLORER
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-6xl font-black tracking-tighter">Grand Quest Complete!</h2>
          <p className="text-slate-400 text-2xl font-light">
            Final Score: <span className="text-indigo-400 font-black">{quiz.score}</span> / {quiz.questions.length}
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-10 space-y-6">
          <div className="flex justify-between items-end">
            <div className="text-left">
              <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Performance</div>
              <div className="text-3xl font-black">Expert</div>
            </div>
            <div className="text-right">
              <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Accuracy</div>
              <div className="text-3xl font-black text-emerald-400">{Math.round((quiz.score / quiz.questions.length) * 100)}%</div>
            </div>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-1">
             <div 
               className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-[2000ms] ease-out"
               style={{ width: `${(quiz.score / quiz.questions.length) * 100}%` }}
             ></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
          <button 
            onClick={generateQuiz}
            className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 px-10 py-5 rounded-[2rem] text-white font-black text-xl transition-all w-full sm:w-auto hover:shadow-xl hover:shadow-indigo-500/20"
          >
            <RotateCcw size={24} /> New Journey
          </button>
          <button 
            onClick={onBack}
            className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 px-10 py-5 rounded-[2rem] text-slate-100 font-black text-xl transition-all w-full sm:w-auto"
          >
            <HomeIcon size={24} /> Home Menu
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[quiz.currentIndex];
  const questionsInCurrentLevel = (quiz.currentIndex % QUESTIONS_PER_LEVEL) + 1;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-8">
      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-2xl font-black text-sm tracking-widest">
            LVL {quiz.level}
          </div>
          <div className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">
            Step {questionsInCurrentLevel} / {QUESTIONS_PER_LEVEL}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {combo > 1 && (
             <div className="hidden sm:flex items-center gap-2 text-amber-400 animate-bounce">
                <Zap size={18} className="fill-current" />
                <span className="font-black text-lg">{combo}x Streak</span>
             </div>
          )}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <div className="flex items-center gap-2 font-black text-white bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-700/50">
            <Trophy size={18} className="text-amber-400" />
            <span>{quiz.score}</span>
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5">
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${(questionsInCurrentLevel / QUESTIONS_PER_LEVEL) * 100}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-12 glass-card rounded-[3rem] p-8 md:p-12 space-y-12 animate-in slide-in-from-bottom-8 duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-white/5 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-500 ${isCorrect === true ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : isCorrect === false ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-transparent'}`}></div>

          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 text-[10px] font-black bg-white/5 text-slate-400 px-5 py-2 rounded-full uppercase tracking-[0.3em] border border-white/10">
              <Sparkles size={12} className="text-indigo-400" />
              {currentQ.type === 'flag' ? 'Visual Identification' : currentQ.type === 'capital' ? 'Geography Trivia' : 'Economic Trivia'}
            </div>
            
            <div className="space-y-4">
               {currentQ.type === 'flag' ? (
                  <h3 className="text-3xl md:text-4xl font-black text-white">Which country owns this flag?</h3>
               ) : (
                  <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {currentQ.country.name.common}
                  </h3>
               )}
               <p className="text-slate-400 text-lg font-medium">
                  {currentQ.type === 'capital' ? 'Identify the official capital city' : currentQ.type === 'currency' ? 'Identify the national currency' : 'Identify the correct nation below'}
               </p>
            </div>

            <div className="flex justify-center py-4">
               <div className={`group relative transition-all duration-700 transform ${selectedAnswer ? 'scale-90 opacity-60' : 'hover:scale-105'} `}>
                  <div className="absolute inset-0 bg-indigo-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-full max-w-[400px] aspect-[16/10] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 relative z-10">
                    <img 
                      key={currentQ.country.cca2}
                      src={currentQ.country.flags.svg} 
                      alt="Country Flag" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
            {currentQ.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === currentQ.correctAnswer;
              const showResult = selectedAnswer !== null;

              return (
                <button
                  key={i}
                  disabled={showResult}
                  onClick={() => handleAnswer(option)}
                  className={`
                    relative p-8 rounded-[2rem] text-xl font-bold transition-all text-left group overflow-hidden border-2
                    ${!showResult ? 'bg-slate-900/50 hover:bg-slate-800 border-slate-800/80 hover:border-indigo-500/50 hover:-translate-y-2' : ''}
                    ${showResult && isCorrectOption ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : ''}
                    ${showResult && isSelected && !isCorrectOption ? 'bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.1)] animate-shake' : ''}
                    ${showResult && !isSelected && !isCorrectOption ? 'bg-slate-950/20 border-transparent text-slate-600' : ''}
                  `}
                >
                  <div className="flex items-center justify-between relative z-20">
                    <span className="truncate pr-4">{option}</span>
                    <div className="shrink-0">
                      {showResult && isCorrectOption && <CheckCircle2 size={32} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                      {showResult && isSelected && !isCorrectOption && <XCircle size={32} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                      {!showResult && <div className="w-8 h-8 rounded-full border-2 border-slate-700 group-hover:border-indigo-500/50 transition-colors"></div>}
                    </div>
                  </div>
                  {!showResult && (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <button 
                onClick={nextQuestion}
                className="group relative flex items-center gap-4 bg-white text-slate-950 px-14 py-6 rounded-[2.5rem] font-black text-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
              >
                {((quiz.currentIndex + 1) % QUESTIONS_PER_LEVEL) === 0 ? 'FINISH LEVEL' : 'NEXT STEP'}
                <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="h-24"></div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default QuizMode;
