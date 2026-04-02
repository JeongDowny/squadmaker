import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const harnessPath = path.join(rootDir, "harness/config/repository-harness.json");
const packageJsonPath = path.join(rootDir, "package.json");

const harness = JSON.parse(fs.readFileSync(harnessPath, "utf8"));
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

const failures = [];
const allowedPriorities = new Set(["P0", "P1", "P2"]);
const allowedOwners = new Set(["frontend", "domain", "persistence", "product"]);
const allowedStatuses = new Set([
  "contract-ready",
  "in_progress",
  "verified",
  "blocked",
]);
const allowedStages = new Set([
  "onboarding",
  "setup",
  "recommendation",
  "editing",
  "persistence",
  "reliability",
]);
const allowedScenarioTypes = new Set([
  "happy-path",
  "warning-path",
  "failure-path",
]);
const allowedCommandCategories = new Set([
  "static-check",
  "build-check",
  "harness-check",
]);
const allowedVerificationKinds = new Set(["ui", "domain", "persistence"]);
const allowedVerificationStates = new Set(["existing", "planned"]);
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

assert(typeof harness.meta?.version === "string", "meta.version is required");
assert(typeof harness.meta?.owner === "string", "meta.owner is required");
assert(
  Array.isArray(harness.repositoryHarness?.requiredDocs),
  "repositoryHarness.requiredDocs must be an array"
);
assert(
  Array.isArray(harness.repositoryHarness?.validationCommands),
  "repositoryHarness.validationCommands must be an array"
);
assert(
  Array.isArray(harness.repositoryHarness?.workflowRequirements),
  "repositoryHarness.workflowRequirements must be an array"
);
assert(
  Array.isArray(harness.repositoryHarness?.handoffContract?.requiredScenarioFields),
  "repositoryHarness.handoffContract.requiredScenarioFields must be an array"
);
assert(
  Array.isArray(harness.repositoryHarness?.ciGate?.requiredCommands),
  "repositoryHarness.ciGate.requiredCommands must be an array"
);
assert(
  typeof harness.repositoryHarness?.ciGate?.workflowPath === "string",
  "repositoryHarness.ciGate.workflowPath is required"
);
assert(
  Array.isArray(harness.applicationHarness?.focusAreas),
  "applicationHarness.focusAreas must be an array"
);
assert(Array.isArray(harness.scenarios), "scenarios must be an array");
assert(
  Array.isArray(harness.supportedFormations),
  "supportedFormations must be an array"
);

const scenarioIds = new Set();
const commandIds = new Set();

for (const command of harness.repositoryHarness?.validationCommands ?? []) {
  assert(typeof command.id === "string" && command.id.length > 0, "validation command id is required");
  assert(
    typeof command.command === "string" && command.command.length > 0,
    `validation command ${command.id} must define command`
  );
  assert(
    typeof command.purpose === "string" && command.purpose.length > 0,
    `validation command ${command.id} must define purpose`
  );
  assert(
    allowedCommandCategories.has(command.category),
    `validation command ${command.id} uses unsupported category: ${command.category}`
  );

  if (commandIds.has(command.id)) {
    failures.push(`validation command id must be unique: ${command.id}`);
  }
  commandIds.add(command.id);
}

for (const scenario of harness.scenarios ?? []) {
  assert(typeof scenario.id === "string" && scenario.id.length > 0, "scenario.id is required");
  assert(
    typeof scenario.title === "string" && scenario.title.length > 0,
    `scenario ${scenario.id} must have a title`
  );
  assert(
    typeof scenario.objective === "string" && scenario.objective.length > 0,
    `scenario ${scenario.id} must have an objective`
  );
  assert(
    allowedStages.has(scenario.stage),
    `scenario ${scenario.id} uses unsupported stage: ${scenario.stage}`
  );
  assert(
    allowedScenarioTypes.has(scenario.scenarioType),
    `scenario ${scenario.id} uses unsupported scenarioType: ${scenario.scenarioType}`
  );
  assert(
    allowedPriorities.has(scenario.priority),
    `scenario ${scenario.id} uses unsupported priority: ${scenario.priority}`
  );
  assert(
    allowedOwners.has(scenario.owner),
    `scenario ${scenario.id} uses unsupported owner: ${scenario.owner}`
  );
  assert(
    allowedStatuses.has(scenario.status),
    `scenario ${scenario.id} uses unsupported status: ${scenario.status}`
  );
  assert(
    typeof scenario.linkedExecPlan === "string" && scenario.linkedExecPlan.length > 0,
    `scenario ${scenario.id} must define linkedExecPlan`
  );
  assert(
    typeof scenario.inputs?.matchTitle === "string" && scenario.inputs.matchTitle.length > 0,
    `scenario ${scenario.id} must define inputs.matchTitle`
  );
  assert(
    typeof scenario.inputs?.matchDate === "string" &&
      isoDatePattern.test(scenario.inputs.matchDate),
    `scenario ${scenario.id} must define inputs.matchDate in YYYY-MM-DD format`
  );
  assert(
    Number.isInteger(scenario.inputs?.quarterCount) && scenario.inputs.quarterCount > 0,
    `scenario ${scenario.id} must define inputs.quarterCount as positive integer`
  );
  assert(
    Number.isInteger(scenario.inputs?.playerCount) && scenario.inputs.playerCount > 0,
    `scenario ${scenario.id} must define inputs.playerCount as positive integer`
  );
  assert(
    Array.isArray(scenario.inputs?.formations) && scenario.inputs.formations.length > 0,
    `scenario ${scenario.id} must define formations`
  );
  assert(
    Array.isArray(scenario.inputs?.notes) && scenario.inputs.notes.length > 0,
    `scenario ${scenario.id} must define inputs.notes`
  );
  assert(
    Array.isArray(scenario.assertions) && scenario.assertions.length > 0,
    `scenario ${scenario.id} must define assertions`
  );
  assert(
    Array.isArray(scenario.expectedResults?.ui),
    `scenario ${scenario.id} must define expectedResults.ui`
  );
  assert(
    Array.isArray(scenario.expectedResults?.domain),
    `scenario ${scenario.id} must define expectedResults.domain`
  );
  assert(
    Array.isArray(scenario.expectedResults?.persistence),
    `scenario ${scenario.id} must define expectedResults.persistence`
  );
  assert(
    Array.isArray(scenario.manualChecks) && scenario.manualChecks.length > 0,
    `scenario ${scenario.id} must define manualChecks`
  );
  assert(
    Array.isArray(scenario.linkedDocs) && scenario.linkedDocs.length > 0,
    `scenario ${scenario.id} must define linkedDocs`
  );
  assert(
    Array.isArray(scenario.handoff?.dependsOn) && scenario.handoff.dependsOn.length > 0,
    `scenario ${scenario.id} must define handoff.dependsOn`
  );
  assert(
    Array.isArray(scenario.handoff?.deliverables) &&
      scenario.handoff.deliverables.length > 0,
    `scenario ${scenario.id} must define handoff.deliverables`
  );
  assert(
    Array.isArray(scenario.handoff?.readyWhen) && scenario.handoff.readyWhen.length > 0,
    `scenario ${scenario.id} must define handoff.readyWhen`
  );
  assert(
    typeof scenario.handoff?.nextWorkstream === "string" &&
      scenario.handoff.nextWorkstream.length > 0,
    `scenario ${scenario.id} must define handoff.nextWorkstream`
  );
  assert(
    Array.isArray(scenario.verification?.checks) && scenario.verification.checks.length > 0,
    `scenario ${scenario.id} must define verification.checks`
  );
  assert(
    Array.isArray(scenario.verification?.targets) &&
      scenario.verification.targets.length > 0,
    `scenario ${scenario.id} must define verification.targets`
  );

  const expectedResultCount =
    scenario.expectedResults.ui.length +
    scenario.expectedResults.domain.length +
    scenario.expectedResults.persistence.length;
  assert(
    expectedResultCount > 0,
    `scenario ${scenario.id} must define at least one expected result`
  );

  if (scenarioIds.has(scenario.id)) {
    failures.push(`scenario id must be unique: ${scenario.id}`);
  }
  scenarioIds.add(scenario.id);

  for (const formation of scenario.inputs.formations ?? []) {
    assert(
      harness.supportedFormations.includes(formation),
      `scenario ${scenario.id} uses unsupported formation: ${formation}`
    );
  }

  for (const docPath of scenario.linkedDocs ?? []) {
    assert(
      fs.existsSync(path.join(rootDir, docPath)),
      `scenario ${scenario.id} references missing doc: ${docPath}`
    );
  }

  assert(
    fs.existsSync(path.join(rootDir, scenario.linkedExecPlan)),
    `scenario ${scenario.id} references missing exec-plan: ${scenario.linkedExecPlan}`
  );

  for (const checkId of scenario.verification.checks ?? []) {
    assert(
      commandIds.has(checkId),
      `scenario ${scenario.id} references unknown verification check: ${checkId}`
    );
  }

  for (const target of scenario.verification.targets ?? []) {
    assert(
      allowedVerificationKinds.has(target.kind),
      `scenario ${scenario.id} uses unsupported verification target kind: ${target.kind}`
    );
    assert(
      allowedVerificationStates.has(target.state),
      `scenario ${scenario.id} uses unsupported verification target state: ${target.state}`
    );
    assert(
      typeof target.path === "string" && target.path.length > 0,
      `scenario ${scenario.id} verification target path is required`
    );
    assert(
      typeof target.note === "string" && target.note.length > 0,
      `scenario ${scenario.id} verification target note is required`
    );

    if (target.state === "existing") {
      assert(
        fs.existsSync(path.join(rootDir, target.path)),
        `scenario ${scenario.id} references missing existing verification target: ${target.path}`
      );
    }
  }
}

for (const docPath of harness.repositoryHarness?.requiredDocs ?? []) {
  assert(fs.existsSync(path.join(rootDir, docPath)), `required doc missing: ${docPath}`);
}

for (const command of harness.repositoryHarness?.validationCommands ?? []) {
  const tokens = command.command.split(" ");
  if (tokens[0] === "npm" && tokens[1] === "run") {
    const scriptName = tokens[2];
    assert(
      typeof packageJson.scripts?.[scriptName] === "string",
      `validation command references missing npm script: ${scriptName}`
    );
  }
}

const hasHarnessRepoCommand = harness.repositoryHarness?.validationCommands?.some(
  (command) => command.command === "npm run harness:repo"
);
const hasHarnessTestCommand = harness.repositoryHarness?.validationCommands?.some(
  (command) => command.command === "npm run test:harness"
);
const hasPlaywrightCommand = harness.repositoryHarness?.validationCommands?.some(
  (command) => command.command === "npm run test:playwright"
);
const hasTestCommand = harness.repositoryHarness?.validationCommands?.some(
  (command) => command.command === "npm run test"
);
assert(hasHarnessRepoCommand, "repositoryHarness must reference npm run harness:repo");
assert(hasHarnessTestCommand, "repositoryHarness must reference npm run test:harness");
assert(hasPlaywrightCommand, "repositoryHarness must reference npm run test:playwright");
assert(hasTestCommand, "repositoryHarness must reference npm run test");

assert(
  fs.existsSync(path.join(rootDir, harness.repositoryHarness.ciGate.workflowPath)),
  `repositoryHarness ci workflow missing: ${harness.repositoryHarness.ciGate.workflowPath}`
);

for (const requiredCommand of harness.repositoryHarness?.ciGate?.requiredCommands ?? []) {
  const hasCommand = harness.repositoryHarness.validationCommands.some(
    (command) => command.command === requiredCommand
  );
  assert(hasCommand, `repositoryHarness ciGate references unknown command: ${requiredCommand}`);
}

if (failures.length > 0) {
  console.error("Harness validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Harness validation passed: ${harness.scenarios.length} scenarios, ${harness.repositoryHarness.validationCommands.length} commands, ${harness.repositoryHarness.requiredDocs.length} required docs.`
);
