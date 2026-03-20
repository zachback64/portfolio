"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/fun", label: "Fun" },
  { href: "/photography", label: "Photography" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav id="top" className="flex items-center justify-between px-8 py-6">
      <Link
        href="/"
        className="text-sm font-medium tracking-wide hover:opacity-60 transition-opacity"
      >
        Zach Backas
      </Link>
      <ul className="flex gap-7">
        {links.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm tracking-wide transition-opacity hover:opacity-60 ${
                  active ? "opacity-100" : "opacity-40"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
