const DEMO_BUILD = '0.1.1-R68';
const DEFAULT_VALUE = 50;
const PRESET_VALUES = Object.freeze([0, 50, 100]);

const LABELS = Object.freeze({
  'zh-CN': { roundness: '头部圆角', free: '自由' },
  'zh-TW': { roundness: '頭部圓角', free: '自由' },
  en: { roundness: 'Head roundness', free: 'Free' },
  ja: { roundness: 'ヘッドの丸み', free: '自由' },
  ko: { roundness: '머리 둥글기', free: '자유' },
  es: { roundness: 'Redondez', free: 'Libre' },
  pt: { roundness: 'Arredondamento', free: 'Livre' },
  de: { roundness: 'Kopfrundung', free: 'Frei' },
  fr: { roundness: 'Arrondi', free: 'Libre' },
});

function activeLanguage() {
  const lang = document.documentElement.lang || 'zh-CN';
  if (LABELS[lang]) return lang;
  return lang.startsWith('zh') ? 'zh-CN' : 'en';
}

function injectStyles() {
  if (document.getElementById('agent-demo-roundness-style-r68')) return;
  const style = document.createElement('style');
  style.id = 'agent-demo-roundness-style-r68';
  style.textContent = `
    .demo-roundness-control{
      display:flex;align-items:center;justify-content:center;gap:8px;justify-self:center;
      width:max-content;max-width:100%;padding:6px 10px;border:1px solid rgba(0,0,0,.055);border-radius:13px;
      background:rgba(255,255,255,.84);box-shadow:0 6px 22px rgba(0,0,0,.05);backdrop-filter:blur(14px);
      color:#747980;font:600 10px/1 Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;
      user-select:none
    }
    .demo-roundness-label{white-space:nowrap}
    .demo-roundness-mark{width:14px;height:14px;flex:0 0 14px;border:1.5px solid #9a9ea4;background:transparent}
    .demo-roundness-mark.square{border-radius:3px}
    .demo-roundness-mark.round{border-radius:7px}
    .demo-roundness-control input[type=range]{
      width:150px;max-width:34vw;height:18px;margin:0;padding:0;accent-color:#666b72;cursor:pointer
    }
    .demo-roundness-control input[type=range]:focus-visible{outline:2px solid #aeb2b8;outline-offset:2px;border-radius:999px}
    .demo-roundness-unlock{display:inline-flex;align-items:center;gap:5px;padding-left:3px;white-space:nowrap;cursor:pointer}
    .demo-roundness-unlock input{position:absolute;opacity:0;pointer-events:none}
    .demo-roundness-switch{position:relative;width:30px;height:18px;border-radius:999px;background:#d4d6d9;transition:background .18s ease;flex:0 0 auto}
    .demo-roundness-switch::after{content:'';position:absolute;left:2px;top:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.18);transition:transform .18s ease}
    .demo-roundness-unlock input:checked+.demo-roundness-switch{background:#666b72}
    .demo-roundness-unlock input:checked+.demo-roundness-switch::after{transform:translateX(12px)}
    .demo-roundness-unlock input:focus-visible+.demo-roundness-switch{outline:2px solid #aeb2b8;outline-offset:2px}
    @media(max-width:600px){
      .demo-roundness-control{gap:7px;padding:6px 8px}
      .demo-roundness-control input[type=range]{width:132px;max-width:36vw}
    }
    @media(max-width:390px){
      .demo-roundness-control{gap:5px;font-size:9px}
      .demo-roundness-control input[type=range]{width:104px;max-width:31vw}
      .demo-roundness-unlock{gap:4px;padding-left:1px}
    }
  `;
  document.head.appendChild(style);
}

function nearestPreset(value) {
  return PRESET_VALUES.reduce((best, candidate) =>
    Math.abs(candidate - value) < Math.abs(best - value) ? candidate : best,
  PRESET_VALUES[0]);
}

function mountRoundnessControl() {
  if (document.getElementById('demoHeadRoundness')) return;
  const face = document.getElementById('face');
  const stack = document.querySelector('.demo-control-stack');
  if (!face || !stack || typeof face.setHeadRoundness !== 'function') return;

  injectStyles();

  const control = document.createElement('div');
  control.className = 'demo-roundness-control';
  control.innerHTML = `
    <span class="demo-roundness-label" id="demoHeadRoundnessLabel"></span>
    <span class="demo-roundness-mark square" aria-hidden="true"></span>
    <input id="demoHeadRoundness" type="range" min="0" max="100" step="50" value="${DEFAULT_VALUE}" list="demoRoundnessStops">
    <datalist id="demoRoundnessStops"><option value="0"></option><option value="50"></option><option value="100"></option></datalist>
    <span class="demo-roundness-mark round" aria-hidden="true"></span>
    <label class="demo-roundness-unlock">
      <span id="demoHeadRoundnessUnlockLabel"></span>
      <input id="demoHeadRoundnessUnlock" type="checkbox">
      <span class="demo-roundness-switch" aria-hidden="true"></span>
    </label>
  `;
  stack.appendChild(control);

  const slider = control.querySelector('#demoHeadRoundness');
  const unlock = control.querySelector('#demoHeadRoundnessUnlock');
  const label = control.querySelector('#demoHeadRoundnessLabel');
  const unlockLabel = control.querySelector('#demoHeadRoundnessUnlockLabel');

  function syncLanguage() {
    const text = LABELS[activeLanguage()];
    label.textContent = text.roundness;
    unlockLabel.textContent = text.free;
    slider.setAttribute('aria-label', text.roundness);
    unlock.setAttribute('aria-label', `${text.roundness} · ${text.free}`);
    control.title = text.roundness;
  }

  function apply() {
    face.setHeadRoundness(Number(slider.value));
  }

  slider.addEventListener('input', apply);
  unlock.addEventListener('change', () => {
    if (unlock.checked) {
      slider.step = '1';
    } else {
      slider.step = '50';
      slider.value = String(nearestPreset(Number(slider.value)));
      apply();
    }
  });

  const langObserver = new MutationObserver(syncLanguage);
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  syncLanguage();
  apply();

  window.AgentRobotAvatarDemoBuild = DEMO_BUILD;
  const badge = document.getElementById('agent-demo-build');
  if (badge) badge.textContent = `Demo ${DEMO_BUILD}`;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountRoundnessControl, { once: true });
else mountRoundnessControl();

export { mountRoundnessControl };
