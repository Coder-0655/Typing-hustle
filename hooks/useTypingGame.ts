import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameState, TestResult } from '../types';

export const useTypingGame = (
  duration: number,
  paragraphGenerator: () => Promise<string>,
  onGameEnd: (result: TestResult) => void
) => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [textToType, setTextToType] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(duration);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);

  // FIX: In a browser environment, setInterval returns a number, not a NodeJS.Timeout.
  const timerRef = useRef<number | null>(null);
  const statsRef = useRef({
    totalChars: 0,
    correctChars: 0,
    errors: 0,
    startTime: 0,
  });

  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('waiting');
    setTextToType('');
    setUserInput('');
    setTimeRemaining(duration);
    setWpm(0);
    setAccuracy(100);
    setErrorIndexes([]);
    statsRef.current = { totalChars: 0, correctChars: 0, errors: 0, startTime: 0 };
  }, [duration]);
  
  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('finished');

    const { correctChars } = statsRef.current;
    const finalWpm = Math.round((correctChars / 5) / (duration / 60));
    
    const totalTyped = userInput.length;
    const finalAccuracy = totalTyped > 0 ? Math.round(((totalTyped - errorIndexes.length) / totalTyped) * 100) : 100;
    
    setWpm(finalWpm);
    setAccuracy(finalAccuracy);

    const result: TestResult = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      timestamp: Date.now(),
    };
    onGameEnd(result);
  }, [duration, onGameEnd, userInput.length, errorIndexes.length]);


  useEffect(() => {
    if (gameState === 'running' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && gameState === 'running') {
      endGame();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeRemaining, endGame]);

  const startGame = async () => {
    resetGame();
    const paragraph = await paragraphGenerator();
    setTextToType(paragraph);
    setGameState('running');
    statsRef.current.startTime = Date.now();
  };

  const handleUserInputChange = (value: string) => {
    if (gameState !== 'running') return;
    setUserInput(value);
    
    const currentErrors: number[] = [];
    let correctCharsCount = 0;
    
    for (let i = 0; i < value.length; i++) {
        if (value[i] !== textToType[i]) {
            currentErrors.push(i);
        } else {
            correctCharsCount++;
        }
    }
    setErrorIndexes(currentErrors);

    statsRef.current.correctChars = correctCharsCount;
    statsRef.current.errors = currentErrors.length;

    const timeElapsed = (Date.now() - statsRef.current.startTime) / 1000 / 60; // in minutes
    if (timeElapsed > 0) {
      const currentWpm = Math.round((correctCharsCount / 5) / timeElapsed);
      setWpm(currentWpm);
    }
    
    const totalTyped = value.length;
    if (totalTyped > 0) {
        const currentAccuracy = Math.round(((totalTyped - currentErrors.length) / totalTyped) * 100);
        setAccuracy(currentAccuracy);
    } else {
        setAccuracy(100);
    }
  };

  return {
    gameState,
    textToType,
    userInput,
    timeRemaining,
    wpm,
    accuracy,
    errorIndexes,
    startGame,
    handleUserInputChange,
    resetGame,
  };
};
