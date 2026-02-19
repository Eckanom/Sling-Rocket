export type Language = 'en' | 'ru' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'pl' | 'nl' | 'zh' | 'ja' | 'ko';
export type ThemeType = 'dark' | 'light' | 'retro';

export interface GameMeta {
  highScore: number;
  credits: number;
  massLevel: number;
  ropeLevel: number;
  hasBorders: boolean;
  hasRope5: boolean;
  hasRope10: boolean;
  hasBounce: boolean;
  bordersActive: boolean;
  rope5Active: boolean;
  rope10Active: boolean;
  bounceActive: boolean;
  retroActive: boolean;
  language: Language;
  inverted: boolean;
  gameSpeed: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  angle: number;
  attached: boolean;
  target: GameObject | null;
  holdTime: number;
  cooldownTime: number;
}

export interface Vertex {
  x: number;
  y: number;
}

export interface GameObject {
  x: number;
  y: number;
  r: number;
  vertices: Vertex[];
  rotation: number;
  rotSpeed: number;
}

export interface Coin {
  x: number;
  y: number;
  r: number;
  collected: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

export type ViewState = 'MENU' | 'GAME' | 'MODS' | 'SYSTEMS' | 'GAMEOVER';

export interface I18nStrings {
  hi: string;
  best: string;
  cur: string;
  cred: string;
  vel: string;
  spd: string;
  menu: string;
  resume: string;
  launch: string;
  systems: string;
  mods: string;
  upMass: string;
  upRope: string;
  upBorders: string;
  upBounce: string;
  upRetro: string;
  upRope5: string;
  upRope10: string;
  back: string;
  reboot: string;
  crashed: string;
  impact: string;
  collision: string;
  altitude: string;
  appearance: string;
  language: string;
  balance: string;
  mass: string;
  rope: string;
  lvl: string;
  broken: string;
  speed: string;
}