import { Suspense } from "react";
import PaymentSuccessContent from "@/components/PaymentSuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-md sm:p-12">
          <p className="text-sm text-foreground/60">Loading...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
