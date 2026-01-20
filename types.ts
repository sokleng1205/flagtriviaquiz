
export interface Country {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  region: string;
  subregion: string;
  population: number;
  cca2: string;
}

export enum GameMode {
  HOME = 'home',
  LEARN = 'learn',
  QUIZ = 'quiz',
  STUDY = 'study'
}

export interface Question {
  id: string;
  type: 'capital' | 'currency' | 'flag';
  country: Country;
  options: string[];
  correctAnswer: string;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  score: number;
  level: number;
  isFinished: boolean;
  showLevelUp: boolean;
}
