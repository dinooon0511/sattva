import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const b = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await b.newPage({ viewport: { width: 1440, height: 1200 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.emulateMedia({ reducedMotion: "reduce" });
const base = process.env.TEST_URL || "http://127.0.0.1:4173";
const results = [];
async function test(name, f) {
  await f();
  results.push(name);
  console.log("PASS", name);
}
try {
  await page.goto(base);
  const app = page.getByTestId("device-screen");
  const btn = (n) => app.getByRole("button", { name: n, exact: true });
  const content = () => app.locator(".app-content");
  const nav = (n) =>
    app
      .locator(".app-bottom")
      .getByRole("button", { name: n, exact: true })
      .click();
  const section = (n) =>
    page
      .locator(".sidebar")
      .getByRole("button", { name: new RegExp(n) })
      .click();
  const row = (t) => app.getByRole("button", { name: new RegExp(t) }).click();
  const primary = () => app.locator(".primary").last().click();
  async function checkOut() {
    await app.getByRole("checkbox").check();
    await btn("Подтвердить в демо").click();
  }
  await test("Homepage preserves the selected light direction and separate navigation", async () => {
    await expect(
      app.getByRole("heading", { name: "Вернуться к себе" }),
    ).toBeVisible();
    await expect(app.locator(".contour")).toBeVisible();
    await expect(app.locator(".app-bottom button")).toHaveCount(5);
    await app.screenshot({ path: "artifacts/v2-home.png" });
    await page.screenshot({ path: "artifacts/v2-desktop.png", fullPage: true });
  });
  await test("Multiple meditations and audio/video library filters", async () => {
    await nav("Практики");
    await btn("Медитации").click();
    expect(await app.locator(".app-row").count()).toBeGreaterThan(5);
    await content().getByLabel("Формат", { exact: true }).selectOption("Аудио");
    await expect(
      app.getByRole("button", { name: /Отпустить день/ }),
    ).toBeVisible();
    await btn("Йога").click();
    await content().getByLabel("Формат", { exact: true }).selectOption("Видео");
    expect(await app.locator(".app-row").count()).toBeGreaterThan(4);
    await row("Подвижность после рабочего дня");
    await btn("Открыть видеоурок").click();
    await expect(app.getByText(/нет звука или видеопотока/)).toBeVisible();
    await btn("Начать").click();
    await btn("Следующий шаг").click();
    await expect(app.getByText("ШАГ 2 ИЗ 4")).toBeVisible();
    await btn("Завершить практику").click();
    await expect(
      app.getByRole("heading", { name: "Эта пауза — для вас" }),
    ).toBeVisible();
  });
  await test("Matching empty state, recovery and saving a meditation", async () => {
    await nav("Главная");
    await btn("Подобрать практику").click();
    await btn("5 минут").click();
    await app.getByRole("button", { name: /Показать практики/ }).click();
    await expect(
      app.getByRole("heading", { name: "Дадим себе больше времени?" }),
    ).toBeVisible();
    await btn("Изменить подбор").click();
    await btn("10 минут").click();
    await app.getByRole("button", { name: /Показать практики/ }).click();
    await row("Тишина внутри");
    await btn("Сохранить на потом").click();
    await nav("Моё");
    await btn("Избранное").click();
    await expect(
      app.getByRole("button", { name: /Тишина внутри/ }),
    ).toBeVisible();
  });
  await test("Teacher filters, profile, offline package and sticky price action", async () => {
    await nav("Занятия");
    await row("Личное занятие");
    await app.getByLabel("Поиск преподавателя").fill("Мария");
    await row("Мария Лес");
    await expect(app.locator(".purchase-dock")).toBeVisible();
    await btn("Выбрать время").click();
    await app.getByLabel("Формат услуги").selectOption("Пакет из 4 занятий");
    await btn("Офлайн").click();
    await btn("16 ноября").click();
    await btn("12:30").click();
    await btn("Проверить детали").click();
    await expect(app.getByText(/Санкт-Петербург/).first()).toBeVisible();
    await checkOut();
    await expect(
      app.getByRole("heading", { name: "Вы записаны" }),
    ).toBeVisible();
    await btn("Посмотреть запись").click();
    await row("4 занятия");
    await expect(app.getByText(/Пакет: 4 занятия/)).toBeVisible();
  });
  await test("Cancellation confirmation and retained booking history", async () => {
    await btn("Отменить демозапись").click();
    await btn("Сохранить запись").click();
    await expect(app.locator(".ticket-status")).toContainText("Подтверждена");
    await btn("Отменить демозапись").click();
    await btn("Да, отменить").click();
    await expect(app.locator(".ticket-status")).toContainText("Отменена");
  });
  await test("Offline calendar filtering and a single confirmed booking", async () => {
    await nav("Занятия");
    await btn("Офлайн").click();
    await app.getByLabel("Город", { exact: true }).selectOption("Москва");
    await row("Тело и тишина");
    await expect(app.locator(".purchase-dock")).toBeVisible();
    await btn("Записаться").click();
    await checkOut();
    await btn("Посмотреть запись").click();
    await expect(
      app.getByRole("button", { name: /Тело и тишина/ }),
    ).toBeVisible();
  });
  await test("Full class waitlist and user-controlled removal", async () => {
    await nav("Занятия");
    await app.getByLabel("Дата", { exact: true }).selectOption("22 ноября");
    await row("Практика в малом кругу");
    await btn("В лист ожидания").click();
    await nav("Моё");
    await expect(app.getByText("Практика в малом кругу")).toBeVisible();
    await btn("Покинуть лист ожидания").click();
    await expect(
      app.getByText("Вы ещё не записывались в лист ожидания."),
    ).toBeVisible();
  });
  await test("Dedicated course catalog, offline Petersburg syllabus and enrollment", async () => {
    await nav("Курсы");
    await btn("Офлайн").click();
    await row("Четыре дня баланса");
    await expect(
      app.getByRole("heading", { name: "Программа по дням" }),
    ).toBeVisible();
    await expect(app.getByText(/26–29 ноября 2026/)).toBeVisible();
    await expect(app.getByRole("button", { name: /День 4/ })).toBeVisible();
    await expect(app.getByText("Проживание, дорога и питание", { exact: true }))
      .toBeVisible({ timeout: 5000 })
      .catch(async () => {
        await app.getByText("Что не включено", { exact: true }).click();
        await expect(
          app.getByText("Проживание, дорога и питание", { exact: true }),
        ).toBeVisible();
      });
    await btn("Приобрести · демо").click();
    await checkOut();
    await btn("Открыть программу").click();
    await btn("Открыть").click();
    await expect(app.getByText("Ваша офлайн-программа")).toBeVisible();
  });
  await test("Online sample, course purchase and deduplicated lesson progress", async () => {
    await nav("Курсы");
    await btn("Онлайн").click();
    await row("Медитация: первая неделя");
    await row("01 · Опора");
    await btn("Завершить урок").click();
    await btn("Посмотреть весь курс").click();
    await btn("Приобрести · демо").click();
    await checkOut();
    await btn("Открыть программу").click();
    await btn("Открыть").click();
    await row("Опора");
    await btn("Завершить и перейти дальше").click();
    await expect(
      app.getByRole("heading", { name: "Естественное дыхание" }),
    ).toBeVisible();
    await page.reload();
    await nav("Моё");
    await app
      .locator(".chips")
      .getByRole("button", { name: "Курсы", exact: true })
      .click();
    await expect(
      app.getByRole("button", { name: /Медитация: первая неделя/ }),
    ).toBeVisible();
    await expect(
      app.getByRole("button", { name: /Четыре дня баланса/ }),
    ).toBeVisible();
  });
  await test("Catalog empty-state search recovery", async () => {
    await nav("Курсы");
    await app.getByLabel("Поиск курсов").fill("несуществующее");
    await expect(
      app.getByRole("heading", { name: "Нет программы с такими фильтрами" }),
    ).toBeVisible();
    await btn("Сбросить фильтры").click();
    await expect(app.getByRole("button", { name: /Свой ритм/ })).toBeVisible();
  });
  await test("Club boundaries, demo activation and cancellation preserve courses", async () => {
    await nav("Моё");
    await row("Клуб SATTVA");
    await app
      .locator(".plan-card")
      .first()
      .getByRole("button", { name: "Попробовать в демо" })
      .click();
    await checkOut();
    await btn("Посмотреть мой доступ").click();
    await expect(
      app.getByText(/отдельные авторские курсы/i).first(),
    ).toBeVisible();
    await btn("Завершить демоподписку").click();
    await nav("Моё");
    await app
      .locator(".chips")
      .getByRole("button", { name: "Курсы", exact: true })
      .click();
    await expect(
      app.getByRole("button", { name: /Медитация: первая неделя/ }),
    ).toBeVisible();
  });
  await test("Gift certificate has chosen amount and honest nonmonetary state", async () => {
    await nav("Моё");
    await row("Подарить заботу");
    await app
      .locator(".chips button")
      .filter({ hasText: /5\s000/ })
      .click();
    await btn("Создать демоподарок").click();
    await checkOut();
    await btn("Открыть подарки").click();
    await expect(
      app.getByRole("heading", { name: /5\s000 ₽ заботы/ }),
    ).toBeVisible();
    await expect(app.getByText(/Без денежной стоимости/).first()).toBeVisible();
  });
  await test("Author draft includes access terms and remains unpublished", async () => {
    await nav("Моё");
    await row("Для преподавателей");
    await row("Предложить мини-курс");
    await app
      .getByLabel("Название курса", { exact: true })
      .fill("Бережное утро");
    await app.getByLabel("Для кого эта практика?").fill("Для первого опыта");
    await app
      .getByLabel("Программа", { exact: true })
      .fill("Опора, дыхание, движение и регулярная практика");
    await app.getByLabel("Ориентир стоимости, ₽").fill("1900");
    await app
      .getByLabel("Условия доступа")
      .fill("6 месяцев, без личной обратной связи");
    await app.getByRole("checkbox").check();
    await btn("Сохранить черновик курса").click();
    await btn("Открыть кабинет").click();
    await app
      .locator(".chips")
      .getByRole("button", { name: "Курсы", exact: true })
      .click();
    await expect(
      app.getByRole("heading", { name: "Бережное утро" }),
    ).toBeVisible();
  });
  await test("Teacher slot creation and variable commission model", async () => {
    await app
      .locator(".chips")
      .getByRole("button", { name: "Расписание", exact: true })
      .click();
    await app.getByLabel("Дата", { exact: true }).fill("2026-11-28");
    await app.getByLabel("Время (МСК)").fill("12:00");
    await btn("Добавить демослот").click();
    await expect(app.getByText("2026-11-28 · 12:00 · Онлайн")).toBeVisible();
    await app
      .locator(".chips")
      .getByRole("button", { name: "Экономика", exact: true })
      .click();
    await app.getByLabel("Занятий в месяц").fill("10");
    await expect(app.getByText(/20\s000 ₽/)).toBeVisible();
  });
  await test("YOG has commercial formats and no practice/course navigation", async () => {
    await btn("YOG").click();
    await expect(
      app
        .locator(".app-bottom")
        .getByRole("button", { name: "Практики", exact: true }),
    ).toHaveCount(0);
    await expect(
      app
        .locator(".app-bottom")
        .getByRole("button", { name: "Курсы", exact: true }),
    ).toHaveCount(0);
    await nav("Форматы");
    await btn("Для бренда").click();
    await row("PR-событие для бренда");
    await expect(app.getByText(/PR-размещения/)).toBeVisible();
    await btn("Обсудить этот формат").click();
    await expect(app.getByLabel("Задача бренда")).toBeVisible();
    await app.getByLabel("Город", { exact: true }).fill("Санкт-Петербург");
    await app.getByLabel("Участников", { exact: true }).fill("30");
    await app
      .getByLabel("Задача бренда")
      .fill("Камерная презентация с практикой внимания");
    await app
      .getByLabel("Что важно учесть?")
      .fill("Добровольное участие, отдельная зона отдыха");
    await btn("Сохранить демобриф").click();
    await btn("Посмотреть путь заявки").click();
    await expect(
      app.getByRole("heading", { name: "PR-событие для бренда" }),
    ).toBeVisible();
    await app
      .getByText("Посмотреть пример предложения", { exact: true })
      .click();
    await expect(app.getByText(/Базовый сценарий и координация/)).toBeVisible();
  });
  await test("Preferences do not send real notifications", async () => {
    await btn("SATTVA").click();
    await nav("Моё");
    await row("Предпочтения и напоминания");
    await app.getByRole("checkbox").check();
    await btn("Сохранить предпочтения").click();
    await expect(app.getByRole("status")).toContainText(
      "Реальные уведомления не отправляются",
    );
  });
  await test("Expanded JTBD has fifteen jobs, audience filters and live scenario links", async () => {
    await section("Jobs to Be Done");
    await expect(page.locator(".job-header")).toHaveCount(15);
    await page.getByRole("button", { name: "Для автора", exact: true }).click();
    await expect(page.locator(".job-header")).toHaveCount(2);
    await page
      .getByRole("button", { name: /Понимать экономику преподавания/ })
      .click();
    await page.getByRole("button", { name: /Пройти этот путь/ }).click();
    await expect(
      app.getByRole("heading", { name: "Пространство преподавателя" }),
    ).toBeVisible();
  });
  await test("Seven CJMs include touchpoints and accountable owners", async () => {
    await section("CJM");
    await page
      .getByRole("button", { name: "Офлайн-программа", exact: true })
      .click();
    await expect(page.locator(".journey-column")).toHaveCount(6);
    await expect(
      page.getByText("Владелец процесса", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Офлайн-продюсер", { exact: true }).first(),
    ).toBeVisible();
    await page.screenshot({ path: "artifacts/v2-cjm.png", fullPage: true });
  });
  await test("Thirteen user flows include B2B qualification and proposal stages", async () => {
    await section("User Flow");
    await expect(page.locator(".flow-menu button")).toHaveCount(13);
    await page
      .locator(".flow-menu")
      .getByRole("button", { name: /Продажа YOG после брифа/ })
      .click();
    await expect(page.locator(".flow-steps li")).toHaveCount(7);
    await page
      .getByRole("button", { name: "Пройти сценарий", exact: true })
      .click();
    await expect(
      app.getByRole("heading", { name: "Ваше событие YOG" }),
    ).toBeVisible();
  });
  await test("Audit evidence and marketing lens are accessible in the platform", async () => {
    await section("Аудит");
    await expect(page.locator(".audit-finding")).toHaveCount(12);
    await page.getByRole("button", { name: "Маркетинг", exact: true }).click();
    await expect(page.locator(".audit-finding")).toHaveCount(3);
    await page
      .getByText("Посмотреть исходные экраны и шаги аудита", { exact: true })
      .click();
    await expect(page.locator(".evidence-layout img")).toBeVisible();
    await page.screenshot({ path: "artifacts/v2-audit.png", fullPage: true });
  });
  await test("Business calculator responds to break-even and zero-unit contribution", async () => {
    await section("Бизнес и рост");
    await page.getByRole("button", { name: "Экономика", exact: true }).click();
    await expect(page.locator(".economics-result h3")).toHaveText(/33\s000 ₽/);
    await page.getByLabel("Цена единицы, ₽", { exact: true }).fill("0");
    await expect(
      page.getByText("Не достигается", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Занятия преподавателя", exact: true })
      .click();
    await page.getByLabel("Комиссия платформы, %").fill("0");
    await expect(
      page.getByText("Не достигается", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Развитие", exact: true }).click();
    await expect(page.locator(".roadmap article")).toHaveCount(4);
  });
  await test("Responsive workspace has no horizontal overflow on mobile/tablet", async () => {
    for (const w of [375, 390, 768]) {
      await page.setViewportSize({ width: w, height: 1000 });
      await page.locator(".wordmark").click();
      await expect(app.locator(".app-bottom")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.setViewportSize({ width: 390, height: 1000 });
    await page.screenshot({
      path: "artifacts/v2-mobile-workspace.png",
      fullPage: true,
    });
  });
  if (errors.length)
    throw Error("Browser console/runtime errors:\n" + errors.join("\n"));
  console.log(
    `${results.length} scenarios passed; no browser console or runtime errors.`,
  );
} finally {
  await b.close();
}
