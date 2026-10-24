// Pattern tiles for skins. Each generator returns the tile size, an optional
// pattern transform and the SVG markup of one tile, in the head's 240-unit
// coordinates. Scattered patterns use a seeded random source so every avatar
// shows the same tile.

const rng = seed => {
  let state = (seed % 2147483647) || 1;
  return () => (state = state * 16807 % 2147483647) / 2147483647;
};
const n = value => Number(value.toFixed(2));
const pick = (random, list) => list[Math.floor(random() * list.length) % list.length];

// Repeats an element at the tile edges so scattered shapes wrap seamlessly.
function wrap(size, x, y, r, draw) {
  let out = '';
  for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) {
    if (x + dx + r < 0 || x + dx - r > size || y + dy + r < 0 || y + dy - r > size) continue;
    out += draw(x + dx, y + dy);
  }
  return out;
}

function ring(cx, cy, f, steps = 64, squash = 1) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const a = i / steps * Math.PI * 2;
    const r = f(a);
    d += `${i ? 'L' : 'M'}${n(cx + Math.cos(a) * r)} ${n(cy + Math.sin(a) * r * squash)}`;
  }
  return `${d}Z`;
}

const PATTERNS = {
  tartan({ colors: [a, b, c], size = 56 }) {
    const bands = [[0, 18, a, .55], [26, 3, b, .8], [38, 2, c, .8], [44, 6, a, .35]];
    let body = '';
    for (const [x, w, color, o] of bands) {
      body += `<rect x="${x}" width="${w}" height="${size}" fill="${color}" opacity="${o}"/><rect y="${x}" width="${size}" height="${w}" fill="${color}" opacity="${o}"/>`;
    }
    return { size: [size, size], body };
  },
  dots({ colors: [c], r = 5, size = 26, opacity = 1 }) {
    const q = size / 4;
    return { size: [size, size], body: `<circle cx="${q}" cy="${q}" r="${r}" fill="${c}" opacity="${opacity}"/><circle cx="${q * 3}" cy="${q * 3}" r="${r}" fill="${c}" opacity="${opacity}"/>` };
  },
  terrazzo({ colors, count = 44, size = 120, seed = 5 }) {
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < count; i++) {
      const x = random() * size, y = random() * size, k = 2.5 + random() * 6, sides = 3 + Math.floor(random() * 3), color = pick(random, colors), turn = random() * Math.PI;
      let d = '';
      for (let j = 0; j < sides; j++) {
        const a = turn + j / sides * Math.PI * 2, rr = k * (.6 + random() * .5);
        d += `${j ? 'L' : 'M'}${n(Math.cos(a) * rr)} ${n(Math.sin(a) * rr)}`;
      }
      body += wrap(size, x, y, k, (px, py) => `<path d="${d}Z" fill="${color}" transform="translate(${n(px)} ${n(py)})"/>`);
    }
    return { size: [size, size], body };
  },
  marble({ colors: [a, b], seed = 21 }) {
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < 7; i++) {
      const color = i % 3 === 2 ? b : a;
      let x = -20, y = random() * 240, d = `M${n(x)} ${n(y)}`;
      while (x < 260) {
        const nx = x + 30 + random() * 40, ny = y + (random() - .5) * 70;
        d += `Q${n(x + 15 + random() * 20)} ${n(y + (random() - .5) * 60)} ${n(nx)} ${n(ny)}`;
        x = nx; y = ny;
      }
      body += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${n(.6 + random() * 1.8)}" opacity="${n(.35 + random() * .35)}"/>`;
      body += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${n(5 + random() * 6)}" opacity=".07"/>`;
    }
    return { size: [240, 240], body };
  },
  wood({ colors: [c], seed = 23 }) {
    const random = rng(seed);
    let body = '';
    for (let k = 1; k < 34; k++) {
      const base = k * 11 + random() * 4, p1 = random() * 6, p2 = random() * 6;
      const d = ring(60, 330, a => base + Math.sin(a * 3 + p1) * 3 + Math.sin(a * 7 + p2) * 1.5, 120, .62);
      body += `<path d="${d}" fill="none" stroke="${c}" stroke-width="${n(.8 + random() * 1.4)}" opacity="${n(.25 + random() * .3)}"/>`;
    }
    return { size: [240, 240], body };
  },
  pixel({ colors, cell = 10, size = 80, seed = 31, opacity = .9 }) {
    const random = rng(seed);
    let body = '';
    for (let y = 0; y < size; y += cell) for (let x = 0; x < size; x += cell) {
      if (random() < .45) continue;
      body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${pick(random, colors)}" opacity="${opacity}"/>`;
    }
    return { size: [size, size], body };
  },
  confetti({ colors, count = 38, size = 120, seed = 37 }) {
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < count; i++) {
      const x = random() * size, y = random() * size, color = pick(random, colors), turn = random() * 180, strip = random() < .5;
      body += wrap(size, x, y, 6, (px, py) => strip
        ? `<rect x="${n(px - 1.6)}" y="${n(py - 4)}" width="3.2" height="8" rx="1" fill="${color}" transform="rotate(${n(turn)} ${n(px)} ${n(py)})"/>`
        : `<circle cx="${n(px)}" cy="${n(py)}" r="2.2" fill="${color}"/>`);
    }
    return { size: [size, size], body };
  },
  rainbow({ colors, opacity = .85 }) {
    const h = 240 / colors.length;
    return { size: [240, 240], body: colors.map((c, i) => `<rect y="${n(i * h)}" width="240" height="${n(h + .5)}" fill="${c}" opacity="${opacity}"/>`).join('') };
  },
  denim({ colors: [c], size = 5, opacity = .16 }) {
    return { size: [size, size], transform: 'rotate(-30)', body: `<rect width="1.6" height="${size}" fill="${c}" opacity="${opacity}"/><rect x="3" width=".8" height="${size}" fill="#000" opacity=".12"/>` };
  },
  grid({ colors: [c], size = 50, step = 10, opacity = .5 }) {
    let body = `<path d="M0 0H${size}M0 0V${size}" stroke="${c}" stroke-width="1.6" opacity="${opacity}"/>`;
    for (let i = step; i < size; i += step) body += `<path d="M0 ${i}H${size}M${i} 0V${size}" stroke="${c}" stroke-width=".7" opacity="${opacity * .7}"/>`;
    return { size: [size, size], body };
  },
  halftone({ colors: [c], step = 12, opacity = .7 }) {
    let body = '';
    for (let y = 6; y < 240; y += step) for (let x = 6 + ((y / step) % 2) * step / 2; x < 240; x += step) {
      body += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(.6 + 4.4 * (y / 240))}" fill="${c}" opacity="${opacity}"/>`;
    }
    return { size: [240, 240], body };
  },
  scatter({ colors, shapes, count = 12, size = 120, k = [6, 10], seed = 47 }) {
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < count; i++) {
      const x = random() * size, y = random() * size, r = k[0] + random() * (k[1] - k[0]), turn = (random() - .5) * 70;
      const shape = pick(random, shapes), color = colors[i % colors.length], accent = colors[(i + 1) % colors.length];
      const art = SHAPES[shape](r, color, accent);
      body += wrap(size, x, y, r * 1.3, (px, py) => `<g transform="translate(${n(px)} ${n(py)}) rotate(${n(turn)})">${art}</g>`);
    }
    return { size: [size, size], body };
  },
  brick({ colors: [c], w = 40, h = 20, opacity = .8 }) {
    const r = h / 2;
    return { size: [w, h], body: `<path d="M0 0H${w}M0 ${r}H${w}M0 0V${r}M${w / 2} 0V${r}M${w / 4} ${r}V${h}M${w * .75} ${r}V${h}" stroke="${c}" stroke-width="1.6" opacity="${opacity}"/>` };
  },
};

const SHAPES = {
  leaf: (k, c, accent) => `<path d="M0 ${n(-k)}Q${n(.65 * k)} 0 0 ${n(k)}Q${n(-.65 * k)} 0 0 ${n(-k)}Z" fill="${c}"/><path d="M0 ${n(-.8 * k)}V${n(.9 * k)}" stroke="${accent}" stroke-width="${n(.08 * k)}"/>`,
  blossom: (k, c, accent) => `${[0, 72, 144, 216, 288].map(a => `<ellipse cy="${n(-.5 * k)}" rx="${n(.3 * k)}" ry="${n(.45 * k)}" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="${n(.2 * k)}" fill="${accent}"/>`,
};

function patternMarkup(id, spec) {
  const make = PATTERNS[spec.kind];
  if (!make) return '';
  const { size: [w, h], transform, body } = make(spec);
  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}"${transform ? ` patternTransform="${transform}"` : ''}>${body}</pattern>`;
}

export { PATTERNS, patternMarkup };
