import test from 'node:test';
import assert from 'node:assert/strict';
import {createNasaFlareService} from '../server/nasaService.mjs';
import {fetchGameFlare,NASA_PROXY_URL} from '../src/game/nasaClient.js';

const source={classType:'X3.2',peakTime:'2026-11-10T12:00Z',activeRegionNum:4321};
const record={cls:'X3.2',date:'2026-11-10',ar:4321,live:true};
const good=()=>({ok:true,json:async()=>[source]});

test('the server uses its private key and shares one cached response across clients',async()=>{
 let calls=0;const getFlare=createNasaFlareService({getKey:()=> 'PRIVATE_TEST_KEY',fetchImpl:async url=>{calls++;assert.equal(new URL(url).searchParams.get('api_key'),'PRIVATE_TEST_KEY');return good();}});
 const records=await Promise.all([getFlare(),getFlare(),getFlare()]);assert.equal(calls,1);assert.equal(records[0].cls,'X3.2');assert.equal(JSON.stringify(records).includes('PRIVATE_TEST_KEY'),false);
 await getFlare();assert.equal(calls,1);
});

test('the server retries DEMO_KEY before fetching the official CCMC mirror',async()=>{
 const calls=[];const getFlare=createNasaFlareService({getKey:()=> 'PRIVATE_TEST_KEY',fetchImpl:async address=>{
  const url=new URL(address);calls.push(url);return url.hostname==='api.nasa.gov'?{ok:false,status:404}:good();
 }});
 assert.equal((await getFlare()).cls,'X3.2');assert.equal(calls.length,5);
 assert.deepEqual(calls.slice(0,2).map(url=>url.searchParams.get('api_key')),['PRIVATE_TEST_KEY','DEMO_KEY']);
 for(const url of calls.slice(2)){assert.equal(url.hostname,'ccmc.gsfc.nasa.gov');assert.equal(url.searchParams.has('api_key'),false);assert.equal((new Date(url.searchParams.get('endDate'))-new Date(url.searchParams.get('startDate')))/864e5,50);}
});

test('server failures are cached briefly and retried, without delaying every visitor',async()=>{
 let clock=Date.now(),calls=0;const getFlare=createNasaFlareService({now:()=>clock,getKey:()=> 'PRIVATE_TEST_KEY',fetchImpl:async()=>{calls++;return {ok:false,status:503};}});
 assert.equal(await getFlare(),null);assert.equal(calls,5);assert.equal(await getFlare(),null);assert.equal(calls,5);
 clock+=60001;assert.equal(await getFlare(),null);assert.equal(calls,10);
});

test('successful server data refreshes after six hours',async()=>{
 let clock=Date.now(),calls=0;const getFlare=createNasaFlareService({now:()=>clock,fetchImpl:async()=>{calls++;return good();}});
 await getFlare();clock+=6*3600e3-1;await getFlare();assert.equal(calls,1);clock+=2;await getFlare();assert.equal(calls,2);
});

test('the browser uses the shared endpoint without receiving the private key',async()=>{
 const urls=[];const result=await fetchGameFlare({fetchImpl:async url=>{urls.push(url);return {ok:true,json:async()=>({record:{...record,privateField:'not forwarded'}})};}});
 assert.deepEqual(urls,[NASA_PROXY_URL]);assert.equal(result.cls,'X3.2');assert.equal('privateField' in result,false);assert.equal(new URL(urls[0]).searchParams.has('api_key'),false);
});

test('an unavailable shared endpoint falls back to a browser DEMO_KEY request',async()=>{
 const urls=[];const result=await fetchGameFlare({fetchImpl:async url=>{urls.push(url);return urls.length===1?{ok:false,status:404}:good();}});
 assert.equal(result.cls,'X3.2');assert.equal(urls[0],NASA_PROXY_URL);assert.equal(new URL(urls[1]).searchParams.get('api_key'),'DEMO_KEY');assert.equal(urls.length,2);
});

test('a shared archived fallback does not duplicate NASA requests in the browser',async()=>{
 let calls=0;assert.equal(await fetchGameFlare({fetchImpl:async()=>{calls++;return {ok:true,json:async()=>({record:null})};}}),null);assert.equal(calls,1);
});

test('a static Netlify build can use the shared Railway endpoint without a function or key',async()=>{
 const urls=[];const local='https://example.netlify.app/api/nasa/flare';
 const result=await fetchGameFlare({proxyUrl:local,fetchImpl:async url=>{urls.push(url);return url===local?{ok:false,status:404}:{ok:true,json:async()=>({record})};}});
 assert.deepEqual(urls,[local,NASA_PROXY_URL]);assert.equal(result.cls,'X3.2');assert.ok(urls.every(url=>!new URL(url).searchParams.has('api_key')));
});

test('a partial CCMC response cannot be presented as a complete 150-day result',async()=>{
 let mirrorCalls=0;const getFlare=createNasaFlareService({fetchImpl:async url=>{if(new URL(url).hostname==='api.nasa.gov')return {ok:false,status:404};mirrorCalls++;return mirrorCalls===2?{ok:false,status:503}:good();}});
 assert.equal(await getFlare(),null);
});
