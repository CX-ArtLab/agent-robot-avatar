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
