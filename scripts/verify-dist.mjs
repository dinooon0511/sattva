import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
const html = readFileSync("dist/index.html", "utf8");
if (/(?:src|href)=["']\/?src\//.test(html))
  throw Error(
    "Production HTML references source files instead of built assets",
  );
const files = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
  .map((m) => m[1])
  .filter((x) => !x.startsWith("http") && !x.startsWith("data:"));
for (const file of files) {
  if (!existsSync(resolve("dist", file)))
    throw Error("Missing production asset: " + file);
}
for (const f of [
  "contour.png",
  "favicon.svg",
  ...[
    "01-home",
    "02-catalog",
    "03-course",
    "04-teacher",
    "05-checkout",
    "06-yog",
  ].map((x) => "audit/" + x + ".png"),
]) {
  if (!existsSync("dist/" + f)) throw Error("Missing public file: " + f);
}
if (
  !files.some((f) => f.endsWith(".js")) ||
  !files.some((f) => f.endsWith(".css"))
)
  throw Error("Missing built JS/CSS");
console.log(
  "Production HTML points to existing built assets; artwork and six audit screenshots are present.",
);
