import Link from "next/link";
import type { ReactNode } from "react";
import { FLAT_NAV } from "./nav";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <header>
      <div className="font-mono text-xs uppercase tracking-[0.14em] text-ember">
        {eyebrow}
      </div>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
        {title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-fog">{lead}</p>
    </header>
  );
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="group mt-14 scroll-mt-24 font-display text-2xl font-semibold tracking-tight"
    >
      <a href={`#${id}`} className="hover:text-bone">
        {children}
        <span className="ml-2 hidden text-ember/60 group-hover:inline">#</span>
      </a>
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 leading-relaxed text-fog">{children}</p>;
}

export function Ul({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 space-y-2.5 text-fog [&>li]:relative [&>li]:pl-5 [&>li]:leading-relaxed [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:text-ember [&>li]:before:content-['·']">
      {children}
    </ul>
  );
}

export function Ol({ children }: { children: ReactNode }) {
  return (
    <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-fog marker:font-mono marker:text-xs marker:text-ember [&>li]:leading-relaxed [&>li]:pl-1.5">
      {children}
    </ol>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded border border-white/10 bg-coal px-1.5 py-0.5 font-mono text-[0.85em] text-bone">
      {children}
    </code>
  );
}

export function B({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-bone">{children}</strong>;
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  const cls =
    "text-bone underline decoration-white/25 underline-offset-4 transition-colors hover:text-ember hover:decoration-ember/50";
  return external ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function CodeBlock({
  title,
  children,
}: {
  title: string;
  children: string;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-coal">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="size-2 rounded-full bg-ember/80" />
        <span className="font-mono text-xs text-fog">{title}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-fog">
        {children}
      </pre>
    </div>
  );
}

export function DocTable({
  head,
  rows,
  mono = [],
}: {
  head: string[];
  rows: ReactNode[][];
  mono?: number[];
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-coal">
            {head.map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-fog"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 last:border-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-2.5 align-top ${
                    mono.includes(j) ? "font-mono text-[13px] text-bone" : "text-fog"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Callout({
  label = "Note",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6 rounded-lg border border-ember/25 bg-ember/5 p-4">
      <div className="font-mono text-xs uppercase tracking-[0.14em] text-ember">
        {label}
      </div>
      <div className="mt-2 text-sm leading-relaxed text-fog">{children}</div>
    </div>
  );
}

export function PrevNext({ current }: { current: string }) {
  const i = FLAT_NAV.findIndex((l) => l.href === current);
  const prev = i > 0 ? FLAT_NAV[i - 1] : null;
  const next = i >= 0 && i < FLAT_NAV.length - 1 ? FLAT_NAV[i + 1] : null;

  return (
    <nav className="mt-20 flex gap-4 border-t border-white/10 pt-6">
      {prev && (
        <Link
          href={prev.href}
          className="group flex-1 rounded-lg border border-white/10 p-4 transition-colors hover:border-ember/40"
        >
          <div className="font-mono text-xs text-fog">← Previous</div>
          <div className="mt-1 text-sm font-medium text-bone group-hover:text-ember">
            {prev.title}
          </div>
        </Link>
      )}
      {next && (
        <Link
          href={next.href}
          className="group flex-1 rounded-lg border border-white/10 p-4 text-right transition-colors hover:border-ember/40"
        >
          <div className="font-mono text-xs text-fog">Next →</div>
          <div className="mt-1 text-sm font-medium text-bone group-hover:text-ember">
            {next.title}
          </div>
        </Link>
      )}
    </nav>
  );
}
