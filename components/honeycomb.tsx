// The Part complete celebration: one hexagon per lesson pops in, 100ms
// apart, settling into a honeycomb around the logo's </>, then one soft
// ripple. With reduced motion on, the finished honeycomb is simply there
// (see the prefers-reduced-motion rules in app/globals.css).

const W = 50; // centre-to-centre, side by side
const H = 43.3; // centre-to-centre, row to row

type Cell = { x: number; y: number };

/**
 * Row lengths for a compact cluster of `count` cells. Neighbouring rows
 * differ by exactly one cell, so centring each row gives the half-cell
 * offset that makes hexagons interlock, and every shape is mirror-symmetric
 * left to right. Among those, pick the one whose cells sit closest to the
 * middle, preferring shapes that are also symmetric top to bottom.
 * 8 cells -> 3-2-3, 13 -> 4-5-4.
 */
function rowLengths(count: number): number[] {
  const maxRows = 2 * Math.ceil(Math.sqrt(count)) + 1;
  let best: number[] = [count];
  let bestScore = Infinity;

  const consider = (rows: number[]) => {
    const cells = place(rows);
    const cx = cells.reduce((sum, c) => sum + c.x, 0) / cells.length;
    const cy = cells.reduce((sum, c) => sum + c.y, 0) / cells.length;
    const spread = cells.reduce((sum, c) => sum + (c.x - cx) ** 2 + (c.y - cy) ** 2, 0) / cells.length;
    const mirrored = rows.every((length, i) => length === rows[rows.length - 1 - i]);
    const score = spread * (mirrored ? 1 : 1.25);
    if (score < bestScore) {
      bestScore = score;
      best = rows;
    }
  };

  const extend = (rows: number[], total: number) => {
    if (total === count) return consider(rows);
    if (rows.length === maxRows) return;
    const last = rows[rows.length - 1];
    for (const next of [last - 1, last + 1]) {
      if (next >= 1 && total + next <= count) extend([...rows, next], total + next);
    }
  };

  for (let first = 1; first <= count; first++) extend([first], first);
  return best;
}

/** Centres for the given rows, with the whole cluster centred on 0,0. */
function place(rows: number[]): Cell[] {
  const cells = rows.flatMap((length, row) =>
    Array.from({ length }, (_, i) => ({ x: (i - (length - 1) / 2) * W, y: row * H })),
  );
  const midY = ((rows.length - 1) * H) / 2;
  return cells.map((c) => ({ x: c.x, y: c.y - midY }));
}

const hexPoints = ({ x, y }: Cell) =>
  [
    [0, -26], [22.5, -13], [22.5, 13], [0, 26], [-22.5, 13], [-22.5, -13],
  ]
    .map(([dx, dy]) => `${x + dx},${y + dy}`)
    .join(" ");

const pop = (delay: number, duration = 500) => ({
  transformBox: "fill-box" as const,
  transformOrigin: "center",
  animation: `cfaPop ${duration}ms cubic-bezier(.3,1.4,.5,1) ${delay}ms both`,
});

export function Honeycomb({ lessons }: { lessons: number }) {
  const cells = place(rowLengths(lessons + 1));

  // The logo takes the most central cell; lessons fill the rest in reading
  // order (rows top to bottom, left to right).
  const distance = (c: Cell) => c.x ** 2 + c.y ** 2;
  const logoIndex = cells.reduce((best, c, i) => (distance(c) < distance(cells[best]) - 0.01 ? i : best), 0);
  const logo = cells[logoIndex];
  const lessonCells = cells.filter((_, i) => i !== logoIndex);

  const minX = Math.min(...cells.map((c) => c.x)) - 30;
  const minY = Math.min(...cells.map((c) => c.y)) - 33;
  const width = Math.max(...cells.map((c) => c.x)) + 30 - minX;
  const height = Math.max(...cells.map((c) => c.y)) + 33 - minY;
  const logoAt = 200 + 100 * lessonCells.length + 150;

  return (
    <svg
      width={width * 1.25}
      height={height * 1.25}
      viewBox={`${minX} ${minY} ${width} ${height}`}
      aria-hidden="true"
      className="h-auto max-w-full overflow-visible"
    >
      <polygon
        points={hexPoints(logo)}
        className="ripple fill-none stroke-deco stroke-3"
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: `cfaRing 1.3s ${logoAt + 250}ms ease-out both`,
        }}
      />
      {lessonCells.map((cell, index) => (
        <g key={index} style={pop(200 + 100 * index)}>
          <polygon points={hexPoints(cell)} className="fill-accent" />
          <text x={cell.x} y={cell.y + 6} textAnchor="middle" className="fill-on-accent font-sans text-[16px] font-bold">
            {index + 1}
          </text>
        </g>
      ))}
      <g style={pop(logoAt, 600)}>
        {/* In dark mode --accent and --deco are the same sky blue, so the logo
            switches to a tinted hex with a sky outline to stand apart from the
            solid lesson hexes. */}
        <polygon
          points={hexPoints(logo)}
          strokeLinejoin="round"
          className="fill-deco dark:fill-tint dark:stroke-deco dark:stroke-2"
        />
        <text
          x={logo.x}
          y={logo.y + 5.5}
          textAnchor="middle"
          className="fill-on-deco font-mono text-[15px] font-bold dark:fill-deco"
        >
          &lt;/&gt;
        </text>
      </g>
    </svg>
  );
}
