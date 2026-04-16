"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMatchId } from "@/features/matches/lib/match-editor";
import {
  createLocalMatchDraft,
  LOCAL_MATCH_LIMIT,
  readLocalMatches,
  readLocalPlayers,
  upsertLocalMatch,
} from "@/features/persistence/lib/local-store";

export default function NewMatchPage() {
  const router = useRouter();

  useEffect(() => {
    const matches = readLocalMatches();

    if (matches.length >= LOCAL_MATCH_LIMIT) {
      router.replace("/matches?limit=1");
      return;
    }

    const match = createLocalMatchDraft(createMatchId(), readLocalPlayers());

    upsertLocalMatch(match);
    router.replace(`/matches/${match.matchId}`);
  }, [router]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-5 py-16">
      <div className="rounded-[28px] border border-slate-200 bg-white/92 px-6 py-7 text-center shadow-[0_28px_88px_-72px_rgba(15,23,42,0.72)]">
        <p className="text-sm font-semibold text-slate-950">새 경기를 준비하고 있습니다</p>
        <p className="mt-2 text-sm text-slate-500">팀 명단을 불러와 경기 편집 화면으로 이동합니다.</p>
      </div>
    </main>
  );
}
