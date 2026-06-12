"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/menu?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/menu");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pizza, pasta, tiramisu..."
        className="flex-1 rounded-2xl border-0 bg-white px-5 py-4 text-foreground shadow-lg placeholder:text-foreground/40 focus:ring-4 focus:ring-amber-300/50 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-2xl bg-tomato px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-tomato-dark"
      >
        Search
      </button>
    </form>
  );
}
