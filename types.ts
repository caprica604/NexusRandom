
export enum ToolType {
  BASIC = 'BASIC',
  UTILITY = 'UTILITY',
  LOTTERY = 'LOTTERY',
  TECHNICAL = 'TECHNICAL',
  AI = 'AI',
  GAMES = 'GAMES',
  MATH = 'MATH',
  ABOUT = 'ABOUT'
}

export interface HistoryItem {
  id: string;
  type: ToolType;
  result: string | string[];
  timestamp: number;
  label?: string;
}

export interface LotteryPreset {
  name: string;
  type: 'POOL' | 'DIGIT'; // POOL = Unique from range, DIGIT = Independent 0-9
  min: number;
  max: number;
  count: number;
  extra?: {
    min: number;
    max: number;
    count: number;
    label: string;
  };
}