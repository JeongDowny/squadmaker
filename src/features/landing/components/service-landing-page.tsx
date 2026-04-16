import Link from "next/link";

const flowSteps = [
  {
    title: "팀 관리",
    description: "선수 이름과 주포지션을 먼저 정리",
  },
  {
    title: "경기 생성",
    description: "오늘 경기와 쿼터를 만든다",
  },
  {
    title: "포메이션 설정",
    description: "쿼터마다 실제 포메이션을 선택",
  },
  {
    title: "출전 균등 추천",
    description: "선수별 출전 쿼터 수를 맞춘다",
  },
  {
    title: "필드 확인",
    description: "추천 후 포메이션을 다시 조정",
  },
] as const;

const rosterRows = [
  ["민준", "GK", "2쿼터"],
  ["지훈", "LB", "2쿼터"],
  ["도윤", "CB", "2쿼터"],
  ["이안", "ST", "2쿼터"],
] as const;

const lineupSlots = [
  { name: "이안", role: "ST", top: "17%", left: "50%" },
  { name: "하준", role: "LW", top: "28%", left: "24%" },
  { name: "유찬", role: "RW", top: "28%", left: "76%" },
  { name: "시우", role: "CM", top: "47%", left: "35%" },
  { name: "예준", role: "CDM", top: "53%", left: "50%" },
  { name: "건우", role: "CM", top: "47%", left: "65%" },
  { name: "지훈", role: "LB", top: "72%", left: "22%" },
  { name: "도윤", role: "CB", top: "74%", left: "42%" },
  { name: "현우", role: "CB", top: "74%", left: "58%" },
  { name: "준서", role: "RB", top: "72%", left: "78%" },
  { name: "민준", role: "GK", top: "88%", left: "50%" },
] as const;

export function ServiceLandingPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-7 px-5 py-8 sm:px-8 sm:py-10">
      <section className="grid gap-8 rounded-[38px] border border-emerald-200 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.2),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(240,253,244,0.96),rgba(248,250,252,0.98))] px-5 py-7 shadow-[0_36px_120px_-86px_rgba(15,118,110,0.78)] sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            SquadMaker
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            축구 동호회 라인업을 쿼터별로 빠르게 맞춥니다
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            쿼터별 포메이션과 선수 출전 수를 한 화면에서 맞추고, 추천 이후에도
            포메이션을 다시 조정할 수 있는 경기 준비 도구입니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/players"
              className="rounded-full border border-slate-300 bg-white/92 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              팀 관리 보기
            </Link>
            <Link
              href="/matches/new"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              새 경기 만들기
            </Link>
          </div>
        </div>

        <ServiceFlowMock />
      </section>

      <section className="rounded-[34px] border border-slate-200 bg-white/92 px-5 py-6 shadow-[0_28px_88px_-72px_rgba(15,23,42,0.72)] sm:px-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Service Flow
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              실제 이용 흐름
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            팀 명단을 정리한 뒤 경기에서 쿼터와 포메이션을 만들고, 출전 쿼터 수
            기준 추천을 받아 필드에서 확인합니다.
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {flowSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-[24px] border border-slate-200 bg-slate-50/84 px-4 py-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Step {index + 1}
              </p>
              <h3 className="mt-3 text-base font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[34px] border border-emerald-200 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(255,255,255,0.96),rgba(240,249,255,0.96))] px-5 py-7 shadow-[0_30px_90px_-66px_rgba(15,118,110,0.62)] sm:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Next Step
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              경기 목록에서 오늘 경기 준비를 시작하세요
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              경기 관리에서 경기 초안을 만들고, 편집 화면에서 쿼터와 포메이션을
              설정한 뒤 출전 균등 추천을 실행합니다.
            </p>
          </div>
          <Link
            href="/matches"
            className="inline-flex justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            경기 관리로 이동
          </Link>
        </div>
      </section>
    </main>
  );
}

function ServiceFlowMock() {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-slate-950 p-2 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.9)]">
      <div className="rounded-[24px] bg-white p-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
            경기 준비 화면
          </span>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_0.78fr]">
          <div className="rounded-[24px] bg-[linear-gradient(180deg,#166b4b,#0c4738)] p-3">
            <div className="flex items-center justify-between text-emerald-50">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/80">
                  1Q
                </p>
                <p className="text-sm font-semibold">4-3-3 출전 균등 추천</p>
              </div>
              <span className="rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold">
                변경 가능
              </span>
            </div>

            <div className="relative mt-3 aspect-[7/8] overflow-hidden rounded-[22px] border border-white/20 bg-white/5">
              <div className="absolute inset-3 rounded-[18px] border border-white/24" />
              <div className="absolute left-1/2 top-1/2 h-px w-[calc(100%-1.5rem)] -translate-x-1/2 bg-white/22" />
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/22" />
              <div className="absolute bottom-3 left-1/2 h-[18%] w-[58%] -translate-x-1/2 rounded-t-[20px] border border-b-0 border-white/22" />
              {lineupSlots.map((slot) => (
                <div
                  key={`${slot.role}-${slot.name}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white/94 px-2 py-1.5 text-center shadow-[0_14px_28px_-22px_rgba(0,0,0,0.9)]"
                  style={{ top: slot.top, left: slot.left }}
                >
                  <p className="text-[9px] font-semibold text-emerald-700">{slot.role}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-950">{slot.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-950">선수 관리</p>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  참가 명단
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {rosterRows.map(([name, position, appearances]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">{name}</p>
                      <p className="text-xs text-slate-500">{position}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{appearances}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-4">
              <p className="text-sm font-semibold text-emerald-950">추천 후에도 수정</p>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                쿼터 포메이션을 바꾸면 같은 참가 명단 기준으로 배치를 다시 계산합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
