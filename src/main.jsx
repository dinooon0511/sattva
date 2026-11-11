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
import { practices, masters, sessions, jobs, journeys, flows } from "./data";
import concept from "../docs/01-product-concept.md?raw";
import flowDoc from "../docs/02-user-flows.md?raw";
import cjmDoc from "../docs/03-cjm.md?raw";
import jobDoc from "../docs/04-jtbd.md?raw";
import "./style.css";
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
  const [section, setSection] = useState(
    () => location.hash.slice(1) || "prototype",
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
    if (r === "event") setBrand("YOG");
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
          <span>ИНТЕРАКТИВНАЯ КОНЦЕПЦИЯ · V.01</span>
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
                  Один шаг.{" "}
                  <br />
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
                      "Открыть мини-курс",
                      "Программа → покупка → урок",
                      "course",
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
function Prototype({ route, setRoute, brand, setBrand }) {
  const [stack, setStack] = useState([]);
  const [item, setItem] = useState(practices[0]);
  const [master, setMaster] = useState(masters[0]);
  const [session, setSession] = useState(sessions[0]);
  const [goal, setGoal] = useState("Спокойнее");
  const [minutes, setMinutes] = useState(15);
  const [category, setCategory] = useState("Все");
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("Все");
  const [day, setDay] = useState("Все");
  const [slot, setSlot] = useState("10:00");
  const [date, setDate] = useState("13 ноября");
  const [bookingType, setBookingType] = useState("session");
  const [payment, setPayment] = useState(null);
  const [success, setSuccess] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState("");
  const [eventKind, setEventKind] = useState("Для близких");
  const [lesson, setLesson] = useState(0);
  const [myTab, setMyTab] = useState("Записи");
  const [experience, setExperience] = useState("Первый опыт");
  const [saved, setSaved] = useSaved("sattva-saved", []);
  const [bookings, setBookings] = useSaved("sattva-bookings", []);
  const [purchased, setPurchased] = useSaved("sattva-course", false);
  const [requests, setRequests] = useSaved("sattva-requests", []);
  const [progress, setProgress] = useSaved("sattva-progress", 0);
  const [authors, setAuthors] = useSaved("sattva-authors", []);
  const [eventDraft, setEventDraft] = useSaved("sattva-event-draft", {});
  const scroll = useRef(null);
  useEffect(() => {
    scroll.current?.scrollTo(0, 0);
    setPlaying(false);
    setStep(0);
  }, [route]);
  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(""), 3200);
      return () => clearTimeout(id);
    }
  }, [toast]);
  const go = (r) => {
    setStack((s) => [...s, route]);
    setRoute(r);
  };
  const back = () => {
    const last = stack.at(-1);
    setStack((s) => s.slice(0, -1));
    setRoute(last || "home");
  };
  const openPractice = (p) => {
    setItem(p);
    go("practice");
  };
  const toggleSave = (id) => {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    setToast(
      saved.includes(id) ? "Удалено из избранного" : "Сохранено в «Моё»",
    );
  };
  const beginBooking = (s) => {
    setSession(s);
    setBookingType("session");
    go("session");
  };
  const preparePayment = (kind) => {
    if (kind === "course")
      setPayment({
        kind,
        title: "Свой ритм",
        price: 2900,
        detail: "Мини-курс · 5 уроков · доступ 6 месяцев",
      });
    else if (bookingType === "master")
      setPayment({
        kind: "booking",
        title: master.service,
        price: master.price,
        detail: `${date} · ${slot} МСК · Онлайн`,
        master: master.name,
      });
    else
      setPayment({
        kind: "booking",
        title: session.title,
        price: session.price,
        detail: `${session.day} · ${session.time} МСК · ${session.format}`,
        master: session.master,
        sessionId: session.id,
        address: session.address,
      });
    go("checkout");
  };
  const completePayment = () => {
    if (payment.kind === "course") {
      setPurchased(true);
      setSuccess({
        kind: "course",
        title: "Курс теперь ваш",
        desc: "Все пять уроков доступны в разделе «Моё». Начните с первой небольшой практики.",
      });
    } else {
      const b = { ...payment, id: Date.now(), status: "Подтверждена" };
      setBookings((bs) => [...bs, b]);
      setSuccess({
        kind: "booking",
        title: "Вы записаны",
        desc: `${payment.title}. ${payment.detail}. Это демонстрационная запись — реальное место не бронируется.`,
      });
    }
    go("success");
  };
  const PageHead = ({ title, subtitle }) => (
    <>
      <button className="back" onClick={back}>
        <I icon={ArrowLeft} size={18} />
        Назад
      </button>
      <h2 className="app-title">{title}</h2>
      {subtitle && <p className="app-subtitle">{subtitle}</p>}
    </>
  );
  const Primary = ({ children, onClick, ...props }) => (
    <button className="primary" onClick={onClick} {...props}>
      {children}
    </button>
  );
  const Row = ({ title, sub, onClick, icon: Icon = ArrowRight }) => (
    <button className="app-row" onClick={onClick}>
      <span>
        <strong>{title}</strong>
        {sub && <small>{sub}</small>}
      </span>
      <I icon={Icon} size={21} />
    </button>
  );
  const Art = ({ className = "" }) => (
    <img className={"contour " + className} src="./contour.png" alt="" />
  );
  const tabs = [
    ["home", "Главная", House],
    ["explore", "Исследовать", Compass],
    ["calendar", "Календарь", CalendarBlank],
    ["mine", "Моё", User],
  ];
  const currentNav = ["home", "event"].includes(route)
    ? "home"
    : ["mine", "ticket"].includes(route)
      ? "mine"
      : ["calendar", "session", "slots"].includes(route)
        ? "calendar"
        : "explore";
  return (
    <div className="app-device" data-testid="device-screen">
      <div className="app-scroll" ref={scroll}>
        <div className="brand-switch" aria-label="Направление">
          {["SATTVA", "YOG"].map((b) => (
            <button
              key={b}
              className={brand === b ? "selected" : ""}
              aria-pressed={brand === b}
              onClick={() => {
                setBrand(b);
                setRoute("home");
                setStack([]);
              }}
            >
              {b}
            </button>
          ))}
        </div>
        <p className="brand-description">
          {brand === "SATTVA"
            ? "Практики и внутренний баланс"
            : "Практики, которые объединяют"}
        </p>
        <div className="app-content" key={route}>
          {route === "home" && (
            <>
              {brand === "SATTVA" ? (
                <>
                  <h1 className="home-title">
                    Вернуться
                    <br />к себе
                  </h1>
                  <p className="home-subtitle">
                    Начните с того, что нужно вам сегодня
                  </p>
                  <h3 className="mood-question">
                    Как вы хотите себя чувствовать?
                  </h3>
                  <div className="mood-list">
                    {["Спокойнее", "Бодрее", "Собраннее"].map((g) => (
                      <button
                        key={g}
                        className={goal === g ? "chosen" : ""}
                        onClick={() => {
                          setGoal(g);
                          go("match");
                        }}
                      >
                        <span>{g}</span>
                        <I icon={CaretRight} size={20} />
                      </button>
                    ))}
                  </div>
                  <Primary onClick={() => go("match")}>
                    Подобрать практику
                  </Primary>
                  <button
                    className="featured-practice"
                    onClick={() => openPractice(practices[0])}
                  >
                    <Art />
                    <div>
                      <span>
                        <strong>Тишина внутри</strong>
                        <small>Медитация · 10 минут · Первый опыт</small>
                      </span>
                      <span className="play-round">
                        <I icon={Play} weight="fill" size={20} />
                      </span>
                    </div>
                  </button>
                  <Row
                    title="Продолжить практику"
                    sub={
                      progress
                        ? "Ваш следующий шаг ждёт вас"
                        : "В своём темпе, без спешки"
                    }
                    onClick={() => {
                      setItem(practices[0]);
                      go("player");
                    }}
                    icon={Play}
                  />
                </>
              ) : (
                <>
                  <h1 className="home-title">
                    Быть ближе.
                    <br />
                    Быть вместе.
                  </h1>
                  <p className="home-subtitle">
                    Йога, забота и баланс —<br />в кругу близких вам людей.
                  </p>
                  <Art />
                  <h3>Как хочется разделить практику?</h3>
                  {["Для близких", "Для команды", "Для бренда"].map((k) => (
                    <Row
                      key={k}
                      title={k}
                      sub={
                        k === "Для близких"
                          ? "Дни рождения, девичники, тёплые встречи"
                          : k === "Для команды"
                            ? "Корпоративные практики и дни заботы"
                            : "PR-события и осмысленные коллаборации"
                      }
                      onClick={() => {
                        setEventKind(k);
                        go("event");
                      }}
                    />
                  ))}
                  <Primary onClick={() => go("event")}>
                    Создать свою встречу
                  </Primary>
                  <Row
                    title="Открытые встречи"
                    sub="Присоединиться к совместной практике"
                    onClick={() => go("calendar")}
                  />
                </>
              )}
            </>
          )}
          {route === "match" && (
            <>
              <PageHead
                title="Что нужно вам сегодня?"
                subtitle="Несколько ориентиров — и мы найдём вашу практику."
              />
              <label className="field-label">Хочу чувствовать себя</label>
              <div className="chips">
                {["Спокойнее", "Бодрее", "Собраннее"].map((g) => (
                  <button
                    className={goal === g ? "on" : ""}
                    aria-pressed={goal === g}
                    onClick={() => setGoal(g)}
                    key={g}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <label className="field-label">У меня есть</label>
              <div className="chips">
                {[5, 10, 15, 30].map((m) => (
                  <button
                    key={m}
                    className={minutes === m ? "on" : ""}
                    onClick={() => setMinutes(m)}
                  >
                    {m} минут
                  </button>
                ))}
              </div>
              <label className="field-label" htmlFor="experience">
                Мой опыт
              </label>
              <select
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option>Первый опыт</option>
                <option>Практикую регулярно</option>
                <option>Хочу углубиться</option>
              </select>
              <p className="soft-note">
                Любая точка — хорошее начало. Здесь не нужно ничего доказывать.
              </p>
              <Primary onClick={() => go("results")}>Найти практику</Primary>
              <button
                className="app-text-link"
                onClick={() => {
                  setCategory("Все");
                  go("explore");
                }}
              >
                Посмотреть все практики
              </button>
            </>
          )}
          {route === "results" && (
            <>
              <PageHead
                title="В вашем ритме"
                subtitle={`${goal} · до ${minutes} минут · ${experience}`}
              />
              {practices.filter(
                (p) =>
                  p.goal === goal &&
                  p.time <= minutes &&
                  (experience !== "Первый опыт" ||
                    p.level !== "Практикую регулярно"),
              ).length ? (
                practices
                  .filter(
                    (p) =>
                      p.goal === goal &&
                      p.time <= minutes &&
                      (experience !== "Первый опыт" ||
                        p.level !== "Практикую регулярно"),
                  )
                  .map((p) => (
                    <Row
                      key={p.id}
                      title={p.title}
                      sub={`${p.type} · ${p.time} минут · ${p.level}`}
                      onClick={() => openPractice(p)}
                    />
                  ))
              ) : (
                <div className="empty">
                  <I icon={SlidersHorizontal} size={32} />
                  <h3>Дадим себе чуть больше времени?</h3>
                  <p>
                    С такими параметрами практик пока нет. Измените длительность
                    или откройте весь каталог.
                  </p>
                  <Primary onClick={() => go("match")}>Изменить подбор</Primary>
                </div>
              )}
              <Art />
              <p className="soft-note">
                Подобрано по вашей цели и доступному времени. Выбирайте по
                ощущениям.
              </p>
              <button className="app-text-link" onClick={() => go("explore")}>
                Открыть весь каталог
              </button>
            </>
          )}
          {route === "explore" && (
            <>
              <h2 className="app-title">Исследовать</h2>
              <p className="app-subtitle">
                Найдите то, что откликается именно вам.
              </p>
              <div className="search">
                <I icon={MagnifyingGlass} size={19} />
                <input
                  aria-label="Поиск по каталогу"
                  placeholder="Практика, тема, настроение"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    aria-label="Очистить поиск"
                    onClick={() => setQuery("")}
                  >
                    <I icon={X} size={16} />
                  </button>
                )}
              </div>
              <div className="chips categories">
                {[
                  "Все",
                  "Медитации",
                  "Йога",
                  "Дыхание",
                  "Подкасты",
                  "Вебинары",
                ].map((c) => (
                  <button
                    key={c}
                    className={category === c ? "on" : ""}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {practices
                .filter(
                  (p) =>
                    (category === "Все" || p.type === category) &&
                    `${p.title} ${p.author} ${p.type}`
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                )
                .map((p) => (
                  <Row
                    key={p.id}
                    title={p.title}
                    sub={`${p.type} · ${p.time} минут`}
                    onClick={() => openPractice(p)}
                  />
                ))}
              {!practices.some(
                (p) =>
                  (category === "Все" || p.type === category) &&
                  `${p.title} ${p.author} ${p.type}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
              ) && (
                <p className="empty">
                  Ничего не найдено. Попробуйте другое слово.
                </p>
              )}
              <div className="section-space" />
              <Row
                title="Мастера"
                sub="Найти своего проводника"
                onClick={() => go("masters")}
              />
              <Row
                title="Мини-курс «Свой ритм»"
                sub="5 небольших шагов к регулярной практике"
                onClick={() => go("course")}
              />
              <Row
                title="Из нашего Telegram"
                sub="Смыслы и материалы в одном месте"
                onClick={() => go("journal")}
              />
            </>
          )}
          {route === "practice" && (
            <>
              <PageHead
                title={item.title}
                subtitle={`${item.type} · ${item.time} минут · ${item.level}`}
              />
              <Art />
              <p>{item.text}</p>
              <Row
                title={item.author}
                sub="Познакомиться с мастером"
                onClick={() => {
                  setMaster(
                    masters.find((m) => m.name === item.author) || masters[0],
                  );
                  go("master");
                }}
              />
              <p className="soft-note">
                Выберите удобное положение. В телесной практике двигайтесь без
                боли; при дискомфорте остановитесь.
              </p>
              <Primary onClick={() => go("player")}>
                Начать {item.type === "Подкасты" ? "слушать" : "практику"}
              </Primary>
              <button className="secondary" onClick={() => toggleSave(item.id)}>
                <I
                  icon={BookmarkSimple}
                  weight={saved.includes(item.id) ? "fill" : "light"}
                />
                {saved.includes(item.id) ? "В избранном" : "Сохранить на потом"}
              </button>
            </>
          )}
          {route === "player" && (
            <>
              <PageHead
                title={item.title}
                subtitle={`${item.type} · ${item.time} минут`}
              />
              <Art />
              <div className="player">
                <span className="eyebrow">
                  {playing ? "ВЫ В ПРАКТИКЕ" : "МОЖНО НАЧИНАТЬ"}
                </span>
                <p className="practice-script">{item.steps[step]}</p>
                <div className="player-controls">
                  <button
                    aria-label="Предыдущий шаг"
                    disabled={step === 0}
                    onClick={() => setStep((s) => s - 1)}
                  >
                    <I icon={ArrowLeft} />
                  </button>
                  <button
                    className="play-round large"
                    aria-label={playing ? "Пауза" : "Начать"}
                    onClick={() => setPlaying(!playing)}
                  >
                    <I icon={playing ? Pause : Play} weight="fill" size={26} />
                  </button>
                  <button
                    aria-label="Следующий шаг"
                    disabled={step === item.steps.length - 1}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    <I icon={ArrowRight} />
                  </button>
                </div>
                <progress max={item.steps.length} value={step + 1} />
                <small>
                  Шаг {step + 1} из {item.steps.length}
                </small>
              </div>
              <p className="soft-note">
                Демо практики: текстовые шаги вместо полной аудио- или
                видеозаписи.
              </p>
              <Primary
                onClick={() => {
                  setProgress((n) => n + 1);
                  setSuccess({
                    kind: "practice",
                    title: "Эта пауза — для вас",
                    desc: "Практика завершена. Можно сохранить её и вернуться, когда почувствуете желание.",
                  });
                  go("success");
                }}
              >
                Завершить практику
              </Primary>
              <button
                className="app-text-link"
                onClick={() => toggleSave(item.id)}
              >
                {saved.includes(item.id)
                  ? "Убрать из избранного"
                  : "Сохранить в избранное"}
              </button>
            </>
          )}
          {route === "masters" && (
            <>
              <PageHead
                title="Найти своего мастера"
                subtitle="Разные подходы. Общее внимание к вам."
              />
              {masters.map((m) => (
                <button
                  key={m.id}
                  className="master-row"
                  onClick={() => {
                    setMaster(m);
                    go("master");
                  }}
                >
                  <span className="initial">{m.letter}</span>
                  <span>
                    <strong>{m.name}</strong>
                    <small>{m.role}</small>
                    <small>
                      {m.exp} · от {money(m.price)}
                    </small>
                  </span>
                  <I icon={CaretRight} />
                </button>
              ))}
              <p className="soft-note">
                Профили и опыт здесь вымышлены для демонстрации выбора. В
                рабочем продукте квалификация проходит проверку.
              </p>
            </>
          )}
          {route === "master" && (
            <>
              <PageHead title={master.name} subtitle={master.role} />
              <p className="master-quote">«{master.text}»</p>
              <p>{master.exp}</p>
              <div className="divider" />
              <h3>Индивидуально с вами</h3>
              <h3 className="serif-small">{master.service}</h3>
              <p>Онлайн · 60 минут · {money(master.price)}</p>
              <p className="soft-note">
                Перед встречей мастер уточнит ваши пожелания. Эта практика не
                заменяет медицинскую помощь.
              </p>
              <Primary
                onClick={() => {
                  setBookingType("master");
                  go("slots");
                }}
              >
                Выбрать время
              </Primary>
            </>
          )}
          {route === "slots" && (
            <>
              <PageHead
                title="Удобное время"
                subtitle={`${master.name} · ${master.service}`}
              />
              <label className="field-label">Дата · ноябрь 2026</label>
              <div className="chips">
                {["13 ноября", "16 ноября", "18 ноября"].map((d) => (
                  <button
                    className={date === d ? "on" : ""}
                    key={d}
                    onClick={() => setDate(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <label className="field-label">Время · Москва (UTC+3)</label>
              <div className="chips">
                {["10:00", "12:30", "17:00"].map((t) => (
                  <button
                    className={slot === t ? "on" : ""}
                    key={t}
                    onClick={() => setSlot(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="summary-line">
                <span>Онлайн · 60 минут</span>
                <b>{money(master.price)}</b>
              </div>
              <p className="soft-note">
                Демонстрационные слоты. Выбранное время появится в «Моё» после
                демоподтверждения.
              </p>
              <Primary onClick={() => preparePayment("booking")}>
                Продолжить
              </Primary>
            </>
          )}
          {route === "calendar" && (
            <>
              <h2 className="app-title">Время для практики</h2>
              <p className="app-subtitle">Встречаемся онлайн и рядом с вами.</p>
              <div className="chips">
                {["Все", "Онлайн", "Офлайн"].map((f) => (
                  <button
                    key={f}
                    className={format === f ? "on" : ""}
                    onClick={() => setFormat(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <p className="micro">НОЯБРЬ 2026 · ВРЕМЯ МОСКВЫ, UTC+3</p>
              <select
                aria-label="Дата занятия"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="Все">Все даты</option>
                {sessions.map((s) => (
                  <option key={s.id}>{s.day}</option>
                ))}
              </select>
              {sessions
                .filter(
                  (s) =>
                    (format === "Все" || s.format === format) &&
                    (day === "Все" || s.day === day),
                )
                .map((s) => (
                  <button
                    className="session-row"
                    key={s.id}
                    onClick={() => beginBooking(s)}
                  >
                    <span className="session-date">
                      {s.day.split(" ")[0]}
                      <small>НОЯ</small>
                    </span>
                    <span>
                      <small>
                        {s.format} · {s.time} МСК
                      </small>
                      <strong>{s.title}</strong>
                      <small>
                        {s.master} · {money(s.price)}
                      </small>
                    </span>
                    <I icon={CaretRight} size={17} />
                  </button>
                ))}
              {!sessions.some(
                (s) =>
                  (format === "Все" || s.format === format) &&
                  (day === "Все" || s.day === day),
              ) && (
                <div className="empty">
                  <p>На эту дату занятий в выбранном формате пока нет.</p>
                  <button
                    className="secondary"
                    onClick={() => {
                      setFormat("Все");
                      setDay("Все");
                    }}
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}
              <p className="soft-note">
                Расписание, адреса и количество мест показаны для примера.
              </p>
            </>
          )}
          {route === "session" && (
            <>
              <PageHead
                title={session.title}
                subtitle={`${session.format} · ${session.level}`}
              />
              <Art />
              <div className="info-list">
                <p>
                  <I icon={CalendarBlank} />
                  {session.day} 2026 · {session.time} МСК
                </p>
                <p>
                  <I icon={Clock} />
                  {session.duration} минут
                </p>
                <p>
                  <I icon={MapPin} />
                  {session.address}
                </p>
                <p>
                  <I icon={User} />
                  {session.master}
                </p>
              </div>
              <p>
                Мягкая практика, внимание к дыханию и время для себя. Возьмите
                удобную одежду, воду и коврик.
              </p>
              <div className="summary-line">
                <span>{session.places} демомест</span>
                <b>{money(session.price)}</b>
              </div>
              <Primary onClick={() => preparePayment("booking")}>
                Записаться
              </Primary>
              <p className="micro">
                Условия демо: отмена без списаний в разделе «Моё».
              </p>
            </>
          )}
          {route === "course" && (
            <>
              <PageHead
                title="Свой ритм"
                subtitle="Мини-курс · 5 уроков · Первый опыт"
              />
              <Art />
              <p className="serif-small">
                Забота о себе начинается
                <br />с небольших шагов.
              </p>
              <p>
                Пять мягких практик, чтобы познакомиться с йогой, дыханием и
                медитацией. Занимайтесь в удобное время.
              </p>
              <h3>Внутри программы</h3>
              {[
                "Знакомство с собой",
                "Дыхание и внимание",
                "Мягкое движение",
                "Пауза в середине дня",
                "Ваш личный ритуал",
              ].map((l, i) => (
                <Row
                  key={l}
                  title={`${String(i + 1).padStart(2, "0")} · ${l}`}
                  sub={
                    i === 0
                      ? "Бесплатное знакомство · 10 минут"
                      : purchased
                        ? "Урок доступен"
                        : "Доступен после покупки"
                  }
                  icon={purchased || i === 0 ? Play : BookOpen}
                  onClick={() => {
                    if (purchased || i === 0) {
                      setLesson(i);
                      go("lesson");
                    } else
                      setToast(
                        "Откройте первый урок бесплатно или купите курс",
                      );
                  }}
                />
              ))}
              <div className="summary-line">
                <span>Доступ на 6 месяцев</span>
                <b>{money(2900)}</b>
              </div>
              <Primary
                onClick={() =>
                  purchased ? go("lessons") : preparePayment("course")
                }
              >
                {purchased ? "Открыть мои уроки" : "Купить курс · демо"}
              </Primary>
              <p className="micro">
                В прототипе деньги не списываются. Автор и программа
                демонстрационные.
              </p>
            </>
          )}
          {route === "lessons" && (
            <>
              <PageHead
                title="Мой курс «Свой ритм»"
                subtitle="У вас есть время. И своё направление."
              />
              {[
                "Знакомство с собой",
                "Дыхание и внимание",
                "Мягкое движение",
                "Пауза в середине дня",
                "Ваш личный ритуал",
              ].map((l, i) => (
                <Row
                  key={l}
                  title={l}
                  sub={`Урок ${i + 1} · ${i === 0 ? 10 : 15} минут`}
                  onClick={() => {
                    setLesson(i);
                    go("lesson");
                  }}
                  icon={Play}
                />
              ))}
            </>
          )}
          {route === "lesson" && (
            <>
              <PageHead
                title={
                  [
                    "Знакомство с собой",
                    "Дыхание и внимание",
                    "Мягкое движение",
                    "Пауза в середине дня",
                    "Ваш личный ритуал",
                  ][lesson]
                }
                subtitle={`Свой ритм · Урок ${lesson + 1} из 5`}
              />
              <Art />
              <h3>Начните с простого</h3>
              <p>
                Устройтесь удобно и обратите внимание на ощущения. Сейчас не
                нужно никуда спешить. Почувствуйте опору, сделайте несколько
                естественных вдохов и выдохов.
              </p>
              <p className="soft-note">
                Демонстрационный текст урока. В рабочем курсе здесь будут видео,
                аудио, субтитры и материалы автора.
              </p>
              <Primary
                onClick={() => {
                  setProgress((n) => n + 1);
                  if (lesson < 4 && purchased) {
                    setLesson((n) => n + 1);
                    setToast("Урок отмечен. Можно продолжать.");
                  } else {
                    setSuccess({
                      kind: "course",
                      title: "Вы сделали шаг",
                      desc: purchased
                        ? "Возвращайтесь к следующей практике в своём темпе."
                        : "Первый урок завершён. Полная программа доступна на странице курса.",
                    });
                    go("success");
                  }
                }}
              >
                {lesson < 4 && purchased
                  ? "Завершить и перейти дальше"
                  : "Завершить урок"}
              </Primary>
            </>
          )}
          {route === "checkout" && payment && (
            <>
              <PageHead
                title="Всё готово к вашему шагу"
                subtitle="Проверьте детали перед подтверждением."
              />
              <div className="order-summary">
                <span className="eyebrow">
                  {payment.kind === "course" ? "МИНИ-КУРС" : "ВАША ПРАКТИКА"}
                </span>
                <h3>{payment.title}</h3>
                <p>{payment.detail}</p>
                {payment.master && <p>{payment.master}</p>}
                <div className="summary-line">
                  <span>Стоимость в рабочем продукте</span>
                  <b>{money(payment.price)}</b>
                </div>
              </div>
              <div className="demo-notice">
                <I icon={CheckCircle} />
                <span>
                  Демонстрационная покупка.
                  <br />
                  Без ввода карты и списания денег.
                </span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  completePayment();
                }}
              >
                <label className="check-label">
                  <input type="checkbox" required />{" "}
                  <span>
                    Мне понятны условия: это демо, реальная покупка или бронь не
                    создаётся.
                  </span>
                </label>
                <Primary type="submit">Подтвердить в демо</Primary>
              </form>
              <button className="app-text-link" onClick={back}>
                Вернуться к выбору
              </button>
            </>
          )}
          {route === "success" && success && (
            <div className="success-screen">
              <I icon={CheckCircle} size={58} />
              <h2 className="app-title">{success.title}</h2>
              <p>{success.desc}</p>
              {success.kind === "course" && (
                <Primary onClick={() => go(purchased ? "lessons" : "course")}>
                  {purchased ? "Открыть уроки" : "Посмотреть программу"}
                </Primary>
              )}
              {success.kind === "practice" && (
                <button
                  className="secondary"
                  onClick={() => toggleSave(item.id)}
                >
                  {saved.includes(item.id)
                    ? "Практика в избранном"
                    : "Сохранить практику"}
                </button>
              )}
              <Primary
                onClick={() => {
                  setMyTab(
                    success.kind === "course"
                      ? "Курсы"
                      : success.kind === "practice"
                        ? "Избранное"
                        : success.kind === "request"
                          ? "Заявки"
                          : "Записи",
                  );
                  go("mine");
                }}
              >
                Перейти в «Моё»
              </Primary>
              <button className="app-text-link" onClick={() => go("home")}>
                Вернуться на главную
              </button>
            </div>
          )}
          {route === "mine" && (
            <>
              <h2 className="app-title">Моё пространство</h2>
              <p className="app-subtitle">Всё, к чему хочется возвращаться.</p>
              <div className="chips">
                {["Записи", "Курсы", "Избранное", "Заявки"].map((t) => (
                  <button
                    key={t}
                    className={myTab === t ? "on" : ""}
                    onClick={() => setMyTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {myTab === "Записи" &&
                (bookings.length ? (
                  bookings.map((b) => (
                    <Row
                      key={b.id}
                      title={b.title}
                      sub={`${b.detail} · ${b.status}`}
                      onClick={() => {
                        setSession(b);
                        go("ticket");
                      }}
                    />
                  ))
                ) : (
                  <Empty
                    title="Здесь появятся ваши встречи"
                    text="Выберите занятие или познакомьтесь с мастером."
                    action="Посмотреть расписание"
                    onClick={() => go("calendar")}
                  />
                ))}
              {myTab === "Курсы" &&
                (purchased ? (
                  <Row
                    title="Свой ритм"
                    sub="5 уроков · Доступ открыт"
                    icon={Play}
                    onClick={() => go("lessons")}
                  />
                ) : (
                  <Empty
                    title="Ваш путь начинается с шага"
                    text="Попробуйте первый урок бесплатно."
                    action="Познакомиться с курсом"
                    onClick={() => go("course")}
                  />
                ))}
              {myTab === "Избранное" &&
                (saved.length ? (
                  practices
                    .filter((p) => saved.includes(p.id))
                    .map((p) => (
                      <Row
                        key={p.id}
                        title={p.title}
                        sub={`${p.type} · ${p.time} минут`}
                        onClick={() => openPractice(p)}
                      />
                    ))
                ) : (
                  <Empty
                    title="Сохраните то, что откликается"
                    text="Нажмите «Сохранить» на странице практики."
                    action="Исследовать практики"
                    onClick={() => go("explore")}
                  />
                ))}
              {myTab === "Заявки" && (
                <>
                  {requests.map((r) => (
                    <div className="request-item" key={r.id}>
                      <span className="eyebrow">
                        ДЕМОЗАЯВКА #{String(r.id).slice(-4)}
                      </span>
                      <h3>{r.kind}</h3>
                      <p>
                        {r.city || "Город уточняется"} ·{" "}
                        {r.people || "Количество уточняется"}
                      </p>
                      <small>
                        Сохранена в этом браузере. Команде не отправлена.
                      </small>
                    </div>
                  ))}
                  {authors.map((a) => (
                    <div className="request-item" key={a.id}>
                      <h3>{a.title}</h3>
                      <p>Курс автора · черновик сохранён</p>
                      <small>
                        Демонстрация модерации. Файлы не загружаются на сервер.
                      </small>
                    </div>
                  ))}
                  {!requests.length && !authors.length && (
                    <Empty
                      title="Пока без заявок"
                      text="Можно создать встречу YOG или предложить авторский курс."
                      action="Создать встречу"
                      onClick={() => go("event")}
                    />
                  )}
                </>
              )}
              <div className="section-space" />
              <Row
                title="Предложить свой мини-курс"
                sub="Для мастеров и авторов"
                onClick={() => go("author")}
              />
              <Row
                title="Помощь и условия"
                sub="О демозаписях, оплате и доступе"
                onClick={() => go("help")}
              />
              <p className="micro">
                Демо хранится только в вашем браузере. Аккаунт Telegram не
                подключён.
              </p>
            </>
          )}
          {route === "ticket" && (
            <>
              <PageHead title={session.title} subtitle={session.detail} />
              <div className="ticket-status">
                <I icon={CheckCircle} />
                {bookings.find((b) => b.id === session.id)?.status}
              </div>
              <p>Номер демозаписи: {String(session.id).slice(-6)}</p>
              <p>
                {session.address ||
                  "Онлайн: в рабочем продукте здесь появится ссылка на встречу."}
              </p>
              <p className="soft-note">
                Демо не даёт доступа к реальному занятию. Настоящий адрес или
                ссылка предоставляются после подтверждённой рабочей записи.
              </p>
              {bookings.find((b) => b.id === session.id)?.status !==
                "Отменена" && (
                <button
                  className="secondary"
                  onClick={() => {
                    setBookings((bs) =>
                      bs.map((b) =>
                        b.id === session.id ? { ...b, status: "Отменена" } : b,
                      ),
                    );
                    setToast("Демозапись отменена. Деньги не списывались.");
                  }}
                >
                  Отменить демозапись
                </button>
              )}
              <button className="app-text-link" onClick={() => go("help")}>
                Нужна помощь
              </button>
            </>
          )}
          {route === "event" && (
            <>
              <PageHead
                title="Практика объединяет"
                subtitle="Создадим встречу, в которой есть место заботе, красоте и вам."
              />
              <div className="chips">
                {["Для близких", "Для команды", "Для бренда"].map((k) => (
                  <button
                    key={k}
                    className={eventKind === k ? "on" : ""}
                    onClick={() => setEventKind(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <p>
                {eventKind === "Для близких"
                  ? "День рождения, девичник или просто повод собраться: йога, медитация, тёплый круг и бережная атмосфера."
                  : eventKind === "Для команды"
                    ? "Совместная практика, день баланса или корпоративная встреча. Подстроим темп и программу под вашу команду."
                    : "PR-встреча или коллаборация, где эстетика встречается с осознанной заботой. От идеи до реализации."}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = Object.fromEntries(new FormData(e.currentTarget));
                  setRequests((rs) => [
                    ...rs,
                    { ...fd, kind: eventKind, id: Date.now() },
                  ]);
                  setEventDraft({});
                  setSuccess({
                    kind: "request",
                    title: "Идея встречи сохранена",
                    desc: "Это демозаявка. Она появилась в «Моё» в этом браузере; команде ничего не отправлено. В рабочем продукте здесь будет следующий шаг согласования.",
                  });
                  go("success");
                }}
                onChange={(e) => {
                  if (e.target.name)
                    setEventDraft((d) => ({
                      ...d,
                      [e.target.name]: e.target.value,
                    }));
                }}
              >
                <label>
                  Город
                  <input
                    name="city"
                    required
                    placeholder="Например, Москва"
                    defaultValue={eventDraft.city || ""}
                  />
                </label>
                <div className="form-grid">
                  <label>
                    Дата или период
                    <input
                      name="date"
                      placeholder="Пока не знаю"
                      defaultValue={eventDraft.date || ""}
                    />
                  </label>
                  <label>
                    Участников
                    <input
                      name="people"
                      type="number"
                      min="2"
                      max="500"
                      placeholder="Например, 12"
                      defaultValue={eventDraft.people || ""}
                    />
                  </label>
                </div>
                <label>
                  Бюджет
                  <select
                    name="budget"
                    defaultValue={eventDraft.budget || "Нужен ориентир"}
                  >
                    <option>Нужен ориентир</option>
                    <option>До 50 000 ₽</option>
                    <option>50 000–150 000 ₽</option>
                    <option>От 150 000 ₽</option>
                  </select>
                </label>
                <label>
                  Что важно для вашей встречи?
                  <textarea
                    name="wish"
                    placeholder="Атмосфера, повод, любимые практики…"
                    defaultValue={eventDraft.wish || ""}
                  />
                </label>
                <p className="micro">
                  Не вводите личные контакты: форма демонстрационная.
                </p>
                <Primary type="submit">Сохранить демозаявку</Primary>
              </form>
            </>
          )}
          {route === "journal" && (
            <>
              <PageHead
                title="Из нашего Telegram"
                subtitle="Полезное не должно теряться в ленте."
              />
              <Row
                title="О сути. О Саттве. О нас."
                sub="Философия · 4 минуты чтения"
                onClick={() => go("article")}
              />
              <Row
                title="Десять минут тишины"
                sub="Практика · Медитация"
                onClick={() => openPractice(practices[0])}
              />
              <Row
                title="Забота без чувства вины"
                sub="Подкаст · 22 минуты"
                onClick={() => openPractice(practices[4])}
              />
              <p className="soft-note">
                Демонстрационная редакционная лента. Реальная синхронизация
                каналов пока не подключена.
              </p>
            </>
          )}
          {route === "article" && (
            <>
              <PageHead
                title="О сути. О Саттве. О нас."
                subtitle="Философия проекта · из вашего брифа"
              />
              <p className="serif-small">
                Два крыла одной системы.
                <br />
                Два пути к балансу.
              </p>
              <p>
                Саттва — ясность, гармония, внимание к своей истинной природе.
                Не отказ от мира, а возвращение к ясности внутри него.
              </p>
              <p>
                SATTVA — про встречу с собой: практики, тело, тишину и
                сообщество. YOG — про заботу, которую мы разделяем: совместные
                практики, встречи и события со смыслом.
              </p>
              <p>Они дышат вместе. От внутреннего к внешнему. И обратно.</p>
              <Primary onClick={() => openPractice(practices[0])}>
                Начать с небольшой паузы
              </Primary>
            </>
          )}
          {route === "author" && (
            <>
              <PageHead
                title="Поделиться своей практикой"
                subtitle="Предложите авторский мини-курс. Начнём с идеи и программы."
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const a = Object.fromEntries(new FormData(e.currentTarget));
                  setAuthors((as) => [...as, { ...a, id: Date.now() }]);
                  setSuccess({
                    kind: "request",
                    title: "Черновик курса сохранён",
                    desc: "Он доступен в «Моё» → «Заявки». Это демонстрация: публикация, загрузка медиа и выплаты требуют рабочего кабинета автора.",
                  });
                  go("success");
                }}
              >
                <label>
                  Название курса
                  <input
                    name="title"
                    placeholder="Например, бережное утро"
                    required
                  />
                </label>
                <label>
                  Для кого эта практика?
                  <input
                    name="audience"
                    placeholder="Новички, регулярная практика…"
                    required
                  />
                </label>
                <label>
                  Программа
                  <textarea
                    name="program"
                    placeholder="Темы и названия будущих уроков"
                    required
                    minLength="10"
                  />
                </label>
                <label>
                  Ориентир стоимости, ₽
                  <input name="price" type="number" min="0" required />
                </label>
                <p className="soft-note">
                  В рабочем продукте: материалы → проверка прав и программы →
                  модерация → публикация. До публикации автор видит условия
                  продаж и выплат.
                </p>
                <Primary type="submit">Сохранить черновик курса</Primary>
              </form>
            </>
          )}
          {route === "help" && (
            <>
              <PageHead
                title="Рядом, когда нужно"
                subtitle="Ответы о прототипе"
              />
              {[
                [
                  "Это настоящее приложение?",
                  "Это интерактивный прототип с демонстрационными материалами, мастерами, датами и ценами. Он показывает возможный путь, но не оказывает услуги.",
                ],
                [
                  "Можно ли здесь оплатить?",
                  "Нет. Демопокупка не запрашивает карту и не списывает деньги. В реальном Mini App цифровой контент оплачивается по правилам Telegram; способ оплаты услуг выбирается отдельно.",
                ],
                [
                  "Где мои записи и покупки?",
                  "В «Моё». В этом прототипе они хранятся в браузере. Очистка данных браузера удалит демонстрационные результаты.",
                ],
                [
                  "Как отменить занятие?",
                  "Откройте «Моё» → «Записи» → нужное занятие → «Отменить демозапись». В рабочем продукте здесь будут реальные правила переноса и возврата.",
                ],
              ].map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </>
          )}
        </div>
      </div>
      <nav className="app-bottom" aria-label="Навигация приложения">
        {tabs.map(([r, label, icon]) => (
          <button
            key={r}
            className={currentNav === r ? "active" : ""}
            onClick={() => {
              setRoute(r);
              setStack([]);
            }}
          >
            <I
              icon={icon}
              size={24}
              weight={currentNav === r ? "fill" : "light"}
            />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
function Empty({ title, text, action, onClick }) {
  return (
    <div className="empty">
      <I icon={Leaf} size={34} />
      <h3>{title}</h3>
      <p>{text}</p>
      <button className="secondary" onClick={onClick}>
        {action}
      </button>
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
        "Практики для себя и забота, которой хочется делиться.",
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
            <span>5 этапов</span>
          </div>
          <div className="journey-scroll">
            <div className="journey-board">
              <div className="journey-labels">
                <div>ЭТАП</div>
                {[
                  "Действие",
                  "Ощущение",
                  "Что мешает",
                  "Как помогаем",
                  "Метрика",
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
                journey === "event"
                  ? "event"
                  : journey === "booking"
                    ? "masters"
                    : "match",
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
              Единая платформа в Telegram и на сайте. Один профиль, общие
              покупки и записи — два способа быть в практике.
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
              <span className="eyebrow">ВМЕСТЕ С ДРУГИМИ</span>
              <h2>YOG</h2>
              <p>
                Совместные практики, осмысленные праздники и встречи. Для
                близких, команд и брендов — с заботой о теле, внимании и
                атмосфере.
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
