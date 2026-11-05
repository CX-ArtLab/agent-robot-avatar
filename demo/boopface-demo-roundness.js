const PRESET_VALUES = Object.freeze([0, 50, 100]);

const LABELS = Object.freeze({
  'zh-CN': { roundness: '头部外观', free: '自由' },
  'zh-TW': { roundness: '頭部外觀', free: '自由' },
  en: { roundness: 'Head shape', free: 'Free' },
  ja: { roundness: 'ヘッドの形', free: '自由' },
  ko: { roundness: '머리 모양', free: '자유' },
  es: { roundness: 'Forma de la cabeza', free: 'Libre' },
  pt: { roundness: 'Formato da cabeça', free: 'Livre' },
  de: { roundness: 'Kopfform', free: 'Frei' },
  fr: { roundness: 'Forme de la tête', free: 'Libre' },
});

function activeLanguage() {
  const lang = document.documentElement.lang || 'zh-CN';
  if (LABELS[lang]) return lang;
  return lang.startsWith('zh') ? 'zh-CN' : 'en';
}

function nearestPreset(value) {
  return PRESET_VALUES.reduce((best, candidate) =>
    Math.abs(candidate - value) < Math.abs(best - value) ? candidate : best,
  PRESET_VALUES[0]);
}

function mountRoundnessControl() {
  const control = document.querySelector('.demo-roundness-control');
  if (!control || control.dataset.roundnessMounted) return;
  const face = document.getElementById('face');
  const stack = document.querySelector('.demo-control-stack');
  if (!face || !stack || typeof face.setHeadRoundness !== 'function') return;

  control.dataset.roundnessMounted = 'true';

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

}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountRoundnessControl, { once: true });
else mountRoundnessControl();

export { mountRoundnessControl };

