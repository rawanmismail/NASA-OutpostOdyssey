import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchFlareRecord} from '../src/game/nasa.js';

const record={classType:'X2.1',peakTime:'2026-11-10T12:00Z',activeRegionNum:4321,link:'https://kauai.ccmc.gsfc.nasa.gov/DONKI/'};
const success=()=>({ok:true,json:async()=>[record,{...record,classType:'M9.0'}]});
const key=url=>new URL(url).searchParams.get('api_key');

test('a working configured NASA key is used without spending demo quota',async()=>{
 const calls=[];const result=await fetchFlareRecord('TEST_PRIMARY',{fetchImpl:async url=>{calls.push(url);return success();},now:Date.UTC(2026,10,15)});
 assert.deepEqual(calls.map(key),['TEST_PRIMARY']);assert.equal(result.cls,'X2.1');assert.equal(result.live,true);
 assert.equal(new URL(calls[0]).searchParams.get('endDate'),'2026-11-15');
});

test('a rejected or rate-limited primary key retries once with DEMO_KEY',async()=>{
 for(const status of[401,403,429,500]){
  const calls=[];const result=await fetchFlareRecord('TEST_PRIMARY',{fetchImpl:async url=>{calls.push(url);return calls.length===1?{ok:false,status}:success();}});
  assert.deepEqual(calls.map(key),['TEST_PRIMARY','DEMO_KEY']);assert.equal(result.cls,'X2.1');assert.equal(result.live,true);
 }
});

test('network and JSON failures also fall back to DEMO_KEY',async()=>{
 for(const failure of['network','json','invalid-response']){
  const calls=[];const result=await fetchFlareRecord('TEST_PRIMARY',{fetchImpl:async url=>{
   calls.push(url);if(calls.length>1)return success();
   if(failure==='network')throw new TypeError('Connection failed');
   return {ok:true,json:async()=>{if(failure==='json')throw new SyntaxError('Invalid JSON');return {error:'bad response'};}};
  }});
  assert.deepEqual(calls.map(key),['TEST_PRIMARY','DEMO_KEY']);assert.equal(result.live,true);
 }
});

test('using DEMO_KEY or a blank key never requests DEMO_KEY twice',async()=>{
 for(const configured of['DEMO_KEY','',undefined,'  DEMO_KEY  ']){
  let calls=0;const result=await fetchFlareRecord(configured,{fetchImpl:async url=>{calls++;assert.equal(key(url),'DEMO_KEY');return {ok:false,status:429};}});
  assert.equal(calls,1);assert.equal(result,null);
 }
});

test('both key failures return null so the mission can retain its archive',async()=>{
 const calls=[];assert.equal(await fetchFlareRecord('TEST_PRIMARY',{fetchImpl:async url=>{calls.push(key(url));return {ok:false,status:403};}}),null);
 assert.deepEqual(calls,['TEST_PRIMARY','DEMO_KEY']);
});

test('each request has its own abort timeout, including response-body reading',async()=>{
 const signals=[];const result=await fetchFlareRecord('TEST_PRIMARY',{timeoutMs:10,fetchImpl:async(url,{signal})=>{
  signals.push(signal);return {ok:true,json:()=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('timeout')),{once:true}))};
 }});
 assert.equal(result,null);assert.equal(signals.length,2);assert.ok(signals.every(signal=>signal.aborted));
});

test('a valid empty flare response does not waste a second key request',async()=>{
 let calls=0;assert.equal(await fetchFlareRecord('TEST_PRIMARY',{fetchImpl:async()=>{calls++;return {ok:true,json:async()=>[]};}}),null);assert.equal(calls,1);
});

test('mission stays playable and labels its archive when NASA is unavailable',async()=>{
 const previousFetch=globalThis.fetch,previousStorage=globalThis.localStorage,memory=new Map();
 globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
 globalThis.fetch=async()=>({ok:false,status:429});
 try{const{model}=await import('../src/game/model.js?nasa-unavailable');await model.newMission();assert.equal(model.state.phase,'training');assert.equal(model.state.flare.live,false);assert.ok(['X9.0','X8.7'].includes(model.state.flare.cls));}
 finally{globalThis.fetch=previousFetch;globalThis.localStorage=previousStorage;}
});
