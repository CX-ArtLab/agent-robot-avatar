// Change hue while keeping each silver color's HSL lightness. White highlights
// stay white; reflection positions, stop offsets and opacity are untouched.
export function metalTint(color,family) {
  const channels = [1,3,5].map(offset => parseInt(color.slice(offset,offset+2),16)/255);
  const lightness = (Math.max(...channels)+Math.min(...channels))/2;
  const hue = family === 'gold' ? 44/60 : 22/60;
  const saturation = family === 'gold' ? .58 : .48;
  const c = (1-Math.abs(2*lightness-1))*saturation;
  const x = c*(1-Math.abs(hue%2-1)), m = lightness-c/2;
  return '#' + [c,x,0].map(value => Math.round((value+m)*255).toString(16).padStart(2,'0')).join('');
}

export const referenceMetalFinishes = {
  satinplatinum:{label:'铂金银',english:'PLATINUM',hue:210,saturation:.07,lift:.12},
  satinrose:{label:'玫瑰金',english:'ROSE GOLD',hue:12,saturation:.38,lift:.05},
  satinredcopper:{label:'暖红铜',english:'RED COPPER',hue:22,saturation:.55,lift:-.04},
  satinbronze:{label:'暖青铜',english:'BRONZE',hue:46,saturation:.38,lift:-.10},
  satingunmetal:{label:'枪灰钛',english:'GUNMETAL TITANIUM',hue:210,saturation:.14,lift:-.22},
};

export const deepSilverFinishes = {
  deepmetalgold:{label:'钛金',english:'TITANIUM GOLD',tint:'#dba63e'},
  deepmetalrose:{label:'玫瑰金',english:'DEEP ROSE GOLD',tint:'#d98980'},
  deepmetalcopper:{label:'红铜',english:'DEEP RED COPPER',tint:'#d77b45'},
  deepmetalbronze:{label:'青铜',english:'DEEP BRONZE',tint:'#aaa13b'},
  deepmetaltitanium:{label:'黑钛',english:'BLACK TITANIUM',tint:'#4b607b'},
  deepmetalplatinum:{label:'铂金白',english:'PLATINUM WHITE',tint:'#c6cbd2',tonePower:.52,eye:'#43515c',
    description:'浅白低饱和 · 柔和映照 · 立体天线'},
  deepmetalchampagne:{label:'浅香槟',english:'PALE CHAMPAGNE',tint:'#d2ba8b',tonePower:.72,eye:'#795b36',
    description:'浅暖香槟 · 低饱和金属 · 柔和映照'},
  deepmetaliceblue:{label:'冰蓝钛',english:'ICE BLUE TITANIUM',tint:'#71b6da',tonePower:.82,eye:'#275772',
    description:'清亮冰蓝 · 中浅色调 · 柔和反光'},
  deepmetalviolet:{label:'紫钛',english:'VIOLET TITANIUM',tint:'#9c4bd5',tonePower:1.12,
    description:'鲜艳紫钛 · 深色弧面 · 明亮反射'},
  deepmetalforest:{label:'深墨绿',english:'FOREST GREEN METAL',tint:'#537d6d',tonePower:1.8,
    description:'低饱和墨绿 · 深色金属 · 柔和反光'},
  // iPhone back-color inspirations, adapted to the existing silver lighting.
  // These are display palettes, not official measured color specifications.
  iphonenatural:{number:147,label:'原色钛',english:'NATURAL TITANIUM',tint:'#b4aea3',tonePower:.72,eye:'#59534b',
    description:'iPhone 15 Pro · 暖灰原钛 · 配色灵感'},
  iphonedeepurple:{number:148,label:'暗紫',english:'DEEP PURPLE',tint:'#76647f',tonePower:1.75,
    description:'iPhone 14 Pro · 低饱和暗紫 · 配色灵感'},
  iphoneultramarine:{number:149,label:'群青',english:'ULTRAMARINE',tint:'#5368d4',tonePower:1.06,
    description:'iPhone 16 · 鲜明蓝紫 · 配色灵感'},
  iphoneteal:{number:150,label:'深青',english:'TEAL',tint:'#4e9b98',tonePower:.95,
    description:'iPhone 16 · 蓝调青绿 · 配色灵感'},
  iphonepink:{number:151,label:'浅粉',english:'SOFT PINK',tint:'#edc2cb',tonePower:.47,eye:'#804d61',
    description:'iPhone 15 · 柔淡浅粉 · 配色灵感'},
  iphonesage:{number:152,label:'鼠尾草绿',english:'SAGE',tint:'#9ca98c',tonePower:.7,eye:'#4b6041',
    description:'iPhone 17 · 柔淡草绿 · 配色灵感'},
  iphonelavender:{number:153,label:'薰衣草紫',english:'LAVENDER',tint:'#b5a9d0',tonePower:.64,eye:'#61517d',
    description:'iPhone 17 · 轻浅淡紫 · 配色灵感'},
  iphonecosmicorange:{number:154,label:'星宇橙',english:'COSMIC ORANGE',tint:'#ed6b26',tonePower:.96,
    description:'iPhone 17 Pro · 鲜明暖橙 · 配色灵感'},
  iphoneburgundy:{number:155,label:'勃艮第酒红',english:'BURGUNDY',tint:'#852545',tonePower:1.85,
    description:'iPhone 18 Pro · 浓郁酒红 · 配色灵感'},
};

export function referenceMetalTint(color,finish) {
  const rgb = [1,3,5].map(offset => parseInt(color.slice(offset,offset+2),16)/255);
  if (deepSilverFinishes[finish]) {
    // The approved five keep their luma. Only the new light/dark finishes use
    // a monotonic tone curve; light geometry, opacity and white stay intact.
    const finishTone = deepSilverFinishes[finish];
    const luma = channels => .2126*channels[0] + .7152*channels[1] + .0722*channels[2];
    const value = finishTone.tonePower ? Math.pow(luma(rgb),finishTone.tonePower) : luma(rgb);
    const tint = [1,3,5].map(offset => parseInt(finishTone.tint.slice(offset,offset+2),16)/255);
    const neutral = luma(tint);
    const chroma = tint.map(channel => channel-neutral);
    // The bright reflection tends to white; no extra lift or crushed blacks.
    const amount = Math.min(4*value*(1-value),...chroma.map(channel =>
      channel > 0 ? (1-value)/channel : channel < 0 ? -value/channel : Infinity));
    return '#' + chroma.map(channel => Math.round(Math.max(0,Math.min(1,value+channel*amount))*255).toString(16).padStart(2,'0')).join('');
  }
  const original = (Math.max(...rgb)+Math.min(...rgb))/2;
  if (original > .94 || original < .03) return color;
  const tone = referenceMetalFinishes[finish];
  const lightness = Math.max(0,Math.min(1,original + tone.lift*(tone.lift>0 ? 1-original : 4*original*(1-original))));
  const hue = tone.hue/60, c = (1-Math.abs(2*lightness-1))*tone.saturation;
  const x = c*(1-Math.abs(hue%2-1)), m = lightness-c/2;
  const channels = [[c,x,0],[x,c,0],[0,c,x],[0,x,c],[x,0,c],[c,0,x]][Math.floor(hue)];
  return '#' + channels.map(value => Math.round((value+m)*255).toString(16).padStart(2,'0')).join('');
}
