try {
if (document.body.dataset.page === 'skins') {
  const { mountDemo } = await import('./agent-robot-avatar-demo-ui.js');
  await mountDemo(document.getElementById('demo-root'), Number(document.body.dataset.avatarSize) || 118);
}


  const { VERSION } = await import('../agent-robot-avatar.js');
  window.AgentRobotAvatarDemoBuild = VERSION;
  const buildBadge = document.getElementById('agent-demo-build');
  if (buildBadge) buildBadge.textContent = `Demo ${VERSION}`;

  const face = document.getElementById('face');
  const home = document.getElementById('home');
  const homeSize = face.getAttribute('size');
  const overlay = document.getElementById('agentOverlay');
  const slot = document.getElementById('slot');
  const status = document.getElementById('status');
  const chat = document.getElementById('chat');
  const input = document.getElementById('input');
  const sendButton = document.getElementById('send');
  const pointerFollow = document.getElementById('pointerFollow');
  let inPanel = false;
  let busy = false;
  let replyToken = 0;

  const stateNames = {
    idle: '默认待机', bored: '发呆', input: '输入中', happy: '成功',
    wary: '警惕', angry: '生气', refuse: '拒绝',
    surprise: '惊讶', sleepy: '困倦', sleep: '睡眠'
  };

  const replies = [
    {state:'success', label:'演示表情 · 成功 / success', texts:['任务已经完成，结果看起来不错。','处理完成，没有发现需要你继续操作的问题。','完成了。这次执行很顺利。']},
    {state:'wary', label:'演示表情 · 警惕 / wary', texts:['这个操作会覆盖现有内容。确认要继续吗？','这一步可能造成不可逆的修改，你确定要执行吗？','即将进行高影响操作，请再次确认是否继续。']},
    {state:'angry', label:'演示表情 · 生气 / angry', texts:['这条内容不允许继续发送，操作已被阻止。','当前请求违反了允许范围，我不能执行。','这个操作不符合当前规则，已停止继续处理。']},
    {state:'refuse', label:'演示表情 · 拒绝 / refuse', texts:['抱歉，这个请求我不能执行。','这件事超出了我能做的范围，我只能拒绝。','这个操作我不能帮你完成。']},
    {state:'surprise', label:'演示表情 · 意外 / surprise', texts:['有点意外，我发现了一个和预期不同的结果。','这个结果比预想中更特别，我需要重新判断一下。','发现了一个意外情况，不过信息已经保留下来了。']},
    {state:'bored', label:'演示表情 · 等待 / bored', texts:['还在等外部结果返回，这一步比平时慢一点。','暂时没有新的变化，我还在等待。','任务还没有结束，目前处于等待状态。']}
  ];

  face.setPointerFollow(pointerFollow.checked);
  pointerFollow.addEventListener('change', () => {
    face.setPointerFollow(pointerFollow.checked);
  });

  face.addEventListener('face-state', (event) => {
    if (document.documentElement.dataset.demoIntro) return;
    const state = event.detail.state;
    status.textContent = `${state} · ${stateNames[state] || '状态切换'}`;
  });

  function flipMove(el, destination, newSize){
    const first = el.getBoundingClientRect();
    destination.appendChild(el);
    el.setAttribute('size', newSize);
    const last = el.getBoundingClientRect();
    const dx = first.left-last.left, dy=first.top-last.top;
    const sx = first.width/last.width, sy=first.height/last.height;
    const animation = el.animate([
      {transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`},
      {transform:'translate(0,0) scale(1)'}
    ],{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});
    return animation.finished.catch(()=>{});
  }

  async function openAgent(){
    if(inPanel) return;
    inPanel = true;
    face.play('affirm');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    await new Promise(resolve => setTimeout(resolve,70));
    await flipMove(face,slot,56);
    input.focus();
  }

  function closeAgent(){
    if(!inPanel) return;
    replyToken++;
    busy = false;
    sendButton.disabled = false;
    inPanel = false;
    const first = face.getBoundingClientRect();
    home.insertBefore(face,home.firstChild);
    face.setAttribute('size',homeSize);
    const last = face.getBoundingClientRect();
    const dx=first.left-last.left, dy=first.top-last.top, sx=first.width/last.width, sy=first.height/last.height;
    face.animate([
      {transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`},
      {transform:'translate(0,0) scale(1)'}
    ],{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    face.reset();
  }

  function addMessage(role,text,className='',label='',state=''){
    const row = document.createElement('div');
    row.className = `message ${role}${className ? ` ${className}` : ''}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    if(label){
      const replyText = document.createElement('div');
      replyText.className = 'reply-text';
      replyText.textContent = text;
      bubble.appendChild(replyText);
      const tag = document.createElement('div');
      tag.className = `expression-tag ${state}`;
      tag.textContent = label;
      bubble.appendChild(tag);
    }else{
      bubble.textContent = text;
    }
    row.appendChild(bubble);
    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;
    return row;
  }

  function chooseReply(){
    const group = replies[Math.floor(Math.random()*replies.length)];
    return {state:group.state,label:group.label,text:group.texts[Math.floor(Math.random()*group.texts.length)]};
  }

  async function sendMessage(){
    const text = input.value.trim();
    if(!text || busy) return;
    const token = ++replyToken;
    busy = true;
    sendButton.disabled = true;
    addMessage('user',text);
    input.value='';
    face.reset();
    await face.play('affirm');
    if(token !== replyToken || !inPanel) return;

    const typing = addMessage('agent','•••','typing');
    const wait = 700 + Math.random()*900;
    await new Promise(resolve => setTimeout(resolve,wait));
    if(token !== replyToken || !inPanel) return;
    typing.remove();
    const reply = chooseReply();
    face.play(reply.state);
    addMessage('agent',reply.text,'',reply.label,reply.state);
    busy = false;
    sendButton.disabled = false;
    input.focus({preventScroll:true});
  }

  face.addEventListener('dblclick',openAgent);
  document.getElementById('close').addEventListener('click',closeAgent);
  overlay.addEventListener('click',(event)=>{ if(event.target === overlay) closeAgent(); });
  document.addEventListener('keydown',(event)=>{ if(event.key === 'Escape' && inPanel) closeAgent(); });

  document.querySelector('.controls').addEventListener('click',(event)=>{
    const action = event.target.dataset.action;
    if(!action) return;
    face.play(action);
  });

  input.addEventListener('input',()=>{
    if(!busy && input.value.length) face.play('input');
  });
  input.addEventListener('focus',()=>{
    if(!busy && input.value.length) face.play('input');
  });
  input.addEventListener('keydown',(event)=>{
    if(event.key === 'Enter' && !event.shiftKey){
      event.preventDefault();
      sendMessage();
    }
  });
  sendButton.addEventListener('click',sendMessage);

  await import('./agent-robot-avatar-demo-controls.js');
  await import('./agent-robot-avatar-demo-extras.js');
  await import('./agent-robot-avatar-demo-roundness.js');
  const { balanceControls, placeComposition } = await import('./agent-robot-avatar-demo-layout.js');
  await import('./agent-robot-avatar-demo-dialog-i18n.js');
  await import('./agent-robot-avatar-demo-chat-avatar-mode.js');
  await import('./agent-robot-avatar-demo-reply-loop.js');
  if (document.body.dataset.page !== 'skins') await import('./agent-robot-avatar-demo-skins.js');
  // Apply the final language and row width before exposing interactive content.
  await document.fonts.ready;
  balanceControls();
  placeComposition();
  await new Promise(resolve => requestAnimationFrame(resolve));
  document.getElementById('canvas').inert = false;
  document.getElementById('canvas').setAttribute('aria-busy', 'false');
  document.documentElement.classList.remove('demo-initializing');
  document.documentElement.dataset.demoReady = 'true';
} catch (error) {
  console.error('Demo initialization failed:', error);
  document.getElementById('demoLoadStatus').textContent = 'The demo could not load. Please reload to try again.';
}
