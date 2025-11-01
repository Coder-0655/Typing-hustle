import React, { useState, useEffect, useCallback } from 'react';
import { TypingArea } from './components/TypingArea';
import { Stats } from './components/Stats';
import { Results } from './components/Results';
import { useTypingGame } from './hooks/useTypingGame';
import { generateRandomParagraph } from './services/geminiService';
import type { TestResult } from './types';
import { RACE_DURATION, sounds } from './constants';
import useSound from './hooks/useSound';
import { AdComponent } from './components/AdComponent';

const MuteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const UnmuteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v-10.5l-3.375 3.375h-1.125a1.125 1.125 0 00-1.125 1.125v3.375c0 .621.504 1.125 1.125 1.125h1.125L9 17.25zM12.75 12l3-3m0 0l3-3m-3 3l-3 3m3-3l3 3" />
  </svg>
);

const App: React.FC = () => {
  const [history, setHistory] = useState<TestResult[]>([]);
  const { isMuted, toggleMute, playSound, loadSound } = useSound();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('typingHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      localStorage.removeItem('typingHistory');
    }
  }, []);

  // FIX: The function was incomplete. Added type annotation for 'result' to fix 'Cannot find name result' error and completed function body.
  const onGameEnd = useCallback((result: TestResult) => {
    const newHistory = [...history, result];
    setHistory(newHistory);
    try {
      localStorage.setItem('typingHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const {
    gameState,
    textToType,
    userInput,
    timeRemaining,
    wpm,
    accuracy,
    errorIndexes,
    startGame,
    handleUserInputChange,
  } = useTypingGame(RACE_DURATION, generateRandomParagraph, onGameEnd);
  
  useEffect(() => {
    loadSound('start', sounds.start);
  }, [loadSound]);

  useEffect(() => {
    if (gameState === 'running') {
      playSound('start');
    }
  }, [gameState, playSound]);

  return (
    <div className="bg-gray-800 text-gray-100 min-h-screen font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-cyan-400">Typing Test</h1>
          <button onClick={toggleMute} className="p-2 rounded-full hover:bg-gray-700 transition">
            {isMuted ? <MuteIcon /> : <UnmuteIcon />}
          </button>
        </header>

        <main>
          {gameState === 'finished' ? (
            <Results
              wpm={wpm}
              accuracy={accuracy}
              history={history}
              onRestart={startGame}
            />
          ) : (
            <div className="space-y-8">
              <Stats wpm={wpm} accuracy={accuracy} timeRemaining={timeRemaining} />
              <TypingArea
                textToType={textToType}
                userInput={userInput}
                onUserInputChange={handleUserInputChange}
                gameState={gameState}
                errorIndexes={errorIndexes}
              />
              {gameState === 'waiting' && (
                <div className="text-center">
                  <button
                    onClick={startGame}
                    className="mt-4 px-6 py-3 bg-cyan-500 text-gray-900 font-bold text-lg rounded-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Start Typing
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
        <AdComponent />
      </div>
    </div>
  );
};

// FIX: Add default export to resolve "no default export" error in index.tsx.
export default App;
