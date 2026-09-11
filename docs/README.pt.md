# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.3.2-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square)

Um Web Component leve e expressivo de avatar robô para agentes de IA e aplicações interativas.

Pode ser usado em assistentes de IA, interfaces de agentes, companheiros de desktop, pets virtuais, mascotes digitais, avatares de chatbot e outras experiências com personagens interativos.

Construído com SVG e JavaScript nativo, funciona como um Custom Element e não possui dependências em tempo de execução.

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Demonstração animada interativa do Agent Robot Avatar" width="560">
</p>

## Demo ao vivo

[Abrir a demo interativa](https://cx-artlab.github.io/agent-robot-avatar/?lang=pt)

## Destaques

- Web Component nativo
- Renderização SVG + JavaScript nativo
- Zero dependências em tempo de execução
- Piscar automático e comportamento idle sutil
- Olhos que seguem o ponteiro e movimento inercial da cabeça
- Deformação local tipo gelatina ao arrastar, com recuperação elástica
- Estados e expressões do Agent controláveis por código
- Feedback para waiting, success, failure, warning, review, blocked e system error
- Suporte a movimento reduzido
- Comportamento de sono configurável
- Arredondamento da cabeça ajustável
- Pisca de status opcional na antena
- Declarações TypeScript incluídas

## Instalação

```bash
npm install agent-robot-avatar
```

```js
import 'agent-robot-avatar';
```

Também é possível carregar diretamente o código-fonte do repositório:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

Depois, adicione o componente:

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

Nenhum código de inicialização é necessário. O avatar entra automaticamente no estado idle padrão.

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

`failure` representa uma tarefa concluída sem sucesso; `error` é reservado para falhas de conexão, serviço ou sistema.

Um fluxo típico de solicitação de Agent:

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

| Atributo | Uso |
| --- | --- |
| `size` | Tamanho do avatar em pixels |
| `color` | Cor principal do avatar |
| `auto-sleep` | Tempo de inatividade antes do sono automático; `0` desativa |
| `wake-on` | Política de despertar automático: `activity`, `interaction` ou `manual` |
| `motion` | Política de movimento: `auto`, `reduce` ou `full` |

Controles comuns em tempo de execução:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setAntennaFlash(true);
```

## Eventos e integração

O componente emite `face-state` para mudanças de estado visual e `action-state` para mudanças semânticas no ciclo de vida das ações.

Para integrações com a aplicação host e textos de status acessíveis, prefira `action-state`. Veja [`examples/accessibility.html`](../examples/accessibility.html) para um exemplo executável do ciclo de vida de uma solicitação.

Um exemplo mínimo de integração está disponível em [`examples/basic.html`](../examples/basic.html).

## Compatibilidade

Projetado para navegadores modernos com suporte a ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` e `matchMedia`.

Os testes automatizados cobrem Chromium, Firefox e WebKit.

## Contribuindo

Issues e Pull Requests são bem-vindos. Consulte [`CONTRIBUTING.md`](../CONTRIBUTING.md) antes de enviar alterações.

## Status do projeto

**Versão pública atual: v0.3.2**

A API pública é mantida deliberadamente compacta enquanto o projeto evolui em direção a um futuro compromisso de estabilidade `1.0.0`.

Agent Robot Avatar é desenvolvido de forma independente e não é afiliado, endossado nem representa qualquer plataforma ou marca de IA.

## Design do personagem e identidade visual

O personagem Agent Robot Avatar, incluindo sua aparência robótica e identidade visual, é um design original da CX ArtLab.

A licença MIT se aplica ao software e ao código-fonte. Ela permite usar, modificar e distribuir o avatar como parte de aplicações, mas não transfere a propriedade do nome Agent Robot Avatar, da identidade do personagem ou de sua identidade visual, nem concede o direito de apresentá-los como personagem original ou marca independente de outra parte.

Os nomes de produtos de terceiros mencionados neste projeto servem apenas para descrever possíveis casos de uso e não indicam afiliação ou endosso.

## Licença

MIT License. Consulte [`LICENSE`](../LICENSE).

---

Se este projeto for útil para você, você pode me pagar um café.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>