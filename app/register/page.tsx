import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-4xl">🇮🇹</p>
          <h1 className="mt-3 text-2xl font-bold text-foreground">
            Join Sapori
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Create an account to start ordering
          </p>
        </div>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-tomato hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
