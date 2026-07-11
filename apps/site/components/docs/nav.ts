export type DocLink = { title: string; href: string };
export type DocGroup = { label: string; items: DocLink[] };

export const DOCS_NAV: DocGroup[] = [
  {
    label: "Getting started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quickstart", href: "/docs/quickstart" },
    ],
  },
  {
    label: "Concepts",
    items: [
      { title: "How it works", href: "/docs/how-it-works" },
      { title: "Threat model", href: "/docs/threat-model" },
    ],
  },
  {
    label: "Reference",
    items: [
      { title: "The eerc-exact scheme", href: "/docs/eerc-exact" },
      { title: "Packages", href: "/docs/packages" },
    ],
  },
];

export const FLAT_NAV: DocLink[] = DOCS_NAV.flatMap((g) => g.items);
