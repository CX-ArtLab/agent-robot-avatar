const contextKey = 'agentRobotAvatarDemoAppearance';
const contextInputs = ['demoBgColor', 'demoHeadColor', 'demoEyeThrough', 'demoAntenna',
  'demoPointerFollow', 'demoHeadRoundnessUnlock', 'demoHeadRoundness'];
export function restoreAppearance() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(contextKey) || 'null');
    if (saved) for (const id of contextInputs) {
      const input = document.getElementById(id);
      if (!input || !(id in saved)) continue;
      if (input.type === 'checkbox') input.checked = Boolean(saved[id]);
      else input.value = saved[id];
      input.dispatchEvent(new Event(input.type === 'checkbox' ? 'change' : 'input', { bubbles: true }));
    }
  } catch { /* The demo also works without browser storage. */ }
}

export function saveAppearance() {
  const context = Object.fromEntries(contextInputs.filter(id => document.getElementById(id)).map(id => {
    const input = document.getElementById(id);
    return [id, input.type === 'checkbox' ? input.checked : input.value];
  }));
  try {
    const existing = JSON.parse(sessionStorage.getItem(contextKey) || '{}');
    sessionStorage.setItem(contextKey, JSON.stringify({ ...existing, ...context }));
  } catch {}
}
