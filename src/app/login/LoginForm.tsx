"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <form action={action}>
      <label className="label" htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      <label className="label" htmlFor="password">Password</label>
      <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
      {state && !state.ok && (
        <p role="alert" className="mt-4 rounded-lg bg-[#fff0f0] px-3 py-2 text-xs font-medium text-brand-red">{state.message}</p>
      )}
      <button type="submit" disabled={pending} className="btn mt-[18px] w-full">
        {pending ? "Signing in…" : "Sign in to Legal Office"}
      </button>
    </form>
  );
}
