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

export default function ArticleScreen({ article = DEFAULT_ARTICLE, onBack, onSubscribe, isPremium = false }) {
  const [liked, setLiked]               = useState(false);
  const [likeCount, setLikeCount]       = useState(article.likes ?? 142);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment]           = useState("");
  const [comments, setComments]         = useState(article.comments ?? []);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
    // 🔌 POST /api/engage { contentId: article.id, action: "like" }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments((prev) => [...prev, { id: Date.now(), user: "You", text: comment.trim(), time: "Just now" }]);
    setComment("");
    // 🔌 POST /api/comments { contentId: article.id, text: comment }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // 🔌 POST /api/engage { contentId: article.id, action: "share" }
  };

  const handleBack = () => {
    onBack(); // navigate back to Feed
  };

  const handleSubscribe = () => {
    onSubscribe(); // navigate to payment / mark premium in App
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={handleBack}
          className="text-[#1E2A6E] font-medium text-sm flex items-center gap-1 hover:text-[#0F8A8D] transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-sm font-bold text-[#1E2A6E] truncate flex-1 text-center pr-10">
          Curated.ai
        </h1>
      </header>

      {/* Article content */}
      <main className="flex-1 px-4 pt-5 pb-10 max-w-lg mx-auto w-full space-y-4">

        {/* Category badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide ${article.catBg ?? "bg-[#E6F5F5]"} ${article.catBorder ?? "border-[#0F8A8D]"} ${article.catText ?? "text-[#0F8A8D]"}`}>
          <span>{article.emoji}</span>
          <span>{article.category}</span>
        </div>

        {/* Headline */}
        <h2 className="text-xl font-bold text-[#1E2A6E] leading-snug">{article.title}</h2>

        {/* Source */}
        <p className="text-xs text-slate-400">{article.source} · {article.time}</p>

        {/* Image placeholder */}
        <div className="w-full h-44 bg-slate-200 rounded-xl flex items-center justify-center">
          <span className="text-slate-400 text-sm">📷 Article image</span>
        </div>

        {/* Body — renders the article's own paragraphs */}
        <div className="text-sm text-slate-700 leading-relaxed space-y-3">
          {Array.isArray(article.body) && article.body.length > 0
            ? article.body.map((para, i) => <p key={i}>{para}</p>)
            : <p className="text-slate-400 italic">Full article content coming soon.</p>
          }
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-around border-t border-b border-slate-200 py-3">
          <button
            onClick={handleLike}
            className={`flex flex-col items-center gap-1 text-xs transition-colors ${liked ? "text-[#0F8A8D] font-semibold" : "text-slate-500 hover:text-[#0F8A8D]"}`}
          >
            <span className="text-xl">👍</span>
            <span>{likeCount.toLocaleString()} Likes</span>
          </button>

          <button
            onClick={() => setShowComments((v) => !v)}
            className="flex flex-col items-center gap-1 text-xs text-slate-500 hover:text-[#0F8A8D] transition-colors"
          >
            <span className="text-xl">💬</span>
            <span>{comments.length} Comments</span>
          </button>

          <button
            onClick={handleShare}
            className={`flex flex-col items-center gap-1 text-xs transition-colors ${copied ? "text-green-500" : "text-slate-500 hover:text-[#0F8A8D]"}`}
          >
            <span className="text-xl">🔗</span>
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#0F8A8D] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {c.user[0]}
                </div>
                <div className="bg-white border border-slate-100 rounded-xl px-3 py-2 flex-1">
                  <p className="text-xs font-semibold text-slate-700">{c.user}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{c.text}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{c.time}</p>
                </div>
              </div>
            ))}
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 text-xs border border-slate-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F8A8D]"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="px-4 py-2 bg-[#0F8A8D] text-white text-xs rounded-full disabled:opacity-40 hover:bg-[#0c7477] transition-colors"
              >
                Post
              </button>
            </form>
          </div>
        )}

        {/* Premium upsell */}
        {!isPremium && (
          <div className="bg-[#E6F5F5] border border-[#0F8A8D] rounded-xl px-5 py-4 text-center space-y-2">
            <p className="text-[#1E2A6E] font-bold text-sm">⭐ Subscribe ContentHub Pro</p>
            <p className="text-xs text-slate-600">
              Remove all ads · Unlock exclusive categories · Offline reading
            </p>
            <button
              onClick={handleSubscribe}
              className="mt-2 w-full py-2.5 bg-[#0F8A8D] hover:bg-[#0c7477] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Get Pro · ₹49 / month
            </button>
            <p className="text-[10px] text-slate-400">Cancel anytime. No hidden charges.</p>
          </div>
        )}
      </main>
    </div>
  );
}
