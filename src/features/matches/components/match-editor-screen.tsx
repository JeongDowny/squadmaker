"use client";

import { useEffect, useState, type DragEvent, type ReactNode } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type UseFormRegisterReturn,
} from "react-hook-form";
import {
  FORMATION_OPTIONS,
  PLAYER_POSITION_OPTIONS,
  comparePlayersByPosition,
  createEmptyPlayer,
  createQuarterDraft,
  createQuarterWithFormation,
  type FormationName,
  type FormationSlot,
  type MatchEditorDraft,
  type MatchPlayerDraft,
} from "@/features/matches/lib/match-editor";
import {
  createLineupRecommendation,
  getRecommendationIssues,
  type RecommendationSlot,
} from "@/features/matches/lib/recommendation";
import {
  getLocalMatch,
  mergeMatchWithTeamPlayers,
  normalizeMatchDraft,
  readLocalPlayers,
  upsertLocalMatch,
  writeLocalPlayers,
} from "@/features/persistence/lib/local-store";
import { exportLineupAsPng } from "@/features/matches/lib/export-png";

const EMPTY_PLAYERS: MatchPlayerDraft[] = [];
const EMPTY_QUARTERS: MatchEditorDraft["quarters"] = [];
const EMPTY_LINEUPS: MatchEditorDraft["lineups"] = {};

export function MatchEditorScreen({
  initialDraft,
}: {
  initialDraft: MatchEditorDraft;
}) {
  const [activeQuarterId, setActiveQuarterId] = useState<string | null>(
    initialDraft.quarters[0]?.id ?? null
  );
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
  const [recommendationRequested, setRecommendationRequested] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const { control, register, reset, setValue } = useForm<MatchEditorDraft>({
    defaultValues: initialDraft,
  });
  const {
    fields: playerFields,
    append: appendPlayerField,
  } = useFieldArray({
    control,
    name: "players",
  });
  const {
    fields: quarterFields,
    append: appendQuarterField,
    remove: removeQuarterField,
    update: updateQuarterField,
  } = useFieldArray({
    control,
    name: "quarters",
  });
  const players = useWatch({
    control,
    name: "players",
  }) ?? EMPTY_PLAYERS;
  const quarters = useWatch({
    control,
    name: "quarters",
  }) ?? EMPTY_QUARTERS;
  const title = useWatch({
    control,
    name: "title",
  }) ?? initialDraft.title;
  const date = useWatch({
    control,
    name: "date",
  }) ?? initialDraft.date;
  const lineups = useWatch({
    control,
    name: "lineups",
  }) ?? EMPTY_LINEUPS;
  const recommendationIssues = getRecommendationIssues(players, quarters);
  const activeQuarter =
    quarters.find((quarter) => quarter.id === activeQuarterId) ?? quarters[0];
  const activeLineup = activeQuarter ? lineups[activeQuarter.id] ?? {} : {};
  const playerAppearances = countPlayerAppearances(lineups, players);
  const sortedPlayerEntries = playerFields
    .map((field, index) => ({
      field,
      index,
      player: players[index] ?? field,
    }))
    .sort((left, right) => comparePlayersByPosition(left.player, right.player));

  useEffect(() => {
    const storedMatch = getLocalMatch(initialDraft.matchId);
    const mergedMatch = mergeMatchWithTeamPlayers(
      storedMatch ?? initialDraft,
      readLocalPlayers()
    );

    const timeout = window.setTimeout(() => {
      reset(mergedMatch);
      setActiveQuarterId(mergedMatch.quarters[0]?.id ?? null);
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [initialDraft, reset]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const nextDraft = normalizeMatchDraft({
        ...initialDraft,
        title,
        date,
        players,
        quarters,
        lineups,
      });

      upsertLocalMatch(nextDraft);
      syncTeamPlayersFromMatch(players);
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [date, hydrated, initialDraft, lineups, players, quarters, title]);

  function appendPlayer() {
    const newPlayer = createEmptyPlayer(playerFields.length + 1);
    const teamPlayers = readLocalPlayers();

    writeLocalPlayers([
      ...teamPlayers,
      {
        id: newPlayer.id,
        name: newPlayer.name,
        primaryPosition: newPlayer.primaryPosition,
        secondaryPositions: newPlayer.secondaryPositions,
      },
    ]);
    appendPlayerField(newPlayer);
    setExpandedPlayerId(newPlayer.id);
  }

  function appendQuarter() {
    const nextQuarter = createQuarterDraft(quarterFields.length + 1);

    appendQuarterField(nextQuarter);
    setActiveQuarterId(nextQuarter.id);
  }

  function removeQuarter(index: number) {
    const removedQuarterId = quarters[index]?.id;
    const nextQuarter = quarters[index + 1] ?? quarters[index - 1] ?? null;

    removeQuarterField(index);

    if (activeQuarterId === removedQuarterId) {
      setActiveQuarterId(nextQuarter?.id ?? null);
    }
  }

  function updateQuarterFormation(index: number, formation: FormationName) {
    const quarter = quarters[index];

    if (!quarter) {
      return;
    }

    updateQuarterField(index, createQuarterWithFormation(quarter, formation));

    if (recommendationRequested) {
      const nextQuarters = quarters.map((currentQuarter, currentIndex) =>
        currentIndex === index ? createQuarterWithFormation(currentQuarter, formation) : currentQuarter
      );
      const recommendation = createLineupRecommendation(players, nextQuarters);

      if (recommendation) {
        setValue("lineups", {
          ...lineups,
          [quarter.id]: recommendationToLineup(recommendation)[quarter.id] ?? {},
        });
      }
    } else {
      setValue("lineups", {
        ...lineups,
        [quarter.id]: {},
      });
    }
  }

  function applyRecommendation() {
    const recommendation = createLineupRecommendation(players, quarters);

    if (!recommendation) {
      return;
    }

    setRecommendationRequested(true);
    setValue("lineups", recommendationToLineup(recommendation), {
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  function updateActiveQuarterLineup(nextQuarterLineup: Record<string, string>) {
    if (!activeQuarter) {
      return;
    }

    setValue(
      "lineups",
      {
        ...lineups,
        [activeQuarter.id]: nextQuarterLineup,
      },
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    );
  }

  function assignPlayerToSlot(playerId: string, targetSlotId: string, sourceSlotId?: string) {
    const nextQuarterLineup = { ...activeLineup };
    const previousSlotId = Object.entries(nextQuarterLineup).find(
      ([, currentPlayerId]) => currentPlayerId === playerId
    )?.[0];
    const targetPlayerId = nextQuarterLineup[targetSlotId];

    if (sourceSlotId) {
      if (targetPlayerId) {
        nextQuarterLineup[sourceSlotId] = targetPlayerId;
      } else {
        delete nextQuarterLineup[sourceSlotId];
      }
    } else if (previousSlotId) {
      delete nextQuarterLineup[previousSlotId];
    }

    nextQuarterLineup[targetSlotId] = playerId;
    updateActiveQuarterLineup(nextQuarterLineup);
  }

  function removePlayerFromLineups(playerId: string) {
    setValue(
      "lineups",
      Object.fromEntries(
        Object.entries(lineups).map(([quarterId, quarterLineup]) => [
          quarterId,
          Object.fromEntries(
            Object.entries(quarterLineup).filter(([, currentPlayerId]) => currentPlayerId !== playerId)
          ),
        ])
      ),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    );
  }

  function handlePlayerIncludeChange(playerId: string, checked: boolean) {
    if (!checked) {
      removePlayerFromLineups(playerId);
    }
  }

  function handlePlayerCardClick(playerId: string) {
    if (selectedSlotId) {
      assignPlayerToSlot(playerId, selectedSlotId);
      setSelectedSlotId(null);
      return;
    }

    setExpandedPlayerId((current) => (current === playerId ? null : playerId));
  }

  function handleSlotDrop(event: DragEvent<HTMLDivElement>, slotId: string) {
    event.preventDefault();

    const payload = event.dataTransfer.getData("text/plain");
    const parsedPayload = parseDragPayload(payload);

    if (!parsedPayload) {
      return;
    }

    assignPlayerToSlot(parsedPayload.playerId, slotId, parsedPayload.slotId);
  }

  function handleSlotClick(slotId: string) {
    setSelectedSlotId((current) => (current === slotId ? null : slotId));
  }

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-3 px-3 py-3 sm:px-5 sm:py-4">
      <section className="rounded-[22px] border border-emerald-200/80 bg-white/88 px-4 py-3 shadow-[0_24px_72px_-64px_rgba(15,118,110,0.55)] backdrop-blur">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px] md:items-end">
          <EditorInput
            label="경기 이름"
            input={
              <input
                {...register("title")}
                aria-label="경기 이름"
                className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="예: 토요 아침전"
              />
            }
          />
          <EditorInput
            label="경기 날짜"
            input={
              <input
                {...register("date")}
                aria-label="경기 날짜"
                type="date"
                className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            }
          />
        </div>
      </section>

      <section className="grid justify-center gap-3 xl:grid-cols-[minmax(0,700px)_minmax(320px,360px)] xl:items-start">
        <div className="space-y-3">
          <section className="rounded-[26px] border border-slate-200 bg-white/92 p-3 shadow-[0_28px_88px_-72px_rgba(15,23,42,0.72)] sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Match Setup
                </p>
                <h1 className="mt-1 text-[1.35rem] font-semibold tracking-tight text-slate-950 sm:text-[1.55rem]">
                  쿼터와 포메이션 설정
                </h1>
              </div>
              <button
                type="button"
                onClick={appendQuarter}
                className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                쿼터 추가
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {quarterFields.length === 0 ? (
                <EmptyPanel
                  title="아직 쿼터가 없습니다"
                  description="쿼터를 추가한 뒤 각 쿼터의 포메이션을 선택하세요."
                />
              ) : (
                quarterFields.map((field, index) => {
                  const quarter = quarters[index] ?? field;
                  const active = quarter.id === activeQuarter?.id;

                  return (
                    <div
                      key={field.id}
                      data-testid="quarter-row"
                      className={
                        active
                          ? "grid gap-2 rounded-[20px] border border-emerald-300 bg-emerald-50/70 p-3 sm:grid-cols-[1fr_180px_auto] sm:items-center"
                          : "grid gap-2 rounded-[20px] border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_180px_auto] sm:items-center"
                      }
                    >
                      <button
                        type="button"
                        onClick={() => setActiveQuarterId(quarter.id)}
                        className="text-left"
                        aria-pressed={active}
                      >
                        <p className="text-sm font-semibold text-slate-950">{quarter.id}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          현재 포메이션 {quarter.formation}
                        </p>
                      </button>
                      <select
                        value={quarter.formation}
                        onChange={(event) =>
                          updateQuarterFormation(index, event.target.value as FormationName)
                        }
                        aria-label={`${quarter.id} 포메이션`}
                        className="h-10 rounded-2xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      >
                        {FORMATION_OPTIONS.map((formation) => (
                          <option key={formation} value={formation}>
                            {formation}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeQuarter(index)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-rose-300 hover:text-rose-700"
                      >
                        삭제
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-white/92 p-3 shadow-[0_28px_88px_-72px_rgba(15,23,42,0.72)] sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Field First
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                  포메이션 배치
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {activeQuarter ? (
                  <button
                    type="button"
                    onClick={() =>
                      exportLineupAsPng({
                        title,
                        quarterId: activeQuarter.id,
                        formation: activeQuarter.formation,
                        slots: activeQuarter.slots,
                        lineup: activeLineup,
                        players,
                      })
                    }
                    className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    PNG 저장
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={recommendationIssues.length > 0}
                  onClick={applyRecommendation}
                  className={
                    recommendationIssues.length > 0
                      ? "cursor-not-allowed rounded-full border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-400"
                      : "rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  }
                >
                  출전 균등 추천
                </button>
              </div>
            </div>

            {recommendationIssues.length > 0 ? (
              <div className="mt-3 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {recommendationIssues.join(" ")}
              </div>
            ) : null}

            {recommendationRequested ? (
              <div className="mt-3 rounded-[20px] border border-emerald-200 bg-emerald-50/80 px-4 py-3">
                <p className="text-sm font-semibold text-emerald-950">출전 균등 추천</p>
                <p className="mt-1 text-sm text-emerald-800">
                  추천 후에도 슬롯을 드래그하거나 선수 선택 후 슬롯을 눌러 배치를 바꿀 수 있습니다.
                </p>
              </div>
            ) : null}

            <div className="mt-4 overflow-hidden rounded-[26px] border border-emerald-200/45 bg-[radial-gradient(circle_at_top,rgba(167,243,208,0.16),transparent_26%),linear-gradient(180deg,#12573f_0%,#0f4e3d_52%,#0b3f33_100%)] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <div className="mx-auto flex max-w-[500px] flex-wrap items-center justify-between gap-2 rounded-[18px] border border-white/10 bg-white/6 px-3 py-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200/75">
                    Tactical Board
                  </p>
                  <p className="mt-1 text-sm font-medium text-emerald-50">
                    {activeQuarter ? `${activeQuarter.id} 포메이션 ${activeQuarter.formation}` : "쿼터를 추가하세요"}
                  </p>
                </div>
                {recommendationRequested ? <BoardPill label="출전 균등 추천 기준" /> : null}
              </div>

              <div className="relative mx-auto mt-3 aspect-[7/9] max-h-[560px] max-w-[500px] rounded-[26px] border border-white/12 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_0_50%,rgba(255,255,255,0.015)_50%_100%)] shadow-[inset_0_0_70px_rgba(0,0,0,0.12)]">
                <FieldLines />
                {activeQuarter ? (
                  <FormationSlots
                    slots={activeQuarter.slots}
                    lineup={activeLineup}
                    players={players}
                    selectedSlotId={selectedSlotId}
                    onSlotClick={handleSlotClick}
                    onSlotDrop={handleSlotDrop}
                  />
                ) : (
                  <div className="absolute inset-6 flex items-center justify-center text-center text-sm font-medium text-emerald-50/82">
                    쿼터 추가 후 포메이션을 선택하면 필드가 표시됩니다.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <aside className="xl:sticky xl:top-4">
          <section className="rounded-[28px] border border-slate-200 bg-white/94 p-3 shadow-[0_28px_88px_-72px_rgba(15,23,42,0.72)] sm:p-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Player Pool
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                  선수 관리
                </h2>
              </div>

              <button
                type="button"
                onClick={appendPlayer}
                className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                선수 추가
              </button>
            </div>

            <div className="mt-3 space-y-2.5 xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto xl:pr-1">
              {sortedPlayerEntries.length === 0 ? (
                <EmptyPanel
                  title="아직 선수가 없습니다"
                  description="선수를 11명 이상 추가하면 추천 배치를 만들 수 있습니다."
                />
              ) : (
                sortedPlayerEntries.map(({ field, index, player }) => {
                  const playerId = player?.id ?? field.id;
                  const expanded = expandedPlayerId === playerId;
                  const appearances = playerAppearances[playerId] ?? 0;
                  const includeRegistration = register(`players.${index}.isIncluded` as const);

                  return (
                    <article
                      key={field.id}
                      data-testid="player-card"
                      className="rounded-[18px] border border-slate-200 bg-white/96 px-3 py-2.5 shadow-[0_12px_28px_-28px_rgba(15,23,42,0.42)]"
                    >
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            draggable={Boolean(player?.isIncluded)}
                            onDragStart={(event) =>
                              event.dataTransfer.setData("text/plain", `player:${playerId}`)
                            }
                            onClick={() => handlePlayerCardClick(playerId)}
                            className="min-w-0 text-left"
                            aria-expanded={expanded}
                          >
                            <p className="truncate text-sm font-semibold text-slate-950">
                              {player?.name?.trim() || "새 선수"}
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-slate-500">
                              {player?.primaryPosition || "주포지션 선택"} · {appearances}쿼터 출전
                            </p>
                          </button>
                          <label className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                            <input
                              {...includeRegistration}
                              type="checkbox"
                              onChange={(event) => {
                                includeRegistration.onChange(event);
                                handlePlayerIncludeChange(playerId, event.target.checked);
                              }}
                              className="h-3.5 w-3.5 accent-emerald-600"
                            />
                            참가
                          </label>
                        </div>

                        {expanded ? (
                          <div className="grid gap-2 border-t border-slate-200/80 pt-3">
                            <label className="space-y-1">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                선수 이름
                              </span>
                              <input
                                {...register(`players.${index}.name` as const)}
                                aria-label="선수 이름"
                                className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                placeholder="선수 이름"
                              />
                            </label>

                            <InlineSelect
                              label="주포지션"
                              register={register(`players.${index}.primaryPosition` as const)}
                            />

                            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                              <InlineSelect
                                label="부포지션 1"
                                register={register(`players.${index}.secondaryPositions.0` as const)}
                                allowEmpty
                              />
                              <InlineSelect
                                label="부포지션 2"
                                register={register(`players.${index}.secondaryPositions.1` as const)}
                                allowEmpty
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function EditorInput({
  label,
  input,
}: {
  label: string;
  input: ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      {input}
    </label>
  );
}

function InlineSelect({
  label,
  register,
  allowEmpty = false,
}: {
  label: string;
  register: UseFormRegisterReturn;
  allowEmpty?: boolean;
}) {
  return (
    <label className="space-y-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <select
        {...register}
        aria-label={label}
        className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3.5 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      >
        <option value="">{allowEmpty ? "선택 안 함" : "선택"}</option>
        {PLAYER_POSITION_OPTIONS.map((position) => (
          <option key={position} value={position}>
            {position}
          </option>
        ))}
      </select>
    </label>
  );
}

function EmptyPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-5 text-center">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function BoardPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50">
      {label}
    </span>
  );
}

function FormationSlots({
  slots,
  lineup,
  players,
  selectedSlotId,
  onSlotClick,
  onSlotDrop,
}: {
  slots: FormationSlot[];
  lineup: Record<string, string>;
  players: MatchPlayerDraft[];
  selectedSlotId: string | null;
  onSlotClick: (slotId: string) => void;
  onSlotDrop: (event: DragEvent<HTMLDivElement>, slotId: string) => void;
}) {
  const playersById = new Map(players.map((player) => [player.id, player]));

  return (
    <>
      {slots.map((slot) => {
        const playerId = lineup[slot.id];
        const player = playerId ? playersById.get(playerId) : undefined;

        return (
          <div
            key={slot.id}
            data-testid={`formation-slot-${slot.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
            style={{ top: slot.top, left: slot.left }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => onSlotDrop(event, slot.id)}
          >
            <button
              type="button"
              draggable={Boolean(playerId)}
              onClick={() => onSlotClick(slot.id)}
              onDragStart={(event) => {
                if (playerId) {
                  event.dataTransfer.setData("text/plain", `slot:${slot.id}:${playerId}`);
                }
              }}
              className={
                selectedSlotId === slot.id
                  ? "min-w-[54px] rounded-[13px] border border-amber-200 bg-amber-50 px-1.5 py-1.5 text-center shadow-[0_16px_30px_-22px_rgba(15,23,42,0.84)] sm:min-w-[70px] sm:px-2"
                  : "min-w-[54px] rounded-[13px] border border-white/16 bg-white/94 px-1.5 py-1.5 text-center shadow-[0_16px_30px_-22px_rgba(15,23,42,0.84)] sm:min-w-[70px] sm:px-2"
              }
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-700 sm:text-[10px]">
                {slot.role}
              </p>
              <p className="mt-0.5 max-w-[58px] truncate text-[10px] font-semibold text-slate-950 sm:max-w-[72px] sm:text-xs">
                {player?.name || "빈 슬롯"}
              </p>
            </button>
          </div>
        );
      })}
    </>
  );
}

function recommendationToLineup(recommendation: {
  quarters: { quarterId: string; slots: RecommendationSlot[] }[];
}) {
  return Object.fromEntries(
    recommendation.quarters.map((quarter) => [
      quarter.quarterId,
      Object.fromEntries(
        quarter.slots.map((recommendedSlot) => [
          recommendedSlot.slot.id,
          recommendedSlot.player.id,
        ])
      ),
    ])
  );
}

function countPlayerAppearances(
  lineups: Record<string, Record<string, string>>,
  players: MatchPlayerDraft[]
) {
  const appearances: Record<string, number> = Object.fromEntries(
    players.map((player) => [player.id, 0])
  );

  for (const quarterLineup of Object.values(lineups)) {
    for (const playerId of new Set(Object.values(quarterLineup))) {
      appearances[playerId] = (appearances[playerId] ?? 0) + 1;
    }
  }

  return appearances;
}

function parseDragPayload(payload: string) {
  const [type, firstValue, secondValue] = payload.split(":");

  if (type === "player" && firstValue) {
    return {
      playerId: firstValue,
    };
  }

  if (type === "slot" && firstValue && secondValue) {
    return {
      slotId: firstValue,
      playerId: secondValue,
    };
  }

  return null;
}

function syncTeamPlayersFromMatch(players: MatchPlayerDraft[]) {
  const nextTeamPlayers = players.filter((player) => !player.name.includes("(삭제됨)")).map(
    (player) => ({
      id: player.id,
      name: player.name,
      primaryPosition: player.primaryPosition,
      secondaryPositions: player.secondaryPositions,
    })
  );

  writeLocalPlayers(nextTeamPlayers);
}

function FieldLines() {
  return (
    <>
      <div className="absolute inset-3 rounded-[24px] border border-white/24" />
      <div className="absolute left-[calc(50%-28px)] top-0 h-3 w-14 rounded-b-[10px] border border-t-0 border-white/30 bg-white/8" />
      <div className="absolute bottom-0 left-[calc(50%-28px)] h-3 w-14 rounded-t-[10px] border border-b-0 border-white/30 bg-white/8" />
      <div className="absolute left-1/2 top-1/2 h-px w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 bg-white/20" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/22" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35" />
      <div className="absolute left-1/2 top-3 h-[18%] w-[58%] -translate-x-1/2 rounded-b-[22px] border border-t-0 border-white/22" />
      <div className="absolute left-1/2 top-3 h-[8%] w-[28%] -translate-x-1/2 rounded-b-[16px] border border-t-0 border-white/18" />
      <div className="absolute left-1/2 top-[26%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/28" />
      <div className="absolute bottom-3 left-1/2 h-[18%] w-[58%] -translate-x-1/2 rounded-t-[22px] border border-b-0 border-white/22" />
      <div className="absolute bottom-3 left-1/2 h-[8%] w-[28%] -translate-x-1/2 rounded-t-[16px] border border-b-0 border-white/18" />
      <div className="absolute bottom-[26%] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/28" />
    </>
  );
}
