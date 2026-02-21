
import React from 'react';
import { useData } from '../contexts/DataContext';

const About: React.FC = () => {
  const { siteMeta } = useData();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="flex justify-center mb-12">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold italic math-font">
          J
        </div>
      </div>
      
      <div className="prose prose-blue prose-xl max-w-none text-gray-700 leading-relaxed">
        <h1 className="text-5xl font-black text-gray-900 mb-8 tracking-tight text-center">About JIA</h1>
        
        <div className="mb-12 text-center">
          <p className="text-xl md:text-2xl text-gray-600 italic leading-relaxed font-serif whitespace-pre-wrap">
            {siteMeta.about}
          </p>
        </div>

        <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col items-center space-y-8">
          {siteMeta.credits && (
            <div className="text-center">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] block mb-2">Credits</span>
              <p className="text-lg text-gray-900 font-medium">{siteMeta.credits}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-md">
            {siteMeta.contact && (
              <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-2">Contact</span>
                <p className="text-sm text-gray-900 font-bold">{siteMeta.contact}</p>
              </div>
            )}
            
            {siteMeta.github && (
              <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-2">Github</span>
                <a 
                  href={siteMeta.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-600 font-bold hover:underline"
                >
                  View Profile
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
