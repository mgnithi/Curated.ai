import { useState } from "react";

const ALL_INTERESTS = [
  { id: "sports",  label: "Sports",  emoji: "🏆" },
  { id: "tech",    label: "Tech",    emoji: "💻" },
  { id: "music",   label: "Music",   emoji: "🎵" },
  { id: "food",    label: "Food",    emoji: "🍜" },
  { id: "travel",  label: "Travel",  emoji: "✈️"  },
  { id: "finance", label: "Finance", emoji: "📈" },
  { id: "health",  label: "Health",  emoji: "🏃" },
  { id: "movies",  label: "Movies",  emoji: "🎬" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "gaming",  label: "Gaming",  emoji: "🎮" },
];

const MIN_INTERESTS = 3;

// ---------- Step indicator ----------
function StepDot({ step, current }) {
  const done    = current > step;
  const active  = current === step;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
        done   ? "bg-[#0F8A8D] text-white" :
        active ? "bg-[#1E2A6E] text-white" :
                 "bg-slate-200 text-slate-400"
      }`}>
        {done ? "✓" : step}
      </div>
      <span className={`text-[10px] ${active ? "text-[#1E2A6E] font-medium" : "text-slate-400"}`}>
        {step === 1 ? "Account" : "Interests"}
      </span>
    </div>
  );
}

export default function CreateAccountScreen({ onAccountCreated, onBack }) {
  // ── Step state (1 = account details, 2 = interests) ──
  const [step, setStep] = useState(1);

  // ── Step 1: account fields ──
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);

  // ── Step 2: interests ──
  const [selected, setSelected]   = useState(new Set());

  // ─────────────────────────────────────
  // Step 1 validation
  // ─────────────────────────────────────
  const validateStep1 = () => {
    const e = {};
    if (!name.trim())                          e.name     = "Full name is required.";
    if (!email)                                e.email    = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email))   e.email    = "Enter a valid email address.";
    if (!password)                             e.password = "Password is required.";
    else if (password.length < 6)             e.password = "Password must be at least 6 characters.";
    if (password !== confirm)                  e.confirm  = "Passwords do not match.";
    return e;
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    const e1 = validateStep1();
    if (Object.keys(e1).length) { setErrors(e1); return; }
    setErrors({});

    // Optional: verify email uniqueness with backend here
    // const res = await fetch("/api/check-email", { ... });

    setStep(2); // move to interest picker
  };

  // ─────────────────────────────────────
  // Step 2: toggle interests
  // ─────────────────────────────────────
  const toggleInterest = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // ─────────────────────────────────────
  // Final submit
  // ─────────────────────────────────────
  const handleCreateAccount = async () => {
    if (selected.size < MIN_INTERESTS) return;

    const interests = ALL_INTERESTS
      .filter((i) => selected.has(i.id))
      .map((i) => i.label);

    try {
      setLoading(true);

      // 🔌 Replace with real API call:
      // const res = await fetch("/api/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, password, interests }),
      // });
      // if (!res.ok) throw new Error("Registration failed");
      // const { token } = await res.json();
      // localStorage.setItem("token", token);

      await new Promise((r) => setTimeout(r, 700)); // demo delay
      onAccountCreated(interests);                   // navigate to Feed
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = selected.size >= MIN_INTERESTS && !loading;

  // ─────────────────────────────────────
  // Render
  // ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <h1 className="text-3xl font-bold text-center text-[#1E2A6E] mb-1">Curated.ai</h1>
        <p className="text-center text-sm text-slate-500 mb-6">
          Your interests. Your feed. Your way.
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <StepDot step={1} current={step} />
          <div className={`h-0.5 w-12 rounded-full transition-colors ${step > 1 ? "bg-[#0F8A8D]" : "bg-slate-200"}`} />
          <StepDot step={2} current={step} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 px-8 py-8">

          {/* ── STEP 1: Account details ── */}
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold text-center text-slate-700 mb-6">
                Create your account
              </h2>

              <form onSubmit={handleNextStep} className="space-y-4" noValidate>

                {/* Full name */}
                <div>
                  <input
                    type="text"
                    placeholder="Full name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-100 rounded-md text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0F8A8D] focus:bg-white transition-colors ${errors.name ? "ring-2 ring-rose-400" : ""}`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-100 rounded-md text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0F8A8D] focus:bg-white transition-colors ${errors.email ? "ring-2 ring-rose-400" : ""}`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Password (min. 6 characters)"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 bg-slate-100 rounded-md text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0F8A8D] focus:bg-white transition-colors pr-12 ${errors.password ? "ring-2 ring-rose-400" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}

                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            password.length >= lvl * 4
                              ? lvl === 1 ? "bg-rose-400"
                              : lvl === 2 ? "bg-yellow-400"
                              : "bg-[#0F8A8D]"
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-slate-400 ml-1">
                        {password.length < 4 ? "Weak" : password.length < 8 ? "Fair" : "Strong"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-100 rounded-md text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0F8A8D] focus:bg-white transition-colors ${errors.confirm ? "ring-2 ring-rose-400" : ""}`}
                  />
                  {errors.confirm && <p className="mt-1 text-xs text-rose-500">{errors.confirm}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-2 bg-[#0F8A8D] hover:bg-[#0c7477] text-white font-semibold rounded-md transition-colors"
                >
                  Next: Choose Interests →
                </button>
              </form>

              {/* Back to login */}
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm text-slate-500 hover:text-[#0F8A8D] transition-colors"
                >
                  ← Back to sign in
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Choose interests ── */}
          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold text-center text-slate-700 mb-1">
                What interests you?
              </h2>
              <p className="text-center text-sm text-slate-400 mb-3">
                Pick at least {MIN_INTERESTS} topics to personalise your feed.
              </p>

              {/* Counter badge */}
              <div className="flex justify-center mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium transition-colors ${selected.size >= MIN_INTERESTS ? "bg-[#0F8A8D] text-white" : "bg-slate-100 text-slate-500"}`}>
                  {selected.size} / {MIN_INTERESTS}+ selected
                </span>
              </div>

              {/* Interest list */}
              <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {ALL_INTERESTS.map((interest) => {
                  const on = selected.has(interest.id);
                  return (
                    <li key={interest.id}>
                      <button
                        type="button"
                        onClick={() => toggleInterest(interest.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
                          on
                            ? "bg-[#E6F5F5] border-[#0F8A8D] text-[#0F8A8D]"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-[#0F8A8D]"
                        }`}
                      >
                        <span className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition-colors ${on ? "bg-[#0F8A8D] border-[#0F8A8D] text-white" : "bg-white border-slate-300"}`}>
                          {on && "✓"}
                        </span>
                        <span className="text-lg">{interest.emoji}</span>
                        <span className="font-medium text-sm">{interest.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Submit error */}
              {errors.submit && (
                <p className="mt-3 text-sm text-rose-600 text-center">{errors.submit}</p>
              )}

              {/* Create account button */}
              <button
                type="button"
                onClick={handleCreateAccount}
                disabled={!canSubmit}
                className="mt-5 w-full py-3 bg-[#0F8A8D] hover:bg-[#0c7477] text-white font-semibold rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>

              {!canSubmit && !loading && (
                <p className="mt-2 text-center text-xs text-slate-400">
                  {selected.size < MIN_INTERESTS
                    ? `Select ${MIN_INTERESTS - selected.size} more to continue`
                    : ""}
                </p>
              )}

              {/* Back to details */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-slate-500 hover:text-[#0F8A8D] transition-colors"
                >
                  ← Back to account details
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
