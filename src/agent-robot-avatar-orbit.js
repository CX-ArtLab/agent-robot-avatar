// Approved orbit waiting poses. Eye Y remains at the default 126 throughout.
export const ORBIT_CYCLE = 2400;
const FRAMES = [
  [0, [86,54,58,154,54,58], null],
  [834, [32,0,50,47,31,58], [.6123122262631361,-.01552397731489652,.8763337613684284,.3403039133642485]],
  [996, [98.47435937683403,0,53.30307375785511,30,0,54.69692624214489], null],
  [1260, [210,0,57.999969473202164,209.99937801649403,0,50.000030526797836], null],
  [1390, [193,33,58,210,0,48], null],
  [2400, [86,54,58,154,54,58], [.16771539711108435,.7245980352977247,.32366613843706765,.9950272322138747]],
];

function progress(t, curve) {
  if (!curve || t <= 0 || t >= 1) return t;
  const b = (s,a,z) => 3*(1-s)*(1-s)*s*a + 3*(1-s)*s*s*z + s*s*s;
  let lo=0,hi=1;
  for (let i=0;i<24;i++) { const mid=(lo+hi)/2; if(b(mid,curve[0],curve[2])<t)lo=mid;else hi=mid; }
  return b((lo+hi)/2,curve[1],curve[3]);
}

export function drawOrbitWaiting(instance, elapsed) {
  const time=Math.max(0,Math.min(ORBIT_CYCLE,elapsed));
  const index=Math.max(1,FRAMES.findIndex(frame=>frame[0]>=time));
  const a=FRAMES[index-1],b=FRAMES[index],t=progress((time-a[0])/(b[0]-a[0]),b[2]);
  const pose=a[1].map((v,i)=>v+(b[1][i]-v)*t);
  for(const [side,offset] of [['left',0],['right',3]]) {
    instance['_'+side+'Eye'].setAttribute('transform',`translate(${pose[offset]} 126)`);
    const eye=instance['_'+side+'Base'];
    eye.setAttribute('rx',Math.max(0,pose[offset+1])/2);eye.setAttribute('ry',pose[offset+2]/2);
    eye.setAttribute('opacity','1');instance['_'+side+'InputBase'].setAttribute('opacity','0');
  }
}
