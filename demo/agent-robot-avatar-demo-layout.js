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
  controls.parentElement.style.setProperty('--demo-controls-width', `${high}px`);
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


