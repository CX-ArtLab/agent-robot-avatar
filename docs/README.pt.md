# Agent Robot Avatar

<p align="center">
  <img src="../assets/readme/agent-robot-avatar-header.jpg" alt="Agent Robot Avatar">
</p>

[English](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-CN.md) | [繁體中文](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.zh-TW.md) | [日本語](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.ko.md) | [Español](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.es.md) | [Português](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.de.md) | [Français](https://github.com/CX-ArtLab/agent-robot-avatar/blob/main/docs/README.fr.md)

![Versão](https://img.shields.io/badge/version-v0.2.1-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/agent-robot-avatar/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square) ![14 Agent States](https://img.shields.io/badge/Agent%20states-14-8B5CF6?style=flat-square) ![Pointer Following](https://img.shields.io/badge/Pointer-following-00A67E?style=flat-square) ![Jelly Drag](https://img.shields.io/badge/Drag-jelly%20physics-FF69B4?style=flat-square)

Um Web Component leve e expressivo de avatar robótico para agentes de IA e outras aplicações interativas.

É adequado para interfaces de assistentes e agentes de IA, incluindo produtos e experiências semelhantes a ChatGPT, Claude, Codex, Cursor, Grok Bot, Gemini CLI e OpenCode.

Também pode ser usado em desktop pets, pets virtuais, companheiros de desktop, mascotes digitais, avatares de chatbot e outras experiências com personagens interativos.

Agent Robot Avatar também pode funcionar como uma camada de feedback visual para interfaces de agentes no estilo AG-UI.

Agent Robot Avatar é construído com SVG e JavaScript puro, sem dependência de frameworks de animação de terceiros. Funciona como um Custom Element nativo e oferece uma API compacta para expressões, estados de interação, seguimento do ponteiro, feedback de espera e formato da cabeça.

**Versão pública atual: v0.2.1**

<p align="center">
  <img src="../assets/demo/agent-robot-avatar-demo.gif" alt="Demonstração animada interativa do Agent Robot Avatar" width="560">
</p>

## Demo ao vivo

Experimente a demo interativa: [Abrir Agent Robot Avatar](https://cx-artlab.github.io/agent-robot-avatar/?lang=pt)

## Principais recursos

- SVG + JavaScript puro
- Web Component nativo
- Sem dependências de frameworks de animação
- Piscar automático e movimento sutil do olhar
- Seguimento do ponteiro e movimento da cabeça com inércia
- Deformação local tipo gelatina ao arrastar e retorno elástico
- Estados e expressões de Agent controláveis por código
- Semântica separada para espera, falha, aviso, inspeção, bloqueio e erro de sistema
- Arredondamento da cabeça ajustável
- Antena flutuante com indicação piscante opcional
- Demo separado do componente reutilizável

## Início rápido

Ao usar diretamente o código do repositório, mantenha `agent-robot-avatar.js` junto com `src/` e carregue a entrada pública:

```html
<script type="module" src="./agent-robot-avatar.js"></script>
```

```html
<agent-robot-avatar id="avatar"></agent-robot-avatar>
```

O avatar entra automaticamente no estado idle. Um exemplo mínimo está em [`examples/basic.html`](../examples/basic.html).

## API básica

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

## Estados e expressões

| Estado | API | Uso |
| --- | --- | --- |
| Idle | `idle` | Estado normal de espera |
| Bored | `bored` | Longos períodos sem tarefa ativa |
| Waiting | `waiting` | Solicitação enviada, aguardando resultado |
| Input | `input` | Usuário digitando |
| Send | `send` | Envio / feedback de aceno |
| Success | `success` | Tarefa concluída com sucesso |
| Failure | `failure` | Tarefa concluída sem sucesso |
| Warning | `warning` | Ação arriscada ou destrutiva exige confirmação |
| Inspect | `inspect` | Revisar, conferir ou verificar um resultado |
| Blocked | `blocked` | Solicitação bloqueada ou impossibilitada de continuar |
| System error | `error` | Falha de conexão, serviço ou sistema |
| Surprise | `surprise` | Evento ou resultado inesperado |
| Sleep | `sleep` | Entrar em repouso |
| Wake | `wake` | Sair do repouso |

`failure` representa falha da própria tarefa; `error` é reservado para problemas de conexão, serviço ou sistema. `waiting` indica uma solicitação pendente e `bored` representa inatividade.

Aliases semânticos também estão disponíveis:

```js
avatar.play('failed');
avatar.play('fail');
avatar.play('verify');
avatar.play('review');
avatar.play('angry'); // mesma expressão visual de blocked
avatar.play('policy-blocked');
avatar.play('system-error');
avatar.play('connection-error');
```

## Espera contínua

```js
avatar.startWaiting();
// Pare quando a resposta ou resultado chegar.
avatar.stopWaiting();
```

Qualquer outra ação também interrompe o estado waiting ativo.

## Seguimento do ponteiro

```js
avatar.setPointerFollow(false);
avatar.setPointerFollow(true);
```

## Arredondamento da cabeça

```js
avatar.setHeadRoundness(0);   // mais quadrada
avatar.setHeadRoundness(50);  // padrão
avatar.setHeadRoundness(100); // mais arredondada

console.log(avatar.getHeadRoundness());
```

Os valores são limitados a `0–100`. Alterações emitem `head-roundness-change`.

```js
avatar.addEventListener('head-roundness-change', (event) => {
  console.log(event.detail.value);
});
```

## Evento de estado

Cada mudança visual emite `face-state`:

```js
avatar.addEventListener('face-state', (event) => {
  console.log(event.detail.state);
});
```

## Atributos

```html
<agent-robot-avatar
  size="160"
  color="#08090b"
  auto-sleep="30000">
</agent-robot-avatar>
```

| Atributo | Descrição |
| --- | --- |
| `size` | Tamanho do componente em pixels |
| `color` | Cor principal do avatar |
| `auto-sleep` | Tempo de inatividade antes de dormir, em ms; `0` desativa |

## Comportamento padrão

Sem chamadas explícitas à API, o avatar já oferece piscadas aleatórias, movimento sutil do olhar, seguimento do ponteiro próximo, movimento inercial da cabeça, retorno natural a idle e suspensão automática opcional.

## Interação por arraste

Ao arrastar, a cabeça se deforma localmente ao redor do ponto de interação, em vez de se mover como um corpo rígido.

- Puxão forte para fora: ativa `angry` após retornar
- Empurrão forte para o centro: ativa `success` após retornar
- Arraste pequeno: apenas deformação

## Demo interativo

`demo/index.html` inclui todos os estados públicos, seguimento do ponteiro, arraste tipo gelatina, ciclo de waiting, ajuste do arredondamento, controles de cor e comportamento e simulação de conversa com Agent. O JavaScript exclusivo do Demo fica isolado em `demo/` e não faz parte do runtime reutilizável do npm.

## Estrutura do projeto

```text
agent-robot-avatar.js     Entrada pública do componente
src/                      Runtime reutilizável e módulos de expressão
demo/                     Demo interativo e scripts exclusivos
examples/                 Exemplos mínimos de integração
assets/support/           Recursos QR de apoio / pagamento
docs/                     Documentação multilíngue
README.md                 Documento principal em inglês
CHANGELOG.md              Histórico público de versões
CONTRIBUTING.md           Guia de contribuição
package.json              Metadados do pacote
LICENSE                   Licença MIT
```

## Distribuição e compatibilidade

O pacote está publicado no npm como `agent-robot-avatar` e inclui declarações TypeScript para ações, eventos e métodos públicos. Destina-se a navegadores modernos com suporte a ES Modules, Custom Elements, SVG, Pointer Events e Web Animations API.

## Contribuição

Issues e Pull Requests são bem-vindos. Leia [`CONTRIBUTING.md`](../CONTRIBUTING.md) antes de enviar alterações.

## Status do projeto

v0.2.1 é a versão pública atual. v0.1.0 continua disponível como a primeira versão pública. A API pública é mantida deliberadamente pequena para evoluir com cuidado antes de um futuro compromisso de estabilidade `1.0.0`.

Agent Robot Avatar é um projeto independente de código aberto e não é afiliado, endossado nem representa nenhuma plataforma ou marca de IA.

## Licença

MIT License. Consulte [`LICENSE`](../LICENSE).

## Pague-me um café

Se este projeto for útil, você pode apoiá-lo pelo método mais conveniente:

| Ko-fi | Alipay | WeChat Pay |
| --- | --- | --- |
| <a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> | <img src="../assets/support/alipay.png" alt="QR code do Alipay" width="160"> | <img src="../assets/support/wechat-pay.png" alt="QR code do WeChat Pay" width="160"> |
