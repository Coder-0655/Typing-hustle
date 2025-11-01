
import React, { useState, useEffect, useCallback } from 'react';
import { TypingArea } from './components/TypingArea';
import { Stats } from './components/Stats';
import { Results } from './components/Results';
import { useTypingGame } from './hooks/useTypingGame';
import { generateRandomParagraph } from './services/geminiService';
import type { TestResult } from './types';
import { RACE_DURATION } from './constants';

const App: React.FC = () => {
  const [history, setHistory] = useState<TestResult[]>([]);

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

  const onGameEnd = useCallback((result: TestResult) => {
    setHistory(prevHistory => {
      const newHistory = [...prevHistory, result];
      try {
        localStorage.setItem('typingHistory', JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
      }
      return newHistory;
    });
  }, []);

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
    resetGame,
  } = useTypingGame(RACE_DURATION, generateRandomParagraph, onGameEnd);

  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    await startGame();
    setIsLoading(false);
  };
  
  const handleReset = () => {
    resetGame();
    // Clear last test from history if user resets immediately after finishing
    const lastResultTimestamp = history.length > 0 ? history[history.length - 1].timestamp : 0;
    if (Date.now() - lastResultTimestamp < 2000) { // If finished within last 2s
      setHistory(prev => prev.slice(0, -1));
    }
  }


  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-wider">Typing Speed Race</h1>
          <p className="text-gray-400 mt-2">How fast are your fingers? Test your WPM and accuracy.</p>
        </header>

        <main className="bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8 relative">
          {gameState === 'finished' ? (
            <Results wpm={wpm} accuracy={accuracy} history={history} onRestart={handleReset} />
          ) : (
            <>
              <Stats wpm={wpm} accuracy={accuracy} timeRemaining={timeRemaining} />
              <div className="mt-6 relative">
                 <TypingArea
                    textToType={textToType}
                    userInput={userInput}
                    onUserInputChange={handleUserInputChange}
                    gameState={gameState}
                    errorIndexes={errorIndexes}
                  />
                {gameState === 'waiting' && !isLoading && (
                   <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 rounded-lg">
                     <button
                       onClick={handleStart}
                       className="px-8 py-4 bg-cyan-500 text-gray-900 font-bold text-xl rounded-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                     >
                       Start Race
                     </button>
                   </div>
                 )}
                 {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-90 rounded-lg">
                       <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                       <p className="mt-4 text-cyan-300">Generating paragraph...</p>
                    </div>
                 )}
              </div>
            </>
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by React, Tailwind CSS, and Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
