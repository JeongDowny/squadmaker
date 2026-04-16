import fs from "node:fs";
import path from "node:path";

function getTodayInSeoul() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function readPrompt(args, inlineKey, fileKey) {
  if (typeof args[fileKey] === "string") {
    return fs.readFileSync(path.resolve(process.cwd(), args[fileKey]), "utf8").trim();
  }

  if (typeof args[inlineKey] === "string") {
    return args[inlineKey].trim();
  }

  return "";
}

function toCodeBlock(value, fallback) {
  const content = value || fallback;
  return `\`\`\`text\n${content}\n\`\`\``;
}

function printHelp() {
  console.log(`Usage:
  npm run harness:prompt-log -- --pr PR-001 --title "prompt log title" [options]

Options:
  --date YYYY-MM-DD
  --pr PR-001
  --title "section title"
  --user-prompt "..."
  --user-prompt-file path/to/file.txt
  --working-prompt "..."
  --working-prompt-file path/to/file.txt
  --execution-log docs/execution-logs/YYYY-MM-DD.md
  --help
`);
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const date = typeof args.date === "string" ? args.date : getTodayInSeoul();
const pr = typeof args.pr === "string" ? args.pr : "";
const title = typeof args.title === "string" ? args.title : "";

if (!pr || !title) {
  printHelp();
  console.error("Both --pr and --title are required.");
  process.exit(1);
}

const promptLogDir = path.join(process.cwd(), "docs/prompt-logs");
const promptLogPath = path.join(promptLogDir, `${date}.md`);
const executionLogPath =
  typeof args["execution-log"] === "string"
    ? args["execution-log"]
    : `docs/execution-logs/${date}.md`;

const userPrompt = readPrompt(args, "user-prompt", "user-prompt-file");
const workingPrompt = readPrompt(args, "working-prompt", "working-prompt-file");
const sectionHeader = `## ${pr} ${title}`;

fs.mkdirSync(promptLogDir, { recursive: true });

let fileContents = fs.existsSync(promptLogPath)
  ? fs.readFileSync(promptLogPath, "utf8")
  : `# ${date}\n`;

if (!fileContents.endsWith("\n")) {
  fileContents += "\n";
}

if (fileContents.includes(`${sectionHeader}\n`)) {
  console.log(
    `Prompt log section already exists: ${path.relative(process.cwd(), promptLogPath)} :: ${sectionHeader}`
  );
  process.exit(0);
}

const section = `
## ${pr} ${title}

### 사용자 원문 프롬프트
${toCodeBlock(userPrompt, "사용자 원문 프롬프트를 여기에 기록한다.")}

### 작업용 정리 프롬프트
${toCodeBlock(workingPrompt, "구현자가 실제로 사용한 작업용 정리 프롬프트를 여기에 기록한다.")}

### 제약 / 참고 문서
- \`AGENTS.md\`
- 관련 상위 문서와 active exec-plan

### 연결 execution log
- \`${executionLogPath}\`

### 비고
- 민감 정보는 기록하지 않는다.
`;

fs.writeFileSync(promptLogPath, `${fileContents}${section}`, "utf8");

console.log(`Prompt log scaffolded: ${path.relative(process.cwd(), promptLogPath)}`);
