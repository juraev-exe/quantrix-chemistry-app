export interface Bullet {
  x: number;
  y: number;
  vx: number;
  targetX: number;
  color: string;
  trailColor: string;
  trail: { x: number; y: number }[];
  active: boolean;
  onImpact?: () => void;
}

export interface ImpactParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  vy: number;
  isCritical: boolean;
}

export interface SmokePuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  public bullets: Bullet[] = [];
  public particles: ImpactParticle[] = [];
  public floatingTexts: FloatingText[] = [];
  public smokePuffs: SmokePuff[] = [];

  public spawnBullet(
    startX: number,
    startY: number,
    targetX: number,
    speed: number,
    color: string,
    trailColor: string,
    onImpact?: () => void
  ) {
    const direction = targetX > startX ? 1 : -1;
    this.bullets.push({
      x: startX,
      y: startY,
      vx: speed * direction,
      targetX,
      color,
      trailColor,
      trail: [],
      active: true,
      onImpact
    });
  }

  public spawnImpactSparks(x: number, y: number, color: string, count: number = 24) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color,
        size: Math.random() * 3.5 + 1.5,
        life: 0,
        maxLife: Math.random() * 25 + 20
      });
    }
  }

  public spawnFloatingDamage(x: number, y: number, text: string, isCritical: boolean = false) {
    this.floatingTexts.push({
      x,
      y,
      text,
      color: isCritical ? '#ff2a55' : '#ffb703',
      life: 0,
      maxLife: 60,
      vy: -1.8,
      isCritical
    });
  }

  public spawnMuzzleSmoke(x: number, y: number, facing: 'right' | 'left') {
    const dir = facing === 'right' ? 1 : -1;
    for (let i = 0; i < 6; i++) {
      this.smokePuffs.push({
        x,
        y,
        vx: (Math.random() * 1.5 + 0.5) * dir,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        size: Math.random() * 8 + 6,
        alpha: 0.7,
        life: 0,
        maxLife: Math.random() * 25 + 20
      });
    }
  }

  public update() {
    // 1. Update Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.trail.unshift({ x: b.x, y: b.y });
      if (b.trail.length > 10) b.trail.pop();

      b.x += b.vx;

      // Check arrival at target
      const arrived = b.vx > 0 ? b.x >= b.targetX : b.x <= b.targetX;
      if (arrived) {
        b.active = false;
        if (b.onImpact) b.onImpact();
        this.bullets.splice(i, 1);
      }
    }

    // 2. Update Impact Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // 3. Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life++;
      ft.y += ft.vy;
      if (ft.life >= ft.maxLife) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // 4. Update Smoke Puffs
    for (let i = this.smokePuffs.length - 1; i >= 0; i--) {
      const sp = this.smokePuffs[i];
      sp.life++;
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.size += 0.35;
      sp.alpha = Math.max(0, 0.7 * (1 - sp.life / sp.maxLife));
      if (sp.life >= sp.maxLife) {
        this.smokePuffs.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    // 1. Draw Smoke Puffs
    for (const sp of this.smokePuffs) {
      ctx.fillStyle = `rgba(180, 190, 205, ${sp.alpha})`;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw Bullets & Vapor Trails
    for (const b of this.bullets) {
      // Draw ionizing trail
      if (b.trail.length > 1) {
        ctx.strokeStyle = b.trailColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        for (let j = 0; j < b.trail.length; j++) {
          ctx.lineTo(b.trail[j].x, b.trail[j].y);
        }
        ctx.stroke();
      }

      // Draw Bullet Core
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 3. Draw Impact Sparks
    for (const p of this.particles) {
      const progress = p.life / p.maxLife;
      const alpha = Math.max(0, 1 - progress);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1.0;

    // 4. Draw Floating Damage Texts
    for (const ft of this.floatingTexts) {
      const alpha = 1 - ft.life / ft.maxLife;
      ctx.globalAlpha = alpha;
      ctx.font = ft.isCritical
        ? 'bold 20px "Press Start 2P", monospace'
        : 'bold 15px "Press Start 2P", monospace';
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 10;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1.0;
  }

  public clear() {
    this.bullets = [];
    this.particles = [];
    this.floatingTexts = [];
    this.smokePuffs = [];
  }
}

