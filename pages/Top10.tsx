
import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Difficulty } from '../types';
import MathDisplay from '../components/MathDisplay';
import { Link } from 'react-router-dom';

const Top10: React.FC = () => {
  const { integrals, loading } = useData();
  
  const topIntegrals = useMemo(() => {
    return integrals.filter(i => i.isTop10);
  }, [integrals]);

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY: return 'text-green-500';
      case Difficulty.MEDIUM: return 'text-yellow-500';
      case Difficulty.HARD: return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-32 text-center text-gray-400 font-medium italic">Scanning the Hall of Fame...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">
          Top 10 Integrals
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-serif italic">
          Jom’s hand-picked integrals. The harder the problem, the more satisfying it is to solve. Give these a try.
        </p>
      </div>

      <div className="space-y-12">
        {topIntegrals.length > 0 ? topIntegrals.map((integral, index) => (
          <div key={integral.id} className="group relative bg-white border border-gray-100 rounded-3xl p-8 md:p-12 transition-all hover:shadow-2xl hover:border-blue-200 shadow-sm flex flex-col md:flex-row gap-8 items-center overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="absolute top-0 left-0 bg-blue-600 text-white px-6 py-2 rounded-br-3xl font-black text-2xl tracking-tighter">
              #{integral.id}
            </div>

            <div className="flex-1 text-center md:text-left pt-6 md:pt-0">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                 <span className={`text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(integral.difficulty)}`}>
                   {integral.difficulty}
                 </span>
                 <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                 <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{integral.date}</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors">
                {integral.title}
              </h2>

              <div className="bg-gray-50/50 rounded-2xl p-8 flex items-center justify-center min-h-[160px] border border-gray-50 mb-6 overflow-x-auto">
                <MathDisplay latex={integral.latex} block className="text-2xl md:text-3xl" />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap justify-center md:justify-start gap-2 max-w-md">
                  {integral.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold uppercase tracking-tight">#{tag}</span>
                  ))}
                </div>
                <Link 
                  to={`/integral/${integral.id}`}
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 italic">No integrals currently marked for Top 10.</p>
          </div>
        )}
      </div>

      <div className="mt-20 p-12 bg-blue-50 rounded-3xl text-center border border-blue-100">
        <h3 className="text-2xl font-bold text-blue-900 mb-4">Keep Exploring</h3>
        <p className="text-blue-700 mb-8 max-w-lg mx-auto">Every integral in the archive has its own story. Browse the full collection to find your next challenge.</p>
        <Link to="/archive" className="text-blue-600 font-black uppercase tracking-widest hover:underline">
          Explore full archive →
        </Link>
      </div>
    </div>
  );
};

export default Top10;
