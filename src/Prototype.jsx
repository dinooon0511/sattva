import React, { useState, useEffect, useRef } from "react";
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
  CheckCircle,
  X,
  BookOpen,
  Clock,
  MapPin,
  Leaf,
  MagnifyingGlass,
  Gift,
  Users,
  Star,
  Headphones,
  VideoCamera,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import {
  practices,
  courses,
  masters,
  sessions,
  eventFormats,
  plans,
  rituals,
} from "./product";
const Icon = ({ as: C, ...props }) => (
  <C size={21} weight="light" aria-hidden="true" {...props} />
);
const money = (n) => `${n.toLocaleString("ru-RU")} ₽`;
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
function useStored(key, initial) {
  const [v, set] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, set];
}
const Button = ({ children, onClick, secondary = false, ...p }) => (
  <button
    className={secondary ? "secondary" : "primary"}
    onClick={onClick}
    {...p}
  >
    {children}
  </button>
);
const Row = ({ title, sub, onClick, icon: C = ArrowRight, tag }) => (
  <button className="app-row" onClick={onClick}>
    <span>
      {tag && <small className="row-tag">{tag}</small>}
      <strong>{title}</strong>
      {sub && <small>{sub}</small>}
    </span>
    <Icon as={C} />
  </button>
);
const Chips = ({ items, value, onChange, label }) => (
  <div className="chips" role="group" aria-label={label}>
    {items.map((x) => (
      <button
        key={x}
        aria-pressed={value === x}
        className={value === x ? "on" : ""}
        onClick={() => onChange(x)}
      >
        {x}
      </button>
    ))}
  </div>
);
const Art = () => <img className="contour" src="./contour.png" alt="" />;
const Empty = ({ title, text, action, onClick }) => (
  <div className="empty">
    <Icon as={Leaf} size={32} />
    <h3>{title}</h3>
    <p>{text}</p>
    {action && (
      <Button secondary onClick={onClick}>
        {action}
      </Button>
    )}
  </div>
);
const Notice = ({ children }) => <p className="soft-note">{children}</p>;
const Label = ({ children, ...p }) => {
  const content = React.Children.toArray(children);
  const name = content
    .filter((x) => typeof x === "string")
    .join(" ")
    .trim();
  return (
    <label {...p}>
      {content.map((child, i) =>
        React.isValidElement(child) &&
        ["input", "select", "textarea"].includes(child.type) &&
        child.props.type !== "checkbox"
          ? React.cloneElement(child, {
              "aria-label": child.props["aria-label"] || name,
              key: child.key || i,
            })
          : child,
      )}
    </label>
  );
};
const mediaKind = (p) =>
  p.media === "Видео"
    ? "Видеоурок"
    : p.type === "Подкасты"
      ? "Подкаст"
      : "Аудиопрактика";
export default function Prototype({ route, setRoute, brand, setBrand }) {
  const [stack, setStack] = useState([]),
    [item, setItem] = useState(practices[0]),
    [teacher, setTeacher] = useState(masters[0]),
    [course, setCourse] = useState(courses[0]),
    [session, setSession] = useState(sessions[0]),
    [event, setEvent] = useState(eventFormats[0]);
  const [goal, setGoal] = useState("Спокойнее"),
    [minutes, setMinutes] = useState(15),
    [experience, setExperience] = useState("Первый опыт"),
    [category, setCategory] = useState("Все"),
    [query, setQuery] = useState(""),
    [media, setMedia] = useState("Все"),
    [courseFormat, setCourseFormat] = useState("Все"),
    [courseTopic, setCourseTopic] = useState("Все"),
    [teacherTopic, setTeacherTopic] = useState("Все"),
    [teacherFormat, setTeacherFormat] = useState("Все"),
    [city, setCity] = useState("Все города"),
    [format, setFormat] = useState("Все"),
    [day, setDay] = useState("Все"),
    [date, setDate] = useState("13 ноября"),
    [slot, setSlot] = useState("10:00"),
    [service, setService] = useState("Личное занятие"),
    [serviceFormat, setServiceFormat] = useState("Онлайн");
  const [order, setOrder] = useState(null),
    [result, setResult] = useState(null),
    [step, setStep] = useState(0),
    [playing, setPlaying] = useState(false),
    [lesson, setLesson] = useState(0),
    [tab, setTab] = useState("Записи"),
    [toast, setToast] = useState(""),
    [eventSegment, setEventSegment] = useState("Все"),
    [eventKind, setEventKind] = useState("Для близких"),
    [selectedRecord, setSelectedRecord] = useState(null),
    [giftAmount, setGiftAmount] = useState(3000),
    [request, setRequest] = useState(null),
    [cancelConfirm, setCancelConfirm] = useState(false),
    [portal, setPortal] = useState("Обзор");
  const [saved, setSaved] = useStored("sattva-saved", []),
    [bookings, setBookings] = useStored("sattva-bookings", []),
    [owned, setOwned] = useStored(
      "sattva-v2-courses",
      (() => {
        try {
          return localStorage.getItem("sattva-course") === "true"
            ? ["rhythm"]
            : [];
        } catch {
          return [];
        }
      })(),
    ),
    [requests, setRequests] = useStored("sattva-requests", []),
    [progress, setProgress] = useStored("sattva-v2-progress", {}),
    [authors, setAuthors] = useStored("sattva-authors", []),
    [draft, setDraft] = useStored("sattva-event-draft", {}),
    [subscription, setSubscription] = useStored("sattva-membership", null),
    [gifts, setGifts] = useStored("sattva-gifts", []),
    [waitlist, setWaitlist] = useStored("sattva-waitlist", []),
    [personalSlots, setPersonalSlots] = useStored("sattva-teacher-slots", []);
  const scroll = useRef(null);
  const confirmLock = useRef(false);
  useEffect(() => {
    scroll.current?.scrollTo(0, 0);
    setPlaying(false);
    setStep(0);
    setCancelConfirm(false);
    confirmLock.current = false;
  }, [route]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 3400);
      return () => clearTimeout(t);
    }
  }, [toast]);
  useEffect(() => {
    if (!playing || route !== "player") return;
    const timer = setInterval(
      () => setStep((s) => (s < item.steps.length - 1 ? s + 1 : s)),
      7000,
    );
    return () => clearInterval(timer);
  }, [playing, route, item]);
  const go = (r) => {
    if (["event", "formats", "event-detail", "cases", "brief"].includes(r))
      setBrand("YOG");
    else if (
      ![
        "mine",
        "help",
        "success",
        "checkout",
        "record",
        "request",
        "preferences",
      ].includes(r)
    )
      setBrand("SATTVA");
    setStack((s) => [...s, route]);
    setRoute(r);
  };
  const back = () => {
    setRoute(stack.at(-1) || "home");
    setStack((s) => s.slice(0, -1));
  };
  const openPractice = (p) => {
    setItem(p);
    go("practice");
  };
  const openCourse = (c) => {
    setCourse(c);
    go("course");
  };
  const openTeacher = (t) => {
    setTeacher(t);
    setServiceFormat(t.formats[0]);
    go("master");
  };
  const save = (id) => {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    setToast(
      saved.includes(id) ? "Удалено из избранного" : "Сохранено в «Моё»",
    );
  };
  const Head = ({ title, sub }) => (
    <>
      <button className="back" onClick={back}>
        <Icon as={ArrowLeft} size={18} />
        Назад
      </button>
      <h2 className="app-title" tabIndex={-1}>
        {title}
      </h2>
      {sub && <p className="app-subtitle">{sub}</p>}
    </>
  );
  const PracticeRow = ({ p }) => (
    <Row
      title={p.title}
      tag={`${mediaKind(p)} · ${p.access}`}
      sub={`${p.time} мин · ${p.level} · ${p.author}`}
      onClick={() => openPractice(p)}
      icon={p.media === "Видео" ? VideoCamera : Headphones}
    />
  );
  const CourseRow = ({ c }) => (
    <Row
      title={c.title}
      tag={`${c.format}${c.city ? " · " + c.city : ""}`}
      sub={`${c.author} · ${c.duration} · ${money(c.price)}`}
      onClick={() => openCourse(c)}
      icon={BookOpen}
    />
  );
  const SessionRow = ({ s }) => (
    <button
      className="session-row"
      onClick={() => {
        setSession(s);
        go("session");
      }}
    >
      <span className="session-date">
        {s.day.split(" ")[0]}
        <small>НОЯ</small>
      </span>
      <span>
        <small>
          {s.format} · {s.city} · {s.time} МСК
        </small>
        <strong>{s.title}</strong>
        <small>
          {s.master} · {money(s.price)}
          {s.places ? "" : " · Лист ожидания"}
        </small>
      </span>
      <Icon as={CaretRight} size={17} />
    </button>
  );
  const purchase = (kind, product) => {
    let o;
    if (kind === "course")
      o = {
        kind,
        productId: product.id,
        title: product.title,
        price: product.price,
        detail: `${product.format} · ${product.dates || product.access + " доступа"}`,
        address: product.address,
      };
    if (kind === "session")
      o = {
        kind,
        productId: product.id,
        title: product.title,
        price: product.price,
        detail: `${product.day} 2026 · ${product.time} МСК · ${product.format}`,
        master: product.master,
        address: product.address,
      };
    if (kind === "teacher")
      o = {
        kind,
        productId: teacher.id,
        title:
          service === "Пакет из 4 занятий"
            ? `4 занятия · ${teacher.name}`
            : teacher.service,
        price:
          service === "Знакомство · 30 минут"
            ? Math.round(teacher.price * 0.5)
            : service === "Пакет из 4 занятий"
              ? teacher.price * 4
              : teacher.price,
        detail: `${date} 2026 · ${slot} МСК · ${serviceFormat}${serviceFormat === "Офлайн" ? " · " + teacher.city : ""}`,
        master: teacher.name,
        credits: service === "Пакет из 4 занятий" ? 4 : 1,
      };
    if (kind === "subscription")
      o = {
        kind,
        productId: product.id,
        title: product.title,
        price: product.price,
        detail: product.period,
      };
    if (kind === "gift")
      o = {
        kind,
        title: "Подарок заботы",
        price: giftAmount,
        detail: "Демосертификат · пример срока 6 месяцев",
      };
    setOrder(o);
    go("checkout");
  };
  const finish = () => {
    if (confirmLock.current) return;
    confirmLock.current = true;
    let id = uid();
    if (order.kind === "course") {
      setOwned((o) =>
        o.includes(order.productId) ? o : [...o, order.productId],
      );
      setResult({
        title: "Программа теперь ваша",
        text: "Демонстрационный доступ открыт. Онлайн-уроки или подготовка к офлайн-программе доступны в «Моё».",
        next: "course",
        label: "Открыть программу",
      });
    } else if (order.kind === "subscription") {
      setSubscription({ ...order, id, started: new Date().toISOString() });
      setResult({
        title: "Ваш клубный доступ открыт",
        text: "Демоподписка без списаний и автопродления. Авторские курсы и личные занятия в неё не входят.",
        next: "membership",
        label: "Посмотреть мой доступ",
      });
    } else if (order.kind === "gift") {
      setGifts((gs) => [...gs, { ...order, id }]);
      setResult({
        title: "Подарок сохранён",
        text: "Демонстрационный сертификат появился в «Моё». Он не имеет денежной стоимости и не отправляется получателю.",
        next: "mine",
        label: "Открыть подарки",
      });
      setTab("Подарки");
    } else {
      setBookings((bs) => [...bs, { ...order, id, status: "Подтверждена" }]);
      setResult({
        title: "Вы записаны",
        text: `${order.title}. ${order.detail}. Это демозапись, реальное место не бронируется.`,
        next: "mine",
        label: "Посмотреть запись",
      });
      setTab("Записи");
    }
    go("success");
  };
  const showMy = (t) => {
    setTab(t);
    go("mine");
  };
  const startEvent = (e) => {
    setEvent(e);
    setEventKind(e.segment);
    go("brief");
  };
  const selectedRequests =
    requests.find((r) => r.id === request?.id) || request;
  const filteredPractices = practices.filter(
    (p) =>
      (category === "Все" || p.type === category) &&
      (media === "Все" || p.media === media) &&
      `${p.title} ${p.author} ${p.goal}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const matches = practices.filter(
    (p) =>
      p.goal === goal &&
      p.time <= minutes &&
      ["Йога", "Медитации", "Дыхание"].includes(p.type) &&
      (experience !== "Первый опыт" || p.level !== "Практикую регулярно"),
  );
  const filteredCourses = courses.filter(
    (c) =>
      (courseFormat === "Все" || c.format === courseFormat) &&
      (courseTopic === "Все" || c.tag === courseTopic) &&
      `${c.title} ${c.author} ${c.city || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const filteredTeachers = masters.filter(
    (t) =>
      (teacherTopic === "Все" || t.directions.includes(teacherTopic)) &&
      (teacherFormat === "Все" || t.formats.includes(teacherFormat)) &&
      (city === "Все города" || t.city === city) &&
      `${t.name} ${t.role}`.toLowerCase().includes(query.toLowerCase()),
  );
  const activeCourse = owned.includes(course.id);
  const lessonsDone = progress[course.id] || [];
  const appTabs =
    brand === "SATTVA"
      ? [
          ["home", "Главная", House],
          ["explore", "Практики", Compass],
          ["courses", "Курсы", BookOpen],
          ["calendar", "Занятия", CalendarBlank],
          ["mine", "Моё", User],
        ]
      : [
          ["home", "Главная", House],
          ["formats", "Форматы", Users],
          ["cases", "Истории", BookOpen],
          ["mine", "Моё", User],
        ];
  const nav =
    route === "home"
      ? "home"
      : ["courses", "course", "lessons", "lesson"].includes(route)
        ? "courses"
        : ["calendar", "session", "slots", "masters", "master"].includes(route)
          ? "calendar"
          : ["formats", "event-detail", "event", "brief"].includes(route)
            ? "formats"
            : route === "cases"
              ? "cases"
              : [
                    "mine",
                    "record",
                    "ticket",
                    "request",
                    "author",
                    "portal",
                    "preferences",
                    "help",
                    "membership",
                    "gift",
                    "plan",
                  ].includes(route)
                ? "mine"
                : "explore";
  let dock = null;
  if (route === "course")
    dock = (
      <>
        <span>
          <b>{activeCourse ? "Доступ открыт" : money(course.price)}</b>
          <small>
            {course.format} · {course.duration}
          </small>
        </span>
        <Button
          onClick={() =>
            activeCourse ? go("lessons") : purchase("course", course)
          }
        >
          {activeCourse ? "Открыть" : "Приобрести · демо"}
        </Button>
      </>
    );
  if (route === "master")
    dock = (
      <>
        <span>
          <b>От {money(Math.round(teacher.price * 0.5))}</b>
          <small>Знакомство · 30 минут</small>
        </span>
        <Button onClick={() => go("slots")}>Выбрать время</Button>
      </>
    );
  if (route === "session")
    dock = (
      <>
        <span>
          <b>{money(session.price)}</b>
          <small>
            {session.places ? `${session.places} демомест` : "Мест пока нет"}
          </small>
        </span>
        <Button
          onClick={() => {
            if (session.places) purchase("session", session);
            else {
              setWaitlist((w) =>
                w.some((x) => x.id === session.id) ? w : [...w, session],
              );
              setToast(
                "Лист ожидания сохранён локально; уведомления не отправляются",
              );
            }
          }}
        >
          {session.places
            ? "Записаться"
            : waitlist.some((x) => x.id === session.id)
              ? "Вы в листе ожидания"
              : "В лист ожидания"}
        </Button>
      </>
    );
  return (
    <div className="app-device" data-testid="device-screen">
      <div className="app-scroll" ref={scroll}>
        <div className="brand-switch" aria-label="Направление">
          {["SATTVA", "YOG"].map((b) => (
            <button
              key={b}
              aria-pressed={brand === b}
              className={brand === b ? "selected" : ""}
              onClick={() => {
                setBrand(b);
                setRoute("home");
                setStack([]);
                setQuery("");
              }}
            >
              {b}
            </button>
          ))}
        </div>
        <p className="brand-description">
          {brand === "SATTVA"
            ? "Практики и внутренний баланс"
            : "События с заботой и смыслом"}
        </p>
        <div className="app-content v2-content" key={route}>
          {route === "home" && brand === "SATTVA" && (
            <>
              <h1 className="home-title">
                Вернуться
                <br />к себе
              </h1>
              <p className="home-subtitle">
                Практики, люди и знания,
                <br />
                чтобы находить свой баланс.
              </p>
              <h3 className="mood-question">Как вы хотите себя чувствовать?</h3>
              <div className="mood-list">
                {["Спокойнее", "Бодрее", "Собраннее"].map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGoal(g);
                      go("match");
                    }}
                  >
                    {g}
                    <Icon as={CaretRight} size={20} />
                  </button>
                ))}
              </div>
              <Button onClick={() => go("match")}>Подобрать практику</Button>
              <button
                className="featured-practice"
                onClick={() => openPractice(practices[0])}
              >
                <Art />
                <div>
                  <span>
                    <strong>Тишина внутри</strong>
                    <small>Бесплатная медитация · 10 минут</small>
                  </span>
                  <span className="play-round">
                    <Icon as={Play} weight="fill" size={19} />
                  </span>
                </div>
              </button>
              <div className="section-heading">
                <h3>Ваше пространство</h3>
                <span>{practices.length} материалов</span>
              </div>
              <Row
                title="Практики и медитации"
                sub="Аудио, видеоуроки, дыхание и йога"
                onClick={() => go("explore")}
              />
              <Row
                title="Курсы и программы"
                sub={`${courses.length} программ · онлайн и офлайн`}
                onClick={() => {
                  setQuery("");
                  go("courses");
                }}
              />
              <Row
                title="Найти преподавателя"
                sub="Подход, услуги и запись в одном месте"
                onClick={() => {
                  setQuery("");
                  go("masters");
                }}
              />
              <div className="editorial-block">
                <span className="eyebrow">САНКТ-ПЕТЕРБУРГ · 26–29 НОЯБРЯ</span>
                <h3>Четыре дня баланса</h3>
                <p>
                  Офлайн-курс с Марией. Камерная группа и практика, которую
                  можно забрать в свою жизнь.
                </p>
                <button
                  className="app-text-link"
                  onClick={() => openCourse(courses[1])}
                >
                  Посмотреть программу
                </button>
                <small>Демонстрационная программа</small>
              </div>
              <Row
                title="Моя неделя заботы"
                sub="7 небольших шагов без строгой серии"
                onClick={() => go("plan")}
              />
              <Row
                title="Клуб SATTVA"
                sub="Регулярность и поддерживающие подборки"
                onClick={() => go("membership")}
              />
            </>
          )}
          {route === "home" && brand === "YOG" && (
            <>
              <h1 className="home-title">
                Внешнее —<br />
                со смыслом.
              </h1>
              <p className="home-subtitle">
                Создаём события, в которых
                <br />
                красота встречается с заботой.
              </p>
              <Art />
              {["Для близких", "Для команды", "Для бренда"].map((k) => (
                <Row
                  key={k}
                  title={k}
                  sub={
                    k === "Для близких"
                      ? "Дни рождения, девичники и встречи"
                      : k === "Для команды"
                        ? "Корпоративы и командные выезды"
                        : "PR-события и коллаборации под ключ"
                  }
                  onClick={() => {
                    setEventSegment(k);
                    go("formats");
                  }}
                />
              ))}
              <Button
                onClick={() => {
                  setEvent(eventFormats[0]);
                  go("event");
                }}
              >
                Обсудить моё событие
              </Button>
              <p className="micro">
                Ориентиры стоимости — демонстрационные. Финальная смета после
                брифа.
              </p>
              <Row
                title="Как мы создаём события"
                sub="От замысла до последней детали"
                onClick={() => go("cases")}
              />
              <Notice>
                Медитации, личные занятия и обучение находятся в SATTVA. Здесь —
                организация событий под ключ.
              </Notice>
            </>
          )}
          {route === "match" && (
            <>
              <Head
                title="Что нужно вам сегодня?"
                sub="Выбирайте по ощущениям. Начать можно без опыта."
              />
              <span className="field-label">Хочу чувствовать себя</span>
              <Chips
                items={["Спокойнее", "Бодрее", "Собраннее"]}
                value={goal}
                onChange={setGoal}
              />
              <span className="field-label">У меня есть</span>
              <Chips
                items={[5, 10, 15, 30].map((n) => `${n} минут`)}
                value={`${minutes} минут`}
                onChange={(s) => setMinutes(Number(s.split(" ")[0]))}
              />
              <Label>
                Мой опыт
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option>Первый опыт</option>
                  <option>Практикую регулярно</option>
                  <option>Хочу углубиться</option>
                </select>
              </Label>
              <Notice>
                Подбор — ориентир по цели и времени, а не медицинская
                рекомендация. Вы можете изменить выбор.
              </Notice>
              <Button onClick={() => go("results")}>
                Показать практики · {matches.length}
              </Button>
              <button className="app-text-link" onClick={() => go("explore")}>
                Открыть всю библиотеку
              </button>
            </>
          )}
          {route === "results" && (
            <>
              <Head
                title="В вашем ритме"
                sub={`${goal} · до ${minutes} минут · ${experience}`}
              />
              {matches.length ? (
                matches.map((p) => <PracticeRow key={p.id} p={p} />)
              ) : (
                <Empty
                  title="Дадим себе больше времени?"
                  text="В этой комбинации пока нет практик. Измените длительность или состояние."
                  action="Изменить подбор"
                  onClick={() => go("match")}
                />
              )}
              {matches.length > 0 && (
                <button className="app-text-link" onClick={() => go("match")}>
                  Изменить подбор
                </button>
              )}
              <Row
                title="Хочется поддержки человека?"
                sub="Познакомьтесь с преподавателями"
                onClick={() => go("masters")}
              />
            </>
          )}
          {route === "explore" && (
            <>
              <h2 className="app-title">Библиотека практик</h2>
              <p className="app-subtitle">
                Несколько способов быть ближе к себе.
              </p>
              <div className="search">
                <Icon as={MagnifyingGlass} />
                <input
                  aria-label="Поиск по каталогу"
                  placeholder="Название, тема или преподаватель"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    aria-label="Очистить поиск"
                    onClick={() => setQuery("")}
                  >
                    <Icon as={X} size={17} />
                  </button>
                )}
              </div>
              <Chips
                items={[
                  "Все",
                  "Медитации",
                  "Йога",
                  "Дыхание",
                  "Подкасты",
                  "Вебинары",
                ]}
                value={category}
                onChange={setCategory}
              />
              <div className="inline-filter">
                <Label>
                  Формат
                  <select
                    value={media}
                    onChange={(e) => setMedia(e.target.value)}
                  >
                    <option>Все</option>
                    <option>Аудио</option>
                    <option>Видео</option>
                  </select>
                </Label>
                <span>{filteredPractices.length} материалов</span>
              </div>
              {filteredPractices.map((p) => (
                <PracticeRow key={p.id} p={p} />
              ))}
              {!filteredPractices.length && (
                <Empty
                  title="Пока ничего не нашлось"
                  text="Снимите фильтр или попробуйте другое слово."
                  action="Сбросить фильтры"
                  onClick={() => {
                    setCategory("Все");
                    setMedia("Все");
                    setQuery("");
                  }}
                />
              )}
              <Row
                title="Материалы из Telegram"
                sub="Философия, новости и полезные подборки"
                onClick={() => go("journal")}
              />
            </>
          )}
          {route === "practice" && (
            <>
              <Head
                title={item.title}
                sub={`${mediaKind(item)} · ${item.time} минут · ${item.level}`}
              />
              <Art />
              <p>{item.text}</p>
              <div className="info-list">
                <p>
                  <Icon as={User} />
                  {item.author}
                </p>
                <p>
                  <Icon as={Clock} />
                  {item.time} минут · {item.access}
                </p>
              </div>
              <Button onClick={() => go("player")}>
                {item.media === "Видео"
                  ? "Открыть видеоурок"
                  : "Начать практику"}
              </Button>
              <Button secondary onClick={() => save(item.id)}>
                <Icon
                  as={BookmarkSimple}
                  weight={saved.includes(item.id) ? "fill" : "light"}
                />
                {saved.includes(item.id) ? "В избранном" : "Сохранить на потом"}
              </Button>
              <details>
                <summary>Подготовка и комфорт</summary>
                <p>
                  Выберите безопасное удобное положение. Не задерживайте дыхание
                  и не выполняйте движения через боль. При дискомфорте
                  остановитесь. При ограничениях нагрузки обсудите участие с
                  квалифицированным специалистом.
                </p>
              </details>
              <Row
                title={item.author}
                sub="Подход и личные занятия"
                onClick={() =>
                  openTeacher(
                    masters.find((t) => t.name === item.author) || masters[0],
                  )
                }
              />
              <Row
                title="Продолжить в курсе"
                sub={
                  courses.find((c) => c.author === item.author)?.title ||
                  courses[0].title
                }
                onClick={() =>
                  openCourse(
                    courses.find((c) => c.author === item.author) || courses[0],
                  )
                }
              />
            </>
          )}
          {route === "player" && (
            <>
              <Head
                title={item.title}
                sub={`${mediaKind(item)} · ${item.time} минут`}
              />
              <div
                className={
                  "media-preview " +
                  (item.media === "Видео" ? "video-preview" : "")
                }
              >
                <Art />
                <button
                  className="play-round large"
                  aria-label={playing ? "Пауза" : "Начать"}
                  onClick={() => setPlaying(!playing)}
                >
                  <Icon as={playing ? Pause : Play} size={27} weight="fill" />
                </button>
                <span>
                  {playing ? "Демонстрация идёт" : "Начать демонстрацию"}
                </span>
              </div>
              <div className="player">
                <span className="eyebrow">
                  ШАГ {step + 1} ИЗ {item.steps.length}
                </span>
                <p className="practice-script">{item.steps[step]}</p>
                <div className="player-controls">
                  <button
                    aria-label="Предыдущий шаг"
                    disabled={!step}
                    onClick={() => setStep((n) => n - 1)}
                  >
                    <Icon as={ArrowLeft} />
                  </button>
                  <progress max={item.steps.length} value={step + 1} />
                  <button
                    aria-label="Следующий шаг"
                    disabled={step === item.steps.length - 1}
                    onClick={() => setStep((n) => n + 1)}
                  >
                    <Icon as={ArrowRight} />
                  </button>
                </div>
              </div>
              <Notice>
                Это макет{" "}
                {item.media === "Видео" ? "видеоурока" : "аудиоплеера"} с
                текстовыми шагами. Полной записи пока нет; преподаватель добавит
                медиа в рабочую платформу. Здесь нет звука или видеопотока.
              </Notice>
              <Button
                onClick={() => {
                  setProgress((p) => ({
                    ...p,
                    practices: [...new Set([...(p.practices || []), item.id])],
                  }));
                  setResult({
                    title: "Эта пауза — для вас",
                    text: "Можно сохранить практику или продолжить в своём темпе.",
                    next: "practice",
                    label: "Вернуться к практике",
                  });
                  go("success");
                }}
              >
                Завершить практику
              </Button>
              <Button secondary onClick={() => save(item.id)}>
                {saved.includes(item.id)
                  ? "В избранном"
                  : "Сохранить в избранное"}
              </Button>
              <details>
                <summary>Текст практики целиком</summary>
                {item.steps.map((s, i) => (
                  <p key={s}>
                    {i + 1}. {s}
                  </p>
                ))}
              </details>
            </>
          )}
          {route === "courses" && (
            <>
              <h2 className="app-title">Курсы и программы</h2>
              <p className="app-subtitle">
                От первой недели медитации — до живого погружения.
              </p>
              <div className="search">
                <Icon as={MagnifyingGlass} />
                <input
                  aria-label="Поиск курсов"
                  value={query}
                  placeholder="Курс, автор или город"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Chips
                items={["Все", "Онлайн", "Офлайн"]}
                value={courseFormat}
                onChange={setCourseFormat}
              />
              <Label>
                Направление
                <select
                  value={courseTopic}
                  onChange={(e) => setCourseTopic(e.target.value)}
                >
                  {[
                    "Все",
                    "Начать",
                    "Йога",
                    "Медитации",
                    "Дыхание",
                    "Санкт-Петербург",
                    "Москва",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Label>
              <p className="micro">
                {filteredCourses.length} программ · Цены и даты демонстрационные
              </p>
              {filteredCourses.map((c) => (
                <CourseRow key={c.id} c={c} />
              ))}
              {!filteredCourses.length && (
                <Empty
                  title="Нет программы с такими фильтрами"
                  text="Попробуйте другое направление или город."
                  action="Сбросить фильтры"
                  onClick={() => {
                    setQuery("");
                    setCourseFormat("Все");
                    setCourseTopic("Все");
                  }}
                />
              )}
              <Row
                title="Не знаете, с чего начать?"
                sub="Подберите небольшую бесплатную практику"
                onClick={() => go("match")}
              />
            </>
          )}
          {route === "course" && (
            <>
              <Head
                title={course.title}
                sub={`${course.format} · ${course.author}`}
              />
              <div className="course-facts">
                <span>{course.duration}</span>
                <span>{course.level}</span>
                {course.city && <span>{course.city}</span>}
                <span>Доступ: {course.access}</span>
              </div>
              <Art />
              <p className="serif-small">{course.summary}</p>
              {course.dates && (
                <div className="info-list">
                  <p>
                    <Icon as={CalendarBlank} />
                    {course.dates} · {course.duration}
                  </p>
                  <p>
                    <Icon as={MapPin} />
                    {course.address}
                  </p>
                  <p>
                    <Icon as={Users} />
                    До {course.places} участников · демонабор
                  </p>
                </div>
              )}
              <h3>Что вы сможете попробовать</h3>
              <p>
                Познакомиться с подходом автора, выбрать комфортный ритм и
                собрать собственную последовательность. Результат зависит от
                опыта и участия; медицинские эффекты не обещаются.
              </p>
              <h3>
                {course.format === "Офлайн"
                  ? "Программа по дням"
                  : "Программа курса"}
              </h3>
              {course.modules.map((m, i) => (
                <Row
                  key={m}
                  title={`${String(i + 1).padStart(2, "0")} · ${m}`}
                  sub={
                    course.format === "Офлайн"
                      ? "План живой встречи"
                      : activeCourse
                        ? "Урок доступен"
                        : i === 0
                          ? "Бесплатный демонстрационный фрагмент"
                          : "Откроется после покупки"
                  }
                  icon={course.format === "Офлайн" ? CalendarBlank : Play}
                  onClick={() => {
                    if (course.format === "Офлайн") {
                      setToast(
                        "Программа дня: практика, перерыв, вопросы преподавателю. Демопример.",
                      );
                      return;
                    }
                    if (activeCourse || i === 0) {
                      setLesson(i);
                      go("lesson");
                    } else
                      setToast(
                        "Первый урок открыт бесплатно. Остальные — после демопокупки.",
                      );
                  }}
                />
              ))}
              <h3 className="section-space-title">Включено</h3>
              <ul className="plain-list">
                {course.included.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <details>
                <summary>Что не включено</summary>
                <ul>
                  {course.notIncluded.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </details>
              <details>
                <summary>Доступ, отмена и возврат</summary>
                <p>
                  {course.cancel ||
                    "В демо списания нет. Для реального запуска потребуется отдельная оферта с условиями доступа, отмены и возврата. Не считаем демонстрационную покупку реальным обязательством."}
                </p>
                <p>
                  Срок доступа к онлайн-материалам: {course.access}.
                  Офлайн-занятия проходят в указанные даты; проживание и дорога
                  не включены, если это не оговорено отдельно.
                </p>
              </details>
              <Row
                title={course.author}
                sub="Познакомиться с преподавателем"
                onClick={() =>
                  openTeacher(
                    masters.find((t) => t.name === course.author) || masters[0],
                  )
                }
              />
              <p className="micro">
                Программа, автор, цены, даты и площадка — демонстрационные
                примеры.
              </p>
            </>
          )}
          {route === "lessons" && (
            <>
              <Head
                title={course.title}
                sub={
                  course.format === "Офлайн"
                    ? "Ваша офлайн-программа"
                    : "Ваш курс · доступ открыт"
                }
              />
              {course.format === "Офлайн" ? (
                <>
                  <div className="ticket-status">
                    <Icon as={CheckCircle} />
                    Демонстрационное участие
                  </div>
                  <p>
                    {course.dates} · {course.city}
                  </p>
                  {course.modules.map((m) => (
                    <details key={m}>
                      <summary>{m}</summary>
                      <p>
                        Практика с преподавателем, перерывы и время для
                        вопросов. Реальное наполнение согласуется до набора
                        группы.
                      </p>
                    </details>
                  ))}
                  <Notice>
                    Подготовьте удобную одежду и коврик. Точный адрес, правила
                    участия и условия отмены должны быть известны до реальной
                    оплаты.
                  </Notice>
                  <Button secondary onClick={() => go("help")}>
                    Задать вопрос о программе
                  </Button>
                </>
              ) : (
                <>
                  {course.modules.map((m, i) => (
                    <Row
                      key={m}
                      title={m}
                      sub={`Урок ${i + 1} · ${lessonsDone.includes(i) ? "Завершён" : "Можно начать"}`}
                      icon={lessonsDone.includes(i) ? CheckCircle : Play}
                      onClick={() => {
                        setLesson(i);
                        go("lesson");
                      }}
                    />
                  ))}
                  <progress
                    max={course.modules.length}
                    value={lessonsDone.length}
                  />
                  <p className="micro">
                    Завершено: {lessonsDone.length} из {course.modules.length}
                  </p>
                </>
              )}
            </>
          )}
          {route === "lesson" && (
            <>
              <Head
                title={course.modules[lesson]}
                sub={`${course.title} · Урок ${lesson + 1} из ${course.modules.length}`}
              />
              <div className="media-preview video-preview">
                <Art />
                <Icon as={VideoCamera} size={36} />
                <span>Демонстрационный видеоурок</span>
              </div>
              <h3>Начните с простого</h3>
              <p>
                Устройтесь удобно, отметьте ощущения и выберите комфортное
                участие. В этой части программы:{" "}
                {course.modules[lesson].toLowerCase()}.
              </p>
              <Notice>
                Показан пример структуры урока. Настоящие видео, аудио и
                материалы добавляются автором; сейчас доступен демонстрационный
                текст.
              </Notice>
              <details>
                <summary>Конспект и маленькое задание</summary>
                <p>
                  Заметьте исходное состояние. Выберите одну небольшую практику.
                  После неё отметьте, что хочется повторить — без оценки и
                  обязательств.
                </p>
              </details>
              <Button
                onClick={() => {
                  setProgress((p) => ({
                    ...p,
                    [course.id]: [
                      ...new Set([...(p[course.id] || []), lesson]),
                    ],
                  }));
                  if (activeCourse && lesson < course.modules.length - 1) {
                    setLesson((n) => n + 1);
                    setToast("Урок отмечен. Можно продолжать.");
                    scroll.current?.scrollTo(0, 0);
                  } else {
                    setResult({
                      title: "Вы сделали шаг",
                      text: activeCourse
                        ? "Прогресс сохранён. Возвращайтесь в своём темпе."
                        : "Вы познакомились с первым уроком. Полная программа — на странице курса.",
                      next: "course",
                      label: activeCourse
                        ? "К программе"
                        : "Посмотреть весь курс",
                    });
                    go("success");
                  }
                }}
              >
                {activeCourse && lesson < course.modules.length - 1
                  ? "Завершить и перейти дальше"
                  : "Завершить урок"}
              </Button>
            </>
          )}
          {route === "masters" && (
            <>
              <Head
                title="Найти своего преподавателя"
                sub="Сначала — подход и доверие. Затем — удобное время."
              />
              <div className="search">
                <Icon as={MagnifyingGlass} />
                <input
                  aria-label="Поиск преподавателя"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Имя или направление"
                />
              </div>
              <Chips
                items={[
                  "Все",
                  "Йога",
                  "Медитации",
                  "Дыхание",
                  "Телесные практики",
                ]}
                value={teacherTopic}
                onChange={setTeacherTopic}
              />
              <Chips
                items={["Все", "Онлайн", "Офлайн"]}
                value={teacherFormat}
                onChange={setTeacherFormat}
              />
              <Label>
                Город
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  {["Все города", "Онлайн", "Санкт-Петербург", "Москва"].map(
                    (c) => (
                      <option key={c}>{c}</option>
                    ),
                  )}
                </select>
              </Label>
              {filteredTeachers.map((t) => (
                <button
                  className="master-row"
                  key={t.id}
                  onClick={() => openTeacher(t)}
                >
                  <span className="initial">{t.letter}</span>
                  <span>
                    <strong>{t.name}</strong>
                    <small>{t.role}</small>
                    <small>
                      {t.city} · {t.formats.join(" / ")}
                    </small>
                    <small>Занятие от {money(t.price)}</small>
                  </span>
                  <Icon as={CaretRight} />
                </button>
              ))}
              {!filteredTeachers.length && (
                <Empty
                  title="С такими параметрами преподавателей нет"
                  text="Попробуйте онлайн или другое направление."
                  action="Сбросить фильтры"
                  onClick={() => {
                    setQuery("");
                    setTeacherTopic("Все");
                    setTeacherFormat("Все");
                    setCity("Все города");
                  }}
                />
              )}
              <Notice>
                Все профили вымышлены. Опыт и квалификация в рабочем продукте
                подтверждаются документами; здесь нет реальных отзывов или
                рейтингов.
              </Notice>
              <Row
                title="Я преподаватель"
                sub="Разместить курс и управлять занятиями"
                onClick={() => go("portal")}
              />
            </>
          )}
          {route === "master" && (
            <>
              <Head title={teacher.name} sub={teacher.role} />
              <span className="micro">ДЕМОПРОФИЛЬ · {teacher.city}</span>
              <p className="master-quote">«{teacher.text}»</p>
              <h3>Как проходят занятия</h3>
              <p>{teacher.approach}</p>
              <p>
                {teacher.exp} · {teacher.formats.join(" / ")}
              </p>
              <details>
                <summary>Образование и проверка профиля</summary>
                <p>{teacher.education}</p>
                <p>
                  До запуска нужно подтвердить личность, квалификацию и границы
                  услуг. Демоотметка не является проверкой.
                </p>
              </details>
              <h3 className="section-space-title">Форматы личной работы</h3>
              <ul className="service-options">
                <li>
                  Знакомство · 30 минут{" "}
                  <b>{money(Math.round(teacher.price * 0.5))}</b>
                </li>
                <li>
                  Личное занятие · 60 минут <b>{money(teacher.price)}</b>
                </li>
                <li>
                  Пакет из 4 занятий <b>{money(teacher.price * 4)}</b>
                </li>
              </ul>
              <h3>Материалы преподавателя</h3>
              {practices
                .filter((p) => p.author === teacher.name)
                .slice(0, 3)
                .map((p) => (
                  <PracticeRow key={p.id} p={p} />
                ))}
              {courses
                .filter((c) => c.author === teacher.name)
                .map((c) => (
                  <CourseRow key={c.id} c={c} />
                ))}
              <p className="micro">
                Перед встречей преподаватель уточняет пожелания и возможные
                ограничения. Личное занятие не является медицинской услугой.
              </p>
            </>
          )}
          {route === "slots" && (
            <>
              <Head
                title="Время для встречи"
                sub={`${teacher.name} · ${teacher.role}`}
              />
              <Label>
                Формат услуги
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option>Знакомство · 30 минут</option>
                  <option>Личное занятие</option>
                  <option>Пакет из 4 занятий</option>
                </select>
              </Label>
              <Chips
                items={teacher.formats}
                value={serviceFormat}
                onChange={setServiceFormat}
              />
              <span className="field-label">Дата · ноябрь 2026</span>
              <Chips
                items={["13 ноября", "16 ноября", "18 ноября", "23 ноября"]}
                value={date}
                onChange={setDate}
              />
              <span className="field-label">Время · Москва, UTC+3</span>
              <Chips
                items={["10:00", "12:30", "17:00"]}
                value={slot}
                onChange={setSlot}
              />
              <Notice>
                {service === "Пакет из 4 занятий"
                  ? "Первая встреча — в выбранное время. Ещё 3 занятия согласуются отдельно. В демо пакет не имеет реальной стоимости."
                  : "Выбранное время — пример доступного слота. Настоящий резерв создаётся только сервером."}
                {serviceFormat === "Офлайн"
                  ? ` Город: ${teacher.city}. Точный адрес нужен до оплаты.`
                  : ""}
              </Notice>
              <Button onClick={() => purchase("teacher")}>
                Проверить детали
              </Button>
            </>
          )}
          {route === "calendar" && (
            <>
              <h2 className="app-title">Занятия и встречи</h2>
              <p className="app-subtitle">
                Практикуйте с преподавателем — онлайн или рядом.
              </p>
              <Row
                title="Личное занятие"
                sub="Выбрать преподавателя и свободное время"
                onClick={() => {
                  setQuery("");
                  go("masters");
                }}
              />
              <Chips
                items={["Все", "Онлайн", "Офлайн"]}
                value={format}
                onChange={setFormat}
              />
              <div className="form-grid">
                <Label>
                  Город
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    {["Все города", "Онлайн", "Санкт-Петербург", "Москва"].map(
                      (c) => (
                        <option key={c}>{c}</option>
                      ),
                    )}
                  </select>
                </Label>
                <Label>
                  Дата
                  <select value={day} onChange={(e) => setDay(e.target.value)}>
                    <option>Все</option>
                    {[...new Set(sessions.map((s) => s.day))].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Label>
              </div>
              <p className="micro">
                НОЯБРЬ 2026 · МОСКВА, UTC+3 · ДЕМОРАСПИСАНИЕ
              </p>
              {sessions
                .filter(
                  (s) =>
                    (format === "Все" || s.format === format) &&
                    (city === "Все города" || s.city === city) &&
                    (day === "Все" || s.day === day),
                )
                .map((s) => (
                  <SessionRow key={s.id} s={s} />
                ))}
              {!sessions.some(
                (s) =>
                  (format === "Все" || s.format === format) &&
                  (city === "Все города" || s.city === city) &&
                  (day === "Все" || s.day === day),
              ) && (
                <Empty
                  title="На эту дату пока нет встреч"
                  text="Сбросьте фильтры или выберите преподавателя лично."
                  action="Сбросить фильтры"
                  onClick={() => {
                    setFormat("Все");
                    setCity("Все города");
                    setDay("Все");
                  }}
                />
              )}
            </>
          )}
          {route === "session" && (
            <>
              <Head
                title={session.title}
                sub={`${session.format} · ${session.level}`}
              />
              <Art />
              <div className="info-list">
                <p>
                  <Icon as={CalendarBlank} />
                  {session.day} 2026 · {session.time} МСК
                </p>
                <p>
                  <Icon as={Clock} />
                  {session.duration} минут
                </p>
                <p>
                  <Icon as={MapPin} />
                  {session.address}
                </p>
                <p>
                  <Icon as={User} />
                  {session.master}
                </p>
              </div>
              <p>
                Знакомство, внимательная практика, пауза и время для вопросов.
                Можно пропустить любой шаг и оставаться в комфортном темпе.
              </p>
              <details>
                <summary>Что взять и как подготовиться</summary>
                <p>
                  Удобная одежда, вода и коврик. Для онлайна — устойчивое
                  соединение и место для безопасного движения. При ограничениях
                  нагрузки обсудите участие заранее.
                </p>
              </details>
              <details>
                <summary>Отмена и перенос</summary>
                <p>
                  В демонстрации запись можно отменить без списаний. В рабочем
                  сервисе условия и сроки возврата показываются до оплаты. Если
                  событие отменяет организатор, клиент выбирает перенос или
                  возврат по договору.
                </p>
              </details>
              <Row
                title={session.master}
                sub="Профиль преподавателя"
                onClick={() =>
                  openTeacher(
                    masters.find((t) => t.name === session.master) ||
                      masters[0],
                  )
                }
              />
              <p className="micro">
                Адрес, цена, дата и доступность — демонстрационные.
              </p>
            </>
          )}
          {route === "checkout" && order && (
            <>
              <Head
                title="Ваш следующий шаг"
                sub="Проверьте программу, время и условия."
              />
              <div className="order-summary">
                <span className="eyebrow">ДЕМОЗАКАЗ · БЕЗ СПИСАНИЯ</span>
                <h3>{order.title}</h3>
                <p>{order.detail}</p>
                {order.master && <p>{order.master}</p>}
                {order.address && <p>{order.address}</p>}
                <div className="summary-line">
                  <span>Ориентир цены</span>
                  <b>{money(order.price)}</b>
                </div>
              </div>
              <div className="demo-notice">
                <Icon as={CheckCircle} />
                <span>
                  Без ввода карты, реального платежа и бронирования. Результат
                  хранится в этом браузере.
                </span>
              </div>
              <details>
                <summary>Что происходит после подтверждения</summary>
                <p>
                  {order.kind === "course"
                    ? "Онлайн-курс появляется в «Моё» с уроками. Офлайн-программа — с планом дней и подготовкой."
                    : order.kind === "subscription"
                      ? "Откроется демонстрационный клубный доступ без автопродления. Курсы и личные занятия не входят."
                      : order.kind === "gift"
                        ? "Создаётся демосертификат без денежной стоимости. Он не отправляется другому человеку."
                        : "Запись появится в «Моё» с датой, временем и возможностью отменить её."}
                </p>
                <p>
                  До реальной оплаты необходимы оферта, условия возврата и
                  подтверждённые данные организатора.
                </p>
              </details>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  finish();
                }}
              >
                <Label className="check-label">
                  <input type="checkbox" required />
                  <span>
                    Понимаю, что подтверждаю демонстрацию. Деньги не
                    списываются.
                  </span>
                </Label>
                <Button type="submit">Подтвердить в демо</Button>
              </form>
              <button className="app-text-link" onClick={back}>
                Вернуться без покупки
              </button>
            </>
          )}
          {route === "success" && result && (
            <div className="success-screen">
              <Icon as={CheckCircle} size={58} />
              <h2 className="app-title">{result.title}</h2>
              <p>{result.text}</p>
              <Button onClick={() => go(result.next)}>{result.label}</Button>
              <Button secondary onClick={() => go("mine")}>
                Всё в «Моё»
              </Button>
              <button className="app-text-link" onClick={() => go("home")}>
                На главную
              </button>
            </div>
          )}
          {route === "mine" && (
            <>
              <h2 className="app-title">Моё пространство</h2>
              <p className="app-subtitle">
                Покупки, встречи и то, что поддерживает.
              </p>
              <Chips
                items={["Записи", "Курсы", "Избранное", "Заявки", "Подарки"]}
                value={tab}
                onChange={setTab}
              />
              {tab === "Записи" && (
                <>
                  {bookings.length ? (
                    bookings.map((b) => (
                      <Row
                        key={b.id}
                        title={b.title}
                        sub={`${b.detail} · ${b.status}`}
                        onClick={() => {
                          setSelectedRecord(b);
                          go("record");
                        }}
                      />
                    ))
                  ) : (
                    <Empty
                      title="Здесь появятся ваши встречи"
                      text="Начните с групповой или личной практики."
                      action="Посмотреть занятия"
                      onClick={() => go("calendar")}
                    />
                  )}
                  <h3 className="section-space-title">Лист ожидания</h3>
                  {waitlist.length ? (
                    waitlist.map((w) => (
                      <div className="request-item" key={w.id}>
                        <h3>{w.title}</h3>
                        <p>
                          {w.day} · {w.time} МСК
                        </p>
                        <small>
                          Демонстрационная очередь. Уведомления не отправляются.
                        </small>
                        <button
                          className="app-text-link"
                          onClick={() =>
                            setWaitlist((ws) => ws.filter((x) => x.id !== w.id))
                          }
                        >
                          Покинуть лист ожидания
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="micro">
                      Вы ещё не записывались в лист ожидания.
                    </p>
                  )}
                </>
              )}
              {tab === "Курсы" &&
                (owned.length ? (
                  courses
                    .filter((c) => owned.includes(c.id))
                    .map((c) => <CourseRow key={c.id} c={c} />)
                ) : (
                  <Empty
                    title="Найдите свой маршрут"
                    text="У онлайн-курсов есть бесплатное знакомство."
                    action="Открыть каталог курсов"
                    onClick={() => go("courses")}
                  />
                ))}
              {tab === "Избранное" &&
                (saved.length ? (
                  practices
                    .filter((p) => saved.includes(p.id))
                    .map((p) => <PracticeRow key={p.id} p={p} />)
                ) : (
                  <Empty
                    title="Сохраните то, что откликается"
                    text="Практики и медитации всегда будут под рукой."
                    action="В библиотеку"
                    onClick={() => go("explore")}
                  />
                ))}
              {tab === "Заявки" && (
                <>
                  {requests.map((r) => (
                    <Row
                      key={r.id}
                      title={`${r.kind} · ${r.eventTitle || "Событие YOG"}`}
                      sub={`${r.status || "Получена в демо"} · ${r.city || "Город уточняется"}`}
                      onClick={() => {
                        setRequest(r);
                        go("request");
                      }}
                    />
                  ))}
                  {authors.map((a) => (
                    <div className="request-item" key={a.id}>
                      <span className="eyebrow">АВТОРСКИЙ КУРС</span>
                      <h3>{a.title}</h3>
                      <p>
                        {a.status || "Черновик"} · {a.format || "Онлайн"}
                      </p>
                      <small>Демонстрация. Команде не отправлено.</small>
                    </div>
                  ))}
                  {!requests.length && !authors.length && (
                    <Empty
                      title="Пока без заявок"
                      text="Здесь будут ваши события YOG и авторские программы."
                      action="Создать событие"
                      onClick={() => go("event")}
                    />
                  )}
                </>
              )}
              {tab === "Подарки" &&
                (gifts.length ? (
                  gifts.map((g) => (
                    <div className="request-item" key={g.id}>
                      <Icon as={Gift} />
                      <h3>{money(g.price)} заботы</h3>
                      <p>
                        Демокод: SATTVA-{String(g.id).slice(-6).toUpperCase()}
                      </p>
                      <small>
                        Без денежной стоимости. Покупка и доставка не
                        выполнялись.
                      </small>
                    </div>
                  ))
                ) : (
                  <Empty
                    title="Заботой можно делиться"
                    text="Посмотрите пример подарочного сертификата."
                    action="Выбрать подарок"
                    onClick={() => go("gift")}
                  />
                ))}
              <div className="section-space" />
              <Row
                title="Моя неделя заботы"
                sub="Личный ритм без гонки за серией"
                onClick={() => go("plan")}
              />
              <Row
                title="Клуб SATTVA"
                sub={
                  subscription
                    ? `${subscription.title} · демодоступ`
                    : "Варианты подписки и включённые возможности"
                }
                onClick={() => go("membership")}
              />
              <Row
                title="Подарить заботу"
                sub="Демонстрационный сертификат"
                onClick={() => go("gift")}
              />
              <Row
                title="Для преподавателей"
                sub="Курсы, расписание и модель дохода"
                onClick={() => go("portal")}
              />
              <Row
                title="Предпочтения и напоминания"
                sub="Ваш темп и приватность"
                onClick={() => go("preferences")}
              />
              <Row
                title="Помощь и условия"
                sub="Покупки, записи, доступ и отмены"
                onClick={() => go("help")}
              />
              <p className="micro">
                Демонстрационные данные хранятся в этом браузере. Общего
                аккаунта и синхронизации устройств пока нет.
              </p>
            </>
          )}
          {["record", "ticket"].includes(route) && selectedRecord && (
            <>
              <Head title={selectedRecord.title} sub={selectedRecord.detail} />
              <div className="ticket-status">
                <Icon as={CheckCircle} />
                {bookings.find((b) => b.id === selectedRecord.id)?.status}
              </div>
              <p className="micro">
                ДЕМОЗАПИСЬ #{String(selectedRecord.id).slice(-6)}
              </p>
              <p>
                {selectedRecord.address ||
                  "Инструкции для подключения появятся в реальной подтверждённой записи."}
              </p>
              {selectedRecord.credits > 1 && (
                <Notice>
                  Пакет: {selectedRecord.credits} занятия. Первое — в выбранное
                  время; остальные согласуются отдельно. Это пример, реальный
                  баланс занятий не ведётся.
                </Notice>
              )}
              <Notice>
                Это не настоящий билет. В рабочем продукте здесь будут
                проверенные адрес, ссылка, контакт организатора и правила
                участия.
              </Notice>
              {bookings.find((b) => b.id === selectedRecord.id)?.status !==
                "Отменена" &&
                (cancelConfirm ? (
                  <div className="cancel-panel">
                    <h3>Отменить демозапись?</h3>
                    <p>
                      Деньги не списывались. Реальное занятие не затрагивается.
                    </p>
                    <Button
                      onClick={() => {
                        setBookings((bs) =>
                          bs.map((b) =>
                            b.id === selectedRecord.id
                              ? { ...b, status: "Отменена" }
                              : b,
                          ),
                        );
                        setCancelConfirm(false);
                        setToast("Демонстрационная запись отменена");
                      }}
                    >
                      Да, отменить
                    </Button>
                    <Button secondary onClick={() => setCancelConfirm(false)}>
                      Сохранить запись
                    </Button>
                  </div>
                ) : (
                  <Button secondary onClick={() => setCancelConfirm(true)}>
                    Отменить демозапись
                  </Button>
                ))}
              <Row
                title="Выбрать другую встречу"
                sub="Новая запись — отдельным шагом"
                onClick={() => go("calendar")}
              />
              <Button secondary onClick={() => go("help")}>
                Помощь по записи
              </Button>
            </>
          )}
          {route === "plan" && (
            <>
              <Head
                title="Моя неделя заботы"
                sub="Семь приглашений. Без обязательной серии и чувства вины."
              />
              {rituals.map((r) => (
                <Row
                  key={r.day}
                  title={r.title}
                  tag={r.day}
                  sub={
                    (progress.practices || []).includes(r.id)
                      ? "Уже попробовали · можно повторить"
                      : "5–15 минут · бесплатная практика"
                  }
                  icon={
                    (progress.practices || []).includes(r.id)
                      ? CheckCircle
                      : Play
                  }
                  onClick={() =>
                    openPractice(practices.find((p) => p.id === r.id))
                  }
                />
              ))}
              <Notice>
                Это пример маршрута, а не обязательное расписание. Любую
                практику можно пропустить или повторить.
              </Notice>
              <Row
                title="Хочу последовательную программу"
                sub="Посмотреть курсы"
                onClick={() => go("courses")}
              />
            </>
          )}
          {route === "membership" && (
            <>
              <Head
                title="Клуб SATTVA"
                sub="Поддержка регулярности — с ясными границами доступа."
              />
              {subscription && (
                <div className="membership-active">
                  <Icon as={CheckCircle} />
                  <h3>{subscription.title}</h3>
                  <p>Демодоступ · {subscription.detail}</p>
                  <small>Автоматического продления и списаний нет.</small>
                  <Button
                    secondary
                    onClick={() => {
                      setSubscription(null);
                      setToast(
                        "Демодоступ завершён. Купленные курсы сохранены.",
                      );
                    }}
                  >
                    Завершить демоподписку
                  </Button>
                </div>
              )}
              {plans.map((p) => (
                <article className="plan-card" key={p.id}>
                  <span className="eyebrow">{p.period}</span>
                  <h3>{p.title}</h3>
                  <div className="plan-price">{money(p.price)}</div>
                  <ul className="plain-list">
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <p>{p.note}</p>
                  <Button onClick={() => purchase("subscription", p)}>
                    Попробовать в демо
                  </Button>
                </article>
              ))}
              <details>
                <summary>Подписка и курсы: в чём разница?</summary>
                <p>
                  Подписка поддерживает регулярность через подборки и клубные
                  встречи. Авторские программы, личные уроки, офлайн-курсы и
                  события YOG покупаются отдельно. В прототипе все условия
                  примерные.
                </p>
              </details>
            </>
          )}
          {route === "gift" && (
            <>
              <Head
                title="Подарить заботу"
                sub="Подарок без указания человеку, каким ему быть."
              />
              <Art />
              <p>
                Сертификат на выбор практики, курса или занятия — формат для
                будущего сервиса. Получатель сам выбирает направление.
              </p>
              <span className="field-label">Номинал</span>
              <Chips
                items={[1500, 3000, 5000, 10000].map(money)}
                value={money(giftAmount)}
                onChange={(x) => setGiftAmount(Number(x.replace(/\D/g, "")))}
              />
              <Notice>
                Сейчас создаётся только демонстрационный сертификат. Он не имеет
                денежной стоимости, не оплачивается и не отправляется. В рабочем
                сервисе отдельно задаются срок действия, применение остатка и
                правила возврата.
              </Notice>
              <Button onClick={() => purchase("gift")}>
                Создать демоподарок
              </Button>
            </>
          )}
          {route === "formats" && (
            <>
              <h2 className="app-title">Ваше событие YOG</h2>
              <p className="app-subtitle">
                Форма может быть разной. Смысл — забота, единство и красота.
              </p>
              <Chips
                items={["Все", "Для близких", "Для команды", "Для бренда"]}
                value={eventSegment}
                onChange={setEventSegment}
              />
              {eventFormats
                .filter(
                  (e) => eventSegment === "Все" || e.segment === eventSegment,
                )
                .map((e) => (
                  <Row
                    key={e.id}
                    title={e.title}
                    tag={e.segment}
                    sub={`${e.people} · ориентир от ${money(e.price)}`}
                    onClick={() => {
                      setEvent(e);
                      setEventKind(e.segment);
                      go("event-detail");
                    }}
                  />
                ))}
              <Notice>
                Это примеры форматов и цен для обсуждения. Реальная стоимость
                зависит от города, даты, состава команды и площадки.
              </Notice>
            </>
          )}
          {route === "event-detail" && (
            <>
              <Head
                title={event.title}
                sub={`${event.segment} · ${event.people}`}
              />
              <Art />
              <p>{event.text}</p>
              <div className="summary-line">
                <span>{event.duration}</span>
                <b>От {money(event.price)}</b>
              </div>
              <h3>Основа программы</h3>
              <ul className="plain-list">
                {event.included.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <h3>Что рассчитывается отдельно</h3>
              <p>{event.extra}</p>
              <Notice>
                Показан пример бюджета, а не публичная оферта. Смета и дата
                подтверждаются командой после брифа.
              </Notice>
              <Button onClick={() => startEvent(event)}>
                Обсудить этот формат
              </Button>
              <Row
                title="Как проходит работа"
                sub="Бриф → предложение → согласование → событие"
                onClick={() => go("cases")}
              />
            </>
          )}
          {["event", "brief"].includes(route) && (
            <>
              <Head
                title="Расскажите о вашем событии"
                sub="Для хорошей идеи не нужен готовый сценарий. Начнём с главного."
              />
              <Chips
                items={["Для близких", "Для команды", "Для бренда"]}
                value={eventKind}
                onChange={setEventKind}
              />
              <form
                onChange={(e) => {
                  if (e.target.name)
                    setDraft((d) => ({
                      ...d,
                      [e.target.name]: e.target.value,
                    }));
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = Object.fromEntries(new FormData(e.currentTarget)),
                    r = {
                      ...f,
                      id: uid(),
                      kind: eventKind,
                      eventTitle: f.eventTitle || event.title,
                      status: "Бриф сохранён",
                      estimate:
                        eventFormats.find((x) => x.title === f.eventTitle)
                          ?.price || event.price,
                    };
                  setRequests((rs) => [...rs, r]);
                  setRequest(r);
                  setDraft({});
                  setResult({
                    title: "Ваш замысел сохранён",
                    text: "Это демобриф. Он появился в «Моё» → «Заявки». Команде ничего не отправлено; дату и цену он не бронирует.",
                    next: "request",
                    label: "Посмотреть путь заявки",
                  });
                  go("success");
                }}
              >
                <Label>
                  Формат встречи
                  <select name="eventTitle" defaultValue={event.title}>
                    {eventFormats
                      .filter((e) => e.segment === eventKind)
                      .map((e) => (
                        <option key={e.id}>{e.title}</option>
                      ))}
                    <option>Нужна помощь с идеей</option>
                  </select>
                </Label>
                <Label>
                  Город
                  <input
                    name="city"
                    required
                    placeholder="Например, Санкт-Петербург"
                    defaultValue={draft.city || ""}
                  />
                </Label>
                <div className="form-grid">
                  <Label>
                    Дата или период
                    <input
                      name="date"
                      placeholder="Пока не знаю"
                      defaultValue={draft.date || ""}
                    />
                  </Label>
                  <Label>
                    Участников
                    <input
                      name="people"
                      type="number"
                      min="2"
                      max="1000"
                      placeholder="Например, 12"
                      defaultValue={draft.people || ""}
                    />
                  </Label>
                </div>
                <Label>
                  Бюджет
                  <select
                    name="budget"
                    defaultValue={draft.budget || "Нужен ориентир"}
                  >
                    {[
                      "Нужен ориентир",
                      "До 50 000 ₽",
                      "50 000–150 000 ₽",
                      "150 000–300 000 ₽",
                      "От 300 000 ₽",
                    ].map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </Label>
                {eventKind !== "Для близких" && (
                  <Label>
                    {eventKind === "Для команды"
                      ? "Задача для команды"
                      : "Задача бренда"}
                    <textarea
                      name="businessGoal"
                      placeholder="Какой опыт важно создать и кто принимает решение?"
                    />
                  </Label>
                )}
                <Label>
                  Что важно учесть?
                  <textarea
                    name="wish"
                    placeholder="Повод, атмосфера, доступность, пожелания к программе…"
                    defaultValue={draft.wish || ""}
                  />
                </Label>
                <p className="micro">
                  Не вводите контакты и чувствительные данные. Демо сохраняется
                  только в этом браузере.
                </p>
                <Button type="submit">Сохранить демобриф</Button>
              </form>
            </>
          )}
          {route === "request" && selectedRequests && (
            <>
              <Head
                title={selectedRequests.eventTitle || "Ваше событие YOG"}
                sub={`Заявка #${String(selectedRequests.id).slice(-6)} · ${selectedRequests.kind}`}
              />
              <div className="ticket-status">
                <Icon as={CheckCircle} />
                {selectedRequests.status || "Бриф сохранён"}
              </div>
              <p>
                {selectedRequests.city} ·{" "}
                {selectedRequests.date || "Дата уточняется"} ·{" "}
                {selectedRequests.people || "Число уточняется"} участников
              </p>
              <p>{selectedRequests.wish}</p>
              <ol className="request-stages">
                {[
                  "Бриф сохранён",
                  "Уточнение задачи",
                  "Предложение",
                  "Согласование",
                  "Подготовка",
                  "Событие",
                ].map((s, i) => (
                  <li key={s} className={i === 0 ? "done" : ""}>
                    {s}
                  </li>
                ))}
              </ol>
              <Notice>
                Статусы показывают будущий рабочий процесс. Сейчас заявка не
                отправлена. Пример предложения ниже — симуляция, не ответ
                менеджера.
              </Notice>
              <details>
                <summary>Посмотреть пример предложения</summary>
                <p>
                  Базовый сценарий и координация:{" "}
                  {money(selectedRequests.estimate || 45000)}.
                </p>
                <p>
                  Площадка, питание, съёмка и дополнительные услуги — отдельными
                  строками после уточнения. Подтверждение даты и состав команды
                  — до договора и оплаты.
                </p>
                <p>
                  Следующий шаг в рабочем продукте: команда уточняет задачу и
                  показывает смету с включёнными и исключёнными позициями.
                </p>
              </details>
              <Button
                secondary
                onClick={() => {
                  setRequests((rs) =>
                    rs.map((r) =>
                      r.id === selectedRequests.id
                        ? { ...r, status: "Отозвана в демо" }
                        : r,
                    ),
                  );
                  setToast(
                    "Демозаявка отозвана. Команде ничего не отправлялось.",
                  );
                }}
              >
                Отозвать демозаявку
              </Button>
            </>
          )}
          {route === "cases" && (
            <>
              <Head
                title="Как рождается событие"
                sub="Соавторство, в котором понятен каждый шаг."
              />
              {[
                [
                  "01",
                  "Знакомимся с вашей задачей",
                  "Повод, участники, город, пожелания и границы бюджета.",
                ],
                [
                  "02",
                  "Предлагаем концепцию",
                  "Сценарий, состав команды, варианты и прозрачная смета.",
                ],
                [
                  "03",
                  "Фиксируем договорённости",
                  "Дата, площадка, включённые услуги, этапы оплаты и отмены.",
                ],
                [
                  "04",
                  "Готовим и координируем",
                  "Один ответственный контакт, план подготовки и сценарий дня.",
                ],
                [
                  "05",
                  "Проводим и подводим итоги",
                  "Забота об участниках, добровольная обратная связь и следующий шаг.",
                ],
              ].map(([n, t, d]) => (
                <div className="request-item" key={n}>
                  <span className="eyebrow">{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
              <h3 className="section-space-title">
                Иллюстрация, а не реальный кейс
              </h3>
              <p>
                День рождения для 10 близких: мягкая практика, круг пожеланий и
                совместный стол. Другая задача — корпоратив на 30 человек с
                добровольными короткими практиками и отдельной зоной отдыха.
              </p>
              <Notice>
                Реальные кейсы, отзывы и фотографии добавляются только с
                согласия участников. В прототипе нет выдуманных результатов
                клиентов.
              </Notice>
              <Button onClick={() => go("event")}>Обсудить мою идею</Button>
            </>
          )}
          {route === "portal" && (
            <>
              <Head
                title="Пространство преподавателя"
                sub="Передавать опыт. Видеть процессы. Сохранять качество."
              />
              <Chips
                items={["Обзор", "Расписание", "Курсы", "Экономика"]}
                value={portal}
                onChange={setPortal}
              />
              {portal === "Обзор" && (
                <>
                  <p>
                    В рабочем сервисе доступ появляется после проверки профиля,
                    квалификации и договора. Здесь — пример кабинета, без
                    доступа к реальным ученикам и выплатам.
                  </p>
                  <Row
                    title="Предложить мини-курс"
                    sub="Программа, аудитория, стоимость и модерация"
                    onClick={() => go("author")}
                  />
                  <Row
                    title="Личные занятия"
                    sub="Создать демонстрационный слот"
                    onClick={() => setPortal("Расписание")}
                  />
                  <details>
                    <summary>Как проходит проверка</summary>
                    <p>
                      Заявка → проверка личности и квалификации → договор и
                      правила работы → настройка профиля → публикация. Нельзя
                      самостоятельно проставить себе подтверждённый статус.
                    </p>
                  </details>
                </>
              )}
              {portal === "Расписание" && (
                <>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const f = Object.fromEntries(
                        new FormData(e.currentTarget),
                      );
                      setPersonalSlots((ss) => [...ss, { ...f, id: uid() }]);
                      setToast(
                        "Демослот сохранён. Участникам не показывается.",
                      );
                      e.currentTarget.reset();
                    }}
                  >
                    <Label>
                      Дата
                      <input
                        name="date"
                        type="date"
                        required
                        min="2026-11-11"
                      />
                    </Label>
                    <Label>
                      Время (МСК)
                      <input name="time" type="time" required />
                    </Label>
                    <Label>
                      Формат
                      <select name="format">
                        <option>Онлайн</option>
                        <option>Офлайн</option>
                      </select>
                    </Label>
                    <Button type="submit">Добавить демослот</Button>
                  </form>
                  {personalSlots.map((s) => (
                    <div className="summary-line" key={s.id}>
                      <span>
                        {s.date} · {s.time} · {s.format}
                      </span>
                      <button
                        aria-label={`Удалить слот ${s.date}`}
                        onClick={() =>
                          setPersonalSlots((ss) =>
                            ss.filter((x) => x.id !== s.id),
                          )
                        }
                      >
                        <Icon as={X} />
                      </button>
                    </div>
                  ))}
                </>
              )}
              {portal === "Курсы" && (
                <>
                  <Button onClick={() => go("author")}>
                    Создать черновик курса
                  </Button>
                  {authors.map((a) => (
                    <div className="request-item" key={a.id}>
                      <h3>{a.title}</h3>
                      <p>{a.status || "Черновик"}</p>
                      <p>{a.program}</p>
                      <small>
                        Стоимость: {money(Number(a.price) || 0)} · материалы не
                        загружены
                      </small>
                    </div>
                  ))}
                  {!authors.length && (
                    <p className="soft-note">
                      У вас пока нет черновиков. Начните с программы и
                      аудитории.
                    </p>
                  )}
                </>
              )}
              {portal === "Экономика" && <TeacherEconomics />}
            </>
          )}
          {route === "author" && (
            <>
              <Head
                title="Ваш авторский курс"
                sub="Сначала — понятная программа и аудитория. Затем — материалы и проверка."
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const a = Object.fromEntries(new FormData(e.currentTarget));
                  setAuthors((as) => [
                    ...as,
                    { ...a, id: uid(), status: "Черновик · готов к проверке" },
                  ]);
                  setResult({
                    title: "Программа курса сохранена",
                    text: "Демонстрационный черновик находится в кабинете преподавателя и «Моё» → «Заявки». На реальную модерацию он не отправлен.",
                    next: "portal",
                    label: "Открыть кабинет",
                  });
                  go("success");
                }}
              >
                <Label>
                  Название курса
                  <input
                    name="title"
                    required
                    placeholder="Например, бережное утро"
                  />
                </Label>
                <Label>
                  Для кого эта практика?
                  <input
                    name="audience"
                    required
                    placeholder="Опыт, запрос и ограничения аудитории"
                  />
                </Label>
                <Label>
                  Формат
                  <select name="format">
                    <option>Онлайн · видеоуроки</option>
                    <option>Онлайн · живые встречи</option>
                    <option>Офлайн · интенсив</option>
                  </select>
                </Label>
                <Label>
                  Программа
                  <textarea
                    name="program"
                    required
                    minLength="15"
                    placeholder="Темы, последовательность и результат каждого урока"
                  />
                </Label>
                <Label>
                  Ориентир стоимости, ₽
                  <input name="price" type="number" min="0" required />
                </Label>
                <Label>
                  Условия доступа
                  <input
                    name="access"
                    required
                    placeholder="Срок, обратная связь, что входит"
                  />
                </Label>
                <Label className="check-label">
                  <input name="rights" type="checkbox" required />
                  <span>
                    Понимаю: реальные материалы требуют прав на контент и
                    проверки программы.
                  </span>
                </Label>
                <Notice>
                  Загрузка файлов, договоры, публикация, продажи и выплаты пока
                  не подключены. Демо не сохраняет ваши платёжные реквизиты.
                </Notice>
                <Button type="submit">Сохранить черновик курса</Button>
              </form>
            </>
          )}
          {route === "journal" && (
            <>
              <Head
                title="Из нашего Telegram"
                sub="Смыслы, которые остаются под рукой."
              />
              <Row
                title="О сути. О Саттве. О нас."
                sub="Философия проекта · из вашего брифа"
                onClick={() => go("article")}
              />
              {practices
                .filter((p) => ["Подкасты", "Вебинары"].includes(p.type))
                .map((p) => (
                  <PracticeRow key={p.id} p={p} />
                ))}
              <Notice>
                Это редакционный пример. Синхронизация каналов, их архивов и
                новых публикаций пока не подключена.
              </Notice>
            </>
          )}
          {route === "article" && (
            <>
              <Head
                title="О сути. О Саттве. О нас."
                sub="Два крыла одной системы"
              />
              <p className="serif-small">
                Внешнее красиво.
                <br />
                Внутреннее истинно.
              </p>
              <p>
                SATTVA — про личную практику, внимание к телу и внутреннюю
                ясность. Медитации, йога, обучение и преподаватели помогают
                выбирать свой путь.
              </p>
              <p>
                YOG — про форму и совместный опыт. Дни рождения, девичники,
                корпоративные и PR-события, в которых эстетика соединяется с
                заботой.
              </p>
              <p>
                Не нужно заслуживать покой или доказывать духовный опыт.
                Достаточно начать с того, что откликается сегодня.
              </p>
              <Button onClick={() => go("match")}>Начать с практики</Button>
            </>
          )}
          {route === "preferences" && (
            <Preferences
              onDone={() =>
                setToast(
                  "Предпочтения сохранены. Реальные уведомления не отправляются.",
                )
              }
            />
          )}
          {route === "help" && (
            <>
              <Head title="Рядом, когда нужно" sub="Условия, доступ и помощь" />
              {[
                [
                  "Это реальные материалы и специалисты?",
                  "Нет. Здесь примеры программ, преподавателей, дат и стоимости. Они нужны для проверки логики. Перед запуском потребуются реальные материалы, проверенные специалисты и подтверждённое расписание.",
                ],
                [
                  "Что делать после оплаты в рабочем сервисе?",
                  "Заказ должен получить проверенный сервером статус. Онлайн-уроки появляются в «Моё», офлайн-запись — с адресом и подготовкой. При неизвестном статусе не нужно платить повторно: сначала сверка и поддержка с номером заказа.",
                ],
                [
                  "Как оплачивается цифровой курс в Telegram?",
                  "Для цифрового контента внутри Telegram проектируется оплата Stars по актуальным правилам платформы. Для офлайн-услуг и внешнего сайта способ оплаты определяется отдельно. Сейчас реальных платежей нет.",
                ],
                [
                  "Как отменить занятие?",
                  "Откройте «Моё» → «Записи» → занятие → отмена. Демо попросит подтвердить действие. В реальном сервисе до оплаты показываются сроки отмены и правила возврата.",
                ],
                [
                  "Подписка открывает все курсы?",
                  "Нет. Клубные подборки и встречи — отдельный формат. Курсы, личные занятия и офлайн-программы имеют свои условия и цену.",
                ],
                [
                  "Как связаться с командой?",
                  "В рабочем продукте здесь будет действующий канал поддержки с номером заказа. В прототипе сообщения никому не отправляются; не вводите личные и платёжные данные.",
                ],
                [
                  "Где хранятся мои данные?",
                  "Только в localStorage этого браузера. Другой браузер или устройство не увидят результаты. Удаление данных сайта удалит демопокупки и заявки.",
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
      {dock && <div className="purchase-dock">{dock}</div>}
      <nav className="app-bottom" aria-label="Навигация приложения">
        {appTabs.map(([r, t, C]) => (
          <button
            key={r}
            className={nav === r ? "active" : ""}
            onClick={() => {
              if (["explore", "courses", "masters"].includes(r)) setQuery("");
              setRoute(r);
              setStack([]);
            }}
          >
            <Icon as={C} size={23} weight={nav === r ? "fill" : "light"} />
            <span>{t}</span>
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
function Preferences({ onDone }) {
  const [prefs, setPrefs] = useStored("sattva-preferences", {
    level: "Первый опыт",
    time: "10 минут",
    reminders: false,
  });
  return (
    <>
      <h2 className="app-title">Ваш темп</h2>
      <p className="app-subtitle">
        Сохранённые ориентиры и управление заботой о себе.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onDone();
        }}
      >
        <Label>
          Опыт
          <select
            value={prefs.level}
            onChange={(e) => setPrefs((p) => ({ ...p, level: e.target.value }))}
          >
            <option>Первый опыт</option>
            <option>Практикую регулярно</option>
          </select>
        </Label>
        <Label>
          Обычно есть время
          <select
            value={prefs.time}
            onChange={(e) => setPrefs((p) => ({ ...p, time: e.target.value }))}
          >
            <option>5 минут</option>
            <option>10 минут</option>
            <option>20 минут</option>
          </select>
        </Label>
        <Label className="check-label">
          <input
            type="checkbox"
            checked={prefs.reminders}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, reminders: e.target.checked }))
            }
          />
          <span>
            Я хочу добровольные напоминания о практике (демонастройка).
          </span>
        </Label>
        <Notice>
          Напоминания не отправляются. В рабочем продукте отдельно выбираются
          канал, часовой пояс, частота и согласие на сообщения бота.
        </Notice>
        <Button type="submit">Сохранить предпочтения</Button>
      </form>
    </>
  );
}
function TeacherEconomics() {
  const [count, setCount] = useState(8),
    [price, setPrice] = useState(2500),
    [rate, setRate] = useState(20);
  const gross = count * price,
    fee = (gross * rate) / 100;
  return (
    <>
      <h3>План, а не реальные выплаты</h3>
      <p className="micro">
        Все значения — изменяемые допущения. Комиссия не является условиями
        сервиса.
      </p>
      <Label>
        Занятий в месяц
        <input
          type="number"
          min="0"
          max="200"
          value={count}
          onChange={(e) => setCount(Math.max(0, Number(e.target.value)))}
        />
      </Label>
      <Label>
        Цена занятия, ₽
        <input
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
        />
      </Label>
      <Label>
        Предполагаемая комиссия, %
        <input
          type="number"
          min="0"
          max="100"
          value={rate}
          onChange={(e) =>
            setRate(Math.min(100, Math.max(0, Number(e.target.value))))
          }
        />
      </Label>
      <div className="summary-line">
        <span>Выручка учеников</span>
        <b>{money(gross)}</b>
      </div>
      <div className="summary-line">
        <span>Доля платформы</span>
        <b>{money(fee)}</b>
      </div>
      <div className="summary-line">
        <span>Преподавателю до налогов</span>
        <b>{money(gross - fee)}</b>
      </div>
      <Notice>
        Не учтены налоги, возвраты, эквайринг и стоимость подготовки. Настоящие
        условия закрепляются договором; здесь не ведутся продажи или выплаты.
      </Notice>
    </>
  );
}
