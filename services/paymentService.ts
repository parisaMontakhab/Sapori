import { apiFetch } from "@/lib/api";

interface CheckoutSessionResponse {
  status: string;
  data: {
    sessionId: string;
    checkoutUrl: string;
  };
}

export interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
}

export async function getCheckoutSession(
  orderId: string,
): Promise<CheckoutSession> {
  const response = await apiFetch<CheckoutSessionResponse>(
    `/payments/checkout-session/${orderId}`,
  );

  return {
    sessionId: response.data.sessionId,
    checkoutUrl: response.data.checkoutUrl,
  };
}
