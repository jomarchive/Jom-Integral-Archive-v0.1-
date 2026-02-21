
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import Papa from 'papaparse';
import { Integral, Difficulty, SiteMeta } from '../types';

interface DataContextType {
  integrals: Integral[];
  loading: boolean;
  error: string | null;
  siteMeta: SiteMeta;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Sheet URLs
const INTEGRAL_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFlR4Ae4g548TTVfH8d59V53zqNIiAmCKeEthXGk5Gb6KaC6vwaFmOCJoT0d0nqpwnhfRNrQKLiL6l/pub?gid=0&single=true&output=csv';
const TEXT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFlR4Ae4g548TTVfH8d59V53zqNIiAmCKeEthXGk5Gb6KaC6vwaFmOCJoT0d0nqpwnhfRNrQKLiL6l/pub?gid=2106173947&single=true&output=csv';

const FALLBACK_INTEGRALS: Integral[] = [
  {
    id: "1",
    title: "Valentine's Special Integral",
    difficulty: Difficulty.HARD,
    tags: ["parametric", "heart"],
    latex: "x(t)=16\\sin^3t, y(t)=13\\cos t-5\\cos(2t)-2\\cos(3t)-\\cos(4t)",
    hint: "You can kill terms using orthogonality.",
    solutionUrl: "https://drive.google.com/file/d/1RNlNYd9zXBQHPpe9VYz1Zv35BuAwNTnO/view?usp=sharing",
    date: "14/02/26",
    isTop10: true,
    answer: "565.49"
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [integrals, setIntegrals] = useState<Integral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [siteMeta, setSiteMeta] = useState<SiteMeta>({
    quote: "Loading...",
    about: "Loading...",
    welcomeText: "Loading...",
    contact: "Loading...",
    github: "Loading...",
    credits: "Loading..."
  });

  // Use a ref to track if we have data to avoid dependency loops in useCallback
  const hasDataRef = React.useRef(false);

  const fetchData = useCallback(async () => {
    const executeFetch = async (attempt: number = 1): Promise<void> => {
      try {
        const [integralRes, textRes] = await Promise.all([
          fetch(INTEGRAL_SHEET_URL, { credentials: 'omit' }),
          fetch(TEXT_SHEET_URL, { credentials: 'omit' })
        ]);

        if (!integralRes.ok || !textRes.ok) throw new Error(`Archive server returned ${integralRes.status}/${textRes.status}`);

        const integralCsv = await integralRes.text();
        const textCsv = await textRes.text();

        // Parse Text Sheet
        Papa.parse(textCsv, {
          header: true,
          complete: (results) => {
            const firstRow: any = results.data[0];
            if (firstRow) {
              setSiteMeta({
                quote: firstRow.QUOTE || "",
                about: firstRow.ABOUT || "",
                welcomeText: firstRow.WELCOME || "",
                contact: firstRow.CONTACT || "",
                github: firstRow.GITHUB || "",
                credits: firstRow.CREDITS || ""
              });
            }
          }
        });

        // Parse Integral Sheet
        Papa.parse(integralCsv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData: Integral[] = results.data.map((row: any) => {
              let diff = Difficulty.MEDIUM;
              const rawDiff = String(row.DIFFICULTY || '').toLowerCase().trim();
              if (rawDiff === 'easy') diff = Difficulty.EASY;
              else if (rawDiff === 'hard') diff = Difficulty.HARD;

              const rawTags = row.TAGS ? row.TAGS.split(',').map((t: string) => t.trim().toLowerCase()) : [];

              return {
                id: String(row.ID || ''),
                title: row.TITLE || 'Untitled',
                difficulty: diff,
                tags: rawTags,
                latex: row.QUESTION || '',
                hint: row.HINT || 'No hint available.',
                solutionUrl: row.SOLUTION || '',
                date: row.DATE || '',
                isTop10: String(row.TOP10 || '').toLowerCase() === 'true',
                answer: row.ANSWER || '',
                prompt: row.PROMPT || '',
                thoughts: row.THOUGHTS || ''
              };
            });

            const validData = parsedData.filter(i => i.id && i.latex);
            if (validData.length > 0) {
              setIntegrals(validData);
              hasDataRef.current = true;
              setError(null);
            }
            setLoading(false);
          },
          error: (err: any) => {
            console.error("CSV Parse Error:", err);
            if (!hasDataRef.current) {
              setError('Error parsing integral data.');
            }
            setLoading(false);
          }
        });

      } catch (err) {
        console.error(`Fetch Attempt ${attempt} failed:`, err);
        
        if (attempt < 3) {
          // Exponential backoff: 1s, 2s
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          return executeFetch(attempt + 1);
        }

        // Final failure
        if (!hasDataRef.current) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown network error';
          setError(`Archive connection failed (${errorMessage}). Using local fallback.`);
          setIntegrals(FALLBACK_INTEGRALS);
          setSiteMeta({
            quote: "Integration is an art, not just a calculation.",
            about: "A public collection of elegant, brutal, and interesting calculus problems.",
            welcomeText: "Welcome to the archive.",
            contact: "",
            github: "",
            credits: ""
          });
        }
        setLoading(false);
      }
    };

    await executeFetch();
  }, []); // Empty dependencies to prevent infinite loop


  useEffect(() => {
    fetchData();
    
    // Poll for changes every 30 seconds to ensure the app stays "constantly updated"
    const interval = setInterval(fetchData, 30000);
    
    // Also refresh when the tab is focused to provide immediate updates
    window.addEventListener('focus', fetchData);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', fetchData);
    };
  }, [fetchData]);

  return (
    <DataContext.Provider value={{ integrals, loading, error, siteMeta, refresh: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
