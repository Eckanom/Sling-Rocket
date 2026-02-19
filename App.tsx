import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './services/gameEngine';
import { loadGameData, saveGameData } from './services/storageService';
import { I18N, getModCost } from './constants';
import { GameMeta, ViewState, Language } from './types';
import { MenuScreen } from './components/MenuScreen';
import { ModsScreen } from './components/ModsScreen';
import { SystemsScreen } from './components/SystemsScreen';
import { GameOverScreen } from './components/GameOverScreen';

const App: React.FC = () => {
  const [meta, setMeta] = useState<GameMeta>(loadGameData());
  const [view, setView] = useState<ViewState>('MENU');
  const [canResume, setCanResume] = useState(false);
  const [hudState, setHudState] = useState({ score: 0, speed: 0, cooldown: 0 });
  const [deathReason, setDeathReason] = useState('impact');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  
  // Translation helper
  const t = I18N[meta.language] || I18N.en;

  // CSS Variables for Theme
  const themeStyles = React.useMemo(() => {
    if (meta.retroActive) {
      return { '--bg': '#2b301a', '--fg': '#d9e0bd', '--faint': 'rgba(217, 224, 189, 0.15)', '--ghost': 'rgba(217, 224, 189, 0.2)' } as React.CSSProperties;
    }
    if (meta.inverted) {
      return { '--bg': '#fff', '--fg': '#000', '--faint': 'rgba(0, 0, 0, 0.1)', '--ghost': 'rgba(0, 0, 0, 0.1)' } as React.CSSProperties;
    }
    return { '--bg': '#000', '--fg': '#fff', '--faint': 'rgba(255, 255, 255, 0.15)', '--ghost': 'rgba(255, 255, 255, 0.2)' } as React.CSSProperties;
  }, [meta.retroActive, meta.inverted]);

  // Handle Game Over from Engine
  const handleGameOver = useCallback((reason: string) => {
    if (engineRef.current) {
      engineRef.current.stop();
      // Sync credits and highscore from engine to React state
      const engineMeta = engineRef.current.meta;
      setMeta(prev => ({
        ...prev,
        credits: engineMeta.credits,
        highScore: Math.max(prev.highScore, engineMeta.highScore)
      }));
    }
    setDeathReason(reason);
    setCanResume(false);
    setView('GAMEOVER');
  }, []);

  // Handle HUD updates
  const handleHUD = useCallback((score: number, speed: number, cooldown: number) => {
    // Only update React state if strictly necessary to avoid thrashing, 
    // but for this simple HUD 60fps React updates are usually okay on modern devices.
    // For optimization, we could use refs for DOM elements, but let's try state first.
    setHudState({ score, speed, cooldown });
  }, []);

  // Initialize Engine
  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new GameEngine(
        canvasRef.current, 
        meta, 
        handleGameOver,
        handleHUD
      );
      // Force initial draw so stars are visible in menu
      engineRef.current.draw();
    }
  }, []); // Run once

  // Sync Meta with Engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateMeta(meta);
      saveGameData(meta);
    }
  }, [meta]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (engineRef.current) {
        engineRef.current.resize();
        if (view === 'MENU') engineRef.current.draw();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [view]);

  // Input Handlers
  const handleInputStart = (e: React.SyntheticEvent) => {
    // Prevent default to stop scrolling/highlighting
    if (e.type === 'touchstart') {
      // Don't prevent default on buttons if they bubble up, but here we are on the game container
    }
    if (view === 'GAME' && engineRef.current) {
       engineRef.current.handleInput(true);
    }
  };

  const handleInputEnd = () => {
    if (view === 'GAME' && engineRef.current) {
      engineRef.current.handleInput(false);
    }
  };

  // Game Logic Actions
  const startGame = () => {
    setView('GAME');
    setCanResume(true);
    if (engineRef.current) engineRef.current.start();
  };

  const resumeGame = () => {
    setView('GAME');
    if (engineRef.current) engineRef.current.resume();
  };

  const pauseGame = () => {
    setView('MENU');
    if (engineRef.current) engineRef.current.stop();
  };

  const rebootGame = () => {
    startGame();
  };

  // Mod Logic
  const toggleOrBuy = (key: string) => {
    setMeta(prev => {
      const cost = getModCost(key, prev);
      
      let newMeta = { ...prev };

      // Handle mass/rope levels separately if they aren't booleans in logic but buttons imply upgrades
      if (key === 'mass') {
          if (prev.credits >= cost) {
              newMeta.credits -= cost;
              newMeta.massLevel += 1;
          }
          return newMeta;
      }
      if (key === 'ropeTension') {
          if (prev.credits >= cost) {
              newMeta.credits -= cost;
              newMeta.ropeLevel += 1;
          }
          return newMeta;
      }

      const hasKey = ('has' + key.charAt(0).toUpperCase() + key.slice(1)) as keyof GameMeta;
      const activeKey = (key + 'Active') as keyof GameMeta;

      if (prev[hasKey]) {
        // Toggle
        newMeta[activeKey] = !prev[activeKey] as never;
      } else {
        // Buy
        if (prev.credits >= cost) {
          newMeta.credits -= cost;
          newMeta[hasKey] = true as never;
          newMeta[activeKey] = true as never;
        }
      }
      return newMeta;
    });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#0a0a0a]" style={themeStyles}>
      {/* 
        Container Logic: 
        1. Default (Mobile): w-full h-full (fills screen)
        2. Desktop (md+): Max width 450px, Aspect Ratio 9/16, Rounded Corners, Border
      */}
      <div 
        className="relative w-full h-full md:w-auto md:h-[90vh] md:aspect-[9/16] md:max-h-[900px] bg-game-bg overflow-hidden shadow-2xl md:rounded-2xl border-game-fg md:border-2"
        onMouseDown={handleInputStart}
        onMouseUp={handleInputEnd}
        onTouchStart={handleInputStart}
        onTouchEnd={handleInputEnd}
      >
        {/* Canvas Layer */}
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full outline-none touch-none select-none"
        />

        {/* HUD Layer (Pointer events none allows clicking through to canvas) */}
        <div className={`absolute top-0 left-0 w-full p-3 flex justify-center gap-3 text-[11px] tracking-[1px] pointer-events-none text-game-fg z-10 transition-opacity ${view !== 'GAME' ? 'opacity-0' : 'opacity-100'}`}>
          <div>{t.hi}:{meta.highScore.toString().padStart(4, '0')}</div>
          <div>{t.cur}:{hudState.score.toString().padStart(4, '0')}</div>
          <div>{t.cred}:{Math.floor(meta.credits).toString().padStart(4, '0')}</div>
          <div>{t.vel}:{hudState.speed.toFixed(2)}</div>
          <div>{t.spd}:{meta.gameSpeed.toFixed(1)}x</div>
        </div>

        {/* Cooldown/Broken Alert */}
        {view === 'GAME' && hudState.cooldown > 0 && (
           <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl tracking-[5px] text-game-fg pointer-events-none z-20 text-center uppercase">
             {t.broken}<br/>{(hudState.cooldown / 1000).toFixed(1)}
           </div>
        )}

        {/* In-game Controls */}
        {view === 'GAME' && (
          <div className="absolute top-12 right-5 z-20 pointer-events-auto">
            <button onClick={pauseGame} className="px-4 py-1 border border-game-fg text-game-fg text-sm hover:bg-game-faint uppercase bg-game-bg/50 backdrop-blur-sm">
              // {t.menu}
            </button>
          </div>
        )}

        {/* UI Overlay Screens */}
        {view === 'MENU' && (
          <div className="absolute inset-0 z-30 bg-game-bg">
             <MenuScreen 
               t={t} meta={meta} 
               canResume={canResume}
               onResume={resumeGame} onStart={startGame} 
               onMods={() => setView('MODS')} onSystems={() => setView('SYSTEMS')} 
             />
          </div>
        )}

        {view === 'MODS' && (
          <div className="absolute inset-0 z-30 bg-game-bg">
            <ModsScreen t={t} meta={meta} onToggleBuy={toggleOrBuy} onBack={() => setView('MENU')} />
          </div>
        )}

        {view === 'SYSTEMS' && (
          <div className="absolute inset-0 z-30 bg-game-bg">
            <SystemsScreen 
              t={t} meta={meta}
              onSetTheme={(th) => setMeta(p => ({ ...p, inverted: th === 'light', retroActive: th === 'retro' }))}
              onSetSpeed={(s) => setMeta(p => ({ ...p, gameSpeed: s }))}
              onSetLang={(l) => setMeta(p => ({ ...p, language: l }))}
              onBack={() => setView('MENU')}
            />
          </div>
        )}

        {view === 'GAMEOVER' && (
          <div className="absolute inset-0 z-30 bg-game-bg/90">
            <GameOverScreen 
              t={t} meta={meta} score={hudState.score} reason={deathReason}
              onReboot={rebootGame} onMenu={() => setView('MENU')}
            />
          </div>
        )}

        {/* Global Styles for Dynamic Theme */}
        <style>{`
          .game-btn {
            background: transparent;
            border: 1px solid var(--fg);
            color: var(--fg);
            height: 54px;
            width: 100%;
            max-width: 320px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'DotGothic16', monospace;
            font-size: 15px;
            letter-spacing: 2px;
            text-transform: uppercase;
            transition: 0.2s;
            cursor: pointer;
            user-select: none;
          }
          .game-btn:active { background: var(--faint); transform: translateY(1px); }
          .game-btn:disabled { opacity: 0.3; cursor: default; }
          .active-setting {
             font-weight: normal;
             border-width: 1px;
             text-shadow: none;
             background: linear-gradient(-45deg, var(--fg) 6px, transparent 6px);
          }
        `}</style>
      </div>
    </div>
  );
};

export default App;