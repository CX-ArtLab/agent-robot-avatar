# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

AI Agent와 인터랙티브 애플리케이션을 위한 가볍고 표정이 풍부한 로봇 아바타 Web Component입니다.

ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI, OpenCode와 유사한 제품을 포함해 AI 어시스턴트와 Agent 인터페이스에 사용할 수 있습니다.

데스크톱 펫, 가상 펫, 디지털 마스코트, 챗봇 아바타 등 다양한 인터랙티브 캐릭터 경험에도 활용할 수 있습니다.

AG-UI 스타일 Agent 인터페이스의 시각적 피드백 레이어로도 사용할 수 있습니다.

SVG와 순수 JavaScript로 만든 네이티브 커스텀 엘리먼트로, 런타임 의존성이 없습니다.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar interactive animation demo" width="560">
</p>

## 라이브 데모

[인터랙티브 데모 열기](https://cx-artlab.github.io/agent-robot-avatar/)

## 주요 특징

- 네이티브 Web Component
- SVG 렌더링 + 순수 JavaScript
- 런타임 의존성 없음
- 자동 눈 깜박임과 자연스러운 대기 동작
- 포인터를 따라 움직이는 눈과 관성에 따라 움직이는 머리
- 젤리 같은 드래그 변형과 탄성 복원
- 프로그래밍으로 제어하는 Agent 상태와 표정
- 대기, 성공, 실패, 경고, 검토, 차단 및 시스템 오류 피드백
- 동작 감소 설정 지원
- 수면 동작 설정 가능
- 머리의 둥근 정도 조절 가능
- 선택적으로 안테나 상태 점멸 사용
- TypeScript 타입 선언 포함

## 설치

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

저장소의 소스를 직접 불러올 수도 있습니다:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

그다음 컴포넌트를 추가합니다:

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

초기화 코드는 필요하지 않습니다. 아바타가 자동으로 기본 대기 동작을 시작합니다.

## 기본 사용법

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

사용 가능한 동작:

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure`는 작업이 완료됐지만 성공하지 못한 경우를, `error`는 연결·서비스·시스템 오류를 나타냅니다.

실제 Agent 요청 수명 주기의 사용 예:

```js
avatar.startWaiting();

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
}
```

## 주요 옵션

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| 속성 | 설명 |
| --- | --- |
| `size` | 아바타 크기(픽셀) |
| `color` | 아바타의 기본 색상 |
| `auto-sleep` | 자동 수면 전 유휴 시간. `0`이면 비활성화 |
| `wake-on` | 자동 깨우기 정책: `activity`, `interaction`, `manual` |
| `motion` | 동작 정책: `auto`, `reduce`, `full` |

자주 사용하는 런타임 제어:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## 이벤트 및 통합

컴포넌트는 시각적 상태 변경에 `face-state` 이벤트를, 의미 있는 동작 수명 주기 변경에 `action-state` 이벤트를 발생시킵니다.

호스트 앱 연동과 접근성 상태 문구에는 `action-state` 사용을 권장합니다. 실행 가능한 요청 수명 주기 예시는 [`examples/accessibility.html`](../examples/accessibility.html)을 참고하세요.

간단한 통합 예시는 [`examples/basic.html`](../examples/basic.html)에 있습니다.

## 호환성

ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver`, `matchMedia`를 지원하는 최신 브라우저를 대상으로 합니다.

자동 브라우저 테스트는 Chromium, Firefox, WebKit을 대상으로 합니다.

## 기여

Issue와 Pull Request를 환영합니다. 변경 사항을 제출하기 전에 [`CONTRIBUTING.md`](../CONTRIBUTING.md)를 읽어 주세요.

## 프로젝트 상태

**현재 공개 버전: v0.3.2**

향후 `1.0.0` 버전에서 안정성을 보장하기 전까지 공개 API는 의도적으로 간결하게 유지합니다.

Agent Robot Avatar는 독립적으로 개발되며 어떤 AI 플랫폼이나 브랜드와도 제휴하지 않고, 이를 대표하거나 공식 승인을 받은 프로젝트가 아닙니다.

## 캐릭터 디자인과 시각적 정체성

Agent Robot Avatar의 로봇 외형 및 시각적 정체성은 CX ArtLab의 독창적인 디자인입니다.

MIT License는 소프트웨어와 소스 코드에 적용됩니다. 애플리케이션에서 아바타를 사용·수정·배포할 수 있지만 Agent Robot Avatar의 이름, 캐릭터 정체성 또는 시각적 정체성에 대한 소유권은 이전되지 않으며, 이를 다른 당사자의 오리지널 캐릭터나 독립 브랜드로 소개할 권리를 부여하지 않습니다.

프로젝트에 언급된 제삼자 제품명은 가능한 사용 사례를 설명하기 위한 것이며 제휴나 승인을 의미하지 않습니다.

## 라이선스

MIT License. 자세한 내용은 [`LICENSE`](../LICENSE)를 참고하세요.

---

이 프로젝트가 도움이 되었다면 커피 한 잔으로 후원해 주세요.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
