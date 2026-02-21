import React, { useState, useMemo } from 'react';
import katex from 'katex';

interface MathDisplayProps {
  latex: string;
  block?: boolean;
  className?: string;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ latex, block = false, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: block,
        trust: false, // Security: Disable trust for external LaTeX strings
        strict: false
      });
    } catch (err) {
      console.error("KaTeX rendering error:", err);
      return `<span class="text-red-500 font-mono text-xs">${latex}</span>`;
    }
  }, [latex, block]);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group inline-block ${block ? 'w-full my-4' : ''} ${className}`}>
      <div 
        className={`${block ? 'w-full flex justify-center py-2' : 'inline'}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      
      {/* Functional Utility: Copy raw LaTeX */}
      <button
        onClick={handleCopy}
        type="button"
        className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100 z-50 shadow-xl border border-gray-700 whitespace-nowrap ${copied ? 'bg-blue-600 opacity-100' : ''}`}
      >
        {copied ? 'Copied LaTeX!' : 'Copy LaTeX'}
      </button>
    </div>
  );
};

export default MathDisplay;