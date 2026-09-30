import type { CSSProperties } from "react";

// A number that rolls to its digits, like a mileage counter. Each digit is a
// strip of 0 to 9 (twice, so it has somewhere to roll from) inside a window
// one digit tall. The strip's resting position is its digit, so with motion
// off, or before any animation runs, the number is simply there.
//
// The rolling itself is CSS (app/globals.css): put it inside `.a-odo` to roll
// on load, or inside a <Reveal> to roll when scrolled to.

const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function Odometer({
  value,
  digits = 2,
  className = "",
  delay,
}: {
  value: number;
  /** Shown with at least this many digits: 6 rolls up as "06". */
  digits?: number;
  className?: string;
  /** Seconds before it starts rolling. */
  delay?: number;
}) {
  const text = String(value).padStart(digits, "0");
  return (
    // To a screen reader it's one picture of the real number.
    <span role="img" aria-label={String(value)} className={`odo ${className}`}>
      {[...text].map((digit, index) => (
        <span key={index} aria-hidden="true" className="odo-col">
          <span
            className="odo-strip"
            style={
              {
                "--to": `${-(10 + Number(digit))}em`,
                // Later digits roll a little longer, so they land one after another.
                "--t": `${1.6 + index * 0.3}s`,
                ...(delay === undefined ? {} : { "--d": `${delay}s` }),
              } as CSSProperties
            }
          >
            {STRIP.map((n, i) => (
              <span key={i}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
