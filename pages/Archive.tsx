
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Difficulty, SortOption } from '../types';
import IntegralCard from '../components/IntegralCard';

const Archive: React.FC = () => {
  const { integrals, loading, error } = useData();
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredIntegrals = useMemo(() => {
    return integrals.filter(i => {
      const searchStr = search.toLowerCase();
      // Rules: Search TITLE, ID, TAGS
      const matchesSearch = i.title.toLowerCase().includes(searchStr) || 
                           i.tags.some(t => t.toLowerCase().includes(searchStr)) ||
                           i.id.toString().includes(searchStr);
      const matchesDiff = difficultyFilter === 'All' || i.difficulty === difficultyFilter;
      return matchesSearch && matchesDiff;
    }).sort((a, b) => {
      const idA = parseInt(a.id) || 0;
      const idB = parseInt(b.id) || 0;

      if (sortBy === 'newest') return idB - idA;
      if (sortBy === 'oldest') return idA - idB;
      if (sortBy === 'difficulty') {
        const order = { [Difficulty.HARD]: 3, [Difficulty.MEDIUM]: 2, [Difficulty.EASY]: 1 };
        return order[b.difficulty] - order[a.difficulty];
      }
      return 0;
    });
  }, [integrals, search, difficultyFilter, sortBy]);

  if (error) return (
    <div className="max-w-6xl mx-auto p-32 text-center">
      <div className="text-red-500 text-6xl mb-6">⚠️</div>
      <p className="text-red-600 font-black text-2xl tracking-tighter mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs"
      >
        Retry Sync
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-16">
        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Integral Archive</h1>
        <p className="text-xl text-gray-400 font-medium">A public ledger of {integrals.length} problems worked out with mathematical rigor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* sidebar filters */}
        <aside className="space-y-10">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Search Archive</label>
            <input 
              type="text" 
              placeholder="Title, ID, or Tag..."
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Difficulty</label>
            <div className="flex flex-col gap-2">
              {['All', Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff as any)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold border text-left transition-all ${
                    difficultyFilter === diff 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Chronology</label>
            <select 
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer font-bold text-xs text-gray-700 uppercase tracking-widest"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="newest">Latest Entries</option>
              <option value="oldest">Early Records</option>
              <option value="difficulty">By Hardship</option>
            </select>
          </div>
        </aside>

        {/* main grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-72 bg-gray-50 rounded-[2rem] animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : filteredIntegrals.length === 0 ? (
            <div className="text-center py-32 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No matches found in archive.</p>
              <button 
                onClick={() => { setSearch(''); setDifficultyFilter('All'); }}
                className="mt-6 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredIntegrals.map(item => (
                <IntegralCard key={item.id} integral={item} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Archive;
