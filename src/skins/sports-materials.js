import { skin } from './more-materials.js';

export const sportsSkins = {
  football: skin('经典足球', 'FOOTBALL', '黑白拼片 · 五边球纹 · 柔亮皮面',
    ['#ffffff','#f3f4ed','#dfe4da','#acb8ae'], '#397c65', '#ffffff', ['#eaf2e5','#c8d9c3'], {pattern:'football',shine:.32,shade:.29}),
  basketball: skin('橘子篮球', 'BASKETBALL', '暖橙皮面 · 弧形沟槽 · 细密颗粒',
    ['#ffbd63','#ed8836','#d26320','#93421c'], '#fff4d9', '#ffd29a', ['#f8e8d6','#dfc2a3'], {pattern:'basketball',shine:.16,shade:.32,matte:true}),
  tennis: skin('活力网球', 'TENNIS', '荧光黄绿 · 奶白弯线 · 绒毛球面',
    ['#f0ff94','#d0ec43','#acd027','#75951b'], '#334c22', '#f5ffbf', ['#f3f6dc','#d8e4b8'], {pattern:'tennis',shine:.09,shade:.22,matte:true}),
  baseball: skin('红线棒球', 'BASEBALL', '象牙白皮 · 红色双缝线 · 复古球场',
    ['#fffdf4','#f3eee0','#e2dccb','#bfb7a4'], '#364e65', '#fffdf0', ['#edf1f5','#d2dce5'], {pattern:'baseball',shine:.2,shade:.24,matte:true}),
  volleyball: skin('晴空排球', 'VOLLEYBALL', '蓝黄拼色 · 旋转分片 · 饱满光泽',
    ['#fffef7','#f5f1e4','#deded5','#b0bfc5'], '#243b58', '#fff6d1', ['#e9f5fa','#c5e1ed'], {pattern:'volleyball',shine:.38,shade:.27}),
};

export function sportsTexture(defs, id, kind, el, gradient) {
  if (!(kind in sportsSkins)) return null;
  const p = el('pattern', {id,width:240,height:240,patternUnits:'userSpaceOnUse'}, defs);
  const path = (d, stroke, width=1, fill='none', opacity=1, parent=p) =>
    el('path', {d,stroke,'stroke-width':width,fill,opacity,'stroke-linecap':'round','stroke-linejoin':'round'}, parent);
  // Small deterministic surface marks, with larger seams legible at 118 px.
  if (['basketball','tennis','baseball'].includes(kind)) {
    const grain = el('pattern', {id:`${id}-grain`,width:8,height:8,patternUnits:'userSpaceOnUse'}, defs);
    if (kind === 'tennis') {
      path('M1 2l2-1M5 5l1 2', '#fbffce', .8, 'none', .38, grain);
    } else {
      el('circle', {cx:2,cy:2,r:kind==='basketball'?1.05:.45,fill:kind==='basketball'?'#7f3918':'#9b8c73',opacity:.25}, grain);
      el('circle', {cx:6,cy:6,r:.7,fill:'#fff7de',opacity:.25}, grain);
    }
    el('rect', {width:240,height:240,fill:`url(#${id}-grain)`}, p);
  }
  if (kind === 'football') {
    gradient(defs, 'linearGradient', `${id}-patch`, {x1:'0',y1:'0',x2:'.8',y2:'1'}, [[0,'#49565b'],[.5,'#263337'],[1,'#142025']]);
    path('M120 32L150 53 139 86H101L90 53Z M15 104L40 85 58 102 50 133 19 143Z M225 104L200 85 182 102 190 133 221 143Z M50 167L82 166 99 193 80 221 43 209Z M190 167L158 166 141 193 160 221 197 209Z', '#566261', 1.5, `url(#${id}-patch)`);
    path('M120 32V0M90 53L58 36 40 85M150 53L182 36 200 85M101 86L81 121 58 102M139 86L159 121 182 102M81 121L82 166M159 121L158 166M50 133L50 167M190 133L190 167M99 193H141M80 221L85 240M160 221L155 240', '#7d8d87', 1.5, 'none', .65);
  } else if (kind === 'basketball') {
    const seams = 'M119 0C107 67 106 160 125 240M0 145C65 160 168 157 240 132M29 0C113 47 76 98 0 117M204 0C130 54 166 101 240 111';
    path(seams, '#ffca7a', 6, 'none', .4);
    path(seams, '#562d21', 3.7);
    path(seams, '#271d1b', 1.2, 'none', .55);
  } else if (kind === 'tennis') {
    const seams = 'M24 5C105 45 78 94 43 116C6 140 35 199 88 236M216 5C135 45 162 94 197 116C234 140 205 199 152 236';
    path(seams, '#7c9c26', 9, 'none', .48);
    path(seams, '#faf9da', 5.5);
    path(seams, '#ffffff', 1.5, 'none', .6);
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
  } else if (kind === 'volleyball') {
    gradient(defs, 'linearGradient', `${id}-blue`, {x1:'0',y1:'0',x2:'1',y2:'1'}, [[0,'#59b8eb'],[.45,'#277ec9'],[1,'#174c99']]);
    gradient(defs, 'linearGradient', `${id}-yellow`, {x1:'0',y1:'0',x2:'.8',y2:'1'}, [[0,'#fff18b'],[.5,'#f7cf42'],[1,'#dda122']]);
    const blue = `url(#${id}-blue)`, yellow = `url(#${id}-yellow)`;
    path('M0 0H240V36C166 21 126 38 104 74C65 78 28 62 0 43Z', '#296fa5', 1.5, blue);
    path('M0 43C28 62 65 78 104 74C142 67 175 66 240 83V110C162 83 143 95 108 96C57 100 21 83 0 71Z', '#c8a44c', 1.2, yellow);
    path('M240 110V240H175C211 183 200 140 180 103Z', '#296fa5', 1.5, blue);
    path('M180 103C200 140 211 183 175 240H143C183 181 174 146 156 99Z', '#c8a44c', 1.2, yellow);
    path('M143 240H0V173C49 210 93 204 163 169C160 194 153 219 143 240Z', '#296fa5', 1.5, blue);
    path('M0 173V145C51 188 101 176 168 148L163 169C93 204 49 210 0 173Z', '#c8a44c', 1.2, yellow);
    path('M12 24C83 57 122 5 230 21M224 125C239 169 216 210 206 228M18 210C63 230 101 209 135 202', '#e4f7ff', 1.5, 'none', .38);
  }
  return p;
}
