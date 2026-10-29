const variant = (source,label,english,colors,antenna,eyeColor) => ({
  source,label,english,antenna,
  palette:{baseColor:colors[0],bodyColor:colors[1],bodyEndColor:colors[2],
    secondaryColor:colors[3],reflectionColor:colors[3],edgeColor:colors[4],...(eyeColor ? {eyeColor} : {})},
});

export const glazeVariants = {
  jadeglaze:variant('blueglaze','亮釉翡翠绿','JADE GLAZE',
    ['#086953','#40c49b','#12856c','#b0f1d6','#ddfff0'],['#effff6','#50c99f','#126b57']),
  berryglaze:variant('blueglaze','亮釉莓果粉','BERRY GLAZE',
    ['#9e285f','#ec77ac','#c13b7b','#ffc6e4','#fff0f7'],['#fff1f8','#ed8cba','#a53169']),
  amberglaze:variant('blueglaze','亮釉琥珀橙','AMBER GLAZE',
    ['#ae531b','#f4b053','#db762b','#ffe1af','#fff3dc'],['#fff7dc','#f2b85e','#ad5e27']),
  irisglaze:variant('blueglaze','亮釉鸢尾紫','IRIS GLAZE',
    ['#5831a8','#aa83ef','#7846cf','#ddceff','#f4edff'],['#f7efff','#b18bed','#6440ac']),
  mintice:variant('iceglaze','冰透薄荷绿','MINT ICE',
    ['#8bbcae','#d7f0e5','#b3d8c9','#e9fff5','#f5fff9'],['#ffffff','#c4e6d7','#7fae9c']),
  blushice:variant('iceglaze','冰透樱花粉','BLUSH ICE',
    ['#c093ab','#f5dfe9','#e2bed0','#fff0f7','#fff8fc'],['#ffffff','#e8c9d9','#b28b9f']),
  champagneice:variant('iceglaze','冰透香槟金','CHAMPAGNE ICE',
    ['#c2ac81','#f4e9d2','#e0cda8','#fff6df','#fffaf0'],['#ffffff','#e7d8b9','#b4a078']),
  lavenderice:variant('iceglaze','冰透薰衣紫','LAVENDER ICE',
    ['#a89ac9','#e8e1f6','#cec1e8','#f4efff','#fbf8ff'],['#ffffff','#d8ceeb','#9f91bd'],'#304c6e'),
  blackglaze:variant('blueglaze','亮釉曜石黑','OBSIDIAN GLAZE',
    ['#090d14','#39434f','#101923','#94a5ba','#dce5ee'],['#d9e3ed','#4a596a','#101923'],'#ffffff'),
  whiteice:{...variant('iceglaze','冰透霜白','FROST WHITE ICE',
    ['#c0cdd6','#f6fbff','#dce8ef','#effaff','#ffffff'],['#ffffff','#e7f2f7','#abbfc9'],'#405765'),number:119},
};

export const glossGlazeNames = ['blueglaze',...Object.keys(glazeVariants).filter(name => glazeVariants[name].source === 'blueglaze')];
export const iceGlazeNames = ['iceglaze',...Object.keys(glazeVariants).filter(name => glazeVariants[name].source === 'iceglaze')];
