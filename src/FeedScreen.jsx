import { useState, useEffect, useCallback } from "react";

const NEWSDATA_API_KEY = "pub_eab0c703117f48f782c9126407ee1de5";

const CATEGORY_MAP = {
  Sports:  { apiCat: "sports",        emoji: "🏆" },
  Tech:    { apiCat: "technology",    emoji: "💻" },
  Music:   { apiCat: null,            emoji: "🎵" },
  Food:    { apiCat: "food",          emoji: "🍜" },
  Travel:  { apiCat: "tourism",       emoji: "✈️"  },
  Finance: { apiCat: "business",      emoji: "📈" },
  Health:  { apiCat: "health",        emoji: "🏃" },
  Movies:  { apiCat: "entertainment", emoji: "🎬" },
  Science: { apiCat: "science",       emoji: "🔬" },
  Gaming:  { apiCat: null,            emoji: "🎮" },
};

export const ALL_ARTICLES = [
  { id: 1,  category: "Sports",  emoji: "🏆", title: "India wins cricket final in a thrilling Super Over",                          source: "ESPN",                  time: "2h ago",  likes: 3842,  comments: [{ id:1, user:"Arjun S.",  text:"That Hardik over was absolutely insane. Two sixes off the last two balls — unreal scenes!", time:"1h ago" },{ id:2, user:"Meera P.", text:"Bumrah defending 7 in the Super Over was the moment the game was won. What a bowler.", time:"45m ago" }], body: ["In one of the most dramatic finishes in recent memory, India clinched the ICC final with a nail-biting Super Over. Needing 14 off the last over, Hardik Pandya smashed two sixes to tie the match and force the decider.", "The Super Over was a masterclass in nerves. Jasprit Bumrah conceded only 6 runs while India's openers chased them down in four balls, sparking unprecedented celebrations across the country.", "Captain Rohit Sharma praised the team's composure: \"We believed till the last ball. This is what Indian cricket is all about — never giving up.\""] },
  { id: 2,  category: "Sports",  emoji: "🏆", title: "Virat Kohli announces international retirement — a look back at his legacy",  source: "NDTV Sports",           time: "1d ago",  likes: 12453, comments: [{ id:1, user:"Rohit K.",  text:"80 centuries. Let that sink in. No one will ever match what he's done for Indian cricket.", time:"20h ago" },{ id:2, user:"Sunita V.", text:"Grew up watching him bat. This feels like the end of an era. Retirement well earned, King.", time:"18h ago" }], body: ["After 17 years and 278 international appearances, Virat Kohli has announced his retirement from all formats of international cricket.", "Kohli retires with 27,000+ international runs, 80 centuries, and three ICC trophies to his name.", "The BCCI has confirmed a farewell Test match at Eden Gardens, Kolkata next month."] },
  { id: 3,  category: "Tech",    emoji: "💻", title: "New AI model achieves breakthrough on reasoning benchmarks",                  source: "TechCrunch",           time: "3h ago",  likes: 1876,  comments: [{ id:1, user:"Dev A.",   text:"The chain-of-verification architecture is the real story here. This is a fundamentally different approach.", time:"2h ago" },{ id:2, user:"Kavya R.", text:"Near-perfect on ARC-AGI?! That benchmark was designed to be impossible for LLMs. Wild.", time:"1h ago" }], body: ["A newly released large language model has shattered existing records on the MATH, GPQA, and ARC-AGI benchmarks.", "Unlike previous models that relied on brute-force scaling, this system uses a novel 'chain-of-verification' architecture.", "Industry analysts predict this could accelerate AI deployment in medical diagnosis, legal research, and financial modelling."] },
  { id: 4,  category: "Tech",    emoji: "💻", title: "Google's quantum chip solves a problem in minutes that would take decades",   source: "Wired",                 time: "8h ago",  likes: 2341,  comments: [{ id:1, user:"Nikhil T.", text:"10 septillion years vs 4 minutes. The scale of that gap is genuinely difficult to comprehend.", time:"7h ago" },{ id:2, user:"Pooja M.", text:"The error-correction breakthrough is the real headline. Quantum has been stuck on that for 20 years.", time:"5h ago" }], body: ["Google's latest quantum processor, Willow 2, has completed a complex computational task in 4 minutes that would take the world's fastest classical supercomputer an estimated 10 septillion years.", "The chip operates at near absolute zero and uses 105 error-corrected qubits.", "Practical applications remain 5–10 years away, but experts say breakthroughs in drug discovery are now firmly within reach."] },
  { id: 5,  category: "Music",   emoji: "🎵", title: "Arijit Singh drops surprise new album — fans go wild",                        source: "Rolling Stone India",   time: "5h ago",  likes: 5621,  comments: [{ id:1, user:"Anjali D.", text:"Track 7 with AR Rahman had me in tears. The classical undertones are something else entirely.", time:"4h ago" },{ id:2, user:"Karan B.", text:"Stealth drop at midnight! Been streaming non-stop since. 'Roshni' is his best work yet.", time:"3h ago" }], body: ["Arijit Singh surprised millions of fans by dropping 'Roshni', a 14-track album with zero advance notice.", "The album blends classical ragas with contemporary production, featuring collaborations with A.R. Rahman, Pritam, and Grammy-winning producer Jack Antonoff.", "Within six hours of release, three tracks crossed 10 million streams on Spotify."] },
  { id: 6,  category: "Music",   emoji: "🎵", title: "Grammy nominations 2026 — who made the list and who was snubbed",             source: "Billboard",             time: "1d ago",  likes: 2187,  comments: [{ id:1, user:"Simran J.", text:"The Weeknd shut out AGAIN after one of his best albums is pure Recording Academy politics.", time:"22h ago" },{ id:2, user:"Rahul N.", text:"Diljit getting a Grammy nod is huge for Punjabi music globally. Absolutely deserved.", time:"20h ago" }], body: ["The Recording Academy unveiled the 2026 Grammy nominations and the music world immediately split.", "Beyoncé leads with 9 nominations including Album of the Year for her country crossover record.", "Notable snubs include Taylor Swift and The Weeknd, whose critically acclaimed LP was shut out entirely."] },
  { id: 7,  category: "Food",    emoji: "🍜", title: "10 street food dishes in Mumbai you must try this monsoon",                   source: "Food52",                time: "6h ago",  likes: 891,   comments: [{ id:1, user:"Priya S.",  text:"The keema pav at Sarvi is life-changing. Been going there since college. Nothing like it.", time:"5h ago" },{ id:2, user:"Aditya K.", text:"Dadar station bun maska at 7am is my personal religion.", time:"4h ago" }], body: ["Mumbai's street food scene transforms during the monsoon.", "Top picks include the bun maska at Kyani & Co, the keema pav at Sarvi in Byculla, and the legendary Schezwan dosa outside Dadar station.", "Budget around ₹500 for a full crawl."] },
  { id: 8,  category: "Food",    emoji: "🍜", title: "Scientists say eating these 5 foods daily boosts brain health significantly",  source: "Healthline",            time: "2d ago",  likes: 1432,  comments: [{ id:1, user:"Dr. Nisha", text:"As a neurologist I've been recommending this dietary pattern for years.", time:"1d ago" },{ id:2, user:"Vikram T.", text:"Added blueberries and walnuts to my breakfast. Dark chocolate is the easiest prescription ever.", time:"20h ago" }], body: ["A landmark 10-year study in Nature Medicine followed 60,000 adults and found daily consumption of five foods was associated with a 37% reduction in cognitive decline.", "The five foods: fatty fish, blueberries, leafy greens, walnuts, and dark chocolate.", "This isn't about any single superfood — it's about building a consistent dietary pattern."] },
  { id: 9,  category: "Travel",  emoji: "✈️", title: "The 8 most underrated monsoon destinations in India right now",              source: "Condé Nast Traveller", time: "4h ago",  likes: 743,   comments: [{ id:1, user:"Sneha R.",  text:"Majuli in monsoon is something else entirely. I went last August and it genuinely changed my life.", time:"3h ago" },{ id:2, user:"Tarun G.", text:"Chikmagalur gets overlooked every year. The waterfalls after the first rains are jaw-dropping.", time:"2h ago" }], body: ["While Goa and Coorg get all the monsoon attention, savvy travellers are discovering quieter destinations.", "Majuli in Assam transforms into an emerald dreamscape during the rains.", "Monsoon travel in India is cheapest between July and August, with flight prices dropping up to 40%."] },
  { id: 10, category: "Travel",  emoji: "✈️", title: "Japan overtakes France as the world's most visited country",                  source: "CNN Travel",            time: "12h ago", likes: 1129,  comments: [{ id:1, user:"Ananya M.", text:"Visited Kanazawa last spring — completely tourist-free and more beautiful than Kyoto.", time:"10h ago" },{ id:2, user:"Karthik P.", text:"The Kyoto tourist tax is controversial but honestly necessary.", time:"8h ago" }], body: ["For the first time in recorded history, Japan has surpassed France as the most visited country in the world.", "Tokyo, Kyoto, and Osaka remain top draws, but secondary destinations like Kanazawa are now appearing on mainstream itineraries.", "The surge has created tension in some communities — Kyoto has introduced a tourist tax."] },
  { id: 11, category: "Finance", emoji: "📈", title: "Sensex crosses 100,000 for the first time — what it means for retail investors", source: "Mint",                 time: "1h ago",  likes: 4521,  comments: [{ id:1, user:"CA Ramesh", text:"This is a moment but don't panic-buy. P/E of 28x means you're paying a premium. Stay in SIPs.", time:"45m ago" },{ id:2, user:"Deepa S.", text:"My SIP started at 35k Sensex is now sitting pretty.", time:"30m ago" }], body: ["India's BSE Sensex crossed the historic 100,000-point milestone today.", "For retail investors who started SIPs five years ago at the 50,000 level, the milestone represents a 100% return.", "Analysts urge caution — valuations are stretched at current levels."] },
  { id: 12, category: "Finance", emoji: "📈", title: "How to build an emergency fund in 6 months on any salary",                    source: "Economic Times",       time: "5h ago",  likes: 623,   comments: [{ id:1, user:"Amit J.",  text:"The 50-20-30 flip tip is underrated. Did this for 4 months and hit my 3-month target.", time:"4h ago" },{ id:2, user:"Ritu B.", text:"Wish someone had explained emergency funds to me at 22.", time:"3h ago" }], body: ["Surveys show 68% of Indians have less than one month of expenses saved.", "The 50-30-20 rule is a starting point, but temporarily flipping it to 50-20-30 can accelerate the fund dramatically.", "Keep your emergency fund in a liquid mutual fund, not a fixed deposit."] },
  { id: 13, category: "Health",  emoji: "🏃", title: "Why walking 7,000 steps — not 10,000 — is the new health target",             source: "The Lancet",           time: "3h ago",  likes: 2891,  comments: [{ id:1, user:"Dr. Priya", text:"Finally the science catches up to what many of us have been telling patients.", time:"2h ago" },{ id:2, user:"Sameer H.", text:"The fact that 10,000 was a marketing slogan this whole time is genuinely infuriating.", time:"1h ago" }], body: ["The 10,000-step goal was invented by a Japanese pedometer manufacturer in 1965 as a marketing slogan — there was never any scientific basis for it.", "A major 2025 meta-analysis established 7,000 steps as the optimal daily target.", "A 45-minute walk once a day achieves the target for most people."] },
  { id: 14, category: "Health",  emoji: "🏃", title: "Sleep deprivation is now classified as a public health crisis in India",       source: "Indian Journal of Medicine", time: "1d ago", likes: 1764, comments: [{ id:1, user:"Nidhi A.", text:"₹4.2 lakh crore in lost productivity and we're still glorifying 'hustle culture'.", time:"22h ago" },{ id:2, user:"Raj P.", text:"Cutting phone use an hour before bed literally changed my sleep quality within a week.", time:"20h ago" }], body: ["The ICMR has classified chronic sleep deprivation as a public health crisis after a nationwide survey found 53% of Indians sleep fewer than 6 hours a night.", "The economic cost is staggering: an estimated ₹4.2 lakh crore in lost productivity annually.", "Simple interventions like cutting screen time one hour before bed reduced sleep onset time by 27 minutes in trials."] },
  { id: 15, category: "Movies",  emoji: "🎬", title: "Pushpa 3 breaks Day 1 box office record with ₹200 crore worldwide",           source: "Box Office India",      time: "2h ago",  likes: 8932,  comments: [{ id:1, user:"Suresh K.",  text:"Watched the 6AM show. The third act is something Indian cinema has never done before.", time:"1h ago" },{ id:2, user:"Lavanya T.", text:"₹200cr on Day 1. Tollywood has permanently changed the game.", time:"45m ago" }], body: ["Allu Arjun's Pushpa 3: The Rampage has shattered every Indian box office record, collecting ₹200 crore globally on its opening day.", "The film released simultaneously in five languages across 12,000 screens in India.", "Director Sukumar said the third act alone took 14 months to film."] },
  { id: 16, category: "Movies",  emoji: "🎬", title: "Christopher Nolan's next film set in ancient India — details revealed",       source: "Variety",               time: "6h ago",  likes: 3217,  comments: [{ id:1, user:"Ishaan M.", text:"Nolan doing the Ashoka story with IMAX cameras is genuinely historic.", time:"5h ago" },{ id:2, user:"Fatima R.", text:"200 historians as consultants — that kind of commitment to authenticity is why Nolan's films matter.", time:"4h ago" }], body: ["Christopher Nolan has confirmed his next film is an epic set during the Maurya Empire in 300 BCE.", "The film will be shot in IMAX and feature a cast split equally between Hollywood and Bollywood stars.", "Release is targeted for Diwali 2027."] },
  { id: 17, category: "Science", emoji: "🔬", title: "NASA confirms discovery of liquid water ocean beneath Mars's surface",          source: "Nature",                time: "1h ago",  likes: 15632, comments: [{ id:1, user:"Prof. Sunil", text:"I've been studying Mars for 25 years and I never thought I'd see this confirmed in my lifetime.", time:"50m ago" },{ id:2, user:"Zara K.", text:"Conditions that could support microbial life. Let that sink in.", time:"30m ago" }], body: ["NASA's Perseverance rover has confirmed the existence of a liquid water ocean 15 kilometres beneath the Martian south pole.", "The water is kept liquid by geothermal heat from Mars's still-active core.", "A dedicated sample-return mission targeting the region is now being fast-tracked for a 2031 launch."] },
  { id: 18, category: "Science", emoji: "🔬", title: "Scientists reverse ageing in human cells by 30 years in lab breakthrough",     source: "MIT Technology Review", time: "4h ago",  likes: 9841,  comments: [{ id:1, user:"Dr. Ananya", text:"The fact that the cells retain their specialised function is the key.", time:"3h ago" },{ id:2, user:"Vivek S.", text:"$8 billion in biotech valuations overnight tells you everything about how seriously the industry is taking this.", time:"2h ago" }], body: ["Researchers at Harvard Medical School have successfully reversed the biological age of human cells by approximately 30 years.", "The technique avoids the key risk of previous methods: cells do not lose their specialised function.", "'We are talking about adding healthy years to life,' the lead researcher said."] },
  { id: 19, category: "Gaming",  emoji: "🎮", title: "GTA VI sells 10 million copies in 24 hours — breaks all records",              source: "IGN",                   time: "2h ago",  likes: 11234, comments: [{ id:1, user:"Rohan G.", text:"1000 players in one server is the most ambitious multiplayer design ever attempted.", time:"1h ago" },{ id:2, user:"Tanya M.", text:"$2 billion to develop and it shows. Every frame looks like a photograph.", time:"45m ago" }], body: ["Grand Theft Auto VI has sold 10 million copies within its first 24 hours, generating $900 million in revenue.", "Set in a fictional Miami, the game features the first female protagonist in GTA's mainline series.", "Rockstar spent 12 years and an estimated $2 billion developing GTA VI."] },
  { id: 20, category: "Gaming",  emoji: "🎮", title: "India's esports team wins the BGMI World Championship — a historic first",    source: "Sportskeeda",          time: "8h ago",  likes: 4127,  comments: [{ id:1, user:"Akash P.", text:"Mortal eliminating 4 players with a pan in the grand final is the greatest esports moment India has ever produced.", time:"7h ago" },{ id:2, user:"Divya N.", text:"₹200cr government investment in esports infrastructure is finally coming.", time:"6h ago" }], body: ["Team Soul has won the BGMI World Championship in Seoul, defeating South Korea's DRX in a nail-biting grand final.", "Captain Mortal was named MVP for a stunning final round where he eliminated four opponents single-handedly.", "India's esports industry has grown from near-zero to a $300 million market in five years."] },
];

const AD_CATALOG = {
  Sports:  { emoji:"🏏", badge:"Sports & Outdoors",       name:"SS Ton Master Edition Cricket Bat — Full Size",          tagline:"Professional-grade English willow. Perfect weight balance for power hitting.", price:"₹4,299", originalPrice:"₹5,999", discount:"28% off", rating:4.5, reviews:"2,847",  tag:"Best Seller in Cricket Bats" },
  Tech:    { emoji:"🎧", badge:"Electronics",             name:"boAt Airdopes 191G True Wireless Gaming Earbuds",        tagline:"32Hr total battery · Beast Mode gaming · ENx noise cancellation for calls.",    price:"₹1,299", originalPrice:"₹2,990", discount:"57% off", rating:4.3, reviews:"18,421", tag:"#1 Best Seller in Earbuds" },
  Music:   { emoji:"🎹", badge:"Musical Instruments",     name:"Yamaha PSR-E373 61-Key Portable Keyboard",               tagline:"622 voices · Built-in lessons · Headphone jack for silent practice.",             price:"₹8,990", originalPrice:"₹11,490",discount:"22% off", rating:4.6, reviews:"3,112",  tag:"Amazon's Choice for Keyboards" },
  Food:    { emoji:"🍟", badge:"Kitchen & Home Appliances",name:"Philips HD9252/90 Digital Air Fryer — 4.1L",             tagline:"Rapid Air technology · Up to 90% less fat · Digital touch panel.",               price:"₹6,995", originalPrice:"₹9,995", discount:"30% off", rating:4.4, reviews:"12,567", tag:"Best Seller in Air Fryers" },
  Travel:  { emoji:"🧳", badge:"Luggage & Travel Gear",   name:"American Tourister Linex 68cm 4-Wheel Spinner",          tagline:"TSA-approved lock · 10-year warranty · Weighs just 2.9 kg.",                   price:"₹5,299", originalPrice:"₹8,500", discount:"38% off", rating:4.5, reviews:"7,834",  tag:"Amazon's Choice for Suitcases" },
  Finance: { emoji:"📗", badge:"Books · Personal Finance", name:"The Psychology of Money — Morgan Housel (Paperback)",    tagline:"Timeless lessons on wealth, greed and happiness. India's #1 money book.",       price:"₹299",   originalPrice:"₹599",   discount:"50% off", rating:4.7, reviews:"43,291", tag:"#1 Best Seller in Investing" },
  Health:  { emoji:"🧘", badge:"Sports, Fitness & Outdoors",name:"Boldfit Pro Yoga Mat — Anti-Slip, Extra Thick 6mm",    tagline:"High-density foam · Carry strap included · Ideal for yoga & pilates.",          price:"₹799",   originalPrice:"₹1,499", discount:"47% off", rating:4.3, reviews:"9,214",  tag:"Amazon's Choice for Yoga Mats" },
  Movies:  { emoji:"📺", badge:"Electronics · Televisions",name:"Mi 55\" 4K Ultra HD Smart Android TV — X Series",       tagline:"Dolby Vision & Atmos · 30W speaker · Android 11 with Google Assistant.",       price:"₹34,999",originalPrice:"₹44,999",discount:"22% off", rating:4.4, reviews:"28,104", tag:"Best Seller in Smart TVs" },
  Science: { emoji:"🔭", badge:"Telescopes & Optics",      name:"Celestron PowerSeeker 127EQ Reflector Telescope",        tagline:"127mm aperture · Includes 3 eyepieces · View planets, moon & star clusters.",  price:"₹12,499",originalPrice:"₹16,000",discount:"22% off", rating:4.2, reviews:"1,823",  tag:"Amazon's Choice for Telescopes" },
  Gaming:  { emoji:"🎮", badge:"PC & Console Gaming",      name:"HyperX Cloud II Wired Gaming Headset — 7.1 Surround",    tagline:"53mm drivers · Noise-cancelling detachable mic · PC, PS & Xbox compatible.",  price:"₹7,490", originalPrice:"₹10,990",discount:"32% off", rating:4.5, reviews:"15,672", tag:"#1 Best Seller in Gaming Headsets" },
};

const GLASS_CARD = { background: "rgba(255,255,255,0.10)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.16)" };

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
  } catch { return "Recently"; }
}

function cleanContent(text = "") {
  return text.replace(/\[\+\d+ chars\]$/, "").trim();
}

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
    title:    (result.title || "Untitled").replace(/ - [^-]+$/, ""),
    source:   result.source_name || result.source_id || "News",
    time:     result.pubDate ? timeAgo(result.pubDate) : "Recently",
    likes:    Math.floor(Math.random() * 4000) + 200,
    comments: [],
    body,
    url:      result.link || null,
    isLive:   true,
  };
}

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
          <defs><linearGradient id="partial"><stop offset={`${partial * 100}%`} stopColor="currentColor"/><stop offset={`${partial * 100}%`} stopColor="rgba(255,255,255,0.2)"/></linearGradient></defs>
          <path fill="url(#partial)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} className="w-3 h-3 text-white/20" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={GLASS_CARD}>
      <div className="px-4 py-2 border-b" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.10)" }}>
        <div className="h-4 rounded-full w-24" style={{ background: "rgba(255,255,255,0.10)" }} />
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="h-3.5 rounded-full w-11/12" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="h-3.5 rounded-full w-8/12"  style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="h-3   rounded-full w-1/3"   style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
      <div className="px-4 pb-3 flex gap-2">
        <div className="h-7 rounded-full w-16" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="h-7 rounded-full w-16" style={{ background: "rgba(255,255,255,0.08)" }} />
      </div>
    </div>
  );
}

export default function FeedScreen({ userInterests = ["Sports", "Tech", "Music"], onArticleClick, onLogout }) {
  const [engagement,   setEngagement]   = useState({});
  const [hidden,       setHidden]       = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("All");
  const [liveArticles, setLiveArticles] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [isLiveMode,   setIsLiveMode]   = useState(false);
  const [fetchError,   setFetchError]   = useState("");

  const fetchLiveNews = useCallback(async () => {
    if (!NEWSDATA_API_KEY) return;
    const reverseMap = {};
    const apiCats    = [];
    for (const interest of userInterests) {
      const meta = CATEGORY_MAP[interest];
      if (meta?.apiCat && !reverseMap[meta.apiCat]) {
        reverseMap[meta.apiCat] = interest;
        apiCats.push(meta.apiCat);
      }
    }
    if (apiCats.length === 0) return;
    setLoading(true);
    setFetchError("");
    try {
      const url  = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&category=${apiCats.join(",")}&language=en&size=10`;
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`NewsData.io returned ${res.status}`);
      const data = await res.json();
      if (data.status !== "success" || !Array.isArray(data.results)) throw new Error(data.message || "Unexpected API response");
      const mapped = [];
      data.results.forEach((result, idx) => {
        const apiCat     = Array.isArray(result.category) ? result.category.find((c) => reverseMap[c]) : null;
        const curatedCat = apiCat ? reverseMap[apiCat] : null;
        if (!curatedCat || !result.title) return;
        mapped.push(mapLiveArticle(result, curatedCat, idx));
      });
      const unsupportedInterests = userInterests.filter((i) => !CATEGORY_MAP[i]?.apiCat);
      const mockFallback         = ALL_ARTICLES.filter((a) => unsupportedInterests.includes(a.category));
      const combined             = [...mapped, ...mockFallback];
      if (combined.length > 0) { setLiveArticles(combined); setIsLiveMode(true); }
    } catch (err) {
      console.error("NewsData.io fetch failed:", err);
      setFetchError(err.message || "Could not load live news.");
    } finally {
      setLoading(false);
    }
  }, [userInterests]);

  useEffect(() => { fetchLiveNews(); }, [fetchLiveNews]);

  const interestSet  = new Set(userInterests);
  const baseArticles = isLiveMode ? liveArticles : ALL_ARTICLES;

  const visibleFeed = baseArticles.filter((item) => {
    if (hidden.has(item.id))                                      return false;
    if (!interestSet.has(item.category))                          return false;
    if (activeFilter !== "All" && item.category !== activeFilter) return false;
    return true;
  });

  const handleLike = (id, e) => {
    e.stopPropagation();
    setEngagement((prev) => ({ ...prev, [id]: "liked" }));
  };

  const handleSkip = (id, e) => {
    e.stopPropagation();
    setEngagement((prev) => ({ ...prev, [id]: "skipped" }));
    setTimeout(() => setHidden((prev) => new Set([...prev, id])), 400);
  };

  const AdBanner = ({ category }) => {
    const ad = AD_CATALOG[category] || AD_CATALOG["Tech"];
    return (
      <div className="rounded-2xl overflow-hidden" style={GLASS_CARD}>
        <div className="flex items-center justify-between px-4 pt-3 pb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
          <span className="text-[10px] text-white/35 font-medium tracking-wide uppercase">Sponsored</span>
          <span className="text-[10px] text-white/35">{ad.badge}</span>
        </div>
        <div className="px-4 py-3 flex gap-3">
          <div className="w-20 h-20 flex-shrink-0 rounded-xl flex items-center justify-center text-3xl"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
            {ad.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block text-[10px] font-semibold text-[#FF9900] px-2 py-0.5 rounded mb-1"
              style={{ background: "rgba(255,153,0,0.15)" }}>{ad.tag}</span>
            <p className="text-xs font-semibold text-white/90 leading-snug line-clamp-2">{ad.name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <StarRating rating={ad.rating} />
              <span className="text-[10px] text-cyan-300/70">{ad.reviews} ratings</span>
            </div>
            <p className="text-[10px] text-white/45 mt-1 line-clamp-2">{ad.tagline}</p>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-sm font-bold text-white">{ad.price}</span>
              <span className="text-[10px] text-white/30 line-through">{ad.originalPrice}</span>
              <span className="text-[10px] font-semibold text-emerald-400">{ad.discount}</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-3">
          <a href={`https://www.amazon.in/s?k=${encodeURIComponent(ad.name)}`} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 w-full py-2 text-white text-xs font-semibold rounded-xl transition-colors"
            style={{ background: "linear-gradient(135deg,#FF9900,#e68a00)" }}>
            Shop on Amazon →
          </a>
        </div>
      </div>
    );
  };

  const filters = ["All", ...userInterests];

  return (
    <div className="relative min-h-screen">
      {/* Fixed aurora background */}
      <div className="fixed inset-0 -z-10" style={{ background: "linear-gradient(135deg,#1E2A6E 0%,#2D1B69 30%,#0F8A8D 70%,#06B6D4 100%)" }} />
      <div className="fixed top-[-80px] left-[-80px] w-80 h-80 rounded-full pointer-events-none -z-10" style={{ background: "radial-gradient(circle,rgba(192,132,252,.4),transparent 70%)", filter: "blur(50px)" }} />
      <div className="fixed bottom-[-60px] right-[-60px] w-96 h-96 rounded-full pointer-events-none -z-10" style={{ background: "radial-gradient(circle,rgba(249,115,22,.25),transparent 70%)", filter: "blur(50px)" }} />

      {/* Sticky header */}
      <header className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between"
        style={{ background: "rgba(30,42,110,0.60)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-white tracking-wide">Curated.ai</h1>
          {isLiveMode ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ background: "linear-gradient(135deg,#C084FC,#0F8A8D)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" /> LIVE
            </span>
          ) : (
            <span className="text-[10px] font-medium text-white/35 px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}>
              DEMO
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isLiveMode && (
            <button onClick={fetchLiveNews} disabled={loading}
              className="text-white/50 hover:text-white text-base disabled:opacity-30 transition-colors" title="Refresh headlines">
              🔄
            </button>
          )}
          <button className="text-white/50 hover:text-white text-lg transition-colors">🔍</button>
          <button onClick={onLogout}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg,#C084FC,#0F8A8D)" }} title="Sign out">
            M
          </button>
        </div>
      </header>

      {/* Notices */}
      {!NEWSDATA_API_KEY && (
        <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl flex items-start gap-2"
          style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)" }}>
          <span className="text-amber-300 text-sm mt-0.5">ℹ️</span>
          <p className="text-xs text-amber-200/80 leading-relaxed">
            <span className="font-semibold">Demo mode.</span> Add your free NewsData.io API key to{" "}
            <code className="px-1 rounded text-amber-300" style={{ background: "rgba(251,191,36,0.15)" }}>FeedScreen.jsx</code> line 3 to load live headlines.
          </p>
        </div>
      )}
      {fetchError && (
        <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl flex items-start gap-2"
          style={{ background: "rgba(251,113,133,0.12)", border: "1px solid rgba(251,113,133,0.25)" }}>
          <span className="text-rose-300 text-sm mt-0.5">⚠️</span>
          <p className="text-xs text-rose-200/80">
            <span className="font-semibold">Could not load live news.</span> Showing demo articles.{" "}
            <span className="text-white/30">({fetchError})</span>
          </p>
        </div>
      )}

      {/* Filter chips */}
      <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={activeFilter === f
              ? { background: "linear-gradient(135deg,#C084FC,#0F8A8D)", color: "#fff", boxShadow: "0 2px 12px rgba(192,132,252,0.4)" }
              : { background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.65)" }
            }>
            {f}
          </button>
        ))}
      </div>

      {/* Feed title */}
      <div className="px-4 pt-2 pb-1">
        <h2 className="text-base font-bold text-white">Your Feed</h2>
        <p className="text-xs text-white/35">
          {activeFilter === "All"
            ? `Showing all ${userInterests.join(", ")} stories`
            : `Showing ${activeFilter} stories`}
        </p>
      </div>

      {/* Main content */}
      <main className="px-4 pb-28 space-y-3 mt-2">
        {loading && <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>}

        {!loading && visibleFeed.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-sm font-medium text-white/70">You're all caught up!</p>
            <p className="text-xs mt-1 text-white/35">Check back later for new content.</p>
          </div>
        )}

        {!loading && visibleFeed.map((article, index) => {
          const state = engagement[article.id];
          return (
            <div key={article.id}>
              {index > 0 && index % 3 === 0 && <AdBanner category={visibleFeed[index - 1].category} />}
              <div
                onClick={() => onArticleClick(article)}
                className="rounded-2xl overflow-hidden cursor-pointer transition-all"
                style={{
                  ...GLASS_CARD,
                  ...(state === "liked"   ? { boxShadow: "0 0 0 2px rgba(192,132,252,0.6)" } : {}),
                  ...(state === "skipped" ? { opacity: 0.35 } : {}),
                }}
              >
                {/* Category strip */}
                <div className="px-4 py-2 flex items-center justify-between"
                  style={{ background: "rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{article.emoji}</span>
                    <span className="text-xs font-bold uppercase tracking-wide text-white/75">{article.category}</span>
                  </div>
                  {article.isLive && (
                    <span className="flex items-center gap-1 text-[9px] text-white/35">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" /> live
                    </span>
                  )}
                </div>

                {/* Title + source */}
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-white/90 leading-snug">{article.title}</p>
                  <p className="mt-1 text-xs text-white/35">{article.source} · {article.time}</p>
                </div>

                {/* Actions */}
                <div className="px-4 pb-3 flex items-center gap-3">
                  <button onClick={(e) => handleLike(article.id, e)} disabled={!!state}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all disabled:cursor-default"
                    style={state === "liked"
                      ? { background: "linear-gradient(135deg,#C084FC,#0F8A8D)", color: "#fff" }
                      : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.55)" }
                    }>
                    👍 {state === "liked" ? "Liked!" : "Like"}
                  </button>
                  <button onClick={(e) => handleSkip(article.id, e)} disabled={!!state}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all disabled:cursor-default"
                    style={state === "skipped"
                      ? { background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }
                      : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.55)" }
                    }>
                    ⏭ Skip
                  </button>
                  <span className="ml-auto text-xs text-white/25">Read more →</span>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-3 z-20"
        style={{ background: "rgba(20,30,80,0.75)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        {[
          { icon: "🏠", label: "Feed",    active: true  },
          { icon: "🔍", label: "Explore", active: false },
          { icon: "🔖", label: "Saved",   active: false },
          { icon: "👤", label: "Profile", active: false },
        ].map(({ icon, label, active }) => (
          <button key={label}
            className="flex flex-col items-center gap-0.5 transition-colors"
            style={{ color: active ? "#C084FC" : "rgba(255,255,255,0.35)" }}>
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
