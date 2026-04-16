import type { Metadata } from "next";
import Link from "next/link";
import { HarnessDashboard } from "@/features/harness/components/harness-dashboard";

export const metadata: Metadata = {
  title: "Harness",
  description: "Repository-level and application-level harness dashboard for Squadmaker MVP.",
};

export default function HarnessPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-5 py-8 sm:px-8 sm:py-12">
      <section className="overflow-hidden rounded-[36px] border border-emerald-200 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(255,255,255,0.95),rgba(240,249,255,0.96))] p-6 shadow-[0_30px_90px_-55px_rgba(15,118,110,0.55)] sm:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">
              Squadmaker Harness
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              문서 기반 제품 규칙을 구현 전용 하네스로 바꿨다.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              이 화면은 실제 MVP 기능을 구현할 때 반복 확인해야 하는 시나리오, 검증 명령,
              수동 체크리스트를 한 번에 보여준다. 저장소에서는 스크립트로 검증하고, 여기서는
              사람이 화면 기준으로 읽고 검토할 수 있다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              랜딩으로 돌아가기
            </Link>
            <span className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white">
              npm run harness:repo
            </span>
          </div>
        </div>
      </section>

      <HarnessDashboard />
    </main>
  );
}
