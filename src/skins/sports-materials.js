const SPORTS = new Set(['basketball', 'baseball']);

export function sportsTexture(defs, id, kind, el, gradient) {
  if (!SPORTS.has(kind)) return null;
  const p = el('pattern', {id,width:240,height:240,patternUnits:'userSpaceOnUse'}, defs);
  const path = (d, stroke, width=1, fill='none', opacity=1, parent=p) =>
    el('path', {d,stroke,'stroke-width':width,fill,opacity,'stroke-linecap':'round','stroke-linejoin':'round'}, parent);
  // Small deterministic surface marks, with larger seams legible at 118 px.
  if (['basketball','tennis','baseball'].includes(kind)) {
    const grain = el('pattern', {id:`${id}-grain`,width:8,height:8,patternUnits:'userSpaceOnUse'}, defs);
    {
      el('circle', {cx:2,cy:2,r:kind==='basketball'?1.05:.45,fill:kind==='basketball'?'#7f3918':'#9b8c73',opacity:.25}, grain);
      el('circle', {cx:6,cy:6,r:.7,fill:'#fff7de',opacity:.25}, grain);
    }
    el('rect', {width:240,height:240,fill:`url(#${id}-grain)`}, p);
  }
  if (kind === 'basketball') {
    const seams = 'M119 0C107 67 106 160 125 240M0 145C65 160 168 157 240 132M29 0C113 47 76 98 0 117M204 0C130 54 166 101 240 111';
    path(seams, '#ffca7a', 6, 'none', .4);
    path(seams, '#562d21', 3.7);
    path(seams, '#271d1b', 1.2, 'none', .55);
  } else if (kind === 'baseball') {
    for (const side of [-1,1]) {
      const xAt = y => 120 + side * (54 + 28 * Math.sin(Math.PI * (y-20)/200));
      let d = '';
      for (let y=0;y<=240;y+=4) d += `${y===0?'M':'L'}${xAt(y)} ${y}`;
      path(d, '#b9a995', 3, 'none', .45);
      path(d, '#a64d48', 1.3);
      for (let y=17;y<232;y+=11) {
        const x=xAt(y);
        path(`M${x-5} ${y-3}L${x} ${y+1}L${x+5} ${y-3}`, '#b63d44', 2.3);
        el('circle', {cx:x-5,cy:y-3,r:1.2,fill:'#793b3c'}, p);
        el('circle', {cx:x+5,cy:y-3,r:1.2,fill:'#793b3c'}, p);
      }
    }
  }
  return p;
}
