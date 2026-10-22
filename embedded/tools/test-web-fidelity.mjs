// Compare the embedded rasterizer against SVGs produced by ORIGINAL Web draw
// methods, not against a second invocation of the embedded implementation.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {Resvg} from '@resvg/resvg-js';

const root=fileURLToPath(new URL('../',import.meta.url));
const reference=JSON.parse(await readFile(join(root,'tests/web-visual-reference.json'),'utf8'));
const hash=createHash('sha256');
for(const name of ['core','extension-host','actions','waiting','wrap','failure','inspect','love','random'])
  hash.update(await readFile(join(root,`../src/agent-robot-avatar-${name}.js`)));
assert.equal(hash.digest('hex'),reference.sourceHash,'regenerate visual reference after changing the Web expressions');
const names=['idle','bored','waiting','waiting-wrap','input','send','success','failure','warning','inspect','blocked','error','surprise','love','random','sleep','wake'];
const temp=await mkdtemp(join(tmpdir(),'web-eye-fidelity-'));
try {
  const binary=join(temp,'oracle');
  execFileSync(process.env.CXX||'g++',['-std=c++11','-O2','-I',join(root,'lib/AgentRobotEyes/src'),
    join(root,'lib/AgentRobotEyes/src/AgentRobotEyes.cpp'),join(root,'preview/bridge.cpp'),
    join(root,'tests/preview-oracle.cpp'),'-o',binary],{stdio:'inherit'});
  let worst=0;const stats=[],comparisons=[];
  const selected={waiting:900,'waiting-wrap':900,inspect:2200,warning:1500,love:1200,random:1500};
  for(const frame of reference.frames){
    const index=names.indexOf(frame.action),start=index===16?3500:0;
    const input=['init 240 160 60 0 0 0'];
    if(index===16)input.push('play 15 0','update 3400');
    input.push(`play ${index} ${start}`,`update ${start+frame.elapsed}`);
    const output=execFileSync(binary,{input:input.join('\n')+'\n',encoding:'utf8'}).trim().split('\n').at(-1).split(' ');
    const pixels=Buffer.from(output[2],'hex');
    const expected=new Resvg(frame.svg).render().pixels;
    let changed=0,union=0;
    for(let y=0;y<160;y++)for(let x=0;x<240;x++){
      const native=!!(pixels[y*30+(x>>3)]&(0x80>>(x&7)));
      const original=expected[(y*240+x)*4]>=128;
      if(native||original)union++;
      if(native!==original)changed++;
    }
    const ratio=union?changed/union:0;
    worst=Math.max(worst,ratio);
    stats.push({action:frame.action,time:frame.elapsed,changed,union,ratio});
    if(selected[frame.action]===frame.elapsed){
      let path='';
      for(let y=0;y<160;y++)for(let x=0;x<240;){
        if(!(pixels[y*30+(x>>3)]&(0x80>>(x&7)))){x++;continue;}
        const start=x;
        while(x<240&&(pixels[y*30+(x>>3)]&(0x80>>(x&7))))x++;
        path+=`M${start} ${y}h${x-start}v1H${start}z`;
      }
      comparisons.push({action:frame.action,time:frame.elapsed,svg:frame.svg,path});
    }
  }
  console.log(JSON.stringify(stats.sort((a,b)=>b.ratio-a.ratio).slice(0,15),null,2));
  const failed=stats.filter(item=>item.changed>Math.max(16,item.union*.035));
  assert.equal(failed.length,0,`Original Web SVG mismatch: ${JSON.stringify(failed.slice(0,5))}`);
  console.log(`Original Web visual reference: ${reference.frames.length} frames across all 17 actions passed; worst differing-pixel ratio ${(worst*100).toFixed(2)}% (quantization/anti-aliasing boundaries).`);
  if(process.env.WEB_FIDELITY_IMAGE){
    const cells=comparisons.map((item,i)=>{
      const x=(i%2)*520,y=Math.floor(i/2)*225;
      return `<g transform="translate(${x} ${y})"><text x="10" y="22" font-size="14" fill="#42474b">${item.action} · ${item.time} ms</text>${item.svg.replace('<svg ','<svg x="10" y="32" ')}<g transform="translate(270 32)"><rect width="240" height="160" fill="black"/><path d="${item.path}" fill="white"/></g><text x="10" y="212" font-size="12" fill="#777c83">Original Web eyes</text><text x="270" y="212" font-size="12" fill="#777c83">Corrected embedded eyes</text></g>`;
    }).join('');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="675"><rect width="1040" height="675" fill="#f8f8f6"/>${cells}</svg>`;
    await writeFile(process.env.WEB_FIDELITY_IMAGE,new Resvg(svg).render().asPng());
  }
} finally {await rm(temp,{recursive:true,force:true});}
