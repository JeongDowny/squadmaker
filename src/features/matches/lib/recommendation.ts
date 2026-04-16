import type {
  FormationSlot,
  MatchPlayerDraft,
  MatchQuarterDraft,
  PlayerPosition,
} from "@/features/matches/lib/match-editor";

export type RecommendationSlot = {
  slot: FormationSlot;
  player: MatchPlayerDraft;
  fitScore: number;
};

export type QuarterRecommendation = {
  quarterId: string;
  formation: string;
  slots: RecommendationSlot[];
};

export type RecommendationResult = {
  title: string;
  description: string;
  quarters: QuarterRecommendation[];
  playerAppearances: Record<string, number>;
};

type ScoredPlayer = {
  player: MatchPlayerDraft;
  fitScore: number;
  appearances: number;
};

const ADJACENT_POSITIONS: Partial<Record<PlayerPosition, PlayerPosition[]>> = {
  CB: ["LB", "RB"],
  LB: ["CB", "LM"],
  RB: ["CB", "RM"],
  CDM: ["CM", "CB"],
  CM: ["CAM", "CDM"],
  CAM: ["CM", "ST"],
  LM: ["LW", "LB"],
  RM: ["RW", "RB"],
  LW: ["LM", "ST"],
  RW: ["RM", "ST"],
  ST: ["CAM", "LW", "RW"],
};

export function getRecommendationIssues(
  players: MatchPlayerDraft[],
  quarters: MatchQuarterDraft[]
) {
  const availablePlayers = getAvailablePlayers(players);
  const issues: string[] = [];

  if (quarters.length === 0) {
    issues.push("쿼터를 1개 이상 추가하세요.");
  }

  if (availablePlayers.length < 11) {
    issues.push(`참가 선수로 표시된 선수가 ${11 - availablePlayers.length}명 더 필요합니다.`);
  }

  return issues;
}

export function createLineupRecommendation(
  players: MatchPlayerDraft[],
  quarters: MatchQuarterDraft[]
): RecommendationResult | null {
  const availablePlayers = getAvailablePlayers(players);

  if (getRecommendationIssues(players, quarters).length > 0) {
    return null;
  }

  const playerAppearances: Record<string, number> = Object.fromEntries(
    players.map((player) => [player.id, 0])
  );
  const recommendedQuarters = quarters.map((quarter) => {
    const remainingPlayers = [...availablePlayers];
    const slots = quarter.slots.map((slot) => {
      const slotPosition = normalizeSlotRole(slot.role);
      const candidates =
        slotPosition !== "GK" &&
        remainingPlayers.some((player) => player.primaryPosition !== "GK")
          ? remainingPlayers.filter((player) => player.primaryPosition !== "GK")
          : remainingPlayers;
      const selected = candidates
        .map<ScoredPlayer>((player) => ({
          player,
          fitScore: getPositionFitScore(player, slot),
          appearances: playerAppearances[player.id] ?? 0,
        }))
        .sort((left, right) => {
          if (left.appearances !== right.appearances) {
            return left.appearances - right.appearances;
          }

          if (right.fitScore !== left.fitScore) {
            return right.fitScore - left.fitScore;
          }

          return (
            availablePlayers.findIndex((player) => player.id === left.player.id) -
            availablePlayers.findIndex((player) => player.id === right.player.id)
          );
        })[0];

      remainingPlayers.splice(
        remainingPlayers.findIndex((player) => player.id === selected.player.id),
        1
      );
      playerAppearances[selected.player.id] =
        (playerAppearances[selected.player.id] ?? 0) + 1;

      return {
        slot,
        player: selected.player,
        fitScore: selected.fitScore,
      };
    });

    return {
      quarterId: quarter.id,
      formation: quarter.formation,
      slots,
    };
  });

  return {
    title: "출전 균등 추천",
    description: "참가 선수의 출전 쿼터 수가 최대한 고르게 배치되도록 추천합니다.",
    quarters: recommendedQuarters,
    playerAppearances,
  };
}

function getAvailablePlayers(players: MatchPlayerDraft[]) {
  return players.filter(
    (player) =>
      player.isIncluded &&
      player.name.trim().length > 0 &&
      player.primaryPosition
  );
}

function getPositionFitScore(player: MatchPlayerDraft, slot: FormationSlot) {
  const slotPosition = normalizeSlotRole(slot.role);

  if (player.primaryPosition === slotPosition) {
    return 1;
  }

  if (player.secondaryPositions.includes(slotPosition)) {
    return 0.7;
  }

  if (
    player.primaryPosition &&
    ADJACENT_POSITIONS[player.primaryPosition]?.includes(slotPosition)
  ) {
    return 0.4;
  }

  return 0.1;
}

function normalizeSlotRole(role: string): PlayerPosition {
  if (role === "LCB" || role === "RCB") {
    return "CB";
  }

  if (role === "LST" || role === "RST") {
    return "ST";
  }

  if (role === "LWB") {
    return "LB";
  }

  if (role === "RWB") {
    return "RB";
  }

  return role as PlayerPosition;
}
