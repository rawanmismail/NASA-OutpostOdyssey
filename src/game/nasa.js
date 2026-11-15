const DEMO_KEY='DEMO_KEY';
// Both network responses and browser storage cross this same data boundary.
export function normalizeFlareRecord(record){
 if(!record || record.live!==true || typeof record.cls!=='string' || !/^[ABCMX]\d+(?:\.\d+)?$/.test(record.cls) || !Number.isFinite(Number(record.cls.slice(1))))return null;
 if(typeof record.date!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(record.date))return null;
 const time=Date.parse(record.date+'T00:00:00Z');if(!Number.isFinite(time)||new Date(time).toISOString().slice(0,10)!==record.date)return null;
 const ar=typeof record.ar==='number'&&Number.isFinite(record.ar)?record.ar:typeof record.ar==='string'?record.ar.slice(0,40):'—';
 let link;try{const url=new URL(record.link);if(url.protocol==='https:'&&(url.hostname==='nasa.gov'||url.hostname.endsWith('.nasa.gov')))link=url.href;}catch{}
 return {cls:record.cls,date:record.date,ar,live:true,link};
}
const letterRank={A:0,B:1,C:2,M:3,X:4};
const rankClass=value=>(letterRank[value[0]]??0)*100+(parseFloat(value.slice(1))||0);
function selectFlare(records){
 const rows=records.map(record=>normalizeFlareRecord({cls:record?.classType,date:typeof (record?.peakTime||record?.beginTime)==='string'?(record.peakTime||record.beginTime).slice(0,10):'',ar:record?.activeRegionNum,live:true,link:record?.link})).filter(Boolean);
 return rows.sort((a,b)=>rankClass(b.cls)-rankClass(a.cls))[0]||null;
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
