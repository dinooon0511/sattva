import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const b = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
  proxy: process.env.HTTPS_PROXY
    ? { server: process.env.HTTPS_PROXY }
    : undefined,
});
try {
  const p = await b.newPage({ viewport: { width: 1440, height: 1200 } });
  await p.emulateMedia({ reducedMotion: "reduce" });
  const errors = [],
    bad = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  // Chromium lacks the environment CA in its native root store. Playwright's API fetch
  // uses the supplied proxy and trusted Node CA; TLS verification stays enabled.
  await p.route("https://**/*", async (r) => {
    const response = await r.fetch();
    if (response.status() >= 400)
      bad.push(`${response.status()} ${new URL(r.request().url()).pathname}`);
    await r.fulfill({ response });
  });
  await p.goto("https://dinooon0511.github.io/sattva/");
  const app = p.getByTestId("device-screen");
  await expect(
    app.getByRole("heading", { name: "Вернуться к себе" }),
  ).toBeVisible();
  await expect(
    p.locator(".sidebar").getByRole("button", { name: /Бизнес и рост/ }),
  ).toBeVisible();
  await app.locator("img").evaluateAll(imgs => Promise.all(imgs.map(im => im.decode())));
  await p.screenshot({ path: "artifacts/public-v2-home.png", fullPage: true });
  console.log("PASS public homepage, built assets and v2 workspace");
  await app
    .locator(".app-bottom")
    .getByRole("button", { name: "Курсы", exact: true })
    .click();
  await app.getByRole("button", { name: "Офлайн", exact: true }).click();
  await app.getByRole("button", { name: /Четыре дня баланса/ }).click();
  await expect(app.locator(".purchase-dock")).toContainText(/18\s000/);
  await app.locator("img").evaluateAll(imgs => Promise.all(imgs.map(im => im.decode())));
  await app.screenshot({ path: "artifacts/public-v2-course.png" });
  await app
    .getByRole("button", { name: "Приобрести · демо", exact: true })
    .click();
  await app.getByRole("checkbox").check();
  await app
    .getByRole("button", { name: "Подтвердить в демо", exact: true })
    .click();
  await expect(
    app.getByRole("heading", { name: "Программа теперь ваша" }),
  ).toBeVisible();
  console.log("PASS public offline course and demonstration purchase");
  await app.getByRole("button", { name: "YOG", exact: true }).click();
  await app
    .locator(".app-bottom")
    .getByRole("button", { name: "Форматы", exact: true })
    .click();
  await app.getByRole("button", { name: "Для бренда", exact: true }).click();
  await app.getByRole("button", { name: /PR-событие для бренда/ }).click();
  await expect(app.getByText(/PR-размещения/)).toBeVisible();
  console.log("PASS public YOG commercial formats");
  await p.locator(".sidebar").getByRole("button", { name: /Аудит/ }).click();
  await p
    .getByText("Посмотреть исходные экраны и шаги аудита", { exact: true })
    .click();
  await expect(p.locator(".evidence-layout img")).toBeVisible();
  await p.locator(".evidence-layout img").evaluate((im) => im.decode());
  console.log("PASS public audit and actual source screenshots");
  await p
    .locator(".sidebar")
    .getByRole("button", { name: /Бизнес и рост/ })
    .click();
  await p.getByRole("button", { name: "Экономика", exact: true }).click();
  await expect(p.locator(".economics-result h3")).toHaveText(/33\s000 ₽/);
  await p.getByLabel("Цена единицы, ₽", { exact: true }).fill("0");
  await expect(p.getByText("Не достигается", { exact: true })).toBeVisible();
  console.log("PASS public business model and calculator");
  if (errors.length || bad.length) throw Error([...errors, ...bad].join("\n"));
  console.log(
    "Public live verification passed: five scenarios, no console/runtime/asset errors. TLS verification preserved.",
  );
} finally {
  await b.close();
}
