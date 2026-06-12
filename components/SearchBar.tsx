"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

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
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:gap-2"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pizza, pasta, dolci..."
        className="min-h-11 w-full min-w-0 flex-1 rounded-full border-0 bg-white/95 px-4 py-3 text-foreground shadow-md placeholder:text-foreground/40 focus:ring-2 focus:ring-orange-light focus:outline-none sm:px-5"
      />
      <button
        type="submit"
        className="min-h-11 shrink-0 rounded-full bg-basil px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-basil-light sm:px-6"
      >
        Search
      </button>
    </form>
  );
}
