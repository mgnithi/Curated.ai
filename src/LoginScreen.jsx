import { useState } from "react";

export default function LoginScreen({ onLoginSuccess, onCreateAccount }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      onLoginSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1E2A6E 0%, #2D1B69 30%, #0F8A8D 70%, #06B6D4 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #C084FC, transparent)" }}
      />
      <div
        className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #F97316, transparent)" }}
      />
      <div
        className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #34D399, transparent)" }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm rounded-3xl px-8 py-10 shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.22)",
        }}
      >
        {/* Logo / wordmark */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #C084FC, #0F8A8D)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.85"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Curated.ai</h1>
          <p className="text-sm text-white/60">Your interests. Your feed. Your way.</p>
        </div>

        {/* Divider */}
        <div className="my-7 h-px w-full" style={{ background: "rgba(255,255,255,0.15)" }} />

        <h2 className="text-base font-semibold text-white/90 text-center mb-5">Welcome back</h2>

        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/60 transition-all"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/60 transition-all"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          />

          {error && (
            <p className="text-xs text-rose-300 text-center font-medium" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-1 rounded-xl text-white font-semibold text-sm tracking-wide shadow-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            style={{
              background: loading
                ? "rgba(255,255,255,0.15)"
                : "linear-gradient(135deg, #C084FC 0%, #0F8A8D 100%)",
              boxShadow: "0 4px 20px rgba(192,132,252,0.35)",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onCreateAccount}
            className="text-sm text-cyan-300 hover:text-white transition-colors underline underline-offset-2"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
