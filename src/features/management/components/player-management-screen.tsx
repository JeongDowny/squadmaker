"use client";

import { useEffect, useState, useTransition } from "react";
import {
  PLAYER_POSITION_OPTIONS,
  createEmptyTeamPlayer,
  type PlayerPosition,
  type TeamPlayerDraft,
} from "@/features/matches/lib/match-editor";
import {
  readLocalMatches,
  readLocalPlayers,
  writeLocalMatches,
  writeLocalPlayers,
} from "@/features/persistence/lib/local-store";
import { loadRemoteSnapshot, saveRemoteSnapshot } from "@/features/persistence/actions";

export function PlayerManagementScreen() {
  const [players, setPlayers] = useState<TeamPlayerDraft[]>([]);
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPlayers(readLocalPlayers());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  function addPlayer() {
    updatePlayers([...players, createEmptyTeamPlayer(players.length + 1)]);
  }

  function updatePlayers(nextPlayers: TeamPlayerDraft[]) {
    setPlayers(nextPlayers);
    writeLocalPlayers(nextPlayers);
  }

  function loadCloudData() {
    startTransition(async () => {
      const snapshot = await loadRemoteSnapshot();

      if (snapshot.authenticated) {
        writeLocalPlayers(snapshot.players);
        writeLocalMatches(snapshot.matches);
        setPlayers(snapshot.players);
      }

      setNotice(snapshot.message);
    });
  }

  function saveCloudData() {
    startTransition(async () => {
      const result = await saveRemoteSnapshot({
        players,
        matches: readLocalMatches(),
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
              Team
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              팀 관리
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              팀 선수의 이름과 주포지션을 빠르게 추가하고 수정합니다.
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
              onClick={addPlayer}
              className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              선수 생성
            </button>
          </div>
        </div>

        {notice ? (
          <div className="mt-4 rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
            {notice}
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          {players.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-8 text-center">
              <p className="text-sm font-semibold text-slate-900">아직 등록된 선수가 없습니다</p>
              <p className="mt-2 text-sm text-slate-500">
                선수 생성 버튼으로 팀 명단을 추가하세요.
              </p>
            </div>
          ) : (
            players.map((player, index) => (
              <article
                key={player.id}
                className="grid gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-4 sm:grid-cols-[1fr_180px_auto] sm:items-center"
              >
                <input
                  aria-label="선수 이름"
                  value={player.name}
                  onChange={(event) =>
                    updatePlayers(
                      players.map((currentPlayer) =>
                        currentPlayer.id === player.id
                          ? { ...currentPlayer, name: event.target.value }
                          : currentPlayer
                      )
                    )
                  }
                  className="h-10 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  placeholder="선수 이름"
                />
                <select
                  aria-label="주포지션"
                  value={player.primaryPosition}
                  onChange={(event) =>
                    updatePlayers(
                      players.map((currentPlayer) =>
                        currentPlayer.id === player.id
                          ? {
                              ...currentPlayer,
                              primaryPosition: event.target.value as PlayerPosition | "",
                            }
                          : currentPlayer
                      )
                    )
                  }
                  className="h-10 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="">주포지션 선택</option>
                  {PLAYER_POSITION_OPTIONS.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    updatePlayers(players.filter((_, currentIndex) => currentIndex !== index))
                  }
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
