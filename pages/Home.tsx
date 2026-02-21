
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import IntegralCard from '../components/IntegralCard';
import MathDisplay from '../components/MathDisplay';

const Home: React.FC = () => {
  const { integrals, loading, siteMeta } = useData();
  
  // Sort by ID descending to get most recent
  const recentIntegrals = [...integrals]
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
    .slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden border-b border-gray-100">
        <div className="absolute top-10 right-10 opacity-5 -rotate-12 hidden lg:block">
           <MathDisplay latex="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}" block className="text-9xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-6 tracking-tighter math-font animate-fade-in">
            Jom Integral Archive
          </h1>
          <div className="max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <p className="text-xl md:text-3xl text-gray-600 leading-relaxed font-serif italic whitespace-pre-wrap">
              {siteMeta.welcomeText}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link 
              to="/today" 
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
            >
              Today's Integral
            </Link>
            <Link 
              to="/archive" 
              className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-black transition-all"
            >
              Browse Archive
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Additions</h2>
            <p className="text-gray-500">The latest challenges from the desk of Jom.</p>
          </div>
          <Link to="/archive" className="text-blue-600 font-semibold hover:underline">
            View All →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentIntegrals.map(item => (
              <IntegralCard key={item.id} integral={item} />
            ))}
          </div>
        )}
      </section>

      {/* Quote Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <blockquote className="text-3xl md:text-4xl font-serif italic text-blue-900 leading-snug">
            "{siteMeta.quote}"
          </blockquote>
          <p className="mt-6 text-blue-600 font-bold uppercase tracking-widest text-sm">— JOM</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
