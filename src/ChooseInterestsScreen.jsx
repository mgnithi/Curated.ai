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

const MIN = 3;
const GRAD = "linear-gradient(135deg, #1E2A6E 0%, #2D1B69 30%, #0F8A8D 70%, #06B6D4 100%)";
const GLASS = { background: "rgba(255,255,255,0.10)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.20)" };
const BTN   = { background: "linear-gradient(135deg, #C084FC, #0F8A8D)", boxShadow: "0 4px 20px rgba(192,132,252,0.35)" };

export default function ChooseInterestsScreen({ onContinue, onBack }) {
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleContinue = () => {
    if (selected.size < MIN) return;
    const labels = ALL_INTERESTS.filter((i) => selected.has(i.id)).map((i) => i.label);
    onContinue(labels);
  };

  const canContinue = selected.size >= MIN;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
      <div className="fixed inset-0 -z-10" style={{ background: GRAD }} />
      <div className="fixed top-[-80px] left-[-80px] w-72 h-72 rounded-full pointer-events-none -z-10" style={{ background: "radial-gradient(circle,rgba(192,132,252,.5),transparent 70%)", filter: "blur(40px)" }} />
      <div className="fixed bottom-[-60px] right-[-60px] w-80 h-80 rounded-full pointer-events-none -z-10" style={{ background: "radial-gradient(circle,rgba(249,115,22,.35),transparent 70%)", filter: "blur(40px)" }} />
      <div className="fixed top-1/2 left-1/3 w-48 h-48 rounded-full pointer-events-none -z-10" style={{ background: "radial-gradient(circle,rgba(52,211,153,.2),transparent 70%)", filter: "blur(30px)" }} />

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
        </div>

        <div className="rounded-3xl px-7 py-8" style={GLASS}>
          {onBack && (
            <button onClick={onBack} className="mb-4 text-sm text-cyan-300 hover:text-white flex items-center gap-1 transition-colors">
              ← Back
            </button>
          )}

          <h2 className="text-base font-semibold text-white/90 text-center mb-1">What interests you?</h2>
          <p className="text-center text-xs text-white/45 mb-3">
            Pick at least {MIN} topics to personalise your feed.
          </p>

          <div className="flex justify-center mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={canContinue
                ? { background: "linear-gradient(135deg,#C084FC,#0F8A8D)", color: "#fff" }
                : { background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)" }
              }>
              {selected.size} / {MIN}+ selected
            </span>
          </div>

          <ul className="space-y-2">
            {ALL_INTERESTS.map((interest) => {
              const on = selected.has(interest.id);
              return (
                <li key={interest.id}>
                  <button type="button" onClick={() => toggle(interest.id)}
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

          <button type="button" onClick={handleContinue} disabled={!canContinue}
            className="mt-5 w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={BTN}>
            Continue →
          </button>

          {!canContinue && (
            <p className="mt-2 text-center text-xs text-white/35">
              Select {MIN - selected.size} more to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
