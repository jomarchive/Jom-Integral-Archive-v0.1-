
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Integral {
  id: string;      // From "ID"
  title: string;   // From "TITLE"
  difficulty: Difficulty; // From "DIFFICULTY"
  tags: string[];  // From "TAGS"
  latex: string;   // From "QUESTION"
  hint: string;    // From "HINT"
  solutionUrl: string; // From "SOLUTION"
  date: string;    // From "DATE" (dd/mm/yy)
  isTop10: boolean; // From "TOP10"
  answer: string;   // From "ANSWER"
  prompt?: string;   // From "PROMPT"
  /* Optional author thoughts or reflections */
  thoughts?: string;
}

export interface SiteMeta {
  quote: string;   // From "QUOTE" column in Text sheet
  about: string;   // From "ABOUT" column in Text sheet
  welcomeText: string; // From "WELCOME" column in Text sheet
  contact?: string;    // From "CONTACT" column
  github?: string;     // From "GITHUB" column
  credits?: string;    // From "CREDITS" column
}

export type SortOption = 'newest' | 'oldest' | 'difficulty';
