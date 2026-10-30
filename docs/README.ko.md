# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.7.1-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

AI Agent와 인터랙티브 애플리케이션을 위한 가볍고 표현력 있는 로봇 아바타 Web Component입니다.

AI 어시스턴트, Agent 인터페이스, 데스크톱 컴패니언, 가상 펫, 디지털 마스코트, 챗봇 아바타 등 다양한 인터랙티브 캐릭터 경험에 사용할 수 있습니다.

ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI, OpenCode와 유사한 제품 및 경험을 포함한 AI 어시스턴트와 Agent 인터페이스에 적합합니다.

SVG와 순수 JavaScript로 만들어졌으며 네이티브 Custom Element로 동작하고 런타임 의존성이 없습니다.

Agent Robot Avatar는 AG-UI 스타일 Agent 인터페이스를 위한 시각적 피드백 레이어로도 사용할 수 있습니다.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar 인터랙티브 애니메이션 데모" width="560">
</p>

## 라이브 데모

[인터랙티브 데모 열기](https://cx-artlab.github.io/agent-robot-avatar/?lang=ko) · [스킨 갤러리 둘러보기](https://cx-artlab.github.io/agent-robot-avatar/skins.html?lang=ko)

## 주요 특징

- 네이티브 Web Component
- SVG 렌더링 + 순수 JavaScript
- 런타임 의존성 0
- 자동 눈 깜빡임과 은은한 idle 동작
- 포인터를 따라가는 눈과 관성 있는 머리 움직임
- 젤리 스타일의 국소 드래그 변형과 탄성 복귀
- 길게 누르는 압축과 드래그 가능한 스프링 안테나
- 프로그램으로 제어할 수 있는 Agent 상태와 표정
- waiting, success, failure, affirm, wary, inspect, angry, refuse, love 등의 표정
- Reduced Motion 지원
- 설정 가능한 수면 동작
- 조절 가능한 머리 둥글기
- 17개 시리즈, 188가지 번호 스킨. 빛이 포인터를 따라갑니다
- 스킨을 뺀 경량판 제공
- TypeScript 선언 포함

## 설치

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

또는 [최신 릴리스](https://github.com/CX-ArtLab/agent-robot-avatar/releases/latest)에서 `agent-robot-avatar-x.y.z.zip`을 내려받으세요. 컴포넌트만 들어 있으며 스킨도 포함됩니다. 페이지 옆에 압축을 풀어 주세요.

```html
<script type="module" src="./agent-robot-avatar/agent-robot-avatar.js"></script>
```

그다음 컴포넌트를 추가합니다.

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

별도의 초기화 코드는 필요하지 않습니다. 아바타는 자동으로 기본 idle 상태로 들어갑니다.

### 경량판

스킨을 쓰지 않는 페이지라면 `agent-robot-avatar/lite`를 쓸 수 있습니다. 아바타와 모든 표정은 같고 스킨 코드만 빠져 있습니다:

```js
import 'agent-robot-avatar/lite';
```

경량판은 `skin` 속성을 무시하고, 스킨에는 전체판이 필요하다고 콘솔에 알려 줍니다.

## 기본 사용법

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('wary');
avatar.play('refuse');

avatar.reset();
```

사용 가능한 액션:

| 동작 | 모습 | 사용 상황 |
| --- | --- | --- |
| `idle` | 눈을 깜박이며 주변을 둘러봄 | 기본 상태 |
| `bored` | 천천히 양옆을 둘러봄 | 한동안 아무 일도 없을 때 |
| `waiting-spin` | 두 눈이 좌우로 회전 | 응답 대기 (기본) |
| `waiting-wrap` | 두 눈이 한쪽으로 나갔다 반대쪽으로 돌아옴 | 응답 대기 |
| `waiting-wave` | 두 눈이 번갈아 위아래로 출렁임 | 응답 대기 |
| `input` | 두 눈이 깜박이는 입력 커서가 됨 | 사용자가 입력 중 |
| `affirm` | 고개를 끄덕임 | 확인, 알겠음 |
| `success` | 기쁘게 웃는 눈 | 작업 완료 |
| `failure` | 고개와 눈이 처짐 | 작업 또는 연결 실패 |
| `wary` | 고개를 돌려 경계하며 위아래로 훑어봄 | 사용자 확인이 필요한 작업 |
| `inspect` | 눈을 가늘게 뜨고 위아래로 살핌 | 내용 확인·검토 |
| `angry` | 눈을 내리깔고 노려봄 | 콘텐츠가 차단됨 |
| `refuse` | 고개를 저음 | 할 수 없거나 하지 않을 요청 |
| `surprise` | 눈을 크게 뜸 | 예상 밖의 일 |
| `love` | 두 눈이 뛰는 하트로 합쳐짐 | 감사, 애정 |
| `random` | 두 눈이 슬롯머신 릴처럼 돌아감 | 무작위 선택, 장난스러운 순간 |
| `sleep` | 눈을 감고 잠듦 | 오랫동안 조작이 없을 때 |
| `wake` | 눈을 뜨고 깨어남 | 활동이 다시 시작될 때 |

대기 동작은 `play()`로 한 번 재생됩니다. `startWaiting({ variant: 'spin' | 'wrap' | 'wave' })`는 다른 동작을 재생하거나 `stopWaiting()`을 호출할 때까지 반복됩니다.

0.5의 이전 이름(`send`, `warning`, `error`, `blocked`, `slot` 등)은 1.0 전까지 계속 동작하지만 콘솔에 이름 변경 안내가 표시됩니다. [업그레이드 표](../CHANGELOG.md#upgrading-from-05x)를 참고하세요.

일반적인 Agent 요청 흐름:

```js
avatar.startWaiting();

// 두 번째 대기 동작: 눈이 한쪽으로 빠져나갔다가 반대쪽에서 돌아옵니다.
avatar.startWaiting({ variant: 'wrap' });

// 세 번째 대기 모션: 엇갈려 위아래로 움직이는 눈의 물결.
avatar.startWaiting({ variant: 'wave' });

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('failure');
}
```

## 자주 쓰는 옵션

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| 속성 | 용도 |
| --- | --- |
| `size` | 아바타 크기(px) |
| `color` | 아바타 기본 색상 |
| `auto-sleep` | 자동 수면까지의 유휴 시간; `0`이면 비활성화 |
| `wake-on` | 자동 깨우기 정책: `activity`, `interaction`, `manual` |
| `motion` | 모션 정책: `auto`, `reduce`, `full` |
| `press-squeeze` | 중앙을 길게 눌러 압축; `false`로 비활성화 |
| `antenna-drag` | 안테나 드래그, 스프링 복귀, 화난 반응; `false`로 비활성화 |
| `skin` | 스킨 번호(예: `301`). 생략하면 단색 |

자주 쓰는 런타임 제어:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

중앙을 길게 누르면 압축이 시작됩니다. 4 CSS 픽셀을 넘게 움직이면 같은 포인터 제스처가 기존 머리 드래그로 전환됩니다. 안테나는 머리 드래그와 같은 거리 제한을 사용하며 복귀 후 기존 화난 반응이 이어집니다.

## 스킨 · 0.7 새 기능

17개 시리즈, 188가지 스킨이 있으며 빛이 포인터를 따라갑니다. 모든 스킨에는 고정 번호가 있습니다. 시리즈 번호 뒤에 두 자리가 붙어 305는 3번 시리즈의 다섯 번째 스킨입니다. 이름은 바뀔 수 있지만 번호는 바뀌지 않고 다시 쓰이지 않습니다.

모든 스킨은 여전히 순수 SVG로 그려지며 이미지, Canvas, WebGL을 사용하지 않습니다. 전체 스킨을 합쳐도 네트워크 전송량은 약 70KB(압축 전 약 290KB)이며, 그 대부분은 페이지에서 스킨을 쓸 때만 불러옵니다.

<img src="../assets/readme/skin-gallery.jpg" alt="스킨 갤러리: 추천 스킨, 분류, 검색" width="100%">

```html
<agent-robot-avatar skin="301"></agent-robot-avatar>
```

```js
avatar.setSkin(102);  // '102'도 가능
avatar.setSkin(null); // 단색으로 돌아가기
```

모든 스킨과 번호는 [전체 스킨 페이지](https://cx-artlab.github.io/agent-robot-avatar/materials/?lang=ko)에서 볼 수 있습니다.

| 시리즈 | 번호 |
| --- | --- |
| 글레이즈 | 101–106 |
| 아이스 글라스 | 201–206 |
| 젤리곰 | 301–312 |
| 캔디 글라스 | 401–406 |
| 아크릴 | 501–512 |
| 젤리 | 601–612 |
| 그라데이션 | 701–712 |
| 반투명 유리 | 801–806 |
| 메탈 | 901–930 |
| 보석과 도자기 | 1001–1012 |
| 나무 | 1101–1106 |
| 공 | 1201–1210 |
| 투명·반짝임 | 1301–1305 |
| 패브릭과 가죽 | 1401–1412 |
| 디저트와 과일 | 1501–1512 |
| 자연 | 1601–1612 |
| 패턴과 테크 | 1701–1717 |

스킨 그리기 코드는 스킨을 처음 쓸 때 내려받으므로, 스킨을 쓰지 않는 페이지는 이를 불러오지 않습니다. `await loadSkins()`로 미리 불러올 수 있습니다. `SKINS`는 각 스킨의 중국어·영어 이름과 색상을, `SKIN_SERIES`는 시리즈를, `SKIN_NAMES`는 모든 번호를 제공합니다.

모든 표정과 제스처를 스킨과 함께 쓸 수 있습니다. 스킨을 제거하면 `color` 속성이 다시 적용됩니다.

## 이벤트와 통합

컴포넌트는 시각 상태 변경에 `face-state`, 의미 기반 액션 라이프사이클 변경에 `action-state`를 발생시킵니다.

호스트 애플리케이션 통합과 접근성 상태 텍스트에는 `action-state` 사용을 권장합니다. 실행 가능한 요청 라이프사이클 예시는 [`examples/accessibility.html`](../examples/accessibility.html)을 참고하세요.

최소 통합 예시는 [`examples/basic.html`](../examples/basic.html)에 있습니다.

## 호환성

ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver`, `matchMedia`를 지원하는 최신 브라우저를 대상으로 합니다.

자동 브라우저 테스트는 Chromium, Firefox, WebKit을 포함합니다.

## 하드웨어 표정 버전 (개발 중)

로봇과 개발 보드 화면에 아바타의 표정을 보여 주는 C++ 버전(눈만 그림)을 개발 중이며 아직 출시되지 않았습니다. [하드웨어 가이드](https://github.com/CX-ArtLab/agent-robot-avatar/tree/main/embedded)를 참고하세요.

## 기여

Issue와 Pull Request를 환영합니다. 변경 사항을 제출하기 전에 [`CONTRIBUTING.md`](../CONTRIBUTING.md)를 확인하세요.

## 프로젝트 상태

**현재 공개 버전: v0.7.1**

공개 API는 향후 `1.0.0` 안정성 약속을 향해 발전하는 동안 의도적으로 간결하게 유지합니다.

Agent Robot Avatar는 독립적으로 개발되며 어떤 AI 플랫폼이나 브랜드와도 제휴, 보증 또는 공식적인 관계가 없습니다.

## 캐릭터 디자인과 비주얼 아이덴티티

Agent Robot Avatar 캐릭터의 로봇 외형과 비주얼 아이덴티티는 CX ArtLab의 오리지널 디자인입니다.

MIT License는 소프트웨어와 소스 코드에 적용됩니다. 애플리케이션의 일부로 아바타를 사용·수정·배포할 수 있지만 Agent Robot Avatar의 이름, 캐릭터 정체성 또는 비주얼 아이덴티티의 소유권을 이전하지 않으며, 이를 다른 주체의 오리지널 캐릭터나 독립 브랜드로 표시할 권리를 부여하지 않습니다.

이 프로젝트에 언급된 제3자 제품명은 가능한 사용 사례를 설명하기 위한 것이며 제휴나 보증을 의미하지 않습니다.

## 라이선스

MIT License. 자세한 내용은 [`LICENSE`](../LICENSE)를 참고하세요.

---

이 프로젝트가 유용하다면 커피 한 잔을 사 주셔도 좋습니다.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
