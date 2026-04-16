"use server";

import type { Prisma } from "@prisma/client";
import type { MatchEditorDraft, TeamPlayerDraft } from "@/features/matches/lib/match-editor";
import { getPrismaClient, hasDatabaseEnv } from "@/lib/prisma";
import { getSupabaseUser } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { LOCAL_MATCH_LIMIT } from "@/features/persistence/lib/local-store";

export type RemoteSnapshot = {
  configured: boolean;
  authenticated: boolean;
  players: TeamPlayerDraft[];
  matches: MatchEditorDraft[];
  message: string;
};

export async function loadRemoteSnapshot(): Promise<RemoteSnapshot> {
  if (!hasSupabaseEnv() || !hasDatabaseEnv()) {
    return emptySnapshot("Supabase 또는 DATABASE_URL이 설정되지 않았습니다.");
  }

  const user = await getSupabaseUser();
  const prisma = getPrismaClient();

  if (!user || !prisma) {
    return emptySnapshot("로그인 후 클라우드 저장을 사용할 수 있습니다.", true);
  }

  const [players, matches] = await Promise.all([
    prisma.player.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.match.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return {
    configured: true,
    authenticated: true,
    players: players.map((player) => ({
      id: player.id,
      name: player.name,
      primaryPosition: player.primaryPosition as TeamPlayerDraft["primaryPosition"],
      secondaryPositions: player.secondaryPositions as TeamPlayerDraft["secondaryPositions"],
    })),
    matches: matches.map((match) => match.draft as unknown as MatchEditorDraft),
    message: "클라우드 데이터를 불러왔습니다.",
  };
}

export async function saveRemoteSnapshot({
  players,
  matches,
}: {
  players: TeamPlayerDraft[];
  matches: MatchEditorDraft[];
}) {
  if (!hasSupabaseEnv() || !hasDatabaseEnv()) {
    return {
      ok: false,
      message: "Supabase 또는 DATABASE_URL이 설정되지 않았습니다.",
    };
  }

  if (matches.length > LOCAL_MATCH_LIMIT) {
    return {
      ok: false,
      message: `클라우드 저장 경기는 최대 ${LOCAL_MATCH_LIMIT}개까지 가능합니다.`,
    };
  }

  const user = await getSupabaseUser();
  const prisma = getPrismaClient();

  if (!user || !prisma) {
    return {
      ok: false,
      message: "로그인 후 클라우드 저장을 사용할 수 있습니다.",
    };
  }

  await prisma.$transaction([
    prisma.player.deleteMany({
      where: {
        userId: user.id,
        id: {
          notIn: players.map((player) => player.id),
        },
      },
    }),
    prisma.match.deleteMany({
      where: {
        userId: user.id,
        id: {
          notIn: matches.map((match) => match.matchId),
        },
      },
    }),
    ...players.map((player) =>
      prisma.player.upsert({
        where: { id: player.id },
        create: {
          id: player.id,
          userId: user.id,
          name: player.name.trim(),
          primaryPosition: player.primaryPosition,
          secondaryPositions: player.secondaryPositions as unknown as Prisma.InputJsonValue,
        },
        update: {
          name: player.name.trim(),
          primaryPosition: player.primaryPosition,
          secondaryPositions: player.secondaryPositions as unknown as Prisma.InputJsonValue,
        },
      })
    ),
    ...matches.map((match) =>
      prisma.match.upsert({
        where: { id: match.matchId },
        create: {
          id: match.matchId,
          userId: user.id,
          title: match.title.trim(),
          date: match.date,
          draft: match as unknown as Prisma.InputJsonValue,
        },
        update: {
          title: match.title.trim(),
          date: match.date,
          draft: match as unknown as Prisma.InputJsonValue,
        },
      })
    ),
  ]);

  return {
    ok: true,
    message: "클라우드에 저장했습니다.",
  };
}

function emptySnapshot(message: string, configured = false): RemoteSnapshot {
  return {
    configured,
    authenticated: false,
    players: [],
    matches: [],
    message,
  };
}
