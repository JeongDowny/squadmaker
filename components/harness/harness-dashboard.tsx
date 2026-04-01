import Link from "next/link";
import {
  getHarnessCounts,
  getScenarioPreview,
  getScenarioStatusLabel,
  getScenarioTypeLabel,
  getStageLabel,
  harness,
} from "@/lib/harness";

type HarnessDashboardProps = {
  compact?: boolean;
  scenarioLimit?: number;
  showHeader?: boolean;
};

export function HarnessDashboard({
  compact = false,
  scenarioLimit,
  showHeader = true,
}: HarnessDashboardProps) {
  const counts = getHarnessCounts();
  const scenarios = getScenarioPreview(scenarioLimit);

  return (
    <section className="space-y-8">
      {showHeader ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Engineering Harness
          </p>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Repository 규칙과 Application 검증 화면을 같은 데이터로 묶었다.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              문서 기준, 검증 명령, 제품 시나리오, 수동 체크리스트를 하나의 하네스 문서로
              관리한다. 저장소에서는 스크립트로 검증하고, 앱에서는 {harness.applicationHarness.route}
              에서 바로 읽고 확인할 수 있다.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <HarnessMetric label="Scenarios" value={counts.scenarios.toString()} />
        <HarnessMetric
          label="Repo Commands"
          value={counts.repositoryCommands.toString()}
        />
        <HarnessMetric label="Contract Ready" value={counts.contractReady.toString()} />
        <HarnessMetric label="Verified" value={counts.verified.toString()} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <HarnessMetric label="Focus Areas" value={counts.focusAreas.toString()} />
        <HarnessMetric label="Required Docs" value={counts.requiredDocs.toString()} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] border border-emerald-200 bg-white/90 p-6 shadow-[0_24px_70px_-48px_rgba(15,118,110,0.55)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Repository Harness
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">
                저장소 레벨 검증 기준
              </h3>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
              v{harness.meta.version}
            </span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">Goals</h4>
              <ul className="space-y-2 text-sm leading-6 text-slate-600">
                {harness.repositoryHarness.goals.map((goal) => (
                  <li key={goal} className="rounded-2xl bg-slate-50 px-4 py-3">
                    {goal}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">Validation Commands</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                {harness.repositoryHarness.validationCommands.map((command) => (
                  <li key={command.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-slate-900">{command.command}</p>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                        {command.category}
                      </span>
                    </div>
                    <p className="mt-1 leading-6">{command.purpose}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {!compact ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Required Docs</h4>
                <div className="flex flex-wrap gap-2">
                  {harness.repositoryHarness.requiredDocs.map((docPath) => (
                    <span
                      key={docPath}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {docPath}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Workflow Requirements</h4>
                <ul className="space-y-2 text-sm leading-6 text-slate-600">
                  {harness.repositoryHarness.workflowRequirements.map((rule) => (
                    <li key={rule} className="rounded-2xl bg-slate-50 px-4 py-3">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {!compact ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                CI Gate
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {harness.repositoryHarness.ciGate.workflowPath}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {harness.repositoryHarness.ciGate.requiredCommands.map((command) => (
                  <span
                    key={command}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {command}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-slate-100 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.8)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Application Harness
          </p>
          <h3 className="mt-2 text-xl font-semibold">UI에서 바로 확인하는 검증 포인트</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            `/harness` 화면은 아직 구현되지 않은 기능도 어떤 기준으로 완성돼야 하는지
            보여주는 운영 보드다.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Route
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                {harness.applicationHarness.route}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Focus Areas
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
                {harness.applicationHarness.focusAreas.map((area) => (
                  <li key={area} className="rounded-2xl bg-white/6 px-4 py-3">
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Viewports
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {harness.applicationHarness.defaultViewportChecks.map((viewport) => (
                  <span
                    key={viewport}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-slate-200"
                  >
                    {viewport}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Scenario Deck
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              MVP 구현을 고정하는 대표 시나리오
            </h3>
          </div>
          {compact ? (
            <Link
              href="/harness"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              전체 하네스 보기
            </Link>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {scenarios.map((scenario) => (
            <article
              key={scenario.id}
              className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-52px_rgba(15,23,42,0.85)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  {getStageLabel(scenario.stage)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">
                    {scenario.priority}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                    {getScenarioTypeLabel(scenario.scenarioType)}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{scenario.id}</span>
                </div>
              </div>

              <h4 className="mt-4 text-xl font-semibold text-slate-950">
                {scenario.title}
              </h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">{scenario.objective}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
                  Owner: {scenario.owner}
                </span>
                <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700">
                  Status: {getScenarioStatusLabel(scenario.status)}
                </span>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <HarnessFact label="Match" value={scenario.inputs.matchTitle} />
                <HarnessFact
                  label="Players"
                  value={`${scenario.inputs.playerCount}명`}
                />
                <HarnessFact
                  label="Quarters"
                  value={`${scenario.inputs.quarterCount}Q`}
                />
                <HarnessFact label="Date" value={scenario.inputs.matchDate} />
              </dl>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Formations
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {scenario.inputs.formations.map((formation) => (
                    <span
                      key={formation}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {formation}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Input Notes
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {scenario.inputs.notes.map((note) => (
                    <li key={note} className="rounded-2xl border border-slate-200 px-4 py-3">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Assertions
                </p>
                <ul className="space-y-2 text-sm leading-6 text-slate-700">
                  {scenario.assertions.map((assertion) => (
                    <li key={assertion} className="rounded-2xl bg-slate-50 px-4 py-3">
                      {assertion}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Expected Results
                </p>
                <ExpectedResultGroup label="UI" items={scenario.expectedResults.ui} />
                <ExpectedResultGroup
                  label="Domain"
                  items={scenario.expectedResults.domain}
                />
                <ExpectedResultGroup
                  label="Persistence"
                  items={scenario.expectedResults.persistence}
                />
              </div>

              {!compact ? (
                <div className="mt-5 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Manual Checks
                  </p>
                  <ul className="space-y-2 text-sm leading-6 text-slate-700">
                    {scenario.manualChecks.map((check) => (
                      <li
                        key={check}
                        className="rounded-2xl border border-dashed border-slate-300 px-4 py-3"
                      >
                        {check}
                      </li>
                    ))}
                  </ul>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Linked Docs
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {scenario.linkedDocs.map((docPath) => (
                        <span
                          key={docPath}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          {docPath}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Verification
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {scenario.verification.checks.map((checkId) => (
                        <span
                          key={checkId}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          {checkId}
                        </span>
                      ))}
                    </div>
                    <ul className="space-y-2 text-sm leading-6 text-slate-700">
                      {scenario.verification.targets.map((target) => (
                        <li
                          key={`${target.kind}-${target.path}`}
                          className="rounded-2xl border border-slate-200 px-4 py-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-medium text-slate-900">{target.path}</span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                              {target.kind} / {target.state}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{target.note}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Handoff
                    </p>
                    <HandoffGroup
                      label="Depends On"
                      items={scenario.handoff.dependsOn}
                    />
                    <HandoffGroup
                      label="Deliverables"
                      items={scenario.handoff.deliverables}
                    />
                    <HandoffGroup
                      label="Ready When"
                      items={scenario.handoff.readyWhen}
                    />
                    <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        Next Workstream
                      </p>
                      <p className="mt-2 font-medium">{scenario.handoff.nextWorkstream}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function HarnessMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-[0_16px_48px_-40px_rgba(15,23,42,0.75)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function HarnessFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function HandoffGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExpectedResultGroup({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500">
        <span className="font-medium text-slate-700">{label}:</span> 없음
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
