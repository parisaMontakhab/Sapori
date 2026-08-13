interface QueryErrorStateProps {
  title?: string;
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export default function QueryErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  isRetrying = false,
}: QueryErrorStateProps) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-md sm:p-12">
      <p className="text-4xl" role="img" aria-hidden>
        ⚠️
      </p>
      <p className="mt-4 text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-foreground/60 sm:text-base">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-tomato px-8 py-3 font-semibold text-white shadow-md transition-colors hover:bg-tomato-dark disabled:opacity-60"
      >
        {isRetrying ? "Retrying..." : "Retry"}
      </button>
    </div>
  );
}
