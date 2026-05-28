import { useState } from "react";
import LoginScreen          from "./LoginScreen";
import CreateAccountScreen  from "./CreateAccountScreen";
import ChooseInterestsScreen from "./ChooseInterestsScreen";
import FeedScreen            from "./FeedScreen";
import ArticleScreen         from "./ArticleScreen";

/**
 * Curated.ai — Root App
 *
 * Screen flow:
 *   login ──────────────────────────────► interests ──► feed ──► article
 *     └── (create account) ──► createAccount ────────────────────────►┘
 */
export default function App() {
  const [screen, setScreen]               = useState("login");
  const [userInterests, setUserInterests] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null);
  const [isPremium, setIsPremium]         = useState(false);

  const goTo = (s) => setScreen(s);

  // ── Login ──
  const handleLoginSuccess = () => goTo("interests");
  const handleGoToCreate   = () => goTo("createAccount");

  // ── Create account: user gets interests embedded in that screen ──
  const handleAccountCreated = (interests) => {
    setUserInterests(interests);
    goTo("feed");
  };

  // ── Choose interests (reached after normal login) ──
  const handleInterestsContinue = (interests) => {
    setUserInterests(interests);
    goTo("feed");
  };

  // ── Feed ──
  const handleArticleClick = (article) => {
    setActiveArticle(article);
    goTo("article");
  };

  // ── Article ──
  const handleSubscribe = () => {
    setIsPremium(true);
    goTo("feed");
    // 🔌 Integrate Razorpay / Stripe before setIsPremium in production
  };

  // ── Sign out ──
  const handleLogout = () => {
    setUserInterests([]);
    setActiveArticle(null);
    setIsPremium(false);
    goTo("login");
  };

  return (
    <>
      {screen === "login" && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onCreateAccount={handleGoToCreate}
        />
      )}

      {screen === "createAccount" && (
        <CreateAccountScreen
          onAccountCreated={handleAccountCreated}
          onBack={() => goTo("login")}
        />
      )}

      {screen === "interests" && (
        <ChooseInterestsScreen
          onContinue={handleInterestsContinue}
          onBack={() => goTo("login")}
        />
      )}

      {screen === "feed" && (
        <FeedScreen
          userInterests={userInterests.length ? userInterests : ["Sports", "Tech", "Music", "Food"]}
          onArticleClick={handleArticleClick}
          onLogout={handleLogout}
        />
      )}

      {screen === "article" && (
        <ArticleScreen
          article={activeArticle}
          onBack={() => goTo("feed")}
          onSubscribe={handleSubscribe}
          isPremium={isPremium}
        />
      )}
    </>
  );
}
