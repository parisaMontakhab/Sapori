export const inputClassName =
  "w-full min-w-0 rounded-xl border border-cream-dark bg-cream px-4 py-3 focus:border-basil focus:ring-2 focus:ring-basil/20 focus:outline-none";

export const MIN_PASSWORD_LENGTH = 8;

export function validatePasswordPair(
  password: string,
  passwordConfirm: string,
): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (password !== passwordConfirm) {
    return "Passwords do not match.";
  }

  return null;
}
