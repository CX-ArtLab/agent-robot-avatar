import './catalog-renderer.js';
import {approvedPaints} from './approved-paints.js';

export function applyApprovedPaint(avatar,id,material) {
  const approved=approvedPaints[id];
  if (!approved) return material;
  const root=avatar.shadowRoot;
  const find=record=>{
    let node=record.id ? root.getElementById(record.id) : root.querySelector(record.selector);
    for (const index of record.path||[]) node=node?.children[index];
    return node;
  };
  const paint=()=>{
    for(const record of approved.paint){
      const node=find(record);
      if(node) for(const [attribute,value] of Object.entries(record.attributes)) node.setAttribute(attribute,value);
    }
    for(const [property,value] of Object.entries(approved.properties)) avatar.style.setProperty(property,value);
  };
  // Retain the approved light origin while the regular renderer moves the light.
  const offsets=[];
  for(const key of material.lightKeys||[]){
    const [suffix,attribute]=key.split(':');
    const record=approved.paint.find(r=>r.id===`material-${id}-${suffix}`&&!r.path.length);
    const node=record&&find(record),value=record?.attributes[attribute];
    if(node&&value!=null) offsets.push({node,attribute,delta:parseFloat(value)-parseFloat(node.getAttribute(attribute))});
  }
  paint();
  const light=material.light.bind(material),original=material.setOriginal.bind(material);
  material.light=(...args)=>{light(...args);for(const {node,attribute,delta} of offsets) node.setAttribute(attribute,parseFloat(node.getAttribute(attribute))+delta);};
  material.setOriginal=value=>{original(value);if(!value)paint();};
  return material;
}

export function applyCatalogMaterial(avatar,skin,{groundShadow=false}={}) {
  avatar.setCatalogSkin(skin.nativeSkin);
  let original=false;
  const shadow=()=>{avatar.style.background=groundShadow&&!original?'radial-gradient(35.4% 5.8% at 50% 92.1%,rgba(10,16,32,.27),rgba(10,16,32,.1) 50%,transparent)':'';};
  shadow();
  return {
    setOriginal(value){original=Boolean(value);avatar.setCatalogSkin(original?null:skin.nativeSkin);shadow();},
    setGroundShadow(value){groundShadow=Boolean(value);shadow();},
    light(x,y){avatar._catalogSkinFixedLight={x,y};avatar._draw(performance.now());},
    dispose(){avatar.setCatalogSkin(null);avatar.style.background='';delete avatar._catalogSkinFixedLight;},
  };
}
