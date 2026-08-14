import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8 md:p-10">
        <div className="mb-8 text-center">
          <p className="text-4xl">🔑</p>

          <h1 className="mt-3 text-2xl font-bold text-foreground">
            Forgot your password?
          </h1>

          <p className="mt-1 text-sm text-foreground/60">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Note:</span> If you don&apos;t see
            the reset email in your inbox, please check your spam or junk
            folder.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-foreground/60">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-tomato hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
