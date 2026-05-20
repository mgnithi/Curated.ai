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
      // 🔌 Replace with real API call:
      // const res = await fetch("/api/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!res.ok) throw new Error("Invalid credentials");

      await new Promise((r) => setTimeout(r, 600)); // demo delay
      onLoginSuccess();                              // navigate to Screen 2
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 px-8 py-10">

        <h1 className="text-3xl font-bold text-center text-[#1E2A6E]">Curated.ai</h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Your interests. Your feed. Your way.
        </p>

        <h2 className="mt-8 text-lg font-medium text-center text-slate-700">Sign In</h2>

        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-100 rounded-md text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0F8A8D] focus:bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-100 rounded-md text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0F8A8D] focus:bg-white"
          />

          {error && (
            <p className="text-sm text-rose-600 text-center" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-[#0F8A8D] hover:bg-[#0c7477] text-white font-semibold rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onCreateAccount}
            className="text-sm text-[#0F8A8D] hover:underline"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
