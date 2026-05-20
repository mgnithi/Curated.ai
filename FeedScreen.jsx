import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// 🔑 NEWSDATA.IO API KEY
// Get your free key at https://newsdata.io  (200 credits/day, no card needed)
// Paste it between the quotes below, then save and refresh the app.
// Leave empty to run in Demo mode with mock articles.
// ─────────────────────────────────────────────────────────────────────────────
const NEWSDATA_API_KEY = "pub_eab0c703117f48f782c9126407ee1de5"; // e.g. "pub_abc123..."

// ─────────────────────────────────────────────────────────────────────────────
// Category metadata — maps Curated.ai interest names to NewsData.io category
// slugs and the colour tokens used throughout the UI.
// apiCat: null  →  no direct NewsData.io category; falls back to mock articles.
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_MAP = {
  Sports:  { apiCat: "sports",       emoji: "🏆", catBg: "bg-[#E6F5F5]", catBorder: "border-[#0F8A8D]", catText: "text-[#0F8A8D]" },
  Tech:    { apiCat: "technology",   emoji: "💻", catBg: "bg-blue-50",   catBorder: "border-blue-300",   catText: "text-blue-600"   },
  Music:   { apiCat: null,           emoji: "🎵", catBg: "bg-orange-50", catBorder: "border-orange-300", catText: "text-orange-600" },
  Food:    { apiCat: "food",         emoji: "🍜", catBg: "bg-yellow-50", catBorder: "border-yellow-300", catText: "text-yellow-700" },
  Travel:  { apiCat: "tourism",      emoji: "✈️", catBg: "bg-purple-50", catBorder: "border-purple-300", catText: "text-purple-600" },
  Finance: { apiCat: "business",     emoji: "📈", catBg: "bg-green-50",  catBorder: "border-green-300",  catText: "text-green-700"  },
  Health:  { apiCat: "health",       emoji: "🏃", catBg: "bg-teal-50",   catBorder: "border-teal-300",   catText: "text-teal-700"   },
  Movies:  { apiCat: "entertainment",emoji: "🎬", catBg: "bg-red-50",    catBorder: "border-red-300",    catText: "text-red-600"    },
  Science: { apiCat: "science",      emoji: "🔬", catBg: "bg-indigo-50", catBorder: "border-indigo-300", catText: "text-indigo-600" },
  Gaming:  { apiCat: null,           emoji: "🎮", catBg: "bg-pink-50",   catBorder: "border-pink-300",   catText: "text-pink-600"   },
};

// ─────────────────────────────────────────────────────────────────────────────
// Mock fallback articles — 2 per interest category.
// Used when: (a) no API key is set, (b) a category has no NewsData.io mapping,
// or (c) the API call fails.
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_ARTICLES = [

  // ── Sports ──
  {
    id: 1, category: "Sports", emoji: "🏆",
    title: "India wins cricket final in a thrilling Super Over",
    source: "ESPN", time: "2h ago",
    catBg: "bg-[#E6F5F5]", catBorder: "border-[#0F8A8D]", catText: "text-[#0F8A8D]",
    likes: 3842,
    comments: [
      { id: 1, user: "Arjun S.",  text: "That Hardik over was absolutely insane. Two sixes off the last two balls — unreal scenes!", time: "1h ago" },
      { id: 2, user: "Meera P.",  text: "Bumrah defending 7 in the Super Over was the moment the game was won. What a bowler.", time: "45m ago" },
    ],
    body: [
      "In one of the most dramatic finishes in recent memory, India clinched the ICC final with a nail-biting Super Over. Needing 14 off the last over, Hardik Pandya smashed two sixes to tie the match and force the decider.",
      "The Super Over was a masterclass in nerves. Jasprit Bumrah conceded only 6 runs while India's openers chased them down in four balls, sparking unprecedented celebrations across the country.",
      "Captain Rohit Sharma praised the team's composure: \"We believed till the last ball. This is what Indian cricket is all about — never giving up.\"",
    ],
  },
  {
    id: 2, category: "Sports", emoji: "🏆",
    title: "Virat Kohli announces international retirement — a look back at his legacy",
    source: "NDTV Sports", time: "1d ago",
    catBg: "bg-[#E6F5F5]", catBorder: "border-[#0F8A8D]", catText: "text-[#0F8A8D]",
    likes: 12453,
    comments: [
      { id: 1, user: "Rohit K.",  text: "80 centuries. Let that sink in. No one will ever match what he's done for Indian cricket.", time: "20h ago" },
      { id: 2, user: "Sunita V.", text: "Grew up watching him bat. This feels like the end of an era. Retirement well earned, King.", time: "18h ago" },
    ],
    body: [
      "After 17 years and 278 international appearances, Virat Kohli has announced his retirement from all formats of international cricket, marking the end of one of the greatest careers the sport has ever seen.",
      "Kohli retires with 27,000+ international runs, 80 centuries, and three ICC trophies to his name.",
      "The BCCI has confirmed a farewell Test match at Eden Gardens, Kolkata next month. Fans across the globe have flooded social media with tributes, with #ThankYouVirat trending in over 40 countries.",
    ],
  },

  // ── Tech ──
  {
    id: 3, category: "Tech", emoji: "💻",
    title: "New AI model achieves breakthrough on reasoning benchmarks",
    source: "TechCrunch", time: "3h ago",
    catBg: "bg-blue-50", catBorder: "border-blue-300", catText: "text-blue-600",
    likes: 1876,
    comments: [
      { id: 1, user: "Dev A.",   text: "The chain-of-verification architecture is the real story here. This is a fundamentally different approach.", time: "2h ago" },
      { id: 2, user: "Kavya R.", text: "Near-perfect on ARC-AGI?! That benchmark was designed to be impossible for LLMs. Wild.", time: "1h ago" },
    ],
    body: [
      "A newly released large language model has shattered existing records on the MATH, GPQA, and ARC-AGI benchmarks, achieving near-perfect scores that researchers say were considered impossible just two years ago.",
      "Unlike previous models that relied on brute-force scaling, this system uses a novel 'chain-of-verification' architecture where the model independently checks its own reasoning at each step.",
      "Industry analysts predict this could accelerate AI deployment in medical diagnosis, legal research, and financial modelling. The model is expected to be available via API within 60 days.",
    ],
  },
  {
    id: 4, category: "Tech", emoji: "💻",
    title: "Google's quantum chip solves a problem in minutes that would take decades",
    source: "Wired", time: "8h ago",
    catBg: "bg-blue-50", catBorder: "border-blue-300", catText: "text-blue-600",
    likes: 2341,
    comments: [
      { id: 1, user: "Nikhil T.", text: "10 septillion years vs 4 minutes. The scale of that gap is genuinely difficult to comprehend.", time: "7h ago" },
      { id: 2, user: "Pooja M.",  text: "The error-correction breakthrough is the real headline. Quantum has been stuck on that for 20 years.", time: "5h ago" },
    ],
    body: [
      "Google's latest quantum processor, Willow 2, has completed a complex computational task in 4 minutes that would take the world's fastest classical supercomputer an estimated 10 septillion years.",
      "The chip operates at near absolute zero and uses 105 error-corrected qubits, solving a fundamental problem that has plagued quantum computing for decades.",
      "Practical applications remain 5–10 years away, but experts say breakthroughs in drug discovery, materials science, and cryptography are now firmly within reach.",
    ],
  },

  // ── Music ──
  {
    id: 5, category: "Music", emoji: "🎵",
    title: "Arijit Singh drops surprise new album — fans go wild",
    source: "Rolling Stone India", time: "5h ago",
    catBg: "bg-orange-50", catBorder: "border-orange-300", catText: "text-orange-600",
    likes: 5621,
    comments: [
      { id: 1, user: "Anjali D.", text: "Track 7 with AR Rahman had me in tears. The classical undertones are something else entirely.", time: "4h ago" },
      { id: 2, user: "Karan B.",  text: "Stealth drop at midnight! Been streaming non-stop since. 'Roshni' is his best work yet.", time: "3h ago" },
    ],
    body: [
      "Arijit Singh surprised millions of fans by dropping 'Roshni', a 14-track album with zero advance notice, following the stealth-release strategy made famous by Beyoncé.",
      "The album blends classical ragas with contemporary production, featuring collaborations with A.R. Rahman, Pritam, and Grammy-winning producer Jack Antonoff.",
      "Within six hours of release, three tracks crossed 10 million streams on Spotify. 'Roshni' debuted at #1 in 22 countries.",
    ],
  },
  {
    id: 6, category: "Music", emoji: "🎵",
    title: "Grammy nominations 2026 — who made the list and who was snubbed",
    source: "Billboard", time: "1d ago",
    catBg: "bg-orange-50", catBorder: "border-orange-300", catText: "text-orange-600",
    likes: 2187,
    comments: [
      { id: 1, user: "Simran J.", text: "The Weeknd shut out AGAIN after one of his best albums is pure Recording Academy politics.", time: "22h ago" },
      { id: 2, user: "Rahul N.",  text: "Diljit getting a Grammy nod is huge for Punjabi music globally. Absolutely deserved.", time: "20h ago" },
    ],
    body: [
      "The Recording Academy unveiled the 2026 Grammy nominations and the music world immediately split. Beyoncé leads with 9 nominations including Album of the Year for her country crossover record.",
      "Surprise inclusions include Sabrina Carpenter with 6 nods and Burna Boy earning his first Record of the Year nomination. Diljit Dosanjh and AR Rahman both received nods in the Global Music category.",
      "Notable snubs include Taylor Swift and The Weeknd, whose critically acclaimed LP was shut out entirely — sparking a petition with over 2 million signatures.",
    ],
  },

  // ── Food ──
  {
    id: 7, category: "Food", emoji: "🍜",
    title: "10 street food dishes in Mumbai you must try this monsoon",
    source: "Food52", time: "6h ago",
    catBg: "bg-yellow-50", catBorder: "border-yellow-300", catText: "text-yellow-700",
    likes: 891,
    comments: [
      { id: 1, user: "Priya S.",  text: "The keema pav at Sarvi is life-changing. Been going there since college. Nothing like it.", time: "5h ago" },
      { id: 2, user: "Aditya K.", text: "Dadar station bun maska at 7am is my personal religion. Missed Elco's pani puri though!", time: "4h ago" },
    ],
    body: [
      "Mumbai's street food scene transforms during the monsoon. The rain-soaked city comes alive with the sizzle of vada pav, the tang of pav bhaji, and roasted corn on every corner.",
      "Top picks include the bun maska at Kyani & Co, the keema pav at Sarvi in Byculla, and the legendary Schezwan dosa outside Dadar station that has been operating since 1987.",
      "Budget around ₹500 for a full crawl. Mumbai's street food is a microcosm of its population — Maharashtrian, Gujarati, South Indian, and Parsi influences coexist on a single street.",
    ],
  },
  {
    id: 8, category: "Food", emoji: "🍜",
    title: "Scientists say eating these 5 foods daily boosts brain health significantly",
    source: "Healthline", time: "2d ago",
    catBg: "bg-yellow-50", catBorder: "border-yellow-300", catText: "text-yellow-700",
    likes: 1432,
    comments: [
      { id: 1, user: "Dr. Nisha", text: "As a neurologist I've been recommending this dietary pattern for years. Great to see large-scale data backing it.", time: "1d ago" },
      { id: 2, user: "Vikram T.", text: "Added blueberries and walnuts to my breakfast. Dark chocolate is the easiest prescription ever.", time: "20h ago" },
    ],
    body: [
      "A landmark 10-year study in Nature Medicine followed 60,000 adults and found daily consumption of five foods was associated with a 37% reduction in cognitive decline.",
      "The five foods: fatty fish, blueberries, leafy greens, walnuts, and dark chocolate with at least 70% cacao. Their combined omega-3, flavonoid, and antioxidant content creates a synergistic protective effect.",
      "\"This isn't about any single superfood — it's about building a consistent dietary pattern,\" said the study's lead author.",
    ],
  },

  // ── Travel ──
  {
    id: 9, category: "Travel", emoji: "✈️",
    title: "The 8 most underrated monsoon destinations in India right now",
    source: "Condé Nast Traveller", time: "4h ago",
    catBg: "bg-purple-50", catBorder: "border-purple-300", catText: "text-purple-600",
    likes: 743,
    comments: [
      { id: 1, user: "Sneha R.", text: "Majuli in monsoon is something else entirely. I went last August and it genuinely changed my life.", time: "3h ago" },
      { id: 2, user: "Tarun G.", text: "Chikmagalur gets overlooked every year. The waterfalls after the first rains are jaw-dropping.", time: "2h ago" },
    ],
    body: [
      "While Goa and Coorg get all the monsoon attention, savvy travellers are discovering quieter destinations. Chikmagalur has waterfalls that don't appear on any tourist map but rival Niagara in sheer spectacle.",
      "Majuli in Assam — the world's largest river island — transforms into an emerald dreamscape during the rains. Orchha in Madhya Pradesh offers Mughal architecture reflected in flooded ghats.",
      "Practical tip: monsoon travel in India is cheapest between July and August, with flight prices dropping up to 40%. Carry a quality rain poncho — umbrellas are impractical in strong winds.",
    ],
  },
  {
    id: 10, category: "Travel", emoji: "✈️",
    title: "Japan overtakes France as the world's most visited country",
    source: "CNN Travel", time: "12h ago",
    catBg: "bg-purple-50", catBorder: "border-purple-300", catText: "text-purple-600",
    likes: 1129,
    comments: [
      { id: 1, user: "Ananya M.", text: "Visited Kanazawa last spring — completely tourist-free and more beautiful than Kyoto. This boom is well deserved.", time: "10h ago" },
      { id: 2, user: "Karthik P.", text: "The Kyoto tourist tax is controversial but honestly necessary. Some temples were getting overwhelmed.", time: "8h ago" },
    ],
    body: [
      "For the first time in recorded history, Japan has surpassed France as the most visited country in the world, welcoming over 98 million international tourists in 2025 — up 62% from pre-pandemic levels.",
      "Tokyo, Kyoto, and Osaka remain top draws, but secondary destinations like Kanazawa and Matsumoto are now appearing on mainstream itineraries.",
      "The surge has created tension in some communities. Kyoto has introduced a tourist tax and deployed AI-powered crowd management systems at its 15 most-visited temples.",
    ],
  },

  // ── Finance ──
  {
    id: 11, category: "Finance", emoji: "📈",
    title: "Sensex crosses 100,000 for the first time — what it means for retail investors",
    source: "Mint", time: "1h ago",
    catBg: "bg-green-50", catBorder: "border-green-300", catText: "text-green-700",
    likes: 4521,
    comments: [
      { id: 1, user: "CA Ramesh", text: "This is a moment but don't panic-buy. P/E of 28x means you're paying a premium. Stay in SIPs.", time: "45m ago" },
      { id: 2, user: "Deepa S.",  text: "My SIP started at 35k Sensex is now sitting pretty. Compound interest is the only magic worth believing in.", time: "30m ago" },
    ],
    body: [
      "India's BSE Sensex crossed the historic 100,000-point milestone today, driven by a surge in IT and banking stocks following better-than-expected quarterly earnings.",
      "For retail investors who started SIPs five years ago at the 50,000 level, the milestone represents a 100% return — significantly outperforming fixed deposits and gold.",
      "Analysts urge caution. Valuations are stretched at current levels, with the Nifty 50 trading at a P/E ratio of 28x, above its historical average of 20x.",
    ],
  },
  {
    id: 12, category: "Finance", emoji: "📈",
    title: "How to build an emergency fund in 6 months on any salary",
    source: "Economic Times", time: "5h ago",
    catBg: "bg-green-50", catBorder: "border-green-300", catText: "text-green-700",
    likes: 623,
    comments: [
      { id: 1, user: "Amit J.", text: "The 50-20-30 flip tip is underrated. Did this for 4 months and hit my 3-month target. Liquid funds are key.", time: "4h ago" },
      { id: 2, user: "Ritu B.", text: "Wish someone had explained emergency funds to me at 22. Starting late at 31 but better now than never.", time: "3h ago" },
    ],
    body: [
      "Surveys show 68% of Indians have less than one month of expenses saved. Financial advisors universally agree that a 3–6 month emergency fund is the foundation of any solid financial plan.",
      "The 50-30-20 rule is a starting point, but temporarily flipping it to 50-20-30 — cutting wants — can accelerate the fund dramatically for someone starting from zero.",
      "Keep your emergency fund in a liquid mutual fund, not a fixed deposit. Apps like Groww and Zerodha Coin make liquid fund investments accessible with same-day withdrawal.",
    ],
  },

  // ── Health ──
  {
    id: 13, category: "Health", emoji: "🏃",
    title: "Why walking 7,000 steps — not 10,000 — is the new health target",
    source: "The Lancet", time: "3h ago",
    catBg: "bg-teal-50", catBorder: "border-teal-300", catText: "text-teal-700",
    likes: 2891,
    comments: [
      { id: 1, user: "Dr. Priya", text: "Finally the science catches up to what many of us have been telling patients. 7k is sustainable, 10k often isn't.", time: "2h ago" },
      { id: 2, user: "Sameer H.", text: "The fact that 10,000 was a marketing slogan this whole time is genuinely infuriating and also hilarious.", time: "1h ago" },
    ],
    body: [
      "The 10,000-step goal was invented by a Japanese pedometer manufacturer in 1965 as a marketing slogan — there was never any scientific basis for it.",
      "A major 2025 meta-analysis of 226,000 participants established 7,000 steps as the optimal daily target. Mortality risk dropped sharply between 2,500 and 7,000 steps, with diminishing returns beyond that.",
      "A 45-minute walk once a day achieves the target for most people. Those who set 7,000 as their goal are 3x more likely to maintain the habit for over a year.",
    ],
  },
  {
    id: 14, category: "Health", emoji: "🏃",
    title: "Sleep deprivation is now classified as a public health crisis in India",
    source: "Indian Journal of Medicine", time: "1d ago",
    catBg: "bg-teal-50", catBorder: "border-teal-300", catText: "text-teal-700",
    likes: 1764,
    comments: [
      { id: 1, user: "Nidhi A.", text: "₹4.2 lakh crore in lost productivity and we're still glorifying 'hustle culture'. Maddening.", time: "22h ago" },
      { id: 2, user: "Raj P.",   text: "Cutting phone use an hour before bed literally changed my sleep quality within a week. Simple but works.", time: "20h ago" },
    ],
    body: [
      "The ICMR has classified chronic sleep deprivation as a public health crisis after a nationwide survey found 53% of Indians sleep fewer than 6 hours a night.",
      "The economic cost is staggering: an estimated ₹4.2 lakh crore in lost productivity annually. Sleep-deprived workers have 60% higher rates of workplace accidents.",
      "Simple interventions like cutting screen time one hour before bed reduced sleep onset time by 27 minutes in trials. Schools are being urged to delay start times to 8:30 AM.",
    ],
  },

  // ── Movies ──
  {
    id: 15, category: "Movies", emoji: "🎬",
    title: "Pushpa 3 breaks Day 1 box office record with ₹200 crore worldwide",
    source: "Box Office India", time: "2h ago",
    catBg: "bg-red-50", catBorder: "border-red-300", catText: "text-red-600",
    likes: 8932,
    comments: [
      { id: 1, user: "Suresh K.",  text: "Watched the 6AM show. The third act is something Indian cinema has never done before. Mind-blowing.", time: "1h ago" },
      { id: 2, user: "Lavanya T.", text: "₹200cr on Day 1. Tollywood has permanently changed the game for Indian cinema.", time: "45m ago" },
    ],
    body: [
      "Allu Arjun's Pushpa 3: The Rampage has shattered every Indian box office record, collecting ₹200 crore globally on its opening day.",
      "The film released simultaneously in five languages across 12,000 screens in India and 4,500 screens internationally. The Hindi version alone contributed ₹78 crore.",
      "Director Sukumar said: 'With Pushpa 3, we wanted to do something audiences had never seen before in Indian cinema. The third act alone took 14 months to film.'",
    ],
  },
  {
    id: 16, category: "Movies", emoji: "🎬",
    title: "Christopher Nolan's next film set in ancient India — details revealed",
    source: "Variety", time: "6h ago",
    catBg: "bg-red-50", catBorder: "border-red-300", catText: "text-red-600",
    likes: 3217,
    comments: [
      { id: 1, user: "Ishaan M.", text: "Nolan doing the Ashoka story with IMAX cameras and a Bollywood-Hollywood cast? This is genuinely historic.", time: "5h ago" },
      { id: 2, user: "Fatima R.", text: "200 historians as consultants — that kind of commitment to authenticity is why Nolan's films actually matter.", time: "4h ago" },
    ],
    body: [
      "Christopher Nolan has confirmed his next film is an epic set during the Maurya Empire in 300 BCE, co-produced with Reliance Entertainment. Principal photography begins in Rajasthan in March.",
      "The film will be shot in IMAX and feature a cast split equally between Hollywood and Bollywood stars — believed to be inspired by Emperor Ashoka's transformation after the Kalinga War.",
      "Nolan's team has hired 200 Indian historians and archaeologists as consultants. The production will reconstruct Pataliputra as it stood 2,300 years ago. Release is targeted for Diwali 2027.",
    ],
  },

  // ── Science ──
  {
    id: 17, category: "Science", emoji: "🔬",
    title: "NASA confirms discovery of liquid water ocean beneath Mars's surface",
    source: "Nature", time: "1h ago",
    catBg: "bg-indigo-50", catBorder: "border-indigo-300", catText: "text-indigo-600",
    likes: 15632,
    comments: [
      { id: 1, user: "Prof. Sunil", text: "I've been studying Mars for 25 years and I never thought I'd see this confirmed in my lifetime. Historic.", time: "50m ago" },
      { id: 2, user: "Zara K.",     text: "Conditions that could support microbial life. Let that sink in. We are not alone in this solar system.", time: "30m ago" },
    ],
    body: [
      "NASA's Perseverance rover has confirmed the existence of a liquid water ocean 15 kilometres beneath the Martian south pole, large enough to cover the entire planet in a shallow sea.",
      "The water is kept liquid by geothermal heat from Mars's still-active core. Chemical analysis suggests conditions that could theoretically support microbial life.",
      "A dedicated sample-return mission targeting the region is now being fast-tracked for a 2031 launch, backed by a $4.2 billion Congressional appropriation.",
    ],
  },
  {
    id: 18, category: "Science", emoji: "🔬",
    title: "Scientists reverse ageing in human cells by 30 years in lab breakthrough",
    source: "MIT Technology Review", time: "4h ago",
    catBg: "bg-indigo-50", catBorder: "border-indigo-300", catText: "text-indigo-600",
    likes: 9841,
    comments: [
      { id: 1, user: "Dr. Ananya", text: "The fact that the cells retain their specialised function is the key. Earlier Yamanaka attempts lost that.", time: "3h ago" },
      { id: 2, user: "Vivek S.",   text: "$8 billion in biotech valuations overnight tells you everything about how seriously the industry is taking this.", time: "2h ago" },
    ],
    body: [
      "Researchers at Harvard Medical School have successfully reversed the biological age of human skin, kidney, and brain cells by approximately 30 years using a cocktail of six proteins.",
      "The technique, published in Cell, avoids the key risk of previous methods: cells do not lose their specialised function or risk becoming cancerous. The reversal is stable for at least 18 months.",
      "'We are talking about adding healthy years to life — compressing the period of decline rather than extending total lifespan indefinitely,' the lead researcher cautioned.",
    ],
  },

  // ── Gaming ──
  {
    id: 19, category: "Gaming", emoji: "🎮",
    title: "GTA VI sells 10 million copies in 24 hours — breaks all records",
    source: "IGN", time: "2h ago",
    catBg: "bg-pink-50", catBorder: "border-pink-300", catText: "text-pink-600",
    likes: 11234,
    comments: [
      { id: 1, user: "Rohan G.", text: "1000 players in one server is the most ambitious multiplayer design ever attempted. Played 6 hours straight.", time: "1h ago" },
      { id: 2, user: "Tanya M.", text: "$2 billion to develop and it shows. Every frame looks like a photograph.", time: "45m ago" },
    ],
    body: [
      "Grand Theft Auto VI has sold 10 million copies within its first 24 hours, generating $900 million in revenue and making it the biggest entertainment launch in history.",
      "Set in a fictional Miami, the game features the first female protagonist in GTA's mainline series and a multiplayer mode supporting up to 1,000 simultaneous players in a single session.",
      "Rockstar spent 12 years and an estimated $2 billion developing GTA VI — the most expensive entertainment product ever created. Early reviews are near-perfect.",
    ],
  },
  {
    id: 20, category: "Gaming", emoji: "🎮",
    title: "India's esports team wins the BGMI World Championship — a historic first",
    source: "Sportskeeda", time: "8h ago",
    catBg: "bg-pink-50", catBorder: "border-pink-300", catText: "text-pink-600",
    likes: 4127,
    comments: [
      { id: 1, user: "Akash P.", text: "Mortal eliminating 4 players with a pan in the grand final is the greatest esports moment India has ever produced.", time: "7h ago" },
      { id: 2, user: "Divya N.", text: "₹200cr government investment in esports infrastructure is finally coming. This win made it impossible to ignore.", time: "6h ago" },
    ],
    body: [
      "Team Soul has won the BGMI World Championship in Seoul, defeating South Korea's DRX in a nail-biting grand final to give India its first-ever global esports title.",
      "Captain Mortal was named MVP for a stunning final round where he eliminated four opponents single-handedly with a pan. The moment immediately went viral across YouTube and Instagram.",
      "India's esports industry has grown from near-zero to a $300 million market in five years. The government has pledged ₹200 crore to build dedicated training centres in 10 cities.",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Amazon product ads — one per interest category.
// ─────────────────────────────────────────────────────────────────────────────
const AD_CATALOG = {
  Sports:  { emoji: "🏏", badge: "Sports & Outdoors",       name: "SS Ton Master Edition Cricket Bat — Full Size",           tagline: "Professional-grade English willow. Perfect weight balance for power hitting.", price: "₹4,299", originalPrice: "₹5,999", discount: "28% off", rating: 4.5, reviews: "2,847",  tag: "Best Seller in Cricket Bats" },
  Tech:    { emoji: "🎧", badge: "Electronics",             name: "boAt Airdopes 191G True Wireless Gaming Earbuds",         tagline: "32Hr total battery · Beast Mode gaming · ENx noise cancellation for calls.",    price: "₹1,299", originalPrice: "₹2,990", discount: "57% off", rating: 4.3, reviews: "18,421", tag: "#1 Best Seller in Earbuds" },
  Music:   { emoji: "🎹", badge: "Musical Instruments",     name: "Yamaha PSR-E373 61-Key Portable Keyboard",                tagline: "622 voices · Built-in lessons · Headphone jack for silent practice.",             price: "₹8,990", originalPrice: "₹11,490",discount: "22% off", rating: 4.6, reviews: "3,112",  tag: "Amazon's Choice for Keyboards" },
  Food:    { emoji: "🍟", badge: "Kitchen & Home Appliances",name: "Philips HD9252/90 Digital Air Fryer — 4.1L",              tagline: "Rapid Air technology · Up to 90% less fat · Digital touch panel.",               price: "₹6,995", originalPrice: "₹9,995", discount: "30% off", rating: 4.4, reviews: "12,567", tag: "Best Seller in Air Fryers" },
  Travel:  { emoji: "🧳", badge: "Luggage & Travel Gear",   name: "American Tourister Linex 68cm 4-Wheel Spinner",           tagline: "TSA-approved lock · 10-year warranty · Weighs just 2.9 kg.",                   price: "₹5,299", originalPrice: "₹8,500", discount: "38% off", rating: 4.5, reviews: "7,834",  tag: "Amazon's Choice for Suitcases" },
  Finance: { emoji: "📗", badge: "Books · Personal Finance", name: "The Psychology of Money — Morgan Housel (Paperback)",     tagline: "Timeless lessons on wealth, greed and happiness. India's #1 money book.",       price: "₹299",   originalPrice: "₹599",   discount: "50% off", rating: 4.7, reviews: "43,291", tag: "#1 Best Seller in Investing" },
  Health:  { emoji: "🧘", badge: "Sports, Fitness & Outdoors",name: "Boldfit Pro Yoga Mat — Anti-Slip, Extra Thick 6mm",     tagline: "High-density foam · Carry strap included · Ideal for yoga & pilates.",          price: "₹799",   originalPrice: "₹1,499", discount: "47% off", rating: 4.3, reviews: "9,214",  tag: "Amazon's Choice for Yoga Mats" },
  Movies:  { emoji: "📺", badge: "Electronics · Televisions",name: "Mi 55\" 4K Ultra HD Smart Android TV — X Series",        tagline: "Dolby Vision & Atmos · 30W speaker · Android 11 with Google Assistant.",       price: "₹34,999",originalPrice: "₹44,999",discount: "22% off", rating: 4.4, reviews: "28,104", tag: "Best Seller in Smart TVs" },
  Science: { emoji: "🔭", badge: "Telescopes & Optics",      name: "Celestron PowerSeeker 127EQ Reflector Telescope",         tagline: "127mm aperture · Includes 3 eyepieces · View planets, moon & star clusters.",  price: "₹12,499",originalPrice: "₹16,000",discount: "22% off", rating: 4.2, reviews: "1,823",  tag: "Amazon's Choice for Telescopes" },
  Gaming:  { emoji: "🎮", badge: "PC & Console Gaming",      name: "HyperX Cloud II Wired Gaming Headset — 7.1 Surround",     tagline: "53mm drivers · Noise-cancelling detachable mic · PC, PS & Xbox compatible.",  price: "₹7,490", originalPrice: "₹10,990",discount: "32% off", rating: 4.5, reviews: "15,672", tag: "#1 Best Seller in Gaming Headsets" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Convert NewsData.io pubDate string to relative "Xh ago" format. */
function timeAgo(pubDate) {
  try {
    const then   = new Date(pubDate.replace(" ", "T") + "Z");
    const diffMs = Date.now() - then.getTime();
    const mins   = Math.floor(diffMs / 60_000);
    if (mins < 1)  return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return "Recently";
  }
}

/** Strip the "[+XXXX chars]" truncation marker NewsData.io adds to content. */
function cleanContent(text = "") {
  return text.replace(/\[\+\d+ chars\]$/, "").trim();
}

/** Map a raw NewsData.io result to the internal article shape. */
function mapLiveArticle(result, curatedCategory, idx) {
  const meta = CATEGORY_MAP[curatedCategory];
  const desc  = cleanContent(result.description || "");
  const body  = desc
    ? [desc, "Full story available on the source website — tap to read more."]
    : ["Full story available on the source website — tap to read more."];

  return {
    id:       `live_${result.article_id || idx}`,
    category: curatedCategory,
    emoji:    meta.emoji,
    title:    (result.title || "Untitled").replace(/ - [^-]+$/, ""), // strip " - Source Name" suffix common in aggregated feeds
    source:   result.source_name || result.source_id || "News",
    time:     result.pubDate ? timeAgo(result.pubDate) : "Recently",
    catBg:    meta.catBg,
    catBorder:meta.catBorder,
    catText:  meta.catText,
    likes:    Math.floor(Math.random() * 4000) + 200,
    comments: [],
    body,
    url:      result.link || null,
    isLive:   true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StarRating({ rating }) {
  const full    = Math.floor(rating);
  const partial = rating - full;
  const empty   = 5 - Math.ceil(rating);
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} className="w-3 h-3 text-[#FF9900]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      {partial > 0 && (
        <svg className="w-3 h-3 text-[#FF9900]" fill="currentColor" viewBox="0 0 20 20">
          <defs><linearGradient id="partial"><stop offset={`${partial * 100}%`} stopColor="currentColor"/><stop offset={`${partial * 100}%`} stopColor="#E2E8F0"/></linearGradient></defs>
          <path fill="url(#partial)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} className="w-3 h-3 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

/** Pulsing placeholder shown while headlines are loading. */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="px-4 py-2 border-b bg-slate-100 h-9" />
      <div className="px-4 py-3 space-y-2">
        <div className="h-3.5 bg-slate-100 rounded w-11/12" />
        <div className="h-3.5 bg-slate-100 rounded w-8/12" />
        <div className="h-3 bg-slate-100 rounded w-1/3 mt-1" />
      </div>
      <div className="px-4 pb-3 flex gap-2">
        <div className="h-7 bg-slate-100 rounded-full w-16" />
        <div className="h-7 bg-slate-100 rounded-full w-16" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FeedScreen
// ─────────────────────────────────────────────────────────────────────────────
export default function FeedScreen({ userInterests = ["Sports", "Tech", "Music"], onArticleClick, onLogout }) {
  const [engagement,   setEngagement]   = useState({});
  const [hidden,       setHidden]       = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("All");
  const [liveArticles, setLiveArticles] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [isLiveMode,   setIsLiveMode]   = useState(false);
  const [fetchError,   setFetchError]   = useState("");

  // ── Live news fetch ────────────────────────────────────────────────────────
  const fetchLiveNews = useCallback(async () => {
    if (!NEWSDATA_API_KEY) return; // no key → stay in demo mode

    // Build a reverse map: NewsData.io category slug → Curated.ai category name.
    // First interest in the list wins when two interests share the same API slug
    // (e.g. Tech + Gaming both map to "technology").
    const reverseMap  = {};
    const apiCats     = [];
    for (const interest of userInterests) {
      const meta = CATEGORY_MAP[interest];
      if (meta?.apiCat && !reverseMap[meta.apiCat]) {
        reverseMap[meta.apiCat] = interest;
        apiCats.push(meta.apiCat);
      }
    }

    if (apiCats.length === 0) return; // all selected interests have no API category

    setLoading(true);
    setFetchError("");

    try {
      const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&category=${apiCats.join(",")}&language=en&size=10`;
      const res  = await fetch(url);

      if (!res.ok) {
        throw new Error(`NewsData.io returned ${res.status}`);
      }

      const data = await res.json();

      if (data.status !== "success" || !Array.isArray(data.results)) {
        throw new Error(data.message || "Unexpected API response");
      }

      // Map each result to our article shape
      const mapped = [];
      data.results.forEach((result, idx) => {
        // result.category is an array of NewsData.io slugs e.g. ["sports"]
        const apiCat = Array.isArray(result.category)
          ? result.category.find((c) => reverseMap[c])
          : null;
        const curatedCat = apiCat ? reverseMap[apiCat] : null;
        if (!curatedCat || !result.title) return; // skip unmapped or empty results
        mapped.push(mapLiveArticle(result, curatedCat, idx));
      });

      // For interests with no API mapping (Music, Gaming), keep their mock articles
      const unsupportedInterests = userInterests.filter(
        (i) => !CATEGORY_MAP[i]?.apiCat
      );
      const mockFallback = ALL_ARTICLES.filter((a) =>
        unsupportedInterests.includes(a.category)
      );

      const combined = [...mapped, ...mockFallback];
      if (combined.length > 0) {
        setLiveArticles(combined);
        setIsLiveMode(true);
      }
    } catch (err) {
      console.error("NewsData.io fetch failed:", err);
      setFetchError(err.message || "Could not load live news.");
      // Silently fall back to mock data
    } finally {
      setLoading(false);
    }
  }, [userInterests]);

  useEffect(() => {
    fetchLiveNews();
  }, [fetchLiveNews]);

  // ── Feed computation ───────────────────────────────────────────────────────
  const interestSet  = new Set(userInterests);
  const baseArticles = isLiveMode ? liveArticles : ALL_ARTICLES;

  const visibleFeed = baseArticles.filter((item) => {
    if (hidden.has(item.id))                                       return false;
    if (!interestSet.has(item.category))                           return false;
    if (activeFilter !== "All" && item.category !== activeFilter)  return false;
    return true;
  });

  // ── Engagement handlers ────────────────────────────────────────────────────
  const handleLike = (id, e) => {
    e.stopPropagation();
    setEngagement((prev) => ({ ...prev, [id]: "liked" }));
  };

  const handleSkip = (id, e) => {
    e.stopPropagation();
    setEngagement((prev) => ({ ...prev, [id]: "skipped" }));
    setTimeout(() => setHidden((prev) => new Set([...prev, id])), 400);
  };

  // ── Ad banner ──────────────────────────────────────────────────────────────
  const AdBanner = ({ category }) => {
    const ad = AD_CATALOG[category] || AD_CATALOG["Tech"];
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Sponsored</span>
          <span className="text-[10px] text-slate-400">{ad.badge}</span>
        </div>
        <div className="px-4 pb-2 flex gap-3">
          <div className="w-20 h-20 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-3xl">
            {ad.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block text-[10px] font-semibold text-[#FF9900] bg-orange-50 px-2 py-0.5 rounded mb-1">{ad.tag}</span>
            <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2">{ad.name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <StarRating rating={ad.rating} />
              <span className="text-[10px] text-[#0F8A8D]">{ad.reviews} ratings</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{ad.tagline}</p>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-sm font-bold text-slate-900">{ad.price}</span>
              <span className="text-[10px] text-slate-400 line-through">{ad.originalPrice}</span>
              <span className="text-[10px] font-semibold text-green-600">{ad.discount}</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-3">
          <a
            href={`https://www.amazon.in/s?k=${encodeURIComponent(ad.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 w-full py-2 bg-[#FF9900] hover:bg-[#e68a00] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <span>Shop on Amazon</span><span>→</span>
          </a>
        </div>
      </div>
    );
  };

  const filters = ["All", ...userInterests];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#1E2A6E] px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-white tracking-wide">Curated.ai</h1>
          {/* Live / Demo mode badge */}
          {isLiveMode ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-[#0F8A8D] text-white px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
              LIVE
            </span>
          ) : (
            <span className="text-[10px] font-medium text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">
              DEMO
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh button shown in live mode */}
          {isLiveMode && (
            <button
              onClick={fetchLiveNews}
              disabled={loading}
              className="text-slate-300 hover:text-white text-base disabled:opacity-40"
              title="Refresh headlines"
            >
              🔄
            </button>
          )}
          <button className="text-slate-300 hover:text-white text-lg">🔍</button>
          <button
            onClick={onLogout}
            className="w-8 h-8 rounded-full bg-[#0F8A8D] flex items-center justify-center text-white text-sm font-bold"
            title="Sign out"
          >
            M
          </button>
        </div>
      </header>

      {/* API setup notice — shown only when no key is configured */}
      {!NEWSDATA_API_KEY && (
        <div className="mx-4 mt-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
          <span className="text-amber-500 text-sm mt-0.5">ℹ️</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">Demo mode.</span> Add your free NewsData.io API key to{" "}
            <code className="bg-amber-100 px-1 rounded">FeedScreen.jsx</code> line 12 to load live headlines.
          </p>
        </div>
      )}

      {/* Fetch error notice */}
      {fetchError && (
        <div className="mx-4 mt-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
          <span className="text-red-500 text-sm mt-0.5">⚠️</span>
          <p className="text-xs text-red-700">
            <span className="font-semibold">Could not load live news.</span> Showing demo articles.{" "}
            <span className="text-slate-500">({fetchError})</span>
          </p>
        </div>
      )}

      {/* Filter chips */}
      <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === f
                ? "bg-[#0F8A8D] text-white border-[#0F8A8D]"
                : "bg-white border-slate-200 text-slate-600 hover:border-[#0F8A8D] hover:text-[#0F8A8D]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed title */}
      <div className="px-4 pt-2 pb-1">
        <h2 className="text-base font-bold text-[#1E2A6E]">Your Feed</h2>
        <p className="text-xs text-slate-400">
          {activeFilter === "All"
            ? `Showing all ${userInterests.join(", ")} stories`
            : `Showing ${activeFilter} stories`}
        </p>
      </div>

      {/* Main content */}
      <main className="px-4 pb-24 space-y-3 mt-2">

        {/* Loading skeletons */}
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Empty state */}
        {!loading && visibleFeed.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-sm font-medium">You're all caught up!</p>
            <p className="text-xs mt-1">Check back later for new content.</p>
          </div>
        )}

        {/* Article cards */}
        {!loading && visibleFeed.map((article, index) => {
          const state = engagement[article.id];
          return (
            <div key={article.id}>
              {index > 0 && index % 3 === 0 && (
                <AdBanner category={visibleFeed[index - 1].category} />
              )}
              <div
                onClick={() => onArticleClick(article)}
                className={`bg-white rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all overflow-hidden ${
                  state === "liked"   ? "ring-2 ring-[#0F8A8D]" :
                  state === "skipped" ? "opacity-40"             : ""
                }`}
              >
                {/* Category strip */}
                <div className={`px-4 py-2 flex items-center justify-between border-b ${article.catBg} ${article.catBorder}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{article.emoji}</span>
                    <span className={`text-xs font-bold uppercase tracking-wide ${article.catText}`}>
                      {article.category}
                    </span>
                  </div>
                  {/* Live dot on individual article */}
                  {article.isLive && (
                    <span className="flex items-center gap-1 text-[9px] text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F8A8D] inline-block" />
                      live
                    </span>
                  )}
                </div>

                {/* Title + source */}
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">{article.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{article.source} · {article.time}</p>
                </div>

                {/* Action row */}
                <div className="px-4 pb-3 flex items-center gap-3">
                  <button
                    onClick={(e) => handleLike(article.id, e)}
                    disabled={!!state}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors disabled:cursor-default ${
                      state === "liked"
                        ? "bg-[#0F8A8D] text-white border-[#0F8A8D]"
                        : "bg-white text-slate-500 border-slate-200 hover:border-[#0F8A8D] hover:text-[#0F8A8D]"
                    }`}
                  >
                    👍 {state === "liked" ? "Liked!" : "Like"}
                  </button>
                  <button
                    onClick={(e) => handleSkip(article.id, e)}
                    disabled={!!state}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors disabled:cursor-default ${
                      state === "skipped"
                        ? "bg-slate-400 text-white border-slate-400"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    ⏭ Skip
                  </button>
                  <span className="ml-auto text-xs text-slate-300">Read more →</span>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center py-3 z-10">
        {[
          { icon: "🏠", label: "Feed",    active: true  },
          { icon: "🔍", label: "Explore", active: false },
          { icon: "🔖", label: "Saved",   active: false },
          { icon: "👤", label: "Profile", active: false },
        ].map(({ icon, label, active }) => (
          <button
            key={label}
            className={`flex flex-col items-center gap-0.5 ${active ? "text-[#0F8A8D]" : "text-slate-400 hover:text-[#0F8A8D]"}`}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
