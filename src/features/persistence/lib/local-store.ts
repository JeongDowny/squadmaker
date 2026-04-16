import {
  createInitialMatchDraft,
  createMatchPlayerFromTeamPlayer,
  type MatchEditorDraft,
  type MatchPlayerDraft,
  type TeamPlayerDraft,
} from "@/features/matches/lib/match-editor";

export const LOCAL_PLAYERS_KEY = "squadmaker:v1:players";
export const LOCAL_MATCHES_KEY = "squadmaker:v1:matches";
export const LOCAL_MATCH_LIMIT = 3;

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readLocalPlayers(): TeamPlayerDraft[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  return readJson<TeamPlayerDraft[]>(LOCAL_PLAYERS_KEY, []);
}

export function writeLocalPlayers(players: TeamPlayerDraft[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(LOCAL_PLAYERS_KEY, JSON.stringify(players));
}

export function readLocalMatches(): MatchEditorDraft[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  return readJson<MatchEditorDraft[]>(LOCAL_MATCHES_KEY, []).map(normalizeMatchDraft);
}

export function writeLocalMatches(matches: MatchEditorDraft[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(
    LOCAL_MATCHES_KEY,
    JSON.stringify(matches.slice(0, LOCAL_MATCH_LIMIT).map(normalizeMatchDraft))
  );
}

export function getLocalMatch(matchId: string) {
  return readLocalMatches().find((match) => match.matchId === matchId) ?? null;
}

export function upsertLocalMatch(match: MatchEditorDraft) {
  const matches = readLocalMatches();
  const existingIndex = matches.findIndex((currentMatch) => currentMatch.matchId === match.matchId);
  const nextMatches =
    existingIndex >= 0
      ? matches.map((currentMatch) =>
          currentMatch.matchId === match.matchId ? normalizeMatchDraft(match) : currentMatch
        )
      : [...matches, normalizeMatchDraft(match)];

  writeLocalMatches(nextMatches);
}

export function deleteLocalMatch(matchId: string) {
  writeLocalMatches(readLocalMatches().filter((match) => match.matchId !== matchId));
}

export function createLocalMatchDraft(matchId: string, teamPlayers = readLocalPlayers()) {
  return mergeMatchWithTeamPlayers(createInitialMatchDraft(matchId), teamPlayers);
}

export function mergeMatchWithTeamPlayers(
  match: MatchEditorDraft,
  teamPlayers: TeamPlayerDraft[]
): MatchEditorDraft {
  const existingPlayersById = new Map(match.players.map((player) => [player.id, player]));
  const teamPlayersById = new Map(teamPlayers.map((player) => [player.id, player]));
  const mergedPlayers = teamPlayers.map((teamPlayer) =>
    createMatchPlayerFromTeamPlayer(
      teamPlayer,
      existingPlayersById.get(teamPlayer.id)?.isIncluded ?? true
    )
  );
  const deletedPlayers = match.players
    .filter((player) => !teamPlayersById.has(player.id))
    .map<MatchPlayerDraft>((player) => ({
      ...player,
      name: player.name ? `${player.name} (삭제됨)` : "삭제된 선수",
      isIncluded: false,
    }));
  const availablePlayerIds = new Set([
    ...mergedPlayers.map((player) => player.id),
    ...deletedPlayers.map((player) => player.id),
  ]);

  return normalizeMatchDraft({
    ...match,
    players: [...mergedPlayers, ...deletedPlayers],
    lineups: removeMissingPlayersFromLineups(match.lineups ?? {}, availablePlayerIds),
  });
}

export function normalizeMatchDraft(match: MatchEditorDraft): MatchEditorDraft {
  return {
    ...match,
    quarters: match.quarters ?? [],
    players: match.players ?? [],
    lineups: match.lineups ?? {},
  };
}

function removeMissingPlayersFromLineups(
  lineups: Record<string, Record<string, string>>,
  availablePlayerIds: Set<string>
) {
  return Object.fromEntries(
    Object.entries(lineups).map(([quarterId, quarterLineup]) => [
      quarterId,
      Object.fromEntries(
        Object.entries(quarterLineup).filter(([, playerId]) => availablePlayerIds.has(playerId))
      ),
    ])
  );
}

function readJson<T>(key: string, fallback: T) {
  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}
