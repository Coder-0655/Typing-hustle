
import React, { useEffect, useRef, useMemo } from 'react';
import type { GameState } from '../types';

interface TypingAreaProps {
  textToType: string;
  userInput: string;
  onUserInputChange: (value: string) => void;
  gameState: GameState;
  errorIndexes: number[];
}

const Character: React.FC<{
  char: string;
  state: 'correct' | 'incorrect' | 'untyped' | 'cursor';
}> = React.memo(({ char, state }) => {
  const classMap = {
    correct: 'text-green-400',
    incorrect: 'bg-red-500 text-white rounded',
    untyped: 'text-gray-400',
    cursor: 'bg-cyan-500 text-gray-900 rounded animate-blink',
  };
  return <span className={`${classMap[state]} transition-colors duration-200`}>{char}</span>;
});

export const TypingArea: React.FC<TypingAreaProps> = ({
  textToType,
  userInput,
  onUserInputChange,
  gameState,
  errorIndexes,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameState === 'running') {
      inputRef.current?.focus();
    }
  }, [gameState]);

  const renderedText = useMemo(() => {
    return textToType.split('').map((char, index) => {
      let state: 'correct' | 'incorrect' | 'untyped' | 'cursor' = 'untyped';
      if (index < userInput.length) {
        state = errorIndexes.includes(index) ? 'incorrect' : 'correct';
      } else if (index === userInput.length) {
        state = 'cursor';
      }

      return <Character key={`${char}-${index}`} char={char} state={state} />;
    });
  }, [textToType, userInput, errorIndexes]);

  return (
    <div className="relative" onClick={() => inputRef.current?.focus()}>
      <div
        className={`font-mono text-2xl sm:text-3xl leading-relaxed tracking-wide p-4 rounded-md bg-gray-700 select-none ${gameState !== 'running' ? 'blur-sm' : ''} transition-all duration-300`}
        style={{ minHeight: '140px' }}
      >
        {renderedText}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => onUserInputChange(e.target.value)}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-default"
        disabled={gameState !== 'running'}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  );
};
