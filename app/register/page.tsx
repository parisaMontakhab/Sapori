import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Register</h1>
      <RegisterForm />
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-red-700 underline">
          Login
        </Link>
      </p>
    </div>
  );
}
