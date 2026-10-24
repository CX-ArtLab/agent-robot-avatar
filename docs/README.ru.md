# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.6.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Лёгкий и выразительный Web Component с роботом-аватаром для AI-агентов и интерактивных приложений.

Его можно использовать в AI-ассистентах, интерфейсах агентов, настольных компаньонах, виртуальных питомцах, цифровых маскотах, аватарах чат-ботов и других интерактивных персонажах.

Подходит для интерфейсов AI-ассистентов и агентов, включая продукты и сценарии, похожие на ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI и OpenCode.

Компонент построен на SVG и vanilla JavaScript, работает как нативный Custom Element и не имеет runtime-зависимостей.

Agent Robot Avatar также можно использовать как слой визуальной обратной связи для интерфейсов агентов в стиле AG-UI.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Интерактивная анимационная демонстрация Agent Robot Avatar" width="560">
</p>

## Демонстрация в реальном времени

[Открыть интерактивную демонстрацию](https://cx-artlab.github.io/agent-robot-avatar/?lang=ru)

## Основные возможности

- Нативный Web Component
- SVG-рендеринг + vanilla JavaScript
- Ноль runtime-зависимостей
- Автоматическое моргание и лёгкое idle-поведение
- Следование глазами за указателем и инерционное движение головы
- Локальная jelly-деформация при перетаскивании с упругим возвратом
- Сжатие при удержании и перетаскиваемая пружинящая антенна
- Программное управление состояниями и выражениями Agent
- Выражения waiting, success, failure, affirm, wary, inspect, angry, refuse, love и другие
- Поддержка reduced motion
- Настраиваемое поведение сна
- Регулируемое скругление головы
- 42 скина-материала и узора со светом, следующим за указателем
- TypeScript-декларации включены

## Установка

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

Также можно напрямую загрузить исходный код из репозитория:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

Затем добавьте компонент:

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

Инициализация не требуется. Аватар автоматически переходит в стандартное состояние idle.

## Базовое использование

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('wary');
avatar.play('refuse');

avatar.reset();
```

Доступные действия:

| Действие | Как выглядит | Когда использовать |
| --- | --- | --- |
| `idle` | Моргает и оглядывается | Состояние по умолчанию |
| `bored` | Медленно смотрит то в одну, то в другую сторону | Давно ничего не происходит |
| `waiting-spin` | Глаза кружат из стороны в сторону | Ожидание ответа (по умолчанию) |
| `waiting-wrap` | Глаза уходят в одну сторону и возвращаются с другой | Ожидание ответа |
| `waiting-wave` | Глаза поочерёдно покачиваются вверх и вниз | Ожидание ответа |
| `input` | Глаза становятся мигающими курсорами | Пользователь печатает |
| `affirm` | Кивает | Понял, подтверждаю |
| `success` | Радостные улыбающиеся глаза | Задача выполнена |
| `failure` | Опускает голову и глаза | Сбой задачи или соединения |
| `wary` | Поворачивает голову и настороженно оглядывает сверху вниз | Действие требует подтверждения |
| `inspect` | Щурится и осматривает сверху вниз | Проверка или ревью |
| `angry` | Опущенные сердитые глаза | Контент заблокирован |
| `refuse` | Качает головой | Не может или не будет выполнять запрос |
| `surprise` | Широко открытые глаза | Что-то неожиданное |
| `love` | Глаза сливаются в бьющееся сердце | Благодарность, симпатия |
| `random` | Глаза крутятся, как барабаны игрового автомата | Случайный выбор, игривый момент |
| `sleep` | Закрывает глаза и спит | Долго нет активности |
| `wake` | Открывает глаза и просыпается | Активность возобновилась |

Действия ожидания проигрывают один цикл через `play()`. `startWaiting({ variant: 'spin' | 'wrap' | 'wave' })` повторяется, пока не начнётся другое действие или не будет вызван `stopWaiting()`.

Имена из 0.5 (`send`, `warning`, `error`, `blocked`, `slot` и другие) работают до 1.0 с уведомлением в консоли; см. [таблицу обновления](../CHANGELOG.md#upgrading-from-05x).

Типичный жизненный цикл запроса Agent:

```js
avatar.startWaiting();

// Второй вариант ожидания: глаза уходят с одной стороны и возвращаются с другой.
avatar.startWaiting({ variant: 'wrap' });

// Третий вариант ожидания: поочерёдные вертикальные волны глаз.
avatar.startWaiting({ variant: 'wave' });

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('failure');
}
```

## Часто используемые параметры

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| Атрибут | Назначение |
| --- | --- |
| `size` | Размер аватара в пикселях |
| `color` | Основной цвет аватара |
| `auto-sleep` | Время бездействия до автоматического сна; `0` отключает его |
| `wake-on` | Политика автоматического пробуждения: `activity`, `interaction` или `manual` |
| `motion` | Политика движения: `auto`, `reduce` или `full` |
| `press-squeeze` | Удержание центра для сжатия; `false` отключает жест |
| `antenna-drag` | Перетаскивание и пружинящий возврат антенны с сердитой реакцией; `false` отключает жест |
| `skin` | Материал: `obsidian`, `porcelain`, `gold` … (42); без атрибута — сплошной цвет |

Часто используемые runtime-настройки:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

Удержание центра запускает сжатие. После перемещения более чем на 4 CSS-пикселя тот же жест переходит в существующее перетаскивание головы. Для антенны действует тот же предел расстояния, а после возврата запускается существующая сердитая реакция.

## Скины

42 скина в пяти семействах, свет следует за указателем:

```html
<agent-robot-avatar skin="obsidian"></agent-robot-avatar>
```

```js
avatar.setSkin('porcelain'); // любое имя из списка
avatar.setSkin(null);        // вернуться к сплошному цвету
```

| Семейство | Скины |
| --- | --- |
| Стекло и камни | `obsidian`, `midnight`, `jade`, `amber`, `ruby`, `sapphire`, `emerald`, `neon` |
| Фарфор, пастель и глина | `porcelain`, `pearl`, `sakura`, `mint`, `lavender`, `lemon`, `sky`, `peach`, `terracotta` |
| Металл | `gold`, `silver`, `copper`, `titanium`, `rose-gold`, `graphite` |
| Градиенты | `aurora`, `ocean`, `forest`, `candy` |
| Узоры | `tartan`, `polka`, `terrazzo`, `marble`, `black-marble`, `wood`, `pixel`, `confetti`, `rainbow`, `denim`, `graph-paper`, `halftone`, `leaves`, `blossoms`, `brick` |

Экспорт `SKIN_NAMES` содержит все имена, например для меню выбора.

Все выражения и жесты работают со скином. Если убрать скин, снова применяется атрибут `color`.

## События и интеграция

Компонент отправляет `face-state` при изменениях визуального состояния и `action-state` при семантических изменениях жизненного цикла действий.

Для интеграции с host-приложением и доступного статусного текста предпочтительнее `action-state`. Рабочий пример жизненного цикла запроса находится в [`examples/accessibility.html`](../examples/accessibility.html).

Минимальный пример интеграции доступен в [`examples/basic.html`](../examples/basic.html).

## Совместимость

Рассчитан на современные браузеры с поддержкой ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` и `matchMedia`.

Автоматизированные тесты покрывают Chromium, Firefox и WebKit.

## Версия для устройств (в разработке)

Версия на C++, которая показывает выражения аватара на экранах роботов и отладочных плат (рисует только глаза), находится в разработке и пока не выпущена. См. [руководство по устройствам](https://github.com/CX-ArtLab/agent-robot-avatar/tree/main/embedded).

## Участие в разработке

Issues и Pull Requests приветствуются. Перед отправкой изменений прочитайте [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Статус проекта

**Текущая публичная версия: v0.6.0**

Публичный API намеренно остаётся компактным, пока проект развивается к будущему обязательству стабильности `1.0.0`.

Agent Robot Avatar разрабатывается независимо и не аффилирован, не одобрен и не представляет какую-либо AI-платформу или бренд.

## Дизайн персонажа и визуальная идентичность

Персонаж Agent Robot Avatar, включая внешний вид робота и визуальную идентичность, является оригинальной разработкой CX ArtLab.

MIT License применяется к программному обеспечению и исходному коду. Она разрешает использовать, изменять и распространять аватар как часть приложений, но не передаёт права собственности на название Agent Robot Avatar, идентичность персонажа или визуальную идентичность и не даёт права представлять их как оригинального персонажа или самостоятельный бренд другой стороны.

Названия сторонних продуктов, упомянутые в проекте, используются только для описания возможных сценариев применения и не означают аффилированность или одобрение.

## Лицензия

MIT License. См. [`LICENSE`](../LICENSE).

---

Если этот проект оказался полезен, вы можете угостить меня кофе.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
