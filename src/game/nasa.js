const DEMO_KEY='DEMO_KEY';
const letterRank={A:0,B:1,C:2,M:3,X:4};
const rankClass=value=>(letterRank[value[0]]??0)*100+(parseFloat(value.slice(1))||0);
function selectFlare(records){
 const top=records.filter(record=>typeof record?.classType==='string'&&/^[ABCMX]\d+(?:\.\d+)?$/.test(record.classType)).sort((a,b)=>rankClass(b.classType)-rankClass(a.classType))[0];
 return top?{cls:top.classType,date:(top.peakTime||top.beginTime||'').slice(0,10),ar:top.activeRegionNum||'—',live:true,link:top.link}:null;
}

// A configured key gets one attempt, followed by one DEMO_KEY attempt on error.
// Returning null lets the mission keep its already-selected archived record.
export async function fetchFlareRecord(apiKey,{fetchImpl=globalThis.fetch,now=Date.now(),timeoutMs=5000}={}){
 const primary=String(apiKey||'').trim()||DEMO_KEY;
 const keys=[...new Set([primary,DEMO_KEY])];
 const iso=value=>new Date(value).toISOString().slice(0,10);
 for(const key of keys){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
   const url=new URL('https://api.nasa.gov/DONKI/FLR');
   url.searchParams.set('startDate',iso(now-150*864e5));url.searchParams.set('endDate',iso(now));url.searchParams.set('api_key',key);
   const response=await fetchImpl(url.href,{signal:controller.signal});
   if(!response.ok)continue;
   const records=await response.json();
   if(!Array.isArray(records))continue;
   // A valid empty result is not a broken key; another key cannot add records.
   return selectFlare(records);
  }catch{
   // Invalid/blocked key, timeout, connection failure or unreadable response:
   // continue to DEMO_KEY, or return null once both attempts are exhausted.
  }finally{clearTimeout(timer);}
 }
 return null;
}

// Official CCMC mirror: its current API limits a request to 60 days. Three
// 50-day windows preserve the game's 150-day lookback without sending a key.
export async function fetchCcmcFlareRecord({fetchImpl=globalThis.fetch,now=Date.now(),timeoutMs=5000}={}){
 const batches=await Promise.all([0,50,100].map(async days=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
   const url=new URL('https://ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR');
   url.searchParams.set('startDate',new Date(now-(days+50)*864e5).toISOString().slice(0,10));url.searchParams.set('endDate',new Date(now-days*864e5).toISOString().slice(0,10));
   const response=await fetchImpl(url.href,{signal:controller.signal});if(!response.ok)return null;
   const rows=await response.json();return Array.isArray(rows)?rows:null;
  }catch{return null;}finally{clearTimeout(timer);}
 }));
 return batches.some(rows=>rows===null)?null:selectFlare(batches.flat());
}
