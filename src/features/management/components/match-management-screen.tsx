"use client";

import { useEffect, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createMatchId } from "@/features/matches/lib/match-editor";
import {
  createLocalMatchDraft,
  deleteLocalMatch,
  LOCAL_MATCH_LIMIT,
  readLocalMatches,
  readLocalPlayers,
  upsertLocalMatch,
  writeLocalMatches,
} from "@/features/persistence/lib/local-store";
import type { MatchEditorDraft } from "@/features/matches/lib/match-editor";
import { loadRemoteSnapshot, saveRemoteSnapshot } from "@/features/persistence/actions";

export function MatchManagementScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchEditorDraft[]>([]);
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMatches(readLocalMatches());

      if (new URLSearchParams(window.location.search).has("limit")) {
        setNotice(`로컬 저장 경기는 최대 ${LOCAL_MATCH_LIMIT}개까지 만들 수 있습니다.`);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  function addMatch() {
    if (matches.length >= LOCAL_MATCH_LIMIT) {
      setNotice(`로컬 저장 경기는 최대 ${LOCAL_MATCH_LIMIT}개까지 만들 수 있습니다.`);
      return;
    }

    const nextMatch = createLocalMatchDraft(createMatchId(), readLocalPlayers());
    const nextMatches = [...matches, nextMatch];

    setMatches(nextMatches);
    upsertLocalMatch(nextMatch);
    setNotice("새 경기를 만들었습니다. 목록에서 경기를 눌러 수정하세요.");
  }

  function updateMatch(matchId: string, patch: Pick<MatchEditorDraft, "title" | "date">) {
    const nextMatches = matches.map((match) =>
      match.matchId === matchId ? { ...match, ...patch } : match
    );
    const nextMatch = nextMatches.find((match) => match.matchId === matchId);

    setMatches(nextMatches);

    if (nextMatch) {
      upsertLocalMatch(nextMatch);
    }
  }

  function removeMatch(matchId: string) {
    const nextMatches = matches.filter((match) => match.matchId !== matchId);

    setMatches(nextMatches);
    deleteLocalMatch(matchId);
    setNotice("경기를 삭제했습니다.");
  }

  function loadCloudData() {
    startTransition(async () => {
      const snapshot = await loadRemoteSnapshot();

      if (snapshot.authenticated) {
        writeLocalMatches(snapshot.matches);
        setMatches(snapshot.matches);
      }

      setNotice(snapshot.message);
    });
  }

  function saveCloudData() {
    startTransition(async () => {
      const result = await saveRemoteSnapshot({
        players: readLocalPlayers(),
        matches,
      });

      setNotice(result.message);
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-5 py-8 sm:px-8">
      <section className="rounded-[30px] border border-slate-200 bg-white/92 px-5 py-6 shadow-[0_28px_88px_-72px_rgba(15,23,42,0.72)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Matches
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              경기 관리
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              화면 안에서 경기 초안을 만들고 제목과 날짜를 빠르게 정리합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadCloudData}
              disabled={isPending}
              className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              클라우드 불러오기
            </button>
            <button
              type="button"
              onClick={saveCloudData}
              disabled={isPending}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800 transition hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              클라우드 저장
            </button>
            <button
              type="button"
              onClick={addMatch}
              disabled={matches.length >= LOCAL_MATCH_LIMIT}
              className={
                matches.length >= LOCAL_MATCH_LIMIT
                  ? "cursor-not-allowed rounded-full border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-400"
                  : "rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              }
            >
              경기 생성
            </button>
          </div>
        </div>

        {notice ? (
          <div className="mt-4 rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
            {notice}
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          {matches.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-8 text-center">
              <p className="text-sm font-semibold text-slate-900">아직 생성된 경기가 없습니다</p>
              <p className="mt-2 text-sm text-slate-500">
                경기 생성 버튼으로 관리 목록을 먼저 만들어보세요.
              </p>
            </div>
          ) : (
            matches.map((match) => (
              <article
                key={match.matchId}
                role="button"
                tabIndex={0}
                aria-label={`${match.title} 수정`}
                onClick={() => router.push(`/matches/${match.matchId}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    router.push(`/matches/${match.matchId}`);
                  }
                }}
                className="grid cursor-pointer gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-4 transition hover:border-emerald-300 hover:bg-emerald-50/50 sm:grid-cols-[1fr_180px_auto] sm:items-center"
              >
                <input
                  aria-label="경기 제목"
                  value={match.title}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) =>
                    updateMatch(match.matchId, {
                      title: event.target.value,
                      date: match.date,
                    })
                  }
                  className="h-10 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
                <input
                  aria-label="경기 날짜"
                  type="date"
                  value={match.date}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) =>
                    updateMatch(match.matchId, {
                      title: match.title,
                      date: event.target.value,
                    })
                  }
                  className="h-10 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
                <span className="rounded-full bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-700 sm:col-span-2">
                  카드 눌러 수정
                </span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeMatch(match.matchId);
                  }}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-rose-300 hover:text-rose-700"
                >
                  삭제
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
