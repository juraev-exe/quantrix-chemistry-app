export type CharacterPose = 'idle' | 'aiming' | 'recoil' | 'hit' | 'victory' | 'defeat';

export interface DrawCharacterOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  facing: 'right' | 'left'; // right for P1, left for P2
  primaryColor: string;
  accentColor: string;
  visorColor: string;
  pose: CharacterPose;
  recoilAmount?: number; // 0 to 1
  hitFlash?: boolean;
  timeMs: number;
}

/**
 * Draws a procedural sci-fi sniper/commando directly onto the canvas.
 * Clean, stylized cyberpunk pixel-vector aesthetic.
 */
export function drawProceduralCharacter(opts: DrawCharacterOptions) {
  const { ctx, x, y, facing, primaryColor, accentColor, visorColor, pose, recoilAmount = 0, hitFlash, timeMs } = opts;

  ctx.save();
  ctx.translate(x, y);

  // If facing left, flip horizontally
  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  // Idle breathing cycle
  const breath = pose === 'idle' || pose === 'aiming' ? Math.sin(timeMs * 0.003) * 2.5 : 0;
  // Recoil offset
  const recoilX = -recoilAmount * 18;
  const recoilRot = recoilAmount * 0.15;

  ctx.translate(recoilX, breath);

  // Hit flash color override
  const bodyColor = hitFlash ? '#ff2a55' : primaryColor;
  const darkPlate = hitFlash ? '#880011' : accentColor;
  const highlightVisor = hitFlash ? '#ffffff' : visorColor;

  if (pose === 'defeat') {
    // Slumped / knocked down pose
    ctx.translate(0, 15);
    ctx.rotate(-0.35);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 40, 32, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body crumpled
    ctx.fillStyle = darkPlate;
    ctx.fillRect(-15, 10, 28, 24);
    ctx.fillStyle = bodyColor;
    ctx.fillRect(-10, 15, 20, 18);

    // Head drooped
    ctx.fillStyle = darkPlate;
    ctx.beginPath();
    ctx.arc(15, 18, 11, 0, Math.PI * 2);
    ctx.fill();

    // Rifle on ground
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-20, 35, 45, 6);

    ctx.restore();
    return;
  }

  if (pose === 'victory') {
    // Triumphant raised weapon pose
    const vicBounce = Math.sin(timeMs * 0.006) * 3;
    ctx.translate(0, vicBounce);

    // Victory aura glow
    ctx.shadowColor = visorColor;
    ctx.shadowBlur = 20;

    // Legs
    ctx.fillStyle = darkPlate;
    ctx.fillRect(-14, 25, 10, 24);
    ctx.fillRect(4, 25, 10, 24);

    // Boots
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-16, 45, 14, 8);
    ctx.fillRect(2, 45, 14, 8);

    // Torso
    ctx.fillStyle = bodyColor;
    ctx.fillRect(-16, -10, 32, 35);
    ctx.fillStyle = darkPlate;
    ctx.fillRect(-12, -5, 24, 20);

    // Head
    ctx.fillStyle = darkPlate;
    ctx.beginPath();
    ctx.arc(0, -22, 12, 0, Math.PI * 2);
    ctx.fill();

    // Visor
    ctx.fillStyle = highlightVisor;
    ctx.fillRect(2, -25, 10, 6);

    // Raised Arm & Rifle pointing up
    ctx.fillStyle = bodyColor;
    ctx.fillRect(10, -25, 8, 20);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(12, -45, 6, 32); // Raised gun barrel
    ctx.fillStyle = highlightVisor;
    ctx.fillRect(11, -30, 8, 4);

    ctx.restore();
    return;
  }

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 52, 28, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- Normal / Aiming / Recoil / Hit Stance ---

  // Legs in athletic shooting stance
  ctx.fillStyle = darkPlate;
  ctx.fillRect(-16, 22, 11, 28);
  ctx.fillRect(6, 22, 11, 28);

  // Boots
  ctx.fillStyle = '#0a0f1d';
  ctx.fillRect(-18, 46, 15, 8);
  ctx.fillRect(5, 46, 15, 8);

  // Torso / Tactical Armor
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-15, -12, 30, 34);

  // Chest Rig / Armor Plating
  ctx.fillStyle = darkPlate;
  ctx.fillRect(-11, -8, 22, 22);

  // Head / Cyber Helmet
  ctx.fillStyle = darkPlate;
  ctx.beginPath();
  ctx.arc(0, -23, 13, 0, Math.PI * 2);
  ctx.fill();

  // Cyber Visor
  ctx.fillStyle = highlightVisor;
  ctx.shadowColor = highlightVisor;
  ctx.shadowBlur = 10;
  ctx.fillRect(2, -26, 11, 6);
  ctx.shadowBlur = 0;

  // Arms holding sniper rifle
  ctx.save();
  ctx.translate(4, 2);
  ctx.rotate(recoilRot);

  // Rear Arm
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-8, -4, 16, 8);

  // Sniper Rifle Body
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(2, -5, 46, 8); // Receiver & Barrel

  // Rifle Stock
  ctx.fillStyle = darkPlate;
  ctx.fillRect(-12, -3, 14, 10);

  // High-Tech Optical Scope
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(10, -11, 20, 6);
  ctx.fillStyle = highlightVisor;
  ctx.fillRect(28, -10, 3, 4); // Scope lens glow

  // Magazine / Battery Pack
  ctx.fillStyle = bodyColor;
  ctx.fillRect(16, 3, 7, 10);

  // Muzzle Brake
  ctx.fillStyle = '#334155';
  ctx.fillRect(46, -6, 6, 10);

  // Front Support Arm
  ctx.fillStyle = darkPlate;
  ctx.fillRect(18, -1, 14, 7);

  ctx.restore();

  ctx.restore();
}

/**
 * Draws explosive muzzle flash at weapon tip.
 */
export function drawMuzzleFlash(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  facing: 'right' | 'left',
  scale: number = 1.0
) {
  ctx.save();
  ctx.translate(x, y);
  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  ctx.shadowColor = color;
  ctx.shadowBlur = 25;

  // Multi-pointed star flash
  ctx.fillStyle = color;
  ctx.beginPath();
  const points = 7;
  const outer = 26 * scale;
  const inner = 10 * scale;

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / points;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // White superheated center core
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 8 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

