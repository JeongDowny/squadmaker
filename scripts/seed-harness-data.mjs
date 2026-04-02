import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const latestDir = path.join(rootDir, "harness/reports/latest");
const playersPath = path.join(rootDir, "harness/fixtures/players/example-squad.json");
const matchPath = path.join(rootDir, "harness/fixtures/matches/example-match.json");

const players = JSON.parse(fs.readFileSync(playersPath, "utf8"));
const match = JSON.parse(fs.readFileSync(matchPath, "utf8"));

const summary = {
  generatedAt: new Date().toISOString(),
  players: players.players.length,
  matchTitle: match.title,
  quarterCount: match.quarterCount,
  formations: match.formations
};

fs.mkdirSync(latestDir, { recursive: true });
fs.writeFileSync(
  path.join(latestDir, "seed-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8"
);

console.log("Harness seed summary updated:", summary.matchTitle);
