"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/profile", label: "Profile" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-cream-dark bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-hidden>
            🍝
          </span>
          <span className="text-xl font-bold text-tomato">Sapori</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded-full bg-cream px-3 py-2 text-sm font-semibold text-tomato sm:px-4"
                    : "rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-cream hover:text-tomato sm:px-4"
                }
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="ml-1 rounded-full bg-tomato px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-tomato-dark sm:ml-2"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
