// Generic module artwork for presets without a reference frame SVG. The
// result has the same shape as DISPLAY_FRAMES entries (millimetres, viewBox
// at 0 0), so rotation and scaling treat both kinds of housing alike.
const BOARD_MARGIN = 1;
const BOARD_GOLD = '#c9a64e';

function pitchOf(preset) {
  const mm = preset.diag * 25.4;
  return preset.frame === 'round' ? mm / preset.width : mm / Math.hypot(preset.width, preset.height);
}

function buildBoard(preset) {
  const b = preset.board;
  const f = n => +n.toFixed(3);
  const [bw, bh] = b.box;
  const width = bw + BOARD_MARGIN * 2;
  const height = bh + BOARD_MARGIN * 2;
  const pitch = pitchOf(preset);
  const aw = preset.width * pitch;
  const ah = preset.height * pitch;
  const g = b.glass;
  const [ox, oy] = g.activeOffset || [0, 0];
  const body = b.body;
  const edge = 'stroke="rgba(0,0,0,.35)" stroke-width=".25"';
  const glass = attrs => g.shape === 'circle'
    ? `<circle cx="${f(g.x || 0)}" cy="${f(g.y || 0)}" r="${f(g.d / 2)}" ${attrs}/>`
    : `<rect x="${f((g.x || 0) - g.w / 2)}" y="${f((g.y || 0) - g.h / 2)}" width="${g.w}" height="${g.h}" rx="${g.r || .4}" ${attrs}/>`;
  const outline = attrs => body.shape === 'circle'
    ? `<circle cx="0" cy="${body.y || 0}" r="${body.d / 2}" ${attrs}/>`
    : `<rect x="${f(-body.w / 2)}" y="${f(-body.h / 2)}" width="${body.w}" height="${body.h}" rx="${body.r || 0}" ${attrs}/>`;

  const out = [];
  if (body.shape === 'circle' && body.tab) {
    const t = body.tab;
    out.push(`<rect x="${f(-t.w / 2)}" y="${f(t.y - t.h / 2)}" width="${t.w}" height="${t.h}" rx="1" fill="${body.color}" ${edge}/>`);
  }
  out.push(outline(`fill="${body.color}" ${edge}`));
  if (body.shape === 'circle' && body.tab) {
    const t = body.tab;
    out.push(`<rect x="${f(-t.w / 2 + .13)}" y="${f(t.y - t.h / 2 - 1)}" width="${f(t.w - .26)}" height="2" fill="${body.color}"/>`);
  }
  if (body.ring) {
    const r = body.ring.d / 2 - body.ring.w / 2;
    out.push(`<circle cx="0" cy="${body.y || 0}" r="${f(r)}" fill="none" stroke="${body.ring.color}" stroke-width="${body.ring.w}"/>`);
    let ticks = '';
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * Math.PI * 2, r1 = body.ring.d / 2 - body.ring.w + .5, r2 = body.ring.d / 2 - .3;
      ticks += `M${f(Math.cos(a) * r1)} ${f(Math.sin(a) * r1)}L${f(Math.cos(a) * r2)} ${f(Math.sin(a) * r2)}`;
    }
    out.push(`<path d="${ticks}" stroke="rgba(0,0,0,.22)" stroke-width=".22"/>`);
  }
  out.push(outline('fill="url(#gen-sheen)"'));
  for (const p of b.parts) {
    if (p.t === 'pins') {
      for (let i = 0; i < p.n; i++) {
        const o = (i - (p.n - 1) / 2) * 2.54;
        const x = p.dir === 'v' ? p.x : p.x + o, y = p.dir === 'v' ? p.y + o : p.y;
        out.push(`<circle cx="${f(x)}" cy="${f(y)}" r=".86" fill="${BOARD_GOLD}"/><rect x="${f(x - .32)}" y="${f(y - .32)}" width=".64" height=".64" fill="#d8d8d8" stroke="#8b8b8b" stroke-width=".08"/>`);
        if (p.labels && p.labels[i]) {
          const lx = p.dir === 'v' ? x + 2.1 : x, ly = p.dir === 'v' ? y + .35 : y + (p.y < 0 ? 2.25 : -1.45);
          out.push(`<text x="${f(lx)}" y="${f(ly)}" font-size=".95" text-anchor="${p.dir === 'v' ? 'start' : 'middle'}" fill="rgba(255,255,255,.7)" font-family="Arial,Helvetica,sans-serif">${p.labels[i]}</text>`);
        }
      }
    } else if (p.t === 'holes') {
      for (const [x, y] of p.pts) out.push(`<circle cx="${x}" cy="${y}" r="${f(p.d / 2 + .6)}" fill="${BOARD_GOLD}"/><circle cx="${x}" cy="${y}" r="${f(p.d / 2)}" style="fill:var(--stage-bg)"/>`);
    } else if (p.t === 'usb') {
      out.push(`<g transform="translate(${p.x} ${p.y}) rotate(${p.rot})"><rect x="-4.5" y="-1.65" width="9" height="3.3" rx="1.3" fill="url(#gen-metal)" stroke="#6f7378" stroke-width=".15"/><rect x="-3.4" y="-.55" width="6.8" height="1.1" rx=".5" fill="#2b2d31"/></g>`);
    } else if (p.t === 'button') {
      out.push(`<rect x="${f(p.x - p.w / 2)}" y="${f(p.y - p.h / 2)}" width="${p.w}" height="${p.h}" rx=".6" fill="${p.color}" stroke="rgba(0,0,0,.35)" stroke-width=".15"/><rect x="${f(p.x - p.w / 2 + .4)}" y="${f(p.y - p.h / 2 + .3)}" width="${f(p.w - .8)}" height="${f(p.h * .4)}" rx=".4" fill="rgba(255,255,255,.12)"/>`);
    } else if (p.t === 'label') {
      out.push(`<text x="${p.x}" y="${p.y}" font-size="${p.size}" text-anchor="middle" fill="${p.color}" font-family="Arial,Helvetica,sans-serif" font-weight="700">${p.text}</text>`);
    } else if (p.t === 'fpc') {
      out.push(`<rect x="${f(p.x - p.w / 2)}" y="${f(p.y - p.h / 2)}" width="${p.w}" height="${p.h}" fill="#c98a2b" opacity=".9"/>`);
    } else if (p.t === 'chip') {
      out.push(`<rect x="${f(p.x - p.w / 2)}" y="${f(p.y - p.h / 2)}" width="${p.w}" height="${p.h}" rx=".3" fill="#1c1d20" stroke="#3a3c40" stroke-width=".12"/>`);
    } else if (p.t === 'dot') {
      out.push(`<circle cx="${p.x}" cy="${p.y}" r="${p.d / 2}" fill="${p.color}"/>`);
    }
  }
  out.push(glass('fill="#070809" stroke="rgba(255,255,255,.07)" stroke-width=".2"'));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(width)} ${f(height)}"><defs>`
    + '<linearGradient id="gen-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6e8eb"/><stop offset="1" stop-color="#9a9ea4"/></linearGradient>'
    + `<linearGradient id="gen-sheen" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${body.plastic ? .16 : .07}"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${body.plastic ? .18 : .1}"/></linearGradient>`
    + `</defs><g transform="translate(${f(width / 2)} ${f(height / 2)})">${out.join('')}</g></svg>`;
  const ax = (g.x || 0) + ox - aw / 2 + width / 2;
  const ay = (g.y || 0) + oy - ah / 2 + height / 2;
  return { name: preset.name, width, height, display: [ax, ay, aw, ah], svg, generic: true };
}
