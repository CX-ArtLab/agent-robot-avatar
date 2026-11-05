# BoopFace

<p align="center">
  <img src="../assets/readme/boopface-header.jpg" alt="BoopFace: лёгкий выразительный компонент аватара-робота для ИИ-ботов, агентов и интерактивных приложений">
</p>

[English](https://github.com/CX-ArtLab/boopface/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.8.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square) ![Embedded](https://img.shields.io/badge/Embedded-ESP32%20%7C%20STM32%20%7C%20Pico-E7352C?style=flat-square&logo=espressif&logoColor=white)

BoopFace — лёгкий выразительный компонент аватара-робота для ИИ-ботов, агентов и интерактивных приложений. Думает, ждёт, готово или ошибка: каждое состояние агента можно показать выражением лица.

Подходит как лицо и индикатор состояния ИИ-ассистентов и агентов: чат-ассистентов вроде ChatGPT, Claude, Gemini, Grok и DeepSeek, агентов для программирования вроде Codex, Claude Code, Cursor, Gemini CLI и OpenCode, а также постоянно работающих агентов вроде Grok Bot, ChatGPT dots, Meta Muse, OpenClaw и Hermes Agent.

Также подходит для настольных компаньонов, виртуальных питомцев, цифровых маскотов, аватаров чат-ботов и других интерактивных персонажей или как слой визуальной обратной связи для интерфейсов агентов в стиле AG-UI.

Построен на SVG и чистом JavaScript: это нативный Web Component без зависимостей во время выполнения, под лицензией MIT. 188 [скинов](#скины--новое-в-07) можно надеть в любой момент.

<p align="center">
  <img src="../assets/demo/boopface-demo.gif" alt="Интерактивная анимационная демонстрация BoopFace" width="560">
</p>

## Новое: [BoopFace Embedded](#boopface-embedded)

<p align="center">
  <a href="#boopface-embedded"><img src="../assets/readme/boopface-embedded.jpg" alt="Те же выражения глаз на экранах ESP32, STM32 и Raspberry Pi Pico или в других программах C++. Примеры прошивок для 28 конфигураций и симулятор с экспортом настроек."></a>
</p>

Те же выражения глаз на экранах ESP32, STM32 и Raspberry Pi Pico или в других программах C++. Примеры прошивок для 28 конфигураций и симулятор с экспортом настроек.

## Демонстрация в реальном времени

[Открыть интерактивную демонстрацию](https://cx-artlab.github.io/boopface/?lang=ru) · [Открыть галерею скинов](https://cx-artlab.github.io/boopface/skins.html?lang=ru)

[Открыть симулятор устройств](https://cx-artlab.github.io/boopface/hardware/?lang=ru)

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
- 188 пронумерованных скинов в 17 сериях, свет следует за указателем
- Облегчённая версия без скинов для самых лёгких страниц
- TypeScript-декларации включены

## Установка

```bash
npm install boopface
```

```js
import 'boopface';
```

Или скачайте `boopface-x.y.z.zip` из [последнего релиза](https://github.com/CX-ArtLab/boopface/releases/latest). В нём только компонент, вместе со скинами. Распакуйте его рядом со страницей:

```html
<script type="module" src="./boopface/boopface.js"></script>
```

Затем добавьте компонент:

```html
<boop-face id="avatar"></boop-face>
```

Инициализация не требуется. Аватар автоматически переходит в стандартное состояние idle.

### Переход с Agent Robot Avatar

До версии 0.8 BoopFace назывался Agent Robot Avatar. Возможности и использование не изменились. Чтобы обновиться, замените имя пакета на `boopface`:

```bash
npm uninstall agent-robot-avatar
npm install boopface
```

Старый тег `<agent-robot-avatar>` работает до версии 1.0, так что менять страницы срочно не нужно. Старый npm-пакет `agent-robot-avatar` больше не обновляется; новые версии публикуются только как `boopface`.

### Облегчённая версия

Для страниц без скинов есть `boopface/lite` — тот же аватар без кода скинов:

```js
import 'boopface/lite';
```

Облегчённая версия игнорирует атрибут `skin` и сообщает в консоли, что для скинов нужна полная версия.

Сравнение размеров (передача по сети, со сжатием gzip):

| Версия | Размер |
| --- | --- |
| Облегчённая `boopface/lite` | около 45 КБ |
| Полная, страница не использует скины | около 56 КБ; код отрисовки скинов не загружается |
| Полная, со скинами | около 113 КБ; дополнительная часть загружается при первом использовании скина |

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
<boop-face
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</boop-face>
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
| `skin` | Номер скина, например `301`; без атрибута — сплошной цвет |

Часто используемые runtime-настройки:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

Удержание центра запускает сжатие. После перемещения более чем на 4 CSS-пикселя тот же жест переходит в существующее перетаскивание головы. Для антенны действует тот же предел расстояния, а после возврата запускается существующая сердитая реакция.

## Скины · Новое в 0.7

188 скинов в 17 сериях, свет следует за указателем. У каждого скина постоянный номер: номер серии и две цифры, то есть 305 — пятый скин серии 3. Названия могут меняться, номера — никогда, и повторно они не используются.

Все скины по-прежнему чистый SVG: без изображений, canvas и WebGL. Все скины вместе занимают около 70 КБ при передаче по сети (около 290 КБ без сжатия), и бо́льшая часть загружается, только когда странице нужен скин. Для сравнения: сам аватар (облегчённая сборка lite, без скинов) весит около 45 КБ.

<img src="../assets/readme/skin-gallery.jpg" alt="Галерея скинов: подборка, фильтры и поиск" width="100%">

```html
<boop-face skin="301"></boop-face>
```

```js
avatar.setSkin(102);  // или '102'
avatar.setSkin(null); // вернуться к сплошному цвету
```

Все скины с номерами — на [странице со всеми скинами](https://cx-artlab.github.io/boopface/materials/?lang=ru).

| Серия | Номера | Серия | Номера | Серия | Номера |
| --- | --- | --- | --- | --- | --- |
| Глазурь | 101–106 | Ледяное стекло | 201–206 | Мармелад | 301–312 |
| Карамельное стекло | 401–406 | Акрил | 501–512 | Желе | 601–612 |
| Градиент | 701–712 | Матовое стекло | 801–806 | Металл | 901–930 |
| Камни и керамика | 1001–1012 | Дерево | 1101–1106 | Мячи | 1201–1210 |
| Прозрачность и блеск | 1301–1305 | Ткань и кожа | 1401–1412 | Сладости и фрукты | 1501–1512 |
| Природа | 1601–1612 | Узоры и техника | 1701–1717 |  |  |

Код, рисующий скины, загружается при первом использовании скина, поэтому страница без скинов его не загружает. `await loadSkins()` загружает его заранее. `SKINS` содержит китайские и английские названия и цвета каждого скина, `SKIN_SERIES` — серии, `SKIN_NAMES` — все номера.

Все выражения и жесты работают со скином. Если убрать скин, снова применяется атрибут `color`.

## События и интеграция

Компонент отправляет `face-state` при изменениях визуального состояния и `action-state` при семантических изменениях жизненного цикла действий.

Для интеграции с host-приложением и доступного статусного текста предпочтительнее `action-state`. Рабочий пример жизненного цикла запроса находится в [`examples/accessibility.html`](../examples/accessibility.html).

Минимальный пример интеграции доступен в [`examples/basic.html`](../examples/basic.html).

## Совместимость

Рассчитан на современные браузеры с поддержкой ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` и `matchMedia`.

Автоматизированные тесты покрывают Chromium, Firefox и WebKit.

<a id="boopface-embedded"></a>

## Новое: BoopFace Embedded

Выражения глаз из веб-версии теперь работают на экранах роботов и плат. Небольшой движок C++11 сохраняет движения и ритм. Примеры охватывают 28 конфигураций ESP32, ESP32-S3, STM32 и Raspberry Pi Pico: круглые и прямоугольные TFT, узкие дисплеи, AMOLED и монохромные OLED. Поддерживаются свои размеры экрана.

| Ваше устройство | Что использовать |
| --- | --- |
| Сайты, приложения, Android-планшеты, роботы с браузером | Веб-компонент: полный аватар, скины и взаимодействия |
| ESP32, STM32, Raspberry Pi Pico | Встраиваемый движок с примерами прошивок |
| Другие микроконтроллеры или программы C++ | Библиотека C++; подключите свой драйвер экрана |


<img src="../assets/readme/hardware-preview.jpg" alt="Симулятор: выражения на круглом TFT, расположение, цвета и экспорт" width="100%">

**Попробуйте без платы.** [Симулятор](https://cx-artlab.github.io/boopface/hardware/?lang=ru) запускает тот же движок C++ в браузере на 32 виртуальных экранах. Он помогает оценить результат и сравнить модули.

**Настройте, экспортируйте, соберите.** Выберите экран, расположение, цвета и частоту кадров, затем **Экспорт настроек**. Сохраните `eyes_settings.h` рядом с `main.cpp` примера и соберите прошивку. См. [инструкцию](../embedded/README.md). Интерфейс и экспортированные комментарии следуют выбранному языку.

**Установка из ZIP.** Скачайте `BoopFace-Embedded-0.1.0.zip` из [встраиваемого релиза](https://github.com/CX-ArtLab/boopface/releases/tag/eyes-v0.1.0) и добавьте через **Скетч → Подключить библиотеку → Добавить .ZIP-библиотеку** в Arduino IDE. Индексация в Arduino Library Manager ещё ожидается; пока используйте ZIP или исходники. Для [PlatformIO](https://registry.platformio.org/libraries/cxlab/BoopFace) добавьте эту зависимость в окружение в `platformio.ini`:

```ini
lib_deps = cxlab/BoopFace@^0.1.0
```

**В своей программе** запускайте выражения по имени:

```cpp
#include <BoopFace.h>
boopface::Eyes eyes;
uint8_t pixels[4800]; // 240 x 160, 1 bit per pixel

void setup() {
  boopface::EyesConfig config;
  eyes.begin(config, pixels, sizeof pixels, millis());
}

void loop() {
  if (eyes.update(millis())) {
    // Send eyes.data() to the display driver.
  }
}

// When needed: eyes.play("success", millis());
```

Экспериментальная версия: все конфигурации собираются в CI, но ещё не проверены на реальных устройствах. После проверки отправьте [отчёт](https://github.com/CX-ArtLab/boopface/issues/new?template=hardware_report.yml). API и подключение описаны в [руководстве](../embedded/README.md).

## Участие в разработке

Issues и Pull Requests приветствуются. Перед отправкой изменений прочитайте [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Статус проекта

**Текущая публичная версия: v0.8.0**\
BoopFace Embedded: v0.1.0 (экспериментальная)

Публичный API намеренно остаётся компактным, пока проект развивается к будущему обязательству стабильности `1.0.0`.

BoopFace разрабатывается независимо и не аффилирован, не одобрен и не представляет какую-либо AI-платформу или бренд.

## Дизайн персонажа и визуальная идентичность

Персонаж BoopFace, включая внешний вид робота и визуальную идентичность, является оригинальной разработкой CX ArtLab.

MIT License применяется к программному обеспечению и исходному коду. Она разрешает использовать, изменять и распространять аватар как часть приложений, но не передаёт права собственности на название BoopFace, идентичность персонажа или визуальную идентичность и не даёт права представлять их как оригинального персонажа или самостоятельный бренд другой стороны.

Названия сторонних продуктов, упомянутые в проекте, используются только для описания возможных сценариев применения и не означают аффилированность или одобрение.

## Лицензия

MIT License. См. [`LICENSE`](../LICENSE).

---

Если этот проект оказался полезен, вы можете угостить меня кофе.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
