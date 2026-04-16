import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const alt = "SquadMaker — 경기 전 선발 배치를 5분 안에";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PLAYERS: { abbr: string; pos: string; x: number; y: number; gk?: boolean }[] = [
  { abbr: "임", pos: "ST",  x: 50,  y: 10 },
  { abbr: "윤", pos: "LAM", x: 18,  y: 28 },
  { abbr: "강", pos: "CAM", x: 50,  y: 28 },
  { abbr: "배", pos: "RAM", x: 82,  y: 28 },
  { abbr: "오", pos: "DM",  x: 35,  y: 48 },
  { abbr: "한", pos: "DM",  x: 65,  y: 48 },
  { abbr: "이", pos: "LB",  x: 10,  y: 66 },
  { abbr: "최", pos: "CB",  x: 35,  y: 66 },
  { abbr: "김", pos: "CB",  x: 65,  y: 66 },
  { abbr: "정", pos: "RB",  x: 90,  y: 66 },
  { abbr: "박", pos: "GK",  x: 50,  y: 85, gk: true },
];

export default async function OGImage() {
  // 네트워크 의존성을 없애기 위해 번들된 폰트 파일을 직접 읽음
  const fontBold = readFileSync(
    join(process.cwd(), "public/fonts/NotoSansKR-Bold.woff2")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#050505",
          display: "flex",
          fontFamily: "'Noto Sans KR', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 그린 오브 */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 65%)",
            top: -150,
            right: 150,
            display: "flex",
          }}
        />

        {/* 왼쪽 텍스트 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 48px 64px 80px",
            flex: 1,
          }}
        >
          {/* 로고 */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              ⚽
            </div>
            <span style={{ fontSize: 38, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
              SquadMaker
            </span>
          </div>

          {/* 태그라인 — 줄별로 분리 */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 24, gap: 4 }}>
            <span style={{ fontSize: 54, fontWeight: 700, color: "#ffffff", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              경기 전 선발 배치,
            </span>
            <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
              <span style={{ fontSize: 54, fontWeight: 700, color: "#4ade80", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                5분 안에
              </span>
              <span style={{ fontSize: 54, fontWeight: 700, color: "#ffffff", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                완성
              </span>
            </div>
          </div>

          {/* 서브텍스트 */}
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 36 }}>
            쿼터별 포메이션 선택 → 공평한 출전 분배 → PNG 공유
          </span>

          {/* 배지 */}
          <div style={{ display: "flex", gap: 10 }}>
            {["출전 균등 분배", "포지션 적합성", "PNG 내보내기"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  background: "rgba(22,163,74,0.14)",
                  border: "1px solid rgba(22,163,74,0.35)",
                  borderRadius: 9999,
                  padding: "8px 18px",
                  fontSize: 15,
                  color: "#4ade80",
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 전술 보드 */}
        <div
          style={{
            width: 330,
            margin: "44px 64px 44px 0",
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* 크롬 헤더 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
              <div
                key={c}
                style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "flex" }}
              />
            ))}
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  display: "flex",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 5,
                  padding: "3px 12px",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                4-2-3-1
              </div>
            </div>
          </div>

          {/* 필드 */}
          <div
            style={{
              flex: 1,
              background: "linear-gradient(180deg, #1a5c29 0%, #1e6b31 50%, #1a5c29 100%)",
              position: "relative",
              display: "flex",
            }}
          >
            {/* 중앙선 */}
            <div
              style={{
                position: "absolute",
                left: "6%",
                right: "6%",
                top: "50%",
                height: 1,
                background: "rgba(255,255,255,0.18)",
                display: "flex",
              }}
            />
            {/* 중앙원 */}
            <div
              style={{
                position: "absolute",
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.18)",
                top: "50%",
                left: "50%",
                marginTop: -24,
                marginLeft: -24,
                display: "flex",
              }}
            />

            {/* 선수 마커 */}
            {PLAYERS.map((p) => (
              <div
                key={p.abbr + p.pos}
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: p.gk ? "rgba(250,204,21,0.95)" : "rgba(255,255,255,0.95)",
                    border: p.gk ? "2px solid rgba(161,98,7,0.8)" : "2px solid rgba(22,163,74,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 8,
                    fontWeight: 700,
                    color: p.gk ? "#713f12" : "#155728",
                  }}
                >
                  {p.abbr}
                </div>
                <span
                  style={{
                    fontSize: 7,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.pos}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 URL */}
        <span
          style={{
            position: "absolute",
            bottom: 28,
            left: 80,
            fontSize: 15,
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.05em",
          }}
        >
          squadmaker.vercel.app
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto Sans KR",
          data: fontBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
