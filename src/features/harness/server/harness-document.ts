import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

export type ValidationCommand = {
  id: string;
  command: string;
  purpose: string;
  category: "static-check" | "build-check" | "harness-check";
};

export type VerificationTarget = {
  kind: "ui" | "domain" | "persistence";
  path: string;
  state: "existing" | "planned";
  note: string;
};

export type ScenarioInput = {
  matchTitle: string;
  matchDate: string;
  quarterCount: number;
  formations: string[];
  playerCount: number;
  notes: string[];
};

export type ExpectedResults = {
  ui: string[];
  domain: string[];
  persistence: string[];
};

export type HarnessHandoff = {
  dependsOn: string[];
  deliverables: string[];
  readyWhen: string[];
  nextWorkstream: string;
};

export type HarnessScenario = {
  id: string;
  title: string;
  stage:
    | "onboarding"
    | "setup"
    | "recommendation"
    | "editing"
    | "persistence"
    | "reliability";
  scenarioType: "happy-path" | "warning-path" | "failure-path";
  priority: "P0" | "P1" | "P2";
  owner: "frontend" | "domain" | "persistence" | "product";
  status: "contract-ready" | "in_progress" | "verified" | "blocked";
  objective: string;
  linkedExecPlan: string;
  inputs: ScenarioInput;
  assertions: string[];
  expectedResults: ExpectedResults;
  manualChecks: string[];
  linkedDocs: string[];
  verification: {
    checks: string[];
    targets: VerificationTarget[];
  };
  handoff: HarnessHandoff;
};

export type HarnessDocument = {
  meta: {
    version: string;
    purpose: string;
    owner: string;
  };
  repositoryHarness: {
    goals: string[];
    requiredDocs: string[];
    validationCommands: ValidationCommand[];
    workflowRequirements: string[];
    handoffContract: {
      requiredScenarioFields: string[];
      requiredWorkArtifactNotes: string[];
    };
    ciGate: {
      workflowPath: string;
      requiredCommands: string[];
    };
    gates: string[];
  };
  applicationHarness: {
    route: string;
    focusAreas: string[];
    defaultViewportChecks: string[];
  };
  supportedFormations: string[];
  scenarios: HarnessScenario[];
};

const harnessPath = path.join(process.cwd(), "harness/config/repository-harness.json");

export const getHarnessDocument = cache(() => {
  const file = fs.readFileSync(harnessPath, "utf8");
  return JSON.parse(file) as HarnessDocument;
});

const priorityRank: Record<HarnessScenario["priority"], number> = {
  P0: 0,
  P1: 1,
  P2: 2,
};

const stageLabels: Record<HarnessScenario["stage"], string> = {
  onboarding: "Onboarding",
  setup: "Setup",
  recommendation: "Recommendation",
  editing: "Editing",
  persistence: "Persistence",
  reliability: "Reliability",
};

export function getStageLabel(stage: HarnessScenario["stage"]) {
  return stageLabels[stage];
}

const scenarioTypeLabels: Record<HarnessScenario["scenarioType"], string> = {
  "happy-path": "Happy Path",
  "warning-path": "Warning Path",
  "failure-path": "Failure Path",
};

export function getScenarioTypeLabel(type: HarnessScenario["scenarioType"]) {
  return scenarioTypeLabels[type];
}

const statusLabels: Record<HarnessScenario["status"], string> = {
  "contract-ready": "Contract Ready",
  in_progress: "In Progress",
  verified: "Verified",
  blocked: "Blocked",
};

export function getScenarioStatusLabel(status: HarnessScenario["status"]) {
  return statusLabels[status];
}

export function getScenarioPreview(limit?: number) {
  const harness = getHarnessDocument();
  const ordered = [...harness.scenarios].sort((left, right) => {
    const priorityDiff = priorityRank[left.priority] - priorityRank[right.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return left.title.localeCompare(right.title, "ko");
  });

  return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
}

export function getHarnessCounts() {
  const harness = getHarnessDocument();
  const verified = harness.scenarios.filter((scenario) => scenario.status === "verified").length;
  const contractReady = harness.scenarios.filter(
    (scenario) => scenario.status === "contract-ready"
  ).length;

  return {
    scenarios: harness.scenarios.length,
    repositoryCommands: harness.repositoryHarness.validationCommands.length,
    focusAreas: harness.applicationHarness.focusAreas.length,
    requiredDocs: harness.repositoryHarness.requiredDocs.length,
    verified,
    contractReady,
  };
}
