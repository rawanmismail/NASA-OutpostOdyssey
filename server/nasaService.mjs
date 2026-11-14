import {fetchFlareRecord,fetchCcmcFlareRecord} from '../src/game/nasa.js';

export function createNasaFlareService({getKey=()=>process.env.NASA_API_KEY||'DEMO_KEY',fetchImpl=globalThis.fetch,now=Date.now,successTtlMs=6*3600e3,failureTtlMs=60000}={}){
 let cache=null,pending=null;
 return async function getFlare(){
  const key=getKey();
  if(cache&&cache.key===key&&now()-cache.time<cache.ttl)return cache.record;
  if(pending)return pending;
  pending=(async()=>{
   const options={fetchImpl,now:now()};
   const record=await fetchFlareRecord(key,options)||await fetchCcmcFlareRecord(options);
   cache={key,record,time:now(),ttl:record?successTtlMs:failureTtlMs};return record;
  })();
  try{return await pending;}finally{pending=null;}
 };
}
