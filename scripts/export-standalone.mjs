import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
let html = readFileSync("dist/index.html", "utf8");
const js = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/)[1];
const css = html.match(/<link[^>]*href="([^"]+\.css)"[^>]*>/)[1];
const stylesheet = readFileSync("dist/" + css.replace(/^\.\//, ""), "utf8")
  .replace(/url\(([^)]+\.(?:ttf|jpg|webp))\)/g, (_, assetPath) => {
    const asset = readFileSync(resolve("dist", dirname(css), assetPath));
    const mime = assetPath.endsWith('.ttf') ? 'font/ttf' : assetPath.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
    return `url(data:${mime};base64,${asset.toString("base64")})`;
  });
let code = readFileSync("dist/" + js.replace(/^\.\//, ""), "utf8");
code = code.replace(/new URL\("([^"/]+\.(?:jpg|webp))",import\.meta\.url\)\.href/g, (_, file) => {
  const data = readFileSync(resolve("dist", dirname(js), file));
  const mime = file.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
  return JSON.stringify(`data:${mime};base64,${data.toString('base64')}`);
});
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
