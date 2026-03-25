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
        className="text-sm font-medium mb-8 block hover:opacity-60 transition-opacity"
      >
        Zach Backas
      </Link>
      <nav className="flex flex-col gap-0.5">
        {sections.map((section) => (
          <div key={section.href}>
            <Link
              href={section.href}
              className={`block py-0.5 text-[16px] tracking-wide transition-colors ${
                isActive(section.href) && section.children.length === 0
                  ? "text-[#111]"
                  : section.children.length > 0 && isActive(section.href)
                  ? "text-[#111]"
                  : "text-[#888] hover:text-[#444]"
              }`}
            >
              {section.label}
            </Link>
            {section.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={`block py-0.5 pl-3 text-[15px] tracking-wide transition-colors ${
                  isActive(child.href)
                    ? "text-[#111]"
                    : "text-[#aaa] hover:text-[#666]"
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
