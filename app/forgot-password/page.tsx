import Link from "next/link";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

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
        <p className="mt-6 text-center text-sm text-foreground/60">
          Remember your password?{" "}
          <Link href="/login" className="font-semibold text-tomato hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
