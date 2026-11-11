"use client";

import { useActionState } from "react";

import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "login-error" : undefined}
          className="mt-2 block w-full rounded-xl border border-sand bg-white px-4 py-3 outline-none focus:border-ink/40 focus:ring-2 focus:ring-saffron/40"
        />
      </div>
      {state.error && (
        <p id="login-error" role="alert" className="text-sm font-medium text-chili">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-cocoa px-6 py-3 font-semibold text-cream transition-colors hover:bg-cocoa-light disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
