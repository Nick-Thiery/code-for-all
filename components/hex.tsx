import type { CSSProperties, ReactNode } from "react";

// The pointy-top hexagon every mark on the site is built from (viewBox 24×26).
export const HEX_POINTS = "12,1.5 22.5,7.5 22.5,18.5 12,24.5 1.5,18.5 1.5,7.5";

type Props = {
  width: number;
  height: number;
  /** Classes for the hexagon itself: fill-*, stroke-*, stroke width. */
  shape: string;
  className?: string;
  style?: CSSProperties;
  /** Drawn on top of the hexagon, in the same 24×26 space. */
  children?: ReactNode;
};

export function Hex({ width, height, shape, className, style, children }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 26"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <polygon points={HEX_POINTS} strokeLinejoin="round" className={shape} />
      {children}
    </svg>
  );
}

/** The check used on done hexes, for a 24×26 hexagon. */
export function HexCheck({ className }: { className: string }) {
  return (
    <path
      d="M7.6 13.3l3 3 5.8-6.3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    />
  );
}
