// @astrojs/vercel 7.6 only knows Node 18/20 and falls back to the retired
// "nodejs18.x" runtime on newer Node versions (Vercel builds on the project's
// Node version, e.g. 26.x). Rewrite the function runtime to match the Node
// version used for the build so deployments are accepted.
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dir = ".vercel/output/functions";
if (!existsSync(dir)) process.exit(0);
const major = Number(process.versions.node.split(".")[0]);
const runtime = `nodejs${Math.max(major, 20)}.x`;

for (const name of readdirSync(dir)) {
  const file = join(dir, name, ".vc-config.json");
  if (!existsSync(file)) continue;
  const config = JSON.parse(readFileSync(file, "utf8"));
  if (config.runtime && config.runtime !== runtime && config.runtime.startsWith("nodejs")) {
    console.log(`[fix-vercel-runtime] ${name}: ${config.runtime} -> ${runtime}`);
    config.runtime = runtime;
    writeFileSync(file, JSON.stringify(config, null, "\t"));
  }
}
