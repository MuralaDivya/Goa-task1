import { BuilderFormData, FormatType, FrameOptions, Position } from '../types';

export interface RenderParams {
  userImage: HTMLImageElement | null;
  position: Position;
  format: FormatType;
  formData: BuilderFormData;
  options: FrameOptions;
}

// Color theme definitions for Canvas drawing
export const THEME_COLORS = {
  sunset: {
    bgDark: '#0a0d14',
    bgCard: '#131824',
    accentPrimary: '#ff5722',   // Warm Orange
    accentSecondary: '#ffc107', // Tropical Gold
    accentTertiary: '#e91e63',  // Coral Pink
    borderGlow: 'rgba(255, 87, 34, 0.6)',
    textPrimary: '#ffffff',
    textSecondary: '#9e9e9e',
    badgeBg: '#1e2433',
  },
  neon: {
    bgDark: '#060a0f',
    bgCard: '#0f1722',
    accentPrimary: '#00ff88',   // Electric Green
    accentSecondary: '#00e5ff', // Cyber Teal
    accentTertiary: '#a855f7',  // Neon Purple
    borderGlow: 'rgba(0, 255, 136, 0.6)',
    textPrimary: '#ffffff',
    textSecondary: '#809ab8',
    badgeBg: '#132130',
  },
  ocean: {
    bgDark: '#050f1a',
    bgCard: '#0d1e30',
    accentPrimary: '#00d2ff',   // Ocean Cyan
    accentSecondary: '#3b82f6', // Azure Blue
    accentTertiary: '#00f5d4',  // Sea Foam
    borderGlow: 'rgba(0, 210, 255, 0.6)',
    textPrimary: '#ffffff',
    textSecondary: '#7aa3cc',
    badgeBg: '#12273e',
  },
  golden: {
    bgDark: '#120d07',
    bgCard: '#211810',
    accentPrimary: '#ffb700',   // Solar Gold
    accentSecondary: '#ff5500', // Terracotta
    accentTertiary: '#ff8800',  // Warm Amber
    borderGlow: 'rgba(255, 183, 0, 0.6)',
    textPrimary: '#ffffff',
    textSecondary: '#b89f80',
    badgeBg: '#2e2116',
  },
  terminal: {
    bgDark: '#050c07',
    bgCard: '#0d1f11',
    accentPrimary: '#00ff66',   // Matrix Green
    accentSecondary: '#adff2f', // Lime
    accentTertiary: '#00cc44',  // Phosphor Green
    borderGlow: 'rgba(0, 255, 102, 0.6)',
    textPrimary: '#ffffff',
    textSecondary: '#5e946a',
    badgeBg: '#132b18',
  },
};

/**
 * Main function to render graphic to an HTML Canvas
 */
export async function renderFrameCanvas(
  canvas: HTMLCanvasElement,
  params: RenderParams
): Promise<void> {
  const { userImage, position, format, formData, options } = params;
  const isPfp = format === 'pfp';

  // Set crisp HD canvas dimensions
  const width = 1080;
  const height = isPfp ? 1080 : 1350;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const colors = THEME_COLORS[options.theme] || THEME_COLORS.sunset;

  // 1. Render Background
  drawCanvasBackground(ctx, width, height, colors, options.showGrid);

  // 2. Render Photo (with user positioning, zoom, crop)
  drawPhotoArea(ctx, userImage, position, format, colors);

  // 3. Render Event Overlay / Framing
  if (isPfp) {
    drawPfpOverlay(ctx, width, height, colors, options);
  } else {
    drawBuilderCardOverlay(ctx, width, height, formData, colors, options);
  }
}

/**
 * Draw background with subtle dark gradient, noise dots, and hacker grid
 */
function drawCanvasBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: (typeof THEME_COLORS)['sunset'],
  showGrid: boolean
) {
  // Deep linear/radial background gradient
  const bgGrad = ctx.createRadialGradient(w / 2, h / 3, 50, w / 2, h / 2, w * 0.8);
  bgGrad.addColorStop(0, colors.bgCard);
  bgGrad.addColorStop(1, colors.bgDark);

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Optional Hacker Dot Matrix Grid
  if (showGrid) {
    ctx.fillStyle = colors.accentPrimary;
    ctx.globalAlpha = 0.07;
    const step = 36;
    for (let x = 18; x < w; x += step) {
      for (let y = 18; y < h; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
  }

  // Decorative Goa Wave / Diagonal Ambient Line Art
  ctx.strokeStyle = colors.accentPrimary;
  ctx.globalAlpha = 0.08;
  ctx.lineWidth = 2;

  // Top Right Ambient Lines
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.moveTo(w - 200 + i * 30, 0);
    ctx.lineTo(w, 200 - i * 30);
  }
  ctx.stroke();

  // Bottom Left Wave Art
  ctx.beginPath();
  const startY = h - 180;
  ctx.moveTo(0, startY);
  ctx.bezierCurveTo(w * 0.25, startY - 40, w * 0.5, startY + 40, w, startY - 20);
  ctx.stroke();

  ctx.globalAlpha = 1.0;
}

/**
 * Draw user photo with smart object-fit cover, positioning, and rotation
 */
function drawPhotoArea(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  pos: Position,
  format: FormatType,
  colors: (typeof THEME_COLORS)['sunset']
) {
  const isPfp = format === 'pfp';

  // Define photo bounding container
  let boxX: number, boxY: number, boxW: number, boxH: number, radius: number;

  if (isPfp) {
    // Format A: PFP Photo Box (Center 820 x 820)
    boxW = 820;
    boxH = 820;
    boxX = (1080 - boxW) / 2; // 130
    boxY = 130;
    radius = 48; // Sleek rounded square
  } else {
    // Format B: Builder Card Photo Box (780 x 600)
    boxW = 800;
    boxH = 610;
    boxX = (1080 - boxW) / 2; // 140
    boxY = 180;
    radius = 36;
  }

  // Clip area to rounded rectangle
  ctx.save();
  ctx.beginPath();
  drawRoundedRect(ctx, boxX, boxY, boxW, boxH, radius);
  ctx.clip();

  if (img) {
    // Calculate smart 'cover' base dimensions
    const imgAspect = img.width / img.height;
    const boxAspect = boxW / boxH;

    let baseW: number, baseH: number;
    if (imgAspect > boxAspect) {
      baseH = boxH;
      baseW = boxH * imgAspect;
    } else {
      baseW = boxW;
      baseH = boxW / imgAspect;
    }

    // Apply user zoom multiplier
    const finalW = baseW * pos.zoom;
    const finalH = baseH * pos.zoom;

    // Apply user pan X/Y offset
    const centerX = boxX + boxW / 2 + pos.x;
    const centerY = boxY + boxH / 2 + pos.y;

    ctx.save();
    ctx.translate(centerX, centerY);
    if (pos.rotation !== 0) {
      ctx.rotate((pos.rotation * Math.PI) / 180);
    }
    ctx.drawImage(img, -finalW / 2, -finalH / 2, finalW, finalH);
    ctx.restore();
  } else {
    // Placeholder background if no image uploaded yet
    ctx.fillStyle = colors.bgCard;
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // Placeholder text/icon
    ctx.fillStyle = colors.accentPrimary;
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DROP YOUR PHOTO HERE', boxX + boxW / 2, boxY + boxH / 2 - 10);

    ctx.font = '18px monospace';
    ctx.fillStyle = colors.textSecondary;
    ctx.fillText('HH GOA 2026 BUILDER ERA', boxX + boxW / 2, boxY + boxH / 2 + 25);
  }

  ctx.restore(); // Remove clipping mask

  // Draw Photo Outer Frame Border with neon accent glow
  ctx.save();
  ctx.strokeStyle = colors.accentPrimary;
  ctx.lineWidth = 6;
  ctx.shadowColor = colors.borderGlow;
  ctx.shadowBlur = 18;

  ctx.beginPath();
  drawRoundedRect(ctx, boxX, boxY, boxW, boxH, radius);
  ctx.stroke();

  // Secondary inner accent line
  ctx.shadowBlur = 0;
  ctx.strokeStyle = colors.accentSecondary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  drawRoundedRect(ctx, boxX - 6, boxY - 6, boxW + 12, boxH + 12, radius + 4);
  ctx.stroke();

  // Corner crosshairs / terminal tech markings
  drawCornerMarkings(ctx, boxX, boxY, boxW, boxH, colors.accentPrimary);

  ctx.restore();
}

/**
 * Draw Format A (PFP Frame) Overlay with Branding and Tagline
 */
function drawPfpOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: (typeof THEME_COLORS)['sunset'],
  options: FrameOptions
) {
  // Top Banner Branding
  const topY = 60;

  // Tropical Palm Icon / Star
  drawPalmIcon(ctx, 130, topY, 20, colors.accentPrimary);

  // Brand Name: HH GOA 2026
  ctx.fillStyle = colors.textPrimary;
  ctx.font = '900 38px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.letterSpacing = '3px';
  ctx.fillText('HH GOA 2026', 170, topY + 12);

  // Micro Coordinate Tag [15.4989° N, 73.8278° E]
  ctx.fillStyle = colors.accentSecondary;
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('15.4989° N, 73.8278° E', w - 130, topY - 2);

  ctx.fillStyle = colors.textSecondary;
  ctx.font = '13px monospace';
  ctx.fillText('GOA, INDIA • BUILDER PFP', w - 130, topY + 18);

  // Bottom Footer Pill: #FrameInGoa
  const bottomY = h - 70;
  const pillW = 440;
  const pillH = 64;
  const pillX = (w - pillW) / 2;

  // Pill Shadow & Background
  ctx.save();
  ctx.shadowColor = colors.borderGlow;
  ctx.shadowBlur = 24;

  const pillGrad = ctx.createLinearGradient(pillX, bottomY, pillX + pillW, bottomY);
  pillGrad.addColorStop(0, colors.accentPrimary);
  pillGrad.addColorStop(1, colors.accentSecondary);

  ctx.fillStyle = pillGrad;
  ctx.beginPath();
  drawRoundedRect(ctx, pillX, bottomY - pillH / 2, pillW, pillH, 32);
  ctx.fill();
  ctx.restore();

  // Hashtag Text
  ctx.fillStyle = '#0a0d14'; // Dark high-contrast text on bright pill
  ctx.font = '900 30px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('#FrameInGoa', w / 2, bottomY + 10);

  // Decorative Palm Leaves at bottom corners
  drawPalmLeafDecoration(ctx, 60, h - 90, colors.accentPrimary, 0.6);
  drawPalmLeafDecoration(ctx, w - 60, h - 90, colors.accentSecondary, -0.6);
}

/**
 * Draw Format B (Builder ID Card) Overlay with Name, Stack, Generated Title
 */
function drawBuilderCardOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  formData: BuilderFormData,
  colors: (typeof THEME_COLORS)['sunset'],
  options: FrameOptions
) {
  // === TOP HEADER SECTION ===
  const topY = 70;

  // Event Branding Logo
  ctx.fillStyle = colors.textPrimary;
  ctx.font = '900 44px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('HH GOA 2026', 140, topY);

  // Event Subtext Tagline
  ctx.fillStyle = colors.accentPrimary;
  ctx.font = 'bold 16px monospace';
  ctx.fillText('FRAME YOUR BUILDER ERA', 140, topY + 30);

  // Top Right "BUILDER PASS" Tag Badge
  const badgeW = 210;
  const badgeH = 46;
  const badgeX = w - 140 - badgeW;
  const badgeY = topY - 26;

  ctx.fillStyle = colors.badgeBg;
  ctx.strokeStyle = colors.accentPrimary;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 12);
  ctx.fill();
  ctx.stroke();

  // Green Live Pulse Dot
  ctx.fillStyle = colors.accentPrimary;
  ctx.beginPath();
  ctx.arc(badgeX + 22, badgeY + badgeH / 2, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = colors.textPrimary;
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('VERIFIED BUILDER', badgeX + 36, badgeY + 28);

  // === BELOW PHOTO SECTION (Details & Badge) ===
  const contentY = 835;

  // 1. Name Display
  const nameText = (formData.name || 'BUILDER').toUpperCase();
  ctx.fillStyle = colors.textPrimary;
  ctx.font = '900 48px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(nameText, w / 2, contentY);

  // 2. Stack / Role Tag
  const stackText = (formData.stack || 'AI / ML BUILDER').toUpperCase();
  ctx.fillStyle = colors.accentPrimary;
  ctx.font = 'bold 20px monospace';
  ctx.fillText(`[ ${stackText} ]`, w / 2, contentY + 40);

  // 3. GENERATED BUILDER TITLE (Prominent Hero Banner)
  const titleY = contentY + 70;
  const titleText = (formData.title || 'THE AI ALCHEMIST').toUpperCase();

  // Measure title width for dynamic pill sizing
  ctx.font = '900 34px system-ui, -apple-system, sans-serif';
  const textWidth = ctx.measureText(titleText).width;
  const bannerW = Math.min(800, Math.max(500, textWidth + 80));
  const bannerH = 74;
  const bannerX = (w - bannerW) / 2;

  // Title Banner Background
  ctx.save();
  ctx.shadowColor = colors.borderGlow;
  ctx.shadowBlur = 20;

  const titleGrad = ctx.createLinearGradient(bannerX, titleY, bannerX + bannerW, titleY);
  titleGrad.addColorStop(0, colors.accentPrimary);
  titleGrad.addColorStop(0.5, colors.accentSecondary);
  titleGrad.addColorStop(1, colors.accentTertiary);

  ctx.fillStyle = titleGrad;
  ctx.beginPath();
  drawRoundedRect(ctx, bannerX, titleY, bannerW, bannerH, 18);
  ctx.fill();
  ctx.restore();

  // Title Text inside Banner
  ctx.fillStyle = '#090d14'; // Dark high contrast text on bright gradient
  ctx.font = '900 32px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(titleText, w / 2, titleY + 48);

  // === BOTTOM FOOTER & DECORATIVE HACKER ELEMENTS ===
  const footerY = h - 75;

  // Line Separator
  ctx.strokeStyle = colors.badgeBg;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(140, footerY - 35);
  ctx.lineTo(w - 140, footerY - 35);
  ctx.stroke();

  // #FrameInGoa Hashtag
  ctx.fillStyle = colors.accentPrimary;
  ctx.font = '900 28px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('#FrameInGoa', 140, footerY + 10);

  // Micro Barcode / Grid Art
  drawMicroBarcode(ctx, w - 280, footerY - 10, colors.accentSecondary);

  // Coordinates
  ctx.fillStyle = colors.textSecondary;
  ctx.font = '14px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('15.4989° N, 73.8278° E', w - 140, footerY + 10);
  ctx.fillText('GOA, INDIA • 2026', w - 140, footerY + 28);
}

// Helper: Rounded Rectangle Path
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Helper: Corner Tech Crosshairs
function drawCornerMarkings(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const len = 16;
  const off = 10;

  // Top Left
  ctx.beginPath();
  ctx.moveTo(x - off, y - off + len);
  ctx.lineTo(x - off, y - off);
  ctx.lineTo(x - off + len, y - off);
  ctx.stroke();

  // Top Right
  ctx.beginPath();
  ctx.moveTo(x + w + off - len, y - off);
  ctx.lineTo(x + w + off, y - off);
  ctx.lineTo(x + w + off, y - off + len);
  ctx.stroke();

  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(x - off, y + h + off - len);
  ctx.lineTo(x - off, y + h + off);
  ctx.lineTo(x - off + len, y + h + off);
  ctx.stroke();

  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(x + w + off - len, y + h + off);
  ctx.lineTo(x + w + off, y + h + off);
  ctx.lineTo(x + w + off, y + h + off - len);
  ctx.stroke();
}

// Helper: Vector Palm Icon
function drawPalmIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Starburst Palm Shape
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI) / 4 - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(
      cx + Math.cos(angle) * (size * 0.6),
      cy + Math.sin(angle) * (size * 0.6),
      size * 0.5,
      size * 0.18,
      angle,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Trunk
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.quadraticCurveTo(cx - 4, cy + size, cx - 8, cy + size * 1.4);
  ctx.stroke();

  ctx.restore();
}

// Helper: Decorative Palm Leaves
function drawPalmLeafDecoration(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  angleScale: number
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 40, angleScale > 0 ? 0 : Math.PI, angleScale > 0 ? Math.PI / 2 : (Math.PI * 3) / 2);
  ctx.stroke();
  ctx.restore();
}

// Helper: Barcode decoration
function drawMicroBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.5;
  const bars = [2, 4, 1, 3, 5, 2, 1, 4, 2, 3, 1, 4];
  let curX = x;
  bars.forEach((w) => {
    ctx.fillRect(curX, y, w, 24);
    curX += w + 2;
  });
  ctx.globalAlpha = 1.0;
}
