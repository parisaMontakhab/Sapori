"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useAuth";
import { queryKeys } from "@/lib/queryKeys";
import { getCartItemCount, subscribeToCart } from "@/store/cart";
import { getAuthToken, getLoggedInUser, logout } from "@/store/auth";
import type { User } from "@/types";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
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

function NavUserAvatar({ user }: { user: User }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(user.photoUrl) && !imageFailed;

  if (showPhoto && user.photoUrl) {
    return (
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full shadow-sm">
        <Image
          src={user.photoUrl}
          alt=""
          fill
          sizes="32px"
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-tomato to-orange text-xs font-bold text-white shadow-sm">
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}

function ProfileNavLink({
  user,
  pathname,
}: {
  user: User;
  pathname: string;
}) {
  const active = isActive(pathname, "/profile");

  return (
    <Link
      href="/profile"
      className={`flex min-h-11 max-w-[11rem] items-center gap-2 rounded-full px-2 py-1.5 transition-colors sm:max-w-[12rem] sm:px-3 ${
        active
          ? "bg-cream font-semibold text-tomato"
          : "font-medium text-foreground/80 hover:bg-cream hover:text-tomato"
      }`}
      aria-current={active ? "page" : undefined}
      aria-label={`${user.name} profile`}
    >
      <NavUserAvatar user={user} />
      <span className="truncate text-sm">{user.name}</span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mobileMenu, setMobileMenu] = useState({
    isOpen: false,
    atPathname: pathname,
  });
  const { data: currentUser } = useCurrentUser();
  const user = currentUser ?? getLoggedInUser();
  const isLoggedIn = Boolean(getAuthToken() && user);
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

  function handleLogout() {
    logout();
    queryClient.removeQueries({ queryKey: queryKeys.auth.me });
    queryClient.removeQueries({ queryKey: queryKeys.orders.all });
    toast.success("Logged out successfully.");
    closeMenu();
    router.push("/login");
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
          {publicLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={isActive(pathname, link.href)}
              cartCount={cartCount}
            />
          ))}

          {isLoggedIn && user ? (
            <>
              <ProfileNavLink user={user} pathname={pathname} />
              <button
                type="button"
                onClick={handleLogout}
                className="min-h-11 rounded-full border border-tomato/30 px-4 py-2 text-sm font-semibold text-tomato transition-colors hover:bg-tomato/5"
                aria-label="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="ml-1 min-h-11 rounded-full bg-tomato px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-tomato-dark sm:ml-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="min-h-11 rounded-full border border-tomato/30 px-4 py-2.5 text-sm font-semibold text-tomato transition-colors hover:bg-tomato/5"
              >
                Sign Up
              </Link>
            </>
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
            {publicLinks.map((link) => (
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

            {isLoggedIn && user ? (
              <>
                <div className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3">
                  <NavUserAvatar user={user} />
                  <span className="truncate font-semibold text-foreground">
                    {user.name}
                  </span>
                </div>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className={`flex min-h-11 w-full items-center rounded-xl px-4 py-2.5 text-base ${
                    isActive(pathname, "/profile")
                      ? "bg-cream font-semibold text-tomato"
                      : "font-medium text-foreground/80 hover:bg-cream/80 hover:text-tomato"
                  }`}
                  aria-current={isActive(pathname, "/profile") ? "page" : undefined}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex min-h-11 w-full items-center justify-center rounded-full border border-tomato/30 px-4 py-2.5 text-base font-semibold text-tomato transition-colors hover:bg-tomato/5"
                  aria-label="Log out"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="mt-2 flex min-h-11 items-center justify-center rounded-full bg-tomato px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-tomato-dark"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex min-h-11 items-center justify-center rounded-full border border-tomato/30 px-4 py-2.5 text-base font-semibold text-tomato transition-colors hover:bg-tomato/5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
