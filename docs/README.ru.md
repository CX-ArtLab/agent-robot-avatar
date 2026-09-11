# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Лёгкий и выразительный Web Component с роботом-аватаром для AI-агентов и интерактивных приложений.

Его можно использовать в AI-ассистентах, интерфейсах агентов, настольных компаньонах, виртуальных питомцах, цифровых маскотах, аватарах чат-ботов и других интерактивных персонажах.

Компонент построен на SVG и vanilla JavaScript, работает как нативный Custom Element и не имеет runtime-зависимостей.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Интерактивная анимационная демонстрация Agent Robot Avatar" width="560">
</p>

## Live Demo

[Открыть интерактивную демонстрацию](https://cx-artlab.github.io/agent-robot-avatar/?lang=en)

## Основные возможности

- Нативный Web Component
- SVG-рендеринг + vanilla JavaScript
- Ноль runtime-зависимостей
- Автоматическое моргание и лёгкое idle-поведение
- Следование глазами за указателем и инерционное движение головы
- Локальная jelly-деформация при перетаскивании с упругим возвратом
- Программное управление состояниями и выражениями Agent
- Обратная связь для waiting, success, failure, warning, review, blocked и system error
- Поддержка reduced motion
- Настраиваемое поведение сна
- Регулируемое скругление головы
- Опциональное мигание антенны для статуса
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
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

Доступные действия:

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure` означает, что задача завершилась неуспешно; `error` предназначен для ошибок соединения, сервиса или системы.

Типичный жизненный цикл запроса Agent:

```js
avatar.startWaiting();

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
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

Часто используемые runtime-настройки:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## События и интеграция

Компонент отправляет `face-state` при изменениях визуального состояния и `action-state` при семантических изменениях жизненного цикла действий.

Для интеграции с host-приложением и доступного статусного текста предпочтительнее `action-state`. Рабочий пример жизненного цикла запроса находится в [`examples/accessibility.html`](../examples/accessibility.html).

Минимальный пример интеграции доступен в [`examples/basic.html`](../examples/basic.html).

## Совместимость

Рассчитан на современные браузеры с поддержкой ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` и `matchMedia`.

Автоматизированные тесты покрывают Chromium, Firefox и WebKit.

## Участие в разработке

Issues и Pull Requests приветствуются. Перед отправкой изменений прочитайте [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Статус проекта

**Текущая публичная версия: v0.3.2**

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