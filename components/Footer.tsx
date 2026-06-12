import Link from "next/link";

const valuePoints = ["Fresh Daily", "Fast Delivery", "Made in Rome"];

export default function Footer() {
  return (
    <footer className="border-t border-cream-dark bg-gradient-to-b from-white to-cream">
      <div className="mx-auto max-w-6xl px-3 py-8 sm:px-6 sm:py-12">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl" role="img" aria-hidden>
              🍝
            </span>
            <span className="text-xl font-bold text-tomato">Sapori</span>
          </Link>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-foreground/70">
            Authentic Italian food delivered to your door.
          </p>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {valuePoints.map((point) => (
              <li
                key={point}
                className="rounded-full bg-orange/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-tomato uppercase"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 border-t border-cream-dark pt-6 text-center text-xs text-foreground/50">
          © 2026 Sapori. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
