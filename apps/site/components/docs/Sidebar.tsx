"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "./nav";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* mobile: horizontal strip */}
      <nav className="sticky top-14 z-30 -mx-5 overflow-x-auto border-b border-white/5 bg-void/90 px-5 backdrop-blur-md lg:hidden">
        <div className="flex gap-1 py-2">
          {DOCS_NAV.flatMap((g) => g.items).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-ember/10 font-medium text-ember"
                    : "text-fog hover:text-bone"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <nav className="sticky top-24 space-y-8 pb-16">
          {DOCS_NAV.map((group) => (
            <div key={group.label}>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-fog/60">
                {group.label}
              </div>
              <ul className="mt-3 space-y-0.5 border-l border-white/10">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`-ml-px block border-l py-1.5 pl-4 text-sm transition-colors ${
                          active
                            ? "border-ember font-medium text-ember"
                            : "border-transparent text-fog hover:border-white/30 hover:text-bone"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
