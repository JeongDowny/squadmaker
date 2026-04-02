import fs from "node:fs";
import path from "node:path";

const latestDir = path.join(process.cwd(), "harness/reports/latest");

if (!fs.existsSync(latestDir)) {
  console.log("No latest harness report directory found.");
  process.exit(0);
}

const files = fs.readdirSync(latestDir).sort();

console.log("Latest harness report files:");
for (const file of files) {
  const fullPath = path.join(latestDir, file);
  const stats = fs.statSync(fullPath);
  if (stats.isDirectory()) {
    console.log(`- ${file}/`);

    const nestedFiles = fs.readdirSync(fullPath).sort();
    for (const nestedFile of nestedFiles) {
      const nestedPath = path.join(fullPath, nestedFile);
      const nestedStats = fs.statSync(nestedPath);
      console.log(`  - ${nestedFile} (${nestedStats.size} bytes)`);
    }
  } else {
    console.log(`- ${file} (${stats.size} bytes)`);
  }
}
