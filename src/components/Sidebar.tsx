"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavChild = { label: string; href: string };
type NavSection = {
  label: string;
  href: string;
  children: NavChild[];
};

export default function Sidebar({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="w-[190px] shrink-0 min-h-screen sticky top-0 self-start flex flex-col px-6 py-8">
      <Link
        href="/"
        className="font-display text-[1.25rem] font-light mb-10 block transition-colors tracking-tight leading-tight text-[var(--foreground)] hover:text-[var(--accent)]"
      >
        Zach Backas
      </Link>
      <nav className="flex flex-col gap-1">
        {sections.map((section) => (
          <div key={section.href}>
            <Link
              href={section.href}
              className={`block py-0.5 text-[13px] tracking-wide transition-colors ${
                isActive(section.href)
                  ? "text-[var(--accent)]"
                  : "text-[#999] hover:text-[var(--text-secondary)]"
              }`}
            >
              {section.label}
            </Link>
            {section.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={`block py-0.5 pl-3 text-[12px] tracking-wide transition-colors ${
                  isActive(child.href)
                    ? "text-[var(--text-secondary)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
