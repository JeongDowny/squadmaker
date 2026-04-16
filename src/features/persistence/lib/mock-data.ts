import {
  createQuarterDraft,
  type MatchEditorDraft,
  type TeamPlayerDraft,
} from "@/features/matches/lib/match-editor";
import {
  LOCAL_MATCHES_KEY,
  LOCAL_PLAYERS_KEY,
  writeLocalMatches,
  writeLocalPlayers,
} from "./local-store";

// 처음 방문한 사용자에게 보여줄 샘플 선수 명단 (17명)
const MOCK_PLAYERS: TeamPlayerDraft[] = [
  { id: "player-1-mock0001", name: "김민준", primaryPosition: "GK",  secondaryPositions: ["", ""] },
  { id: "player-2-mock0002", name: "이서준", primaryPosition: "GK",  secondaryPositions: ["", ""] },
  { id: "player-3-mock0003", name: "박도현", primaryPosition: "CB",  secondaryPositions: ["LB", ""] },
  { id: "player-4-mock0004", name: "최준혁", primaryPosition: "CB",  secondaryPositions: ["RB", ""] },
  { id: "player-5-mock0005", name: "정하윤", primaryPosition: "CB",  secondaryPositions: ["CDM", ""] },
  { id: "player-6-mock0006", name: "강민서", primaryPosition: "LB",  secondaryPositions: ["LM", ""] },
  { id: "player-7-mock0007", name: "윤재원", primaryPosition: "RB",  secondaryPositions: ["RM", ""] },
  { id: "player-8-mock0008", name: "오성진", primaryPosition: "CDM", secondaryPositions: ["CB", ""] },
  { id: "player-9-mock0009", name: "한지훈", primaryPosition: "CDM", secondaryPositions: ["CM", ""] },
  { id: "player-10-mock010", name: "배민규", primaryPosition: "CM",  secondaryPositions: ["CAM", "CDM"] },
  { id: "player-11-mock011", name: "임수현", primaryPosition: "CAM", secondaryPositions: ["CM", ""] },
  { id: "player-12-mock012", name: "신동현", primaryPosition: "LM",  secondaryPositions: ["LW", ""] },
  { id: "player-13-mock013", name: "류지호", primaryPosition: "RM",  secondaryPositions: ["RW", ""] },
  { id: "player-14-mock014", name: "장성민", primaryPosition: "ST",  secondaryPositions: ["LW", ""] },
  { id: "player-15-mock015", name: "백준서", primaryPosition: "ST",  secondaryPositions: ["RW", ""] },
  { id: "player-16-mock016", name: "노태양", primaryPosition: "LW",  secondaryPositions: ["ST", "LM"] },
  { id: "player-17-mock017", name: "고명준", primaryPosition: "RW",  secondaryPositions: ["ST", "RM"] },
];

function buildMockMatch(): MatchEditorDraft {
  const players = MOCK_PLAYERS.map((p) => ({ ...p, isIncluded: true }));

  return {
    matchId: "match-mock-20260420-000000-sample",
    title: "4월 20일 경기 (예시)",
    date: "2026-04-20",
    // 쿼터별 포메이션 미리 설정 — 라인업은 비워둬서 추천 기능을 바로 사용할 수 있게
    quarters: [
      createQuarterDraft(1, "4-4-2"),
      createQuarterDraft(2, "4-3-3"),
      createQuarterDraft(3, "4-2-3-1"),
      createQuarterDraft(4, "4-4-2"),
    ],
    players,
    lineups: {},
  };
}

/**
 * localStorage가 완전히 비어 있을 때만 샘플 데이터를 시딩한다.
 * 한 번이라도 선수 또는 경기를 저장한 적 있으면 건드리지 않는다.
 */
export function seedMockDataIfEmpty() {
  if (typeof window === "undefined") return;

  const hasPlayers = window.localStorage.getItem(LOCAL_PLAYERS_KEY) !== null;
  const hasMatches = window.localStorage.getItem(LOCAL_MATCHES_KEY) !== null;

  if (hasPlayers || hasMatches) return;

  writeLocalPlayers(MOCK_PLAYERS);
  writeLocalMatches([buildMockMatch()]);
}
