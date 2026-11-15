import {fetchFlareRecord,normalizeFlareRecord} from './nasa.js';
export const NASA_PROXY_URL='https://outpost-odyssey.up.railway.app/api/nasa/flare';

// This public data endpoint also serves static Netlify builds. Only the server
// knows the personal key; browser fallback requests always use DEMO_KEY.
export async function fetchGameFlare({fetchImpl=globalThis.fetch,proxyUrl=globalThis.location?.origin?new URL('/api/nasa/flare',globalThis.location.origin).href:NASA_PROXY_URL,timeoutMs=18000}={}){
 for(const endpoint of new Set([proxyUrl,NASA_PROXY_URL])){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
   const response=await fetchImpl(endpoint,{signal:controller.signal});
   if(response.ok){
    const body=await response.json();
    if(body?.record===null)return null;
    const record=normalizeFlareRecord(body?.record);
    if(record)return record;
   }
  }catch{/* Try the hosted shared endpoint if this is a static/local preview. */}
  finally{clearTimeout(timer);}
 }
 return fetchFlareRecord('DEMO_KEY',{fetchImpl});
}
