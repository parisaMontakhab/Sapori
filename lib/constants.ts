export const APP_NAME = "Sapori";

export const APP_DESCRIPTION =
  "Italian and Mediterranean food delivery across Italy";

export const DEFAULT_CURRENCY = "EUR";

export const DEFAULT_LOCALE = "it-IT";

/**
 * Base URL for the Express API.
 * Set via NEXT_PUBLIC_API_URL when the backend is deployed.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
