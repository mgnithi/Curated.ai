import { useState } from "react";

const DEFAULT_ARTICLE = {
  id: 1,
  category: "Sports",
  emoji: "🏆",
  title: "India wins cricket final in a thrilling Super Over",
  source: "ESPN",
  time: "2 hours ago",
  catBg: "bg-[#E6F5F5]",
  catBorder: "border-[#0F8A8D]",
  catText: "text-[#0F8A8D]",
};

const GRAD  = "linear-gradient(135deg, #1E2A6E 0%, #2D1B69 30%, #0F8A8D 70%, #06B6D4 100%)";
const GLASS = { background: "rgba(255,255,255,0.10)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.18)" };
const INPUT = { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" };

export default function ArticleScreen({ article = DEFAULT_ARTICLE, onBack, onSubscribe, isPremium = false }) {
  const [liked, setLiked]               = useState(false);
  const [likeCount, setLikeCount]       = useState(article.likes ?? 142);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment]           = useState("");
  const [comments, setComments]         = useState(article.comments ?? []);
  const [copied, setCopied]             = useState(false);

  const handleLike = () => {
    if (liked) { setLiked(false); setLikeCount((c) => c - 1); }
    else        { setLiked(true);  setLikeCount((c) => c + 1); }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments((prev) => [...prev, { id: Date.now(), user: "You", text: comment.trim(), time: "Just now" }]);
    setComment("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Fixed background */}
      <div className="fixed inset-0 -z-10" style={{ background: GRAD }} />
      <div className="fixed top-[-80px] left-[-80px] w-72 h-72 rounded-full pointer-events-none -z-10" style={{ background: "radial-gradient(circle,rgba(192,132,252,.45),transparent 70%)", filter: "blur(50px)" }} />
      <div className="fixed bottom-[-60px] right-[-60px] w-80 h-80 rounded-full pointer-events-none -z-10" style={{ background: "radial-gradient(circle,rgba(249,115,22,.30),transparent 70%)", filter: "blur(50px)" }} />

      {/* Sticky header */}
      <header className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3" style={{ background: "rgba(30,42,110,0.55)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
        <button onClick={onBack} className="text-cyan-300 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
          ← Back
        </button>
        <h1 className="text-sm font-bold text-white truncate flex-1 text-center pr-10">Curated.ai</h1>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 px-4 pt-5 pb-12 max-w-lg mx-auto w-full space-y-4">

        {/* Category badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
          <span>{article.emoji}</span>
          <span>{article.category}</span>
        </div>

        {/* Headline */}
        <h2 className="text-xl font-bold text-white leading-snug">{article.title}</h2>

        {/* Source */}
        <p className="text-xs text-white/45">{article.source} · {article.time}</p>

        {/* Image placeholder */}
        <div className="w-full h-44 rounded-2xl flex items-center justify-center" style={GLASS}>
          <span className="text-white/30 text-sm">📷 Article image</span>
        </div>

        {/* Body */}
        <div className="rounded-2xl px-5 py-4 text-sm text-white/80 leading-relaxed space-y-3" style={GLASS}>
          {Array.isArray(article.body) && article.body.length > 0
            ? article.body.map((para, i) => <p key={i}>{para}</p>)
            : <p className="text-white/35 italic">Full article content coming soon.</p>
          }
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-around py-3 rounded-2xl" style={GLASS}>
          <button onClick={handleLike}
            className="flex flex-col items-center gap-1 text-xs transition-colors"
            style={{ color: liked ? "#67e8f9" : "rgba(255,255,255,0.55)" }}>
            <span className="text-xl">👍</span>
            <span>{likeCount.toLocaleString()} Likes</span>
          </button>

          <button onClick={() => setShowComments((v) => !v)}
            className="flex flex-col items-center gap-1 text-xs text-white/55 hover:text-cyan-300 transition-colors">
            <span className="text-xl">💬</span>
            <span>{comments.length} Comments</span>
          </button>

          <button onClick={handleShare}
            className="flex flex-col items-center gap-1 text-xs transition-colors"
            style={{ color: copied ? "#34d399" : "rgba(255,255,255,0.55)" }}>
            <span className="text-xl">🔗</span>
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#C084FC,#0F8A8D)" }}>
                  {c.user[0]}
                </div>
                <div className="rounded-2xl px-3 py-2 flex-1" style={GLASS}>
                  <p className="text-xs font-semibold text-white/90">{c.user}</p>
                  <p className="text-xs text-white/65 mt-0.5">{c.text}</p>
                  <p className="text-[10px] text-white/30 mt-1">{c.time}</p>
                </div>
              </div>
            ))}
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 text-xs text-white placeholder-white/35 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-all"
                style={INPUT}
              />
              <button type="submit" disabled={!comment.trim()}
                className="px-4 py-2 text-white text-xs rounded-full font-semibold disabled:opacity-40 transition-all"
                style={{ background: "linear-gradient(135deg,#C084FC,#0F8A8D)" }}>
                Post
              </button>
            </form>
          </div>
        )}

        {/* Premium upsell */}
        {!isPremium && (
          <div className="rounded-2xl px-5 py-5 text-center space-y-2"
            style={{ background: "linear-gradient(135deg,rgba(192,132,252,0.25),rgba(15,138,141,0.25))", border: "1px solid rgba(192,132,252,0.35)" }}>
            <p className="text-white font-bold text-sm">⭐ Subscribe ContentHub Pro</p>
            <p className="text-xs text-white/60">
              Remove all ads · Unlock exclusive categories · Offline reading
            </p>
            <button onClick={onSubscribe}
              className="mt-2 w-full py-2.5 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg,#C084FC,#0F8A8D)", boxShadow: "0 4px 16px rgba(192,132,252,0.35)" }}>
              Get Pro · ₹49 / month
            </button>
            <p className="text-[10px] text-white/30">Cancel anytime. No hidden charges.</p>
          </div>
        )}
      </main>
    </div>
  );
}
