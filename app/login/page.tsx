import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Login</h1>
      <LoginForm />
      <p className="mt-4 text-sm">
        No account?{" "}
        <Link href="/register" className="text-red-700 underline">
          Register
        </Link>
      </p>
    </div>
  );
}
