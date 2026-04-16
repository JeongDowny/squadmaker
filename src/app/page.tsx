"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Link from "next/link";

/* ─── 포메이션 데이터 ─────────────────────────────────── */
type Player = { name: string; abbr: string; pos: string; left: string; top: string };
type FormationData = {
  label: string;
  players: Player[];
  summary: { name: string; quarters: number[] }[];
};

const FORMATIONS: Record<number, FormationData> = {
  1: {
    label: "1Q · 4-2-3-1",
    players: [
      { name: "임도윤", abbr: "임", pos: "FW", left: "50%", top: "10%" },
      { name: "윤서율", abbr: "윤", pos: "MF", left: "18%", top: "30%" },
      { name: "강태민", abbr: "강", pos: "MF", left: "50%", top: "30%" },
      { name: "배성현", abbr: "배", pos: "MF", left: "82%", top: "30%" },
      { name: "오승원", abbr: "오", pos: "MF", left: "36%", top: "50%" },
      { name: "한지원", abbr: "한", pos: "MF", left: "64%", top: "50%" },
      { name: "이서준", abbr: "이", pos: "DF", left: "10%", top: "68%" },
      { name: "최도현", abbr: "최", pos: "DF", left: "36%", top: "68%" },
      { name: "김태양", abbr: "김", pos: "DF", left: "64%", top: "68%" },
      { name: "정하윤", abbr: "정", pos: "DF", left: "90%", top: "68%" },
      { name: "박민준", abbr: "박", pos: "GK", left: "50%", top: "87%" },
    ],
    summary: [
      { name: "임도윤", quarters: [1, 0, 0, 0] },
      { name: "강태민", quarters: [1, 0, 0, 0] },
      { name: "오승원", quarters: [1, 0, 0, 0] },
      { name: "박민준", quarters: [1, 0, 0, 0] },
      { name: "오예린", quarters: [0, 0, 0, 0] },
    ],
  },
  2: {
    label: "2Q · 4-3-3",
    players: [
      { name: "박성준", abbr: "박", pos: "FW", left: "18%", top: "12%" },
      { name: "김지훈", abbr: "김", pos: "FW", left: "50%", top: "12%" },
      { name: "오예린", abbr: "오", pos: "FW", left: "82%", top: "12%" },
      { name: "이현수", abbr: "이", pos: "MF", left: "20%", top: "40%" },
      { name: "최승호", abbr: "최", pos: "MF", left: "50%", top: "40%" },
      { name: "한도현", abbr: "한", pos: "MF", left: "80%", top: "40%" },
      { name: "윤재원", abbr: "윤", pos: "DF", left: "10%", top: "65%" },
      { name: "장민재", abbr: "장", pos: "DF", left: "36%", top: "65%" },
      { name: "송태양", abbr: "송", pos: "DF", left: "64%", top: "65%" },
      { name: "임서준", abbr: "임", pos: "DF", left: "90%", top: "65%" },
      { name: "정우성", abbr: "정", pos: "GK", left: "50%", top: "87%" },
    ],
    summary: [
      { name: "임도윤", quarters: [1, 0, 0, 0] },
      { name: "강태민", quarters: [1, 0, 0, 0] },
      { name: "오예린", quarters: [0, 1, 0, 0] },
      { name: "박민준", quarters: [1, 0, 0, 0] },
      { name: "김지훈", quarters: [0, 1, 0, 0] },
    ],
  },
  3: {
    label: "3Q · 4-4-2",
    players: [
      { name: "임도윤", abbr: "임", pos: "FW", left: "36%", top: "12%" },
      { name: "오예린", abbr: "오", pos: "FW", left: "64%", top: "12%" },
      { name: "윤서율", abbr: "윤", pos: "MF", left: "14%", top: "40%" },
      { name: "강태민", abbr: "강", pos: "MF", left: "38%", top: "40%" },
      { name: "배성현", abbr: "배", pos: "MF", left: "62%", top: "40%" },
      { name: "한지원", abbr: "한", pos: "MF", left: "86%", top: "40%" },
      { name: "이서준", abbr: "이", pos: "DF", left: "10%", top: "66%" },
      { name: "최도현", abbr: "최", pos: "DF", left: "36%", top: "66%" },
      { name: "김태양", abbr: "김", pos: "DF", left: "64%", top: "66%" },
      { name: "정하윤", abbr: "정", pos: "DF", left: "90%", top: "66%" },
      { name: "박민준", abbr: "박", pos: "GK", left: "50%", top: "87%" },
    ],
    summary: [
      { name: "임도윤", quarters: [1, 0, 1, 0] },
      { name: "강태민", quarters: [1, 0, 1, 0] },
      { name: "오예린", quarters: [0, 1, 1, 0] },
      { name: "박민준", quarters: [1, 0, 1, 0] },
      { name: "오승원", quarters: [1, 0, 0, 0] },
    ],
  },
  4: {
    label: "4Q · 4-2-3-1",
    players: [
      { name: "김지훈", abbr: "김", pos: "FW", left: "50%", top: "10%" },
      { name: "박성준", abbr: "박", pos: "MF", left: "18%", top: "30%" },
      { name: "이현수", abbr: "이", pos: "MF", left: "50%", top: "30%" },
      { name: "한도현", abbr: "한", pos: "MF", left: "82%", top: "30%" },
      { name: "오승원", abbr: "오", pos: "MF", left: "36%", top: "50%" },
      { name: "송태양", abbr: "송", pos: "MF", left: "64%", top: "50%" },
      { name: "윤재원", abbr: "윤", pos: "DF", left: "10%", top: "68%" },
      { name: "장민재", abbr: "장", pos: "DF", left: "36%", top: "68%" },
      { name: "임서준", abbr: "임", pos: "DF", left: "64%", top: "68%" },
      { name: "최승호", abbr: "최", pos: "DF", left: "90%", top: "68%" },
      { name: "정우성", abbr: "정", pos: "GK", left: "50%", top: "87%" },
    ],
    summary: [
      { name: "임도윤", quarters: [1, 0, 1, 0] },
      { name: "강태민", quarters: [1, 0, 1, 0] },
      { name: "오예린", quarters: [0, 1, 1, 0] },
      { name: "박민준", quarters: [1, 0, 1, 0] },
      { name: "김지훈", quarters: [0, 1, 0, 1] },
    ],
  },
};

/* ─── CSS 문자열 ──────────────────────────────────────── */
const LANDING_CSS = `
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css');
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  .landing-root {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    background: #050505;
    color: #fff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .landing-root * { box-sizing: border-box; }
  .font-display { font-family: 'Outfit', system-ui, sans-serif; }
  .ko { word-break: keep-all; overflow-wrap: break-word; }

  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
  @keyframes floatB { 0%,100%{transform:translateY(0) rotate(8deg)} 50%{transform:translateY(14px) rotate(8deg)} }
  @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(2rem);filter:blur(6px)} to{opacity:1;transform:translateY(0);filter:blur(0)} }
  @keyframes orbPulse { 0%,100%{opacity:0.12;transform:scale(1)} 50%{opacity:0.18;transform:scale(1.08)} }

  .sp { transition: all 0.5s cubic-bezier(0.16,1,0.3,1); }
  .reveal { opacity:0; transform:translateY(2.5rem); filter:blur(6px); transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1),transform 0.8s cubic-bezier(0.16,1,0.3,1),filter 0.8s cubic-bezier(0.16,1,0.3,1); }
  .reveal.in { opacity:1; transform:translateY(0); filter:blur(0); }
  .d1{transition-delay:80ms} .d2{transition-delay:160ms} .d3{transition-delay:240ms} .d4{transition-delay:320ms} .d5{transition-delay:400ms}

  .db-outer { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); padding:5px; border-radius:1.75rem; transition:border-color 0.5s cubic-bezier(0.16,1,0.3,1),background 0.5s cubic-bezier(0.16,1,0.3,1); }
  .db-outer:hover { border-color:rgba(22,163,74,0.25); background:rgba(22,163,74,0.025); }
  .db-inner { background:rgba(255,255,255,0.025); box-shadow:inset 0 1px 1px rgba(255,255,255,0.07); border-radius:calc(1.75rem - 5px); padding:1.75rem; height:100%; }

  .nav-pill { background:rgba(5,5,5,0.72); border:1px solid rgba(255,255,255,0.09); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); transition:all 0.5s cubic-bezier(0.16,1,0.3,1); }
  .nav-pill.scrolled { background:rgba(5,5,5,0.94); border-color:rgba(255,255,255,0.13); }

  .btn-p { transition:all 0.5s cubic-bezier(0.16,1,0.3,1); }
  .btn-p:hover { transform:scale(1.025); box-shadow:0 0 40px rgba(22,163,74,0.3),0 0 80px rgba(22,163,74,0.08); }
  .btn-p:active { transform:scale(0.975); }
  .btn-p:hover .arr { transform:translateX(3px); }
  .arr { transition:transform 0.5s cubic-bezier(0.16,1,0.3,1); }
  .btn-s { transition:all 0.5s cubic-bezier(0.16,1,0.3,1); }
  .btn-s:hover { transform:scale(1.025); background:rgba(255,255,255,0.07); }
  .btn-s:active { transform:scale(0.975); }

  .field-bg { background:linear-gradient(180deg,#1b5e2b 0%,#1e6b31 40%,#1e6b31 60%,#1b5e2b 100%); position:relative; overflow:hidden; }
  .field-bg::before { content:''; position:absolute; inset:0; background:linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px); background-size:30% 25%; }
  .field-line-h { position:absolute; left:5%; right:5%; height:1px; background:rgba(255,255,255,0.25); }
  .field-circle { position:absolute; border-radius:50%; border:1px solid rgba(255,255,255,0.25); }

  .player-b { position:absolute; transform:translate(-50%,-50%); display:flex; flex-direction:column; align-items:center; gap:2px; }
  .player-dot { width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,0.95); border:2px solid rgba(22,163,74,0.8); display:flex; align-items:center; justify-content:center; font-size:8px; font-weight:800; color:#155728; box-shadow:0 2px 10px rgba(0,0,0,0.5); transition:all 0.3s cubic-bezier(0.16,1,0.3,1); cursor:pointer; }
  .player-dot:hover { transform:scale(1.2); box-shadow:0 4px 20px rgba(22,163,74,0.5); }
  .player-dot.gk { background:rgba(250,204,21,0.95); border-color:rgba(161,98,7,0.8); color:#713f12; }
  .player-nm { font-size:8px; font-weight:600; color:rgba(255,255,255,0.9); text-shadow:0 1px 4px rgba(0,0,0,0.9); white-space:nowrap; }

  .qtab { transition:all 0.4s cubic-bezier(0.16,1,0.3,1); }
  .qtab.on { background:rgba(22,163,74,0.15); border-color:rgba(22,163,74,0.5); color:#4ade80; }
  .qtab:not(.on):hover { background:rgba(255,255,255,0.05); }

  .orb { position:absolute; border-radius:50%; filter:blur(100px); pointer-events:none; animation:orbPulse 8s ease-in-out infinite; }

  @media(min-width:768px){
    .bento { display:grid; grid-template-columns:repeat(12,1fr); grid-template-rows:auto; gap:1rem; }
    .b-lg { grid-column:span 7; grid-row:span 2; }
    .b-sm { grid-column:span 5; }
  }
  @media(max-width:767px){ .bento { display:flex; flex-direction:column; gap:1rem; } }

  @media(min-width:768px){ .test-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1.5rem; align-items:start; } }
  @media(max-width:767px){ .test-grid { display:flex; flex-direction:column; gap:1rem; } }

  .form-label { font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:rgba(74,222,128,0.8); }
  .eyebrow { display:inline-flex; align-items:center; gap:6px; border-radius:9999px; padding:4px 14px; font-size:12px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; background:rgba(22,163,74,0.1); border:1px solid rgba(22,163,74,0.2); color:rgba(74,222,128,0.9); }
  .mob-link { opacity:0; transform:translateY(2rem); }
  .footer-link { transition:color 0.3s cubic-bezier(0.16,1,0.3,1); }
  .footer-link:hover { color:#4ade80; }
`;

/* ─── 컴포넌트 ────────────────────────────────────────── */
export default function LandingPage() {
  const [activeQ, setActiveQ] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // IntersectionObserver reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Nav 스크롤 효과
  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY > 60) navRef.current.classList.add("scrolled");
      else navRef.current.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 모바일 메뉴 애니메이션
  useEffect(() => {
    const links = document.querySelectorAll<HTMLElement>(".mob-link");
    if (isMenuOpen) {
      links.forEach((l, i) => {
        setTimeout(() => {
          l.style.opacity = "1";
          l.style.transform = "translateY(0)";
          l.style.transition = "all 0.5s cubic-bezier(0.16,1,0.3,1)";
        }, i * 60);
      });
    } else {
      links.forEach((l) => {
        l.style.opacity = "0";
        l.style.transform = "translateY(2rem)";
        l.style.transition = "";
      });
    }
  }, [isMenuOpen]);

  const data = FORMATIONS[activeQ];

  return (
    <>
      <Script src="https://code.iconify.design/iconify-icon/2.3.0/iconify-icon.min.js" strategy="afterInteractive" />
      <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />

      <div className="landing-root" style={{ minHeight: "100dvh" }}>
        {/* 노이즈 오버레이 */}
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none", opacity: 0.022,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />

        {/* ── 내비게이션 ── */}
        <nav
          ref={navRef}
          className="nav-pill"
          style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 50, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 9999, minWidth: 280, maxWidth: 720, width: "90%" }}
        >
          <a href="#" className="sp" style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8, opacity: 1, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#16a34a,#15803d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <iconify-icon icon="solar:football-linear" style={{ color: "#fff", fontSize: "16px" }} />
            </div>
            <span className="font-display" style={{ fontWeight: 800, color: "#fff", fontSize: 14, letterSpacing: "-0.02em" }}>SquadMaker</span>
          </a>
          <div className="sp" style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "center" }}>
            {["기능", "사용법", "사용자 후기"].map((label, i) => (
              <a key={label} href={["#features", "#how", "#testimonials"][i]} className="sp ko" style={{ padding: "6px 12px", borderRadius: 9999, fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                {label}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <Link href="/matches/new" className="btn-p" style={{ display: "flex", alignItems: "center", gap: 8, background: "#16a34a", color: "#fff", fontSize: 14, fontWeight: 600, padding: "8px 20px", borderRadius: 9999, textDecoration: "none" }}>
              무료로 시작하기
              <span className="arr" style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <iconify-icon icon="solar:arrow-right-linear" style={{ fontSize: "11px" }} />
              </span>
            </Link>
            <button onClick={() => setIsMenuOpen(true)} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <iconify-icon icon="solar:hamburger-menu-linear" style={{ fontSize: "18px" }} />
            </button>
          </div>
        </nav>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(4,4,4,0.97)", backdropFilter: "blur(40px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
            <button onClick={() => setIsMenuOpen(false)} style={{ position: "absolute", top: 24, right: 24, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <iconify-icon icon="solar:close-linear" style={{ fontSize: "20px" }} />
            </button>
            {["기능", "사용법", "사용자 후기"].map((label, i) => (
              <a key={label} href={["#features", "#how", "#testimonials"][i]} className="mob-link sp ko" onClick={() => setIsMenuOpen(false)} style={{ fontSize: 24, fontWeight: 600, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
                {label}
              </a>
            ))}
            <Link href="/matches/new" className="mob-link btn-p" onClick={() => setIsMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#16a34a", color: "#fff", fontWeight: 600, padding: "16px 32px", borderRadius: 9999, fontSize: 18, textDecoration: "none" }}>
              무료로 시작하기
            </Link>
          </div>
        )}

        {/* ── 히어로 ── */}
        <section style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "100dvh", padding: "96px 16px 64px" }}>
          <div className="orb" style={{ width: 600, height: 600, background: "#16a34a", top: -200, left: "50%", marginLeft: -300, opacity: 0.08 }} />
          <div className="orb" style={{ width: 400, height: 400, background: "#059669", bottom: -150, left: "10%", opacity: 0.07, animationDelay: "2s" }} />

          <div className="eyebrow reveal" style={{ marginBottom: 24 }}>
            <iconify-icon icon="solar:football-bold" style={{ fontSize: "13px", color: "#4ade80" }} />
            축구 동호회를 위한 배치 서비스
          </div>

          <h1 className="ko font-display reveal d1" style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.2, color: "#fff", maxWidth: "900px", marginBottom: 24 }}>
            경기 전 선발 배치,{" "}
            <span style={{ background: "linear-gradient(90deg,#4ade80,#16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              5분 안에
            </span>{" "}
            완성하세요.
          </h1>

          <p className="ko reveal d2" style={{ fontSize: "clamp(1rem,2vw,1.2rem)", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 640, marginBottom: 40 }}>
            포메이션을 선택하면 공평한 출전 분배와 포지션 적합성을 자동으로 계산합니다.
            <br />메모장, 머릿속 계산은 이제 필요 없습니다.
          </p>

          <div className="reveal d3" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 64 }}>
            <Link href="/matches/new" className="btn-p" style={{ display: "flex", alignItems: "center", gap: 12, background: "#16a34a", color: "#fff", fontWeight: 600, padding: "16px 32px", borderRadius: 9999, fontSize: 18, textDecoration: "none", minHeight: 52 }}>
              무료로 시작하기
              <span className="arr" style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <iconify-icon icon="solar:arrow-right-linear" style={{ fontSize: "13px" }} />
              </span>
            </Link>
            <a href="#preview" className="btn-s ko" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)", padding: "16px 32px", borderRadius: 9999, fontSize: 18, fontWeight: 500, textDecoration: "none", minHeight: 52 }}>
              <iconify-icon icon="solar:play-circle-linear" style={{ fontSize: "18px", color: "#4ade80" }} />
              미리 보기
            </a>
          </div>

          {/* 히어로 전술 보드 mockup */}
          <div className="reveal d4" style={{ width: "100%", maxWidth: 760, position: "relative" }}>
            <div style={{ position: "absolute", inset: -2, borderRadius: "2rem", background: "linear-gradient(135deg,rgba(22,163,74,0.3),transparent,rgba(22,163,74,0.1))", pointerEvents: "none", zIndex: 0 }} />
            <div className="db-outer" style={{ borderRadius: "2rem", overflow: "hidden", position: "relative", zIndex: 1 }}>
              <div className="db-inner" style={{ padding: 0, background: "rgba(12,12,12,0.95)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["#ff5f56","#ffbd2e","#27c93f"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  </div>
                  <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 12px", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>squadmaker.app</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  <div className="field-bg" style={{ minHeight: 280, position: "relative" }}>
                    <div className="field-line-h" style={{ top: "50%" }} />
                    <div className="field-circle" style={{ width: 60, height: 60, top: "50%", left: "50%", marginTop: -30, marginLeft: -30 }} />
                    <div className="eyebrow" style={{ position: "absolute", top: 8, left: 10, zIndex: 5, fontSize: 9, padding: "2px 8px", gap: 4 }}>
                      <iconify-icon icon="solar:widget-linear" style={{ fontSize: "10px" }} />1Q · 4-2-3-1
                    </div>
                    {FORMATIONS[1].players.map((p) => (
                      <div key={p.name} className="player-b" style={{ left: p.left, top: p.top }}>
                        <div className={`player-dot${p.pos === "GK" ? " gk" : ""}`}>{p.abbr}</div>
                        <div className="player-nm">{p.name}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div className="form-label" style={{ marginBottom: 4 }}>출전 균등 추천안</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }} className="ko">선수별 총 출전 쿼터 수</div>
                    {FORMATIONS[1].summary.map((p) => (
                      <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{p.name}</span>
                        <div style={{ display: "flex", gap: 3 }}>
                          {p.quarters.map((v, qi) => (
                            <div key={qi} style={{ width: 16, height: 16, borderRadius: 4, background: v ? "rgba(22,163,74,0.7)" : "rgba(255,255,255,0.08)", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: v ? "#fff" : "rgba(255,255,255,0.3)" }}>
                              {v ? qi + 1 : "·"}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: "auto", padding: 10, borderRadius: 10, background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)" }}>
                      <div style={{ fontSize: 10, color: "rgba(74,222,128,0.9)", fontWeight: 600 }} className="ko">포메이션 변경 시 즉시 재계산</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 지표 스트립 ── */}
        <section style={{ padding: "64px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 32, textAlign: "center" }} className="reveal">
            {[["12,847+", "경기 배치 생성"], ["4.87/5", "평균 만족도"], ["47,200+", "선수 배치 계산"], ["3분", "평균 첫 배치 완성"]].map(([num, label], i) => (
              <div key={label} className={`d${i + 1}`}>
                <div className="font-display" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                  {num.includes("/") ? (
                    <>{num.split("/")[0]}<span style={{ color: "#4ade80" }}>/{num.split("/")[1]}</span></>
                  ) : num.endsWith("+") ? (
                    <>{num.slice(0, -1)}<span style={{ color: "#4ade80" }}>+</span></>
                  ) : (
                    <>{num.slice(0, -1)}<span style={{ fontSize: "1.5rem", color: "#4ade80" }}>{num.slice(-1)}</span></>
                  )}
                </div>
                <div className="ko" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 제품 미리보기 ── */}
        <section id="preview" style={{ padding: "96px 16px", position: "relative", overflow: "hidden" }}>
          <div className="orb" style={{ width: 500, height: 500, background: "#16a34a", top: "50%", left: "50%", marginTop: -250, marginLeft: -250, opacity: 0.06, animationDelay: "1s" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>제품 미리보기</div>
              <h2 className="ko font-display" style={{ fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#fff", marginBottom: 16 }}>
                실제로 이렇게 작동합니다
              </h2>
              <p className="ko" style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, maxWidth: 480, margin: "0 auto", lineHeight: 1.8 }}>
                쿼터별 포메이션을 선택하면 선발 배치가 즉시 추천됩니다.
              </p>
            </div>

            <div className="db-outer reveal d1" style={{ borderRadius: "2rem", overflow: "hidden", maxWidth: 960, margin: "0 auto" }}>
              <div className="db-inner" style={{ padding: 0, background: "rgba(10,10,10,0.98)" }}>
                {/* 앱 크롬 */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["#ff5f56","#ffbd2e","#27c93f"].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "3px 14px", fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "0 auto" }}>
                    2026 스프링 리그 3R
                  </div>
                </div>
                {/* 쿼터 탭 */}
                <div style={{ display: "flex", gap: 8, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", overflowX: "auto" }}>
                  {[1, 2, 3, 4].map((q) => (
                    <button
                      key={q}
                      onClick={() => setActiveQ(q)}
                      className={`qtab${activeQ === q ? " on" : ""} ko`}
                      style={{ flexShrink: 0, padding: "8px 16px", borderRadius: 9999, fontSize: 14, fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", background: "transparent", color: activeQ === q ? "#4ade80" : "rgba(255,255,255,0.4)" }}
                    >
                      {q}쿼터
                    </button>
                  ))}
                </div>
                {/* 메인 콘텐츠 */}
                <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", minHeight: 400 }}>
                  {/* 필드 */}
                  <div className="field-bg" style={{ minHeight: 380, position: "relative" }}>
                    <div className="field-line-h" style={{ top: "50%" }} />
                    <div className="field-circle" style={{ width: 70, height: 70, top: "50%", left: "50%", marginTop: -35, marginLeft: -35 }} />
                    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 5 }}>
                      <div className="eyebrow" style={{ fontSize: 9, padding: "3px 10px", gap: 4 }}>
                        <iconify-icon icon="solar:widget-linear" style={{ fontSize: "10px" }} />
                        {data.label}
                      </div>
                    </div>
                    {data.players.map((p) => (
                      <div key={p.name} className="player-b" style={{ left: p.left, top: p.top }}>
                        <div className={`player-dot${p.pos === "GK" ? " gk" : ""}`}>{p.abbr}</div>
                        <div className="player-nm">{p.name}</div>
                      </div>
                    ))}
                  </div>
                  {/* 요약 패널 */}
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 14, padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <iconify-icon icon="solar:stars-bold" style={{ color: "#4ade80", fontSize: "14px" }} />
                        <span className="form-label">출전 균등 추천</span>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }} className="ko">선수별 출전 쿼터 수를 균등하게 배분합니다.</p>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>선수별 출전 현황</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {data.summary.map((p) => {
                          const total = p.quarters.reduce((a, b) => a + b, 0);
                          return (
                            <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{p.name}</span>
                              <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                                {p.quarters.map((v, qi) => (
                                  <div key={qi} style={{ width: 18, height: 18, borderRadius: 5, background: v ? "rgba(22,163,74,0.7)" : "rgba(255,255,255,0.06)", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: v ? "#fff" : "rgba(255,255,255,0.25)" }}>
                                    {v ? qi + 1 : "·"}
                                  </div>
                                ))}
                                <span style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", marginLeft: 6 }}>{total}Q</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ marginTop: "auto" }}>
                      <button className="btn-s ko" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", padding: "12px", fontSize: 14, color: "rgba(255,255,255,0.6)", background: "transparent", cursor: "pointer" }}>
                        <iconify-icon icon="solar:pen-new-square-linear" style={{ fontSize: "16px", color: "#4ade80" }} />
                        포메이션 변경하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal d2" style={{ textAlign: "center", marginTop: 48 }}>
              <Link href="/matches/new" className="btn-p" style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#16a34a", color: "#fff", fontWeight: 600, padding: "16px 32px", borderRadius: 9999, fontSize: 18, textDecoration: "none", minHeight: 52 }}>
                직접 만들어보기
                <span className="arr" style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <iconify-icon icon="solar:arrow-right-linear" style={{ fontSize: "13px" }} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 기능 벤토 ── */}
        <section id="features" style={{ padding: "96px 16px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>핵심 기능</div>
              <h2 className="ko font-display" style={{ fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#fff" }}>
                복잡한 계산을 서비스가 대신합니다
              </h2>
            </div>

            <div className="bento reveal d1">
              <div className="b-lg db-outer" style={{ borderRadius: "1.75rem" }}>
                <div className="db-inner" style={{ padding: "2rem", minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                      <iconify-icon icon="solar:graph-new-up-linear" style={{ color: "#4ade80", fontSize: "24px" }} />
                    </div>
                    <h3 className="ko font-display" style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>공평한 출전 분배</h3>
                    <p className="ko" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.8, fontSize: 15 }}>쿼터별 선발 배치를 자동으로 계산해 모든 선수가 비슷한 횟수로 출전할 수 있게 합니다. 출전 차이로 인한 갈등을 데이터로 해결하세요.</p>
                  </div>
                  <div style={{ marginTop: 24, background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 16 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>쿼터별 출전 분포</div>
                    {[["임도윤", "100%", 4], ["강태민", "75%", 3], ["오예린", "75%", 3], ["박민준", "75%", 3]].map(([name, w, cnt]) => (
                      <div key={name as string} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", width: 50, flexShrink: 0 }}>{name as string}</span>
                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                          <div style={{ width: w as string, height: "100%", background: "linear-gradient(90deg,#16a34a,#22c55e)", borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, width: 20, textAlign: "right" }}>{cnt as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {[
                { icon: "solar:user-id-bold-duotone", title: "포지션 적합성 반영", desc: "각 선수의 주포지션을 우선해 배치합니다. 필요 시 멀티포지션도 지원합니다." },
                { icon: "solar:refresh-circle-bold-duotone", title: "포메이션 변경 즉시 재계산", desc: "쿼터 포메이션을 바꾸면 전체 배치가 즉시 재계산됩니다. 여러 안을 빠르게 비교하세요." },
              ].map(({ icon, title, desc }, i) => (
                <div key={title} className={`b-sm db-outer${i === 1 ? " d2" : ""}`} style={{ borderRadius: "1.75rem" }}>
                  <div className="db-inner" style={{ padding: "1.75rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.18)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <iconify-icon icon={icon} style={{ color: "#4ade80", fontSize: "22px" }} />
                    </div>
                    <h3 className="ko font-display" style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{title}</h3>
                    <p className="ko" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal d2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 16 }}>
              {[
                { icon: "solar:gallery-send-linear", title: "PNG로 바로 공유", desc: "완성된 필드 배치안을 PNG 이미지로 내보내 카카오톡에 바로 공유하세요." },
                { icon: "solar:smartphone-linear", title: "모바일 완전 지원", desc: "경기 당일 스마트폰으로도 전체 기능을 사용할 수 있습니다. 회원가입 없이 3경기까지 무료 저장됩니다." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="db-outer" style={{ borderRadius: "1.75rem" }}>
                  <div className="db-inner" style={{ padding: "1.75rem", display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <iconify-icon icon={icon} style={{ color: "#4ade80", fontSize: "22px" }} />
                    </div>
                    <div>
                      <h3 className="ko font-display" style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{title}</h3>
                      <p className="ko" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8 }}>{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 사용 방법 ── */}
        <section id="how" style={{ padding: "96px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>사용 방법</div>
              <h2 className="ko font-display" style={{ fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#fff" }}>
                5단계로 끝납니다
              </h2>
            </div>

            <div className="reveal d1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16 }}>
              {[
                { num: 1, icon: "solar:users-group-two-rounded-linear", title: "선수 등록", desc: "이름, 포지션, 실력 점수 입력" },
                { num: 2, icon: "solar:calendar-add-linear", title: "경기 생성", desc: "날짜, 참가 선수 선택" },
                { num: 3, icon: "solar:widget-add-linear", title: "포메이션 선택", desc: "쿼터별 포메이션 설정" },
                { num: 4, icon: "solar:check-circle-bold-duotone", title: "추천 결과 확인", desc: "자동 추천 배치 검토 및 수정" },
                { num: 5, icon: "solar:export-linear", title: "저장·공유", desc: "PNG 내보내기 또는 저장" },
              ].map(({ num, icon, title, desc }, i) => (
                <div key={num} className={`db-outer d${i + 1}`} style={{ borderRadius: "1.75rem" }}>
                  <div className="db-inner" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,rgba(22,163,74,0.2),rgba(22,163,74,0.05))", border: "1px solid rgba(22,163,74,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="font-display" style={{ fontWeight: 800, fontSize: 18, color: "#4ade80" }}>{num}</span>
                    </div>
                    <iconify-icon icon={icon} style={{ fontSize: "28px", color: "#4ade80" }} />
                    <div>
                      <h4 className="ko" style={{ fontWeight: 700, color: "#fff", fontSize: 15, marginBottom: 4 }}>{title}</h4>
                      <p className="ko" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.6 }}>{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 사용자 후기 ── */}
        <section id="testimonials" style={{ padding: "96px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>사용자 후기</div>
              <h2 className="ko font-display" style={{ fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#fff" }}>
                감독들이 먼저 경험했습니다
              </h2>
            </div>

            <div className="test-grid reveal d1">
              {[
                { stars: 5, text: "매 경기 메모장에 선수 이름 적고 출전 횟수 계산하던 시절이 없어졌어요. 이제 경기 전 5분이면 배치가 끝납니다. 출전 불만도 줄었습니다.", name: "정민준", role: "강남 FC 대표", avatar: "jungminjun" },
                { stars: 5, text: "출전 공평성 때문에 팀원들 사이에 갈등이 생겼었는데, 이제 숫자로 보여줄 수 있으니 설득이 훨씬 쉬워졌습니다. 포메이션 바꿔도 즉시 재계산되는 게 특히 좋아요.", name: "하윤서", role: "마포 풋살 팀장", avatar: "hayunseo" },
                { stars: 4.5, text: "PNG로 바로 내보내서 카카오톡에 공유하는 기능이 제일 편합니다. 경기 당일 선수들한테 배치 이미지 보내주면 다들 바로 이해해요.", name: "이서진", role: "성동구 축구동호회 감독", avatar: "leeseojin" },
              ].map(({ stars, text, name, role, avatar }, i) => (
                <div key={name} className={`db-outer d${i + 1}`} style={{ borderRadius: "1.75rem" }}>
                  <div className="db-inner" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {Array.from({ length: Math.floor(stars) }).map((_, si) => (
                        <iconify-icon key={si} icon="solar:star-bold" style={{ color: "#facc15", fontSize: "14px" }} />
                      ))}
                      {stars % 1 !== 0 && <iconify-icon icon="solar:star-half-bold" style={{ color: "#facc15", fontSize: "14px" }} />}
                    </div>
                    <p className="ko" style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontSize: 14, flex: 1 }}>&ldquo;{text}&rdquo;</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://i.pravatar.cc/150?u=${avatar}`} alt={name} width={36} height={36} style={{ borderRadius: "50%", border: "2px solid rgba(22,163,74,0.3)" }} loading="lazy" decoding="async" />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{name}</div>
                        <div className="ko" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="cta" style={{ position: "relative", padding: "128px 16px", overflow: "hidden" }}>
          <div className="orb" style={{ width: 700, height: 700, background: "#16a34a", top: "50%", left: "50%", marginTop: -350, marginLeft: -350, opacity: 0.1 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent,rgba(5,5,5,0.4),transparent)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 10 }}>
            <div className="reveal">
              <div className="eyebrow" style={{ marginBottom: 24, margin: "0 auto 24px" }}>무료로 사용하기</div>
              <h2 className="ko font-display" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.2, color: "#fff", marginBottom: 24 }}>
                지금 바로 시작해보세요.
              </h2>
              <p className="ko" style={{ color: "rgba(255,255,255,0.5)", fontSize: 20, lineHeight: 1.8, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
                첫 경기 배치를 3분 안에 완성하세요.<br />회원가입 없이 바로 사용할 수 있습니다.
              </p>
              <Link href="/matches/new" className="btn-p" style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#16a34a", color: "#fff", fontWeight: 700, padding: "20px 40px", borderRadius: 9999, fontSize: 20, textDecoration: "none", minHeight: 60 }}>
                무료로 시작하기
                <span className="arr" style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <iconify-icon icon="solar:arrow-right-linear" style={{ fontSize: "14px" }} />
                </span>
              </Link>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 40 }}>
                {[["solar:shield-check-linear", "회원가입 불필요"], ["solar:smartphone-linear", "모바일 완전 지원"], ["solar:cloud-storage-linear", "3경기 무료 저장"]].map(([icon, label]) => (
                  <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                    <iconify-icon icon={icon as string} style={{ color: "#4ade80", fontSize: "16px" }} />
                    <span className="ko">{label as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 푸터 ── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 16px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#16a34a,#15803d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <iconify-icon icon="solar:football-linear" style={{ color: "#fff", fontSize: "15px" }} />
              </div>
              <span className="font-display" style={{ fontWeight: 800, color: "#fff" }}>SquadMaker</span>
            </div>
            <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24, fontSize: 14 }}>
              {[["#features", "기능"], ["#how", "사용법"], ["#testimonials", "사용자 후기"]].map(([href, label]) => (
                <a key={label} href={href} className="footer-link ko" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{label}</a>
              ))}
              <Link href="/matches/new" className="footer-link ko" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>바로 시작하기</Link>
            </nav>
            <div className="ko" style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>© 2026 SquadMaker</div>
          </div>
        </footer>
      </div>
    </>
  );
}
