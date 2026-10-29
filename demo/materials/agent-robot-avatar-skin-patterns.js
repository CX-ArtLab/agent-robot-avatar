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

// A small 3D helper for balls: polygons on a unit sphere are rotated, their
// edges bent along the surface, and drawn back to front with an orthographic
// view centred on the head.
const norm = ([x, y, z]) => { const l = Math.hypot(x, y, z) || 1; return [x / l, y / l, z / l]; };
const mixv = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function rotate([x, y, z], [yaw, pitch, roll]) {
  let c = Math.cos(yaw), s = Math.sin(yaw);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(pitch); s = Math.sin(pitch);
  [y, z] = [y * c - z * s, y * s + z * c];
  c = Math.cos(roll); s = Math.sin(roll);
  [x, y] = [x * c - y * s, x * s + y * c];
  return [x, y, z];
}
function sphereFaces(faces, angles, radius, cx = 120, cy = 120, steps = 6) {
  const drawn = [];
  for (const face of faces) {
    const points = face.points.map(p => rotate(norm(p), angles));
    const center = norm(points.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]));
    if (center[2] < -.35) continue;
    let d = '';
    points.forEach((p, i) => {
      const q = points[(i + 1) % points.length];
      for (let k = 0; k < steps; k++) {
        const [x, y] = norm(mixv(p, q, k / steps));
        d += `${i || k ? 'L' : 'M'}${n(cx + x * radius)} ${n(cy + y * radius)}`;
      }
    });
    drawn.push({ z: center[2], d: `${d}Z`, face, center: [cx + center[0] * radius, cy + center[1] * radius] });
  }
  return drawn.sort((a, b) => a.z - b.z);
}

function truncatedIcosahedron() {
  const t = (1 + Math.sqrt(5)) / 2;
  const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  const edge = Math.hypot(...v[0].map((x, i) => x - v[1][i]));
  const near = (a, b) => Math.abs(Math.hypot(...v[a].map((x, i) => x - v[b][i])) - edge) < 1e-6;
  const faces = [];
  // Pentagons around each icosahedron vertex, hexagons inside each triangle.
  const order = (center, pts) => {
    const c = norm(center), up = Math.abs(c[1]) < .9 ? [0, 1, 0] : [1, 0, 0];
    const ux = norm([up[1] * c[2] - up[2] * c[1], up[2] * c[0] - up[0] * c[2], up[0] * c[1] - up[1] * c[0]]);
    const uy = [c[1] * ux[2] - c[2] * ux[1], c[2] * ux[0] - c[0] * ux[2], c[0] * ux[1] - c[1] * ux[0]];
    return pts.sort((a, b) => Math.atan2(a.reduce((s, x, i) => s + x * uy[i], 0), a.reduce((s, x, i) => s + x * ux[i], 0)) - Math.atan2(b.reduce((s, x, i) => s + x * uy[i], 0), b.reduce((s, x, i) => s + x * ux[i], 0)));
  };
  for (let a = 0; a < 12; a++) {
    const pts = [];
    for (let b = 0; b < 12; b++) if (b !== a && near(a, b)) pts.push(mixv(v[a], v[b], 1 / 3));
    faces.push({ kind: 'pentagon', points: order(v[a], pts) });
  }
  for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) for (let c = b + 1; c < 12; c++) {
    if (!near(a, b) || !near(b, c) || !near(a, c)) continue;
    const pts = [mixv(v[a], v[b], 1 / 3), mixv(v[a], v[b], 2 / 3), mixv(v[b], v[c], 1 / 3), mixv(v[b], v[c], 2 / 3), mixv(v[c], v[a], 1 / 3), mixv(v[c], v[a], 2 / 3)];
    faces.push({ kind: 'hexagon', points: order(mixv(mixv(v[a], v[b], .5), v[c], 1 / 3), pts) });
  }
  return faces;
}

function icosahedron() {
  const t = (1 + Math.sqrt(5)) / 2;
  const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(norm);
  const edge = Math.hypot(...v[0].map((x, i) => x - v[1][i]));
  const near = (a, b) => Math.abs(Math.hypot(...v[a].map((x, i) => x - v[b][i])) - edge) < 1e-6;
  const triangles = [];
  for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) for (let c = b + 1; c < 12; c++) {
    if (near(a, b) && near(b, c) && near(a, c)) triangles.push([v[a], v[b], v[c]]);
  }
  return { vertices: v, triangles };
}

// A circle on the unit sphere around a direction, as a polygon.
function sphereCircle(center, radius, steps = 40) {
  const c = norm(center), up = Math.abs(c[1]) < .9 ? [0, 1, 0] : [1, 0, 0];
  const ux = norm([up[1] * c[2] - up[2] * c[1], up[2] * c[0] - up[0] * c[2], up[0] * c[1] - up[1] * c[0]]);
  const uy = [c[1] * ux[2] - c[2] * ux[1], c[2] * ux[0] - c[0] * ux[2], c[0] * ux[1] - c[1] * ux[0]];
  const points = [];
  for (let i = 0; i < steps; i++) {
    const a = i / steps * Math.PI * 2, s = Math.sin(radius), k = Math.cos(radius);
    points.push(norm([c[0] * k + (ux[0] * Math.cos(a) + uy[0] * Math.sin(a)) * s, c[1] * k + (ux[1] * Math.cos(a) + uy[1] * Math.sin(a)) * s, c[2] * k + (ux[2] * Math.cos(a) + uy[2] * Math.sin(a)) * s]));
  }
  return points;
}

function cubePanels() {
  // Six panel groups, one per cube face, each cut into three strips; neighbouring
  // groups run at right angles, as on an indoor volleyball.
  const faces = [];
  const axes = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
  for (const [ai, bi, ci] of axes) for (const sign of [1, -1]) {
    for (let k = 0; k < 3; k++) {
      const corner = (u, w) => { const p = [0, 0, 0]; p[ai] = sign; p[bi] = u; p[ci] = w; return p; };
      const u0 = -1 + k * 2 / 3, u1 = u0 + 2 / 3;
      const pts = [];
      for (let i = 0; i <= 4; i++) pts.push(corner(u0, -1 + i / 2));
      for (let i = 0; i <= 4; i++) pts.push(corner(u1, 1 - i / 2));
      faces.push({ kind: 'strip', strip: k, group: ai * 2 + (sign > 0 ? 0 : 1), points: pts });
    }
  }
  return faces;
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
  },  swirl({ colors, seed = 73 }) {
    // Soft marbled resin: wide translucent loops with a few thin bright threads.
    const random = rng(seed);
    let body = '';
    for (let i = 0; i < 9; i++) {
      const color = colors[i % colors.length], x = random() * 240, y = random() * 240, r = 40 + random() * 70;
      const d = `M${n(x - r)} ${n(y)}C${n(x - r)} ${n(y - r * 1.1)} ${n(x + r)} ${n(y - r * .6)} ${n(x + r * .6)} ${n(y + r * .2)}S${n(x - r * .2)} ${n(y + r)} ${n(x - r * .8)} ${n(y + r * .5)}`;
      body += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${n(14 + random() * 20)}" stroke-linecap="round" opacity="${n(.22 + random() * .2)}"/>`;
      if (i % 3 === 0) body += `<path d="${d}" fill="none" stroke="#ffffff" stroke-width="1" opacity=".35"/>`;
    }
    return { size: [240, 240], body };
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
  soccer({ colors: [light, line] }) {
    // A pitch seen from above: mowing stripes, touchlines, the halfway line and a
    // centre circle that the two eyes stand in, with a penalty area at each end.
    let stripes = '';
    for (let x = 0; x < 240; x += 40) stripes += `<rect x="${x}" width="20" height="240" fill="${light}" opacity=".22"/>`;
    const box = side => {
      const x0 = side < 0 ? 34 : 206, d = side < 0 ? 1 : -1;
      return `M${x0} 80H${x0 + d * 30}V160H${x0}M${x0} 102H${x0 + d * 12}V138H${x0}M${x0 + d * 30} 104A22 22 0 0 ${side < 0 ? 1 : 0} ${x0 + d * 30} 136`;
    };
    const lines = `M34 40H206V200H34ZM120 40V200M120 61A59 59 0 0 1 120 179A59 59 0 0 1 120 61Z${box(-1)}${box(1)}`
      + 'M34 48A8 8 0 0 0 42 40M198 40A8 8 0 0 0 206 48M206 192A8 8 0 0 0 198 200M42 200A8 8 0 0 0 34 192';
    return { size: [240, 240], body: `${stripes}<path d="${lines}" fill="none" stroke="${line}" stroke-width="2.6" stroke-linejoin="round" opacity=".92"/><circle cx="120" cy="120" r="2.6" fill="${line}"/>` };
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

  volleyball({ colors, seam, radius = 150, angles = [-.422, .38, 4], clear = [[86, 126], [154, 126]] }) {
    // Leather panels that puff up like the real ball: every panel is white in the
    // middle and darkens softly toward its seams, and the seams are deep grooves.
    // Three panel groups meet on the forehead; around the eyes the shading fades
    // out so the eyes never sit on a seam.
    const drawn = sphereFaces(cubePanels(), angles, radius, 120, 120, 10);
    const grooves = drawn.map(f => f.d).join('');
    const puff = drawn.map((f, i) => `<g clip-path="url(#__TEX__-c${i})">`
      + `<path d="${f.d}" fill="none" stroke="${seam}" stroke-width="16" stroke-linejoin="round" opacity=".42" filter="url(#__TEX__-soft)"/>`
      + '</g>').join('');
    return {
      size: [240, 240],
      defs: tex => drawn.map((f, i) => `<clipPath id="${tex}-c${i}"><path d="${f.d}"/></clipPath>`).join('')
        + `<filter id="${tex}-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>`
        + `<radialGradient id="${tex}-fade"><stop offset=".6" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`
        + `<mask id="${tex}-clear" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="-20" y="-20" width="280" height="280"><rect x="-20" y="-20" width="280" height="280" fill="#fff"/>`
        + clear.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="48" ry="44" fill="url(#${tex}-fade)"/>`).join('') + '</mask>',
      body: tex => drawn.map(f => `<path d="${f.d}" fill="${colors[0]}"/>`).join('')
        + `<g mask="url(#${tex}-clear)">${puff.replaceAll('__TEX__', tex)}`
        + `<path d="${grooves}" fill="none" stroke="#ffffff" stroke-width="1.3" stroke-linejoin="round" opacity=".9" transform="translate(.9 1.3)"/>`
        + `<path d="${grooves}" fill="none" stroke="${seam}" stroke-width="2.6" stroke-linejoin="round" opacity=".85"/></g>`,
    };
  },








  golf({ colors: [shade, shine], r = 5.6 }) {
    const w = 15, h = w * Math.sqrt(3);
    const dimple = (x, y) => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${shade}" opacity=".55"/><circle cx="${n(x + .9)}" cy="${n(y + 1)}" r="${n(r * .55)}" fill="${shine}" opacity=".8"/>`;
    return { size: [w, n(h)], body: dimple(0, 0) + dimple(w, 0) + dimple(w / 2, h / 2) + dimple(0, h) + dimple(w, h) };
  },
  beachball({ colors }) {
    let body = '';
    const pole = [120, 8], count = colors.length;
    for (let i = 0; i < count; i++) {
      const a0 = Math.PI * (.08 + .84 * i / count), a1 = Math.PI * (.08 + .84 * (i + 1) / count);
      body += `<path d="M${pole[0]} ${pole[1]}L${n(pole[0] + Math.cos(a0) * 400)} ${n(pole[1] + Math.sin(a0) * 400)}L${n(pole[0] + Math.cos(a1) * 400)} ${n(pole[1] + Math.sin(a1) * 400)}Z" fill="${colors[i]}"/>`;
    }
    let edges = '';
    for (let i = 1; i < count; i++) {
      const a = Math.PI * (.08 + .84 * i / count);
      edges += `M${pole[0]} ${pole[1]}L${n(pole[0] + Math.cos(a) * 400)} ${n(pole[1] + Math.sin(a) * 400)}`;
    }
    return { size: [240, 240], body: `${body}<path d="${edges}" stroke="#000000" stroke-width="2.2" opacity=".1"/><path d="${edges}" stroke="#ffffff" stroke-width=".9" opacity=".5" transform="translate(-1 0)"/><circle cx="${pole[0]}" cy="${pole[1] + 18}" r="16" fill="#ffffff"/>` };
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
