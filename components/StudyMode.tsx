
import React, { useState } from 'react';
import { Country } from '../types';
import { ChevronLeft, ChevronRight, Maximize2, X, Info } from 'lucide-react';

interface StudyModeProps {
  countries: Country[];
}

const StudyMode: React.FC<StudyModeProps> = ({ countries }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const currentCountry = countries[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % countries.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + countries.length) % countries.length);
  };

  return (
    <div className="h-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 blur-[120px]">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-600 rounded-full animate-pulse [animation-delay:1s]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{currentCountry.name.common}</h2>
          <div className="flex items-center justify-center gap-4 text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">
            <span>{currentCountry.region}</span>
            <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
            <span>{currentIndex + 1} of {countries.length}</span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative w-full aspect-[16/9] group">
          <div 
            className="w-full h-full glass-card rounded-[3rem] overflow-hidden shadow-2xl cursor-zoom-in"
            onClick={() => setIsFullScreen(true)}
          >
            <img 
              key={currentCountry.cca2}
              src={currentCountry.flags.svg} 
              alt={currentCountry.flags.alt} 
              className="w-full h-full object-cover animate-in fade-in duration-700"
            />
          </div>

          <div className="absolute inset-y-0 -left-6 md:-left-12 flex items-center">
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="p-4 bg-slate-900/80 backdrop-blur hover:bg-indigo-600 text-white rounded-full transition-all shadow-xl"
            >
              <ChevronLeft size={32} />
            </button>
          </div>

          <div className="absolute inset-y-0 -right-6 md:-right-12 flex items-center">
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="p-4 bg-slate-900/80 backdrop-blur hover:bg-indigo-600 text-white rounded-full transition-all shadow-xl"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          <button 
            onClick={() => setIsFullScreen(true)}
            className="absolute bottom-8 right-8 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 size={24} />
          </button>
        </div>

        {/* Data Bar */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-12 w-full px-8 py-6 glass-card rounded-[2rem] border-slate-800/50">
           <div className="flex flex-col items-center gap-1">
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Capital</span>
             <span className="text-lg font-bold">{currentCountry.capital?.[0] || 'N/A'}</span>
           </div>
           <div className="hidden md:block w-px h-8 bg-slate-800 my-auto"></div>
           <div className="flex flex-col items-center gap-1">
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Currency</span>
             {/* Fix: cast to any to resolve unknown property access */}
             <span className="text-lg font-bold">{(Object.values(currentCountry.currencies)[0] as any)?.name}</span>
           </div>
           <div className="hidden md:block w-px h-8 bg-slate-800 my-auto"></div>
           <div className="flex flex-col items-center gap-1">
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Subregion</span>
             <span className="text-lg font-bold">{currentCountry.subregion}</span>
           </div>
        </div>
      </div>

      {/* Full Screen Overlay */}
      {isFullScreen && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-0 md:p-8 animate-in fade-in duration-300">
           <button 
             onClick={() => setIsFullScreen(false)}
             className="absolute top-6 right-6 z-10 p-4 bg-white/10 hover:bg-red-500/50 text-white rounded-full backdrop-blur-md transition-all"
           >
             <X size={32} />
           </button>
           
           <img 
             src={currentCountry.flags.svg} 
             alt={currentCountry.flags.alt} 
             className="w-full h-auto max-h-screen object-contain"
           />

           <div className="absolute bottom-10 left-10 hidden md:flex items-center gap-3 bg-black/50 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/20">
                <img src={currentCountry.flags.svg} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-black text-xl leading-none">{currentCountry.name.common}</h4>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">{currentCountry.official ? currentCountry.name.official : ''}</p>
              </div>
           </div>
        </div>
      )}
      <div className="h-20"></div>
    </div>
  );
};

export default StudyMode;
