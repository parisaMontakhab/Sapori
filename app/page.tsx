import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HomeSearchBar from "@/components/home/HomeSearchBar";
import { HERO_IMAGE } from "@/components/home/foodImages";
import { getProducts } from "@/services/productService";

const CATEGORIES = [
  { label: "Pizza", emoji: "🍕", search: "Pizza" },
  { label: "Pasta", emoji: "🍝", search: "Pasta" },
  { label: "Desserts", emoji: "🍰", search: "Dolci" },
  { label: "Antipasti", emoji: "🥖", search: "Antipasti" },
  { label: "Drinks", emoji: "🥤", search: "Drinks" },
];

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 6);

  return (
    <div className="space-y-14 pb-4">
      {/* Hero */}
      <section className="relative min-h-[520px] overflow-hidden rounded-[2rem] shadow-2xl sm:min-h-[560px]">
        <Image
          src={HERO_IMAGE}
          alt="Italian food spread with pasta and fresh ingredients"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-tomato/60 to-amber-600/50" />

        <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-center px-6 py-12 sm:min-h-[560px] sm:px-12 sm:py-16 lg:px-16">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-amber-400/90 px-4 py-1.5 text-sm font-bold text-foreground shadow-md">
            🇮🇹 Sapori — Italian delivery
          </span>

          <h1 className="max-w-xl text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Italian flavors, delivered fast.
          </h1>

          <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/90 sm:text-xl">
            Order fresh pasta, pizza, desserts and Mediterranean favorites from
            Sapori.
          </p>

          <div className="mt-8">
            <HomeSearchBar />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="rounded-2xl bg-amber-400 px-8 py-3.5 font-bold text-foreground shadow-lg transition-transform hover:scale-[1.02] hover:bg-amber-300"
            >
              Explore menu
            </Link>
            <Link
              href="/cart"
              className="rounded-2xl border-2 border-white/80 bg-white/10 px-8 py-3.5 font-bold text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02] hover:bg-white/20"
            >
              View cart
            </Link>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section>
        <h2 className="mb-5 text-2xl font-bold text-foreground">
          What are you craving?
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/menu?search=${encodeURIComponent(cat.search)}`}
              className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="text-xl">{cat.emoji}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured dishes */}
      <section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-wider text-orange uppercase">
              Chef&apos;s picks
            </p>
            <h2 className="mt-1 text-3xl font-bold text-foreground">
              Featured dishes
            </h2>
            <p className="mt-2 text-foreground/60">
              Hand-picked favorites, ready to order
            </p>
          </div>
          <Link
            href="/menu"
            className="hidden shrink-0 rounded-2xl bg-cream-dark px-5 py-2.5 text-sm font-bold text-tomato transition-colors hover:bg-orange/10 sm:block"
          >
            See all →
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Link
          href="/menu"
          className="mt-8 block rounded-2xl bg-white py-4 text-center text-sm font-bold text-tomato shadow-md transition-colors hover:bg-cream-dark sm:hidden"
        >
          See full menu →
        </Link>
      </section>

      {/* Promotional banner */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-400 via-orange to-orange-light p-8 shadow-xl sm:p-10">
        <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-tomato/10 blur-2xl" />

        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-extrabold tracking-wider text-tomato uppercase">
              Weekend Special
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
              Free delivery on orders over €25
            </h2>
            <p className="mt-2 max-w-md text-foreground/70">
              Treat yourself this weekend — no delivery fee when you spend €25
              or more. Use code{" "}
              <span className="rounded-lg bg-white/60 px-2 py-0.5 font-bold text-tomato">
                SAPORI25
              </span>
            </p>
          </div>
          <Link
            href="/menu"
            className="shrink-0 rounded-2xl bg-tomato px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-tomato-dark"
          >
            Order now
          </Link>
        </div>
      </section>
    </div>
  );
}
