import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in — Pranj Legal Associates" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_20%_10%,#233e64,#09172e_60%)] p-5">
      <div className="w-full max-w-[440px] rounded-[18px] bg-white p-8 shadow-[0_30px_90px_#0003]">
        <div className="mb-[26px] flex items-center gap-3">
          <Image src="/logo.png" alt="Pranj Legal Associates logo" width={76} height={76} className="size-[76px] rounded-lg bg-white object-contain" />
          <div>
            <strong className="block text-[17px] text-navy">Pranj Legal Associates</strong>
            <small className="text-muted">Legal practice management</small>
          </div>
        </div>
        <h2 className="m-0 mb-1 text-xl font-semibold text-navy">Welcome back</h2>
        <p className="m-0 mb-5 text-muted">Sign in to your secure workspace.</p>
        <LoginForm />
        <div className="mt-[15px] text-center">
          <Link href="/" className="text-btn">← Back to website</Link>
        </div>
      </div>
    </main>
  );
}
