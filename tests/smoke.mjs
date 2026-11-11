import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
const base = process.env.TEST_URL || "http://127.0.0.1:4173";
const results = [];
async function test(name, fn) {
  await fn();
  results.push(name);
  console.log("PASS", name);
}
try {
  await page.goto(base);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const app = page.getByTestId("device-screen");
  const button = (name) => app.getByRole("button", { name, exact: true });
  const scenario = (name) =>
    page
      .locator(".scenario-list")
      .getByRole("button", { name: new RegExp(name) })
      .click();
  async function checkout() {
    await app.getByRole("checkbox").check();
    await button("Подтвердить в демо").click();
  }
  await test("Home, artwork and persistent navigation", async () => {
    await expect(app.getByText("Вернуться")).toBeVisible();
    await expect(app.locator(".contour")).toBeVisible();
    await app.screenshot({ path: "artifacts/mobile-home.png" });
    await page.screenshot({ path: "artifacts/desktop.png", fullPage: true });
  });
  await test("Practice matching, player and saved item", async () => {
    await button("Подобрать практику").click();
    await button("10 минут").click();
    await button("Найти практику").click();
    await app.getByRole("button", { name: /Тишина внутри/ }).click();
    await button("Сохранить на потом").click();
    await button("Начать практику").click();
    await button("Начать").click();
    await button("Следующий шаг").click();
    await expect(app.getByText("Шаг 2 из 4")).toBeVisible();
    await button("Завершить практику").click();
    await expect(
      app.getByRole("heading", { name: "Эта пауза — для вас" }),
    ).toBeVisible();
    await button("Перейти в «Моё»").click();
    await app.getByRole("button", { name: /Тишина внутри/ }).click();
    await expect(
      app.getByRole("heading", { name: "Тишина внутри" }),
    ).toBeVisible();
  });
  await test("Master, service, slot, checkout and cancellation", async () => {
    await scenario("Выбрать мастера");
    await app.getByRole("button", { name: /Анна Мир/ }).click();
    await button("Выбрать время").click();
    await button("16 ноября").click();
    await button("12:30").click();
    await button("Продолжить").click();
    await checkout();
    await expect(
      app.getByRole("heading", { name: "Вы записаны" }),
    ).toBeVisible();
    await button("Перейти в «Моё»").click();
    await app
      .getByRole("button", { name: /Индивидуальная практика внимания/ })
      .click();
    await expect(app.getByText(/16 ноября · 12:30/).first()).toBeVisible();
    await button("Отменить демозапись").click();
    await expect(app.locator(".ticket-status")).toContainText("Отменена");
  });
  await test("Offline class, filters and booking", async () => {
    await scenario("Записаться на занятие");
    await button("Офлайн").click();
    await expect(
      app.getByRole("button", { name: /Йога для начинающих/ }),
    ).toHaveCount(0);
    await app.getByRole("button", { name: /Тело и тишина/ }).click();
    await expect(
      app.getByText(/Москва, демонстрационная студия/),
    ).toBeVisible();
    await button("Записаться").click();
    await checkout();
    await button("Перейти в «Моё»").click();
    await expect(
      app.getByRole("button", { name: /Тело и тишина/ }),
    ).toBeVisible();
  });
  await test("Course purchase, lessons and persistence", async () => {
    await scenario("Открыть мини-курс");
    await button("Купить курс · демо").click();
    await checkout();
    await button("Открыть уроки").click();
    await app.getByRole("button", { name: /Знакомство с собой/ }).click();
    await button("Завершить и перейти дальше").click();
    await expect(
      app.getByRole("heading", { name: "Дыхание и внимание" }),
    ).toBeVisible();
    await page.reload();
    await button("Моё").click();
    await button("Курсы").click();
    await expect(app.getByRole("button", { name: /Свой ритм/ })).toBeVisible();
  });
  await test("YOG brief validates and saves a local request", async () => {
    await scenario("Создать встречу YOG");
    await button("Для команды").click();
    await app.getByLabel("Город", { exact: true }).fill("Москва");
    await app.getByLabel("Участников", { exact: true }).fill("12");
    await app
      .getByLabel("Что важно для вашей встречи?")
      .fill("Мягкая йога и медитация для команды");
    await button("Сохранить демозаявку").click();
    await expect(
      app.getByRole("heading", { name: "Идея встречи сохранена" }),
    ).toBeVisible();
    await button("Перейти в «Моё»").click();
    await expect(app.locator(".request-item")).toContainText("Для команды");
  });
  await test("Author course draft", async () => {
    await app
      .getByRole("button", { name: /Предложить свой мини-курс/ })
      .click();
    await app
      .getByLabel("Название курса", { exact: true })
      .fill("Бережное утро");
    await app.getByLabel("Для кого эта практика?").fill("Для начинающих");
    await app
      .getByLabel("Программа", { exact: true })
      .fill("Дыхание, внимание, мягкая практика");
    await app.getByLabel("Ориентир стоимости, ₽").fill("1900");
    await button("Сохранить черновик курса").click();
    await expect(
      app.getByRole("heading", { name: "Черновик курса сохранён" }),
    ).toBeVisible();
    await button("Перейти в «Моё»").click();
    await expect(app.getByText("Бережное утро")).toBeVisible();
  });
  await test("Catalog search empty state and recovery", async () => {
    await button("Исследовать").click();
    await app.getByLabel("Поиск по каталогу").fill("несуществующее");
    await expect(app.getByText(/Ничего не найдено/)).toBeVisible();
    await button("Очистить поиск").click();
    await button("Подкасты").click();
    await app.getByRole("button", { name: /Забота без чувства вины/ }).click();
    await expect(
      app.getByRole("heading", { name: "Забота без чувства вины" }),
    ).toBeVisible();
  });
  await test("JTBD filtering and scenario link", async () => {
    await page
      .locator(".sidebar")
      .getByRole("button", { name: /Jobs to Be Done/ })
      .click();
    await page.getByRole("button", { name: "Для автора", exact: true }).click();
    await page
      .getByRole("button", { name: /Поделиться своей практикой/ })
      .click();
    await page.getByRole("button", { name: /Пройти этот путь/ }).click();
    await expect(
      app.getByRole("heading", { name: "Поделиться своей практикой" }),
    ).toBeVisible();
  });
  await test("CJM switching and full document", async () => {
    await page.locator(".sidebar").getByRole("button", { name: /CJM/ }).click();
    await page
      .getByRole("button", { name: "Событие YOG", exact: true })
      .click();
    await expect(
      page.getByText("От идеи совместной практики до живого опыта"),
    ).toBeVisible();
    await page.screenshot({ path: "artifacts/cjm.png", fullPage: true });
    await page.locator(".full-document summary").click();
    await expect(page.locator(".markdown h1")).toContainText("CJM");
  });
  await test("User Flow switching and prototype entry", async () => {
    await page
      .locator(".sidebar")
      .getByRole("button", { name: /User Flow/ })
      .click();
    await page
      .locator(".flow-menu")
      .getByRole("button", { name: /Купить мини-курс/ })
      .click();
    await expect(page.locator(".flow-steps li")).toHaveCount(6);
    await page
      .getByRole("button", { name: "Пройти сценарий", exact: true })
      .click();
    await expect(app.getByRole("heading", { name: "Свой ритм" })).toBeVisible();
  });
  await test("Mobile responsive layouts and app navigation", async () => {
    await page.setViewportSize({ width: 390, height: 1000 });
    await page.locator(".wordmark").click();
    await button("YOG").click();
    await expect(
      app.getByRole("heading", { name: "Быть ближе. Быть вместе." }),
    ).toBeVisible();
    await button("SATTVA").click();
    await page.screenshot({
      path: "artifacts/mobile-workspace.png",
      fullPage: true,
    });
    if (
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
    )
      throw Error("Horizontal viewport overflow");
    await expect(button("Моё")).toBeVisible();
  });
  if (errors.length) throw Error("Browser errors: " + errors.join("\n"));
  console.log(
    `${results.length} scenarios passed; no browser console or runtime errors.`,
  );
} finally {
  await browser.close();
}
