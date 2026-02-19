import { I18nStrings, Language, GameMeta } from './types';

export const BASE_RANGE = 220;
export const AIR_RESISTANCE = 0.998;
export const GRAVITY_CONSTANT = 0.02;
export const VELOCITY_MULTIPLIER = 1.008;
export const ROPE_HOLD_LIMIT = 3000;
export const ROPE_COOLDOWN = 3000;

export const getModCost = (key: string, meta: GameMeta): number => {
  switch (key) {
    case 'mass':
      return 100 * meta.massLevel;
    case 'ropeTension':
      return 50 * meta.ropeLevel;
    case 'borders':
      return 25;
    case 'rope5':
      return 25;
    case 'rope10':
      return 50;
    case 'bounce':
      return 10;
    default:
      return 0;
  }
};

export const I18N: Record<Language, I18nStrings> = {
    en: { hi: "HI", best: "BEST", cur: "CUR", cred: "CRED", vel: "VEL", spd: "SPD", menu: "MENU", resume: "RESUME", launch: "LAUNCH", systems: "SYSTEMS", mods: "MODS", upMass: "MASS", upRope: "TENSILE", upBorders: "BORDERS", upBounce: "PINBALL", upRetro: "RETRO", upRope5: "+5M", upRope10: "+10M", back: "BACK", reboot: "REBOOT", crashed: "// CRASHED", impact: "GROUND IMPACT", collision: "STRUCTURAL FAILURE", altitude: "ALTITUDE LOST", appearance: "Appearance", language: "Language", balance: "BALANCE", mass: "SHIP MASS", rope: "TENSILE", lvl: "LVL", broken: "BROKEN", speed: "SPEED" },
    ru: { hi: "РЕК", best: "РЕКОРД", cur: "ТЕК", cred: "КРЕД", vel: "СКОР", spd: "МНЖ", menu: "МЕНЮ", resume: "ПРОДОЛЖИТЬ", launch: "ЗАПУСК", systems: "СИСТЕМЫ", mods: "МОДЫ", upMass: "ВЕС", upRope: "ТРОС", upBorders: "ГРАНИЦЫ", upBounce: "ПИНБОЛ", upRetro: "RETRO", upRope5: "+5М", upRope10: "+10М", back: "НАЗАД", reboot: "РЕСТАРТ", crashed: "// ОТКАЗ", impact: "УДАР О ЗЕМЛЮ", collision: "РАЗРУШЕНИЕ КОРПУСА", altitude: "ПОТЕРЯ ВЫСОТЫ", appearance: "ВИД", language: "ЯЗЫК", balance: "БАЛАНС", mass: "МАССА", rope: "НАТЯЖЕНИЕ", lvl: "УР", broken: "ОБРЫВ", speed: "СКОРОСТЬ" },
    de: { hi: "BEST", best: "REKORD", cur: "AKT", cred: "KRED", vel: "GESCHW", spd: "SPD", menu: "MENÜ", resume: "WEITER", launch: "START", systems: "SYSTEME", mods: "MODS", upMass: "MASSE", upRope: "ZUG", upBorders: "RAND", upBounce: "FLIPPER", upRetro: "RETRO", upRope5: "+5M", upRope10: "+10M", back: "ZURÜCK", reboot: "REBOOT", crashed: "// ABSTURZ", impact: "BODENKONTAKT", collision: "KOLLISION", altitude: "HÖHENVERLUST", appearance: "OPTIK", language: "SPRACHE", balance: "KONTO", mass: "MASSE", rope: "ZUG", lvl: "ST", broken: "DEFEKT", speed: "TEMPO" },
    fr: { hi: "TOP", best: "SCORE", cur: "ACT", cred: "CRED", vel: "VIT", spd: "VIT", menu: "MENU", resume: "REPRENDRE", launch: "LANCER", systems: "SYSTÈMES", mods: "MODS", upMass: "MASSE", upRope: "TENSION", upBorders: "BORD", upBounce: "PINBALL", upRetro: "RETRO", upRope5: "+5M", upRope10: "+10M", back: "RETOUR", reboot: "REBOOT", crashed: "// ÉCHEC", impact: "IMPACT SOL", collision: "COLLISION", altitude: "PERТЕ D'ALTITUDE", appearance: "Apparence", language: "Langue", balance: "SOLDE", mass: "MASSE", rope: "TENSION", lvl: "NIV", broken: "ROMPU", speed: "VITESSE" },
    es: { hi: "TOP", best: "RÉCORD", cur: "ACT", cred: "CRED", vel: "VEL", spd: "VEL", menu: "MENÚ", resume: "REANUDAR", launch: "LANЗАР", systems: "SISTEMAS", mods: "MODS", upMass: "MASA", upRope: "TENSIÓN", upBorders: "BORDE", upBounce: "PINBALL", upRetro: "RETRO", upRope5: "+5M", upRope10: "+10M", back: "VOLVER", reboot: "REINICIO", crashed: "// FALLO", impact: "IMPACTO SUELO", collision: "COLISIÓN", altitude: "PERDA ALTURA", appearance: "Apariencia", language: "Idioma", balance: "SALDO", mass: "MASA", rope: "TENSIÓN", lvl: "NIV", broken: "ROTO", speed: "VELOCIDAD" },
    it: { hi: "TOP", best: "RECORD", cur: "ATT", cred: "CRED", vel: "VEL", spd: "VEL", menu: "MENU", resume: "RIPRENDI", launch: "LANCIA", systems: "SISTEMI", mods: "MODS", upMass: "MASSA", upRope: "TENSIO", upBorders: "BORDI", upBounce: "PINBALL", upRetro: "RETRO", upRope5: "+5M", upRope10: "+10M", back: "INDIETRO", reboot: "REBOOT", crashed: "// GUASTО", impact: "IMPATTO SUOLO", collision: "COLLISIONE", altitude: "PERDITA QUOTA", appearance: "Aspetto", language: "Lingua", balance: "CONТО", mass: "MASSA", rope: "TENSIONE", lvl: "LIV", broken: "ROTTO", speed: "VELOCITÀ" },
    pt: { hi: "REC", best: "RECORDE", cur: "ATU", cred: "CRED", vel: "VEL", spd: "VEL", menu: "MENU", resume: "RETOMAR", launch: "LANÇAR", systems: "SISTEMAS", mods: "MODS", upMass: "MASSA", upRope: "TENSÃO", upBorders: "BORDA", upBounce: "PINBALL", upRetro: "RETRO", upRope5: "+5 METROS", upRope10: "+10 METROS", back: "VOLTAR", reboot: "REBOOT", crashed: "// FALHA", impact: "IMPACTO SOLO", collision: "COLISÃO", altitude: "PERDA ALTITUDE", appearance: "Aparência", language: "Idioma", balance: "SALDO", mass: "MASА", rope: "TENSÃO", lvl: "NÍVEL", broken: "QUEBRADO", speed: "VELOCIDADE" },
    pl: { hi: "REK", best: "WYNIK", cur: "AKT", cred: "KRED", vel: "PRĘD", spd: "PRĘD", menu: "MENU", resume: "WZNAWIAJ", launch: "START", systems: "SYSTEMY", mods: "MODY", upMass: "MASA", upRope: "LINA", upBorders: "GRANICE", upBounce: "PINBALL", upRetro: "RETRO", upRope5: "+5M", upRope10: "+10M", back: "POWRÓT", reboot: "REBOOT", crashed: "// AWARIA", impact: "ZDERZENIE", collision: "KOLIZJA", altitude: "UTRATA WYSOK.", appearance: "Wygląd", language: "Język", balance: "SALDO", mass: "MASA", rope: "NAPIĘCIE", lvl: "POZ", broken: "ZERWANA", speed: "PRĘDKOŚĆ" },
    nl: { hi: "REC", best: "BESTE", cur: "HUI", cred: "CRED", vel: "SNEL", spd: "SNEL", menu: "MENU", resume: "HERVATTEN", launch: "STARTEN", systems: "SYSTEMЕН", mods: "MODS", upMass: "MASSA", upRope: "TOUW", upBorders: "GRENS", upBounce: "PINBALL EFFECT", upRetro: "RETRO", upRope5: "+5M", upRope10: "+10M", back: "TERUG", reboot: "REBOOT", crashed: "// CRASH", impact: "BODEM IMPACT", collision: "BOTSING", altitude: "HOOGTE VERLIES", appearance: "Uiterlijk", language: "Taal", balance: "SALDO", mass: "MASSA", rope: "SPANNING", lvl: "NIV", broken: "GEBROKEN", speed: "SNELHEID" },
    zh: { hi: "最高", best: "纪录", cur: "当前", cred: "积分", vel: "速度", spd: "倍速", menu: "菜单", resume: "继续", launch: "发射", systems: "系统", mods: "模组", upMass: "质量", upRope: "绳索", upBorders: "边框", upBounce: "弹球", upRetro: "RETRO", upRope5: "+5米", upRope10: "+10米", back: "返回", reboot: "重启", crashed: "// 崩溃", impact: "撞击地面", collision: "撞击", altitude: "高度丢失", appearance: "外观", language: "语言", balance: "余额", mass: "质量", rope: "张力", lvl: "等级", broken: "断裂", speed: "速度" },
    ja: { hi: "最高", best: "ベスト", cur: "現在", cred: "クレジット", vel: "速度", spd: "倍速", menu: "メニュー", resume: "再開", launch: "發射", systems: "システム", mods: "モッド", upMass: "質量", upRope: "ローп", upBorders: "シールド", upBounce: "ピンボール", upRetro: "RETRO", upRope5: "+5M", upRope10: "+10M", back: "戻る", reboot: "再起動", crashed: "// 故障", impact: "地面衝突", collision: "衝突", altitude: "高度低下", appearance: "外見", language: "言語", balance: "残高", mass: "質量", rope: "張力", lvl: "レベル", broken: "切断", speed: "速度" },
    ko: { hi: "최고", best: "기록", cur: "현재", cred: "크레딧", vel: "속도", spd: "배속", menu: "메뉴", resume: "계속하기", launch: "발사", systems: "시스템", mods: "모드", upMass: "질량", upRope: "로프", upBorders: "경계", upBounce: "핀볼", upRetro: "RETRO", upRope5: "+5M", upRope10: "+10M", back: "뒤로", reboot: "재부팅", crashed: "// 실패", impact: "지면 충돌", collision: "충돌", altitude: "고도 상실", appearance: "외형", language: "언어", balance: "잔액", mass: "질량", rope: "장력", lvl: "레벨", broken: "끊어짐", speed: "속도" }
};