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

  const limit = window.innerWidth <= 600 ? window.innerWidth - 16 : Math.min(760, window.innerWidth - 20);
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
  // another. Also try other widths, allowing one extra row, and keep the most
  // even split; a clearly better evenness is worth that extra row.
  let best = high;
  rowsAt(high);
  let bestEvenness = evenness();
  for (let width = limit; width >= narrowest; width -= 2) {
    const count = rowsAt(width);
    if (count > rows + 1) break;
    const value = evenness();
    if (value > bestEvenness + 0.05 || (count <= rows && value > bestEvenness + 0.01)) {
      best = width;
      bestEvenness = value;
    }
  }
  rowsAt(best);
  controls.style.setProperty('--demo-controls-width', `${best}px`);
  controls.parentElement.style.setProperty('--demo-controls-width', `${best}px`);
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
  document.fonts?.ready.then(scheduleBalance);
  // Rebalance after a language change. Initial balancing happens before reveal.
  new MutationObserver(scheduleBalance).observe(controls, { childList: true, subtree: true, characterData: true });
  scheduleBalance();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountDemoLayout, { once: true });
else mountDemoLayout();

export { mountDemoLayout, balanceControls };


