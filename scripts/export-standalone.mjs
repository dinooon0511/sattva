import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
let html = readFileSync("dist/index.html", "utf8");
const js = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/)[1];
const css = html.match(/<link[^>]*href="([^"]+\.css)"[^>]*>/)[1];
let code = readFileSync("dist/" + js.replace(/^\.\//, ""), "utf8");
for (const file of [
  "contour.png",
  ...[
    "01-home",
    "02-catalog",
    "03-course",
    "04-teacher",
    "05-checkout",
    "06-yog",
  ].map((x) => "audit/" + x + ".png"),
])
  code = code.replaceAll(
    "./" + file,
    "data:image/png;base64," + readFileSync("dist/" + file).toString("base64"),
  );
code = code.replaceAll("</script", "<\\/script");
html = html
  .replace(
    /<script[^>]*src="[^"]+"[^>]*><\/script>/,
    () => `<script type="module">${code}</script>`,
  )
  .replace(
    /<link[^>]*href="[^"]+\.css"[^>]*>/,
    () =>
      `<style>${readFileSync("dist/" + css.replace(/^\.\//, ""), "utf8")}</style>`,
  )
  .replace(
    "./favicon.svg",
    "data:image/svg+xml;base64," +
      readFileSync("dist/favicon.svg").toString("base64"),
  );
mkdirSync("artifacts", { recursive: true });
writeFileSync("artifacts/sattva-prototype.html", html);
console.log("artifacts/sattva-prototype.html");
