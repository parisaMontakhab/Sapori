"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/menu?search=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pizza, pasta, tiramisu..."
        className="min-h-11 w-full min-w-0 flex-1 rounded-2xl border-0 bg-white px-4 py-3 text-foreground shadow-lg placeholder:text-foreground/40 focus:ring-4 focus:ring-amber-300/50 focus:outline-none sm:px-5 sm:py-4"
      />
      <button
        type="submit"
        className="min-h-11 shrink-0 rounded-2xl bg-tomato px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-tomato-dark sm:px-8 sm:py-4"
      >
        Search
      </button>
    </form>
  );
}
