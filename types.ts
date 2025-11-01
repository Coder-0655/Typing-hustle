
export type GameState = 'waiting' | 'running' | 'finished';

export interface TestResult {
  wpm: number;
  accuracy: number;
  timestamp: number;
}
