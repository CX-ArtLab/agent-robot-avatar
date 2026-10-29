const NS = 'http://www.w3.org/2000/svg';

function svg(tag, attributes = {}, parent) {
  const element = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  parent?.append(element);
  return element;
}

// The eyelids are rectangles painted in the head color over the eyes. A skin
// paints the head with gradients, so a flat lid would show as a patch. Moving
// the lids into a mask lets them cut the eyes instead, and the skin shows
// through. With a flat head color this looks exactly like the original.
export function maskEyelids(instance) {
  const root = instance.shadowRoot;
  const defs = root.querySelector('defs');
  for (const side of ['left', 'right']) {
    const eye = root.getElementById(`${side}Eye`);
    const lids = root.getElementById(`${side}Top`)?.parentElement;
    if (!eye || !lids || lids.parentElement?.tagName === 'mask') continue;
    const mask = svg('mask', {
      id: `skin-${side}-lids`, maskUnits: 'userSpaceOnUse', maskContentUnits: 'userSpaceOnUse',
      x: -180, y: -240, width: 360, height: 480,
    }, defs);
    svg('rect', { x: -180, y: -240, width: 360, height: 480, fill: '#fff' }, mask);
    for (const lid of lids.children) lid.style.fill = '#000';
    mask.append(lids);
    const paint = svg('g', { mask: `url(#skin-${side}-lids)` });
    paint.append(...eye.children);
    eye.append(paint);
  }
}
