import React from 'react';
import { useData } from '../contexts/DataContext';

const Footer: React.FC = () => {
  const { siteMeta } = useData();

  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {siteMeta.credits && (
          <p className="text-sm text-gray-400 font-medium mb-1">
            {siteMeta.credits}
          </p>
        )}
        {siteMeta.contact && (
          <p className="text-xs text-gray-400 font-medium mb-2">
            {siteMeta.contact}
          </p>
        )}
        <div className="mt-6 flex justify-center space-x-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
          {siteMeta.github && (
            <a 
              href={siteMeta.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-600 transition-colors"
            >
              Github
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
