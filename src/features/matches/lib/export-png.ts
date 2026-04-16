import type { FormationSlot, MatchPlayerDraft } from "./match-editor";

type ExportOptions = {
  title: string;
  quarterId: string;
  formation: string;
  slots: FormationSlot[];
  lineup: Record<string, string>;
  players: MatchPlayerDraft[];
};

const CANVAS_W = 560;
const HEADER_H = 64;
const FIELD_CARD_H = 720; // 7:9 비율
const CANVAS_H = HEADER_H + FIELD_CARD_H + 16; // 하단 여백
const FIELD_PADDING = 16;
const SCALE = 2; // 레티나 대응

export function exportLineupAsPng(options: ExportOptions): void {
  const { title, quarterId, formation, slots, lineup, players } = options;

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W * SCALE;
  canvas.height = CANVAS_H * SCALE;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.scale(SCALE, SCALE);

  const playersById = new Map(players.map((p) => [p.id, p]));

  drawHeader(ctx, title, quarterId, formation);
  drawFieldCard(ctx, slots, lineup, playersById);
  triggerDownload(canvas, title, quarterId);
}

function drawHeader(
  ctx: CanvasRenderingContext2D,
  title: string,
  quarterId: string,
  formation: string
) {
  // 헤더 배경
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CANVAS_W, HEADER_H);

  // 하단 구분선
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(0, HEADER_H - 1, CANVAS_W, 1);

  // 경기 제목
  ctx.fillStyle = "#0f172a";
  ctx.font = `bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(title || "경기", 20, 28);

  // 쿼터 + 포메이션 정보
  ctx.fillStyle = "#059669";
  ctx.font = `600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(`${quarterId} · ${formation}`, 20, 48);

  // 브랜드
  ctx.fillStyle = "#94a3b8";
  ctx.font = `500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText("SquadMaker", CANVAS_W - 20, 48);
  ctx.textAlign = "left";
}

function drawFieldCard(
  ctx: CanvasRenderingContext2D,
  slots: FormationSlot[],
  lineup: Record<string, string>,
  playersById: Map<string, MatchPlayerDraft>
) {
  const fx = FIELD_PADDING;
  const fy = HEADER_H;
  const fw = CANVAS_W - FIELD_PADDING * 2;
  const fh = FIELD_CARD_H;

  // 필드 배경 (초록 그라디언트)
  const grad = ctx.createLinearGradient(fx, fy, fx, fy + fh);
  grad.addColorStop(0, "#12573f");
  grad.addColorStop(0.52, "#0f4e3d");
  grad.addColorStop(1, "#0b3f33");

  ctx.save();
  roundRect(ctx, fx, fy, fw, fh, 24);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  drawFieldLines(ctx, fx, fy, fw, fh);
  drawSlots(ctx, fx, fy, fw, fh, slots, lineup, playersById);
}

function drawFieldLines(
  ctx: CanvasRenderingContext2D,
  fx: number,
  fy: number,
  fw: number,
  fh: number
) {
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1;

  // 외곽선 (inner border)
  const inset = 12;
  ctx.save();
  roundRect(ctx, fx + inset, fy + inset, fw - inset * 2, fh - inset * 2, 20);
  ctx.stroke();
  ctx.restore();

  // 하프라인
  const midY = fy + fh / 2;
  ctx.beginPath();
  ctx.moveTo(fx + inset, midY);
  ctx.lineTo(fx + fw - inset, midY);
  ctx.stroke();

  // 센터 서클
  ctx.beginPath();
  ctx.arc(fx + fw / 2, midY, 48, 0, Math.PI * 2);
  ctx.stroke();

  // 센터 도트
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(fx + fw / 2, midY, 3, 0, Math.PI * 2);
  ctx.fill();

  // 상단 페널티 박스
  const pbW = fw * 0.58;
  const pbH = fh * 0.18;
  ctx.save();
  roundRect(ctx, fx + (fw - pbW) / 2, fy + inset, pbW, pbH, [0, 0, 18, 18]);
  ctx.stroke();
  ctx.restore();

  // 상단 골박스
  const gbW = fw * 0.28;
  const gbH = fh * 0.08;
  ctx.save();
  roundRect(ctx, fx + (fw - gbW) / 2, fy + inset, gbW, gbH, [0, 0, 12, 12]);
  ctx.stroke();
  ctx.restore();

  // 상단 페널티 도트
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath();
  ctx.arc(fx + fw / 2, fy + fh * 0.26, 3, 0, Math.PI * 2);
  ctx.fill();

  // 하단 페널티 박스
  ctx.save();
  roundRect(ctx, fx + (fw - pbW) / 2, fy + fh - inset - pbH, pbW, pbH, [18, 18, 0, 0]);
  ctx.stroke();
  ctx.restore();

  // 하단 골박스
  ctx.save();
  roundRect(ctx, fx + (fw - gbW) / 2, fy + fh - inset - gbH, gbW, gbH, [12, 12, 0, 0]);
  ctx.stroke();
  ctx.restore();

  // 하단 페널티 도트
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath();
  ctx.arc(fx + fw / 2, fy + fh * 0.74, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawSlots(
  ctx: CanvasRenderingContext2D,
  fx: number,
  fy: number,
  fw: number,
  fh: number,
  slots: FormationSlot[],
  lineup: Record<string, string>,
  playersById: Map<string, MatchPlayerDraft>
) {
  for (const slot of slots) {
    const topPct = parseFloat(slot.top) / 100;
    const leftPct = parseFloat(slot.left) / 100;
    const cx = fx + leftPct * fw;
    const cy = fy + topPct * fh;

    const playerId = lineup[slot.id];
    const player = playerId ? playersById.get(playerId) : undefined;
    const playerName = player?.name?.trim() || "";
    const isEmpty = !playerName;

    drawSlotCard(ctx, cx, cy, slot.role, playerName, isEmpty);
  }
}

function drawSlotCard(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  role: string,
  playerName: string,
  isEmpty: boolean
) {
  const cardW = 70;
  const cardH = 36;
  const rx = cx - cardW / 2;
  const ry = cy - cardH / 2;
  const radius = 10;

  // 카드 배경
  ctx.save();
  roundRect(ctx, rx, ry, cardW, cardH, radius);

  if (isEmpty) {
    ctx.fillStyle = "rgba(255,255,255,0.18)";
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.94)";
  }
  ctx.fill();

  // 카드 테두리
  ctx.strokeStyle = isEmpty ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.12)";
  ctx.lineWidth = 0.5;
  ctx.stroke();
  ctx.restore();

  // 포지션 텍스트
  ctx.fillStyle = isEmpty ? "rgba(167,243,208,0.75)" : "#059669";
  ctx.font = `bold 8px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(role.toUpperCase(), cx, ry + 13);

  // 선수 이름
  ctx.fillStyle = isEmpty ? "rgba(255,255,255,0.55)" : "#0f172a";
  ctx.font = `600 10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";

  const displayName = isEmpty ? "빈 슬롯" : truncateText(ctx, playerName, cardW - 8);
  ctx.fillText(displayName, cx, ry + 27);

  ctx.textAlign = "left";
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) {
    return text;
  }
  let truncated = text;
  while (truncated.length > 1 && ctx.measureText(truncated + "…").width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + "…";
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number | [number, number, number, number]
) {
  const r = typeof radius === "number" ? [radius, radius, radius, radius] : radius;
  ctx.beginPath();
  ctx.moveTo(x + r[0], y);
  ctx.lineTo(x + w - r[1], y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r[1]);
  ctx.lineTo(x + w, y + h - r[2]);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
  ctx.lineTo(x + r[3], y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r[3]);
  ctx.lineTo(x, y + r[0]);
  ctx.quadraticCurveTo(x, y, x + r[0], y);
  ctx.closePath();
}

function triggerDownload(canvas: HTMLCanvasElement, title: string, quarterId: string) {
  const safeName = (title || "경기").replace(/[/\\?%*:|"<>]/g, "-");
  const link = document.createElement("a");
  link.download = `${safeName}_${quarterId}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
