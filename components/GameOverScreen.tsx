import React from 'react';
import { I18nStrings, GameMeta } from '../types';

interface GameOverScreenProps {
  t: I18nStrings;
  meta: GameMeta;
  score: number;
  reason: string;
  onReboot: () => void;
  onMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ t, meta, score, reason, onReboot, onMenu }) => {
  const reasonText = (t as any)[reason] || reason;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-5 text-game-fg animate-fade-in">
      <h1 className="text-4xl tracking-[12px] mb-2 uppercase">{t.crashed}</h1>
      <div className="mb-2 opacity-70 uppercase tracking-[2px] text-sm">{reasonText}</div>
      <div className="mb-8 tracking-[2px] text-lg">
         {t.hi}:{meta.highScore.toString().padStart(4, '0')} | {t.cur}:{score.toString().padStart(4, '0')}
      </div>
      
      <button onClick={onReboot} className="game-btn mb-2">
        {t.reboot}
      </button>
      
      <button onClick={onMenu} className="game-btn mt-2 border-game-faint">
        {t.menu}
      </button>
    </div>
  );
};