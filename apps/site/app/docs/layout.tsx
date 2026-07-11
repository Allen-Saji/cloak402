import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import Sidebar from "@/components/docs/Sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <div className="mx-auto max-w-6xl px-5 pt-14">
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <Sidebar />
          <main className="max-w-[72ch] py-12 lg:py-16">{children}</main>
        </div>
      </div>
    </>
  );
}
