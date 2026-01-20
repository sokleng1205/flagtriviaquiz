
import React from 'react';
import { GameMode, Country } from '../types';
// Add missing Trophy import
import { Play, BookOpen, Flag, Search, Globe2, Trophy } from 'lucide-react';

interface HomeProps {
  countries: Country[];
  onStart: (mode: GameMode) => void;
}

const Home: React.FC<HomeProps> = ({ countries, onStart }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-indigo-500/20">
          <Globe2 size={16} />
          Explore {countries.length} Nations
        </div>
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">World's Flags</span>
        </h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
          An interactive journey across continents. Learn capitals, currencies, and identification through a sleek, data-rich experience.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <button 
            onClick={() => onStart(GameMode.QUIZ)}
            className="group relative flex items-center gap-3 bg-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-2xl text-white hover:text-indigo-900 font-bold transition-all duration-300 shadow-xl shadow-indigo-500/20"
          >
            <Play size={20} className="fill-current" />
            Start Quiz
            <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full animate-bounce">
              PRO
            </span>
          </button>
          <button 
            onClick={() => onStart(GameMode.LEARN)}
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-2xl text-slate-100 font-bold transition-all"
          >
            <Search size={20} />
            Explore Database
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Flag className="text-indigo-400" />,
            title: "Study Mode",
            desc: "Immerse yourself in high-resolution flags. Learn by visual association in our full-screen gallery.",
            mode: GameMode.STUDY
          },
          {
            icon: <BookOpen className="text-emerald-400" />,
            title: "Expert Learning",
            desc: "Detailed insights into every country. Powered by REST Countries and AI-driven fun facts.",
            mode: GameMode.LEARN
          },
          {
            icon: <Trophy className="text-amber-400" />,
            title: "Global Quiz",
            desc: "Test your speed and accuracy. Identify currencies, capitals, and flags under pressure.",
            mode: GameMode.QUIZ
          }
        ].map((feat, i) => (
          <div 
            key={i}
            onClick={() => onStart(feat.mode)}
            className="group glass-card p-8 rounded-3xl cursor-pointer hover:translate-y-[-8px] transition-all duration-300 border border-slate-800 hover:border-indigo-500/50"
          >
            <div className="bg-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {feat.icon}
            </div>
            <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
            <p className="text-slate-400 font-light leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-slate-800 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-3xl font-bold">Ready to challenge?</h4>
          <p className="text-slate-400">Join thousands of students and travelers learning daily.</p>
        </div>
        <div className="flex gap-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400">190+</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Countries</div>
          </div>
          <div className="text-center border-l border-slate-800 pl-12">
            <div className="text-3xl font-bold text-indigo-400">4K</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Resolution</div>
          </div>
        </div>
      </section>
      
      {/* Footer Buffer */}
      <div className="h-20"></div>
    </div>
  );
};

export default Home;
