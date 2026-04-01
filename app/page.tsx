import Link from "next/link";
import { HarnessDashboard } from "@/components/harness/harness-dashboard";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-5 py-8 sm:px-8 sm:py-12">
      <section className="overflow-hidden rounded-[36px] border border-emerald-200 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.22),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,253,244,0.98),rgba(239,246,255,0.96))] p-6 shadow-[0_32px_90px_-58px_rgba(15,118,110,0.7)] sm:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="space-y-5">
            <div className="inline-flex rounded-full border border-emerald-300 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">
              Squadmaker MVP Foundation
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl xl:text-6xl">
                축구 경기 전 쿼터별 선발 배치를 빠르게 설계하는 운영 도구.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                감독이 쿼터별 포메이션을 먼저 고르면, 서비스는 공평성, 평균 점수 균형,
                포지션 적합성을 기준으로 추천안 A/B/C를 제시한다. 지금 이 저장소에는 그
                제품 규칙을 구현으로 옮기기 위한 repository/application harness를 먼저
                깔아두었다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/harness"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                하네스 대시보드 열기
              </Link>
              <a
                href="#product-rules"
                className="rounded-full border border-slate-300 bg-white/90 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                제품 규칙 보기
              </a>
            </div>
          </div>

          <section className="rounded-[30px] border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.9)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Product Priorities
            </p>
            <div className="mt-5 space-y-4">
              <RuleCard
                title="공평한 출전 분배"
                description="선수별 총 출전 쿼터 수가 특정 선수에게 과도하게 몰리지 않도록 설계한다."
              />
              <RuleCard
                title="쿼터 평균 점수 균형"
                description="한 쿼터에만 전력이 과도하게 몰리지 않게 평균 점수 편차를 줄인다."
              />
              <RuleCard
                title="포지션 적합성 반영"
                description="주포지션, 부포지션, 인접 포지션 규칙을 바탕으로 배치 신뢰도를 높인다."
              />
            </div>
          </section>
        </div>
      </section>

      <section
        id="product-rules"
        className="grid gap-4 rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.7)] sm:grid-cols-3 sm:p-8"
      >
        <RulePill
          eyebrow="Rule 01"
          title="포메이션 우선"
          description="감독이 쿼터별 포메이션을 먼저 선택하고, 추천은 그 틀 안에서만 진행된다."
        />
        <RulePill
          eyebrow="Rule 02"
          title="브라우저 계산"
          description="추천 계산과 수정 후 재계산은 브라우저에서 빠르게 수행한다."
        />
        <RulePill
          eyebrow="Rule 03"
          title="저장 정책 고정"
          description="비로그인 1경기, 로그인 3경기, 저장 대상은 최종 수정본 1개다."
        />
      </section>

      <HarnessDashboard compact scenarioLimit={2} showHeader={false} />
    </main>
  );
}

function RuleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] bg-white/8 px-5 py-4">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}

function RulePill({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}
