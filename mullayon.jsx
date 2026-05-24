import { useState, useEffect, useRef } from "react";

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  green: "#0A6640",
  greenLight: "#12A058",
  greenGlow: "#16C068",
  gold: "#F5A623",
  goldLight: "#FFD166",
  bg: "#F4F6F2",
  white: "#FFFFFF",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  red: "#DC2626",
  redLight: "#FEF2F2",
  blue: "#1D4ED8",
  blueLight: "#EFF6FF",
  purple: "#7C3AED",
  purpleLight: "#F5F3FF",
  dark: "#0F172A",
};

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Tiro+Bangla:ital@0;1&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { font-family: 'Hind Siliguri', sans-serif; background: ${C.bg}; color: ${C.text}; }
  ::-webkit-scrollbar { width: 4px; } 
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
  @keyframes slideRight { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ripple { 0%{transform:scale(0);opacity:0.6} 100%{transform:scale(4);opacity:0} }
  @keyframes streakPulse { 0%,100%{box-shadow:0 0 0 0 rgba(245,166,35,0.4)} 50%{box-shadow:0 0 0 8px rgba(245,166,35,0)} }

  .fade-up { animation: fadeUp 0.35s ease forwards; }
  .fade-in { animation: fadeIn 0.25s ease forwards; }
  .card-hover { transition: all 0.2s ease; cursor:pointer; }
  .card-hover:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.10); }
  .btn-press:active { transform:scale(0.97); }
  .nav-btn { transition: all 0.2s ease; }
  .nav-btn:hover { background: rgba(10,102,64,0.08) !important; }
  .shimmer-bg {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
`;

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const SUBJECTS = [
  { icon: "অ!", name: "বাংলা ১ম পত্র", color: "#0A6640", bg: "#ECFDF5" },
  { icon: "অ", name: "বাংলা ২য় পত্র", color: "#0A6640", bg: "#ECFDF5" },
  { icon: "Aa", name: "English 1st", color: "#1D4ED8", bg: "#EFF6FF" },
  { icon: "Aa", name: "English 2nd", color: "#1D4ED8", bg: "#EFF6FF" },
  { icon: "π", name: "গণিত", color: "#7C3AED", bg: "#F5F3FF" },
  { icon: "∫", name: "উচ্চতর গণিত", color: "#7C3AED", bg: "#F5F3FF" },
  { icon: "⚡", name: "পদার্থবিজ্ঞান", color: "#D97706", bg: "#FFFBEB" },
  { icon: "⚗️", name: "রসায়ন", color: "#DC2626", bg: "#FEF2F2" },
  { icon: "🧬", name: "জীববিজ্ঞান", color: "#059669", bg: "#ECFDF5" },
  { icon: "🌏", name: "ভূগোল", color: "#0891B2", bg: "#ECFEFF" },
  { icon: "🕌", name: "ইসলাম শিক্ষা", color: "#0A6640", bg: "#ECFDF5" },
  { icon: "💻", name: "আইসিটি", color: "#4338CA", bg: "#EEF2FF" },
];

const CHAPTERS = {
  default: [
    "অধ্যায় ১: মূল ধারণা ও পরিচিতি",
    "অধ্যায় ২: মূল নীতিমালা",
    "অধ্যায় ৩: প্রয়োগ ও বিশ্লেষণ",
    "অধ্যায় ৪: সমস্যা সমাধান",
    "অধ্যায় ৫: উন্নত বিষয়াবলী",
  ],
};

const MCQ_BANK = [
  { q: "আলোর প্রতিসরণের সূত্র কয়টি?", o: ["১টি", "২টি", "৩টি", "৪টি"], a: 1 },
  { q: "বলের SI একক কোনটি?", o: ["ওয়াট", "জুল", "নিউটন", "প্যাসকেল"], a: 2 },
  { q: "পানির সর্বোচ্চ ঘনত্ব কত ডিগ্রি সেলসিয়াসে?", o: ["0°C", "4°C", "100°C", "−4°C"], a: 1 },
  { q: "মানবদেহের স্বাভাবিক তাপমাত্রা কত?", o: ["36°C", "37°C", "38°C", "39°C"], a: 1 },
  { q: "কোষের শক্তিঘর কাকে বলে?", o: ["নিউক্লিয়াস", "রাইবোসোম", "মাইটোকন্ড্রিয়া", "ক্লোরোপ্লাস্ট"], a: 2 },
];

const LEADERBOARD_INIT = [
  { name: "সাজিদ মাহমুদ", score: 247, school: "ঢাকা রেসিডেন্সিয়াল", streak: 14, medal: "🥇" },
  { name: "তাসনিম আরা", score: 189, school: "ভিকারুননিসা", streak: 9, medal: "🥈" },
  { name: "রাফি হাসান", score: 156, school: "রাজউক উত্তরা", streak: 7, medal: "🥉" },
  { name: "মিথিলা চৌধুরী", score: 134, school: "মতিঝিল আইডিয়াল", streak: 5, medal: "4" },
  { name: "আরিফ হোসেন", score: 98, school: "ক্যান্টনমেন্ট কলেজ", streak: 3, medal: "5" },
];

const COMMUNITY_POSTS_INIT = [
  {
    id: 1, user: "সাজিদ মাহমুদ", avatar: "স", time: "২ মিনিট আগে",
    text: "আজকের পদার্থবিজ্ঞান মক পরীক্ষায় ৪৮/৫০ পেয়েছি! 🎉 সবাই প্র্যাকটিস করো।",
    likes: 24, comments: [
      { user: "তাসনিম", text: "অসাধারণ! কোন অধ্যায়ে বেশি মনোযোগ দিয়েছিলে?" },
      { user: "রাফি", text: "Mashallah ভাই! 💪" }
    ], shares: 5
  },
  {
    id: 2, user: "তাসনিম আরা", avatar: "ত", time: "১৫ মিনিট আগে",
    text: "রসায়নের ৩য় অধ্যায়ের নোট শেয়ার করলাম। সবাই দেখো! 📚",
    likes: 41, comments: [
      { user: "মিথিলা", text: "ধন্যবাদ আপু! অনেক কাজে আসবে।" }
    ], shares: 12
  },
  {
    id: 3, user: "আরিফ হোসেন", avatar: "আ", time: "৩০ মিনিট আগে",
    text: "কেউ কি গণিতের ৫ম অধ্যায়ে সাহায্য করতে পারবে? বুঝতে পারছি না।",
    likes: 8, comments: [], shares: 1
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 40, color = C.green }) => {
  const letter = name ? name[0] : "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, ${C.greenGlow})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.4,
      flexShrink: 0, fontFamily: "'Hind Siliguri', sans-serif",
      boxShadow: `0 2px 8px ${color}40`
    }}>{letter}</div>
  );
};

const Badge = ({ text, color = C.green, bg }) => (
  <span style={{
    background: bg || `${color}18`, color, padding: "3px 10px",
    borderRadius: 20, fontSize: 11, fontWeight: 600
  }}>{text}</span>
);

const GreenBtn = ({ text, onClick, full, small, outline, red }) => (
  <button onClick={onClick} className="btn-press" style={{
    width: full ? "100%" : "auto",
    padding: small ? "10px 20px" : "14px 28px",
    background: outline ? "transparent" : red ? C.red : `linear-gradient(135deg, ${C.green}, ${C.greenLight})`,
    color: outline ? C.green : "#fff",
    border: outline ? `2px solid ${C.green}` : "none",
    borderRadius: 14, fontWeight: 700, fontSize: small ? 13 : 15,
    cursor: "pointer", fontFamily: "'Hind Siliguri', sans-serif",
    boxShadow: outline || red ? "none" : `0 4px 16px ${C.green}40`,
    transition: "all 0.2s", letterSpacing: 0.3,
  }}>{text}</button>
);

const Card = ({ children, style, onClick, className }) => (
  <div onClick={onClick} className={className} style={{
    background: C.white, borderRadius: 18,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    border: `1px solid ${C.border}`, ...style
  }}>{children}</div>
);

// ── SCREENS ───────────────────────────────────────────────────────────────────

// SPLASH
const SplashScreen = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      height: "100vh", background: `linear-gradient(160deg, ${C.dark} 0%, ${C.green} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20
    }}>
      <div style={{ animation: "bounce 1.5s infinite" }}>
        <div style={{
          width: 100, height: 100, borderRadius: 28,
          background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, border: "2px solid rgba(255,255,255,0.3)"
        }}>📊</div>
      </div>
      <div style={{ textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 1, fontFamily: "'Tiro Bangla', serif" }}>মূল্যায়ন</div>
        <div style={{ fontSize: 14, opacity: 0.7, marginTop: 6, letterSpacing: 3, textTransform: "uppercase" }}>Your Learning Companion</div>
      </div>
      <div style={{ marginTop: 20 }}>
        <div style={{ width: 160, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            width: "60%", height: "100%", borderRadius: 2,
            background: C.gold, animation: "shimmer 1.5s infinite",
            backgroundSize: "200% 100%"
          }} />
        </div>
      </div>
    </div>
  );
};

// REGISTRATION P1
const RegP1 = ({ onNext }) => {
  const [name, setName] = useState("");
  const [num, setNum] = useState("");
  const proceed = () => { if (name.trim() && num.trim()) onNext({ name, number: num }); };

  return (
    <div className="fade-up" style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${C.dark} 0%, #0F2A1A 100%)`, padding: "60px 24px 40px", display: "flex", flexDirection: "column" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>👋</div>
        <div style={{ color: "#fff", fontSize: 28, fontWeight: 800, fontFamily: "'Tiro Bangla', serif" }}>মূল্যায়নে স্বাগতম!</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 8 }}>তোমার যাত্রা শুরু করো আজই</div>
      </div>

      <Card style={{ padding: 24, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>তোমার নাম</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="পুরো নাম লিখুন"
            style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#fff", fontSize: 15, fontFamily: "'Hind Siliguri', sans-serif", outline: "none" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>মোবাইল নম্বর</label>
          <input value={num} onChange={e => setNum(e.target.value)} placeholder="01xxxxxxxxx" type="tel"
            style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#fff", fontSize: 15, fontFamily: "'Hind Siliguri', sans-serif", outline: "none" }} />
        </div>
        <GreenBtn text="এগিয়ে যাও →" onClick={proceed} full />
      </Card>

      <div style={{ marginTop: "auto", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 12, paddingTop: 32 }}>
        তোমার তথ্য সম্পূর্ণ নিরাপদ ও এনক্রিপ্টেড 🔒
      </div>
    </div>
  );
};

// REGISTRATION P2
const RegP2 = ({ onNext }) => {
  const [cls, setCls] = useState("SSC-2026");
  const [school, setSchool] = useState("");
  const [group, setGroup] = useState("বিজ্ঞান");
  const [zila, setZila] = useState("ঢাকা");

  const classes = ["SSC-2026", "SSC-2027", "SSC-2028", "ক্লাস ৯", "ক্লাস ১০"];
  const groups = ["বিজ্ঞান", "বাণিজ্য", "মানবিক"];
  const zilas = ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "সিলেট", "বরিশাল", "রংপুর", "ময়মনসিংহ"];

  return (
    <div className="fade-up" style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${C.dark} 0%, #0F2A1A 100%)`, padding: "50px 24px 40px" }}>
      <div style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 8, fontFamily: "'Tiro Bangla', serif" }}>তোমার পরিচয়</div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 28 }}>ধাপ ২/২ — শিক্ষা প্রতিষ্ঠানের তথ্য</div>

      {[
        { label: "ব্যাচ / শ্রেণি", val: cls, set: setCls, opts: classes },
        { label: "বিভাগ", val: group, set: setGroup, opts: groups },
        { label: "জেলা", val: zila, set: setZila, opts: zilas },
      ].map(({ label, val, set, opts }) => (
        <div key={label} style={{ marginBottom: 16 }}>
          <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
          <select value={val} onChange={e => set(e.target.value)} style={{
            width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.08)",
            border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#fff",
            fontSize: 14, fontFamily: "'Hind Siliguri', sans-serif", appearance: "none",
          }}>
            {opts.map(o => <option key={o} value={o} style={{ background: C.dark }}>{o}</option>)}
          </select>
        </div>
      ))}

      <div style={{ marginBottom: 24 }}>
        <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>বিদ্যালয়ের নাম</label>
        <input value={school} onChange={e => setSchool(e.target.value)} placeholder="বিদ্যালয়ের নাম লিখুন"
          style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#fff", fontSize: 14, fontFamily: "'Hind Siliguri', sans-serif", outline: "none" }} />
      </div>

      <GreenBtn text="শুরু করি! 🚀" onClick={() => onNext({ class: cls, school, group, zila })} full />
    </div>
  );
};

// WELCOME MODAL
const WelcomeModal = ({ name, onStart }) => (
  <div className="fade-in" style={{
    minHeight: "100vh", background: `linear-gradient(160deg, ${C.green} 0%, ${C.dark} 100%)`,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32
  }}>
    <div style={{ animation: "bounce 2s infinite", fontSize: 80, marginBottom: 24 }}>🎉</div>
    <div style={{ textAlign: "center", color: "#fff", marginBottom: 32 }}>
      <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Tiro Bangla', serif", marginBottom: 12 }}>স্বাগতম, {name}!</div>
      <div style={{ fontSize: 15, opacity: 0.8, lineHeight: 1.8 }}>মূল্যায়ন পরিবারে তোমাকে স্বাগত জানাই।<br />এখন থেকে তোমার লক্ষ্য অর্জনের পথচলা শুরু।</div>
    </div>
    <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
      {["🎯 লক্ষ্য নির্ধারণ", "📈 প্রোগ্রেস ট্র্যাক", "🏆 লিডারবোর্ড"].map(t => (
        <div key={t} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 12, fontWeight: 600, textAlign: "center" }}>{t}</div>
      ))}
    </div>
    <GreenBtn text="চলো শুরু করি! →" onClick={onStart} full />
  </div>
);

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
const HomePage = ({ user, leaderboard, onNav, onLogoClick }) => {
  const [tab, setTab] = useState("home");

  return (
    <div className="fade-up" style={{ paddingBottom: 8 }}>
      {/* Top Bar */}
      <div style={{
        background: `linear-gradient(135deg, ${C.dark} 0%, ${C.green} 100%)`,
        padding: "20px 20px 28px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", top: 20, right: 20, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={onLogoClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📊</div>
              <span style={{ color: "#fff", fontSize: 20, fontWeight: 800, fontFamily: "'Tiro Bangla', serif" }}>মূল্যায়ন</span>
            </div>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "rgba(255,100,100,0.2)", borderRadius: 20, padding: "5px 12px", display: "flex", alignItems: "center", gap: 5, animation: user.streak > 0 ? "streakPulse 2s infinite" : "none" }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <span style={{ color: "#FFD166", fontWeight: 700, fontSize: 14 }}>{user.streak}</span>
            </div>
            <Avatar name={user.name} size={38} />
          </div>
        </div>

        <div style={{ color: "#fff" }}>
          <div style={{ fontSize: 13, opacity: 0.7 }}>আজকে কি পড়াশোনা করেছ?</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2, fontFamily: "'Tiro Bangla', serif" }}>নমস্কার, {user.name.split(" ")[0]}! 👋</div>
        </div>

        {/* Stats Strip */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {[
            { label: "পয়েন্ট", val: user.score.toFixed(1), icon: "⭐" },
            { label: "পরীক্ষা", val: user.testsGiven, icon: "📝" },
            { label: "স্ট্রিক", val: user.streak, icon: "🔥" }
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 0", textAlign: "center",
              backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)"
            }}>
              <div style={{ fontSize: 16 }}>{s.icon}</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>{s.val}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {/* Premium Banner */}
        <div style={{
          background: `linear-gradient(135deg, #0A192F 0%, #1a3a2a 100%)`,
          borderRadius: 18, padding: "16px 20px", marginBottom: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          border: "1px solid rgba(245,166,35,0.2)"
        }}>
          <div>
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>⚡ প্রিমিয়াম</div>
            <div style={{ color: "#fff", fontSize: 14, marginTop: 4, opacity: 0.9 }}>সীমাহীন চর্চার সুযোগ নাও</div>
          </div>
          <button style={{ background: C.gold, color: C.dark, border: "none", borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'Hind Siliguri', sans-serif" }}>আপগ্রেড</button>
        </div>

        {/* Quick Actions */}
        <div style={{ fontSize: 14, fontWeight: 700, color: C.muted, marginBottom: 12, letterSpacing: 0.5, textTransform: "uppercase" }}>দ্রুত শুরু করো</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { icon: "📦", label: "প্রশ্নব্যাংক", color: "#FFFBEB", border: "#FDE68A", nav: "bank" },
            { icon: "⚡", label: "দ্রুত প্র্যাকটিস", color: "#ECFDF5", border: "#A7F3D0", nav: "test" },
            { icon: "📝", label: "মক পরীক্ষা", color: "#EFF6FF", border: "#BFDBFE", nav: "test" },
            { icon: "🤖", label: "মূল্যায়ন AI", color: "#F5F3FF", border: "#DDD6FE", nav: "ai" },
          ].map(a => (
            <div key={a.label} onClick={() => onNav(a.nav)} className="card-hover" style={{
              background: a.color, border: `1.5px solid ${a.border}`, borderRadius: 16,
              padding: "16px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer"
            }}>
              <span style={{ fontSize: 24 }}>{a.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{a.label}</span>
            </div>
          ))}
        </div>

        {/* Leaderboard Preview */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>🏆 আয়রন লীগ</div>
          <button onClick={() => onNav("leaderboard")} style={{ background: "none", border: "none", color: C.green, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>সব দেখো →</button>
        </div>
        {leaderboard.slice(0, 3).map((p, i) => (
          <Card key={p.name} style={{ padding: "12px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}`}</span>
            <Avatar name={p.name} size={36} color={i === 0 ? C.gold : C.green} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{p.school}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, color: C.green, fontSize: 15 }}>{p.score}</div>
              <div style={{ fontSize: 10, color: C.muted }}>পয়েন্ট</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ── QUESTION BANK ─────────────────────────────────────────────────────────────
const QuestionBankPage = () => {
  const years = ["SSC ২০২৫", "SSC ২০২৪", "SSC ২০২৩", "SSC ২০২২", "SSC ২০২১"];
  const boards = ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "কুমিল্লা", "যশোর", "সিলেট", "দিনাজপুর", "বরিশাল", "ময়মনসিংহ"];

  return (
    <div className="fade-up" style={{ padding: "20px 16px" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4, fontFamily: "'Tiro Bangla', serif" }}>📦 প্রশ্নব্যাংক</div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>সকল বোর্ডের বিগত বছরের প্রশ্ন</div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>পরীক্ষার বছর</div>
        {years.map(y => (
          <Card key={y} className="card-hover" style={{ padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📋</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{y} এর প্রশ্নপত্র</div>
                <div style={{ fontSize: 11, color: C.muted }}>সকল বোর্ড — ৯টি সেট</div>
              </div>
            </div>
            <span style={{ color: C.muted, fontSize: 18 }}>›</span>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ── SUBJECT SELECT ────────────────────────────────────────────────────────────
const SubjectSelectPage = ({ onSelect }) => (
  <div className="fade-up" style={{ padding: "20px 16px" }}>
    <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 4, fontFamily: "'Tiro Bangla', serif" }}>📚 বিষয় নির্বাচন</div>
    <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>কোন বিষয়ে পরীক্ষা দিতে চাও?</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {SUBJECTS.map(s => (
        <div key={s.name} onClick={() => onSelect(s)} className="card-hover" style={{
          background: s.bg, border: `2px solid ${s.color}25`, borderRadius: 18,
          padding: "18px 14px", textAlign: "center", cursor: "pointer"
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: s.color, lineHeight: 1.3 }}>{s.name}</div>
        </div>
      ))}
    </div>
  </div>
);

// ── CHAPTER SELECT ────────────────────────────────────────────────────────────
const ChapterSelectPage = ({ subject, onSelect, onBack }) => {
  const chapters = CHAPTERS.default;
  return (
    <div className="fade-up" style={{ padding: "20px 16px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 22, marginBottom: 16 }}>←</button>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, fontFamily: "'Tiro Bangla', serif" }}>{subject.name}</div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>অধ্যায় নির্বাচন করো</div>
      {chapters.map((ch, i) => (
        <Card key={ch} className="card-hover" onClick={() => onSelect(ch)} style={{ padding: "16px 18px", marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: subject.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: subject.color }}>{i + 1}</div>
          <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{ch}</div>
          <span style={{ color: C.muted }}>›</span>
        </Card>
      ))}
    </div>
  );
};

// ── TIME SELECT ───────────────────────────────────────────────────────────────
const TimeSelectPage = ({ subject, chapter, onStart, onVs, onBack }) => {
  const [mins, setMins] = useState(30);
  const [mode, setMode] = useState("solo");

  return (
    <div className="fade-up" style={{ padding: "20px 16px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 22, marginBottom: 16 }}>←</button>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, fontFamily: "'Tiro Bangla', serif" }}>⏱️ সময় ও মোড</div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>{chapter}</div>

      {/* Mode Select */}
      <Card style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>পরীক্ষার মোড</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { id: "solo", icon: "🙋", label: "একক পরীক্ষা", desc: "নিজে নিজে" },
            { id: "vs", icon: "⚔️", label: "VS মোড", desc: "প্রতিযোগিতা" }
          ].map(m => (
            <div key={m.id} onClick={() => setMode(m.id)} style={{
              border: `2px solid ${mode === m.id ? C.green : C.border}`,
              background: mode === m.id ? "#ECFDF5" : C.white,
              borderRadius: 14, padding: "14px 10px", textAlign: "center", cursor: "pointer", transition: "all 0.2s"
            }}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: mode === m.id ? C.green : C.text }}>{m.label}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Time Picker */}
      <Card style={{ padding: 16, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>পরীক্ষার সময়</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <button onClick={() => setMins(m => Math.max(10, m - 5))} style={{ width: 44, height: 44, borderRadius: 12, border: `2px solid ${C.border}`, background: C.white, fontSize: 20, cursor: "pointer" }}>−</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 800, color: C.green, lineHeight: 1 }}>{mins}</div>
            <div style={{ fontSize: 12, color: C.muted }}>মিনিট</div>
          </div>
          <button onClick={() => setMins(m => Math.min(120, m + 5))} style={{ width: 44, height: 44, borderRadius: 12, border: `2px solid ${C.border}`, background: C.white, fontSize: 20, cursor: "pointer" }}>+</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
          {[15, 30, 45, 60].map(t => (
            <button key={t} onClick={() => setMins(t)} style={{
              padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${mins === t ? C.green : C.border}`,
              background: mins === t ? "#ECFDF5" : C.white, color: mins === t ? C.green : C.muted,
              fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>{t}মি</button>
          ))}
        </div>
      </Card>

      <GreenBtn text={mode === "vs" ? "⚔️ VS মোড শুরু করো" : "🚀 পরীক্ষা শুরু করো"} onClick={() => mode === "vs" ? onVs(mins) : onStart(mins)} full />
    </div>
  );
};

// ── VS MODE ───────────────────────────────────────────────────────────────────
const VsMode = ({ user, subject, chapter, timeMins, onEnd }) => {
  const [phase, setPhase] = useState("searching"); // searching → countdown → quiz
  const [countdown, setCountdown] = useState(3);
  const [qIdx, setQIdx] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeMins * 60);
  const [answered, setAnswered] = useState(null);
  const opponent = { name: "তাসনিম আরা", school: "ভিকারুননিসা" };

  useEffect(() => {
    if (phase === "searching") {
      const t = setTimeout(() => setPhase("countdown"), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "countdown" && countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "countdown" && countdown === 0) setPhase("quiz");
  }, [phase, countdown]);

  useEffect(() => {
    if (phase !== "quiz") return;
    const t = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) { clearInterval(t); onEnd(userScore, oppScore); return 0; }
        return s - 1;
      });
      // Opponent randomly answers
      if (Math.random() < 0.1) setOppScore(s => s + 0.8);
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const handleAnswer = (idx) => {
    if (answered !== null) return;
    const correct = MCQ_BANK[qIdx % MCQ_BANK.length].a === idx;
    setAnswered(idx);
    if (correct) setUserScore(s => s + 1);
    else setUserScore(s => s - 0.25);
    setTimeout(() => {
      setAnswered(null);
      setQIdx(q => q + 1);
    }, 800);
  };

  if (phase === "searching") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 20 }}>
      <div style={{ fontSize: 48, animation: "spin 2s linear infinite" }}>🔍</div>
      <div style={{ fontWeight: 700, fontSize: 18 }}>প্রতিযোগী খোঁজা হচ্ছে...</div>
      <div style={{ color: C.muted, fontSize: 13 }}>অনলাইন খেলোয়াড়দের সাথে মিলানো হচ্ছে</div>
    </div>
  );

  if (phase === "countdown") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 20 }}>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Avatar name={user.name} size={56} />
          <div style={{ marginTop: 8, fontWeight: 700, fontSize: 13 }}>{user.name.split(" ")[0]}</div>
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: C.red }}>⚔️</div>
        <div style={{ textAlign: "center" }}>
          <Avatar name={opponent.name} size={56} color={C.red} />
          <div style={{ marginTop: 8, fontWeight: 700, fontSize: 13 }}>{opponent.name.split(" ")[0]}</div>
        </div>
      </div>
      <div style={{ fontSize: 80, fontWeight: 900, color: C.green, animation: "pulse 0.8s infinite" }}>{countdown || "GO!"}</div>
    </div>
  );

  const q = MCQ_BANK[qIdx % MCQ_BANK.length];
  const mm = Math.floor(timeLeft / 60), ss = timeLeft % 60;

  return (
    <div style={{ padding: "16px" }}>
      {/* VS Header */}
      <div style={{ background: C.dark, borderRadius: 18, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{userScore.toFixed(1)}</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{user.name.split(" ")[0]}</div>
        </div>
        <div style={{ textAlign: "center", color: C.gold, fontWeight: 700 }}>
          <div style={{ fontSize: 11, color: C.muted }}>⏱</div>
          <div style={{ fontSize: 16 }}>{mm}:{ss.toString().padStart(2, "0")}</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{oppScore.toFixed(1)}</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{opponent.name.split(" ")[0]}</div>
        </div>
      </div>

      <Card style={{ padding: "20px 18px", marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 12, marginBottom: 8 }}>প্রশ্ন {qIdx + 1}</div>
        <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.6 }}>{q.q}</div>
      </Card>

      {q.o.map((opt, i) => {
        let bg = C.white, border = C.border, color = C.text;
        if (answered !== null) {
          if (i === q.a) { bg = "#ECFDF5"; border = C.green; color = C.green; }
          else if (i === answered && i !== q.a) { bg = "#FEF2F2"; border = C.red; color = C.red; }
        }
        return (
          <div key={i} onClick={() => handleAnswer(i)} style={{
            background: bg, border: `2px solid ${border}`, borderRadius: 14,
            padding: "14px 18px", marginBottom: 10, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s"
          }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color, fontSize: 13 }}>
              {["ক", "খ", "গ", "ঘ"][i]}
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color }}>{opt}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── MCQ TEST ──────────────────────────────────────────────────────────────────
const MCQTestPage = ({ subject, chapter, timeMins, onFinish }) => {
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeMins * 60);
  const [done, setDone] = useState(false);
  const questions = MCQ_BANK;

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setTimeLeft(s => {
      if (s <= 1) { clearInterval(t); setDone(true); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [done]);

  const handle = (i) => {
    if (answered !== null) return;
    const correct = questions[qIdx].a === i;
    setAnswered(i);
    setTimeout(() => {
      const ns = score + (correct ? 1 : -0.25);
      if (qIdx + 1 >= questions.length) { onFinish(ns); }
      else { setScore(ns); setQIdx(q => q + 1); setAnswered(null); }
    }, 700);
  };

  if (done) { onFinish(score); return null; }

  const q = questions[qIdx];
  const mm = Math.floor(timeLeft / 60), ss = timeLeft % 60;
  const progress = (qIdx / questions.length) * 100;

  return (
    <div style={{ padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: C.muted }}>{subject?.name}</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>প্রশ্ন {qIdx + 1}/{questions.length}</div>
        </div>
        <div style={{
          background: timeLeft < 60 ? "#FEF2F2" : "#ECFDF5",
          color: timeLeft < 60 ? C.red : C.green,
          padding: "8px 16px", borderRadius: 20, fontWeight: 800, fontSize: 16
        }}>⏱ {mm}:{ss.toString().padStart(2, "0")}</div>
      </div>

      {/* Progress */}
      <div style={{ height: 6, background: C.border, borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, ${C.greenGlow})`, borderRadius: 3, transition: "width 0.4s" }} />
      </div>

      {/* Score */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Badge text={`+${score > 0 ? score.toFixed(2) : 0} পয়েন্ট`} color={C.green} />
        <Badge text="-০.২৫ নেগেটিভ" color={C.red} />
      </div>

      <Card style={{ padding: "20px 18px", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.7 }}>{q.q}</div>
      </Card>

      {q.o.map((opt, i) => {
        let bg = C.white, border = C.border, color = C.text;
        if (answered !== null) {
          if (i === q.a) { bg = "#ECFDF5"; border = C.green; color = C.green; }
          else if (i === answered && i !== q.a) { bg = "#FEF2F2"; border = C.red; color = C.red; }
        }
        return (
          <div key={i} onClick={() => handle(i)} style={{
            background: bg, border: `2px solid ${border}`, borderRadius: 14,
            padding: "14px 18px", marginBottom: 10, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s"
          }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color, fontSize: 13 }}>
              {["ক", "খ", "গ", "ঘ"][i]}
            </div>
            <span style={{ fontWeight: 600, fontSize: 14, color }}>{opt}</span>
            {answered !== null && i === q.a && <span style={{ marginLeft: "auto", fontSize: 18 }}>✅</span>}
            {answered === i && i !== q.a && <span style={{ marginLeft: "auto", fontSize: 18 }}>❌</span>}
          </div>
        );
      })}
    </div>
  );
};

// ── RESULT PAGE ───────────────────────────────────────────────────────────────
const ResultPage = ({ score, total, onHome, isVs, oppScore }) => {
  const pct = Math.max(0, (score / total) * 100).toFixed(1);
  const pass = score >= 0;

  return (
    <div className="fade-up" style={{ padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 64, animation: "bounce 1.5s infinite", marginBottom: 16 }}>{pass ? "🎉" : "😔"}</div>
      <div style={{ fontWeight: 800, fontSize: 24, fontFamily: "'Tiro Bangla', serif", marginBottom: 8 }}>
        {isVs ? (score > (oppScore || 0) ? "জয়ী! 🏆" : "হেরে গেছ 😢") : (pass ? "পরীক্ষা সম্পন্ন!" : "আবার চেষ্টা করো!")}
      </div>

      <Card style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "তোমার স্কোর", val: score.toFixed(2), color: C.green },
            { label: "মোট প্রশ্ন", val: total, color: C.blue },
            ...(isVs ? [{ label: "প্রতিযোগীর স্কোর", val: (oppScore || 0).toFixed(2), color: C.red }] : []),
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center", padding: 12, background: `${s.color}10`, borderRadius: 14 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <GreenBtn text="হোমে ফিরে যাও" onClick={onHome} full />
    </div>
  );
};

// ── COMMUNITY ─────────────────────────────────────────────────────────────────
const CommunityPage = ({ user, posts, setPosts }) => {
  const [newPost, setNewPost] = useState("");
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState({});
  const [tab, setTab] = useState("feed");

  const submitPost = () => {
    if (!newPost.trim()) return;
    const p = {
      id: Date.now(), user: user.name, avatar: user.name[0],
      time: "এইমাত্র", text: newPost.trim(), likes: 0, comments: [], shares: 0
    };
    setPosts([p, ...posts]);
    setNewPost("");
  };

  const toggleLike = (id) => {
    setLiked(l => ({ ...l, [id]: !l[id] }));
    setPosts(ps => ps.map(p => p.id === id ? { ...p, likes: p.likes + (liked[id] ? -1 : 1) } : p));
  };

  const addComment = (postId) => {
    if (!commentText.trim()) return;
    setPosts(ps => ps.map(p => p.id === postId ? {
      ...p, comments: [...p.comments, { user: user.name, text: commentText.trim() }]
    } : p));
    setCommentText("");
    setActiveComment(null);
  };

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.dark}, ${C.green})`, padding: "20px 20px 16px" }}>
        <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, fontFamily: "'Tiro Bangla', serif" }}>💬 কমিউনিটি</div>
        <div style={{ display: "flex", gap: 0, marginTop: 12, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 3 }}>
          {["feed", "trending"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "8px 0", background: tab === t ? "#fff" : "transparent",
              color: tab === t ? C.green : "rgba(255,255,255,0.7)",
              border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer",
              fontFamily: "'Hind Siliguri', sans-serif", transition: "all 0.2s"
            }}>{t === "feed" ? "📰 ফিড" : "🔥 ট্রেন্ডিং"}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        {/* New Post */}
        <Card style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <Avatar name={user.name} size={40} />
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
              placeholder="কিছু শেয়ার করো..."
              style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 14, fontFamily: "'Hind Siliguri', sans-serif", resize: "none", outline: "none", minHeight: 60 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <GreenBtn text="পোস্ট করো 📤" onClick={submitPost} small />
          </div>
        </Card>

        {/* Posts */}
        {posts.map(p => (
          <Card key={p.id} style={{ padding: 16, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <Avatar name={p.user} size={42} color={p.user === user.name ? C.green : C.purple} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.user}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{p.time}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 14, color: C.text }}>{p.text}</div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 6, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              {[
                { icon: liked[p.id] ? "❤️" : "🤍", label: p.likes, action: () => toggleLike(p.id) },
                { icon: "💬", label: p.comments.length, action: () => setActiveComment(activeComment === p.id ? null : p.id) },
                { icon: "↗️", label: p.shares, action: () => {} }
              ].map((a, i) => (
                <button key={i} onClick={a.action} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                  background: "#F9FAFB", border: `1px solid ${C.border}`, borderRadius: 20,
                  cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Hind Siliguri', sans-serif"
                }}>
                  <span>{a.icon}</span><span style={{ color: C.muted }}>{a.label}</span>
                </button>
              ))}
            </div>

            {/* Comments */}
            {p.comments.length > 0 && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                {p.comments.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <Avatar name={c.user} size={28} />
                    <div style={{ background: "#F3F4F6", borderRadius: 12, padding: "8px 12px", flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: C.green }}>{c.user}</div>
                      <div style={{ fontSize: 13, color: C.text }}>{c.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            {activeComment === p.id && (
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="মন্তব্য লিখো..."
                  style={{ flex: 1, padding: "9px 14px", border: `1.5px solid ${C.border}`, borderRadius: 20, fontSize: 13, fontFamily: "'Hind Siliguri', sans-serif", outline: "none" }} />
                <button onClick={() => addComment(p.id)} style={{
                  background: C.green, color: "#fff", border: "none", borderRadius: 20, padding: "0 16px", cursor: "pointer", fontWeight: 700, fontSize: 13
                }}>→</button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// ── LEADERBOARD PAGE ──────────────────────────────────────────────────────────
const LeaderboardPage = ({ leaderboard }) => (
  <div className="fade-up">
    <div style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.dark} 100%)`, padding: "24px 20px 32px" }}>
      <div style={{ color: "#fff", fontSize: 24, fontWeight: 800, fontFamily: "'Tiro Bangla', serif" }}>🏆 লিডারবোর্ড</div>
      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>আয়রন লীগ — সাপ্তাহিক</div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, marginTop: 20 }}>
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((p, i) => {
            const heights = [80, 100, 70];
            const medals = ["🥈", "🥇", "🥉"];
            const sizes = [48, 60, 44];
            return (
              <div key={p.name} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>{medals[i]}</div>
                <Avatar name={p.name} size={sizes[i]} color={["#9CA3AF", C.gold, "#CD7F32"][i]} />
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 11, marginTop: 4, maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name.split(" ")[0]}</div>
                <div style={{
                  height: heights[i], background: "rgba(255,255,255,0.15)",
                  borderRadius: "10px 10px 0 0", marginTop: 8, width: 70,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 15
                }}>{p.score}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>

    <div style={{ padding: "16px" }}>
      {leaderboard.map((p, i) => (
        <Card key={p.name} style={{ padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, background: i === 0 ? "#FFFBEB" : C.white, border: i === 0 ? `1.5px solid ${C.gold}` : `1px solid ${C.border}` }}>
          <div style={{ fontWeight: 800, width: 24, textAlign: "center", color: i < 3 ? C.gold : C.muted }}>{i + 1}</div>
          <Avatar name={p.name} size={40} color={i === 0 ? C.gold : C.green} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{p.school} · 🔥{p.streak}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, color: C.green, fontSize: 16 }}>{p.score}</div>
            <div style={{ fontSize: 10, color: C.muted }}>পয়েন্ট</div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// ── STUDY TIME PAGE ───────────────────────────────────────────────────────────
const StudyTimePage = ({ user, onUpdateStudy }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [subject, setSubject] = useState("বাংলা ১ম পত্র");
  const intervalRef = useRef(null);

  const toggle = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      onUpdateStudy(elapsed / 3600);
    } else {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    setIsRunning(!isRunning);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const hh = Math.floor(elapsed / 3600), mm = Math.floor((elapsed % 3600) / 60), ss = elapsed % 60;
  const fmt = n => n.toString().padStart(2, "0");
  const todayHours = (user.studyHours || 0).toFixed(1);

  return (
    <div className="fade-up" style={{ padding: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, fontFamily: "'Tiro Bangla', serif" }}>⏰ পড়ার সময়</div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>আজকে কতক্ষণ পড়েছ ট্র্যাক করো</div>

      {/* Timer Circle */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{
          width: 180, height: 180, borderRadius: "50%", margin: "0 auto",
          background: isRunning ? `linear-gradient(135deg, ${C.green}, ${C.greenGlow})` : `linear-gradient(135deg, ${C.dark}, #1a3a2a)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          boxShadow: isRunning ? `0 0 40px ${C.green}50` : "0 8px 32px rgba(0,0,0,0.2)",
          transition: "all 0.4s", animation: isRunning ? "pulse 2s infinite" : "none"
        }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", fontFamily: "monospace" }}>
            {fmt(hh)}:{fmt(mm)}:{fmt(ss)}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 }}>
            {isRunning ? "চলছে..." : "প্রস্তুত"}
          </div>
        </div>
      </div>

      {/* Subject Select */}
      <Card style={{ padding: 16, marginBottom: 16 }}>
        <label style={{ fontWeight: 700, fontSize: 13, display: "block", marginBottom: 8 }}>বিষয়</label>
        <select value={subject} onChange={e => setSubject(e.target.value)} style={{
          width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 12,
          fontSize: 14, fontFamily: "'Hind Siliguri', sans-serif", appearance: "none", outline: "none"
        }}>
          {SUBJECTS.map(s => <option key={s.name}>{s.name}</option>)}
        </select>
      </Card>

      <GreenBtn text={isRunning ? "⏸ পজ করো" : "▶ শুরু করো"} onClick={toggle} full />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
        {[
          { label: "আজকের পড়া", val: `${todayHours}h`, icon: "📚" },
          { label: "সাপ্তাহিক", val: `${(parseFloat(todayHours) * 5).toFixed(1)}h`, icon: "📅" },
        ].map(s => (
          <Card key={s.label} style={{ padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: C.green, marginTop: 4 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{s.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ── PROFILE PAGE ──────────────────────────────────────────────────────────────
const ProfilePage = ({ user }) => (
  <div className="fade-up">
    <div style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.green} 100%)`, padding: "30px 24px 60px", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Avatar name={user.name} size={72} />
        <div style={{ color: "#fff" }}>
          <div style={{ fontWeight: 800, fontSize: 20, fontFamily: "'Tiro Bangla', serif" }}>{user.name}</div>
          <div style={{ opacity: 0.7, fontSize: 13, marginTop: 2 }}>{user.class} · {user.group}</div>
          <div style={{ opacity: 0.6, fontSize: 12, marginTop: 2 }}>{user.school || "বিদ্যালয়"}</div>
        </div>
      </div>
    </div>

    <div style={{ padding: "0 16px", marginTop: -24 }}>
      <Card style={{ padding: "16px", marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
        {[
          { icon: "⭐", val: user.score.toFixed(1), label: "পয়েন্ট" },
          { icon: "📝", val: user.testsGiven, label: "পরীক্ষা" },
          { icon: "🔥", val: user.streak, label: "স্ট্রিক" },
          { icon: "⏰", val: `${(user.studyHours || 0).toFixed(0)}h`, label: "পড়াশোনা" },
        ].map((s, i) => (
          <div key={s.label} style={{ textAlign: "center", padding: "12px 0", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontSize: 20 }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: C.green }}>{s.val}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{s.label}</div>
          </div>
        ))}
      </Card>

      {/* Subject Progress */}
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>বিষয়ভিত্তিক রিপোর্ট</div>
      {SUBJECTS.slice(0, 5).map((s, i) => {
        const pct = [65, 42, 78, 55, 88][i];
        return (
          <Card key={s.name} style={{ padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
              <div style={{ fontWeight: 700, color: C.green, fontSize: 14 }}>{pct}%</div>
            </div>
            <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}, ${C.greenGlow})`, borderRadius: 3 }} />
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

// ── LOGO MODAL ────────────────────────────────────────────────────────────────
const LogoModal = ({ onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 24, padding: 32, width: "100%", maxWidth: 380, animation: "fadeUp 0.3s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>📊</div>
        <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Tiro Bangla', serif", color: C.green }}>মূল্যায়ন</div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Version 2.0 · SSC Prep Platform</div>
      </div>
      <div style={{ lineHeight: 2, fontSize: 14, color: C.text, marginBottom: 24 }}>
        🎯 বাংলাদেশের এসএসসি শিক্ষার্থীদের জন্য সেরা প্রস্তুতি প্ল্যাটফর্ম।<br />
        📚 প্রশ্নব্যাংক, মক পরীক্ষা, লাইভ VS মোড, এবং কমিউনিটি সব এক জায়গায়।<br />
        🏆 লিডারবোর্ড দিয়ে নিজের অগ্রগতি মাপো।
      </div>
      <GreenBtn text="বন্ধ করো" onClick={onClose} full />
    </div>
  </div>
);

// ── NAV BAR ───────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "হোম" },
  { id: "test", icon: "📝", label: "পরীক্ষা" },
  { id: "study", icon: "⏰", label: "পড়াশোনা" },
  { id: "community", icon: "💬", label: "কমিউনিটি" },
  { id: "profile", icon: "👤", label: "প্রোফাইল" },
];

const NavBar = ({ active, onNav }) => (
  <div style={{
    position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
    width: "100%", maxWidth: 480, background: C.white,
    borderTop: `1px solid ${C.border}`, display: "flex",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", zIndex: 100
  }}>
    {NAV_ITEMS.map(n => (
      <button key={n.id} onClick={() => onNav(n.id)} className="nav-btn" style={{
        flex: 1, padding: "10px 4px", background: "transparent", border: "none",
        cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
        borderTop: `3px solid ${active === n.id ? C.green : "transparent"}`,
        transition: "all 0.2s"
      }}>
        <span style={{ fontSize: 20 }}>{n.icon}</span>
        <span style={{ fontSize: 10, fontWeight: active === n.id ? 700 : 500, color: active === n.id ? C.green : C.muted, fontFamily: "'Hind Siliguri', sans-serif" }}>{n.label}</span>
      </button>
    ))}
  </div>
);

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [navPage, setNavPage] = useState("home");
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [testFlow, setTestFlow] = useState({ step: "subject", subject: null, chapter: null }); // subject→chapter→time→quiz→result
  const [lastScore, setLastScore] = useState(0);
  const [lastOppScore, setLastOppScore] = useState(0);
  const [isVsMode, setIsVsMode] = useState(false);
  const [timeMins, setTimeMins] = useState(30);
  const [posts, setPosts] = useState(COMMUNITY_POSTS_INIT);
  const [leaderboard, setLeaderboard] = useState(LEADERBOARD_INIT);

  const [user, setUser] = useState({
    name: "", number: "", class: "SSC-2026", school: "", group: "বিজ্ঞান", zila: "ঢাকা",
    score: 0, testsGiven: 0, streak: 0, studyHours: 0
  });

  const finishTest = (score, oppScore) => {
    setLastScore(score);
    setLastOppScore(oppScore || 0);
    const ns = { ...user, score: user.score + Math.max(0, score), testsGiven: user.testsGiven + 1, streak: score > 0 ? user.streak + 1 : user.streak };
    setUser(ns);
    setLeaderboard(lb => {
      const existing = lb.find(p => p.name === ns.name);
      if (existing) return lb.map(p => p.name === ns.name ? { ...p, score: ns.score } : p).sort((a, b) => b.score - a.score);
      return [...lb, { name: ns.name, score: ns.score, school: ns.school || "তোমার স্কুল", streak: ns.streak, medal: "👤" }].sort((a, b) => b.score - a.score);
    });
    setTestFlow({ step: "result" });
  };

  const handleNav = (page) => {
    setNavPage(page);
    if (page === "test") setTestFlow({ step: "subject", subject: null, chapter: null });
    if (page === "leaderboard") setNavPage("leaderboard");
  };

  // ── RENDER CONTENT ─────────────────────────────────────────────────────────
  const renderContent = () => {
    if (screen === "splash") return <SplashScreen onDone={() => setScreen("reg1")} />;
    if (screen === "reg1") return <RegP1 onNext={d => { setUser(u => ({ ...u, ...d })); setScreen("reg2"); }} />;
    if (screen === "reg2") return <RegP2 onNext={d => { setUser(u => ({ ...u, ...d })); setScreen("welcome"); }} />;
    if (screen === "welcome") return <WelcomeModal name={user.name} onStart={() => setScreen("main")} />;

    // MAIN APP
    let content;
    if (navPage === "home") {
      content = <HomePage user={user} leaderboard={leaderboard} onNav={handleNav} onLogoClick={() => setShowLogoModal(true)} />;
    } else if (navPage === "test") {
      if (testFlow.step === "subject") {
        content = <SubjectSelectPage onSelect={s => setTestFlow({ step: "chapter", subject: s })} />;
      } else if (testFlow.step === "chapter") {
        content = <ChapterSelectPage subject={testFlow.subject} onBack={() => setTestFlow({ step: "subject" })} onSelect={ch => setTestFlow({ ...testFlow, step: "time", chapter: ch })} />;
      } else if (testFlow.step === "time") {
        content = <TimeSelectPage subject={testFlow.subject} chapter={testFlow.chapter}
          onBack={() => setTestFlow({ ...testFlow, step: "chapter" })}
          onStart={mins => { setTimeMins(mins); setIsVsMode(false); setTestFlow({ ...testFlow, step: "quiz" }); }}
          onVs={mins => { setTimeMins(mins); setIsVsMode(true); setTestFlow({ ...testFlow, step: "vs" }); }} />;
      } else if (testFlow.step === "vs") {
        content = <VsMode user={user} subject={testFlow.subject} chapter={testFlow.chapter} timeMins={timeMins} onEnd={(s, os) => finishTest(s, os)} />;
      } else if (testFlow.step === "quiz") {
        content = <MCQTestPage subject={testFlow.subject} chapter={testFlow.chapter} timeMins={timeMins} onFinish={s => finishTest(s)} />;
      } else if (testFlow.step === "result") {
        content = <ResultPage score={lastScore} total={MCQ_BANK.length} oppScore={lastOppScore} isVs={isVsMode} onHome={() => { setNavPage("home"); setTestFlow({ step: "subject" }); }} />;
      }
    } else if (navPage === "study") {
      content = <StudyTimePage user={user} onUpdateStudy={h => setUser(u => ({ ...u, studyHours: u.studyHours + h }))} />;
    } else if (navPage === "community") {
      content = <CommunityPage user={user} posts={posts} setPosts={setPosts} />;
    } else if (navPage === "leaderboard") {
      content = <LeaderboardPage leaderboard={leaderboard} />;
    } else if (navPage === "bank") {
      content = <QuestionBankPage />;
    } else if (navPage === "profile") {
      content = <ProfilePage user={user} />;
    }

    return (
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: C.bg, position: "relative" }}>
        <div style={{ paddingBottom: 80, overflowY: "auto", maxHeight: "100vh" }}>
          {content}
        </div>
        <NavBar active={navPage} onNav={handleNav} />
        {showLogoModal && <LogoModal onClose={() => setShowLogoModal(false)} />}
      </div>
    );
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {renderContent()}
    </>
  );
}
