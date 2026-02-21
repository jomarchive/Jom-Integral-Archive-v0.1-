
import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import IntegralDetail from './IntegralDetail';

const Today: React.FC = () => {
  const { integrals, loading } = useData();

  const dailyIntegral = useMemo(() => {
    if (integrals.length === 0) return null;
    
    // Select the question with the most recent date, then highest ID as tie-breaker
    const sorted = [...integrals].sort((a, b) => {
      const parseDate = (d: string) => {
        if (!d) return 0;
        const parts = d.split('/').map(Number);
        if (parts.length !== 3) return 0;
        const [day, month, yearPart] = parts;
        // Handle dd/mm/yy format
        const year = yearPart < 100 ? 2000 + yearPart : yearPart;
        return new Date(year, month - 1, day).getTime();
      };
      
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      
      if (dateB !== dateA) return dateB - dateA;
      
      // Tie-breaker: ID descending to get the absolute latest entry added
      return (parseInt(b.id) || 0) - (parseInt(a.id) || 0);
    });

    return sorted[0];
  }, [integrals]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-32 text-center">
      <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 font-medium italic">Selecting the latest challenge from Jom's archive...</p>
    </div>
  );
  
  if (!dailyIntegral) return <div className="p-32 text-center text-red-500 font-bold">Archive is currently empty.</div>;

  return (
    <div>
      <div className="bg-blue-600 py-12 text-center text-white border-b border-blue-700 shadow-inner">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2 tracking-tighter">Today's Integral</h1>
          <p className="text-blue-100 italic opacity-80">The most recently added challenge to the archive.</p>
        </div>
      </div>
      <IntegralDetail integralOverride={dailyIntegral} />
    </div>
  );
};

export default Today;
