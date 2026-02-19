import React from 'react';
import { I18nStrings, GameMeta, Language, ThemeType } from '../types';

interface SystemsScreenProps {
  t: I18nStrings;
  meta: GameMeta;
  onSetTheme: (theme: ThemeType) => void;
  onSetSpeed: (speed: number) => void;
  onSetLang: (lang: Language) => void;
  onBack: () => void;
}

export const SystemsScreen: React.FC<SystemsScreenProps> = ({ t, meta, onSetTheme, onSetSpeed, onSetLang, onBack }) => {
  
  const ThemeBtn = ({ th, label }: { th: ThemeType, label: string }) => {
    let isActive = false;
    if (th === 'dark' && !meta.inverted && !meta.retroActive) isActive = true;
    if (th === 'light' && meta.inverted) isActive = true;
    if (th === 'retro' && meta.retroActive) isActive = true;

    return (
      <button onClick={() => onSetTheme(th)} className={`flex-1 h-11 text-xs border border-game-fg ${isActive ? 'active-setting' : ''} hover:bg-game-faint`}>
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-5 text-game-fg overflow-y-auto">
      <h1 className="text-3xl tracking-[12px] mb-5 uppercase">{t.systems}</h1>

      <div className="w-full max-w-xs space-y-4">
        {/* Appearance */}
        <div className="border-t border-game-faint pt-4 flex flex-col items-center">
          <div className="text-xs opacity-60 mb-2 uppercase tracking-[3px]">{t.appearance}</div>
          <div className="flex gap-1.5 w-full">
            <ThemeBtn th="dark" label="DARK" />
            <ThemeBtn th="light" label="LIGHT" />
            <ThemeBtn th="retro" label="RETRO" />
          </div>
        </div>

        {/* Speed */}
        <div className="border-t border-game-faint pt-4 flex flex-col items-center">
          <div className="text-xs opacity-60 mb-2 uppercase tracking-[3px]">{t.speed}</div>
          <div className="flex gap-1.5 w-full">
            {[1, 1.2, 1.5].map(s => (
               <button 
                 key={s} 
                 onClick={() => onSetSpeed(s)} 
                 className={`flex-1 h-11 text-xs border border-game-fg ${meta.gameSpeed === s ? 'active-setting' : ''} hover:bg-game-faint`}
               >
                 {s}x
               </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="border-t border-game-faint pt-4 flex flex-col items-center">
          <div className="text-xs opacity-60 mb-2 uppercase tracking-[3px]">{t.language}</div>
          <div className="grid grid-cols-4 gap-1.5 w-full">
            {(['en', 'ru', 'de', 'fr', 'es', 'it', 'pt', 'pl', 'nl', 'zh', 'ja', 'ko'] as Language[]).map(l => (
              <button 
                key={l} 
                onClick={() => onSetLang(l)} 
                className={`h-10 text-[10px] border border-game-fg ${meta.language === l ? 'active-setting' : ''} hover:bg-game-faint uppercase`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onBack} className="game-btn mt-6 border-game-faint">
          {t.back}
        </button>
      </div>
    </div>
  );
};