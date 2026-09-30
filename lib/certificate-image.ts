import { SMALL_PRINT, type CertificateText } from "@/lib/certificate";

// Draws a certificate on a canvas, for "Save as image". It mirrors the
// layout in components/certificate.tsx: A4 landscape, light colours from the
// tokens (read off the certificate element, so they stay in one place), the
// logo, the same fonts (Archivo, Newsreader and Atkinson Hyperlegible Next).
// 2376 by 1680 pixels: A4 at about 200 dpi.

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

/** The families next/font gave Archivo and Newsreader (app/layout.tsx), read from their CSS variables. */
function fontsOf(element: HTMLElement) {
  const style = getComputedStyle(element);
  const family = (name: string, fallback: string) => `${style.getPropertyValue(name).trim() || fallback}, ${fallback}`;
  return {
    body: '"Atkinson Hyperlegible Next", system-ui, sans-serif',
    display: family("--font-archivo", "sans-serif"),
    serif: family("--font-newsreader", "Georgia, serif"),
  };
}

export async function drawCertificate(
  element: HTMLElement,
  text: CertificateText,
  name: string,
  date: string,
  logoSrc: string,
): Promise<Blob> {
  const c = coloursOf(element);
  const { body, display, serif } = fontsOf(element);
  await Promise.all([
    document.fonts.load(`italic 600 80px ${serif}`),
    document.fonts.load(`800 extra-condensed 40px ${display}`),
    document.fonts.load(`800 semi-condensed 20px ${display}`),
    document.fonts.load('400 30px "Atkinson Hyperlegible Next"'),
    document.fonts.load('700 30px "Atkinson Hyperlegible Next"'),
  ]);
  const logo = await loadImage(logoSrc);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const pad = 72 * S;

  // Page, frame and the marigold bar along the bottom.
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = c.deco;
  ctx.fillRect(24 * S, H - 24 * S - 16 * S, W - 48 * S, 16 * S);
  ctx.strokeStyle = c.border;
  ctx.lineWidth = 2 * S;
  ctx.strokeRect(24 * S, H - 24 * S - 16 * S, W - 48 * S, 16 * S);
  ctx.strokeRect(24 * S, 24 * S, W - 48 * S, H - 48 * S);

  // Logo, top left, 260 wide on screen.
  const logoW = 260 * S;
  ctx.drawImage(logo, pad, pad, logoW, (logoW * logo.height) / logo.width);

  // Top right: one segment per lesson, all filled.
  const segW = 34 * S;
  const segH = 15 * S;
  const gap = 6 * S;
  const count = Math.min(text.lessons, 12);
  for (let i = 0; i < count; i++) {
    const x = W - pad - segW - (count - 1 - i) * (segW + gap);
    ctx.fillStyle = c.deco;
    ctx.fillRect(x, pad + 8 * S, segW, segH);
    ctx.strokeRect(x, pad + 8 * S, segW, segH);
  }

  // Kicker.
  let y = pad + 190 * S;
  ctx.fillStyle = c.accent;
  ctx.font = `800 semi-condensed ${17 * S}px ${display}`;
  ctx.letterSpacing = `${2 * S}px`;
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
  let size = 76;
  ctx.font = `italic 600 ${size * S}px ${serif}`;
  while (ctx.measureText(name).width > W - 2 * pad && size > 32) {
    size -= 4;
    ctx.font = `italic 600 ${size * S}px ${serif}`;
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
  ctx.font = `800 extra-condensed ${46 * S}px ${display}`;
  for (const line of wrap(ctx, text.title.toUpperCase(), W - 2 * pad)) {
    ctx.fillText(line, pad, y);
    y += 46 * S;
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
  ctx.font = `800 semi-condensed ${14 * S}px ${display}`;
  ctx.letterSpacing = `${1.6 * S}px`;
  ctx.fillText("DATE", pad, bottom - 30 * S);
  ctx.letterSpacing = "0px";
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
