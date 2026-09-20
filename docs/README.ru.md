# Agent Robot Avatar

<p align="center">
  <img src="./assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](./LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Лёгкий и выразительный Web Component с аватаром робота для ИИ-агентов и интерактивных приложений.

Подходит для интерфейсов ИИ-помощников и агентов, включая продукты и сценарии, похожие на ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI и OpenCode.

Также подходит для настольных и виртуальных питомцев, цифровых компаньонов, талисманов, аватаров чат-ботов и других интерактивных персонажей.

Agent Robot Avatar можно использовать как слой визуальной обратной связи в интерфейсах агентов в стиле AG-UI.

Компонент создан на SVG и обычном JavaScript, работает как нативный пользовательский элемент и не имеет зависимостей во время выполнения.

<p align="center">
  <img src="./assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar interactive animation demo" width="560">
</p>

## Интерактивная демонстрация

[Открыть интерактивную демонстрацию](https://cx-artlab.github.io/agent-robot-avatar/)

## Основные возможности

- Нативный Web Component
- SVG-рендеринг и обычный JavaScript
- Нет зависимостей во время выполнения
- Автоматическое моргание и ненавязчивые движения в режиме ожидания
- Глаза следят за указателем, движения головы имеют инерцию
- Мягкая деформация при перетаскивании с упругим восстановлением
- Программное управление состояниями и выражениями Agent
- Визуальная обратная связь для ожидания, успеха, неудачи, предупреждения, проверки, блокировки и системной ошибки
- Поддержка уменьшенной анимации
- Настраиваемое поведение сна
- Регулируемая округлость головы
- Дополнительное мигание антенны для индикации состояния
- Включены объявления типов TypeScript

## Установка

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

Можно также загрузить исходный код непосредственно из репозитория:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

Затем добавьте компонент:

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

Код инициализации не требуется: аватар автоматически переходит в режим ожидания по умолчанию.

## Основное использование

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

Доступные действия:

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure` означает, что задача завершилась неудачей, а `error` — сбой соединения, службы или системы.

Пример реального жизненного цикла запроса к Agent:

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
| `auto-sleep` | Время простоя до автоматического сна; `0` отключает его |
| `wake-on` | Политика автоматического пробуждения: `activity`, `interaction` или `manual` |
| `motion` | Режим анимации: `auto`, `reduce` или `full` |

Часто используемые методы управления:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## События и интеграция

Компонент отправляет событие `face-state` при изменении визуального состояния и `action-state` при семантических изменениях жизненного цикла действия.

Для интеграции с основным приложением и доступного текста состояния предпочтительно использовать `action-state`. Исполняемый пример жизненного цикла запроса доступен в [`examples/accessibility.html`](../examples/accessibility.html).

Минимальный пример интеграции находится в [`examples/basic.html`](../examples/basic.html).

## Совместимость

Предназначен для современных браузеров с поддержкой ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` и `matchMedia`.

Автоматизированные браузерные тесты охватывают Chromium, Firefox и WebKit.

## Участие в разработке

Приветствуются Issues и Pull Requests. Перед отправкой изменений ознакомьтесь с [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Состояние проекта

**Текущая публичная версия: v0.3.2**

Публичный API намеренно остаётся компактным, пока проект движется к обязательству стабильности в будущей версии `1.0.0`.

Agent Robot Avatar разрабатывается независимо и не связан ни с какой ИИ-платформой или брендом, не представляет их и не пользуется их официальной поддержкой.

## Дизайн персонажа и визуальная идентичность

Персонаж Agent Robot Avatar, включая его внешний вид и визуальную идентичность, — оригинальная разработка CX ArtLab.

Лицензия MIT распространяется на программное обеспечение и исходный код. Она разрешает использовать, изменять и распространять аватар в составе приложений, но не передаёт право собственности на название Agent Robot Avatar, идентичность персонажа или его визуальную идентичность и не даёт права представлять их как оригинального персонажа или самостоятельный бренд другой стороны.

Названия сторонних продуктов упоминаются только для иллюстрации возможных сценариев использования и не означают сотрудничества или одобрения.

## Лицензия

Лицензия MIT. См. [`LICENSE`](../LICENSE).

---

Если этот проект оказался полезным, вы можете угостить меня кофе.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
