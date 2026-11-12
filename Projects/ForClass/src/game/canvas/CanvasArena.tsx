import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { CharacterData } from '../../data/characters/characters';
import { WeaponData } from '../../data/weapons/weapons';
import { CharacterPose, drawProceduralCharacter, drawMuzzleFlash } from './proceduralSprites';
import { ParticleSystem } from './particles';

export interface CanvasArenaRef {
  fireShot: (shooter: 'p1' | 'p2', damage: number, isCritical: boolean, onImpact?: () => void) => void;
  triggerReload: (player: 'p1' | 'p2') => void;
  triggerScreenShake: (amount: number) => void;
}

interface CanvasArenaProps {
  p1Character: CharacterData;
  p2Character: CharacterData;
  p1Weapon: WeaponData;
  p2Weapon: WeaponData;
  p1Hp: number;
  p2Hp: number;
  p1Pose?: CharacterPose;
  p2Pose?: CharacterPose;
  reducedMotion?: boolean;
  animationIntensity?: 'full' | 'medium' | 'low';
}

export const CanvasArena = forwardRef<CanvasArenaRef, CanvasArenaProps>(({
  p1Character,
  p2Character,
  p1Weapon,
  p2Weapon,
  p1Hp,
  p2Hp,
  p1Pose = 'idle',
  p2Pose = 'idle',
  reducedMotion = false,
  animationIntensity = 'full'
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleSysRef = useRef<ParticleSystem>(new ParticleSystem());

  // Animation states
  const animStateRef = useRef({
    p1Recoil: 0,
    p2Recoil: 0,
    p1Flash: 0,
    p2Flash: 0,
    p1HitFlash: 0,
    p2HitFlash: 0,
    screenShake: 0,
    shakeX: 0,
    shakeY: 0
  });

  useImperativeHandle(ref, () => ({
    fireShot: (shooter, damage, isCritical, onImpact) => {
      const state = animStateRef.current;
      const particles = particleSysRef.current;

      const p1X = 140;
      const p1Y = 220;
      const p2X = 660;
      const p2Y = 220;

      if (shooter === 'p1') {
        state.p1Recoil = 1.0;
        state.p1Flash = 1.0;
        particles.spawnMuzzleSmoke(p1X + 50, p1Y + 3, 'right');

        particles.spawnBullet(
          p1X + 50,
          p1Y + 3,
          p2X - 10,
          p1Weapon.bulletSpeed,
          p1Weapon.bulletColor,
          p1Weapon.trailColor,
          () => {
            state.p2HitFlash = 1.0;
            if (isCritical && !reducedMotion) {
              state.screenShake = 1.0;
            }
            particles.spawnImpactSparks(p2X, p2Y, p1Weapon.bulletColor, isCritical ? 35 : 20);
            particles.spawnFloatingDamage(
              p2X,
              p2Y - 40,
              `-${damage} HP`,
              isCritical
            );
            if (onImpact) onImpact();
          }
        );
      } else {
        state.p2Recoil = 1.0;
        state.p2Flash = 1.0;
        particles.spawnMuzzleSmoke(p2X - 50, p2Y + 3, 'left');

        particles.spawnBullet(
          p2X - 50,
          p2Y + 3,
          p1X + 10,
          p2Weapon.bulletSpeed,
          p2Weapon.bulletColor,
          p2Weapon.trailColor,
          () => {
            state.p1HitFlash = 1.0;
            if (isCritical && !reducedMotion) {
              state.screenShake = 1.0;
            }
            particles.spawnImpactSparks(p1X, p1Y, p2Weapon.bulletColor, isCritical ? 35 : 20);
            particles.spawnFloatingDamage(
              p1X,
              p1Y - 40,
              `-${damage} HP`,
              isCritical
            );
            if (onImpact) onImpact();
          }
        );
      }
    },
    triggerReload: (player) => {
      // Small weapon tilt
      if (player === 'p1') {
        animStateRef.current.p1Recoil = 0.5;
      } else {
        animStateRef.current.p2Recoil = 0.5;
      }
    },
    triggerScreenShake: (amount) => {
      if (!reducedMotion) {
        animStateRef.current.screenShake = Math.min(1.0, amount);
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min(50, time - lastTime);
      lastTime = time;

      const state = animStateRef.current;
      const particles = particleSysRef.current;

      // Update screen shake
      if (state.screenShake > 0) {
        const intensity = state.screenShake * 12;
        state.shakeX = (Math.random() - 0.5) * intensity;
        state.shakeY = (Math.random() - 0.5) * intensity;
        state.screenShake = Math.max(0, state.screenShake - 0.05);
      } else {
        state.shakeX = 0;
        state.shakeY = 0;
      }

      // Decay recoil and flashes
      state.p1Recoil = Math.max(0, state.p1Recoil - 0.08);
      state.p2Recoil = Math.max(0, state.p2Recoil - 0.08);
      state.p1Flash = Math.max(0, state.p1Flash - 0.18);
      state.p2Flash = Math.max(0, state.p2Flash - 0.18);
      state.p1HitFlash = Math.max(0, state.p1HitFlash - 0.1);
      state.p2HitFlash = Math.max(0, state.p2HitFlash - 0.1);

      particles.update();

      // Clear Canvas
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(state.shakeX, state.shakeY);

      // --- Draw Futuristic Arena Background ---
      // Distant industrial city grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSpacing = 40;
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Combat floor platform
      const floorY = 270;
      const gradient = ctx.createLinearGradient(0, floorY, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      gradient.addColorStop(1, 'rgba(10, 13, 20, 1.0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);

      // Neon floor boundary line
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(canvas.width, floorY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Center arena marker
      ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, floorY, 90, Math.PI, 0);
      ctx.fill();

      // --- Draw Combatants ---
      const p1X = 140;
      const p1Y = 220;
      const p2X = 660;
      const p2Y = 220;

      // P1 Sniper (Left, facing Right)
      drawProceduralCharacter({
        ctx,
        x: p1X,
        y: p1Y,
        facing: 'right',
        primaryColor: p1Character.primaryColor,
        accentColor: p1Character.accentColor,
        visorColor: p1Character.visorColor,
        pose: p1Hp <= 0 ? 'defeat' : (p2Hp <= 0 ? 'victory' : p1Pose),
        recoilAmount: state.p1Recoil,
        hitFlash: state.p1HitFlash > 0.05,
        timeMs: time
      });

      // P1 Muzzle Flash
      if (state.p1Flash > 0.1) {
        drawMuzzleFlash(ctx, p1X + 50, p1Y + 3, p1Weapon.muzzleFlashColor, 'right', state.p1Flash);
      }

      // P2 Sniper (Right, facing Left)
      drawProceduralCharacter({
        ctx,
        x: p2X,
        y: p2Y,
        facing: 'left',
        primaryColor: p2Character.primaryColor,
        accentColor: p2Character.accentColor,
        visorColor: p2Character.visorColor,
        pose: p2Hp <= 0 ? 'defeat' : (p1Hp <= 0 ? 'victory' : p2Pose),
        recoilAmount: state.p2Recoil,
        hitFlash: state.p2HitFlash > 0.05,
        timeMs: time
      });

      // P2 Muzzle Flash
      if (state.p2Flash > 0.1) {
        drawMuzzleFlash(ctx, p2X - 50, p2Y + 3, p2Weapon.muzzleFlashColor, 'left', state.p2Flash);
      }

      // --- Render Particles, Bullets, and Floating Damage ---
      particles.render(ctx);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [p1Character, p2Character, p1Weapon, p2Weapon, p1Hp, p2Hp, p1Pose, p2Pose, reducedMotion, animationIntensity]);

  return (
    <div className="relative w-full aspect-[8/3] max-h-[300px] overflow-hidden rounded-lg border-2 border-slate-800 bg-[#070a10] shadow-[0_0_25px_rgba(0,0,0,0.8)]">
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full h-full object-cover block"
      />
    </div>
  );
});

CanvasArena.displayName = 'CanvasArena';

