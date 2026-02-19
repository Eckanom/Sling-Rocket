import React from 'react';
import { I18nStrings, GameMeta } from '../types';

interface MenuScreenProps {
  t: I18nStrings;
  meta: GameMeta;
  onResume: () => void;
  onStart: () => void;
  onMods: () => void;
  onSystems: () => void;
  canResume: boolean;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ t, meta, onResume, onStart, onMods, onSystems, canResume }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-5 text-center text-game-fg animate-fade-in">
      <h1 className="text-5xl tracking-[12px] mb-2 uppercase leading-none">
        SLING<br />ROCKET
      </h1>
      <div className="text-lg tracking-[4px] mb-10 opacity-80">
        {t.best}: {meta.highScore.toString().padStart(4, '0')}
      </div>

      {canResume && (
        <button onClick={onResume} className="game-btn mb-2">
          {t.resume}
        </button>
      )}
      
      <button onClick={onStart} className="game-btn mb-2">
        {t.launch}
      </button>
      
      <button onClick={onMods} className="game-btn mb-2">
        {t.mods}
      </button>
      
      <button onClick={onSystems} className="game-btn mb-2">
        {t.systems}
      </button>

      <div className="mt-5 opacity-50 text-xs tracking-[3px]">
        MASS-VELOCITY ENGINE v7.5
      </div>
    </div>
  );
};