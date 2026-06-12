import type { Product } from "@/types";

const categoryStyle: Record<string, { gradient: string; emoji: string }> = {
  Pizza: { gradient: "from-tomato to-orange", emoji: "🍕" },
  Pasta: { gradient: "from-orange to-orange-light", emoji: "🍝" },
  Antipasti: { gradient: "from-basil-light to-basil", emoji: "🥖" },
  Dolci: { gradient: "from-orange-light to-cream-dark", emoji: "🍰" },
  Insalate: { gradient: "from-basil to-basil-light", emoji: "🥗" },
};

const defaultStyle = { gradient: "from-tomato to-orange", emoji: "🍽️" };

export default function ProductImage({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  const style = categoryStyle[product.category] ?? defaultStyle;

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${style.gradient} ${
        large ? "h-72 sm:h-96" : "h-44"
      }`}
    >
      <span className={large ? "text-8xl" : "text-5xl"} role="img" aria-hidden>
        {style.emoji}
      </span>
    </div>
  );
}
