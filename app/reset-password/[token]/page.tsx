import Link from "next/link";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8 md:p-10">
        <div className="mb-8 text-center">
          <p className="text-4xl">🔒</p>
          <h1 className="mt-3 text-2xl font-bold text-foreground">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Choose a new password for your Sapori account.
          </p>
        </div>
        <ResetPasswordForm token={token} />
        <p className="mt-6 text-center text-sm text-foreground/60">
          <Link
            href="/forgot-password"
            className="font-semibold text-tomato hover:underline"
          >
            Request a new reset link
          </Link>
        </p>
      </div>
    </div>
  );
}
