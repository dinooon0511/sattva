import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  House,
  Compass,
  CalendarBlank,
  User,
  ArrowRight,
  ArrowLeft,
  CaretRight,
  Play,
  Pause,
  BookmarkSimple,
  Check,
  CheckCircle,
  X,
  ArrowCounterClockwise,
  DeviceMobile,
  ArrowsOutSimple,
  Path,
  MapTrifold,
  Target,
  BookOpen,
  Clock,
  MapPin,
  Headphones,
  SlidersHorizontal,
  Leaf,
  Users,
  Plus,
  FileText,
  MagnifyingGlass,
  ArrowSquareOut,
  DownloadSimple,
} from "@phosphor-icons/react";
import { marked } from "marked";
import { jobs, journeys, flows } from "./strategy";
import concept from "../docs/01-product-concept.md?raw";
import flowDoc from "../docs/02-user-flows.md?raw";
import cjmDoc from "../docs/03-cjm.md?raw";
import jobDoc from "../docs/04-jtbd.md?raw";
import "./style.css";
import Prototype from "./Prototype";
import BusinessViews from "./BusinessViews";
const I = ({ icon: Icon, ...p }) => (
  <Icon size={21} weight="light" aria-hidden="true" {...p} />
);
const money = (n) => `${n.toLocaleString("ru-RU")} ₽`;
const sections = [
  ["prototype", "Прототип", DeviceMobile],
  ["jobs", "Jobs to Be Done", Target],
  ["cjm", "CJM · путь клиента", MapTrifold],
  ["flows", "User Flow", Path],
  ["concept", "Концепция", BookOpen],
  ["audit", "Аудит", FileText],
  ["business", "Бизнес и рост", Compass],
];
function useSaved(key, fallback) {
  const [s, set] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(s));
    } catch {}
  }, [key, s]);
  return [s, set];
}
function App() {
  const [section, setSection] = useState(() =>
    sections.some((x) => x[0] === location.hash.slice(1))
      ? location.hash.slice(1)
      : "prototype",
  );
  const [route, setRoute] = useState("home");
  const [brand, setBrand] = useState("SATTVA");
  const [wide, setWide] = useState(false);
  const [reset, setReset] = useState(0);
  useEffect(() => {
    const f = () =>
      setSection(
        sections.some((x) => x[0] === location.hash.slice(1))
          ? location.hash.slice(1)
          : "prototype",
      );
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  const changeSection = (s) => {
    location.hash = s;
    setSection(s);
  };
  const openScenario = (r) => {
    setRoute(r);
    setBrand(["event", "formats", "cases"].includes(r) ? "YOG" : "SATTVA");
    changeSection("prototype");
  };
  return (
    <div className={"workspace " + (wide ? "expanded" : "")}>
      <aside className="sidebar">
        <a
          className="wordmark"
          href="#prototype"
          onClick={() => {
            setRoute("home");
            setBrand("SATTVA");
          }}
        >
          sattva<span className="wordmark-dot"> / yog</span>
        </a>
        <div className="side-caption">ПРОСТРАНСТВО БАЛАНСА</div>
        <div className="side-rule" />
        <div className="nav-label">ПРОЕКТ</div>
        <nav aria-label="Разделы проекта">
          {sections.map(([id, label, icon], i) => (
            <button
              key={id}
              className={section === id ? "side-link active" : "side-link"}
              onClick={() => changeSection(id)}
            >
              <I icon={icon} />
              <span>{label}</span>
              <span className="side-count">0{i + 1}</span>
            </button>
          ))}
        </nav>
        <div className="side-bottom">
          <I icon={Leaf} />
          <p>
            Два направления.
            <br />
            Один баланс.
          </p>
          <span>ИНТЕРАКТИВНОЕ ПРОСТРАНСТВО · V.02</span>
        </div>
      </aside>
      <main className="main">
        <header className="workspace-header">
          <div>
            <span className="muted">YOG / SATTVA</span>
            <span className="slash">/</span>
            <span>
              {sections.find((x) => x[0] === section)?.[1] || "Прототип"}
            </span>
          </div>
          <span className="status">
            <span />
            Рабочая концепция
          </span>
        </header>
        {section === "prototype" ? (
          <>
            <div className="page-heading">
              <div className="eyebrow">01 / ИНТЕРАКТИВНЫЙ ПРОТОТИП</div>
              <div className="heading-row">
                <h1>Почувствовать пространство</h1>
                <div className="toolbar">
                  <button
                    title="Начать заново"
                    aria-label="Начать заново"
                    onClick={() => {
                      setRoute("home");
                      setBrand("SATTVA");
                      setReset((n) => n + 1);
                    }}
                  >
                    <I icon={ArrowCounterClockwise} />
                  </button>
                  <button
                    title={wide ? "Вернуть обзор" : "Увеличить пространство"}
                    aria-label="Увеличить пространство"
                    onClick={() => setWide(!wide)}
                  >
                    <I icon={ArrowsOutSimple} />
                  </button>
                </div>
              </div>
              <p>
                От маленькой паузы — к своему ритму. Исследуйте, как это может
                работать.
              </p>
            </div>
            <div className="prototype-layout">
              <div className="prototype-stage">
                <div className="preview-label">
                  <span>TELEGRAM MINI APP</span>
                  <span>390 × 844</span>
                </div>
                <Prototype
                  key={reset}
                  route={route}
                  setRoute={setRoute}
                  brand={brand}
                  setBrand={setBrand}
                />
                <div className="preview-foot">
                  <span>Кликабельный прототип</span>
                  <span>Демо · без реальных платежей</span>
                </div>
              </div>
              <aside className="guide">
                <span className="eyebrow">ПОПРОБУЙТЕ САМИ</span>
                <h2>
                  Один шаг. <br />
                  Много возможностей.
                </h2>
                <p>
                  Нажимайте на элементы внутри экрана — здесь можно пройти весь
                  путь.
                </p>
                <div className="scenario-list">
                  {[
                    [
                      "Найти свою практику",
                      "Состояние → подбор → практика",
                      "match",
                    ],
                    ["Выбрать мастера", "Подход → услуга → запись", "masters"],
                    [
                      "Записаться на занятие",
                      "Онлайн или офлайн → билет",
                      "calendar",
                    ],
                    [
                      "Курсы и программы",
                      "Онлайн / офлайн → программа → участие",
                      "courses",
                    ],
                    [
                      "Создать встречу YOG",
                      "Формат → пожелания → заявка",
                      "event",
                    ],
                  ].map(([t, d, r], i) => (
                    <button key={r} onClick={() => openScenario(r)}>
                      <span className="scenario-number">0{i + 1}</span>
                      <span>
                        <strong>{t}</strong>
                        <small>{d}</small>
                      </span>
                      <I icon={ArrowRight} size={18} />
                    </button>
                  ))}
                </div>
                <div className="guide-note">
                  <I icon={BookmarkSimple} />
                  <p>
                    Записи, покупки и избранное сохраняются в разделе{" "}
                    <b>«Моё»</b> в этом браузере.
                  </p>
                </div>
                <button
                  className="text-link"
                  onClick={() => changeSection("flows")}
                >
                  Посмотреть логику переходов <I icon={ArrowRight} size={17} />
                </button>
              </aside>
            </div>
          </>
        ) : ["audit", "business"].includes(section) ? (
          <BusinessViews section={section} openScenario={openScenario} />
        ) : (
          <Research section={section} openScenario={openScenario} />
        )}
        <footer className="workspace-footer">
          <span>Внешнее красиво. Внутреннее истинно.</span>
          <span>YOG / SATTVA · КОНЦЕПЦИЯ ПРОДУКТА</span>
        </footer>
      </main>
    </div>
  );
}
function Research({ section, openScenario }) {
  const [filter, setFilter] = useState("Все");
  const [journey, setJourney] = useState("practice");
  const [activeFlow, setActiveFlow] = useState("match");
  const [openJob, setOpenJob] = useState("calm");
  const download = (text, name) => {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/markdown;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };
  const config =
    {
      jobs: [
        "02 / JOBS TO BE DONE",
        "Сначала — потребность",
        "Не набор функций, а причины, по которым человек приходит и возвращается.",
        jobDoc,
      ],
      cjm: [
        "03 / CUSTOMER JOURNEY MAP",
        "На стороне человека",
        "Что человек делает, чувствует и ожидает на каждом шаге.",
        cjmDoc,
      ],
      flows: [
        "04 / USER FLOW",
        "От намерения к действию",
        "Основные пути, развилки и результат каждого сценария.",
        flowDoc,
      ],
      concept: [
        "05 / КОНЦЕПЦИЯ",
        "Два направления. Один баланс.",
        "Личная практика и обучение — в SATTVA. Коммерческие события — в YOG.",
        concept,
      ],
    }[section] || [];
  return (
    <div className="research">
      <div className="page-heading">
        <span className="eyebrow">{config[0]}</span>
        <h1>{config[1]}</h1>
        <p>{config[2]}</p>
      </div>
      <div className="research-notice">
        <I icon={FileText} size={18} />
        <span>
          Гипотезы на основе брифа. Требуют проверки интервью и тестированием
          прототипа.
        </span>
        <button
          aria-label="Скачать документ"
          title="Скачать Markdown"
          onClick={() => download(config[3], `${section}.md`)}
        >
          <I icon={DownloadSimple} />
        </button>
      </div>
      {section === "jobs" && (
        <>
          <div className="research-chips">
            {["Все", "Для себя", "Вместе", "Для команды", "Для автора"].map(
              (s) => (
                <button
                  key={s}
                  className={filter === s ? "on" : ""}
                  onClick={() => setFilter(s)}
                >
                  {s}
                </button>
              ),
            )}
          </div>
          <div className="jobs-list">
            {jobs
              .filter((j) => filter === "Все" || j.segment === filter)
              .map((j, i) => (
                <article
                  key={j.id}
                  className={"job " + (openJob === j.id ? "opened" : "")}
                >
                  <button
                    className="job-header"
                    aria-expanded={openJob === j.id}
                    onClick={() => setOpenJob(openJob === j.id ? "" : j.id)}
                  >
                    <span className="job-num">
                      {String(jobs.indexOf(j) + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <small>{j.segment}</small>
                      <h2>{j.title}</h2>
                    </span>
                    <I icon={openJob === j.id ? X : Plus} />
                  </button>
                  {openJob === j.id && (
                    <div className="job-body">
                      <p className="job-statement">
                        <span>{j.when},</span>
                        <br />
                        {j.want},<br />
                        <em>{j.outcome}</em>
                      </p>
                      <div className="job-columns">
                        <div>
                          <span className="eyebrow">БАРЬЕР</span>
                          <p>{j.barrier}</p>
                        </div>
                        <div>
                          <span className="eyebrow">ОТВЕТ ПРОДУКТА</span>
                          <p>{j.solution}</p>
                        </div>
                        <div>
                          <span className="eyebrow">КАК ПРОВЕРИТЬ</span>
                          <p>{j.metric}</p>
                        </div>
                      </div>
                      {j.business && (
                        <div className="research-note">
                          <b>Бизнес-условие:</b> {j.business}
                          <br />
                          <b>Задание для теста:</b> {j.proof}
                        </div>
                      )}
                      <button
                        className="text-link"
                        onClick={() => openScenario(j.route)}
                      >
                        Пройти этот путь в прототипе <I icon={ArrowRight} />
                      </button>
                    </div>
                  )}
                </article>
              ))}
          </div>
        </>
      )}
      {section === "cjm" && (
        <>
          <div className="research-chips">
            {Object.entries(journeys).map(([id, j]) => (
              <button
                key={id}
                className={journey === id ? "on" : ""}
                onClick={() => setJourney(id)}
              >
                {j.title}
              </button>
            ))}
          </div>
          <div className="board-title">
            <h2>{journeys[journey].subtitle}</h2>
            <span>{journeys[journey].stages.length} этапов</span>
          </div>
          <div className="journey-scroll">
            <div
              className="journey-board"
              style={{
                gridTemplateColumns: `110px repeat(${journeys[journey].stages.length}, minmax(162px, 1fr))`,
                minWidth: 110 + journeys[journey].stages.length * 162,
              }}
            >
              <div className="journey-labels">
                <div>ЭТАП</div>
                {[
                  "Действие",
                  "Ощущение",
                  "Что мешает",
                  "Как помогаем",
                  "Метрика",
                  "Точка контакта",
                  "Владелец процесса",
                ].map((t) => (
                  <div key={t}>{t}</div>
                ))}
              </div>
              {journeys[journey].stages.map((st, i) => (
                <div className="journey-column" key={st[0]}>
                  <div className="journey-stage">
                    <span>0{i + 1}</span>
                    <h3>{st[0]}</h3>
                  </div>
                  {st.slice(1).map((text, n) => (
                    <div className={"journey-cell cell-" + n} key={n}>
                      {text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button
            className="text-link"
            onClick={() =>
              openScenario(
                journeys[journey].route ||
                  (journey === "event"
                    ? "event"
                    : journey === "booking"
                      ? "masters"
                      : "match"),
              )
            }
          >
            Проверить путь в прототипе <I icon={ArrowRight} />
          </button>
          <p className="research-note">
            На узком экране карту можно прокручивать горизонтально. Ощущения —
            предположения, а не измеренные результаты.
          </p>
        </>
      )}
      {section === "flows" && (
        <div className="flow-layout">
          <div className="flow-menu">
            {flows.map((f, i) => (
              <button
                key={f.id}
                className={activeFlow === f.id ? "active" : ""}
                onClick={() => setActiveFlow(f.id)}
              >
                <span>0{i + 1}</span>
                {f.title}
                <I icon={CaretRight} size={16} />
              </button>
            ))}
          </div>
          <div className="flow-main">
            {flows
              .filter((f) => f.id === activeFlow)
              .map((f) => (
                <React.Fragment key={f.id}>
                  <span className="eyebrow">
                    СЦЕНАРИЙ {String(flows.indexOf(f) + 1).padStart(2, "0")}
                  </span>
                  <h2>{f.title}</h2>
                  <p className="muted">{f.desc}</p>
                  <ol className="flow-steps">
                    {f.steps.map((s, i) => (
                      <li key={s}>
                        <span>{i + 1}</span>
                        <p>{s}</p>
                        {i === f.steps.length - 1 && (
                          <I icon={CheckCircle} size={19} />
                        )}
                      </li>
                    ))}
                  </ol>
                  <div className="flow-branches">
                    <span className="eyebrow">РАЗВИЛКИ И ВОЗВРАТЫ</span>
                    {f.branches.map((b) => (
                      <p key={b}>{b}</p>
                    ))}
                  </div>
                  {f.owner && (
                    <p className="research-note">
                      Ответственный: {f.owner}
                      <br />
                      Событие аналитики в рабочем продукте: {f.event}
                    </p>
                  )}
                  <button
                    className="black-button"
                    onClick={() => openScenario(f.route)}
                  >
                    Пройти сценарий <I icon={ArrowRight} />
                  </button>
                </React.Fragment>
              ))}
          </div>
        </div>
      )}
      {section === "concept" && (
        <>
          <div className="concept-intro">
            <h2>
              Забота начинается внутри.
              <br />И становится общей.
            </h2>
            <p>
              Единая платформа в Telegram и на сайте: SATTVA для практик,
              медитаций, курсов и преподавателей; YOG для частных, корпоративных
              и PR-событий. Общие профиль, покупки и история.
            </p>
          </div>
          <div className="concept-pair">
            <article>
              <span className="eyebrow">ДЛЯ СЕБЯ</span>
              <h2>SATTVA</h2>
              <p>
                Йога, медитации, дыхание, курсы и индивидуальная работа с
                мастером. Тихое пространство для внутреннего баланса, открытое
                любому опыту.
              </p>
              <button
                className="text-link"
                onClick={() => openScenario("match")}
              >
                Найти свою практику <I icon={ArrowRight} />
              </button>
            </article>
            <article>
              <span className="eyebrow">СОБЫТИЯ ПОД КЛЮЧ</span>
              <h2>YOG</h2>
              <p>
                Дни рождения, девичники, корпоративные и PR-события под ключ.
                Концепция, команда, эстетика и координация — с прозрачным
                составом и сметой.
              </p>
              <button
                className="text-link"
                onClick={() => openScenario("event")}
              >
                Создать встречу <I icon={ArrowRight} />
              </button>
            </article>
          </div>
          <h2>Платформа вокруг человека</h2>
          <div className="principles">
            {[
              [
                "Понятный первый шаг",
                "Подбор по состоянию, времени и опыту. Можно исследовать без обязательной анкеты.",
              ],
              [
                "Живые люди и доверие",
                "Мастер, его подход и формат работы видны до записи и оплаты.",
              ],
              [
                "Всё важное в «Моё»",
                "Покупки, занятия, избранное и заявки доступны из обоих направлений.",
              ],
              [
                "Telegram как вход",
                "Материалы из канала ведут на конкретную практику, курс или событие.",
              ],
            ].map(([t, p]) => (
              <article key={t}>
                <h3>{t}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </>
      )}
      <details className="full-document">
        <summary>
          <I icon={BookOpen} />
          Полный документ и дополнительные сценарии
        </summary>
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: marked.parse(config[3] || "") }}
        />
      </details>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
