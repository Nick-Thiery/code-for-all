import { SMALL_PRINT, type CertificateText } from "@/lib/certificate";

// Draws a certificate on a canvas, for "Save as image". It mirrors the
// layout in components/certificate.tsx: A4 landscape, light colours from the
// tokens (read off the certificate element, so they stay in one place), the
// logo, the same fonts. 2376 by 1680 pixels: A4 at about 200 dpi.

const W = 2376;
const H = 1680;
const S = W / 1188; // The on-screen certificate is 1188 wide at its largest.

type Colours = { bg: string; text: string; muted: string; accent: string; tint: string; border: string; deco: string };

function coloursOf(element: HTMLElement): Colours {
  const style = getComputedStyle(element);
  const get = (name: string) => style.getPropertyValue(name).trim();
  return { bg: get("--bg"), text: get("--text"), muted: get("--muted"), accent: get("--accent"), tint: get("--tint"), border: get("--border"), deco: get("--deco") };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

/** Word-wrap `text` to `maxWidth`, returning the lines. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function hexagon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export async function drawCertificate(
  element: HTMLElement,
  text: CertificateText,
  name: string,
  date: string,
  logoSrc: string,
): Promise<Blob> {
  const c = coloursOf(element);
  await Promise.all([
    document.fonts.load('750 80px "Recursive"'),
    document.fonts.load('700 30px "Recursive"'),
    document.fonts.load('400 30px "Atkinson Hyperlegible Next"'),
    document.fonts.load('700 30px "Atkinson Hyperlegible Next"'),
  ]);
  const logo = await loadImage(logoSrc);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const body = '"Atkinson Hyperlegible Next", system-ui, sans-serif';
  const display = '"Recursive", system-ui, sans-serif';
  const pad = 72 * S;

  // Page, frame and the accent bar along the bottom.
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = c.border;
  ctx.lineWidth = 2 * S;
  ctx.strokeRect(24 * S, 24 * S, W - 48 * S, H - 48 * S);
  ctx.fillStyle = c.accent;
  ctx.fillRect(24 * S, H - 24 * S - 14 * S, W - 48 * S, 14 * S);

  // Logo, top left, 260 wide on screen.
  const logoW = 260 * S;
  ctx.drawImage(logo, pad, pad, logoW, (logoW * logo.height) / logo.width);

  // Decorative hexagons, top right: one per lesson.
  const r = 11 * S;
  const gap = 27 * S;
  const count = Math.min(text.lessons, 12);
  for (let i = 0; i < count; i++) {
    hexagon(ctx, W - pad - r - (count - 1 - i) * gap, pad + r + 8 * S, r);
    ctx.fillStyle = c.deco;
    ctx.fill();
  }

  // Eyebrow.
  let y = pad + 190 * S;
  ctx.fillStyle = c.accent;
  ctx.font = `700 ${17 * S}px ${display}`;
  ctx.letterSpacing = `${1.2 * S}px`;
  ctx.fillText("CERTIFICATE OF COMPLETION", pad, y);
  ctx.letterSpacing = "0px";

  // "This certifies that"
  y += 56 * S;
  ctx.fillStyle = c.muted;
  ctx.font = `400 ${22 * S}px ${body}`;
  ctx.fillText("This certifies that", pad, y);

  // The name.
  y += 84 * S;
  ctx.fillStyle = c.text;
  let size = 72;
  ctx.font = `750 ${size * S}px ${display}`;
  while (ctx.measureText(name).width > W - 2 * pad && size > 32) {
    size -= 4;
    ctx.font = `750 ${size * S}px ${display}`;
  }
  ctx.fillText(name, pad, y);

  // "finished Module 1"
  y += 78 * S;
  ctx.fillStyle = c.muted;
  ctx.font = `400 ${22 * S}px ${body}`;
  ctx.fillText(`finished ${text.kicker} of Code for All`, pad, y);

  // The title, then the line.
  y += 62 * S;
  ctx.fillStyle = c.text;
  ctx.font = `700 ${40 * S}px ${display}`;
  for (const line of wrap(ctx, text.title, W - 2 * pad)) {
    ctx.fillText(line, pad, y);
    y += 48 * S;
  }
  y += 10 * S;
  ctx.fillStyle = c.text;
  ctx.font = `400 ${22 * S}px ${body}`;
  for (const line of wrap(ctx, text.line, W - 2 * pad)) {
    ctx.fillText(line, pad, y);
    y += 32 * S;
  }

  // Bottom: date on the left, small print on the right.
  const bottom = H - pad - 30 * S;
  ctx.fillStyle = c.muted;
  ctx.font = `700 ${14 * S}px ${body}`;
  ctx.fillText("DATE", pad, bottom - 30 * S);
  ctx.fillStyle = c.text;
  ctx.font = `700 ${20 * S}px ${body}`;
  ctx.fillText(date, pad, bottom);

  ctx.fillStyle = c.muted;
  ctx.font = `400 ${13 * S}px ${body}`;
  const smallLines = wrap(ctx, SMALL_PRINT, 460 * S);
  let sy = bottom - (smallLines.length - 1) * 19 * S;
  for (const line of smallLines) {
    ctx.fillText(line, W - pad - 460 * S, sy);
    sy += 19 * S;
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't make the image"))), "image/png");
  });
}
