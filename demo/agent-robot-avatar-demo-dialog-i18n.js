const DIALOG_I18N = Object.freeze({
  'zh-CN': {
    hint: { lead:'试一下：', items:['双击头像','任意方向拖动头像','按住头像中心挤压','拖动天线'] }, dialogLabel: 'Agent 对话演示', subtitle: '随机状态回复演示', close: '关闭',
    intro: '这是一个模拟 Agent。输入任意内容后，会随机模拟成功、风险确认、生气、拒绝等回复，并在正文下方标注对应表情。',
    placeholder: '输入内容……', keyboard: 'Enter 发送 · Shift+Enter 换行', send: '发送',
    tags: { success:'演示表情 · 成功 / success', wary:'演示表情 · 警惕 / wary', angry:'演示表情 · 生气 / angry', refuse:'演示表情 · 拒绝 / refuse', surprise:'演示表情 · 惊讶 / surprise', bored:'演示表情 · 等待 / waiting' },
    replies: {
      success:['任务已经完成，结果看起来不错。','处理完成，没有发现需要你继续操作的问题。','完成了。这次执行很顺利。'],
      wary:['这个操作会覆盖现有内容。确认要继续吗？','这一步可能造成不可逆的修改，你确定要执行吗？','即将进行高影响操作，请再次确认是否继续。'],
      angry:['这条内容不允许继续发送，操作已被阻止。','当前请求违反了允许范围，我不能执行。','这个操作不符合当前规则，已停止继续处理。'],
      refuse:['抱歉，这个请求我不能执行。','这件事超出了我能做的范围，我只能拒绝。','这个操作我不能帮你完成。'],
      surprise:['有点意外，我发现了一个和预期不同的结果。','这个结果比预想中更特别，我需要重新判断一下。','发现了一个意外情况，不过信息已经保留下来了。'],
      bored:['还在等外部结果返回，这一步比平时慢一点。','暂时没有新的变化，我还在等待。','任务还没有结束，目前处于等待状态。'],
    },
  },
  'zh-TW': {
    hint: { lead:'試一下：', items:['雙擊頭像','向任意方向拖動頭像','按住頭像中央擠壓','拖動天線'] }, dialogLabel: 'Agent 對話示範', subtitle: '隨機狀態回覆示範', close: '關閉',
    intro: '這是一個模擬 Agent。輸入任意內容後，會隨機模擬成功、風險確認、生氣、拒絕等回覆，並在正文下方標示對應表情。',
    placeholder: '輸入內容……', keyboard: 'Enter 傳送 · Shift+Enter 換行', send: '傳送',
    tags: { success:'示範表情 · 成功 / success', wary:'示範表情 · 警惕 / wary', angry:'示範表情 · 生氣 / angry', refuse:'示範表情 · 拒絕 / refuse', surprise:'示範表情 · 驚訝 / surprise', bored:'示範表情 · 等待 / waiting' },
    replies: {
      success:['任務已經完成，結果看起來不錯。','處理完成，沒有發現需要你繼續操作的問題。','完成了。這次執行很順利。'],
      wary:['這個操作會覆蓋現有內容。確認要繼續嗎？','這一步可能造成不可逆的修改，你確定要執行嗎？','即將進行高影響操作，請再次確認是否繼續。'],
      angry:['這項內容不允許繼續傳送，操作已被阻止。','目前請求超出允許範圍，我不能執行。','這個操作不符合目前規則，已停止處理。'],
      refuse:['抱歉，這個請求我不能執行。','這件事超出了我能做的範圍，我只能拒絕。','這個操作我不能幫你完成。'],
      surprise:['有點意外，我發現了與預期不同的結果。','這個結果比預想中更特別，我需要重新判斷。','發現了一個意外情況，不過資訊已經保留下來。'],
      bored:['還在等待外部結果返回，這一步比平時慢一些。','暫時沒有新的變化，我還在等待。','任務還沒有結束，目前處於等待狀態。'],
    },
  },
  en: {
    hint: { lead:'Try:', items:['Double-click the avatar','Drag the avatar any direction','Press and hold the center','Drag the antenna'] }, dialogLabel: 'Agent chat demo', subtitle: 'Random state response demo', close: 'Close',
    intro: 'This is a simulated Agent. Enter anything to trigger random success, confirmation, angry, refusal and other responses, with the matching expression shown below each reply.',
    placeholder: 'Type a message…', keyboard: 'Enter to send · Shift+Enter for new line', send: 'Send',
    tags: { success:'Demo expression · Success', wary:'Demo expression · Wary', angry:'Demo expression · Angry', refuse:'Demo expression · Refuse', surprise:'Demo expression · Surprise', bored:'Demo expression · Waiting' },
    replies: {
      success:['The task is complete and the result looks good.','Finished. There is nothing else you need to do.','Done. This run completed smoothly.'],
      wary:['This action will overwrite existing content. Continue?','This step may cause irreversible changes. Are you sure?','This is a high-impact action. Please confirm before continuing.'],
      angry:['This content cannot be sent. The action has been blocked.','The request is outside the allowed range, so I cannot perform it.','This action does not meet the current rules and has been stopped.'],
      refuse:['Sorry, I can’t do that request.','That is outside what I can do, so I have to decline.','I can’t help you complete this action.'],
      surprise:['That was unexpected. I found a result different from what we anticipated.','This result is more unusual than expected; I need to reassess it.','An unexpected condition appeared, but the information has been preserved.'],
      bored:['Still waiting for an external result; this step is taking longer than usual.','No new changes yet. I am still waiting.','The task is not finished yet and is currently waiting.'],
    },
  },
  ja: {
    hint: { lead:'試す：', items:['アバターをダブルクリック','アバターを自由にドラッグ','中央を長押ししてつぶす','アンテナをドラッグ'] }, dialogLabel: 'Agent チャットデモ', subtitle: 'ランダム状態返信デモ', close: '閉じる',
    intro: 'これは模擬 Agent です。任意の内容を入力すると、成功、確認、怒り、拒否などの返信をランダムに再現し、対応する表情を返信の下に表示します。',
    placeholder: 'メッセージを入力…', keyboard: 'Enter 送信 · Shift+Enter 改行', send: '送信',
    tags: { success:'デモ表情 · 成功', wary:'デモ表情 · 警戒', angry:'デモ表情 · 怒り', refuse:'デモ表情 · 拒否', surprise:'デモ表情 · 驚き', bored:'デモ表情 · 待機' },
    replies: {
      success:['タスクが完了しました。結果も良好です。','処理が完了しました。追加の操作は必要ありません。','完了しました。今回は問題なく実行されました。'],
      wary:['この操作は既存の内容を上書きします。続行しますか？','この操作は元に戻せない変更を行う可能性があります。実行しますか？','影響の大きい操作です。続行する前に確認してください。'],
      angry:['この内容は送信できません。操作をブロックしました。','このリクエストは許可範囲外のため実行できません。','現在のルールに適合しないため処理を停止しました。'],
      refuse:['申し訳ありませんが、このリクエストは実行できません。','これは私の対応範囲を超えているため、お断りします。','この操作をお手伝いすることはできません。'],
      surprise:['予想外です。想定とは異なる結果が見つかりました。','予想より特殊な結果なので、もう一度判断する必要があります。','想定外の状況が見つかりましたが、情報は保持されています。'],
      bored:['外部結果を待っています。通常より少し時間がかかっています。','まだ新しい変化はありません。待機中です。','タスクはまだ終了しておらず、現在待機中です。'],
    },
  },
  ko: {
    hint: { lead:'해보기:', items:['아바타 더블클릭','아바타를 원하는 방향으로 드래그','중앙을 길게 눌러 압축','안테나 드래그'] }, dialogLabel: 'Agent 채팅 데모', subtitle: '무작위 상태 응답 데모', close: '닫기',
    intro: '모의 Agent입니다. 아무 내용을 입력하면 성공, 확인, 화남, 거절 등의 응답을 무작위로 보여 주고 해당 표정을 답변 아래에 표시합니다.',
    placeholder: '메시지 입력…', keyboard: 'Enter 전송 · Shift+Enter 줄바꿈', send: '전송',
    tags: { success:'데모 표정 · 성공', wary:'데모 표정 · 경계', angry:'데모 표정 · 화남', refuse:'데모 표정 · 거절', surprise:'데모 표정 · 놀람', bored:'데모 표정 · 대기' },
    replies: {
      success:['작업이 완료되었고 결과도 좋아 보입니다.','처리가 완료되었습니다. 추가로 할 일은 없습니다.','완료되었습니다. 이번 실행은 순조로웠습니다.'],
      wary:['이 작업은 기존 내용을 덮어씁니다. 계속할까요?','되돌릴 수 없는 변경이 발생할 수 있습니다. 진행할까요?','영향이 큰 작업입니다. 계속하기 전에 다시 확인해 주세요.'],
      angry:['이 내용은 전송할 수 없어 작업이 차단되었습니다.','요청이 허용 범위를 벗어나 실행할 수 없습니다.','현재 규칙에 맞지 않아 처리를 중단했습니다.'],
      refuse:['죄송하지만 이 요청은 실행할 수 없습니다.','제가 할 수 있는 범위를 벗어나 거절할 수밖에 없습니다.','이 작업은 도와드릴 수 없습니다.'],
      surprise:['예상 밖입니다. 예상과 다른 결과를 발견했습니다.','예상보다 특이한 결과라 다시 판단해야 합니다.','예상하지 못한 상황이 있었지만 정보는 보존되었습니다.'],
      bored:['외부 결과를 기다리고 있으며 평소보다 조금 오래 걸리고 있습니다.','아직 새로운 변화가 없습니다. 계속 기다리는 중입니다.','작업이 아직 끝나지 않았고 현재 대기 중입니다.'],
    },
  },
  es: {
    hint: { lead:'Prueba:', items:['Doble clic en el avatar','Arrastra el avatar en cualquier dirección','Mantén pulsado el centro','Arrastra la antena'] }, dialogLabel: 'Demo de chat del Agent', subtitle: 'Demo de respuestas de estado aleatorias', close: 'Cerrar',
    intro: 'Este es un Agent simulado. Escribe cualquier cosa para generar respuestas aleatorias de éxito, confirmación, enfado, rechazo y otros estados, con la expresión correspondiente debajo.',
    placeholder: 'Escribe un mensaje…', keyboard: 'Enter para enviar · Shift+Enter nueva línea', send: 'Enviar',
    tags: { success:'Expresión demo · Éxito', wary:'Expresión demo · Recelo', angry:'Expresión demo · Enfado', refuse:'Expresión demo · Rechazar', surprise:'Expresión demo · Sorpresa', bored:'Expresión demo · Esperando' },
    replies: {
      success:['La tarea ha terminado y el resultado se ve bien.','Proceso completado. No necesitas hacer nada más.','Listo. Esta ejecución terminó sin problemas.'],
      wary:['Esta acción sobrescribirá el contenido existente. ¿Continuar?','Este paso puede causar cambios irreversibles. ¿Seguro que quieres continuar?','Es una acción de alto impacto. Confirma antes de continuar.'],
      angry:['Este contenido no puede enviarse. La acción ha sido bloqueada.','La solicitud está fuera del rango permitido y no puedo ejecutarla.','La acción no cumple las reglas actuales y se ha detenido.'],
      refuse:['Lo siento, no puedo atender esta solicitud.','Esto está fuera de lo que puedo hacer, así que debo rechazarlo.','No puedo ayudarte a completar esta acción.'],
      surprise:['Ha sido inesperado. Encontré un resultado distinto de lo previsto.','El resultado es más inusual de lo esperado; necesito reevaluarlo.','Apareció una situación inesperada, pero la información se ha conservado.'],
      bored:['Sigo esperando un resultado externo; está tardando más de lo habitual.','Todavía no hay cambios. Sigo esperando.','La tarea aún no ha terminado y está en espera.'],
    },
  },
  pt: {
    hint: { lead:'Experimente:', items:['Clique duas vezes no avatar','Arraste o avatar em qualquer direção','Pressione e segure o centro','Arraste a antena'] }, dialogLabel: 'Demo de chat do Agent', subtitle: 'Demo de respostas aleatórias', close: 'Fechar',
    intro: 'Este é um Agent simulado. Digite qualquer coisa para gerar respostas aleatórias de sucesso, confirmação, raiva, recusa e outros estados, com a expressão correspondente abaixo.',
    placeholder: 'Digite uma mensagem…', keyboard: 'Enter para enviar · Shift+Enter nova linha', send: 'Enviar',
    tags: { success:'Expressão demo · Sucesso', wary:'Expressão demo · Desconfiança', angry:'Expressão demo · Raiva', refuse:'Expressão demo · Recusar', surprise:'Expressão demo · Surpresa', bored:'Expressão demo · Aguardando' },
    replies: {
      success:['A tarefa foi concluída e o resultado parece bom.','Processamento concluído. Não há mais nada que você precise fazer.','Concluído. Esta execução terminou sem problemas.'],
      wary:['Esta ação substituirá o conteúdo existente. Continuar?','Esta etapa pode causar alterações irreversíveis. Tem certeza?','Esta é uma ação de alto impacto. Confirme antes de continuar.'],
      angry:['Este conteúdo não pode ser enviado. A ação foi bloqueada.','A solicitação está fora do intervalo permitido e não pode ser executada.','A ação não atende às regras atuais e foi interrompida.'],
      refuse:['Desculpe, não posso atender a esta solicitação.','Isso está fora do que posso fazer, então preciso recusar.','Não posso ajudar a concluir esta ação.'],
      surprise:['Isso foi inesperado. Encontrei um resultado diferente do previsto.','O resultado é mais incomum do que o esperado; preciso reavaliá-lo.','Surgiu uma situação inesperada, mas as informações foram preservadas.'],
      bored:['Ainda aguardando um resultado externo; está demorando mais que o normal.','Ainda não há novas mudanças. Continuo aguardando.','A tarefa ainda não terminou e está aguardando.'],
    },
  },
  de: {
    hint: { lead:'Ausprobieren:', items:['Avatar doppelklicken','Avatar in jede Richtung ziehen','Mitte gedrückt halten','Antenne ziehen'] }, dialogLabel: 'Agent-Chat-Demo', subtitle: 'Demo zufälliger Statusantworten', close: 'Schließen',
    intro: 'Dies ist ein simulierter Agent. Gib etwas ein, um zufällige Erfolgs-, Bestätigungs-, Wut-, Ablehnungs- und andere Antworten mit dem passenden Ausdruck darunter zu sehen.',
    placeholder: 'Nachricht eingeben…', keyboard: 'Enter senden · Shift+Enter neue Zeile', send: 'Senden',
    tags: { success:'Demo-Ausdruck · Erfolg', wary:'Demo-Ausdruck · Wachsam', angry:'Demo-Ausdruck · Wütend', refuse:'Demo-Ausdruck · Ablehnen', surprise:'Demo-Ausdruck · Überraschung', bored:'Demo-Ausdruck · Warten' },
    replies: {
      success:['Die Aufgabe ist abgeschlossen und das Ergebnis sieht gut aus.','Verarbeitung abgeschlossen. Es ist nichts Weiteres nötig.','Fertig. Dieser Durchlauf wurde problemlos abgeschlossen.'],
      wary:['Diese Aktion überschreibt vorhandene Inhalte. Fortfahren?','Dieser Schritt kann irreversible Änderungen verursachen. Bist du sicher?','Dies ist eine Aktion mit großer Auswirkung. Bitte vor dem Fortfahren bestätigen.'],
      angry:['Dieser Inhalt kann nicht gesendet werden. Die Aktion wurde blockiert.','Die Anfrage liegt außerhalb des erlaubten Bereichs und kann nicht ausgeführt werden.','Die Aktion entspricht nicht den aktuellen Regeln und wurde gestoppt.'],
      refuse:['Entschuldigung, diese Anfrage kann ich nicht ausführen.','Das liegt außerhalb dessen, was ich tun kann, daher muss ich ablehnen.','Bei dieser Aktion kann ich dir nicht helfen.'],
      surprise:['Das war unerwartet. Ich habe ein anderes Ergebnis als erwartet gefunden.','Das Ergebnis ist ungewöhnlicher als erwartet; ich muss es neu bewerten.','Eine unerwartete Situation ist aufgetreten, die Informationen wurden jedoch erhalten.'],
      bored:['Es wird noch auf ein externes Ergebnis gewartet; dieser Schritt dauert länger als üblich.','Noch keine neuen Änderungen. Ich warte weiter.','Die Aufgabe ist noch nicht beendet und wartet derzeit.'],
    },
  },
  fr: {
    hint: { lead:'Essayez :', items:['Double-cliquez sur l’avatar','Faites glisser l’avatar dans toutes les directions','Maintenez le centre appuyé','Faites glisser l’antenne'] }, dialogLabel: 'Démo de chat Agent', subtitle: 'Démo de réponses d’état aléatoires', close: 'Fermer',
    intro: 'Ceci est un Agent simulé. Saisissez n’importe quoi pour obtenir aléatoirement des réponses de succès, confirmation, colère, refus et autres états, avec l’expression correspondante dessous.',
    placeholder: 'Saisissez un message…', keyboard: 'Entrée envoyer · Maj+Entrée nouvelle ligne', send: 'Envoyer',
    tags: { success:'Expression démo · Succès', wary:'Expression démo · Méfiance', angry:'Expression démo · Colère', refuse:'Expression démo · Refuser', surprise:'Expression démo · Surprise', bored:'Expression démo · Attente' },
    replies: {
      success:['La tâche est terminée et le résultat semble bon.','Traitement terminé. Aucune autre action n’est nécessaire.','Terminé. Cette exécution s’est déroulée sans problème.'],
      wary:['Cette action écrasera le contenu existant. Continuer ?', 'Cette étape peut provoquer des modifications irréversibles. Êtes-vous sûr ?', 'Il s’agit d’une action à fort impact. Confirmez avant de continuer.'],
      angry:['Ce contenu ne peut pas être envoyé. L’action a été bloquée.','La demande dépasse la portée autorisée et ne peut pas être exécutée.','Cette action ne respecte pas les règles actuelles et a été arrêtée.'],
      refuse:['Désolé, je ne peux pas traiter cette demande.','Cela dépasse ce que je peux faire, je dois donc refuser.','Je ne peux pas vous aider à effectuer cette action.'],
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

function interactionHint(el, hint, language) {
  if (!el || el.dataset.language === language) return;
  el.dataset.language = language;
  const lead = document.createElement('span');
  lead.className = 'demo-interaction-lead';
  lead.textContent = hint.lead;
  const tags = hint.items.map(value => {
    const tag = document.createElement('span');
    tag.className = 'demo-interaction-tag';
    tag.textContent = value;
    return tag;
  });
  el.replaceChildren(lead, ...tags);
  el.setAttribute('aria-label', [hint.lead, ...hint.items].join(' '));
}

function expressionState(tag) {
  return ['success','wary','angry','refuse','surprise','bored'].find(name => tag?.classList.contains(name)) || null;
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
  hint.setAttribute('role', 'note');
  const stack = document.querySelector('.demo-control-stack');
  if (stack) stack.prepend(hint);
  else if (status?.parentNode === canvas) canvas.insertBefore(hint, status.nextSibling);
  else canvas.appendChild(hint);
  return hint;
}

function syncDialog() {
  const language = activeLanguage();
  const t = DIALOG_I18N[language];
  const hint = ensureHint();
  interactionHint(hint, t.hint, language);

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

}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountDialogI18n, { once: true });
else mountDialogI18n();

export { mountDialogI18n };

