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

function starPath(cx, cy, r, turn) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = turn + i * Math.PI / 5 - Math.PI / 2;
    const radius = i % 2 ? r * .45 : r;
    d += `${i ? 'L' : 'M'}${n(cx + Math.cos(a) * radius)} ${n(cy + Math.sin(a) * radius)}`;
  }
  return `${d}Z`;
}

function heartPath(x, y, s) {
  return `M${n(x)} ${n(y + s * .3)}C${n(x)} ${n(y)} ${n(x - s * .5)} ${n(y)} ${n(x - s * .5)} ${n(y + s * .3)}`
    + `C${n(x - s * .5)} ${n(y + s * .6)} ${n(x)} ${n(y + s * .75)} ${n(x)} ${n(y + s)}`
    + `C${n(x)} ${n(y + s * .75)} ${n(x + s * .5)} ${n(y + s * .6)} ${n(x + s * .5)} ${n(y + s * .3)}`
    + `C${n(x + s * .5)} ${n(y)} ${n(x)} ${n(y)} ${n(x)} ${n(y + s * .3)}Z`;
}

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
  stripes({ colors: [c], width = 10, gap = 10, angle = 45, opacity = 1 }) {
    const s = width + gap;
    return { size: [s, s], transform: `rotate(${angle})`, body: `<rect width="${width}" height="${s}" fill="${c}" opacity="${opacity}"/>` };
  },
  gingham({ colors: [c], size = 24, opacity = .45 }) {
    const h = size / 2;
    return { size: [size, size], body: `<rect width="${h}" height="${size}" fill="${c}" opacity="${opacity}"/><rect width="${size}" height="${h}" fill="${c}" opacity="${opacity}"/>` };
  },
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
  stars({ colors, count = 12, size = 120, r = [4, 8], seed = 7 }) {
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < count; i++) {
      const x = random() * size, y = random() * size, radius = r[0] + random() * (r[1] - r[0]), turn = random() * Math.PI, color = pick(random, colors);
      body += wrap(size, x, y, radius, (px, py) => `<path d="${starPath(px, py, radius, turn)}" fill="${color}"/>`);
    }
    return { size: [size, size], body };
  },
  hearts({ colors, count = 12, size = 120, s = [7, 11], seed = 11 }) {
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < count; i++) {
      const x = random() * size, y = random() * size, k = s[0] + random() * (s[1] - s[0]), turn = (random() - .5) * 40, color = pick(random, colors);
      body += wrap(size, x, y, k, (px, py) => `<path d="${heartPath(px, py - k / 2, k)}" fill="${color}" transform="rotate(${n(turn)} ${n(px)} ${n(py)})"/>`);
    }
    return { size: [size, size], body };
  },
  waves({ colors: [c], width = 3, size = 34, amp = 5, opacity = .8 }) {
    const h = size / 2.4;
    return { size: [size, h], body: `<path d="M0 ${n(h / 2)}Q${size / 4} ${n(h / 2 - amp)} ${size / 2} ${n(h / 2)}T${size} ${n(h / 2)}" fill="none" stroke="${c}" stroke-width="${width}" opacity="${opacity}"/>` };
  },
  chevron({ colors: [c], width = 5, size = 26, opacity = .85 }) {
    const h = size / 2;
    return { size: [size, h], body: `<path d="M0 ${n(h * .8)}L${size / 2} ${n(h * .2)}L${size} ${n(h * .8)}" fill="none" stroke="${c}" stroke-width="${width}" stroke-linejoin="round" opacity="${opacity}"/>` };
  },
  honeycomb({ colors: [c], r = 12, width = 1.8, opacity = .9 }) {
    const w = r * Math.sqrt(3), h = r * 3;
    const hex = (cx, cy) => {
      let d = '';
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 3 * i + Math.PI / 6;
        d += `${i ? 'L' : 'M'}${n(cx + Math.cos(a) * r)} ${n(cy + Math.sin(a) * r)}`;
      }
      return `${d}Z`;
    };
    const cells = [[w / 2, r / 2], [0, r * 2], [w, r * 2], [w / 2, r * 3.5], [w / 2, -r]];
    return { size: [n(w), n(h)], body: `<path d="${cells.map(([x, y]) => hex(x, y)).join('')}" fill="none" stroke="${c}" stroke-width="${width}" opacity="${opacity}"/>` };
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
  camo({ colors, size = 160, seed = 3 }) {
    const random = rng(seed);
    let body = '';
    for (const color of colors) {
      for (let i = 0; i < 7; i++) {
        const x = random() * size, y = random() * size;
        for (let j = 0; j < 4; j++) {
          const bx = x + (random() - .5) * 26, by = y + (random() - .5) * 18, rx = 9 + random() * 12, ry = 6 + random() * 9, turn = random() * 180;
          body += wrap(size, bx, by, rx, (px, py) => `<ellipse cx="${n(px)}" cy="${n(py)}" rx="${n(rx)}" ry="${n(ry)}" fill="${color}" transform="rotate(${n(turn)} ${n(px)} ${n(py)})"/>`);
        }
      }
    }
    return { size: [size, size], body };
  },
  leopard({ colors: [ringColor, inner], count = 14, size = 120, seed = 9 }) {
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < count; i++) {
      const x = random() * size, y = random() * size, r = 6 + random() * 4, dash = 4 + random() * 4, offset = random() * 20, turn = random() * 180;
      body += wrap(size, x, y, r + 3, (px, py) => `<ellipse cx="${n(px)}" cy="${n(py)}" rx="${n(r * .7)}" ry="${n(r * .55)}" fill="${inner}" opacity=".7" transform="rotate(${n(turn)} ${n(px)} ${n(py)})"/>`
        + `<ellipse cx="${n(px)}" cy="${n(py)}" rx="${n(r)}" ry="${n(r * .8)}" fill="none" stroke="${ringColor}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${n(dash)} 3" stroke-dashoffset="${n(offset)}" transform="rotate(${n(turn)} ${n(px)} ${n(py)})"/>`);
    }
    return { size: [size, size], body };
  },
  tiger({ colors: [c], count = 8, size = 120, seed = 13, opacity = 1 }) {
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < count; i++) {
      const y0 = (i + random() * .6) * size / count, x0 = random() * size, len = 50 + random() * 40, thick = 3 + random() * 4, bend = (random() - .5) * 14;
      const top = [], bottom = [];
      for (let t = 0; t <= 1.0001; t += .1) {
        const x = x0 - len / 2 + len * t, y = y0 + Math.sin(t * Math.PI * 1.5) * bend * .4 + bend * t, w = thick * Math.sin(Math.PI * t);
        top.push(`${n(x)} ${n(y - w)}`);
        bottom.unshift(`${n(x)} ${n(y + w)}`);
      }
      const d = `M${top.join('L')}L${bottom.join('L')}Z`;
      body += wrap(size, x0, y0, len / 2 + 10, (px, py) => `<path d="${d}" fill="${c}" opacity="${opacity}" transform="translate(${n(px - x0)} ${n(py - y0)})"/>`);
    }
    return { size: [size, size], body };
  },
  seeds({ colors: [c], count = 16, size = 100, seed = 17 }) {
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < count; i++) {
      const x = random() * size, y = random() * size, turn = (random() - .5) * 50;
      body += wrap(size, x, y, 5, (px, py) => `<ellipse cx="${n(px)}" cy="${n(py)}" rx="2.2" ry="3.8" fill="${c}" transform="rotate(${n(turn)} ${n(px)} ${n(py)})"/>`);
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
  contour({ colors: [c], opacity = .45 }) {
    let body = '';
    for (let k = 1; k <= 15; k++) {
      const d = ring(132, 104, a => k * 10.5 + Math.sin(a * 3 + k * .45) * 6 + Math.sin(a * 5 + 1.3) * 3.5, 90);
      body += `<path d="${d}" fill="none" stroke="${c}" stroke-width="${k % 5 === 0 ? 2 : 1.1}" opacity="${opacity}"/>`;
    }
    return { size: [240, 240], body };
  },
  circuit({ colors: [line, pad], size = 80, seed = 29 }) {
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < 9; i++) {
      let x = Math.round(random() * 10) * 8, y = Math.round(random() * 10) * 8;
      let d = `M${x} ${y}`;
      const points = [[x, y]];
      for (let j = 0; j < 3; j++) {
        const dir = Math.floor(random() * 4), len = 8 + Math.round(random() * 3) * 8;
        if (dir === 0) x += len; else if (dir === 1) y += len; else if (dir === 2) { x += len * .7; y += len * .7; } else { x += len * .7; y -= len * .7; }
        d += `L${n(x)} ${n(y)}`;
        points.push([x, y]);
      }
      const [sx, sy] = points[0], [ex, ey] = points[points.length - 1];
      body += wrap(size, size / 2, size / 2, size, (px, py) => `<g transform="translate(${n(px - size / 2)} ${n(py - size / 2)})"><path d="${d}" fill="none" stroke="${line}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="${n(sx)}" cy="${n(sy)}" r="2.4" fill="${pad}"/><circle cx="${n(ex)}" cy="${n(ey)}" r="2.4" fill="none" stroke="${pad}" stroke-width="1.4"/></g>`);
    }
    return { size: [size, size], body };
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
  flowers({ colors: [petal, center], size = 44 }) {
    const flower = (cx, cy, r) => {
      let out = '';
      for (let i = 0; i < 5; i++) {
        const a = i / 5 * Math.PI * 2;
        out += `<circle cx="${n(cx + Math.cos(a) * r)}" cy="${n(cy + Math.sin(a) * r)}" r="${n(r * .85)}" fill="${petal}"/>`;
      }
      return `${out}<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * .6)}" fill="${center}"/>`;
    };
    const q = size / 4;
    return { size: [size, size], body: flower(q, q, 4.2) + flower(q * 3, q * 3, 3.4) };
  },
  clouds({ colors: [c], size = 110, seed = 41, opacity = .85 }) {
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < 6; i++) {
      const x = random() * size, y = random() * size, k = 5 + random() * 4;
      const puffs = [[0, 0, k], [k * .9, -k * .4, k * .8], [k * 1.8, 0, k * .7], [k * .8, k * .3, k * .75]];
      body += wrap(size, x + k, y, k * 3, (px, py) => puffs.map(([dx, dy, r]) => `<circle cx="${n(px - k + dx)}" cy="${n(py + dy)}" r="${n(r)}" fill="${c}" opacity="${opacity}"/>`).join(''));
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
  knit({ colors: [c], w = 12, h = 10, opacity = .32 }) {
    return { size: [w, h], body: `<path d="M1.5 1.5L${w / 2} ${h - 1.5}L${w - 1.5} 1.5" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>` };
  },
  scales({ colors: [c], r = 10, opacity = .5 }) {
    const w = r * 2, h = r;
    return { size: [w, h], body: `<path d="M0 0A${r} ${r} 0 0 0 ${w} 0M${-r} ${h}A${r} ${r} 0 0 0 ${r} ${h}M${r} ${h}A${r} ${r} 0 0 0 ${w + r} ${h}" fill="none" stroke="${c}" stroke-width="1.6" opacity="${opacity}"/>` };
  },
};

function patternMarkup(id, spec) {
  const make = PATTERNS[spec.kind];
  if (!make) return '';
  const { size: [w, h], transform, body } = make(spec);
  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}"${transform ? ` patternTransform="${transform}"` : ''}>${body}</pattern>`;
}

export { PATTERNS, patternMarkup };
