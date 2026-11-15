import {normalizeFlareRecord,ARCHIVE_FLARES} from './nasa.js';

const sites={ridge:['high','edge'],shackleton:['high','low','edge'],gerlache:['high','low','edge']};
const events=['power','rad','dust','micro','freeze','ice','life'];
const phases=['emergency','event','route','drive','scan','iceUse','return','result','job','nightReady','night','debrief'];
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const bounded=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;
const integer=(v,min,max)=>Number.isInteger(v)&&bounded(v,min,max);
const meters=v=>object(v)&&['life','power','prot'].every(k=>bounded(v[k],0,100));
const effects=v=>object(v)&&Object.entries(v).every(([k,n])=>['life','power','prot','sci'].includes(k)&&Number.isFinite(n));
const scan=v=>object(v)&&['edge','mid','deep'].includes(v.target)&&['strong','weak','none','stuck'].includes(v.result);
const iceKeys=['explore.stuckWhy','finish.digWhy','finish.noneWhy','finish.homeWhy','iceUse.water.why','iceUse.oxy.why'];
const last=v=>object(v)&&effects(v.fx)&&(v.type==='event'?events.includes(v.id)&&integer(v.index,0,2):v.type==='ice'&&iceKeys.includes(v.key));

// A save is untrusted input (old versions, interrupted writes, storage edits).
// Validate before replacing the live state, so a bad resume cannot crash play.
export function validateSavedMission(value){
 const s=value?.state;
 if(value?.version!==1||!object(s)||!Object.hasOwn(sites,s.site)||!phases.includes(s.phase))return null;
 if(!object(s.build)||!['hab','pow','life','shelter'].every(k=>integer(s.build[k],1,3)))return null;
 if(!['rover','green'].every(k=>s.build[k]===undefined||typeof s.build[k]==='boolean'))return null;
 const cost=['hab','pow','life','shelter'].reduce((sum,k)=>sum+s.build[k]*10,0)+(s.build.rover?15:0)+(s.build.green?20:0);
 if(cost>100||!object(s.place)||!['hab','pow'].every(k=>sites[s.site].includes(s.place[k]))||s.place.hab===s.place.pow)return null;
 if(!meters(s.m)||!integer(s.health,0,4)||!integer(s.turn,0,5)||!bounded(s.sci,0,1e6))return null;
 if(!Array.isArray(s.events)||s.events.length!==5||!s.events.every(id=>events.includes(id))||s.events[3]!=='ice'||s.events[4]!=='life')return null;
 if((s.turn===5||s.health===0)&&!['night','debrief'].includes(s.phase))return null;
 if(!object(s.flags)||!integer(s.flags.panelBoost,0,2)||typeof s.flags.shieldBonus!=='boolean')return null;
 if(s.pendingJob!=null&&!['sci','fix','gh','save'].includes(s.pendingJob))return null;
 if(s.selected!==undefined&&!integer(s.selected,0,3))return null;
 if(s.elapsed!==undefined&&!bounded(s.elapsed,0,1e12)||s.clock!==undefined&&!bounded(s.clock,0,1e9))return null;
 if(!Array.isArray(s.log)||s.log.length>100||!s.log.every(l=>object(l)&&integer(l.day,1,5)&&effects(l.fx)&&(l.type==='event'?events.includes(l.id)&&integer(l.index,0,2):l.type==='job'?['sci','fix','gh','save'].includes(l.id):l.type==='ice'?['edge','mid','deep'].includes(l.target)&&typeof l.key==='string':l.type==='off'&&Array.isArray(l.keys)&&l.keys.every(k=>['labs','rover','green','heat'].includes(k)))))return null;
 if(['drive','scan','iceUse','return'].includes(s.phase)&&!scan(s.scan))return null;
 if(s.phase==='iceUse'&&(!effects(s.digFx)||!object(s.ice)||s.scan.result!=='strong'))return null;
 if((s.phase==='result'||s.phase==='return')&&!last(s.last))return null;
 if(s.phase==='night'&&(!object(s.night)||!meters(s.night.before)||!meters(s.night.after)||!integer(s.night.healthBefore,0,4)||!bounded(s.night.gen,0,100)||!bounded(s.night.use,0,100)))return null;
 if(s.phase==='debrief'&&(!object(s.result)||!['safety','eff','science','total'].every(k=>bounded(s.result[k],0,100))||!['fail','success','partial'].includes(s.result.outcome)||typeof s.result.alive!=='boolean'))return null;
 if(s.flare!=null){
  if(s.flare.live===true){const flare=normalizeFlareRecord(s.flare);if(!flare)return null;s.flare=flare;}
  else {
   const archived=ARCHIVE_FLARES.find(f=>f.cls===s.flare.cls);
   if(!object(s.flare)||!archived||s.flare.live!==false)return null;
   s.flare={...archived,live:false};
  }
 }
 if(s.visited!==undefined&&(!Array.isArray(s.visited)||!s.visited.every(id=>['hab','pow','life','shelter','lab','rover','green','survey'].includes(id))))return null;
 // Bad cosmetic coordinates should not discard an otherwise valid mission.
 const vector=v=>Array.isArray(v)&&v.length===3&&bounded(v[0],-38,38)&&bounded(v[1],-100,100)&&bounded(v[2],-38,38);
 if(s.spatial){
  const p=s.spatial;
  if(!object(p)||p.crew!==undefined&&(!Array.isArray(p.crew)||p.crew.length>4||!p.crew.every(vector))||p.rover!==undefined&&!vector(p.rover)||p.yaw!==undefined&&!bounded(p.yaw,-1e6,1e6)||p.pitch!==undefined&&!bounded(p.pitch,-.28,.65))delete s.spatial;
 }
 return s;
}

export function readSavedMission(){
 try{return validateSavedMission(JSON.parse(localStorage.getItem('odyssey_react_save')));}catch{return null;}
}
