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

const GRAD  = "linear-gradient(135deg, #1E2A6E 0%, #2D1B69 30%, #0F8A8D 70%, #06B6D4 100%)";
const GLASS = { background: "rgba(255,255,255,0.10)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.20)" };
const INPUT = { background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" };
const BTN   = { background: "linear-gradient(135deg, #C084FC, #0F8A8D)", boxShadow: "0 4px 20px rgba(192,132,252,0.35)" };

function StepDot({ step, current }) {
  const done   = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white transition-all"
        style={
          done   ? { background: "linear-gradient(135deg,#C084FC,#0F8A8D)" } :
          active ? { background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.6)" } :
                   { background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.15)" }
        }
      >
        {done ? "✓" : step}
      </div>
      <span className={`text-[10px] font-medium ${active ? "text-white" : "text-white/40"}`}>
        {step === 1 ? "Account" : "Interests"}
      </span>
    </div>
  );
}

export default function CreateAccountScreen({ onAccountCreated, onBack }) {
  const [step, setStep]           = useState(1);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState(new Set());

  const validateStep1 = () => {
    const e = {};
    if (!name.trim())                         e.name     = "Full name is required.";
    if (!email)                               e.email    = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email))  e.email    = "Enter a valid email address.";
    if (!password)                            e.password = "Password is required.";
    else if (password.length < 6)            e.password = "Password must be at least 6 characters.";
    if (password !== confirm)                 e.confirm  = "Passwords do not match.";
    return e;
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    const e1 = validateStep1();
    if (Object.keys(e1).length) { setErrors(e1); return; }
    setErrors({});
    setStep(2);
  };

  const toggleInterest = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleCreateAccount = async () => {
    if (selected.size < MIN_INTERESTS) return;
    const interests = ALL_INTERESTS.filter((i) => selected.has(i.id)).map((i) => i.label);
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 700));
      onAccountCreated(interests);
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = selected.size >= MIN_INTERESTS && !loading;

  return (
    <div className="relative min-h-screen flex items-start justify-center px-4 py-10">
      {/* Fixed gradient background */}
      <div className="fixed inset-0 -z-10" style={{ background: GRAD }} />
      <div className="fixed top-[-80px] left-[-80px] w-72 h-72 rounded-full pointer-events-none -z-10" style={{ background: "radial-gradient(circle,rgba(192,132,252,.5),transparent 70%)", filter: "blur(40px)" }} />
      <div className="fixed bottom-[-60px] right-[-60px] w-80 h-80 rounded-full pointer-events-none -z-10" style={{ background: "radial-gradient(circle,rgba(249,115,22,.35),transparent 70%)", filter: "blur(40px)" }} />

      <div className="w-full max-w-sm">

        {/* Wordmark */}
        <div className="flex flex-col items-center gap-1 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1" style={{ background: "linear-gradient(135deg,#C084FC,#0F8A8D)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.85"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Curated.ai</h1>
          <p className="text-sm text-white/50">Your interests. Your feed. Your way.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <StepDot step={1} current={step} />
          <div className="h-px w-12 rounded-full transition-all" style={{ background: step > 1 ? "rgba(192,132,252,0.7)" : "rgba(255,255,255,0.15)" }} />
          <StepDot step={2} current={step} />
        </div>

        {/* Glass card */}
        <div className="rounded-3xl px-7 py-8" style={GLASS}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <h2 className="text-base font-semibold text-white/90 text-center mb-6">Create your account</h2>

              <form onSubmit={handleNextStep} className="space-y-3" noValidate>

                <div>
                  <input type="text" placeholder="Full name" autoComplete="name" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-all ${errors.name ? "ring-2 ring-rose-400/70" : ""}`}
                    style={INPUT}
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-300">{errors.name}</p>}
                </div>

                <div>
                  <input type="email" placeholder="Email" autoComplete="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-all ${errors.email ? "ring-2 ring-rose-400/70" : ""}`}
                    style={INPUT}
                  />
                  {errors.email && <p className="mt-1 text-xs text-rose-300">{errors.email}</p>}
                </div>

                <div>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} placeholder="Password (min. 6 characters)"
                      autoComplete="new-password" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 pr-14 rounded-xl text-white text-sm placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-all ${errors.password ? "ring-2 ring-rose-400/70" : ""}`}
                      style={INPUT}
                    />
                    <button type="button" onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-xs font-medium transition-colors">
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-rose-300">{errors.password}</p>}
                  {password && (
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3].map((lvl) => (
                        <div key={lvl} className="h-1 flex-1 rounded-full transition-all"
                          style={{
                            background: password.length >= lvl * 4
                              ? lvl === 1 ? "#fb7185" : lvl === 2 ? "#facc15" : "#0F8A8D"
                              : "rgba(255,255,255,0.12)"
                          }}
                        />
                      ))}
                      <span className="text-[10px] text-white/40 ml-1">
                        {password.length < 4 ? "Weak" : password.length < 8 ? "Fair" : "Strong"}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <input type={showPass ? "text" : "password"} placeholder="Confirm password"
                    autoComplete="new-password" value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-all ${errors.confirm ? "ring-2 ring-rose-400/70" : ""}`}
                    style={INPUT}
                  />
                  {errors.confirm && <p className="mt-1 text-xs text-rose-300">{errors.confirm}</p>}
                </div>

                <button type="submit"
                  className="w-full py-3 mt-1 rounded-xl text-white font-semibold text-sm tracking-wide transition-all active:scale-[0.98]"
                  style={BTN}>
                  Next: Choose Interests →
                </button>
              </form>

              <div className="mt-5 text-center">
                <button type="button" onClick={onBack} className="text-sm text-cyan-300 hover:text-white transition-colors">
                  ← Back to sign in
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              <h2 className="text-base font-semibold text-white/90 text-center mb-1">What interests you?</h2>
              <p className="text-center text-xs text-white/45 mb-3">Pick at least {MIN_INTERESTS} topics to personalise your feed.</p>

              <div className="flex justify-center mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={selected.size >= MIN_INTERESTS
                    ? { background: "linear-gradient(135deg,#C084FC,#0F8A8D)", color: "#fff" }
                    : { background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)" }
                  }>
                  {selected.size} / {MIN_INTERESTS}+ selected
                </span>
              </div>

              <ul className="space-y-2 max-h-64 overflow-y-auto pr-1" style={{ scrollbarWidth: "none" }}>
                {ALL_INTERESTS.map((interest) => {
                  const on = selected.has(interest.id);
                  return (
                    <li key={interest.id}>
                      <button type="button" onClick={() => toggleInterest(interest.id)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all text-sm font-medium"
                        style={on
                          ? { background: "rgba(192,132,252,0.18)", border: "1px solid rgba(192,132,252,0.55)", color: "#fff" }
                          : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", color: "rgba(255,255,255,0.7)" }
                        }>
                        <span className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-bold transition-all"
                          style={on
                            ? { background: "linear-gradient(135deg,#C084FC,#0F8A8D)", color: "#fff" }
                            : { background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.2)", color: "transparent" }
                          }>
                          {on && "✓"}
                        </span>
                        <span className="text-base">{interest.emoji}</span>
                        <span>{interest.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {errors.submit && <p className="mt-3 text-xs text-rose-300 text-center">{errors.submit}</p>}

              <button type="button" onClick={handleCreateAccount} disabled={!canSubmit}
                className="mt-5 w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={BTN}>
                {loading ? "Creating account…" : "Create Account"}
              </button>

              {!canSubmit && !loading && selected.size < MIN_INTERESTS && (
                <p className="mt-2 text-center text-xs text-white/35">
                  Select {MIN_INTERESTS - selected.size} more to continue
                </p>
              )}

              <div className="mt-4 text-center">
                <button type="button" onClick={() => setStep(1)} className="text-sm text-cyan-300 hover:text-white transition-colors">
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
