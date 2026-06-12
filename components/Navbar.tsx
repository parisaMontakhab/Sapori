import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-red-700">
          Sapori
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/menu">Menu</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
