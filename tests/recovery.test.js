import test from 'node:test';
import assert from 'node:assert/strict';
import {model} from '../src/game/model.js';
import {validateSavedMission} from '../src/game/savedMission.js';
import {normalizeSettings} from '../src/game/settings.js';
import {normalizeFlareRecord,fetchFlareRecord} from '../src/game/nasa.js';
import {fetchGameFlare} from '../src/game/nasaClient.js';

const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
async function saved(){
 await model.newMission({weather:false});model.change(s=>s.place={hab:'edge',pow:'high'});assert.equal(model.run('start'),true);model.save();return JSON.parse(memory.get('odyssey_react_save'));
}
test('invalid saves never replace the current mission or offer a broken resume',async()=>{
 const original=await saved(),state=model.state;
 for(const corrupt of[
  v=>v.state.build=null,v=>v.state.build.pow=9,v=>v.state.place.hab='low',
  v=>v.state.m.power='99',v=>v.state.flags=null,v=>v.state.events=[],
  v=>v.state.events[0]='constructor',v=>v.state.site='__proto__',
  v=>v.state.phase='drive',v=>v.state.phase='result',v=>v.state.phase='night',
  v=>v.state.phase='debrief',v=>v.state.pendingJob='unknown',
  v=>v.state.log=[{type:'off',day:1,keys:'labs',fx:{}}],v=>v.state.health=-1,
  v=>v.state.flare={live:true,cls:'bad'},v=>v.state.turn=5,
 ]){
  const v=structuredClone(original);corrupt(v);memory.set('odyssey_react_save',JSON.stringify(v));
  assert.equal(model.hasSave(),false);assert.equal(model.restore(),false);assert.equal(model.state,state);
 }
 memory.set('odyssey_react_save',JSON.stringify(original));assert.equal(model.hasSave(),true);assert.equal(model.restore(),true);
});
test('cosmetic save damage is discarded while valid progress survives',async()=>{
 const v=await saved();v.state.spatial={crew:[['NaN',0,4]],rover:[0,0,0]};
 const restored=validateSavedMission(v);assert.ok(restored);assert.equal(restored.spatial,undefined);
});
test('saves remain resumable at every normal mission and rover transition',async()=>{
 await saved();
 const checkpoint=()=>{model.save();assert.equal(model.hasSave(),true,model.state.phase);assert.equal(model.restore(),true,model.state.phase);};
 model.change(s=>{s.events=['power','rad','dust','ice','life'];s.cur=null;s.eventApplied=false;});model.run('current');checkpoint();
 model.run('choose',0);checkpoint();model.change(s=>s.phase='job');checkpoint();model.run('job','save');checkpoint();model.run('night');checkpoint();model.run('beginDay');checkpoint();
 model.change(s=>{s.turn=3;s.events[3]='ice';s.phase='event';s.cur=null;s.eventApplied=false;s.m.power=100;});model.run('current');model.run('choose',0);checkpoint();
 model.run('depart','edge');checkpoint();model.change(s=>s.scan.result='strong');model.run('arrive');checkpoint();model.run('sample',true);checkpoint();model.run('useIce','water');checkpoint();
 model.change(s=>s.phase='result');checkpoint();model.change(s=>{s.turn=4;s.phase='nightReady';});model.run('night');checkpoint();model.run('debrief');checkpoint();
});
test('launch rejects invalid tiers, unavailable spots and invalid site IDs',async()=>{
 for(const patch of[{site:'constructor'},{place:{hab:'low',pow:'high'}},{build:{hab:0,pow:2,life:2,shelter:2}}]){
  await model.newMission({weather:false});model.change(s=>{s.place={hab:'edge',pow:'high'};Object.assign(s,patch);});assert.equal(model.run('start'),false);
 }
});
test('corrupted settings cannot create invalid audio gains or override defaults',()=>{
 const defaults={master:.65,music:.3,ambience:.5,effects:.65,voice:.85,narration:true,motion:false,quality:'high'};
 assert.deepEqual(normalizeSettings({master:50,music:-1,effects:'bad',voice:null,narration:'false',quality:'ultra',motion:true,extra:2},defaults),{...defaults,master:1,music:0,motion:true});
 assert.deepEqual(normalizeSettings(null,defaults),defaults);
});
test('NASA records reject malformed dates/types and strip untrusted metadata',async()=>{
 const valid={cls:'X2.1',date:'2026-11-10',ar:4321,live:true};
 for(const patch of[{date:'2026-02-30'},{date:{}},{cls:5},{cls:'Z8'},{ar:{secret:1},link:'javascript:alert(1)'}]){
  const value=normalizeFlareRecord({...valid,...patch});
  if(patch.ar){assert.equal(value.ar,'—');assert.equal(value.link,undefined);}else assert.equal(value,null);
 }
 const result=await fetchFlareRecord('DEMO_KEY',{fetchImpl:async()=>({ok:true,json:async()=>[{classType:'X9',peakTime:{}},{classType:'M1.0',peakTime:'2026-11-10T00:00Z'}]})});
 assert.equal(result.cls,'M1.0');
 const calls=[];const result2=await fetchGameFlare({fetchImpl:async url=>{calls.push(url);return calls.length===1?{ok:true,json:async()=>({record:{...valid,date:'invalid'}})}:{ok:true,json:async()=>[]};}});
 assert.equal(result2,null);assert.equal(calls.length,2);
});
test('a damaged or future-dated flare cache does not break mission startup',async()=>{
 const oldFetch=globalThis.fetch;globalThis.fetch=async()=>({ok:false});
 try{for(const cache of[{t:Date.now(),f:{live:true,cls:null}},{t:Date.now()+864e5,f:{live:true,cls:'X2.1',date:'2026-11-10'}}]){
  memory.set('oo_flare',JSON.stringify(cache));await model.newMission();assert.equal(model.state.flare.live,false);assert.equal(model.state.phase,'training');
 }}finally{globalThis.fetch=oldFetch;}
});
