import { BASE_RANGE, AIR_RESISTANCE, GRAVITY_CONSTANT, VELOCITY_MULTIPLIER, ROPE_HOLD_LIMIT, ROPE_COOLDOWN } from '../constants';
import { GameMeta, Player, GameObject, Coin, Particle } from '../types';

interface Star {
  x: number;
  y: number;
  size: number;
  parallax: number;
}

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number = 0;
  height: number = 0;
  
  meta: GameMeta;
  
  active: boolean = false;
  lastTime: number = 0;
  cameraY: number = 0;
  startY: number = 0;
  score: number = 0;
  screenShake: number = 0;

  player: Player;
  objects: GameObject[] = [];
  coins: Coin[] = [];
  fxParticles: Particle[] = [];
  stars: Star[] = [];

  onGameOver: (reason: string) => void;
  onUpdateUI: (score: number, speed: number, cooldown: number) => void;

  constructor(canvas: HTMLCanvasElement, meta: GameMeta, onGameOver: (reason: string) => void, onUpdateUI: (s: number, spd: number, cd: number) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.meta = meta;
    this.onGameOver = onGameOver;
    this.onUpdateUI = onUpdateUI;

    this.player = this.createInitialPlayer();
    this.resize();
    this.initStars();
  }

  createInitialPlayer(): Player {
    return {
      x: 0, y: 0, vx: 0, vy: 0, mass: 1.0, angle: 0, attached: false, target: null, holdTime: 0, cooldownTime: 0
    };
  }

  resize() {
    // The canvas size should match the client size (controlled by CSS)
    this.width = this.canvas.width = this.canvas.clientWidth;
    this.height = this.canvas.height = this.canvas.clientHeight;
    this.startY = this.height / 2; // Initialize startY here so draw() works before start()
    // Re-distribute stars if resized significantly, or just let them be (they are random anyway)
    if (this.stars.length === 0) this.initStars();
  }

  initStars() {
    this.stars = [];
    const starCount = 60;
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random(), // Normalized 0-1
        y: Math.random(), // Normalized 0-1
        size: Math.random() * 2 + 1,
        parallax: 0.05 + Math.random() * 0.15
      });
    }
  }

  updateMeta(newMeta: GameMeta) {
    this.meta = newMeta;
  }

  start() {
    this.resize();
    this.active = true;
    this.score = 0;
    this.cameraY = 0;
    // startY is set in resize, but we can ensure it here too just in case
    this.startY = this.height / 2;

    this.player = this.createInitialPlayer();
    this.player.mass = 1.2 - (this.meta.massLevel * 0.1);
    this.player.x = this.width / 2;
    this.player.y = this.startY;
    this.player.vy = -8 / this.player.mass;
    this.player.angle = -Math.PI / 2;

    this.objects = [];
    this.coins = [];
    this.fxParticles = [];

    this.spawnObject(this.startY - 550, this.width / 2);
    const spawnCount = this.meta.bounceActive ? 6 : 12;
    const spacing = this.meta.bounceActive ? 2.0 : 1.0;
    for (let i = 0; i < spawnCount; i++) {
      this.spawnObject(this.startY - 550 - ((i + 1) * (300 * spacing)));
    }
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop() {
    this.active = false;
  }

  resume() {
    this.active = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  spawnObject(y: number, fixedX: number | null = null) {
    const r = 30 + Math.random() * 40;
    const vCount = Math.floor(Math.random() * 6) + 5;
    const vertices = [];
    for (let i = 0; i < vCount; i++) {
      const a = (i / vCount) * Math.PI * 2;
      const rad = r * (0.8 + Math.random() * 0.4);
      vertices.push({ x: Math.cos(a) * rad, y: Math.sin(a) * rad });
    }
    
    // Ensure objects stay within bounds slightly better
    const xPos = fixedX ?? (Math.random() * (this.width - 160) + 80);
    
    this.objects.push({ 
      x: xPos, 
      y, 
      r, 
      vertices, 
      rotation: Math.random() * Math.PI * 2, 
      rotSpeed: (Math.random() - 0.5) * 0.02 
    });

    if (Math.random() > 0.9) {
      this.coins.push({ 
        x: Math.random() * (this.width - 60) + 30, 
        y: y + (Math.random() - 0.5) * 300, 
        r: 10, 
        collected: false 
      });
    }
  }

  handleInput(isDown: boolean) {
    if (!this.active) return;
    
    if (isDown) {
      if (this.player.attached || this.player.cooldownTime > 0) return;
      
      let range = BASE_RANGE + (this.meta.ropeLevel * 60);
      if (this.meta.rope5Active) range += 55;
      if (this.meta.rope10Active) range += 110;

      let nearest: GameObject | null = null;
      let minDist = range;

      this.objects.forEach(o => {
        let d = Math.hypot(this.player.x - o.x, this.player.y - o.y);
        if (d < minDist) {
          minDist = d;
          nearest = o;
        }
      });

      if (nearest) {
        this.player.attached = true;
        this.player.target = nearest;
        this.player.holdTime = 0;
      }
    } else {
      if (this.player.attached) {
        this.player.attached = false;
        this.player.cooldownTime = 0;
      }
    }
  }

  loop = (t: number) => {
    if (!this.active) return;
    const dt = Math.min(t - this.lastTime, 100); // Cap dt to prevent huge jumps
    this.lastTime = t;
    this.update(dt);
    this.draw();
    requestAnimationFrame(this.loop);
  };

  update(dt: number) {
    const physicsMult = this.meta.gameSpeed;

    // Timers use real time
    if (this.player.cooldownTime > 0) {
      this.player.cooldownTime -= dt;
    }

    // Physics
    this.player.vy += GRAVITY_CONSTANT * physicsMult;
    this.player.vx *= Math.pow(AIR_RESISTANCE, physicsMult);
    this.player.vy *= Math.pow(AIR_RESISTANCE, physicsMult);

    if (this.player.attached && this.player.target) {
      this.player.holdTime += dt;
      if (this.player.holdTime >= ROPE_HOLD_LIMIT) {
        this.player.attached = false;
        this.player.cooldownTime = ROPE_COOLDOWN;
      } else {
        const t = this.player.target;
        let dx = t.x - this.player.x;
        let dy = t.y - this.player.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 5) {
          const nx = dx / dist;
          const ny = dy / dist;
          const vDotR = (this.player.vx * nx + this.player.vy * ny);
          
          if (vDotR < 0) {
            const s = (1.25 + (this.meta.ropeLevel * 0.05)) * physicsMult;
            this.player.vx -= nx * vDotR * s;
            this.player.vy -= ny * vDotR * s;
            
            // Artificial boost for swing feel
            if (this.player.vy > 0) {
              this.player.vy *= 0.985;
              this.player.vx += nx * 0.05 * physicsMult;
            }
          }
          
          const aF = 1 + (VELOCITY_MULTIPLIER - 1 + (0.003 * (1 / this.player.mass))) * physicsMult;
          this.player.vx *= aF;
          this.player.vy *= aF;
          this.player.vx += (ny) * (0.012 / this.player.mass) * physicsMult;
          this.player.vy += (-nx) * (0.012 / this.player.mass) * physicsMult;
        }
      }
    }

    this.player.x += this.player.vx * physicsMult;
    this.player.y += this.player.vy * physicsMult;

    const speed = Math.hypot(this.player.vx, this.player.vy);

    // Collisions
    this.objects.forEach(o => {
      const dx = this.player.x - o.x;
      const dy = this.player.y - o.y;
      const d = Math.hypot(dx, dy);
      
      if (d < o.r + 15) {
        if (this.meta.bounceActive) {
          const nx = dx / d;
          const ny = dy / d;
          const dot = this.player.vx * nx + this.player.vy * ny;
          if (dot < 0) {
            this.player.vx -= 2.4 * dot * nx;
            this.player.vy -= 2.4 * dot * ny;
            this.player.vx *= 1.05;
            this.player.vy *= 1.05;
            if (this.player.attached) this.player.attached = false;
            this.screenShake = 12;
          }
        } else if (speed > 8) {
          // Visual sparks
           for(let i=0; i<3; i++) { 
             this.fxParticles.push({ x: this.player.x, y: this.player.y, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5, size: 2, life: 20, maxLife: 20 }); 
           }
        }
      }
    });

    // Borders
    if (this.meta.bordersActive) {
      if (this.player.x < 10) { 
        this.player.x = 10; this.player.vx *= -0.6; 
        if (this.player.attached) this.player.attached = false; 
      } else if (this.player.x > this.width - 10) { 
        this.player.x = this.width - 10; this.player.vx *= -0.6; 
        if (this.player.attached) this.player.attached = false; 
      }
    } else {
      if (this.player.x < 0) { 
        this.player.x += this.width; 
        if (this.player.attached) { this.player.attached = false; this.player.target = null; } 
      } else if (this.player.x > this.width) { 
        this.player.x -= this.width; 
        if (this.player.attached) { this.player.attached = false; this.player.target = null; } 
      }
    }

    // Particles
    this.fxParticles.forEach(p => { 
      p.x += p.vx * physicsMult; 
      p.y += p.vy * physicsMult; 
      p.life -= dt; 
    });
    this.fxParticles = this.fxParticles.filter(p => p.life > 0);

    // Coins
    this.coins.forEach(c => {
      if (!c.collected && Math.hypot(this.player.x - c.x, this.player.y - c.y) < c.r + 15) {
        c.collected = true;
        this.meta.credits += 1;
        // Save logic handled by UI React component via interval/callback usually, 
        // but here we just update memory and sync on game over or periodically
      }
    });

    if (speed > 0.1) this.player.angle = Math.atan2(this.player.vy, this.player.vx);

    // Camera
    this.cameraY += (this.player.y - this.height * (0.6 + Math.min(0.2, speed / 50)) - this.cameraY) * 0.08 * physicsMult;

    // Objects Rotation
    this.objects.forEach(o => o.rotation += o.rotSpeed * physicsMult);

    // Culling and Spawning
    this.objects = this.objects.filter(o => o.y > this.player.y - this.height);
    this.coins = this.coins.filter(c => !c.collected && c.y > this.player.y - this.height);
    
    if (this.objects.length > 0 && this.objects[this.objects.length - 1].y > this.player.y - this.height) {
      this.spawnObject(this.objects[this.objects.length - 1].y - (300 * (this.meta.bounceActive ? 2.0 : 1.0)));
    }

    // Score
    const currentScore = Math.max(0, Math.floor((this.startY - this.player.y) / 10));
    this.score = currentScore;
    if (this.score > this.meta.highScore) this.meta.highScore = this.score;

    // Game Over Checks
    if (this.player.y > this.startY + 100) {
      this.onGameOver("altitude");
    }

    // Update HUD
    if (this.active) {
      this.onUpdateUI(this.score, speed, this.player.cooldownTime);
    }
    
    if (this.screenShake > 0) this.screenShake *= 0.9;
  }

  draw() {
    const { ctx, width, height } = this;
    
    // Read from canvas instead of documentElement to pick up scoped variables from React container
    const style = getComputedStyle(this.canvas);
    const fg = style.getPropertyValue('--fg').trim() || '#fff';
    const bg = style.getPropertyValue('--bg').trim() || '#000';
    const faint = style.getPropertyValue('--faint').trim() || 'rgba(255,255,255,0.2)';

    // Clear
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Parallax Stars
    ctx.fillStyle = fg;
    this.stars.forEach(star => {
      // Background elements move slower than camera. 
      // cameraY decreases as player goes up. 
      // We want stars to scroll down slower than objects (which scroll down at 1x camera speed effectively)
      // Visual Position = BaseY - CameraY * ParallaxFactor
      // Since world is infinite, we modulo wrap.
      let drawY = (star.y * height - this.cameraY * star.parallax) % height;
      if (drawY < 0) drawY += height;
      
      ctx.globalAlpha = 0.1 + star.parallax; // Faint stars are slower
      ctx.fillRect(star.x * width, drawY, star.size, star.size);
    });
    ctx.globalAlpha = 1.0;

    ctx.save();
    
    // Shake
    if (this.screenShake > 0.1) {
      ctx.translate((Math.random()-0.5)*this.screenShake, (Math.random()-0.5)*this.screenShake);
    }
    
    ctx.translate(0, -this.cameraY);

    // Start Line
    ctx.strokeStyle = faint;
    ctx.setLineDash([5, 10]);
    ctx.beginPath();
    ctx.moveTo(0, this.startY + 30);
    ctx.lineTo(width, this.startY + 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Objects
    ctx.strokeStyle = fg;
    ctx.lineWidth = 1.5;
    this.objects.forEach(o => {
      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.rotate(o.rotation);
      ctx.beginPath();
      o.vertices.forEach((v, idx) => idx === 0 ? ctx.moveTo(v.x, v.y) : ctx.lineTo(v.x, v.y));
      ctx.closePath();
      ctx.stroke();
      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = fg;
      ctx.fill();
      ctx.restore();
    });

    // Coins
    this.coins.forEach(c => {
      ctx.strokeStyle = fg;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(c.x, c.y - c.r * 0.6);
      ctx.lineTo(c.x, c.y + c.r * 0.6);
      ctx.stroke();
    });

    // Particles
    this.fxParticles.forEach(p => {
      ctx.globalAlpha = p.life / 20;
      ctx.fillStyle = fg;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1.0;

    // Rope
    if (this.player.attached && this.player.target) {
      const s = Math.hypot(this.player.vx, this.player.vy);
      const tL = ROPE_HOLD_LIMIT - this.player.holdTime;
      // Blink rope when near breaking
      ctx.strokeStyle = (tL < 1000 && Math.floor(Date.now() / 100) % 2 === 0) ? "transparent" : fg;
      ctx.setLineDash([Math.max(1, 5 - s/10), 5]);
      ctx.beginPath();
      ctx.moveTo(this.player.x, this.player.y);
      ctx.lineTo(this.player.target.x, this.player.target.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Player
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    ctx.rotate(this.player.angle + Math.PI / 2);
    ctx.strokeStyle = fg;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(8, 8);
    ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.stroke();
    
    // Speed Lines
    const v = Math.hypot(this.player.vx, this.player.vy);
    if (v > 12) {
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.3;
      for(let i=0; i<3; i++) {
        const ox = (Math.random()-0.5)*20;
        ctx.beginPath();
        ctx.moveTo(ox, 10);
        ctx.lineTo(ox, 10 + v*2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    }
    // Engine Trail
    if (v > 3) {
      for(let i=0; i < Math.min(10, Math.floor(v / 1.1)); i++) {
        ctx.beginPath();
        ctx.arc((Math.random() - 0.5) * 12, 10 + Math.random() * (v * 2), 1.2 + Math.random() * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = fg;
        ctx.fill();
      }
    }
    ctx.restore();

    // Border Walls Visuals
    if (this.meta.bordersActive) {
      ctx.strokeStyle = fg;
      // Left Wall Fade
      ctx.globalAlpha = this.player.x < 100 ? (1 - this.player.x/100) * 0.3 : 0;
      if (ctx.globalAlpha > 0) {
        ctx.beginPath();
        ctx.moveTo(5, this.player.y - 100);
        ctx.lineTo(5, this.player.y + 100);
        ctx.stroke();
      }
      // Right Wall Fade
      ctx.globalAlpha = this.player.x > width - 100 ? (1 - (width-this.player.x)/100) * 0.3 : 0;
      if (ctx.globalAlpha > 0) {
        ctx.beginPath();
        ctx.moveTo(width - 5, this.player.y - 100);
        ctx.lineTo(width - 5, this.player.y + 100);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    }

    ctx.restore();
  }
}