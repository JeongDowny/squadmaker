import Link from "next/link";
import { MockLineupPreview } from "@/features/landing/components/mock-lineup-preview";

const flowSteps = [
  {
    step: "01",
    title: "경기를 만들고",
    description: "경기 제목과 날짜, 총 쿼터 수를 정하면 바로 배치 준비가 시작된다.",
  },
  {
    step: "02",
    title: "선수를 고르고",
    description: "참가 선수와 포지션 정보를 정리하면 어떤 자원이 있는지 바로 보이기 시작한다.",
  },
  {
    step: "03",
    title: "쿼터별 포메이션을 고른다",
    description: "각 쿼터에 어떤 틀을 쓸지 먼저 정하면 추천도 그 흐름에 맞춰 정리된다.",
  },
  {
    step: "04",
    title: "추천안을 비교하고",
    description: "A, B, C 추천안을 보면서 지금 경기에서 어떤 균형이 더 맞는지 바로 판단할 수 있다.",
  },
  {
    step: "05",
    title: "수정하고 저장한다",
    description: "마음에 드는 안을 고른 뒤 직접 바꾸고, 마지막에 최종 배치만 저장하면 된다.",
  },
] as const;

const navItems = [
  { href: "#service-preview", label: "서비스 예시" },
  { href: "#how-it-works", label: "사용 흐름" },
] as const;

export function ServiceLandingPage() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
            SquadMaker
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#service-preview"
              className="hidden rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 sm:inline-flex"
            >
              예시 보기
            </a>
            <Link
              href="/harness"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              하네스
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-5 py-6 sm:px-8 sm:py-10">
        <section className="overflow-hidden rounded-[40px] border border-emerald-200 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.2),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(240,253,244,0.96),rgba(239,246,255,0.96))] p-6 shadow-[0_34px_120px_-72px_rgba(15,118,110,0.8)] sm:p-8 lg:p-10">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex rounded-full border border-emerald-300 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">
              SquadMaker
            </div>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl xl:text-6xl">
                여러 쿼터의 선발 배치를 한 번에 보고 더 빠르게 정리하세요
              </h1>
              <p className="max-w-3xl text-base leading-8 text-slate-600">
                경기 전에 가장 오래 걸리는 건 선수 배치를 다시 세고 다시 맞추는 일이다.
                SquadMaker는 쿼터별 포메이션, 추천안, 출전 요약을 한 화면에 모아둬서
                빠르게 보고 바로 고칠 수 있게 만든다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#service-preview"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                서비스 예시 보기
              </a>
              <a
                href="#how-it-works"
                className="rounded-full border border-slate-300 bg-white/90 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                어떻게 쓰는지 보기
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HeroStat value="4Q" label="쿼터별 배치 확인" />
              <HeroStat value="A/B/C" label="추천안 비교" />
              <HeroStat value="즉시" label="수정 후 재정리" />
            </div>
          </div>
        </section>

        <section
          id="service-preview"
          className="rounded-[36px] border border-slate-200 bg-white/82 p-4 shadow-[0_30px_90px_-64px_rgba(15,23,42,0.7)] sm:p-6"
        >
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Service Example
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                쿼터를 바꿔가며 결과 화면을 바로 살펴볼 수 있습니다
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                아래 예시는 실제 경기 전에 가장 먼저 확인하게 될 화면이다. 쿼터 버튼을
                눌러 포메이션과 선발 배치를 비교하고, 오른쪽에서 추천안과 전체 출전 요약을
                같이 확인할 수 있다.
              </p>
            </div>

            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
              interactive mock
            </div>
          </div>

          <MockLineupPreview />
        </section>

        <section
          id="how-it-works"
          className="rounded-[36px] border border-slate-200 bg-slate-950 px-6 py-7 text-slate-100 shadow-[0_30px_90px_-62px_rgba(15,23,42,0.9)] sm:px-8 sm:py-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                How It Works
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                경기 하나를 정리하는 흐름을 짧게 만들었습니다
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                처음부터 복잡한 설정을 오래 붙잡지 않아도 된다. 경기와 선수를 정리하고,
                쿼터별 포메이션을 고른 다음, 추천안을 보고 손으로 조금만 다듬으면 끝난다.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/6 px-5 py-4 text-sm leading-7 text-slate-300">
              예시 화면을 한 번 보고 나면 어떤 식으로 배치를 읽고 고치게 될지 바로 감이
              오도록 구성했다.
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            {flowSteps.map((step) => (
              <article
                key={step.step}
                className="rounded-[24px] border border-white/10 bg-white/6 px-5 py-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Step {step.step}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-emerald-200 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(255,255,255,0.96),rgba(240,249,255,0.96))] px-6 py-8 shadow-[0_30px_90px_-64px_rgba(15,118,110,0.65)] sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                CTA
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                예시 화면으로 감을 잡고 바로 다음 단계로 넘어가면 됩니다
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                먼저 결과 화면이 어떻게 보이는지 확인하고, 익숙해지면 실제 경기 입력
                흐름으로 자연스럽게 넘어갈 수 있도록 잡아둔 랜딩이다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#service-preview"
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                예시 팀 체험 보기
              </a>
              <a
                href="#how-it-works"
                className="rounded-full border border-slate-300 bg-white/90 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              >
                사용 흐름 보기
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white/72 px-4 py-4 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.7)]">
      <p className="text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}
