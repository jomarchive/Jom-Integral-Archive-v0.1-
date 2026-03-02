import React from 'react';
import { Link } from 'react-router-dom';
import { Integral, Difficulty } from '../types';
import MathDisplay from './MathDisplay';

interface Props {
  integral: Integral;
}

const IntegralCard: React.FC<Props> = ({ integral }) => {
  const getDifficultyStyles = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY:
        return 'bg-green-100 text-green-700 border-green-200';
      case Difficulty.MEDIUM:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case Difficulty.HARD:
        return 'bg-red-100 text-red-700 border-red-200';
      case Difficulty.VERY_HARD:
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Link 
      to={`/integral/${integral.id}`}
      className="group block bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-lg hover:border-blue-300"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${getDifficultyStyles(integral.difficulty)}`}>
          {integral.difficulty}
        </span>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{integral.date}</span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-4 truncate">
        {integral.title}
      </h3>

      <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center min-h-[140px] mb-4 overflow-hidden">
        <div className="scale-90 md:scale-100 transform transition-transform group-hover:scale-110 duration-500">
          <MathDisplay latex={integral.latex} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {integral.tags.map(tag => (
          <span key={tag} className="text-[9px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest border border-gray-200/50">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
};

export default IntegralCard;