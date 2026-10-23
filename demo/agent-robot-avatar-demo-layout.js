// Wrapping alone leaves one long row and one short one. Count the rows the widest
// layout needs, then narrow the wrap width to the smallest that still fits in that
// many rows, so the rows come out close to equal. The column (stage, controls card,
// toolbar and panels) then takes one shared width: the balanced width, or the
// toolbar's natural width if wider, and the full width on phones.
function balanceControls() {
  const stack = document.querySelector('.demo-control-stack');
  const controls = stack?.querySelector('.controls');
  if (!controls) return;
  const buttons = Array.from(controls.querySelectorAll('button[data-action]')).filter(button => button.offsetParent);
  if (!buttons.length) return;

  const rowsAt = width => {
    controls.style.setProperty('--demo-controls-width', `${width}px`);
    return new Set(buttons.map(button => Math.round(button.offsetTop))).size;
  };

  // Shortest row width over the longest one at the current width.
  const evenness = () => {
    const spans = new Map();
    for (const button of buttons) {
      const key = Math.round(button.offsetTop);
      const [left, right] = spans.get(key) || [Infinity, -Infinity];
      spans.set(key, [Math.min(left, button.offsetLeft), Math.max(right, button.offsetLeft + button.offsetWidth)]);
    }
    const widths = [...spans.values()].map(([left, right]) => right - left);
    return Math.min(...widths) / Math.max(...widths);
  };

  // Room for longer labels, e.g. from a browser page translator, before adding a row;
  // short labels still settle at their own narrower even width below.
  const phone = window.innerWidth <= 600;
  const limit = phone ? window.innerWidth - 16 : Math.min(900, window.innerWidth - 20);
  // Measure with the column at full width so every tried wrap width fits inside it.
  stack.style.setProperty('--demo-stack-width', `${limit}px`);
  const toolbar = stack.querySelector('.demo-panel-toolbar');
  const toolbarStyle = toolbar && getComputedStyle(toolbar);
  const toolbarWidth = toolbar ? [...toolbar.children]
    .reduce((sum, child) => sum + child.offsetWidth, 0) + 12 * Math.max(0, toolbar.children.length - 1)
    + parseFloat(toolbarStyle.paddingLeft) + parseFloat(toolbarStyle.paddingRight) : 0;
  const rows = rowsAt(limit);
  const narrowest = 120;
  let low = narrowest;
  let high = limit;
  while (high - low > 1) {
    const middle = Math.floor((low + high) / 2);
    if (rowsAt(middle) > rows) low = middle;
    else high = middle;
  }
  // The narrowest fit can still group long labels on one row and short ones on
  // another. Try the other widths with the same row count and keep the most even
  // split; never add a row, so the row count stays stable as labels change.
  let best = high;
  rowsAt(high);
  let bestEvenness = evenness();
  for (let width = limit; width >= narrowest; width -= 2) {
    if (rowsAt(width) > rows) break;
    const value = evenness();
    if (value > bestEvenness + 0.01) {
      best = width;
      bestEvenness = value;
    }
  }
  rowsAt(best);
  const column = phone ? limit : Math.min(limit, Math.max(best, toolbarWidth));
  stack.style.setProperty('--demo-stack-width', `${column}px`);
}

// The stage, status and controls form one column. Center it for the closed layout,
// then, when an open panel would run past the bottom edge, raise it just enough to
// keep the panel on screen, never past the title.
function placeComposition() {
  const stack = document.querySelector('.demo-control-stack');
  const canvas = document.getElementById('canvas');
  const title = document.querySelector('.title');
  if (!stack || !canvas) return;
  const height = stack.offsetHeight;
  const panels = [...stack.querySelectorAll('.demo-options-group:not([hidden])')]
    .reduce((sum, panel) => sum + panel.offsetHeight + 7, 0);
  const ceiling = (title ? title.offsetTop + title.offsetHeight : 0) + 16;
  const centered = (window.innerHeight - (height - panels)) / 2;
  const fit = window.innerHeight - 16 - height;
  const top = Math.round(Math.max(ceiling, Math.min(centered, fit)));
  document.documentElement.style.setProperty('--demo-stack-top', `${top}px`);
  canvas.style.setProperty('min-height', `${Math.max(window.innerHeight, top + height + 24)}px`, 'important');
}

let placeFrame = 0;
function schedulePlace() {
  cancelAnimationFrame(placeFrame);
  placeFrame = requestAnimationFrame(placeComposition);
}

let balanceFrame = 0;
function scheduleBalance() {
  cancelAnimationFrame(balanceFrame);
  balanceFrame = requestAnimationFrame(balanceControls);
}

function mountDemoLayout() {
  const stack = document.querySelector('.demo-control-stack');
  const controls = stack?.querySelector('.controls');
  if (!controls || stack.dataset.layoutMounted) return;
  stack.dataset.layoutMounted = 'true';

  window.addEventListener('resize', scheduleBalance);
  window.addEventListener('resize', schedulePlace);
  // Opening a panel, rewrapping the actions or switching language all resize the stack.
  if (window.ResizeObserver) new ResizeObserver(schedulePlace).observe(stack);
  document.fonts?.ready.then(scheduleBalance);
  // Rebalance after a language change. Initial balancing happens before reveal.
  new MutationObserver(scheduleBalance).observe(controls, { childList: true, subtree: true, characterData: true });
  // Page translators and late fonts can also change label widths through styles alone,
  // after the text mutations settle, so watch the buttons' own sizes too. Buttons are
  // sized by their labels, not by the row width, so rebalancing never retriggers this.
  if (window.ResizeObserver) {
    const buttonSizes = new ResizeObserver(scheduleBalance);
    controls.querySelectorAll('button[data-action]').forEach(button => buttonSizes.observe(button));
  }
  scheduleBalance();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountDemoLayout, { once: true });
else mountDemoLayout();

export { mountDemoLayout, balanceControls, placeComposition };


