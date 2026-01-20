
import React, { useState, useMemo } from 'react';
import { Country } from '../types';
import { Search, MapPin, Users, Coins, Info, X } from 'lucide-react';
import { getCountryFact } from '../services/gemini';

interface LearnModeProps {
  countries: Country[];
}

const LearnMode: React.FC<LearnModeProps> = ({ countries }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [fact, setFact] = useState<string | null>(null);
  const [loadingFact, setLoadingFact] = useState(false);

  const filteredCountries = useMemo(() => {
    return countries.filter(c => 
      c.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.capital?.[0]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  const handleCountryClick = async (country: Country) => {
    setSelectedCountry(country);
    setFact(null);
    setLoadingFact(true);
    const newFact = await getCountryFact(country.name.common);
    setFact(newFact);
    setLoadingFact(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold">World Database</h2>
          <p className="text-slate-400 mt-1 font-light">Discover every nation's profile.</p>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or capital..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCountries.map((c) => (
          <div 
            key={c.cca2}
            onClick={() => handleCountryClick(c)}
            className="group glass-card rounded-3xl overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all hover:translate-y-[-4px]"
          >
            <div className="aspect-[16/10] overflow-hidden bg-slate-800">
              <img 
                src={c.flags.svg} 
                alt={c.flags.alt} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold truncate pr-2">{c.name.common}</h3>
                <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">{c.cca2}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin size={14} className="text-indigo-400" />
                <span>{c.capital?.[0] || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Users size={14} className="text-emerald-400" />
                <span>{(c.population / 1000000).toFixed(1)}M people</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedCountry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedCountry(null)}></div>
          <div className="relative w-full max-w-4xl glass-card rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedCountry(null)}
              className="absolute top-6 right-6 z-10 p-3 bg-slate-900/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-slate-900">
                <img 
                  src={selectedCountry.flags.svg} 
                  alt={selectedCountry.flags.alt} 
                  className="w-full h-full object-cover min-h-[300px]"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 space-y-8 overflow-y-auto max-h-[70vh] md:max-h-none no-scrollbar">
                <div>
                  <div className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-2">{selectedCountry.region}</div>
                  <h2 className="text-4xl font-extrabold mb-1">{selectedCountry.name.common}</h2>
                  <p className="text-slate-500 font-medium italic">{selectedCountry.name.official}</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin size={12} /> Capital
                    </div>
                    <div className="text-xl font-bold">{selectedCountry.capital?.[0] || 'N/A'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Users size={12} /> Population
                    </div>
                    <div className="text-xl font-bold">{selectedCountry.population.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Coins size={12} /> Currency
                    </div>
                    <div className="text-xl font-bold">
                      {/* Fix: cast to any to resolve unknown property access */}
                      {(Object.values(selectedCountry.currencies)[0] as any)?.name} ({(Object.values(selectedCountry.currencies)[0] as any)?.symbol})
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Globe2 size={12} /> Subregion
                    </div>
                    <div className="text-xl font-bold">{selectedCountry.subregion}</div>
                  </div>
                </div>

                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-3">
                    <Info size={16} />
                    <span>AI INSIGHT</span>
                  </div>
                  {loadingFact ? (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  ) : (
                    <p className="text-slate-200 text-lg font-light leading-relaxed">
                      "{fact}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h-20"></div>
    </div>
  );
};

const Globe2 = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);

export default LearnMode;
