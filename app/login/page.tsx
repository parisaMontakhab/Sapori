import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8 md:p-10">
        <div className="mb-8 text-center">
          <p className="text-4xl">🍝</p>
          <h1 className="mt-3 text-2xl font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Sign in to your Sapori account
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-foreground/60">
          No account?{" "}
          <Link href="/register" className="font-semibold text-tomato hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
