/**
 * User photos are stored on the backend at src/public/img/users/{filename}.
 * Product images use the same convention: /img/products/ (see paymentController.js).
 */
const BACKEND_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://sapori-backend.onrender.com/api/v1"
).replace(/\/api\/v1\/?$/, "");

export function resolveUserPhotoUrl(
  photo: string | undefined | null,
): string | undefined {
  if (!photo) return undefined;

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  return `${BACKEND_ORIGIN}/img/users/${photo}`;
}
