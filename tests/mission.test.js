import test from 'node:test';
import assert from 'node:assert/strict';
import {model,Mission,SITES,EV} from '../src/game/model.js';
import LANG from '../src/game/translations.js';
import {copy} from '../src/game/copy.js';
const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
async function fresh(site='ridge'){await model.newMission({weather:false});model.change(s=>{s.site=site;s.place={hab:'edge',pow:'high'};});assert.equal(model.run('start'),true);}
test('new and inherited English/Arabic content is retained',()=>{
 assert.deepEqual(Object.keys(copy.en).sort(),Object.keys(copy.ar).sort());
 assert.deepEqual(Object.keys(LANG.en.x).sort(),Object.keys(LANG.ar.x).sort());
 for(const id of Object.keys(EV))for(const lg of['en','ar'])assert.ok(LANG[lg].ev[id].fact.text);
});
test('every site and distinct placement launches with original modifiers',async()=>{
 for(const[site,data]of Object.entries(SITES))for(const hab of data.spots)for(const pow of data.spots){if(hab===pow)continue;await model.newMission({weather:false});model.change(s=>{s.site=site;s.place={hab,pow};});assert.equal(model.run('start'),true);assert.equal(model.state.events.length,5);assert.ok(model.state.events.includes('rad'));assert.equal(model.state.events[3],'ice');assert.equal(model.state.events[4],'life');}
});
test('launch blocks overspending and duplicate placements',async()=>{
 await model.newMission({weather:false});model.change(s=>{s.place={hab:'high',pow:'edge'};s.build={hab:3,pow:3,life:3,shelter:3,green:true,rover:true};});assert.equal(model.run('start'),false);model.change(s=>{s.build={hab:1,pow:1,life:1,shelter:1};s.place={hab:'high',pow:'high'};});assert.equal(model.run('start'),false);
});
test('event shocks, choices and jobs cannot be duplicated by redraw/resume',async()=>{
 await fresh();model.change(s=>{s.events[0]='life';s.cur=null;s.eventApplied=false;});model.run('current');const life=model.state.m.life;model.save();model.restore();model.run('current');assert.equal(model.state.m.life,life);assert.equal(model.run('choose',0),true);const snapshot=JSON.stringify(model.state.m);assert.equal(model.run('choose',0),false);assert.equal(JSON.stringify(model.state.m),snapshot);model.change(s=>s.phase='job');assert.equal(model.run('job','save'),true);assert.equal(model.run('job','save'),false);
});
test('saving an in-progress rover trip preserves driving and spatial state',async()=>{
 await fresh();model.change(s=>{s.phase='route';s.m.power=100;});model.run('depart','deep');model.save({rover:[20,-2,-18],crew:[[0,0,9]],yaw:2,pitch:.1});assert.equal(model.restore(),true);assert.equal(model.state.phase,'drive');assert.deepEqual(model.state.spatial.rover,[20,-2,-18]);assert.ok(!memory.has('oo3_save'));
});
test('rover signal branches, water/oxygen and no-power guards',async()=>{
 for(const result of['strong','weak','none','stuck'])for(const use of['water','oxy']){await fresh();model.change(s=>{s.phase='route';s.m.power=100;});assert.equal(model.run('depart','deep'),true);model.change(s=>s.scan.result=result);model.run('arrive');if(result==='stuck'){assert.equal(model.state.phase,'result');assert.equal(model.state.ice.done,true);continue;}assert.equal(model.state.phase,'scan');assert.equal(model.run('sample',result!=='none'),true);if(result==='strong'){assert.equal(model.state.phase,'iceUse');assert.equal(model.run('useIce',use),true);assert.equal(model.state.ice.use,use);}assert.equal(model.state.phase,'return');}
 await fresh();model.change(s=>{s.phase='route';s.m.power=0;});assert.equal(model.run('depart','deep'),false);model.change(s=>{s.phase='scan';s.scan={result:'strong'};});assert.equal(model.run('sample',true),false);model.change(s=>s.phase='iceUse');assert.equal(model.run('useIce','oxy'),false);
});
test('power emergency rejects repeated system rewards',async()=>{await fresh();model.change(s=>{s.m.power=2;s.eventApplied=false;});model.run('beginDay');assert.equal(model.state.phase,'emergency');model.run('emergency',['labs','labs','invalid']);assert.deepEqual(model.state.log.at(-1).keys,['labs']);assert.equal(model.run('emergency',['heat']),false);});
test('all hazards, sites and languages complete five days and a saved debrief',async()=>{
 for(const lg of['en','ar'])for(const site of Object.keys(SITES))for(const hazard of['power','dust','micro','freeze']){
  await fresh(site);model.setLanguage(lg);model.change(s=>{s.events=[hazard,'rad','dust','ice','life'];s.cur=null;s.eventApplied=false;});model.run('current');
  for(let day=0;day<5;day++){
   if(model.state.phase==='emergency')model.run('emergency',['labs','rover']);
   if(day===3){model.run('choose',0);model.run('depart','edge');model.change(s=>s.scan.result='strong');model.run('arrive');model.run('sample',true);model.run('useIce','water');model.change(s=>s.phase='result');}else assert.equal(model.run('choose',0),true);
   assert.equal(model.state.phase,'result');model.change(s=>s.phase='job');model.run('job','save');model.run('night');assert.equal(model.state.turn,day+1);if(day<4)model.run('beginDay');
  }
  model.run('debrief');assert.equal(model.state.phase,'debrief');assert.ok(model.state.result.total>=0&&model.state.result.total<=100);assert.ok(Object.values(model.state.m).every(n=>Number.isFinite(n)&&n>=0&&n<=100));model.save();assert.equal(model.restore(),true);
 }
});
test('critical upkeep records slower scrubbers and named crew health state',async()=>{await fresh('gerlache');model.change(s=>{s.m={life:3,power:1,prot:4};s.phase='nightReady';});model.run('night');assert.equal(model.state.night.slow,true);assert.equal(model.state.health,2);model.run('debrief');assert.equal(model.state.result.outcome,'fail');});
