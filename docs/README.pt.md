# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Um Web Component leve e expressivo com um avatar de robô para agentes de IA e aplicações interativas.

Ideal para interfaces de assistentes de IA e agentes, incluindo produtos e experiências semelhantes a ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI e OpenCode.

Também pode ser usado como bichinho de estimação de desktop, companheiro virtual, mascote digital, avatar de chatbot e outros personagens interativos.

O Agent Robot Avatar também pode servir como camada de feedback visual em interfaces de agentes no estilo AG-UI.

Criado com SVG e JavaScript puro, funciona como um elemento personalizado nativo sem dependências em tempo de execução.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Agent Robot Avatar interactive animation demo" width="560">
</p>

## Demonstração interativa

[Abrir a demonstração interativa](https://cx-artlab.github.io/agent-robot-avatar/)

## Destaques

- Web Component nativo
- Renderização SVG e JavaScript puro
- Sem dependências em tempo de execução
- Piscar automático e movimentos sutis em repouso
- Olhos que acompanham o ponteiro e movimentos de cabeça com inércia
- Deformação flexível ao arrastar, com recuperação elástica
- Estados e expressões de Agent controlados por código
- Feedback visual de espera, sucesso, falha, aviso, revisão, bloqueio e erro do sistema
- Suporte à redução de movimento
- Comportamento de sono configurável
- Arredondamento da cabeça ajustável
- Piscar opcional da antena para indicar estados
- Declarações de tipos TypeScript incluídas

## Instalação

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

Como alternativa, carregue diretamente o código-fonte do repositório:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

Depois, adicione o componente:

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

Não é necessário código de inicialização. O avatar inicia automaticamente seu comportamento padrão de repouso.

## Uso básico

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('warning');
avatar.play('error');

avatar.reset();
```

Ações disponíveis:

`idle` · `bored` · `waiting` · `input` · `send` · `success` · `failure` · `warning` · `inspect` · `blocked` · `error` · `surprise` · `sleep` · `wake`

`failure` indica uma tarefa concluída sem sucesso; `error` indica falhas de conexão, serviço ou sistema.

Exemplo de ciclo de vida de uma solicitação real de Agent:

```js
avatar.startWaiting();

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('error');
}
```

## Opções comuns

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</agent-robot-avatar>
```

| Atributo | Finalidade |
| --- | --- |
| `size` | Tamanho do avatar em pixels |
| `color` | Cor principal do avatar |
| `auto-sleep` | Tempo ocioso antes do sono automático; `0` desativa |
| `wake-on` | Política de despertar automático: `activity`, `interaction` ou `manual` |
| `motion` | Política de movimento: `auto`, `reduce` ou `full` |

Controles comuns em tempo de execução:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## Eventos e integração

O componente emite `face-state` quando o estado visual muda e `action-state` quando há mudanças semânticas no ciclo de vida de uma ação.

Para integração com o aplicativo hospedeiro e textos de status acessíveis, prefira `action-state`. Veja um exemplo executável do ciclo de vida de uma solicitação em [`examples/accessibility.html`](../examples/accessibility.html).

Um exemplo mínimo de integração está disponível em [`examples/basic.html`](../examples/basic.html).

## Compatibilidade

Projetado para navegadores modernos com suporte a ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` e `matchMedia`.

Os testes automatizados de navegador abrangem Chromium, Firefox e WebKit.

## Como contribuir

Issues e pull requests são bem-vindos. Leia [`CONTRIBUTING.md`](../CONTRIBUTING.md) antes de enviar alterações.

## Status do projeto

**Versão pública atual: v0.3.2**

A API pública permanece intencionalmente compacta enquanto o projeto evolui para uma futura garantia de estabilidade em `1.0.0`.

Agent Robot Avatar é desenvolvido de forma independente e não possui afiliação, endosso ou representação oficial de qualquer plataforma ou marca de IA.

## Design do personagem e identidade visual

O personagem Agent Robot Avatar, incluindo sua aparência robótica e identidade visual, é uma criação original da CX ArtLab.

A licença MIT se aplica ao software e ao código-fonte. Ela permite utilizar, modificar e distribuir o avatar como parte de aplicações, mas não transfere a propriedade do nome Agent Robot Avatar, da identidade do personagem ou de sua identidade visual, nem concede o direito de apresentá-los como personagem original ou marca independente de terceiros.

Os nomes de produtos de terceiros mencionados no projeto ilustram apenas possíveis casos de uso e não indicam afiliação ou endosso.

## Licença

Licença MIT. Consulte [`LICENSE`](../LICENSE).

---

Se este projeto for útil para você, pode me pagar um café.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
