import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  FileText,
  X,
  ChartLine,
  WarningCircle,
} from "@phosphor-icons/react";
import { marked } from "marked";
import { auditImages } from "./audit-images";
import { auditFindings, roadmap } from "./strategy";
import auditDoc from "../docs/06-audit.md?raw";
import businessDoc from "../docs/07-business-marketing.md?raw";
const Icon = ({ as: C, ...p }) => (
  <C size={20} weight="light" aria-hidden="true" {...p} />
);
const money = (n) => `${Math.round(n).toLocaleString("ru-RU")} ₽`;
export default function BusinessViews({ section, openScenario }) {
  const [lens, setLens] = useState("Все"),
    [evidence, setEvidence] = useState("01-home"),
    [tab, setTab] = useState("Модель"),
    [funnel, setFunnel] = useState("courses");
  const images = [
    ["01-home", "Главная SATTVA"],
    ["02-catalog", "Библиотека"],
    ["03-course", "Курс"],
    ["04-teacher", "Преподаватель"],
    ["05-checkout", "Оформление"],
    ["06-yog", "YOG"],
  ];
  const funnels = {
    courses: {
      title: "Курс SATTVA",
      route: "courses",
      steps: [
        "Релевантный материал в канале",
        "Программа и бесплатный фрагмент",
        "Цена, состав и условия",
        "Подтверждённая оплата",
        "Доступ и первый урок",
        "Продолжение и обратная связь",
      ],
      kpi: "Открытие программы → оплаченный доступ → первое обучение. Не смешивать попытку оплаты и подтверждённую покупку.",
      owner: "Продюсер обучения + поддержка",
    },
    teachers: {
      title: "Личное занятие",
      route: "masters",
      steps: [
        "Запрос и поиск преподавателя",
        "Профиль, подход и услуги",
        "Формат и свободное время",
        "Резерв и подтверждение",
        "Инструкции и встреча",
        "Повторная запись по желанию",
      ],
      kpi: "Подтверждённые проведённые встречи, отмены, доступность слотов. Не считать недоступный слот потерей клиента без причины.",
      owner: "Куратор преподавателей",
    },
    offline: {
      title: "Офлайн-программа",
      route: "courses",
      steps: [
        "Подходящий город и даты",
        "Программа каждого дня",
        "Проживание, дорога и исключения",
        "Условия отмены и участие",
        "Подготовка и посещение",
        "Продолжение онлайн",
      ],
      kpi: "Заполняемость, вклад программы, посещаемость и причины возврата. Минимальный набор группы определяется экономикой.",
      owner: "Офлайн-продюсер",
    },
    yog: {
      title: "Проект YOG",
      route: "formats",
      steps: [
        "Формат и релевантный повод",
        "Короткий бриф",
        "Квалификация запроса",
        "Предложение и смета",
        "Договор и подготовка",
        "Событие и повторный запрос",
      ],
      kpi: "Квалифицированные брифы → предложения → согласованные проекты. Считать маржу, а не только общую сумму контрактов.",
      owner: "Руководитель проектов YOG",
    },
    club: {
      title: "Клуб SATTVA",
      route: "membership",
      steps: [
        "Понимание состава доступа",
        "Выбор периода",
        "Активация",
        "Первое полезное действие",
        "Регулярное использование",
        "Продление или свободная отмена",
      ],
      kpi: "Полезное использование и удержание по когортам. Новые оплаты не компенсируют пустое предложение.",
      owner: "Редактор клуба + CRM",
    },
  };
  const entry = funnels[funnel];
  const exportDoc = () => {
    let u = URL.createObjectURL(
      new Blob([section === "audit" ? auditDoc : businessDoc], {
        type: "text/markdown;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = u;
    a.download = section + ".md";
    a.click();
    URL.revokeObjectURL(u);
  };
  return (
    <div className="research business-space">
      <div className="page-heading">
        <span className="eyebrow">
          {section === "audit" ? "06 / АУДИТ ПРОДУКТА" : "07 / МОДЕЛЬ РАЗВИТИЯ"}
        </span>
        <h1>
          {section === "audit"
            ? "Глубина за лёгкостью"
            : "Пространство как бизнес"}
        </h1>
        <p>
          {section === "audit"
            ? "Маркетинг, продажи, арт-дирекция и управление — с наблюдениями и конкретными изменениями."
            : "Несколько способов создавать ценность. Понятная экономика и ответственность за обещания."}
        </p>
      </div>
      <div className="research-notice">
        <Icon as={FileText} />
        <span>
          Экспертные выводы и гипотезы. Рыночные показатели, спрос и прибыль
          пока не измерены.
        </span>
        <button onClick={exportDoc}>Скачать отчёт</button>
      </div>
      {section === "audit" ? (
        <>
          <div className="audit-intro">
            <h2>
              Не больше кнопок.
              <br />
              Больше понятных возможностей.
            </h2>
            <p>
              Сильная основа уже есть: спокойный язык, небольшой первый шаг и
              единое «Моё». Расширение добавляет выбор, обучение и коммерческую
              ясность, сохраняя лёгкость входа.
            </p>
          </div>
          <div className="audit-scope">
            <h3>Что и как проверено</h3>
            <p>
              Исходная версия проекта 9fdd687. Экраны ниже сняты в текущем
              аудите с рабочей локальной версии; просмотрены подбор, каталог,
              курс, профиль, оформление и YOG. Публичная проверка выявила 404 у
              /src/main.jsx — отдельную ошибку публикации. Состояние её
              исправления и повторной проверки записано в итоговом отчёте QA.
            </p>
            <p>
              Нет интервью, статистики продаж или полной проверки доступности.
              Демонстрационные цены и квалификация не являются фактами о рынке и
              специалистах.
            </p>
          </div>
          <details className="audit-evidence">
            <summary>Посмотреть исходные экраны и шаги аудита</summary>
            <div className="evidence-layout">
              <div className="flow-menu">
                {images.map(([id, t], i) => (
                  <button
                    key={id}
                    className={evidence === id ? "active" : ""}
                    onClick={() => setEvidence(id)}
                  >
                    <span>0{i + 1}</span>
                    {t}
                  </button>
                ))}
              </div>
              <figure>
                <img
                  src={auditImages[evidence]}
                  alt={`Исходный экран: ${images.find((x) => x[0] === evidence)?.[1]}`}
                />
                <figcaption>
                  Свидетельство: {evidence}.png · 390 × 844 · исходная локальная
                  версия. Некоторые длинные экраны показаны в положении
                  прокрутки после перехода.
                </figcaption>
              </figure>
            </div>
          </details>
          <div className="research-chips">
            {[
              "Все",
              "Маркетинг",
              "Продажи",
              "Арт-дирекция",
              "Собственник",
              "Директор",
            ].map((l) => (
              <button
                key={l}
                className={lens === l ? "on" : ""}
                onClick={() => setLens(l)}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="audit-findings">
            {auditFindings
              .filter((a) => lens === "Все" || a.lens === lens)
              .map((a) => (
                <article key={a.id} className="audit-finding">
                  <div className="finding-top">
                    <span>
                      {a.priority} · {a.lens}
                    </span>
                    <span>{a.status}</span>
                  </div>
                  <h2>{a.title}</h2>
                  <p>{a.finding}</p>
                  <div className="finding-columns">
                    <div>
                      <span className="eyebrow">БИЗНЕС-РИСК</span>
                      <p>{a.risk}</p>
                    </div>
                    <div>
                      <span className="eyebrow">ЧТО ИЗМЕНЕНО</span>
                      <p>{a.fix}</p>
                    </div>
                  </div>
                  <div className="finding-bottom">
                    <p>
                      <b>Ответственный:</b> {a.owner}
                      <br />
                      <b>Проверка:</b> {a.metric}
                    </p>
                    <button
                      className="text-link"
                      onClick={() => openScenario(a.route)}
                    >
                      Открыть сценарий <Icon as={ArrowRight} />
                    </button>
                  </div>
                </article>
              ))}
          </div>
          <div className="audit-scope">
            <h3>Отдельно: ошибка публикации</h3>
            <p>
              <b>P0.</b> HTTP 200 и статус built не доказывают, что приложение
              загрузилось. При аудите опубликованный HTML ссылался на исходный
              JSX и не запускал интерфейс. Новый выпуск должен публиковать dist
              и пройти проверку DOM и основных действий на публичном адресе.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="research-chips">
            {["Модель", "Воронки", "Экономика", "Развитие"].map((t) => (
              <button
                key={t}
                className={tab === t ? "on" : ""}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "Модель" && (
            <>
              <div className="concept-pair">
                <article>
                  <span className="eyebrow">SATTVA · ЛИЧНАЯ ПРАКТИКА</span>
                  <h2>Внутренний баланс</h2>
                  <p>
                    Бесплатная библиотека → последовательные курсы → личные
                    занятия → офлайн-погружение. Клуб помогает регулярности и не
                    заменяет все покупки.
                  </p>
                  <button
                    className="text-link"
                    onClick={() => openScenario("courses")}
                  >
                    Посмотреть программы <Icon as={ArrowRight} />
                  </button>
                </article>
                <article>
                  <span className="eyebrow">YOG · СОБЫТИЯ ПОД КЛЮЧ</span>
                  <h2>Совместный опыт</h2>
                  <p>
                    Частные праздники, корпоративы и PR-события. Продажа через
                    задачу, состав, смету и согласование — с одним ответственным
                    за результат.
                  </p>
                  <button
                    className="text-link"
                    onClick={() => openScenario("formats")}
                  >
                    Посмотреть форматы <Icon as={ArrowRight} />
                  </button>
                </article>
              </div>
              <h2>Что важно собственнику</h2>
              <div className="principles">
                {[
                  [
                    "Качество прежде масштаба",
                    "Широкая демонстрация не означает, что нужно запускать все форматы одновременно. Сначала — проверенные материалы и стабильное расписание.",
                  ],
                  [
                    "Разные модели дохода",
                    "Курс, встреча, подписка и проект YOG требуют разного учёта затрат, мощностей и удержания.",
                  ],
                  [
                    "Не выдавать выручку за прибыль",
                    "Учитывать автора, площадку, производство, возвраты, поддержку, привлечение, налоги и постоянные расходы.",
                  ],
                  [
                    "У каждого процесса есть владелец",
                    "Редактор, куратор преподавателей, администратор, продюсер, поддержка, финансы и технический руководитель.",
                  ],
                ].map(([t, d]) => (
                  <article key={t}>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </article>
                ))}
              </div>
              <details>
                <summary>Допуск к реальным продажам</summary>
                <p>
                  Нужны проверенные профили и медиа, подтверждённые расписание и
                  площадки, реальные условия доступа и возврата, серверные
                  заказы и резервы, проверка платежей и поддержка. Функции
                  прототипа не заменяют эту инфраструктуру.
                </p>
              </details>
            </>
          )}
          {tab === "Воронки" && (
            <>
              <div className="research-chips small">
                {Object.entries(funnels).map(([k, f]) => (
                  <button
                    key={k}
                    className={funnel === k ? "on" : ""}
                    onClick={() => setFunnel(k)}
                  >
                    {f.title}
                  </button>
                ))}
              </div>
              <div className="funnel-view">
                <h2>{entry.title}</h2>
                <ol className="flow-steps">
                  {entry.steps.map((s, i) => (
                    <li key={s}>
                      <span>{i + 1}</span>
                      <p>{s}</p>
                    </li>
                  ))}
                </ol>
                <p>
                  <b>Ответственный:</b> {entry.owner}
                </p>
                <p className="research-note">{entry.kpi}</p>
                <button
                  className="black-button"
                  onClick={() => openScenario(entry.route)}
                >
                  Пройти воронку в демо <Icon as={ArrowRight} />
                </button>
              </div>
            </>
          )}
          {tab === "Экономика" && <Economics />}
          {tab === "Развитие" && (
            <div className="roadmap">
              {roadmap.map((r, i) => (
                <article key={r.phase}>
                  <span className="eyebrow">
                    0{i + 1} · {r.state}
                  </span>
                  <h2>{r.phase}</h2>
                  <ul>
                    {r.items.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </>
      )}
      <details className="full-document">
        <summary>
          Полный{" "}
          {section === "audit"
            ? "аудит и ограничения проверки"
            : "план маркетинга, продаж и развития"}
        </summary>
        <div
          className="markdown"
          dangerouslySetInnerHTML={{
            __html: marked.parse(section === "audit" ? auditDoc : businessDoc),
          }}
        />
      </details>
    </div>
  );
}
function Economics() {
  const [type, setType] = useState("Офлайн-группа");
  const defaults = {
    "Офлайн-группа": {
      qty: 8,
      price: 18000,
      variable: 2000,
      fixed: 80000,
      marketing: 15000,
      rate: 0,
    },
    "Онлайн-курс": {
      qty: 30,
      price: 2900,
      variable: 300,
      fixed: 25000,
      marketing: 12000,
      rate: 30,
    },
    "Занятия преподавателя": {
      qty: 40,
      price: 2500,
      variable: 100,
      fixed: 5000,
      marketing: 5000,
      rate: 20,
    },
    "Проекты YOG": {
      qty: 2,
      price: 140000,
      variable: 95000,
      fixed: 30000,
      marketing: 15000,
      rate: 0,
    },
  };
  const [v, setV] = useState(defaults[type]);
  const teacher = type === "Занятия преподавателя";
  const course = type === "Онлайн-курс";
  const unitRevenue = teacher
    ? (v.price * v.rate) / 100
    : course
      ? v.price * (1 - v.rate / 100)
      : v.price;
  const margin = unitRevenue - v.variable;
  const totalRevenue = v.qty * unitRevenue;
  const contribution = v.qty * margin - v.fixed - v.marketing;
  const breakeven =
    margin > 0 ? Math.ceil((v.fixed + v.marketing) / margin) : null;
  return (
    <div className="economics">
      <h2>Проверить допущения</h2>
      <p>
        Изменяемая модель вклада до налогов и постоянных расходов бизнеса. Это
        не прогноз и не реальные показатели.
      </p>
      <div className="research-chips">
        {Object.keys(defaults).map((t) => (
          <button
            key={t}
            className={type === t ? "on" : ""}
            onClick={() => {
              setType(t);
              setV(defaults[t]);
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="economics-grid">
        <form onSubmit={(e) => e.preventDefault()}>
          {[
            ["qty", "Продаж / участников / встреч"],
            ["price", "Цена единицы, ₽"],
            ["variable", "Переменные затраты на единицу, ₽"],
            ["fixed", "Прямые фиксированные расходы, ₽"],
            ["marketing", "Привлечение, ₽"],
            ...(teacher || course
              ? [
                  [
                    "rate",
                    teacher
                      ? "Комиссия платформы, %"
                      : "Доля автора и платёжные расходы, %",
                  ],
                ]
              : []),
          ].map(([k, t]) => (
            <label key={k}>
              {t}
              <input
                type="number"
                min="0"
                max={k === "rate" ? 100 : undefined}
                value={v[k]}
                onChange={(e) =>
                  setV((p) => ({
                    ...p,
                    [k]: Math.min(
                      k === "rate" ? 100 : Infinity,
                      Math.max(0, Number(e.target.value)),
                    ),
                  }))
                }
              />
            </label>
          ))}
        </form>
        <div className="economics-result" aria-live="polite">
          <span className="eyebrow">СЦЕНАРИЙ · {type}</span>
          <h3>{money(contribution)}</h3>
          <p>Вклад после указанных прямых расходов</p>
          <dl>
            <div>
              <dt>
                {teacher
                  ? "Выручка платформы по комиссии"
                  : "Выручка после доли автора, если применимо"}
              </dt>
              <dd>{money(totalRevenue)}</dd>
            </div>
            <div>
              <dt>Вклад на единицу до фиксированных затрат</dt>
              <dd>{money(margin)}</dd>
            </div>
            <div>
              <dt>Точка безубыточности</dt>
              <dd>
                {breakeven === null ? "Не достигается" : `${breakeven} ед.`}
              </dd>
            </div>
          </dl>
          <p className="research-note">
            {teacher
              ? "Вся сумма ученика не считается выручкой платформы. Условия расчёта определяются договорной моделью."
              : "Производство, площадка, автор и поддержка должны попасть в соответствующие статьи. Возвраты и платёжные расходы учитывайте в допущениях."}
          </p>
          <p className="research-note">
            Налоги, общехозяйственные расходы и оборотный капитал здесь не
            учтены. Положительный вклад не равен чистой прибыли.
          </p>
        </div>
      </div>
    </div>
  );
}
