const STYLE_ID = 'agent-demo-layout-style-r58';
const DEMO_BUILD = '0.1.1-R58';

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

    const buttons = Array.from(controls.querySelectorAll(':scope > button[data-action]'));
    if (buttons.length) {
      const firstRow = document.createElement('div');
      const secondRow = document.createElement('div');
      firstRow.className = 'demo-expression-row';
      secondRow.className = 'demo-expression-row';
      const split = Math.ceil(buttons.length / 2);
      buttons.slice(0, split).forEach(button => firstRow.appendChild(button));
      buttons.slice(split).forEach(button => secondRow.appendChild(button));
      controls.append(firstRow, secondRow);
    }
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
      width:max-content!important;max-width:calc(100vw - 20px)!important;margin:0!important;
      display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;
      flex-wrap:nowrap!important;gap:6px!important;overflow:visible!important;padding:8px!important;
    }
    .demo-expression-row{
      display:flex!important;align-items:center!important;justify-content:flex-start!important;flex-wrap:nowrap!important;
      width:max-content!important;max-width:100%!important;gap:6px!important;margin:0!important;padding:0!important;
    }
    .demo-expression-row button{
      width:auto!important;min-width:0!important;max-width:none!important;flex:0 0 auto!important;padding:8px 11px!important;
    }
    .demo-options{width:max-content!important;max-width:calc(100vw - 20px)!important;margin:0!important;justify-self:center!important}
    .demo-options-group{width:max-content!important;max-width:calc(100vw - 20px)!important;margin-inline:auto!important}
    @media(max-width:600px){
      .demo-control-stack{max-width:calc(100vw - 16px)!important}
      .demo-control-stack>.controls{max-width:calc(100vw - 16px)!important;gap:5px!important;padding:7px!important}
      .demo-expression-row{gap:5px!important}
      .demo-expression-row button{font-size:11px!important;padding:8px 7px!important}
      .demo-options,.demo-options-group{max-width:calc(100vw - 16px)!important}
    }
    @media(max-width:440px){
      .demo-expression-row{gap:4px!important}
      .demo-expression-row button{font-size:10px!important;padding:8px 5px!important}
      .demo-option,.demo-reset{font-size:10px!important;padding:4px 5px!important}
    }
  `;
  document.head.appendChild(style);

  window.AgentRobotAvatarApplyDemoLanguage?.();
  window.AgentRobotAvatarDemoBuild = DEMO_BUILD;
  const badge = document.getElementById('agent-demo-build');
  if (badge) badge.textContent = `Demo ${DEMO_BUILD}`;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountDemoLayout, { once: true });
else mountDemoLayout();

export { mountDemoLayout };
