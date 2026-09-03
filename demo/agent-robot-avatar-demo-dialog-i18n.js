const DEMO_BUILD = '0.1.1-R52';
const STYLE_ID = 'agent-demo-dialog-i18n-style-r52';

const DIALOG_I18N = Object.freeze({
  'zh-CN': {
    hint: '双击头像 · 模拟对话', dialogLabel: 'Agent 对话演示', subtitle: '随机状态回复演示', close: '关闭',
    intro: '这是一个模拟 Agent。输入任意内容后，会随机模拟成功、风险确认、内容阻止、系统错误等回复，并在正文下方标注对应表情。',
    placeholder: '输入内容……', keyboard: 'Enter 发送 · Shift+Enter 换行', send: '发送',
    tags: { success:'演示表情 · 成功 / success', warning:'演示表情 · 警告 / warning', angry:'演示表情 · 内容阻止 / blocked', error:'演示表情 · 系统错误 / error', surprise:'演示表情 · 惊讶 / surprise', bored:'演示表情 · 等待 / waiting' },
    replies: {
      success:['任务已经完成，结果看起来不错。','处理完成，没有发现需要你继续操作的问题。','完成了。这次执行很顺利。'],
      warning:['这个操作会覆盖现有内容。确认要继续吗？','这一步可能造成不可逆的修改，你确定要执行吗？','即将进行高影响操作，请再次确认是否继续。'],
      angry:['这条内容不允许继续发送，操作已被阻止。','当前请求违反了允许范围，我不能执行。','这个操作不符合当前规则，已停止继续处理。'],
      error:['连接服务失败，请检查网络后重试。','系统暂时无法完成请求，稍后再试一次。','与服务端的连接中断了，这次操作没有完成。'],
      surprise:['有点意外，我发现了一个和预期不同的结果。','这个结果比预想中更特别，我需要重新判断一下。','发现了一个意外情况，不过信息已经保留下来了。'],
      bored:['还在等外部结果返回，这一步比平时慢一点。','暂时没有新的变化，我还在等待。','任务还没有结束，目前处于等待状态。'],
    },
  },
  'zh-TW': {
    hint: '雙擊頭像 · 模擬對話', dialogLabel: 'Agent 對話示範', subtitle: '隨機狀態回覆示範', close: '關閉',
    intro: '這是一個模擬 Agent。輸入任意內容後，會隨機模擬成功、風險確認、內容阻止、系統錯誤等回覆，並在正文下方標示對應表情。',
    placeholder: '輸入內容……', keyboard: 'Enter 傳送 · Shift+Enter 換行', send: '傳送',
    tags: { success:'示範表情 · 成功 / success', warning:'示範表情 · 警告 / warning', angry:'示範表情 · 內容阻止 / blocked', error:'示範表情 · 系統錯誤 / error', surprise:'示範表情 · 驚訝 / surprise', bored:'示範表情 · 等待 / waiting' },
    replies: {
      success:['任務已經完成，結果看起來不錯。','處理完成，沒有發現需要你繼續操作的問題。','完成了。這次執行很順利。'],
      warning:['這個操作會覆蓋現有內容。確認要繼續嗎？','這一步可能造成不可逆的修改，你確定要執行嗎？','即將進行高影響操作，請再次確認是否繼續。'],
      angry:['這項內容不允許繼續傳送，操作已被阻止。','目前請求超出允許範圍，我不能執行。','這個操作不符合目前規則，已停止處理。'],
      error:['連線服務失敗，請檢查網路後重試。','系統暫時無法完成請求，請稍後再試。','與服務端的連線中斷了，這次操作沒有完成。'],
      surprise:['有點意外，我發現了與預期不同的結果。','這個結果比預想中更特別，我需要重新判斷。','發現了一個意外情況，不過資訊已經保留下來。'],
      bored:['還在等待外部結果返回，這一步比平時慢一些。','暫時沒有新的變化，我還在等待。','任務還沒有結束，目前處於等待狀態。'],
    },
  },
  en: {
    hint: 'Double-click avatar · Demo chat', dialogLabel: 'Agent chat demo', subtitle: 'Random state response demo', close: 'Close',
    intro: 'This is a simulated Agent. Enter anything to trigger random success, confirmation, blocked-content, system-error and other responses, with the matching expression shown below each reply.',
    placeholder: 'Type a message…', keyboard: 'Enter to send · Shift+Enter for new line', send: 'Send',
    tags: { success:'Demo expression · Success', warning:'Demo expression · Warning', angry:'Demo expression · Blocked', error:'Demo expression · System error', surprise:'Demo expression · Surprise', bored:'Demo expression · Waiting' },
    replies: {
      success:['The task is complete and the result looks good.','Finished. There is nothing else you need to do.','Done. This run completed smoothly.'],
      warning:['This action will overwrite existing content. Continue?','This step may cause irreversible changes. Are you sure?','This is a high-impact action. Please confirm before continuing.'],
      angry:['This content cannot be sent. The action has been blocked.','The request is outside the allowed range, so I cannot perform it.','This action does not meet the current rules and has been stopped.'],
      error:['Connection failed. Check the network and try again.','The system cannot complete the request right now. Try again later.','The server connection was interrupted and the action did not finish.'],
      surprise:['That was unexpected. I found a result different from what we anticipated.','This result is more unusual than expected; I need to reassess it.','An unexpected condition appeared, but the information has been preserved.'],
      bored:['Still waiting for an external result; this step is taking longer than usual.','No new changes yet. I am still waiting.','The task is not finished yet and is currently waiting.'],
    },
  },
  ja: {
    hint: 'アバターをダブルクリック · 模擬チャット', dialogLabel: 'Agent チャットデモ', subtitle: 'ランダム状態返信デモ', close: '閉じる',
    intro: 'これは模擬 Agent です。任意の内容を入力すると、成功、確認、ブロック、システムエラーなどの返信をランダムに再現し、対応する表情を返信の下に表示します。',
    placeholder: 'メッセージを入力…', keyboard: 'Enter 送信 · Shift+Enter 改行', send: '送信',
    tags: { success:'デモ表情 · 成功', warning:'デモ表情 · 警告', angry:'デモ表情 · ブロック', error:'デモ表情 · システムエラー', surprise:'デモ表情 · 驚き', bored:'デモ表情 · 待機' },
    replies: {
      success:['タスクが完了しました。結果も良好です。','処理が完了しました。追加の操作は必要ありません。','完了しました。今回は問題なく実行されました。'],
      warning:['この操作は既存の内容を上書きします。続行しますか？','この操作は元に戻せない変更を行う可能性があります。実行しますか？','影響の大きい操作です。続行する前に確認してください。'],
      angry:['この内容は送信できません。操作をブロックしました。','このリクエストは許可範囲外のため実行できません。','現在のルールに適合しないため処理を停止しました。'],
      error:['接続に失敗しました。ネットワークを確認して再試行してください。','現在システムが要求を完了できません。後でもう一度お試しください。','サーバーとの接続が切断され、操作は完了しませんでした。'],
      surprise:['予想外です。想定とは異なる結果が見つかりました。','予想より特殊な結果なので、もう一度判断する必要があります。','想定外の状況が見つかりましたが、情報は保持されています。'],
      bored:['外部結果を待っています。通常より少し時間がかかっています。','まだ新しい変化はありません。待機中です。','タスクはまだ終了しておらず、現在待機中です。'],
    },
  },
  ko: {
    hint: '아바타 더블클릭 · 데모 채팅', dialogLabel: 'Agent 채팅 데모', subtitle: '무작위 상태 응답 데모', close: '닫기',
    intro: '모의 Agent입니다. 아무 내용을 입력하면 성공, 확인, 차단, 시스템 오류 등의 응답을 무작위로 보여 주고 해당 표정을 답변 아래에 표시합니다.',
    placeholder: '메시지 입력…', keyboard: 'Enter 전송 · Shift+Enter 줄바꿈', send: '전송',
    tags: { success:'데모 표정 · 성공', warning:'데모 표정 · 경고', angry:'데모 표정 · 차단', error:'데모 표정 · 시스템 오류', surprise:'데모 표정 · 놀람', bored:'데모 표정 · 대기' },
    replies: {
      success:['작업이 완료되었고 결과도 좋아 보입니다.','처리가 완료되었습니다. 추가로 할 일은 없습니다.','완료되었습니다. 이번 실행은 순조로웠습니다.'],
      warning:['이 작업은 기존 내용을 덮어씁니다. 계속할까요?','되돌릴 수 없는 변경이 발생할 수 있습니다. 진행할까요?','영향이 큰 작업입니다. 계속하기 전에 다시 확인해 주세요.'],
      angry:['이 내용은 전송할 수 없어 작업이 차단되었습니다.','요청이 허용 범위를 벗어나 실행할 수 없습니다.','현재 규칙에 맞지 않아 처리를 중단했습니다.'],
      error:['연결에 실패했습니다. 네트워크를 확인한 뒤 다시 시도하세요.','현재 시스템이 요청을 완료할 수 없습니다. 잠시 후 다시 시도하세요.','서버 연결이 끊겨 작업이 완료되지 않았습니다.'],
      surprise:['예상 밖입니다. 예상과 다른 결과를 발견했습니다.','예상보다 특이한 결과라 다시 판단해야 합니다.','예상하지 못한 상황이 있었지만 정보는 보존되었습니다.'],
      bored:['외부 결과를 기다리고 있으며 평소보다 조금 오래 걸리고 있습니다.','아직 새로운 변화가 없습니다. 계속 기다리는 중입니다.','작업이 아직 끝나지 않았고 현재 대기 중입니다.'],
    },
  },
  es: {
    hint: 'Doble clic en el avatar · Chat de prueba', dialogLabel: 'Demo de chat del Agent', subtitle: 'Demo de respuestas de estado aleatorias', close: 'Cerrar',
    intro: 'Este es un Agent simulado. Escribe cualquier cosa para generar respuestas aleatorias de éxito, confirmación, bloqueo, error del sistema y otros estados, con la expresión correspondiente debajo.',
    placeholder: 'Escribe un mensaje…', keyboard: 'Enter para enviar · Shift+Enter nueva línea', send: 'Enviar',
    tags: { success:'Expresión demo · Éxito', warning:'Expresión demo · Aviso', angry:'Expresión demo · Bloqueado', error:'Expresión demo · Error del sistema', surprise:'Expresión demo · Sorpresa', bored:'Expresión demo · Esperando' },
    replies: {
      success:['La tarea ha terminado y el resultado se ve bien.','Proceso completado. No necesitas hacer nada más.','Listo. Esta ejecución terminó sin problemas.'],
      warning:['Esta acción sobrescribirá el contenido existente. ¿Continuar?','Este paso puede causar cambios irreversibles. ¿Seguro que quieres continuar?','Es una acción de alto impacto. Confirma antes de continuar.'],
      angry:['Este contenido no puede enviarse. La acción ha sido bloqueada.','La solicitud está fuera del rango permitido y no puedo ejecutarla.','La acción no cumple las reglas actuales y se ha detenido.'],
      error:['Falló la conexión. Comprueba la red e inténtalo de nuevo.','El sistema no puede completar la solicitud ahora. Inténtalo más tarde.','La conexión con el servidor se interrumpió y la operación no terminó.'],
      surprise:['Ha sido inesperado. Encontré un resultado distinto de lo previsto.','El resultado es más inusual de lo esperado; necesito reevaluarlo.','Apareció una situación inesperada, pero la información se ha conservado.'],
      bored:['Sigo esperando un resultado externo; está tardando más de lo habitual.','Todavía no hay cambios. Sigo esperando.','La tarea aún no ha terminado y está en espera.'],
    },
  },
  pt: {
    hint: 'Clique duas vezes no avatar · Chat de teste', dialogLabel: 'Demo de chat do Agent', subtitle: 'Demo de respostas aleatórias', close: 'Fechar',
    intro: 'Este é um Agent simulado. Digite qualquer coisa para gerar respostas aleatórias de sucesso, confirmação, bloqueio, erro do sistema e outros estados, com a expressão correspondente abaixo.',
    placeholder: 'Digite uma mensagem…', keyboard: 'Enter para enviar · Shift+Enter nova linha', send: 'Enviar',
    tags: { success:'Expressão demo · Sucesso', warning:'Expressão demo · Aviso', angry:'Expressão demo · Bloqueado', error:'Expressão demo · Erro do sistema', surprise:'Expressão demo · Surpresa', bored:'Expressão demo · Aguardando' },
    replies: {
      success:['A tarefa foi concluída e o resultado parece bom.','Processamento concluído. Não há mais nada que você precise fazer.','Concluído. Esta execução terminou sem problemas.'],
      warning:['Esta ação substituirá o conteúdo existente. Continuar?','Esta etapa pode causar alterações irreversíveis. Tem certeza?','Esta é uma ação de alto impacto. Confirme antes de continuar.'],
      angry:['Este conteúdo não pode ser enviado. A ação foi bloqueada.','A solicitação está fora do intervalo permitido e não pode ser executada.','A ação não atende às regras atuais e foi interrompida.'],
      error:['Falha na conexão. Verifique a rede e tente novamente.','O sistema não consegue concluir a solicitação agora. Tente novamente mais tarde.','A conexão com o servidor foi interrompida e a operação não terminou.'],
      surprise:['Isso foi inesperado. Encontrei um resultado diferente do previsto.','O resultado é mais incomum do que o esperado; preciso reavaliá-lo.','Surgiu uma situação inesperada, mas as informações foram preservadas.'],
      bored:['Ainda aguardando um resultado externo; está demorando mais que o normal.','Ainda não há novas mudanças. Continuo aguardando.','A tarefa ainda não terminou e está aguardando.'],
    },
  },
  de: {
    hint: 'Avatar doppelklicken · Demo-Chat', dialogLabel: 'Agent-Chat-Demo', subtitle: 'Demo zufälliger Statusantworten', close: 'Schließen',
    intro: 'Dies ist ein simulierter Agent. Gib etwas ein, um zufällige Erfolgs-, Bestätigungs-, Blockierungs-, Systemfehler- und andere Antworten mit dem passenden Ausdruck darunter zu sehen.',
    placeholder: 'Nachricht eingeben…', keyboard: 'Enter senden · Shift+Enter neue Zeile', send: 'Senden',
    tags: { success:'Demo-Ausdruck · Erfolg', warning:'Demo-Ausdruck · Warnung', angry:'Demo-Ausdruck · Blockiert', error:'Demo-Ausdruck · Systemfehler', surprise:'Demo-Ausdruck · Überraschung', bored:'Demo-Ausdruck · Warten' },
    replies: {
      success:['Die Aufgabe ist abgeschlossen und das Ergebnis sieht gut aus.','Verarbeitung abgeschlossen. Es ist nichts Weiteres nötig.','Fertig. Dieser Durchlauf wurde problemlos abgeschlossen.'],
      warning:['Diese Aktion überschreibt vorhandene Inhalte. Fortfahren?','Dieser Schritt kann irreversible Änderungen verursachen. Bist du sicher?','Dies ist eine Aktion mit großer Auswirkung. Bitte vor dem Fortfahren bestätigen.'],
      angry:['Dieser Inhalt kann nicht gesendet werden. Die Aktion wurde blockiert.','Die Anfrage liegt außerhalb des erlaubten Bereichs und kann nicht ausgeführt werden.','Die Aktion entspricht nicht den aktuellen Regeln und wurde gestoppt.'],
      error:['Verbindung fehlgeschlagen. Netzwerk prüfen und erneut versuchen.','Das System kann die Anfrage derzeit nicht abschließen. Später erneut versuchen.','Die Serververbindung wurde unterbrochen und der Vorgang nicht abgeschlossen.'],
      surprise:['Das war unerwartet. Ich habe ein anderes Ergebnis als erwartet gefunden.','Das Ergebnis ist ungewöhnlicher als erwartet; ich muss es neu bewerten.','Eine unerwartete Situation ist aufgetreten, die Informationen wurden jedoch erhalten.'],
      bored:['Es wird noch auf ein externes Ergebnis gewartet; dieser Schritt dauert länger als üblich.','Noch keine neuen Änderungen. Ich warte weiter.','Die Aufgabe ist noch nicht beendet und wartet derzeit.'],
    },
  },
  fr: {
    hint: 'Double-cliquez sur l’avatar · Chat de démo', dialogLabel: 'Démo de chat Agent', subtitle: 'Démo de réponses d’état aléatoires', close: 'Fermer',
    intro: 'Ceci est un Agent simulé. Saisissez n’importe quoi pour obtenir aléatoirement des réponses de succès, confirmation, blocage, erreur système et autres états, avec l’expression correspondante dessous.',
    placeholder: 'Saisissez un message…', keyboard: 'Entrée envoyer · Maj+Entrée nouvelle ligne', send: 'Envoyer',
    tags: { success:'Expression démo · Succès', warning:'Expression démo · Avertissement', angry:'Expression démo · Bloqué', error:'Expression démo · Erreur système', surprise:'Expression démo · Surprise', bored:'Expression démo · Attente' },
    replies: {
      success:['La tâche est terminée et le résultat semble bon.','Traitement terminé. Aucune autre action n’est nécessaire.','Terminé. Cette exécution s’est déroulée sans problème.'],
      warning:['Cette action écrasera le contenu existant. Continuer ?', 'Cette étape peut provoquer des modifications irréversibles. Êtes-vous sûr ?', 'Il s’agit d’une action à fort impact. Confirmez avant de continuer.'],
      angry:['Ce contenu ne peut pas être envoyé. L’action a été bloquée.','La demande dépasse la portée autorisée et ne peut pas être exécutée.','Cette action ne respecte pas les règles actuelles et a été arrêtée.'],
      error:['Échec de la connexion. Vérifiez le réseau et réessayez.','Le système ne peut pas terminer la demande actuellement. Réessayez plus tard.','La connexion au serveur a été interrompue et l’opération n’a pas abouti.'],
      surprise:['C’était inattendu. J’ai trouvé un résultat différent de ce qui était prévu.','Ce résultat est plus inhabituel que prévu ; je dois le réévaluer.','Une situation inattendue est apparue, mais les informations ont été conservées.'],
      bored:['Toujours en attente d’un résultat externe ; cette étape prend plus de temps que d’habitude.','Aucun nouveau changement pour le moment. J’attends toujours.','La tâche n’est pas encore terminée et reste en attente.'],
    },
  },
});

function activeLanguage() {
  const lang = document.documentElement.lang || 'zh-CN';
  return DIALOG_I18N[lang] ? lang : (lang.startsWith('zh') ? 'zh-CN' : 'en');
}

function text(el, value) {
  if (el && el.textContent !== value) el.textContent = value;
}

function expressionState(tag) {
  return ['success','warning','angry','error','surprise','bored'].find(name => tag?.classList.contains(name)) || null;
}

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .demo-chat-entry-hint{
      position:absolute;left:50%;top:calc(39% + 66px);transform:translateX(-50%);z-index:14;
      padding:3px 7px;border-radius:999px;color:#a0a4aa;background:rgba(255,255,255,.62);
      border:1px solid rgba(0,0,0,.035);font-size:9px;line-height:1.25;white-space:nowrap;
      pointer-events:none;user-select:none;backdrop-filter:blur(8px);
    }
    .status-pill.demo-status{top:calc(39% + 90px)!important}
    @media(max-width:600px){
      .demo-chat-entry-hint{top:calc(27% + 64px)}
      .status-pill.demo-status{top:calc(27% + 88px)!important}
      .demo-control-stack{top:calc(27% + 134px)!important}
    }
    @media(max-width:390px){
      .demo-chat-entry-hint{top:calc(26% + 64px)}
      .status-pill.demo-status{top:calc(26% + 88px)!important}
      .demo-control-stack{top:calc(26% + 134px)!important}
    }
  `;
  document.head.appendChild(style);
}

function ensureHint() {
  let hint = document.getElementById('demoChatEntryHint');
  if (hint) return hint;
  const canvas = document.getElementById('canvas');
  const status = document.getElementById('status');
  if (!canvas) return null;
  hint = document.createElement('div');
  hint.id = 'demoChatEntryHint';
  hint.className = 'demo-chat-entry-hint';
  hint.setAttribute('aria-hidden', 'true');
  if (status?.parentNode === canvas) canvas.insertBefore(hint, status);
  else canvas.appendChild(hint);
  return hint;
}

function syncDialog() {
  const t = DIALOG_I18N[activeLanguage()];
  const hint = ensureHint();
  text(hint, t.hint);

  const dialog = document.querySelector('.agent-phone');
  if (dialog) dialog.setAttribute('aria-label', t.dialogLabel);
  text(document.querySelector('.panel-sub'), t.subtitle);

  const close = document.getElementById('close');
  if (close) close.setAttribute('aria-label', t.close);

  const input = document.getElementById('input');
  if (input) input.setAttribute('placeholder', t.placeholder);
  text(document.querySelector('.composer-wrap .hint'), t.keyboard);
  text(document.getElementById('send'), t.send);

  const chat = document.getElementById('chat');
  if (!chat) return;

  const agentMessages = Array.from(chat.querySelectorAll('.message.agent:not(.typing)'));
  agentMessages.forEach((message, index) => {
    const bubble = message.querySelector('.bubble');
    const tag = message.querySelector('.expression-tag');
    if (!bubble) return;

    if (!tag) {
      if (index === 0) text(bubble, t.intro);
      return;
    }

    const state = expressionState(tag);
    if (!state || !t.replies[state]) return;
    if (!message.dataset.dialogVariant) message.dataset.dialogVariant = String(index % t.replies[state].length);
    const variant = Number(message.dataset.dialogVariant) % t.replies[state].length;
    text(message.querySelector('.reply-text'), t.replies[state][variant]);
    text(tag, t.tags[state]);
  });
}

function mountDialogI18n() {
  injectStyle();
  syncDialog();

  const chat = document.getElementById('chat');
  if (chat) {
    const chatObserver = new MutationObserver(() => syncDialog());
    chatObserver.observe(chat, { childList: true, subtree: true });
  }

  const langObserver = new MutationObserver(mutations => {
    if (mutations.some(mutation => mutation.attributeName === 'lang')) syncDialog();
  });
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  window.AgentRobotAvatarDemoBuild = DEMO_BUILD;
  const badge = document.getElementById('agent-demo-build');
  if (badge) badge.textContent = `Demo ${DEMO_BUILD}`;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountDialogI18n, { once: true });
else mountDialogI18n();

export { mountDialogI18n };
