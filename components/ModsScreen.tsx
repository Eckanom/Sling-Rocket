import React from 'react';
import { I18nStrings, GameMeta } from '../types';
import { getModCost } from '../constants';

interface ModsScreenProps {
  t: I18nStrings;
  meta: GameMeta;
  onToggleBuy: (key: string) => void;
  onBack: () => void;
}

export const ModsScreen: React.FC<ModsScreenProps> = ({ t, meta, onToggleBuy, onBack }) => {
  const renderBtn = (key: string, label: string) => {
    // Determine if we own it
    let isOwned = false;
    let isActive = false;

    // Special handling for keys that are not boolean flags in GameMeta
    const isConsumable = key === 'mass' || key === 'ropeTension';

    if (isConsumable) {
      // These are consumable upgrades or levels, not simple owned/active toggles
      isOwned = false; 
      isActive = false;
    } else {
      // For standard mods (borders, bounce, rope5, rope10), we check their 'has' and 'Active' status
      const hasKey = ('has' + key.charAt(0).toUpperCase() + key.slice(1)) as keyof GameMeta;
      const activeKey = (key + 'Active') as keyof GameMeta;
      
      isOwned = !!meta[hasKey];
      isActive = !!meta[activeKey];
    }

    const cost = getModCost(key, meta);
    const isDisabled = !isOwned && meta.credits < cost;

    // Construct Label
    let displayLabel = label;
    // Show cost if it's a consumable upgrade OR if we don't own it yet
    if (isConsumable || !isOwned) {
      displayLabel += ` [${cost}]`;
    }

    return (
      <button 
        onClick={() => onToggleBuy(key)}
        className={`game-btn mb-1.5 ${isActive ? 'active-setting' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {displayLabel}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-5 text-game-fg">
      <h1 className="text-3xl tracking-[12px] mb-2 uppercase">{t.mods}</h1>
      
      <div className="mb-4 text-sm leading-relaxed text-center whitespace-pre-line">
        {t.balance}: {Math.floor(meta.credits)}
        {'\n'}{t.mass}: {(1.2 - meta.massLevel * 0.1).toFixed(2)}t
        {'\n'}{t.rope} {t.lvl}: {meta.ropeLevel}
      </div>

      <div className="flex flex-col w-full max-w-xs items-center h-full overflow-y-auto pb-10">
        {renderBtn('mass', t.upMass)}
        {renderBtn('ropeTension', t.upRope)}
        {renderBtn('borders', t.upBorders)}
        {renderBtn('bounce', t.upBounce)}
        {renderBtn('rope5', t.upRope5)}
        {renderBtn('rope10', t.upRope10)}
        
        <button onClick={onBack} className="game-btn mt-4 border-game-faint">
          {t.back}
        </button>
      </div>
    </div>
  );
};