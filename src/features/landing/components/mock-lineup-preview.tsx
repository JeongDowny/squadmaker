"use client";

import { useState } from "react";

type RecommendationOption = {
  label: string;
  focus: string;
  score: string;
  active?: boolean;
};

type FieldPlayer = {
  name: string;
  slot: string;
  top: string;
  left: string;
};

type PlayerSummary = {
  name: string;
  appearances: QuarterId[];
  tag?: "GK 고정" | "출전 부족";
};

type QuarterId = "1Q" | "2Q" | "3Q" | "4Q";

type QuarterConfig = {
  id: QuarterId;
  formation: string;
  averageScore: number;
  fitRate: string;
  recommendationLabel: string;
  recommendationTone: string;
  compareTo: QuarterId;
  players: FieldPlayer[];
};

const recommendationOptions: RecommendationOption[] = [
  { label: "A", focus: "공평성 우선", score: "86" },
  { label: "B", focus: "평균 점수 균형", score: "91", active: true },
  { label: "C", focus: "주포지션 일치율", score: "84" },
] as const;

const quarterConfigs: QuarterConfig[] = [
  {
    id: "1Q",
    formation: "4-4-2",
    averageScore: 6.6,
    fitRate: "79%",
    recommendationLabel: "추천안 B",
    recommendationTone: "초반에 라인을 안정적으로 맞추고 경기 흐름을 차분하게 시작하는 구성",
    compareTo: "2Q",
    players: [
      { name: "이안", slot: "ST", top: "12%", left: "40%" },
      { name: "하준", slot: "ST", top: "12%", left: "60%" },
      { name: "시우", slot: "LM", top: "31%", left: "16%" },
      { name: "준호", slot: "CM", top: "33%", left: "38%" },
      { name: "예준", slot: "CM", top: "33%", left: "62%" },
      { name: "지성", slot: "RM", top: "31%", left: "84%" },
      { name: "지훈", slot: "LB", top: "57%", left: "16%" },
      { name: "도윤", slot: "LCB", top: "57%", left: "37%" },
      { name: "서준", slot: "RCB", top: "57%", left: "63%" },
      { name: "현우", slot: "RB", top: "57%", left: "84%" },
      { name: "민준", slot: "GK", top: "84%", left: "50%" },
    ],
  },
  {
    id: "2Q",
    formation: "4-3-3",
    averageScore: 6.8,
    fitRate: "82%",
    recommendationLabel: "추천안 B",
    recommendationTone: "중원 점유와 좌우 폭을 같이 살리면서 밸런스를 유지하는 구성",
    compareTo: "1Q",
    players: [
      { name: "하준", slot: "LW", top: "14%", left: "18%" },
      { name: "이안", slot: "ST", top: "12%", left: "50%" },
      { name: "우진", slot: "RW", top: "14%", left: "82%" },
      { name: "태윤", slot: "CM", top: "33%", left: "28%" },
      { name: "예준", slot: "CDM", top: "39%", left: "50%" },
      { name: "시우", slot: "CM", top: "33%", left: "72%" },
      { name: "지훈", slot: "LB", top: "58%", left: "16%" },
      { name: "도윤", slot: "LCB", top: "57%", left: "37%" },
      { name: "서준", slot: "RCB", top: "57%", left: "63%" },
      { name: "현우", slot: "RB", top: "58%", left: "84%" },
      { name: "민준", slot: "GK", top: "84%", left: "50%" },
    ],
  },
  {
    id: "3Q",
    formation: "4-2-3-1",
    averageScore: 6.7,
    fitRate: "84%",
    recommendationLabel: "추천안 B",
    recommendationTone: "2선 연결을 살리면서 뒤쪽 숫자도 놓치지 않는 구성",
    compareTo: "4Q",
    players: [
      { name: "이안", slot: "ST", top: "12%", left: "50%" },
      { name: "하준", slot: "LW", top: "26%", left: "18%" },
      { name: "시우", slot: "CAM", top: "23%", left: "50%" },
      { name: "우진", slot: "RW", top: "26%", left: "82%" },
      { name: "준호", slot: "CDM", top: "42%", left: "38%" },
      { name: "예준", slot: "CDM", top: "42%", left: "62%" },
      { name: "재윤", slot: "LB", top: "57%", left: "16%" },
      { name: "도윤", slot: "LCB", top: "57%", left: "37%" },
      { name: "서준", slot: "RCB", top: "57%", left: "63%" },
      { name: "지성", slot: "RB", top: "57%", left: "84%" },
      { name: "민준", slot: "GK", top: "84%", left: "50%" },
    ],
  },
  {
    id: "4Q",
    formation: "3-4-3",
    averageScore: 6.5,
    fitRate: "78%",
    recommendationLabel: "추천안 B",
    recommendationTone: "막판에는 전방 숫자를 유지하면서도 교체 자원을 같이 살리는 구성",
    compareTo: "3Q",
    players: [
      { name: "하준", slot: "LW", top: "14%", left: "20%" },
      { name: "이안", slot: "ST", top: "12%", left: "50%" },
      { name: "우진", slot: "RW", top: "14%", left: "80%" },
      { name: "재윤", slot: "LM", top: "34%", left: "16%" },
      { name: "태윤", slot: "CM", top: "35%", left: "38%" },
      { name: "예준", slot: "CM", top: "35%", left: "62%" },
      { name: "민성", slot: "RM", top: "34%", left: "84%" },
      { name: "지훈", slot: "LCB", top: "58%", left: "28%" },
      { name: "도윤", slot: "CB", top: "56%", left: "50%" },
      { name: "서준", slot: "RCB", top: "58%", left: "72%" },
      { name: "민준", slot: "GK", top: "84%", left: "50%" },
    ],
  },
] as const;

const participantOrder = [
  "민준",
  "도윤",
  "서준",
  "예준",
  "이안",
  "하준",
  "우진",
  "준호",
  "시우",
  "지훈",
  "현우",
  "재윤",
  "태윤",
  "지성",
  "민성",
] as const;

const playerTags: Partial<Record<(typeof participantOrder)[number], PlayerSummary["tag"]>> = {
  민준: "GK 고정",
  민성: "출전 부족",
};

const quarterOrder: QuarterId[] = ["1Q", "2Q", "3Q", "4Q"];

const playerSummaries = buildPlayerSummaries();

export function MockLineupPreview() {
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterId>("1Q");

  const currentQuarter =
    quarterConfigs.find((quarter) => quarter.id === selectedQuarter) ?? quarterConfigs[0];
  const comparisonQuarter =
    quarterConfigs.find((quarter) => quarter.id === currentQuarter.compareTo) ?? quarterConfigs[0];
  const deltaLabel = formatDelta(currentQuarter.averageScore, comparisonQuarter.averageScore);

  return (
    <section className="rounded-[32px] border border-emerald-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(240,253,244,0.93))] p-4 shadow-[0_32px_100px_-65px_rgba(15,118,110,0.68)] sm:p-6">
      <div className="rounded-[28px] border border-slate-200 bg-slate-950/95 p-4 text-slate-100 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Service Preview
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              SquadMaker 결과 화면을 그대로 미리 보는 예시
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              쿼터 버튼을 눌러가며 포메이션과 선발 배치를 비교하고, 오른쪽에서 추천안과
              전체 출전 요약을 바로 확인할 수 있다.
            </p>
          </div>

          <div className="grid gap-3 rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm text-slate-200 sm:grid-cols-3 lg:min-w-[320px] lg:grid-cols-1">
            <MetricBlock
              label="현재 쿼터"
              value={currentQuarter.id}
              detail={`Formation ${currentQuarter.formation}`}
            />
            <MetricBlock
              label="평균 점수"
              value={currentQuarter.averageScore.toFixed(1)}
              detail={`${comparisonQuarter.id} 대비 ${deltaLabel}`}
            />
            <MetricBlock
              label="주포지션 일치율"
              value={currentQuarter.fitRate}
              detail={currentQuarter.recommendationTone}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {quarterConfigs.map((tab) => {
            const active = tab.id === currentQuarter.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedQuarter(tab.id)}
                className={
                  active
                    ? "rounded-full border border-emerald-300 bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/8"
                }
                aria-pressed={active}
              >
                {tab.id}
                <span className="ml-2 text-xs text-slate-300">{tab.formation}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_0.9fr]">
          <div className="overflow-hidden rounded-[28px] border border-emerald-200/20 bg-[radial-gradient(circle_at_top,rgba(167,243,208,0.14),transparent_30%),linear-gradient(180deg,#0f5b41_0%,#0c4a36_50%,#0b3b2d_100%)] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
                  Tactical Board
                </p>
                <p className="mt-1 text-sm text-emerald-50">
                  공격은 위쪽, 골키퍼는 아래쪽에서 시작하는 전술 보드
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-slate-200">
                {currentQuarter.formation}
              </div>
            </div>

            <div className="relative aspect-[5/6] rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(20,83,45,0.08),rgba(255,255,255,0.02))]">
              <FieldLines />
              {currentQuarter.players.map((player) => (
                <div
                  key={`${currentQuarter.id}-${player.slot}-${player.name}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ top: player.top, left: player.left }}
                >
                  <div className="min-w-[42px] rounded-[18px] border border-white/15 bg-white/92 px-1.5 py-1 text-center shadow-[0_14px_30px_-20px_rgba(15,23,42,0.8)] sm:min-w-[62px] sm:rounded-2xl sm:px-2 sm:py-2">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-emerald-700 sm:text-[10px] sm:tracking-[0.16em]">
                      {player.slot}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold leading-none text-slate-950 sm:mt-1 sm:text-sm">
                      {player.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    Recommendation
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-white">
                    {currentQuarter.recommendationLabel}을 보는 중
                  </h4>
                </div>
                <span className="rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  balance
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-300">{currentQuarter.recommendationTone}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {recommendationOptions.map((option) => (
                  <div
                    key={option.label}
                    className={
                      option.active
                        ? "rounded-[20px] border border-emerald-300/35 bg-emerald-400/10 px-4 py-3"
                        : "rounded-[20px] border border-white/10 bg-slate-900/50 px-4 py-3"
                    }
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-white">추천안 {option.label}</span>
                      <span className="text-slate-300">{option.score}점</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{option.focus}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Quarter Summary
                </p>
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-slate-300">
                  전체 선수 {playerSummaries.length}명
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                {playerSummaries.map((player) => (
                  <div
                    key={player.name}
                    className="rounded-[18px] border border-white/8 bg-slate-900/45 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{player.name}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          총 {player.appearances.length}쿼터 출전
                        </p>
                      </div>
                      {player.tag ? (
                        <span
                          className={
                            player.tag === "출전 부족"
                              ? "rounded-full border border-rose-300/30 bg-rose-400/12 px-3 py-1 text-xs font-semibold text-rose-200"
                              : "rounded-full border border-emerald-300/30 bg-emerald-400/12 px-3 py-1 text-xs font-semibold text-emerald-200"
                          }
                        >
                          {player.tag}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {quarterOrder.map((quarter) => {
                        const active = player.appearances.includes(quarter);

                        return (
                          <span
                            key={`${player.name}-${quarter}`}
                            className={
                              active
                                ? "rounded-full border border-emerald-300/30 bg-emerald-400/12 px-3 py-1 text-xs font-semibold text-emerald-200"
                                : "rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs font-medium text-slate-500"
                            }
                          >
                            {quarter}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricBlock({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-slate-900/55 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  );
}

function FieldLines() {
  return (
    <>
      <div className="absolute inset-4 rounded-[20px] border border-white/18" />
      <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] -translate-x-1/2 border-l border-white/18" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/18" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />
      <div className="absolute left-1/2 top-[12%] h-16 w-36 -translate-x-1/2 rounded-b-[32px] border-x border-b border-white/18" />
      <div className="absolute left-1/2 top-[76%] h-16 w-36 -translate-x-1/2 rounded-t-[32px] border-x border-t border-white/18" />
    </>
  );
}

function buildPlayerSummaries(): PlayerSummary[] {
  const appearanceMap = new Map<string, QuarterId[]>();

  for (const quarter of quarterConfigs) {
    for (const player of quarter.players) {
      const existing = appearanceMap.get(player.name) ?? [];
      if (!existing.includes(quarter.id)) {
        appearanceMap.set(player.name, [...existing, quarter.id]);
      }
    }
  }

  return participantOrder
    .filter((name) => appearanceMap.has(name))
    .map((name) => ({
      name,
      appearances: appearanceMap.get(name) ?? [],
      tag: playerTags[name],
    }));
}

function formatDelta(current: number, comparison: number) {
  const delta = current - comparison;
  const sign = delta > 0 ? "+" : "";

  return `${sign}${delta.toFixed(1)}`;
}
