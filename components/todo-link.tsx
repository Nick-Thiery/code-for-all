import type { ReactNode } from "react";

type Props = { href: string | null; className?: string; children: ReactNode };

/**
 * A link whose destination doesn't exist yet. With `href: null` it renders as
 * plain text styled like the link, so nothing points nowhere. In development
 * it gets a dashed outline so the gap is easy to spot. Fill in the href in
 * lib/site.ts.
 */
export function TodoLink({ href, className, children }: Props) {
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  const dev = process.env.NODE_ENV !== "production";
  return (
    <a
      aria-disabled="true"
      data-todo="link"
      title={dev ? "TODO: this link has no destination yet. Set it in lib/site.ts." : undefined}
      className={`${className ?? ""} cursor-default ${dev ? "outline-2 outline-offset-2 outline-pip outline-dashed" : ""}`}
    >
      {children}
    </a>
  );
}
