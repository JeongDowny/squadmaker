import { ImageResponse } from "next/og";

export const alt = "SquadMaker — 경기 전 선발 배치를 5분 안에";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* 4-2-3-1 포메이션 선수 위치 (필드 내 상대 좌표, 공격방향=위) */
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

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#050505",
          display: "flex",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 그린 오브 */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(22,163,74,0.18) 0%, transparent 70%)",
            top: -100,
            right: 200,
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 36,
            }}
          >
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
            <span
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.04em",
              }}
            >
              SquadMaker
            </span>
          </div>

          {/* 태그라인 — 자식이 여러 개이므로 display: flex 필수 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 52,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.15,
              letterSpacing: "-0.04em",
              marginBottom: 24,
            }}
          >
            <span>경기 전 선발 배치,</span>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ color: "#4ade80" }}>5분 안에</span>
              <span>완성</span>
            </div>
          </div>

          {/* 서브 */}
          <span
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.6,
              maxWidth: 440,
            }}
          >
            쿼터별 포메이션 선택 → 공평한 출전 분배 자동 계산 → PNG 공유
          </span>

          {/* 배지 */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 36,
            }}
          >
            {["출전 균등 분배", "포지션 적합성", "PNG 내보내기"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  background: "rgba(22,163,74,0.12)",
                  border: "1px solid rgba(22,163,74,0.3)",
                  borderRadius: 9999,
                  padding: "8px 18px",
                  fontSize: 16,
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
            width: 340,
            margin: "40px 60px 40px 0",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
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
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
              <div
                key={c}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: c,
                  display: "flex",
                }}
              />
            ))}
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 6,
                  padding: "3px 12px",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
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
              background: "linear-gradient(180deg, #1b5e2b 0%, #1e6b31 50%, #1b5e2b 100%)",
              position: "relative",
              display: "flex",
            }}
          >
            {/* 중앙선 */}
            <div
              style={{
                position: "absolute",
                left: "5%",
                right: "5%",
                top: "50%",
                height: 1,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
              }}
            />
            {/* 중앙원 */}
            <div
              style={{
                position: "absolute",
                width: 50,
                height: 50,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                top: "50%",
                left: "50%",
                marginTop: -25,
                marginLeft: -25,
                display: "flex",
              }}
            />

            {/* 선수 배치 */}
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
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: p.gk
                      ? "rgba(250,204,21,0.95)"
                      : "rgba(255,255,255,0.95)",
                    border: p.gk
                      ? "2px solid rgba(161,98,7,0.8)"
                      : "2px solid rgba(22,163,74,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 800,
                    color: p.gk ? "#713f12" : "#155728",
                  }}
                >
                  {p.abbr}
                </div>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.9)",
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
            fontSize: 16,
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.04em",
          }}
        >
          squadmaker.vercel.app
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
