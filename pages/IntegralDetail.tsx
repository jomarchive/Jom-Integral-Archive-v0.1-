
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Difficulty, Integral } from '../types';
import MathDisplay from '../components/MathDisplay';

interface Props {
  integralOverride?: Integral;
}

const IntegralDetail: React.FC<Props> = ({ integralOverride }) => {
  const { id } = useParams<{ id: string }>();
  const { integrals, loading } = useData();
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const integral = integralOverride || integrals.find(i => i.id === id);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-32 text-center">
      <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 font-medium italic">Fetching data from archive...</p>
    </div>
  );

  if (!integral) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Integral not found</h2>
        <Link to="/archive" className="text-blue-600 hover:underline">Back to archive</Link>
      </div>
    );
  }

  const getDifficultyStyles = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY: return 'text-green-600 bg-green-50 border-green-200';
      case Difficulty.MEDIUM: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case Difficulty.HARD: return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  // Improved check: trigger if the tag contains "indefinite" OR the LaTeX has no limits
  const isIndefinite = integral.tags.some(tag => tag.toLowerCase().includes('indefinite')) || 
                       (integral.latex.includes('\\int') && 
                        !integral.latex.includes('_') && 
                        !integral.latex.includes('^'));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getDifficultyStyles(integral.difficulty)}`}>
              {integral.difficulty}
            </span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Entry #{integral.id} • {integral.date}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">{integral.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {integral.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-gray-100 text-gray-400 px-2 py-1 rounded uppercase font-bold tracking-widest border border-gray-200">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Problem Card */}
      <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-10 md:p-16 mb-12 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
           <span className="text-6xl font-black italic select-none">∫</span>
        </div>
        <div className="text-center relative z-10">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-12">
            {integral.prompt || 'Mathematical Challenge'}
          </p>
          <div className="py-6 overflow-x-auto flex items-center justify-center">
            <MathDisplay latex={integral.latex} block className="text-4xl md:text-6xl text-black" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Hint Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col h-full transition-all hover:border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-bold text-gray-900">Hint</h3>
          </div>
          <div className="flex-grow min-h-[100px] flex items-center justify-center">
            {showHint ? (
              <p className="text-lg text-gray-700 leading-relaxed italic text-center animate-fade-in">
                {integral.hint}
              </p>
            ) : (
              <p className="text-gray-300 text-sm font-medium text-center italic">
                Hint is currently hidden.
              </p>
            )}
          </div>
          <button 
            onClick={() => setShowHint(!showHint)}
            className={`w-full mt-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border ${showHint ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'}`}
          >
            {showHint ? 'Hide Hint' : 'Reveal Hint'}
          </button>
        </div>

        {/* Solution Section */}
        <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl flex flex-col h-full border-t-4 border-blue-600">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-lg font-bold">Solution</h3>
          </div>
          <div className="flex-grow min-h-[100px] flex flex-col items-center justify-center">
            {showAnswer ? (
              <div className="text-center animate-fade-in w-full">
                {integral.answer && (
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-3">Final Answer</p>
                    <div className="bg-white/5 py-4 px-6 rounded-2xl border border-white/10 inline-block max-w-full overflow-x-auto">
                      <MathDisplay latex={integral.answer} className="text-2xl font-bold text-white" />
                    </div>
                  </div>
                )}
                {isIndefinite && (
                  <p className="text-[10px] text-gray-400 mb-6 italic leading-relaxed px-4 text-center">
                    Note: Indefinite integral answers may look different, but they are equivalent as long as they differentiate to the same function (up to +C).
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-sm font-medium text-center italic">
                Answer is currently hidden.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 mt-8">
            <button 
              onClick={() => setShowAnswer(!showAnswer)}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${showAnswer ? 'bg-gray-800 text-gray-500 hover:text-white' : 'bg-blue-700 text-white hover:bg-blue-600'}`}
            >
              {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
            </button>
            {integral.solutionUrl && (
              <a 
                href={integral.solutionUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-white text-gray-900 hover:bg-gray-100 text-center flex items-center justify-center"
              >
                VIEW FULL SOLUTION (PDF)
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Analysis/Thoughts Section */}
      {integral.thoughts && (
        <div className="mt-16 pt-12 border-t border-gray-100">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Author's Reflections</h3>
          <p className="text-xl md:text-2xl text-gray-600 italic leading-relaxed font-serif bg-blue-50/40 p-10 rounded-[2rem] border border-blue-100/30">
            "{integral.thoughts}"
          </p>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-24 pt-8 border-t border-gray-100 flex justify-between items-center text-xs font-bold uppercase tracking-widest">
        <Link to="/archive" className="text-gray-400 hover:text-blue-600 transition-colors">
          ← Back to Archive
        </Link>
        <span className="text-gray-200">JIA • ID {integral.id}</span>
      </div>
    </div>
  );
};

export default IntegralDetail;
