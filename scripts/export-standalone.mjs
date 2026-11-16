import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
let html = readFileSync("dist/index.html", "utf8");
const js = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/)[1];
const css = html.match(/<link[^>]*href="([^"]+\.css)"[^>]*>/)[1];
const stylesheet = readFileSync("dist/" + css.replace(/^\.\//, ""), "utf8")
  .replace(/url\(([^)]+\.ttf)\)/g, (_, fontPath) => {
    const font = readFileSync(resolve("dist", dirname(css), fontPath));
    return `url(data:font/ttf;base64,${font.toString("base64")})`;
  });
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
      `<style>${stylesheet}</style>`,
  )
  .replace(
    "./favicon.svg",
    "data:image/svg+xml;base64," +
      readFileSync("dist/favicon.svg").toString("base64"),
  );
mkdirSync("artifacts", { recursive: true });
writeFileSync("artifacts/sattva-prototype.html", html);
console.log("artifacts/sattva-prototype.html");
