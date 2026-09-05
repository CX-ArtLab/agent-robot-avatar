# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md)

![버전](https://img.shields.io/badge/version-v0.2.1-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square) ![14 Agent States](https://img.shields.io/badge/Agent%20states-14-8B5CF6?style=flat-square) ![Pointer Following](https://img.shields.io/badge/Pointer-following-00A67E?style=flat-square) ![Jelly Drag](https://img.shields.io/badge/Drag-jelly%20physics-FF69B4?style=flat-square)

AI 에이전트와 다양한 인터랙티브 애플리케이션에서 사용할 수 있는 가볍고 표현력 있는 로봇 아바타 Web Component입니다.

ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI, OpenCode와 유사한 제품과 경험을 포함해 AI 어시스턴트 및 Agent 인터페이스에 적합합니다.

데스크톱 펫, 가상 펫, 데스크톱 컴패니언, 디지털 마스코트, 챗봇 아바타 및 기타 인터랙티브 캐릭터 경험에도 사용할 수 있습니다.

Agent Robot Avatar는 AG-UI 스타일 Agent 인터페이스의 시각적 피드백 레이어로도 사용할 수 있습니다.

Agent Robot Avatar는 SVG와 Vanilla JavaScript로만 구성되어 있으며 타사 애니메이션 프레임워크에 의존하지 않습니다. 네이티브 Custom Element로 동작하고 표정, 상호작용 상태, 포인터 추적, 대기 피드백, 머리 형태를 제어하는 간결한 API를 제공합니다.

**현재 공개 버전: v0.2.1**

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar 인터랙티브 애니메이션 데모" width="560">
</p>

## 라이브 데모

인터랙티브 데모 체험: [Agent Robot Avatar 열기](https://cx-artlab.github.io/agent-robot-avatar/?lang=ko)

## 주요 특징

- 순수 SVG + Vanilla JavaScript
- 네이티브 Web Component
- 외부 애니메이션 프레임워크 의존성 없음
- 자동 깜빡임과 자연스러운 시선 이동
- 포인터 추적과 관성이 있는 머리 움직임
- 국소적인 젤리 스타일 드래그 변형과 탄성 복귀
- 프로그램으로 제어하는 Agent 상태와 표정
- waiting / failure / warning / inspect / blocked / system error 의미 구분
- 머리 둥글기 조절
- 선택적으로 상태 점멸이 가능한 플로팅 안테나
- Demo와 재사용 가능한 컴포넌트 런타임 분리

## 빠른 시작

저장소 소스를 직접 사용할 때는 루트의 `agent-robot-avatar.js`와 `src/` 디렉터리를 함께 유지하고 공개 엔트리를 불러옵니다.

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

컴포넌트는 로드 후 자동으로 기본 idle 상태에 들어갑니다. 최소 실행 예제는 [`examples/basic.html`](../examples/basic.html)에 있습니다.

## 기본 API

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('failure');
avatar.play('warning');
avatar.play('inspect');
avatar.play('blocked');
avatar.play('error');

avatar.reset();
```

## 상태와 표정

| 상태 | API 이름 | 용도 |
| --- | --- | --- |
| Idle | `idle` | 기본 대기 상태 |
| Bored | `bored` | 오랫동안 활성 작업이 없음 |
| Waiting | `waiting` | 요청을 보낸 뒤 결과를 기다림 |
| Input | `input` | 사용자가 입력 중 |
| Send | `send` | 전송 / 끄덕임 피드백 |
| Success | `success` | 작업 성공 |
| Failure | `failure` | 작업 결과 실패 |
| Warning | `warning` | 위험하거나 파괴적인 동작 확인 |
| Inspect | `inspect` | 결과 검토 / 확인 / 검증 |
| Blocked | `blocked` | 요청이 차단되거나 진행 불가 |
| System error | `error` | 연결, 서비스 또는 시스템 오류 |
| Surprise | `surprise` | 예상하지 못한 결과 |
| Sleep | `sleep` | 수면 상태 진입 |
| Wake | `wake` | 수면 상태에서 복귀 |

`failure`는 요청한 작업 자체의 실패를 의미하고, `error`는 연결·서비스·시스템 문제를 의미합니다. `waiting`은 진행 중인 요청을 기다리는 상태이며 `bored`는 활성 작업이 없는 상태입니다.

의미 기반 별칭도 지원합니다.

```js
avatar.play('failed');
avatar.play('fail');
avatar.play('verify');
avatar.play('review');
avatar.play('angry'); // blocked와 동일한 표정
avatar.play('policy-blocked');
avatar.play('system-error');
avatar.play('connection-error');
```

## 지속 대기

```js
avatar.startWaiting();
// 응답이나 결과를 받으면 중지합니다.
avatar.stopWaiting();
```

다른 액션을 재생해도 현재 waiting 상태가 종료됩니다.

## 포인터 추적

```js
avatar.setPointerFollow(false);
avatar.setPointerFollow(true);
```

## 머리 둥글기

```js
avatar.setHeadRoundness(0);   // 더 각진 형태
avatar.setHeadRoundness(50);  // 기본값
avatar.setHeadRoundness(100); // 더 둥근 형태

console.log(avatar.getHeadRoundness());
```

값은 `0–100` 범위로 제한됩니다. 변경 시 `head-roundness-change` 이벤트가 발생합니다.

```js
avatar.addEventListener('head-roundness-change', (event) => {
  console.log(event.detail.value);
});
```

## 상태 이벤트

시각 상태가 바뀔 때 `face-state` 이벤트가 발생합니다.

```js
avatar.addEventListener('face-state', (event) => {
  console.log(event.detail.state);
});
```

## 속성

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000">
</agent-robot-avatar>
```

| 속성 | 설명 |
| --- | --- |
| `size` | 컴포넌트 크기(px) |
| `color` | 아바타 기본 색상 |
| `auto-sleep` | 자동 수면까지의 유휴 시간(ms), `0`은 비활성화 |

## 기본 동작

별도 API 호출이 없어도 랜덤 깜빡임, 미세한 시선 이동, 가까운 포인터 추적, 가벼운 관성 움직임, 자연스러운 idle 복귀, 선택적 자동 수면이 동작합니다.

## 드래그 상호작용

드래그할 때 머리 전체가 단단한 물체처럼 이동하는 대신 입력 지점 주변이 국소적으로 변형됩니다.

- 강하게 바깥쪽으로 당김: 복귀 후 `angry`
- 강하게 중심으로 밀기: 복귀 후 `success`
- 작은 드래그: 변형만 적용

## 인터랙티브 Demo

`demo/index.html`에는 모든 공개 상태, 포인터 추적, 젤리 드래그, waiting 라이프사이클, 머리 둥글기 조절, 색상 / 동작 설정, Agent 대화 시뮬레이션이 포함됩니다. Demo 전용 JavaScript는 `demo/`에 분리되어 재사용 가능한 npm runtime에는 포함되지 않습니다.

## 프로젝트 구조

```text
agent-robot-avatar.js     공개 컴포넌트 엔트리
src/                      재사용 가능한 runtime 및 표정 모듈
demo/                     인터랙티브 Demo와 전용 스크립트
examples/                 최소 통합 예제
assets/support/           후원 / 결제 QR 자산
docs/                     다국어 문서
README.md                 영어 기본 문서
CHANGELOG.md              공개 릴리스 기록
CONTRIBUTING.md           기여 가이드
package.json              패키지 메타데이터
LICENSE                   MIT License
```

## 배포 및 호환성

패키지는 `agent-robot-avatar` 이름으로 npm에 공개되며 액션, 이벤트 및 공개 메서드에 대한 TypeScript 타입 선언을 포함합니다. ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API를 지원하는 최신 브라우저를 대상으로 합니다.

## 기여

Issue와 Pull Request를 환영합니다. 제출 전 [`CONTRIBUTING.md`](../CONTRIBUTING.md)를 확인해 주세요.

## 프로젝트 상태

v0.2.1은 현재 공개 버전입니다. v0.1.0은 첫 공개 버전으로 계속 제공됩니다. 향후 `1.0.0` 안정성 약속 이전에 신중하게 발전시킬 수 있도록 공개 API를 의도적으로 작게 유지하고 있습니다.

Agent Robot Avatar는 독립적으로 개발된 오픈 소스 프로젝트이며 특정 AI 플랫폼이나 브랜드와 제휴하거나 공식 승인을 받은 프로젝트가 아닙니다.

## License

MIT License. 자세한 내용은 [`LICENSE`](../LICENSE)를 참조하세요.

## 커피 한 잔으로 후원하기

프로젝트가 도움이 되었다면 편한 방법으로 후원할 수 있습니다.

| Ko-fi | Alipay | WeChat Pay |
| --- | --- | --- |
| <a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> | <img src="../assets/support/alipay.png" alt="Alipay QR code" width="160"> | <img src="../assets/support/wechat-pay.png" alt="WeChat Pay QR code" width="160"> |
