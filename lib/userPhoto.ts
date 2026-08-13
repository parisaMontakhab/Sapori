/**
 * User photos may be stored as:
 * - Base64 data URLs in MongoDB (runtime uploads on Render)
 * - Legacy filenames served from /img/users/{filename}
 * - Absolute http(s) URLs
 */
const BACKEND_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://sapori-backend.onrender.com/api/v1"
).replace(/\/api\/v1\/?$/, "");

export function isInlinePhotoUrl(url: string): boolean {
  return url.startsWith("blob:") || url.startsWith("data:image/");
}

export function resolveUserPhotoUrl(
  photo: string | undefined | null,
): string | undefined {
  if (!photo?.trim()) return undefined;

  const trimmed = photo.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image/")
  ) {
    return trimmed;
  }

  return `${BACKEND_ORIGIN}/img/users/${trimmed}`;
}
