import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = process.cwd();
const scenariosDir = path.join(rootDir, "harness/scenarios");

export function validateHarnessScenarioFiles() {
  const files = fs
    .readdirSync(scenariosDir)
    .filter((file) => file.endsWith(".json"))
    .sort();
  const failures = [];
  const ids = new Set();

  for (const file of files) {
    const scenarioPath = path.join(scenariosDir, file);
    const scenario = JSON.parse(fs.readFileSync(scenarioPath, "utf8"));

    if (!scenario.id) failures.push(`${file}: id is required`);
    if (!scenario.title) failures.push(`${file}: title is required`);
    if (!scenario.goal) failures.push(`${file}: goal is required`);
    if (!scenario.owner) failures.push(`${file}: owner is required`);
    if (!scenario.status) failures.push(`${file}: status is required`);
    if (!Array.isArray(scenario.linkedDocs) || scenario.linkedDocs.length === 0) {
      failures.push(`${file}: linkedDocs must be a non-empty array`);
    }
    if (!scenario.linkedExecPlan) failures.push(`${file}: linkedExecPlan is required`);
    if (!Array.isArray(scenario.execute) || scenario.execute.length === 0) {
      failures.push(`${file}: execute must be a non-empty array`);
    }
    if (!Array.isArray(scenario.verify?.automated)) {
      failures.push(`${file}: verify.automated must be an array`);
    }
    if (!Array.isArray(scenario.verify?.manual)) {
      failures.push(`${file}: verify.manual must be an array`);
    }
    if (!Array.isArray(scenario.verify?.screenshots)) {
      failures.push(`${file}: verify.screenshots must be an array`);
    }

    if (ids.has(scenario.id)) {
      failures.push(`${file}: duplicate scenario id ${scenario.id}`);
    }
    ids.add(scenario.id);

    for (const docPath of scenario.linkedDocs ?? []) {
      if (!fs.existsSync(path.join(rootDir, docPath))) {
        failures.push(`${file}: missing linked doc ${docPath}`);
      }
    }

    if (scenario.linkedExecPlan && !fs.existsSync(path.join(rootDir, scenario.linkedExecPlan))) {
      failures.push(`${file}: missing linked exec-plan ${scenario.linkedExecPlan}`);
    }

    for (const fixturePath of Object.values(scenario.fixtureRefs ?? {})) {
      if (!fs.existsSync(path.join(rootDir, fixturePath))) {
        failures.push(`${file}: missing fixture ${fixturePath}`);
      }
    }
  }

  return { files, failures };
}

const currentFile = fileURLToPath(import.meta.url);
const directRunTarget = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (directRunTarget === currentFile) {
  const { files, failures } = validateHarnessScenarioFiles();

  if (failures.length > 0) {
    console.error("Harness scenario validation failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log(`Harness scenario validation passed: ${files.length} scenario files.`);
}
