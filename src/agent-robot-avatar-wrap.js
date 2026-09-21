// Both eyes lie on the same rotating surface. Position and foreshortening
// must be projected together, otherwise the eyes overlap or hit the head edge.
export const WRAP_CYCLE = 2400;
const RADIUS = 85;
const EYE_ANGLE = Math.asin(34 / RADIUS);
const HALF_WIDTH = 27 / Math.cos(EYE_ANGLE);
const FRAMES = [
  [0, 0, null],
  [834, -Math.PI / 2 + EYE_ANGLE, [.6123122262631361,0,.8763337613684284,.3403039133642485]],
  [996, -Math.PI / 2 - EYE_ANGLE, null],
  [1260, -3 * Math.PI / 2 + EYE_ANGLE, null],
  [1390, -3 * Math.PI / 2 - EYE_ANGLE, null],
  [2400, -2 * Math.PI, [.16771539711108435,.7245980352977247,.32366613843706765,1]],
];

function progress(t, curve) {
  if (!curve || t <= 0 || t >= 1) return t;
  const b = (s,a,z) => 3*(1-s)*(1-s)*s*a + 3*(1-s)*s*s*z + s*s*s;
  let lo=0,hi=1;
  for (let i=0;i<24;i++) { const mid=(lo+hi)/2; if(b(mid,curve[0],curve[2])<t)lo=mid;else hi=mid; }
  return b((lo+hi)/2,curve[1],curve[3]);
}

export function wrapEyeHeight(width) {
  // Optical compensation: a narrow eye reads taller than a round one.
  // Keep the frontal height, then shorten smoothly toward the side profile.
  const side=Math.max(0,Math.min(1,1-width/54));
  return 58-18*side*side*(3-2*side);
}

export function wrapEyeX(x, width) {
  // Close the gap to the head's 94-unit silhouette only as the eye narrows.
  // The cubic keeps the round frontal eye untouched and approaches the edge
  // tangentially, instead of pushing a full-size ellipse through the clip.
  const side=Math.max(0,Math.min(1,1-width/54));
  return x+Math.sign(x-120)*9*side**3;
}

export function sampleWrapPose(elapsed) {
  const time=Math.max(0,Math.min(WRAP_CYCLE,elapsed));
  const index=Math.max(1,FRAMES.findIndex(frame=>frame[0]>=time));
  const a=FRAMES[index-1],b=FRAMES[index],t=progress((time-a[0])/(b[0]-a[0]),b[2]);
  const angle=a[1]+(b[1]-a[1])*t;
  const pose={};
  for(const [side,offset] of [['left',-EYE_ANGLE],['right',EYE_ANGLE]]) {
    const eyeAngle=angle+offset;
    const front=Math.cos(eyeAngle);
    pose[side+'Y']=126;
    pose[side+'Width']=front>1e-10?2*HALF_WIDTH*front:0;
    pose[side+'X']=wrapEyeX(120+RADIUS*Math.sin(eyeAngle),pose[side+'Width']);
    pose[side+'Height']=wrapEyeHeight(pose[side+'Width']);
    pose[side+'Opacity']=1;
  }
  return pose;
}

export function drawWrapWaiting(instance, elapsed) {
  const pose=sampleWrapPose(elapsed);
  for(const side of ['left','right']) {
    instance['_'+side+'Eye'].setAttribute('transform',`translate(${pose[side+'X']} 126)`);
    const eye=instance['_'+side+'Base'];
    eye.setAttribute('rx',pose[side+'Width']/2);eye.setAttribute('ry',pose[side+'Height']/2);
    eye.setAttribute('opacity','1');
    instance['_'+side+'InputBase'].setAttribute('opacity','0');
  }
}
