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

// Turns a point on the unit sphere, for the patterns drawn on balls.
function rotate([x, y, z], [yaw, pitch, roll]) {
  let c = Math.cos(yaw), s = Math.sin(yaw);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(pitch); s = Math.sin(pitch);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(roll); s = Math.sin(roll);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x, y, z];
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
  grooves({ colors: [line, shadow], radius = 138, angles = [.5, -.45, .2] }) {
    // A modern ball: rings of fine grooves wrapping the surface in three directions.
    let body = '';
    for (const axis of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
      for (const lat of [-.42, 0, .42]) {
        const pts = [];
        for (let k = 0; k <= 72; k++) {
          const a = k / 72 * Math.PI * 2, r = Math.cos(lat), h = Math.sin(lat);
          const p = axis[0] ? [h, r * Math.cos(a), r * Math.sin(a)] : axis[1] ? [r * Math.cos(a), h, r * Math.sin(a)] : [r * Math.cos(a), r * Math.sin(a), h];
          pts.push(rotate(p, angles));
        }
        let d = '';
        pts.forEach(([x, y, z], i) => { d += `${i && z > 0 && pts[i - 1][2] > 0 ? 'L' : 'M'}${n(120 + x * radius)} ${n(120 + y * radius)}`; });
        body += `<path d="${d}" fill="none" stroke="${shadow}" stroke-width="3" opacity=".6" transform="translate(.8 1)"/><path d="${d}" fill="none" stroke="${line}" stroke-width="1.6"/>`;
      }
    }
    return { size: [240, 240], body };
  },
  // Balls: each is drawn once across the whole head instead of repeating.
  basketball({ colors: [seam, grain] }) {
    return {
      size: [240, 240],
      defs: tex => `<pattern id="${tex}" patternUnits="userSpaceOnUse" width="6" height="6"><circle cx="3" cy="3" r=".9" fill="${grain}" opacity=".32"/></pattern>`,
      body: tex => `<rect width="240" height="240" fill="url(#${tex})"/><path d="M120 0V240M0 120H240M52 18Q100 120 52 222M188 18Q140 120 188 222" fill="none" stroke="#ffd2a6" stroke-width="2.4" stroke-linecap="round" opacity=".55" transform="translate(1.2 1.6)"/><path d="M120 0V240M0 120H240M52 18Q100 120 52 222M188 18Q140 120 188 222" fill="none" stroke="${seam}" stroke-width="3.4" stroke-linecap="round"/>`,
    };
  },





  tennis({ colors: [seam, fuzz] }) {
    return {
      size: [240, 240],
      defs: tex => `<pattern id="${tex}" patternUnits="userSpaceOnUse" width="7" height="7"><circle cx="1.5" cy="2" r=".7" fill="${fuzz}" opacity=".35"/><circle cx="5" cy="5.5" r=".6" fill="#ffffff" opacity=".3"/></pattern>`,
      body: tex => `<rect width="240" height="240" fill="url(#${tex})"/><path d="M14 62C92 34 92 206 14 178M226 62C148 34 148 206 226 178" fill="none" stroke="#f7ffd0" stroke-width="6.5" stroke-linecap="round" opacity=".45" transform="translate(1 1.6)"/><path d="M14 62C92 34 92 206 14 178M226 62C148 34 148 206 226 178" fill="none" stroke="#4a6000" stroke-width="6.5" stroke-linecap="round" opacity=".38" transform="translate(-1 -1.6)"/><path d="M14 62C92 34 92 206 14 178M226 62C148 34 148 206 226 178" fill="none" stroke="${seam}" stroke-width="5" stroke-linecap="round"/>`,
    };
  },
  baseball({ colors: [seam, stitch] }) {
    const arc = (x0, cx) => {
      let stitches = '';
      for (let t = .06; t < .96; t += .055) {
        const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x0, y = (1 - t) ** 2 * 26 + 2 * (1 - t) * t * 120 + t * t * 214;
        const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x0 - cx), dy = 2 * (1 - t) * 94 + 2 * t * 94, len = Math.hypot(dx, dy);
        const nx = -dy / len * 5, ny = dx / len * 5, tx = dx / len * 2.2, ty = dy / len * 2.2;
        stitches += `M${n(x - nx - tx)} ${n(y - ny - ty)}L${n(x)} ${n(y)}L${n(x + nx - tx)} ${n(y + ny - ty)}`;
      }
      return `<path d="M${x0} 26Q${cx} 120 ${x0} 214" fill="none" stroke="${seam}" stroke-width="1.3"/><path d="${stitches}" fill="none" stroke="${stitch}" stroke-width="2" stroke-linecap="round"/>`;
    };
    return { size: [240, 240], body: arc(44, 104) + arc(196, 136) };
  },
  cricket({ colors: [seam, stitch] }) {
    // A raised seam arching over the forehead with three rows of stitches each side.
    const y = (x, lift) => 84 - Math.sin(x / 240 * Math.PI) * 26 + lift;
    const curve = lift => {
      let d = '';
      for (let x = -4; x <= 244; x += 8) d += `${x < 0 ? 'M' : 'L'}${x} ${n(y(x, lift))}`;
      return d;
    };
    let rows = '';
    for (const lift of [-11, -7, -3, 3, 7, 11]) {
      for (let x = 2; x < 240; x += 6) rows += `M${x} ${n(y(x, lift))}l2.6 -1.2`;
    }
    return { size: [240, 240], body: `<path d="${curve(0)}" fill="none" stroke="${seam}" stroke-width="15" stroke-linecap="round" opacity=".55"/><path d="${curve(0)}" fill="none" stroke="${seam}" stroke-width="2"/><path d="${rows}" fill="none" stroke="${stitch}" stroke-width="1.5" stroke-linecap="round"/>` };
  },









  golf({ colors: [shade, shine], r = 5.6 }) {
    const w = 15, h = w * Math.sqrt(3);
    const dimple = (x, y) => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${shade}" opacity=".55"/><circle cx="${n(x + .9)}" cy="${n(y + 1)}" r="${n(r * .55)}" fill="${shine}" opacity=".8"/>`;
    return { size: [w, n(h)], body: dimple(0, 0) + dimple(w, 0) + dimple(w / 2, h / 2) + dimple(0, h) + dimple(w, h) };
  },
  football({ colors: [lace, grain, seam] }) {
    // Lying on its side: laces run along the top, stripes ring both ends.
    let stitches = '';
    for (let x = 90; x <= 150; x += 10) stitches += `M${x} 44V60`;
    return {
      size: [240, 240],
      defs: tex => `<pattern id="${tex}" patternUnits="userSpaceOnUse" width="5" height="5"><circle cx="2.5" cy="2.5" r=".8" fill="${grain}" opacity=".35"/></pattern>`,
      body: tex => `<rect width="240" height="240" fill="url(#${tex})"/>`
        + `<path d="M-10 40Q120 62 250 40M-10 210Q120 188 250 210" fill="none" stroke="${seam}" stroke-width="1.4" opacity=".7"/>`
        + `<g transform="translate(1 1.6)" opacity=".35"><path d="M84 52H156" stroke="#1a0800" stroke-width="2"/><path d="${stitches}" stroke="#1a0800" stroke-width="3.6" stroke-linecap="round"/></g>`
        + `<path d="M84 52H156" stroke="${lace}" stroke-width="2"/><path d="${stitches}" stroke="${lace}" stroke-width="3.4" stroke-linecap="round"/>`
        + `<path d="M34 20Q46 120 34 220M46 20Q58 120 46 220M206 20Q194 120 206 220M194 20Q182 120 194 220" fill="none" stroke="${lace}" stroke-width="5"/>`,
    };
  },
};

const SHAPES = {
  leaf: (k, c, accent) => `<path d="M0 ${n(-k)}Q${n(.65 * k)} 0 0 ${n(k)}Q${n(-.65 * k)} 0 0 ${n(-k)}Z" fill="${c}"/><path d="M0 ${n(-.8 * k)}V${n(.9 * k)}" stroke="${accent}" stroke-width="${n(.08 * k)}"/>`,
  blossom: (k, c, accent) => `${[0, 72, 144, 216, 288].map(a => `<ellipse cy="${n(-.5 * k)}" rx="${n(.3 * k)}" ry="${n(.45 * k)}" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="${n(.2 * k)}" fill="${accent}"/>`,
};

// A generator may also return defs (for example a fine texture tile) that its
// body refers to; both receive the texture id.
// Generated tiles are cached per spec; ball layouts take a moment to work out.
const tiles = new Map();
function patternMarkup(id, spec) {
  const make = PATTERNS[spec.kind];
  if (!make) return '';
  const key = JSON.stringify(spec);
  if (!tiles.has(key)) tiles.set(key, make(spec));
  const { size: [w, h], transform, body, defs } = tiles.get(key);
  const tex = `${id}-texture`;
  const inner = typeof body === 'function' ? body(tex) : body;
  return `${defs ? defs(tex) : ''}<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}"${transform ? ` patternTransform="${transform}"` : ''}>${inner}</pattern>`;
}

export { PATTERNS, patternMarkup };
