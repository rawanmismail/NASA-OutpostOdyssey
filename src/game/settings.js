export function normalizeSettings(value,defaults){
 const result={...defaults};
 if(!value||typeof value!=='object'||Array.isArray(value))return result;
 for(const key of ['master','music','ambience','effects','voice'])if(Number.isFinite(value[key]))result[key]=Math.max(0,Math.min(1,value[key]));
 for(const key of ['narration','motion'])if(typeof value[key]==='boolean')result[key]=value[key];
 if(['low','high'].includes(value.quality))result.quality=value.quality;
 return result;
}
