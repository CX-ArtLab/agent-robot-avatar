# BoopFace

<p align="center">
  <img src="../assets/readme/boopface-header.jpg" alt="BoopFace: um componente de avatar robô leve e expressivo para bots de IA, agentes e apps interativos">
</p>

**Site oficial: [boopface.com](https://boopface.com/)**

[English](https://github.com/CX-ArtLab/boopface/blob/main/README.md) | [简体中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-CN.md) | [Español](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.es.md) | [Русский](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ru.md) | [Français](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.fr.md) | [Português](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.pt.md) | [Deutsch](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.de.md) | [日本語](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ja.md) | [한국어](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.ko.md) | [繁體中文](https://github.com/CX-ArtLab/boopface/blob/main/docs/README.zh-TW.md)

![Version](https://img.shields.io/badge/version-v0.8.0-111111?style=flat-square) [![License](https://img.shields.io/badge/license-MIT-0A7EA4?style=flat-square)](../LICENSE) [![CI](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/CX-ArtLab/boopface/actions/workflows/validate.yml) [![Ko-fi](https://img.shields.io/badge/Ko--fi-Support-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/P0E625WIOI)

![Vanilla JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000) ![Web Component](https://img.shields.io/badge/Web-Native%20Component-5A67D8?style=flat-square) ![SVG](https://img.shields.io/badge/Rendering-SVG-FFB13B?style=flat-square&logo=svg&logoColor=000) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-2EA44F?style=flat-square) ![Embedded](https://img.shields.io/badge/Embedded-ESP32%20%7C%20STM32%20%7C%20Pico-E7352C?style=flat-square&logo=espressif&logoColor=white)

BoopFace é um componente de avatar robô leve e expressivo para bots de IA, agentes e apps interativos. Pensando, esperando, concluído ou com erro: cada estado de um agente pode ser mostrado com uma expressão.

Use-o como rosto e feedback de status de assistentes e agentes de IA: assistentes de chat como ChatGPT, Claude, Gemini, Grok e DeepSeek, agentes de programação como Codex, Claude Code, Cursor, Gemini CLI e OpenCode, e agentes sempre ativos como Grok Bot, ChatGPT dots, Meta Muse, OpenClaw e Hermes Agent.

Também serve para companheiros de desktop, pets virtuais, mascotes digitais, avatares de chatbot e outros personagens interativos, ou como camada de feedback visual para interfaces de agentes no estilo AG-UI.

Feito com SVG e JavaScript puro, é um Web Component nativo sem dependências em tempo de execução, com licença MIT. São 188 [skins](#skins--novidade-na-07) prontas para usar a qualquer momento.

<p align="center">
  <img src="../assets/demo/boopface-demo.gif" alt="Demonstração animada interativa do BoopFace" width="560">
</p>

## Novo: [BoopFace Embedded](#boopface-embedded)

<p align="center">
  <a href="#boopface-embedded"><img src="../assets/readme/boopface-embedded.jpg" alt="As mesmas expressões nas telas ESP32, STM32 e Raspberry Pi Pico, ou em outros programas C++. Inclui exemplos de firmware para 28 configurações e simulador com exportação de ajustes."></a>
</p>

As mesmas expressões nas telas ESP32, STM32 e Raspberry Pi Pico, ou em outros programas C++. Inclui exemplos de firmware para 28 configurações e simulador com exportação de ajustes.

## Demo ao vivo

[Abrir a demo interativa](https://cx-artlab.github.io/BoopFace/?lang=pt) · [Visite a galeria de skins](https://cx-artlab.github.io/BoopFace/skins.html?lang=pt)

[Abrir o simulador embarcado](https://cx-artlab.github.io/BoopFace/hardware/?lang=pt)

## Destaques

- Web Component nativo
- Renderização SVG + JavaScript nativo
- Zero dependências em tempo de execução
- Piscar automático e comportamento idle sutil
- Olhos que seguem o ponteiro e movimento inercial da cabeça
- Deformação local tipo gelatina ao arrastar, com recuperação elástica
- Compressão ao manter pressionado e antena elástica arrastável
- Estados e expressões do Agent controláveis por código
- Expressões para waiting, success, failure, affirm, wary, inspect, angry, refuse, love e mais
- Suporte a movimento reduzido
- Comportamento de sono configurável
- Arredondamento da cabeça ajustável
- 188 skins numerados em 17 séries, com luz que segue o ponteiro
- Versão leve sem skins para as páginas mais enxutas
- Declarações TypeScript incluídas

## Instalação

```bash
npm install boopface
```

```js
import 'boopface';
```

Ou baixe `boopface-x.y.z.zip` da [versão mais recente](https://github.com/CX-ArtLab/boopface/releases/latest). Ele contém só o componente, com as skins. Descompacte-o ao lado da sua página:

```html
<script type="module" src="./boopface/boopface.js"></script>
```

Depois, adicione o componente:

```html
<boop-face id="avatar"></boop-face>
```

Nenhum código de inicialização é necessário. O avatar entra automaticamente no estado idle padrão.

### Atualizando a partir do Agent Robot Avatar

Antes da versão 0.8, o BoopFace se chamava Agent Robot Avatar. Os recursos e o uso não mudam. Para atualizar, basta trocar o nome do pacote para `boopface`:

```bash
npm uninstall agent-robot-avatar
npm install boopface
```

A tag antiga `<agent-robot-avatar>` continua funcionando até a 1.0, então não há pressa para mudar suas páginas. O pacote npm antigo `agent-robot-avatar` não recebe mais atualizações; as novas versões são publicadas apenas como `boopface`.

### Versão leve

Para páginas que nunca usam skins, `boopface/lite` é o mesmo avatar sem o código dos skins:

```js
import 'boopface/lite';
```

A versão leve ignora o atributo `skin` e avisa no console que os skins precisam da versão completa.

Comparação de tamanho (transferência pela rede, com compressão gzip):

| Versão | Tamanho |
| --- | --- |
| Leve `boopface/lite` | cerca de 45 KB |
| Completa, a página não usa skins | cerca de 56 KB; o código que desenha as skins não é baixado |
| Completa, com skins | cerca de 113 KB; a parte extra só é baixada na primeira vez que uma skin é usada |

## Uso básico

```js
const avatar = document.querySelector('#avatar');

avatar.play('success');
avatar.play('wary');
avatar.play('refuse');

avatar.reset();
```

Ações disponíveis:

| Ação | Aparência | Quando usar |
| --- | --- | --- |
| `idle` | Pisca e olha ao redor | Estado padrão |
| `bored` | Olha devagar para um lado e para o outro | Nada aconteceu por um tempo |
| `waiting-spin` | Os olhos giram de um lado para o outro | Aguardando resposta (padrão) |
| `waiting-wrap` | Os olhos saem por um lado e voltam pelo outro | Aguardando resposta |
| `waiting-wave` | Os olhos sobem e descem alternadamente | Aguardando resposta |
| `input` | Os olhos viram cursores piscantes | O usuário está digitando |
| `affirm` | Acena com a cabeça | Entendido, confirmado |
| `success` | Olhos felizes e sorridentes | Tarefa concluída |
| `failure` | Abaixa a cabeça e os olhos | Falha de tarefa ou conexão |
| `wary` | Vira a cabeça e olha de cima a baixo com desconfiança | A ação precisa de confirmação |
| `inspect` | Aperta os olhos e examina de cima a baixo | Revisar ou verificar algo |
| `angry` | Olhos baixos e fulminantes | Conteúdo bloqueado |
| `refuse` | Balança a cabeça | Não pode ou não vai atender ao pedido |
| `surprise` | Olhos arregalados | Algo inesperado |
| `love` | Os olhos se unem em um coração que bate | Agradecimento, carinho |
| `random` | Os olhos giram como rolos de caça-níqueis | Escolha aleatória, momento divertido |
| `sleep` | Fecha os olhos e dorme | Muito tempo sem atividade |
| `wake` | Abre os olhos e acorda | A atividade volta |

As ações de espera tocam uma rodada com `play()`. `startWaiting({ variant: 'spin' | 'wrap' | 'wave' })` repete até outra ação começar ou `stopWaiting()` ser chamado.

Os nomes da 0.5 (`send`, `warning`, `error`, `blocked`, `slot` e outros) continuam funcionando até a 1.0, com um aviso no console; consulte a [tabela de atualização](../CHANGELOG.md#upgrading-from-05x).

Um fluxo típico de solicitação de Agent:

```js
avatar.startWaiting();

// Segunda espera: os olhos saem por um lado e voltam pelo outro.
avatar.startWaiting({ variant: 'wrap' });

// Terceiro movimento de espera: ondas verticais escalonadas dos olhos.
avatar.startWaiting({ variant: 'wave' });

try {
  const result = await runAgentRequest();
  await avatar.play(result.ok ? 'success' : 'failure');
} catch (error) {
  await avatar.play('failure');
}
```

## Opções comuns

```html
<boop-face
  size="160"
  color="#08090b"
  auto-sleep="30000"
  wake-on="activity"
  motion="auto">
</boop-face>
```

| Atributo | Uso |
| --- | --- |
| `size` | Tamanho do avatar em pixels |
| `color` | Cor principal do avatar |
| `auto-sleep` | Tempo de inatividade antes do sono automático; `0` desativa |
| `wake-on` | Política de despertar automático: `activity`, `interaction` ou `manual` |
| `motion` | Política de movimento: `auto`, `reduce` ou `full` |
| `press-squeeze` | Pressione o centro para comprimir; `false` desativa |
| `antenna-drag` | Arraste e retorno elástico da antena com reação de raiva; `false` desativa |
| `skin` | Número do skin, por exemplo `301`; omita para a cor lisa |

Controles comuns em tempo de execução:

```js
avatar.setPointerFollow(false);
avatar.setHeadRoundness(75);
avatar.setPressSqueeze(true);
avatar.setAntennaDrag(true);
```

Manter o centro pressionado inicia a compressão. Ao mover mais de 4 pixels CSS, o mesmo gesto passa ao arraste de cabeça existente. A antena usa o mesmo limite de distância e termina com a reação de raiva existente.

## Skins · Novidade na 0.7

188 skins em 17 séries, com uma luz que segue o ponteiro. Cada skin tem um número permanente: o número da série seguido de dois dígitos, então 305 é o quinto skin da série 3. Os nomes podem mudar; os números nunca mudam nem são reutilizados.

Todas as skins continuam sendo SVG puro: sem imagens, canvas nem WebGL. Todas as skins juntas somam cerca de 70 KB pela rede (cerca de 290 KB sem compressão), e a maior parte só é carregada quando uma página usa uma skin. Para comparar, o avatar em si (a versão lite, sem skins) tem cerca de 45 KB.

<img src="../assets/readme/skin-gallery.jpg" alt="Galeria de skins: destaques, filtros e busca" width="100%">

```html
<boop-face skin="301"></boop-face>
```

```js
avatar.setSkin(102);  // ou '102'
avatar.setSkin(null); // volta à cor lisa
```

Veja todos os skins com seus números na [página com todos os skins](https://cx-artlab.github.io/BoopFace/materials/?lang=pt).

| Série | Números | Série | Números | Série | Números |
| --- | --- | --- | --- | --- | --- |
| Esmalte | 101–106 | Vidro gelo | 201–206 | Goma | 301–312 |
| Vidro bala | 401–406 | Acrílico | 501–512 | Gelatina | 601–612 |
| Degradê | 701–712 | Vidro fosco | 801–806 | Metal | 901–930 |
| Gemas e cerâmica | 1001–1012 | Madeira | 1101–1106 | Bolas | 1201–1210 |
| Transparente e brilho | 1301–1305 | Tecido e couro | 1401–1412 | Doces e frutas | 1501–1512 |
| Natureza | 1601–1612 | Padrões e tecnologia | 1701–1717 |  |  |

O código que desenha os skins é baixado na primeira vez que um skin é usado, então uma página sem skins nunca o carrega. `await loadSkins()` o carrega antecipadamente. `SKINS` traz os nomes em chinês e inglês e as cores de cada skin, `SKIN_SERIES` as séries e `SKIN_NAMES` todos os números.

Todas as expressões e gestos funcionam com um skin. Ao remover o skin, o atributo `color` volta a valer.

## Eventos e integração

O componente emite `face-state` para mudanças de estado visual e `action-state` para mudanças semânticas no ciclo de vida das ações.

Para integrações com a aplicação host e textos de status acessíveis, prefira `action-state`. Veja [`examples/accessibility.html`](../examples/accessibility.html) para um exemplo executável do ciclo de vida de uma solicitação.

Um exemplo mínimo de integração está disponível em [`examples/basic.html`](../examples/basic.html).

## Compatibilidade

Projetado para navegadores modernos com suporte a ES Modules, Custom Elements, SVG, Pointer Events, Web Animations API, `IntersectionObserver`, `ResizeObserver` e `matchMedia`.

Os testes automatizados cobrem Chromium, Firefox e WebKit.

<a id="boopface-embedded"></a>

## Novo: BoopFace Embedded

As expressões dos olhos da versão web agora funcionam em telas de robôs e placas. O pequeno motor C++11 preserva movimentos e ritmo. Os exemplos cobrem 28 configurações ESP32, ESP32-S3, STM32 e Raspberry Pi Pico: TFT redondas e retangulares, telas alongadas, AMOLED e OLED monocromáticas. Também aceita tamanhos personalizados.

| Seu dispositivo | Qual usar |
| --- | --- |
| Sites, apps, tablets Android e robôs com navegador | Componente web: avatar completo, skins e interação |
| ESP32, STM32 e Raspberry Pi Pico | Motor embarcado com exemplos de firmware |
| Outros microcontroladores ou programas C++ | Biblioteca C++; forneça o driver da tela |


<img src="../assets/readme/hardware-preview.jpg" alt="Simulador: expressões numa TFT redonda, disposição, cores e exportação" width="100%">

**Experimente sem placa.** O [simulador](https://cx-artlab.github.io/BoopFace/hardware/?lang=pt) executa o mesmo motor C++ no navegador com 32 telas simuladas. Ajuda a prever o resultado e comparar módulos.

**Ajuste, exporte e compile.** Escolha a tela, disposição, cores e taxa de quadros. Clique em **Exportar ajustes**, salve `eyes_settings.h` ao lado do `main.cpp` do exemplo e compile. Veja os [passos](../embedded/README.md). A interface e os comentários exportados seguem o idioma escolhido.

**Instalar por ZIP.** Baixe `BoopFace-Embedded-0.1.0.zip` na [versão embarcada](https://github.com/CX-ArtLab/boopface/releases/tag/eyes-v0.1.0) e use **Sketch → Incluir Biblioteca → Adicionar Biblioteca .ZIP** no Arduino IDE. A indexação no Arduino Library Manager está pendente; enquanto isso, use ZIP ou código-fonte. Para [PlatformIO](https://registry.platformio.org/libraries/cxlab/BoopFace), adicione esta dependência ao ambiente em `platformio.ini`:

```ini
lib_deps = cxlab/BoopFace@^0.1.0
```

**No seu programa**, reproduza expressões pelo nome:

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

Experimental: o CI compila todas as configurações, mas nenhuma foi verificada em hardware real. Se testar, envie um [relatório](https://github.com/CX-ArtLab/boopface/issues/new?template=hardware_report.yml). Veja a [documentação](../embedded/README.md) para API e conexões.

## Contribuindo

Issues e Pull Requests são bem-vindos. Consulte [`CONTRIBUTING.md`](../CONTRIBUTING.md) antes de enviar alterações.

## Status do projeto

**Versão pública atual: v0.8.0**\
BoopFace Embedded: v0.1.0 (experimental)

A API pública é mantida deliberadamente compacta enquanto o projeto evolui em direção a um futuro compromisso de estabilidade `1.0.0`.

BoopFace é desenvolvido de forma independente e não é afiliado, endossado nem representa qualquer plataforma ou marca de IA.

## Design do personagem e identidade visual

O personagem BoopFace, incluindo sua aparência robótica e identidade visual, é um design original da CX ArtLab.

A licença MIT se aplica ao software e ao código-fonte. Ela permite usar, modificar e distribuir o avatar como parte de aplicações, mas não transfere a propriedade do nome BoopFace, da identidade do personagem ou de sua identidade visual, nem concede o direito de apresentá-los como personagem original ou marca independente de outra parte.

Os nomes de produtos de terceiros mencionados neste projeto servem apenas para descrever possíveis casos de uso e não indicam afiliação ou endosso.

## Licença

MIT License. Consulte [`LICENSE`](../LICENSE).

---

Se este projeto for útil para você, você pode me pagar um café.

<a href='https://ko-fi.com/P0E625WIOI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi6.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
