/** @format */

import { useState, type FormEvent } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Logo, ThemedLogo } from "../components/Logo";
import { useAuth } from "../lib/auth";
import { errorText, supabaseConfigured } from "../lib/supabase";

export default function Login() {
  const { profile, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!loading && profile)
    return <Navigate to={profile.role === "admin" ? "/admin" : "/"} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password)
      return setError("Enter your email and password.");
    setBusy(true);
    setError("");
    try {
      const p = await signIn(email.trim(), password);
      if (p.must_change_password) navigate("/change-password");
      else
        navigate(params.get("next") || (p.role === "admin" ? "/admin" : "/"), {
          replace: true,
        });
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    // On large screens the page is exactly one screen tall, so it never scrolls; the photo shrinks to fit.
    <div className="grid min-h-dvh lg:h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:overflow-hidden">
      {/* Brand panel: logo, program, headline and the Forge · Learn · Evolve photo from the poster */}
      <aside className="relative flex flex-col gap-6 overflow-clip overscroll-none bg-[#3908c5] px-6 pb-8 pt-7 text-white sm:px-10 lg:h-dvh lg:gap-8 lg:px-14 lg:py-10">
        <span
          className="absolute left-0 top-0 h-2.5 w-32 rounded-br-full bg-lime lg:h-3 lg:w-48"
          aria-hidden="true"
        />
        <span
          className="absolute bottom-0 right-0 h-2.5 w-32 rounded-tl-full bg-lime lg:h-3 lg:w-56"
          aria-hidden="true"
        />
        <Logo
          variant="icon"
          tone="white"
          className="pointer-events-none absolute -bottom-24 -right-24 h-120 opacity-[0.06]"
        />

        <Logo
          tone="white"
          className="relative h-10 shrink-0 self-start lg:h-14"
        />

        <div className="relative flex min-h-0 flex-1 flex-col gap-6 lg:justify-center lg:gap-8">
          <div className="grid max-w-136 shrink-0 gap-3 lg:gap-4">
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-lime">
              Frontend Developer Program
            </div>
            <p className="m-0 font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl xl:text-[2.75rem]">
              From "what is a browser?" to shipping a{" "}
              <span className="text-lime">React</span> app.
            </p>
          </div>
          <img
            src="/brand/login-photo.png"
            alt="FLE TRIBE students learning together on laptops. Forge, Learn, Evolve."
            className="hidden min-h-0 w-full max-w-lg shrink object-contain object-left lg:block"
          />
        </div>

        <div className="relative flex shrink-0 flex-wrap items-center justify-between gap-2 text-sm text-white/75">
          <span>Website: fletribe.org</span>
        </div>
      </aside>

      <main className="flex flex-col lg:h-dvh lg:overflow-y-auto">
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm">
            <ThemedLogo className="mb-10 hidden h-12 lg:block" />
            <h1 className="text-3xl font-extrabold tracking-tight">Sign in</h1>
            <p className="mt-2 text-muted">
              Use the email and password FLE TRIBE sent you.
            </p>

            {!supabaseConfigured && (
              <p
                className="mt-6 rounded-lg bg-fri-soft px-3 py-2 text-sm font-semibold text-fri"
                role="alert">
                The app isn't connected to Supabase yet. Add VITE_SUPABASE_URL
                and VITE_SUPABASE_ANON_KEY to the .env file.
              </p>
            )}

            <form className="mt-8 grid gap-5" onSubmit={onSubmit} noValidate>
              <div className="grid gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-line bg-surface px-3 py-2.5"
                />
              </div>
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-accent"
                    onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg border border-line bg-surface px-3 py-2.5"
                />
              </div>

              {error && (
                <p
                  className="rounded-lg bg-fri-soft px-3 py-2 text-sm font-semibold text-fri"
                  role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60">
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-sm text-muted">
              No account yet? Accounts are created by FLE TRIBE when you join
              the program. Forgot your password? Ask your program admin to reset
              it.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
