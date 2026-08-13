interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
}

export default function StarRating({
  rating,
  max = 5,
  size = "md",
}: StarRatingProps) {
  const sizeClass = size === "sm" ? "text-sm" : "text-base";

  return (
    <div
      className={`flex items-center gap-0.5 ${sizeClass}`}
      role="img"
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, index) => (
        <span
          key={index}
          className={
            index < rating ? "text-orange" : "text-cream-dark"
          }
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}
