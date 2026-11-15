import LANG from './translations.js';
import {fetchGameFlare} from './nasaClient.js';
import {normalizeFlareRecord,ARCHIVE_FLARES} from './nasa.js';
import {readSavedMission} from './savedMission.js';
let LG='en';
try { LG=localStorage.getItem('odyssey_react_lang')||'en'; } catch {}
if(!LANG[LG]) LG='en';
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,Math.round(v)));
const rnd=(a,b)=>a+Math.random()*(b-a);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const range=(a,b)=>Array.from({length:Math.max(0,b-a)},(_,i)=>a+i);
const dig=(o,p)=>p.split('.').reduce((a,k)=>a?.[k],o);
export const plain=s=>String(s??'').replace(/\[\[(\w+)\|([^\]]+)\]\]/g,'$2').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const fmt=(s,v={})=>plain(s.replace(/\{(\w+)\}/g,(m,k)=>k in v?v[k]:m));
export function t(p,v){let s=dig(LANG[LG],p)??dig(LANG.en,p);if(s==null)return '['+p+']';if(typeof s==='function')s=s(v||{});return typeof s==='string'?fmt(s,v):Array.isArray(s)?s.map(a=>typeof a==='string'?fmt(a,v):a):s;}
const tx=t,lz=(p,v)=>()=>t(p,v),val=x=>typeof x==='function'?x():x;
const joinList=a=>(LANG[LG].list||LANG.en.list)(a);
const resName=k=>t('res.'+k);
const realData=text=>text,gameEst=text=>text;
export const MAPS={elev:'assets/elevation-map.jpg',slope:'assets/slope-map.jpg'};
function updateHUD() {}
const TERM_KEYS=['regolith','radiation','flare','psr','slope','elevation','scrubber','lola','donki','rim'];
const REF = {
  radlab: ['NASA OSDR RadLab: ISS radiation measurements', 'https://visualization.osdr.nasa.gov/radlab/gui/data-api/'],
  shadow: ['NASA: Shadows near the Moon\'s south pole', 'https://science.nasa.gov/resource/shadows-near-the-moons-south-pole/'],
  shack: ['NASA: Shackleton crater, lit rim and shadowed interior', 'https://science.nasa.gov/resource/shackleton-craters-illuminated-rim-shadowed-interior/'],
  weather: ['NASA: Weather on the Moon', 'https://science.nasa.gov/moon/weather-on-the-moon/'],
  base: ['NASA: Moon base environment', 'https://www.nasa.gov/reference/moonbase-environment/'],
  atlas: ['LPI Lunar South Pole Atlas (LOLA data)', 'https://www.lpi.usra.edu/lunar/lunar-south-pole-atlas/'],
  change4: ['Sci.News: Radiation dose on the lunar surface (Zhang et al., Science Advances, 2020)', 'https://www.sci.news/space/radiation-dose-rates-lunar-surface-08893.html'],
  massBal: ['NASA: Astronaut Mass Balance for Long Duration Missions (Ewert & Stromgren, 2019)', 'https://ntrs.nasa.gov/api/citations/20190027563/downloads/20190027563.pdf'],
  glaser: ['Gläser et al. 2014, Icarus: south pole sunlight from NASA LOLA data', 'https://elib.dlr.de/94240/'],
  lcross: ['NASA: LCROSS mission', 'https://science.nasa.gov/mission/lcross/'],
  regolith: ['NASA: What hazards are caused by lunar regolith?', 'https://science.nasa.gov/biological-physical/what-hazards-are-caused-by-lunar-regolith/'],
  spaceapps: ['NASA Space Apps 2026: Space Agency Partners', 'https://www.spaceappschallenge.org/2026/space-agency-partners/'],
  ispace: ['ispace: HAKUTO-R Mission 1', 'https://www.ispace-inc.com/mission-1/'],
  lroImpact: ['NASA: LRO views the HAKUTO-R Mission 1 impact site', 'https://www.nasa.gov/centers-and-facilities/goddard/nasas-lro-views-impact-site-of-hakuto-r-mission-1-moon-lander/'],
};
/* ============ game data (numbers only; text is in lang/) ============ */
const SITES = {
  gerlache: { id: 'gerlache', e: { x: 595, y: 812, l: 'l' }, s: { x: 262, y: 880, l: 'r' }, sun: 2, terrain: 3, iceAccess: 5,
    sunMult: 0.7, terrainMult: 1.0, ice: 0.2, shadowSev: 1.4, spots: ['high', 'low', 'edge'], light: { pending: true } },
  shackleton: { id: 'shackleton', e: { x: 718, y: 812, l: 'r' }, s: { x: 1105, y: 860, l: 'l' }, sun: 5, terrain: 5, iceAccess: 2,
    sunMult: 1.3, terrainMult: 1.6, ice: 0.0, shadowSev: 0.6, spots: ['high', 'low', 'edge'], light: { ref: REF.shack } },
  ridge: { id: 'ridge', e: { x: 665, y: 836, l: 'dn' }, s: { x: 600, y: 1040, l: 'up' }, sun: 4, terrain: 4, iceAccess: 3,
    sunMult: 1.0, terrainMult: 1.25, ice: 0.1, shadowSev: 1.0, spots: ['high', 'edge'], light: { ref: REF.glaser } }, // narrow ridge: only 2 spots
};
const siteName = k => tx(`sites.${k}.name`);
const TIERS = { hab: [10, 20, 30], pow: [10, 20, 30], life: [10, 20, 30], shelter: [10, 20, 30] }; // credit costs of the 3 options
const EXTRAS = { rover: 15, green: 20 };
const BASE = { life: 72, power: 62, prot: 60 };
const K = {
  hab: { prot: [0, 2, 5, 8], heat: [0, 10, 8, 6], mm: [0, 1, .7, .5] },
  pow: { gen: [0, 13, 19, 25], start: [0, 0, 4, 8] },
  life: { start: [0, 0, 4, 8], drain: [0, 9, 7, 5], use: [0, 3, 4, 5] },
  shelter: { prot: [0, 0, 4, 8], mit: [0, 0, .3, .6], drift: [0, 3, 2, 1] },
};
const BUDGET = 100;
// Placement step (game estimates). Each spot holds one thing: the habitat or the solar panels.
const PLACE = {
  pow: { high: 3, low: -3, edge: -3 },  // change to the panels' Power a day
  heat: { high: 0, low: -3, edge: 0 },  // change to the habitat's heating Power a day
  ice: { high: 1, low: 1, edge: .7 },   // ice-trip Power cost multiplier when the habitat is here
};
// The crew, in the order they appear in the crew panel. The last ones get hurt first. Names and roles are in lang/.
const CREW = ['hessa', 'maya', 'kenji', 'sam'];
const mateName = i => tx(`crew.${CREW[i]}.name`);

/* ============ state ============ */
let S;
const LAST = { v: null };
function newGame(keepSite) {
  S = { site: keepSite || null, build: { hab: 2, pow: 2, life: 2, shelter: 2, rover: false, green: false }, place: { hab: null, pow: null },
    m: { life: 0, power: 0, prot: 0 }, health: 4, turn: 0, sci: 0, events: [], cur: null, flags: { panelBoost: 0, shieldBonus: false },
    log: [], facts: [], ice: null, flare: null, night: null, result: null };
}
newGame();
const cost = b => ['hab', 'pow', 'life', 'shelter'].reduce((s, k) => s + TIERS[k][b[k] - 1], 0) + (b.rover ? EXTRAS.rover : 0) + (b.green ? EXTRAS.green : 0);
function forecast() {
  const b = S.build, st = SITES[S.site], pl = S.place;
  const gen = Math.max(0, Math.round(K.pow.gen[b.pow] * st.sunMult * (S.flags.dustPanels ? .8 : 1)) + (pl.pow ? PLACE.pow[pl.pow] : 0));
  const heat = Math.max(0, K.hab.heat[b.hab] + (pl.hab ? PLACE.heat[pl.hab] : 0)), ls = K.life.use[b.life], comms = 2, gh = b.green ? 2 : 0;
  const boost = S.flags.panelBoost > 0 ? 10 : 0;
  return { gen, boost, heat, ls, comms, gh, lifeDrain: K.life.drain[b.life] - (b.green ? 2 : 0), drift: K.shelter.drift[b.shelter] };
}
function startMeters() {
  const b = S.build;
  S.m = { life: BASE.life + K.life.start[b.life], power: BASE.power + K.pow.start[b.pow], prot: BASE.prot + K.hab.prot[b.hab] + K.shelter.prot[b.shelter] };
}

/* ============ real data: NASA DONKI ============ */
// li = which label in flare.archive (lang/) describes the record.
const ARCHIVE = ARCHIVE_FLARES;
const flareSev = c => c[0] === 'X' ? (parseFloat(c.slice(1)) >= 5 ? 4 : 3) : c[0] === 'M' ? 2 : 1;
// Reuse live data in memory and restore browser-stored results for up to 6 hours.
const FLARE_TTL = 6 * 3600e3;
let flareCache = null;
const pickArchive = () => { const a = ARCHIVE[Math.floor(Math.random() * ARCHIVE.length)]; return { ...a, live: false, sev: flareSev(a.cls) }; };
async function loadFlare() {
  const g = S; // the game this flare is for
  g.flare = pickArchive(); // ready straight away; replaced by live data if it arrives before the radiation event
  let f = flareCache;
  if (!f) { try { const c = JSON.parse(localStorage.getItem('oo_flare') || 'null'),age=Date.now()-c?.t; if (Number.isFinite(c?.t) && age>=0 && age<FLARE_TTL) f=normalizeFlareRecord(c.f); } catch {} }
  if (!f) f = await fetchFlare();
  if (!f) return;
  flareCache = f;
  if (!g.flareUsed) g.flare = { ...f, sev: flareSev(f.cls) };
}
async function fetchFlare() {
  const f = await fetchGameFlare();
  if (f) { try { localStorage.setItem('oo_flare', JSON.stringify({ t: Date.now(), f })); } catch (e) { } }
  return f;
}
const flareBox = f => f;
/* ============ events ============ */
// Events hold numbers; their text is looked up in lang/ under ev.<id>.
function mkEvent(id, o) {
  const choices = o.choices.map((c, i) => ({
    ...c, i,
    t: c.t || lz(`ev.${id}.choices.${i}.t`), d: c.d || lz(`ev.${id}.choices.${i}.d`), why: lz(`ev.${id}.choices.${i}.why`),
    risk: c.risk && { ...c.risk, text: lz(`ev.${id}.choices.${i}.risk`) },
  }));
  return {
    id, title: lz(`ev.${id}.title`), teaches: lz(`ev.${id}.teaches`), story: lz(`ev.${id}.story`), simNote: o.sim ? lz(`ev.${id}.sim`) : null, shock: {},
    ...o, choices, fact: { id, src: o.src, refs: o.refs, title: lz(`ev.${id}.fact.title`), text: lz(`ev.${id}.fact.text`) },
  };
}
// Extra science card shown after the day-4 ice event (every game reaches it).
const RASHID = { id: 'rashid', src: 'other', refs: [REF.spaceapps, REF.ispace, REF.lroImpact], title: lz('rashid.title'), text: lz('rashid.text') };
const EV = {
  power: ctx => mkEvent('power', {
    story: () => tx('ev.power.story') + (ctx.st.shadowSev > 1.2 ? ' ' + tx('ev.power.worse') : ctx.st.shadowSev < .8 ? ' ' + tx('ev.power.better') : ''),
    shock: { power: -Math.round(10 * ctx.st.shadowSev) },
    choices: [{ fx: { power: 6, prot: -5 } }, { fx: { power: -12, sci: 2 } }, { fx: { power: -4, prot: -6 }, flag: { panelBoost: 2 } }],
    src: 'nasa', refs: [REF.shadow],
  }),
  rad: ctx => {
    if (!S.flare) S.flare = pickArchive();
    S.flareUsed = true; // keep this flare for the rest of the game (the debrief shows the same one)
    const f = S.flare, D = f.sev * 8, mit = K.shelter.mit[ctx.b.shelter] + (S.flags.shieldBonus ? .3 : 0), dose = Math.round(D * (1 - Math.min(.8, mit)));
    return mkEvent('rad', {
      real: () => flareBox(f), sim: true,
      choices: [
        { fx: { prot: -Math.round(dose * .25), power: -5 } },
        { fx: { prot: -dose, sci: 2, power: -4 }, risk: { p: f.sev >= 3 ? .5 : .25, fx: { prot: -8 } } },
        { fx: { prot: -Math.round(dose * .5), power: -14 }, flag: { shieldBonus: true } },
      ],
      src: 'other', refs: [REF.change4, REF.radlab],
    });
  },
  dust: ctx => mkEvent('dust', {
    choices: [{ fx: { power: -6, prot: 5 } }, { fx: { power: -3, prot: -3 } }, { fx: { sci: 1 }, risk: { p: .6, fx: { power: -10, prot: -8, life: -4 } } }],
    src: 'nasa', refs: [REF.base, REF.regolith],
  }),
  micro: ctx => mkEvent('micro', {
    shock: { prot: -Math.round(8 * K.hab.mm[ctx.b.hab]) },
    choices: [{ fx: { power: -8, prot: 7 } }, { fx: { power: -2, life: -6 } }, { fx: {}, risk: { p: .5, fx: { life: -10, prot: -6 } } }],
    src: 'nasa', refs: [REF.weather],
  }),
  freeze: ctx => mkEvent('freeze', {
    real: () => realData(tx('ev.freeze.real'), REF.base), sim: true,
    shock: { power: -6 },
    choices: [{ fx: { power: -10, prot: 4 } }, { fx: { power: -2, prot: -5 } }, { fx: { sci: 1 }, risk: { p: .5, fx: { life: -8, power: -6 } } }],
    src: 'nasa', refs: [REF.base],
  }),
  ice: ctx => mkEvent('ice', {
    special: 'ice', fact2: RASHID,
    choices: [{ goto: 'explore', fx: {} }, { fx: { power: 8, sci: 0 }, skipIce: true }],
    src: 'nasa', refs: [REF.shack, REF.lcross],
  }),
  life: ctx => {
    const pw = Math.min(20, S.m.power), gain = Math.round(24 * pw / 20);
    return mkEvent('life', {
      shock: { life: -14 }, special: 'life',
      choices: [
        { fx: { power: -pw, life: gain }, disabled: pw <= 0, ...(pw < 20 ? { d: lz('ev.life.lowPw', { pw }) } : {}) },
        { fx: { power: -4, life: 13, sci: -1 } },
        { fx: { power: -2, life: 16, prot: -6 } },
      ],
      src: 'nasa', refs: [REF.massBal],
    });
  },
};

function planEvents() {
  const two = shuffle(['power', 'dust', 'micro']).slice(0, 2);
  // de Gerlache has its own event, which replaces one of the random ones. The real-flare radiation event always stays.
  if (S.site === 'gerlache') two[0] = 'freeze';
  S.events = [...shuffle(['rad', ...two]), 'ice', 'life'];
}

/* ============ plans (daily) ============ */
function planOptions() {
  const o = [{ id: 'sci', fx: { power: -8, sci: 1 }, need: 8 }, { id: 'fix', fx: { power: -5, prot: 6 }, need: 5 }];
  if (S.build.green) o.push({ id: 'gh', fx: { power: -6, life: 8 }, need: 6 });
  o.push({ id: 'save', fx: { power: 8, prot: -3 }, need: 0 });
  return o;
}

/* ============ engine ============ */
function applyFx(fx) {
  const d = {};
  for (const k of ['life', 'power', 'prot']) if (fx[k]) { const b = S.m[k]; S.m[k] = clamp(b + fx[k]); d[k] = S.m[k] - b; }
  if (fx.sci) { const b = S.sci; S.sci = Math.max(0, S.sci + fx.sci); d.sci = S.sci - b; }
  updateHUD(d);
  return d;
}
const mergeFx = (a, b) => { const o = { ...a }; for (const k in b) o[k] = (o[k] || 0) + b[k]; return o; };


// The original balance, sites, events, forecasts and science live in engine.js.
// This layer adds resumable, guarded transitions for the spatial game.
const JOBS = {sci:{at:'lab',fx:{power:-8,sci:1}},fix:{at:'pow',fx:{power:-5,prot:6}},gh:{at:'green',fx:{power:-6,life:8}},save:{at:'hab',fx:{power:8,prot:-3}}};
const EVENT_AT = {power:'pow',rad:'shelter',dust:'pow',micro:'hab',freeze:'rover',ice:'rover',life:'life'};
const ROUTES = [{id:'edge',base:10,ch:.35,cold:0,stuck:0},{id:'mid',base:16,ch:.5,cold:0,stuck:.1},{id:'deep',base:24,ch:.7,cold:8,stuck:.25}];
const OFF = {labs:{power:6,sci:-1},rover:{power:4,prot:-2},green:{power:5,life:-4},heat:{power:8,prot:-5}};
const Mission = {
  start(){
    if(!Object.hasOwn(SITES,S.site) || !['hab','pow','life','shelter'].every(k=>[1,2,3].includes(S.build[k])) || cost(S.build)>BUDGET || ![S.place.hab,S.place.pow].every(spot=>SITES[S.site].spots.includes(spot)) || S.place.hab===S.place.pow) return false;
    startMeters(); S.turn=0; S.sci=0; S.health=4; S.log=[]; S.facts=[]; S.ice=null;
    S.flags={panelBoost:0,shieldBonus:false}; S.selected=0; S.elapsed=0; S.clock=480;
    S.phase='brief'; S.position=[0,9]; S.dayJob=null; S.visited=[]; planEvents(); this.beginDay(); return true;
  },
  beginDay(){
    S.phase=S.m.power<=15?'emergency':'event'; S.cur=null; S.clock=480; S.dayJob=null;
    if(S.phase==='event')this.prepareEvent();
  },
  prepareEvent(){
    if(S.cur) return S.cur;
    S.cur=EV[S.events[S.turn]]({b:S.build,st:SITES[S.site]});
    if(!S.eventApplied){applyFx(S.cur.shock);S.eventApplied=true;}
    return S.cur;
  },
  current(){return S.cur || (S.phase==='event'?this.prepareEvent():null);},
  choose(i){
    if(S.phase!=='event')return false;
    const ev=this.current(),c=ev.choices[i]; if(!c || c.disabled || !this.afford(c.fx))return false;
    if(c.goto){S.phase='route';return true;}
    const d1=applyFx(c.fx||{}),hit=!!(c.risk && Math.random()<c.risk.p),d2=hit?applyFx(c.risk.fx):{};
    if(c.flag)Object.assign(S.flags,c.flag);
    if(hit&&ev.id==='dust')S.flags.dustPanels=true;
    if(c.skipIce)S.ice={done:false,skipped:true};
    S.log.push({type:'event',day:S.turn+1,id:ev.id,index:i,fx:mergeFx(d1,d2),hit});
    S.last={type:'event',id:ev.id,index:i,fx:mergeFx(d1,d2),hit};
    S.clock+=90; S.phase='result'; return true;
  },
  afford(fx){return !fx?.power || fx.power>=0 || S.m.power>=-fx.power;},
  emergency(keys){
    if(S.phase!=='emergency')return false;
    keys=[...new Set(keys)].filter(k=>OFF[k]&&(k!=='green'||S.build.green));
    const fx=keys.reduce((a,k)=>mergeFx(a,OFF[k]),{});applyFx(fx);
    S.log.push({type:'off',day:S.turn+1,keys,fx});S.phase='event';this.prepareEvent();return true;
  },
  routeCost(t){return Math.round(t.base*SITES[S.site].terrainMult*(S.build.rover?.7:1)*PLACE.ice[S.place.hab]);},
  chance(t){return Math.max(.1,Math.min(.9,t.ch+SITES[S.site].ice));},
  stuck(t){return S.build.rover?0:Math.min(.5,t.stuck*(SITES[S.site].terrainMult>1.5?1.5:1));},
  depart(id){
    if(S.phase!=='route')return false;
    const t=ROUTES.find(x=>x.id===id);if(!t || S.m.power<this.routeCost(t))return false;
    const paid=applyFx({power:-this.routeCost(t),prot:-t.cold});
    const r=Math.random(),ch=this.chance(t),stuck=Math.random()<this.stuck(t);
    S.scan={target:id,result:stuck?'stuck':r<ch*.6?'strong':r<ch?'weak':'none',paid};S.phase='drive';S.clock+=t.base*3;return true;
  },
  arrive(){
    if(S.phase!=='drive')return false;
    if(S.scan.result==='stuck'){
      const fx=applyFx({power:-6,prot:-4});S.ice={done:true,result:'stuck'};
      S.last={type:'ice',key:'explore.stuckWhy',fx};S.log.push({...S.last,day:S.turn+1,target:S.scan.target});S.phase='result';
    }else S.phase='scan';return true;
  },
  sample(dig){
    if(S.phase!=='scan' || (dig&&(S.scan.result==='none'||S.m.power<8)))return false;
    const strong=S.scan.result==='strong';
    const fx=applyFx({...(dig?{power:-8,sci:strong?4:2}:{sci:1}),prot:-3});
    S.ice={done:true,result:S.scan.result,dug:dig};
    if(dig&&strong){S.digFx=fx;S.phase='iceUse';return true;}
    const key=dig?'finish.digWhy':S.scan.result==='none'?'finish.noneWhy':'finish.homeWhy';
    S.last={type:'ice',key,fx};S.log.push({...S.last,day:S.turn+1,target:S.scan.target});S.phase='return';return true;
  },
  useIce(k){
    if(S.phase!=='iceUse'||!['water','oxy'].includes(k)||k==='oxy'&&S.m.power<6)return false;
    const fx=mergeFx(S.digFx,applyFx(k==='water'?{life:8}:{life:12,power:-6}));S.ice.use=k;
    S.last={type:'ice',key:`iceUse.${k}.why`,fx};S.log.push({...S.last,day:S.turn+1,target:S.scan.target});S.phase='return';return true;
  },
  job(id){
    if(S.phase!=='job'||!JOBS[id]||id==='gh'&&!S.build.green||!this.afford(JOBS[id].fx))return false;
    const fx=applyFx(JOBS[id].fx);if(id==='fix')S.flags.dustPanels=false;
    S.dayJob=id;S.clock+=120;S.log.push({type:'job',day:S.turn+1,id,fx});S.phase='nightReady';return true;
  },
  night(){
    if(S.phase!=='nightReady')return false;
    const f=forecast(),before={...S.m};
    applyFx({power:f.gen+f.boost-f.heat-f.ls-f.comms-f.gh});
    const slow=S.m.power<15;applyFx({life:-f.lifeDrain-(slow?6:0),prot:-f.drift});
    if(S.flags.panelBoost>0)S.flags.panelBoost--;
    const h=S.health;
    if(Object.values(S.m).some(x=>x<=0))S.health=Math.max(0,h-2);
    else if(Object.values(S.m).some(x=>x<20))S.health=Math.max(0,h-1);
    else if(Object.values(S.m).every(x=>x>=50)&&h<4)S.health++;
    S.night={before,after:{...S.m},gen:f.gen+f.boost,use:f.heat+f.ls+f.comms+f.gh,slow,healthBefore:h};
    S.turn++;S.clock=1200;S.phase='night';S.eventApplied=false;S.cur=null;return true;
  },
  goals(){return [S.health===4,Object.values(S.m).every(x=>x>0),S.sci>=6,!!S.ice?.done];},
  debrief(){
    if(S.result)return S.result;
    const safety=clamp(S.health*15+S.m.prot*.4),eff=clamp((S.m.life+S.m.power)/2),science=clamp(S.sci/6*100),met=this.goals().filter(Boolean).length;
    const total=Math.round((safety+eff+science+met*25)/4),alive=S.health>0,running=Object.values(S.m).every(x=>x>0);
    const outcome=!alive||!running?'fail':met>=3&&total>=55?'success':'partial';let prev=null;
    try{prev=JSON.parse(localStorage.getItem('odyssey_react_last')||'null');localStorage.setItem('odyssey_react_last',JSON.stringify({total,outcome,site:S.site}));}catch(e){}
    S.result={safety,eff,science,total,outcome,alive,prev};S.phase='debrief';return S.result;
  },
  save(){
    if(!S.phase||S.phase==='training')return;
    try{localStorage.setItem('odyssey_react_save',JSON.stringify({version:1,state:S},(k,v)=>k==='cur'||k==='facts'?undefined:v));}catch(e){}
  },
  restore(){
    const state=readSavedMission();if(!state)return false;S=state;S.cur=null;S.facts=[];if(S.flare)S.flare={...S.flare,sev:flareSev(S.flare.cls)};return true;
  }
};

let revision=0;const listeners=new Set();
export const changed=()=>{revision++;for(const f of listeners)f();};
export const model={
 subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
 getSnapshot(){return revision;},
 get state(){return S;},get language(){return LG;},
 change(fn){const result=fn(S);changed();return result;},
 run(method,...args){const result=Mission[method](...args);changed();return result;},
 setLanguage(lg){LG=LANG[lg]?lg:'en';try{localStorage.setItem('odyssey_react_lang',LG);}catch{}changed();},
 async newMission({weather=true}={}){newGame();S.site='ridge';S.build.rover=true;S.m={life:70,power:60,prot:60};S.phase='training';S.selected=0;changed();if(weather){await loadFlare();changed();}},
 save(spatial){if(spatial)S.spatial=spatial;Mission.save();},
 restore(){const ok=Mission.restore();if(ok)changed();return ok;},
 hasSave(){return !!readSavedMission();},
 forecast,cost,applyFx,startMeters,
};
if(import.meta.hot){
 if(import.meta.hot.data.state){S=import.meta.hot.data.state;LG=import.meta.hot.data.language||LG;}
 import.meta.hot.dispose(data=>{data.state=S;data.language=LG;});
}
export {SITES,TIERS,EXTRAS,BASE,K,BUDGET,PLACE,CREW,EV,REF,TERM_KEYS,JOBS,EVENT_AT,ROUTES,OFF,Mission,val,clamp,siteName};
