import { GameMeta } from '../types';

const STORAGE_KEY = 'sling_rocket_save_v1';

export const INITIAL_META: GameMeta = {
  highScore: 0,
  credits: 0,
  massLevel: 1,
  ropeLevel: 1,
  hasBorders: false,
  hasRope5: false,
  hasRope10: false,
  hasBounce: false,
  bordersActive: false,
  rope5Active: false,
  rope10Active: false,
  bounceActive: false,
  retroActive: false,
  language: 'en',
  inverted: false,
  gameSpeed: 1.0
};

export const saveGameData = (data: GameMeta) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save game data", e);
  }
};

export const loadGameData = (): GameMeta => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...INITIAL_META, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error("Failed to load game data", e);
  }
  return INITIAL_META;
};