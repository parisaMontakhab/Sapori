"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useCurrentUser } from "@/hooks/useAuth";
import { getCartItemCount, subscribeToCart } from "@/store/cart";
import { getLoggedInUser } from "@/store/auth";

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

function NavLink({
  href,
  label,
  active,
  cartCount,
  onNavigate,
  mobile = false,
}: {
  href: string;
  label: string;
  active: boolean;
  cartCount: number;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const base = mobile
    ? "flex min-h-11 w-full items-center justify-between rounded-xl px-4 py-2.5 text-base"
    : "rounded-full px-3 py-2 text-sm sm:px-4";

  const activeClass = active
    ? mobile
      ? "bg-cream font-semibold text-tomato"
      : "bg-cream font-semibold text-tomato"
    : mobile
      ? "font-medium text-foreground/80 hover:bg-cream/80 hover:text-tomato"
      : "font-medium text-foreground/80 transition-colors hover:bg-cream hover:text-tomato";

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`${base} ${activeClass}`}
      aria-current={active ? "page" : undefined}
    >
      <span>{label}</span>
      {href === "/cart" && cartCount > 0 && (
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-tomato px-1.5 text-xs font-bold text-white">
          {cartCount}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState({
    isOpen: false,
    atPathname: pathname,
  });
  const { data: currentUser } = useCurrentUser();
  const isLoggedIn = Boolean(currentUser ?? getLoggedInUser());
  const cartCount = useSyncExternalStore(
    subscribeToCart,
    getCartItemCount,
    () => 0,
  );

  const menuOpen =
    mobileMenu.isOpen && mobileMenu.atPathname === pathname;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMobileMenu({ isOpen: false, atPathname: pathname });
  }

  function toggleMenu() {
    setMobileMenu((current) =>
      current.isOpen && current.atPathname === pathname
        ? { isOpen: false, atPathname: pathname }
        : { isOpen: true, atPathname: pathname },
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-cream-dark bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex min-h-11 items-center gap-2">
          <span className="text-2xl" role="img" aria-hidden>
            🍝
          </span>
          <span className="text-lg font-bold text-tomato sm:text-xl">Sapori</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex md:gap-2">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={isActive(pathname, link.href)}
              cartCount={cartCount}
            />
          ))}
          {!isLoggedIn && (
            <Link
              href="/login"
              className="ml-1 min-h-11 rounded-full bg-tomato px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-tomato-dark sm:ml-2"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-cream md:hidden"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile navigation panel */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-cream-dark bg-white px-3 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActive(pathname, link.href)}
                cartCount={cartCount}
                onNavigate={closeMenu}
                mobile
              />
            ))}
            {!isLoggedIn && (
              <Link
                href="/login"
                onClick={closeMenu}
                className="mt-2 flex min-h-11 items-center justify-center rounded-full bg-tomato px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-tomato-dark"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
