import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { validateHarnessScenarioFiles } from "../harness/evals/validate-scenarios.mjs";

const rootDir = process.cwd();
const requiredPaths = [
  ".codex/config.toml",
  ".codex/agents/planner.toml",
  ".codex/agents/implementer.toml",
  ".codex/agents/reviewer.toml",
  ".codex/skills/ui-review/SKILL.md",
  ".codex/skills/regression-check/SKILL.md",
  ".codex/skills/release-check/SKILL.md",
  "docs/QUALITY_SCORE.md",
  "docs/product-specs/index.md",
  "docs/exec-plans/active/harness-workflow-scaffolding.md",
  "docs/exec-plans/active/harness-migration-playwright.md",
  "docs/exec-plans/completed/README.md",
  "docs/exec-plans/tech-debt-tracker.md",
  "harness/config/repository-harness.json",
  "harness/README.md",
  "harness/scenarios/landing-page.json",
  "harness/scenarios/lineup-balance.json",
  "harness/scenarios/save-export.json",
  "harness/evals/checklist-ui.md",
  "harness/evals/score-balance.mjs",
  "harness/evals/validate-scenarios.mjs",
  "harness/reports/latest/README.md",
  "harness/reports/history/README.md",
  "playwright.config.ts",
  "scripts/validate.mjs",
  "scripts/seed-harness-data.mjs",
  "scripts/summarize-report.mjs",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/harness/page.tsx",
  "src/features/harness/components/harness-dashboard.tsx",
  "src/features/harness/server/harness-document.ts",
  "src/features/landing/components/service-landing-page.tsx",
  "src/features/landing/components/mock-lineup-preview.tsx",
  "tests/unit/README.md",
  "tests/integration/README.md",
  "tests/e2e/README.md",
  "tests/e2e/landing.spec.ts",
  "tests/e2e/harness-dashboard.spec.ts",
  "tests/visual/README.md",
  "tests/visual/landing-screenshots.spec.ts"
];

const failures = [];

try {
  execFileSync("node", ["scripts/validate-harness.mjs"], {
    cwd: rootDir,
    stdio: "inherit"
  });
} catch {
  failures.push("repository harness manifest validation failed");
}

for (const relativePath of requiredPaths) {
  if (!fs.existsSync(path.join(rootDir, relativePath))) {
    failures.push(`missing required harness path: ${relativePath}`);
  }
}

const scenarioValidation = validateHarnessScenarioFiles();
failures.push(...scenarioValidation.failures);

if (failures.length > 0) {
  console.error("Repository harness validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Repository harness validation passed: ${requiredPaths.length} scaffold paths, ${scenarioValidation.files.length} scenario files.`
);
