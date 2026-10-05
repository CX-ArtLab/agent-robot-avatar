const STYLE_ID = 'agent-demo-layout-style-r58';

// Wrapping alone leaves one long row and one short one. Count the rows the widest
// layout needs, then narrow the container to the smallest width that still fits
// in that many rows, so the rows come out close to equal.
function balanceControls() {
  const controls = document.querySelector('.demo-control-stack>.controls');
  if (!controls) return;
  const buttons = Array.from(controls.querySelectorAll('button[data-action]')).filter(button => button.offsetParent);
  if (!buttons.length) return;

  const rowsAt = width => {
    controls.style.setProperty('--demo-controls-width', `${width}px`);
    return new Set(buttons.map(button => Math.round(button.offsetTop))).size;
  };

  const limit = window.innerWidth <= 600 ? window.innerWidth - 16 : Math.min(760, window.innerWidth - 20);
  const rows = rowsAt(limit);
  let low = 120;
  let high = limit;
  while (high - low > 1) {
    const middle = Math.floor((low + high) / 2);
    if (rowsAt(middle) > rows) low = middle;
    else high = middle;
  }
  controls.style.setProperty('--demo-controls-width', `${high}px`);
}

let balanceFrame = 0;
function scheduleBalance() {
  cancelAnimationFrame(balanceFrame);
  balanceFrame = requestAnimationFrame(balanceControls);
}

function watchControls(attempt = 0) {
  const controls = document.querySelector('.demo-control-stack>.controls');
  if (!controls) {
    // The control stack is assembled by another demo script; wait for it.
    if (attempt < 120) requestAnimationFrame(() => watchControls(attempt + 1));
    return;
  }
  window.addEventListener('resize', scheduleBalance);
  document.fonts?.ready.then(scheduleBalance);
  // Button labels change with the demo language and as extra actions are added.
  new MutationObserver(scheduleBalance).observe(controls, { childList: true, subtree: true, characterData: true });
  scheduleBalance();
}

function mountDemoLayout() {
  if (document.getElementById(STYLE_ID)) return;

  const controls = document.querySelector('.controls');
  if (controls) {
    Array.from(controls.querySelectorAll(':scope > .demo-expression-row')).forEach(row => {
      while (row.firstChild) controls.insertBefore(row.firstChild, row);
      row.remove();
    });
    controls.querySelectorAll(':scope > .demo-expression-break').forEach(node => node.remove());

    if (!controls.querySelector('[data-action="waiting"]')) {
      const waitingButton = document.createElement('button');
      waitingButton.type = 'button';
      waitingButton.dataset.action = 'waiting';
      waitingButton.textContent = '等待';
      const boredButton = controls.querySelector('[data-action="bored"]');
      if (boredButton) boredButton.insertAdjacentElement('afterend', waitingButton);
      else controls.appendChild(waitingButton);
    }

    const waitingButton = controls.querySelector('[data-action="waiting"]');
    const wrapButton = controls.querySelector('[data-action="waiting-wrap"]');
    if (waitingButton && wrapButton) waitingButton.insertAdjacentElement('afterend', wrapButton);
  }

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .demo-control-stack{
      left:50%!important;
      transform:translateX(-50%)!important;
      width:max-content!important;
      max-width:calc(100vw - 20px)!important;
      justify-items:center!important;
    }
    .demo-control-stack>.controls{
      position:static!important;left:auto!important;top:auto!important;transform:none!important;
      width:var(--demo-controls-width,min(760px,calc(100vw - 20px)))!important;max-width:calc(100vw - 20px)!important;margin:0!important;
      display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;
      flex-wrap:wrap!important;gap:9px 6px!important;overflow:visible!important;padding:9px 8px 8px!important;
    }
    .demo-control-stack>.controls button{
      width:auto!important;min-width:0!important;max-width:none!important;flex:0 0 auto!important;padding:8px 11px!important;
    }
    .demo-options{width:max-content!important;max-width:calc(100vw - 20px)!important;margin:0!important;justify-self:center!important}
    .demo-options-group{width:max-content!important;max-width:calc(100vw - 20px)!important;margin-inline:auto!important}
    @media(max-width:600px){
      .demo-control-stack{max-width:calc(100vw - 16px)!important}
      .demo-control-stack>.controls{width:var(--demo-controls-width,calc(100vw - 16px))!important;max-width:calc(100vw - 16px)!important;gap:9px 5px!important;padding:9px 7px 7px!important}
      .demo-control-stack>.controls button{font-size:11px!important;padding:8px 7px!important}
      .demo-options,.demo-options-group{max-width:calc(100vw - 16px)!important}
    }
    @media(max-width:440px){
      .demo-control-stack>.controls{gap:9px 4px!important}
      .demo-control-stack>.controls button{font-size:10px!important;padding:8px 5px!important}
      .demo-option,.demo-reset{font-size:10px!important;padding:4px 5px!important}
    }
  `;
  document.head.appendChild(style);

  window.AgentRobotAvatarApplyDemoLanguage?.();
  watchControls();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountDemoLayout, { once: true });
else mountDemoLayout();

export { mountDemoLayout };
