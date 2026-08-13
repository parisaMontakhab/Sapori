interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

export default function StarRatingInput({
  value,
  onChange,
  disabled = false,
}: StarRatingInputProps) {
  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label="Select rating"
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            onClick={() => onChange(starValue)}
            className={`min-h-11 min-w-11 text-2xl transition-colors disabled:opacity-60 ${
              isActive ? "text-orange" : "text-cream-dark hover:text-orange/60"
            }`}
            aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
            aria-pressed={isActive}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
