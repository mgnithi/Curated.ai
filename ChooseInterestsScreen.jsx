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
    // 🔌 POST /api/preferences { interests: labels }
    onContinue(labels); // navigate to Screen 3
  };

  const canContinue = selected.size >= MIN;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 px-8 py-10">

        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 text-sm text-slate-500 hover:text-[#0F8A8D] flex items-center gap-1"
          >
            ← Back
          </button>
        )}

        <h1 className="text-2xl font-bold text-center text-[#1E2A6E]">Curated.ai</h1>
        <h2 className="mt-4 text-lg font-semibold text-center text-slate-700">
          What interests you?
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          Pick at least {MIN} topics to personalise your feed.
        </p>

        <div className="mt-3 flex justify-center">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${canContinue ? "bg-[#0F8A8D] text-white" : "bg-slate-100 text-slate-500"}`}>
            {selected.size} / {MIN}+ selected
          </span>
        </div>

        <ul className="mt-5 space-y-2">
          {ALL_INTERESTS.map((interest) => {
            const on = selected.has(interest.id);
            return (
              <li key={interest.id}>
                <button
                  type="button"
                  onClick={() => toggle(interest.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
                    on
                      ? "bg-[#E6F5F5] border-[#0F8A8D] text-[#0F8A8D]"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-[#0F8A8D]"
                  }`}
                >
                  <span className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${on ? "bg-[#0F8A8D] border-[#0F8A8D] text-white" : "bg-white border-slate-300"}`}>
                    {on && "✓"}
                  </span>
                  <span className="text-lg">{interest.emoji}</span>
                  <span className="font-medium text-sm">{interest.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="mt-6 w-full py-3 bg-[#0F8A8D] hover:bg-[#0c7477] text-white font-semibold rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>

        {!canContinue && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Select {MIN - selected.size} more to continue
          </p>
        )}
      </div>
    </div>
  );
}
