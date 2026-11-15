import React,{useCallback,useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {model,t,Mission,EVENT_AT,JOBS,CREW} from './game/model.js';
import {r} from './game/copy.js';
import {normalizeSettings} from './game/settings.js';
import {objective} from './game/objectives.js';
import {createWorld} from './world/createWorld.js';
import {AudioBus} from './audio/AudioBus.js';
import {Header,HUD} from './components/HUD.jsx';
import {Terminal} from './components/Terminal.jsx';
import {Button,Icon} from './components/UI.jsx';
import {stationName} from './components/Panels.jsx';

const initialSettings=()=>{const base={master:.65,music:.3,ambience:.5,effects:.65,voice:.85,narration:true,quality:matchMedia('(pointer: coarse)').matches?'low':'high',motion:matchMedia('(prefers-reduced-motion: reduce)').matches};try{return normalizeSettings(JSON.parse(localStorage.getItem('odyssey_react_settings')||'{}'),base);}catch{return base;}};
export default function App(){
 const revision=useSyncExternalStore(model.subscribe,model.getSnapshot),s=model.state;
 const mount=useRef(null),worldRef=useRef(null),handlers=useRef({}),frameRef=useRef({}),terminalRef=useRef(null),screenRef=useRef('menu'),busy=useRef(false),lastMaster=useRef(.65),audioRef=useRef(null);
 if(!audioRef.current)audioRef.current=new AudioBus();const audio=audioRef.current;
 const [world,setWorld]=useState(null),[screen,setScreen]=useState('menu'),[terminal,setTerminal]=useState(null),[frame,setFrame]=useState({labels:[],distance:0,position:{x:0,z:9}}),[settings,setSettings]=useState(initialSettings),[trained,setTrained]=useState(false),[caption,setCaption]=useState(''),[toast,setToast]=useState(''),[error,setError]=useState(null);
 const timer=useRef(null),settingsRef=useRef(settings);settingsRef.current=settings;screenRef.current=screen;terminalRef.current=terminal;
 const notice=useCallback(text=>{setToast(text);clearTimeout(timer.current);timer.current=setTimeout(()=>setToast(''),3500);},[]);
 useEffect(()=>{
  const api=createWorld({mount:mount.current,onFrame:f=>{
   const wasWorking=!!frameRef.current.work;frameRef.current=f;audio.tick(f,f.dt);
   if(screenRef.current==='play'&&!f.paused)safeElapsed(f.dt);
   if(!terminalRef.current||f.work||wasWorking)setFrame(f);
  },onInteract:id=>handlers.current.interact?.(id),onError:e=>setError(e?.message||'webgl')});
  worldRef.current=api;if(api.ready){
   api.setQuality(settingsRef.current.quality==='low');api.setReduced(settingsRef.current.motion);
   if(screenRef.current!=='menu'){
    const state=model.state;api.configure(state.build,state.place.hab&&state.place.pow?state.place:null);api.active=state.selected<state.health?state.selected:0;api.restore(state.spatial);if(['drive','scan','iceUse','return'].includes(state.phase))api.setRover(true);api.setMode(screenRef.current);
   }
   if(terminalRef.current)api.openTerminal(terminalRef.current.id);setWorld(api);
  }
  return()=>{if(api.ready&&screenRef.current!=='menu')model.state.spatial=api.snapshot();api.dispose?.();worldRef.current=null;clearTimeout(timer.current);audio.dispose();};
 },[]);
 const goal=objective(screen,trained),goalKey=[screen,s.phase,s.turn,s.pendingJob,trained,model.language].join(':');
 useEffect(()=>{world?.setGoal(screen==='menu'?null:goal.at||goal.point);if(screen==='menu')return;setCaption(goal.description);if(s.phase==='event'&&(s.events[s.turn]==='rad'||Object.values(s.m).some(v=>v<20)))audio.effect('warning');audio.speak(goal.description,model.language,goalKey);},[world,goalKey]);
 useEffect(()=>{document.documentElement.lang=model.language;document.documentElement.dir=model.language==='ar'?'rtl':'ltr';document.title=t('title')+' · '+r('edition');},[model.language]);
 useEffect(()=>{audio.setSettings(settings);world?.setQuality(settings.quality==='low');world?.setReduced(settings.motion);document.body.classList.toggle('reduce-motion',settings.motion);try{localStorage.setItem('odyssey_react_settings',JSON.stringify(settings));}catch{}},[settings,world]);
 const save=()=>{if(screenRef.current==='play'){s.selected=world?.active||0;model.save(world?.snapshot());}};
 function close(){setTerminal(null);terminalRef.current=null;world?.closeTerminal();audio.stopVoice();audio.effect('click');}
 function open(id,tab='station'){
  if(!world?.ready||busy.current)return;world.openTerminal(id);const entry={id,tab};terminalRef.current=entry;setTerminal(entry);audio.effect('open');save();
 }
 function work(id,fn,tab='station',station=id,duration=3){
  if(busy.current||!world)return;busy.current=true;setTerminal(null);terminalRef.current=null;audio.stopVoice();audio.effect(id==='rover'?'scan':'work');
  world.perform(id,settings.motion?Math.min(1,duration):duration,()=>{busy.current=false;fn();save();audio.effect('success');if(tab)open(station,tab);});
 }
 const actions={
  start(){world?.cancelWork();busy.current=false;close();setTrained(false);audio.voiceKey='';model.newMission();world?.setRover(false);world?.configure(model.state.build);if(world){world.active=0;world.crew.forEach((c,i)=>{c.position.set(-2+i*1.9,0,8);c.rotation.y=Math.PI;});world.resetCamera();world.setMode('training');}setScreen('training');audio.unlock().then(()=>{audio.effect('success');if(!audio.voiceKey)audio.speak(r('trainingGuide'),model.language);});},
  resume(){if(!model.restore()){notice(r('savedMissing'));return;}const state=model.state;close();world.setRover(false);world.configure(state.build,state.place);world.active=state.selected<state.health?state.selected:0;world.restore(state.spatial);if(['drive','scan','iceUse','return'].includes(state.phase))world.setRover(true);world.setMode('play');setScreen('play');if(state.phase==='event')model.run('current');audio.unlock();},
  home(){save();world?.cancelWork();busy.current=false;close();world?.setMode('menu');setScreen('menu');setCaption('');},
  close,utility(tab){open('portable',tab);},
  settings(patch){setSettings(v=>({...v,...patch}));},
  mute(){if(settings.master){lastMaster.current=settings.master;setSettings(v=>({...v,master:0}));}else{setSettings(v=>({...v,master:lastMaster.current||.65}));audio.unlock();}},
  language(){model.setLanguage(model.language==='en'?'ar':'en');audio.stopVoice();},
  setup(){if(busy.current)return;setScreen('setup');world.setMode('setup');open('lab','setup');},
  train(choice){if(trained||busy.current)return;work('lab',()=>{model.change(()=>model.applyFx(choice==='up'?{power:-8,prot:4}:{power:6,prot:-4}));setTrained(choice);},'training','lab');},
  launch(){if(!model.run('start'))return;close();world.setRover(false);world.configure(s.build,s.place);world.active=0;world.crew.forEach((c,i)=>{c.position.set(-2+i*1.9,0,8);c.rotation.y=Math.PI;});world.resetCamera();world.setMode('play');setScreen('play');model.save(world.snapshot());notice(t('x.landing'));audio.effect('success');},
  interact(id){if(busy.current)return;if(world.nearest()!==id){world.navigate(id,true);return;}if(screen==='training')open(id==='lab'?'lab':id,id==='lab'?'training':'station');else if(screen==='setup')open('lab','setup');else open(id,'station');},
  navigate(id){close();world?.navigate(id,true);},
  guide(){if(busy.current)return;if(terminal)close();if(goal.at)world.navigate(goal.at,true);else if(goal.point)world.goPoint(...goal.point);},
  use(){
   if(busy.current||terminal)return;const f={nearGoal:world.nearGoal(),nearest:world.nearest()};
   if(['drive','scan','iceUse','return'].includes(s.phase)&&f.nearGoal){
    if(s.phase==='drive')work('rover',()=>{model.run('arrive');if(s.phase==='result'){world.resetRover();world.setRover(false);}},'station',s.scan?.result==='stuck'?'rover':'survey');
    else if(s.phase==='return'){world.resetRover();world.setRover(false);model.change(s=>s.phase='result');save();open('rover','station');}
    else open('survey','station');
   }else if(!world.roverMode&&f.nearest)actions.interact(f.nearest);
  },
  crew(i){if(i>=s.health||world.roverMode||busy.current)return;close();world.select(i);model.change(s=>s.selected=i);notice(t('crew.'+CREW[i]+'.name')+' · '+t('crew.'+CREW[i]+'.role'));save();},
  choose(i){if(s.phase!=='event')return;const id=s.events[s.turn];if(!Mission.afford(Mission.current().choices[i]?.fx))return;
   if(id==='ice'&&i===0){model.run('choose',i);save();audio.effect('click');return;}
   work(EVENT_AT[id],()=>model.run('choose',i));
  },
  toJobs(){if(s.phase!=='result')return;model.change(s=>{s.phase='job';s.pendingJob=null;});close();save();},
  jobTarget(id){if(s.phase!=='job')return;model.change(s=>s.pendingJob=id);close();world.navigate(JOBS[id].at,true);},
  job(id){if(s.phase!=='job'||!Mission.afford(JOBS[id].fx))return;work(JOBS[id].at,()=>{model.run('job',id);model.change(s=>s.pendingJob=null);notice(r('jobDone'));},null);},
  inspect(id){work(id,()=>{model.change(s=>{s.visited=s.visited||[];if(!s.visited.includes(id))s.visited.push(id);});notice(r('visited'));});},
  endDay(){if(s.phase!=='nightReady')return;work('hab',()=>{model.run('night');if(world.active>=s.health&&s.health>0)world.select(0);});},
  nextDay(){if(s.phase!=='night'||s.turn>=5||s.health<=0)return;model.run('beginDay');close();save();if(s.m.power<20)audio.effect('warning');},
  debrief(){model.run('debrief');save();audio.effect('success');},
  depart(id){if(!model.run('depart',id))return;close();world.setRover(true);save();notice(t('x.roverDrive'));},
  cancelRoute(){if(s.phase!=='route')return;model.change(s=>s.phase='event');model.run('choose',1);save();},
  sample(dig){if(s.phase!=='scan'||dig&&s.m.power<8)return;work('rover',()=>model.run('sample',dig),dig&&s.scan.result==='strong'?'station':null,'survey');},
  useIce(key){if(!model.run('useIce',key))return;close();save();notice(r('bringHome'));},
  emergency(keys){if(s.phase!=='emergency')return;work('lab',()=>model.run('emergency',keys));},
  repeat(){audio.unlock().then(()=>audio.repeat(caption,model.language));},
  fullScreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.().catch(()=>{});}
 };
 handlers.current=actions;
 useEffect(()=>{
  function keydown(e){const a=handlers.current,w=worldRef.current;if(!w?.ready)return;const k=e.key.toLowerCase();if(k==='escape'){e.preventDefault();if(terminalRef.current)a.close();else if(screenRef.current!=='menu')a.utility('pause');return;}
   if(terminalRef.current||screenRef.current==='menu'||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
   if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift'].includes(k)){e.preventDefault();w.key(k,true);}
   if(e.repeat)return;if(k==='e'){e.preventDefault();a.use();}if(k==='m')a.utility('map');if(k==='r')w.resetCamera();if(['1','2','3','4'].includes(k))a.crew(+k-1);
  }
  function keyup(e){worldRef.current?.key(e.key.toLowerCase(),false);}
  function visibility(){audio.visibility(document.hidden);if(document.hidden){worldRef.current?.stop();if(screenRef.current==='play'){model.state.selected=worldRef.current?.active||0;model.save(worldRef.current?.snapshot());if(!terminalRef.current)handlers.current.utility('pause');}}}
  function beforeLeave(){if(screenRef.current==='play')model.save(worldRef.current?.snapshot());}
  window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);document.addEventListener('visibilitychange',visibility);window.addEventListener('beforeunload',beforeLeave);
  return()=>{window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('beforeunload',beforeLeave);};
 },[]);
 return <div className={'app '+(terminal?'console-open':'')+' '+(screen==='menu'?'menu-mode':'play-mode')} onPointerDownCapture={()=>{if(!audio.started||audio.ctx?.state==='suspended')audio.unlock();}} onClickCapture={()=>audio.effect('click')}>
  <div className="world" ref={mount}/><div className="vignette"/><Header playing={screen!=='menu'} terminal={terminal} settings={settings} actions={actions}/>
  {screen==='menu'&&!terminal&&<main className="menu"><div className="menu-eyebrow"><i/>{r('edition')}</div><h1>{t('menu.h1a')}<span>{t('menu.h1b')}</span></h1><p className="menu-intro">{r('intro')}</p><div className="menu-buttons"><Button primary disabled={!world||!!error} onClick={actions.start}>{r('start')}<Icon name="arrow"/></Button>{model.hasSave()&&<Button disabled={!world||!!error} onClick={actions.resume}>{r('resume')}</Button>}</div><p className="menu-audio"><Icon name="sound" size={15}/>{r('soundStart')}</p><div className="menu-features"><span><Icon name="walk"/>{r('view')}</span><span><Icon name="full"/>{r('desktop')}</span></div><p className="menu-note">{r('note')}</p><footer><span>DUNETECH / NASA SPACE APPS</span><button onClick={()=>actions.utility('help')}>{r('help')} ↗</button><button onClick={()=>actions.utility('library')}>{r('science')} ↗</button></footer></main>}
  {screen!=='menu'&&world&&!error&&<HUD world={world} frame={frame} goal={goal} terminal={terminal} screen={screen} trainingDone={trained} caption={caption} settings={settings} actions={actions}/>}
  {screen==='menu'&&terminal&&<div className="console-exit"><Button onClick={close}><Icon name="close"/>{r('leave')}</Button></div>}
  {terminal&&world&&<Terminal terminal={terminal} world={world} frame={frame} settings={settings} audio={audio} actions={actions} trainingDone={trained}/>}
  {toast&&<div className="toast" role="status">{toast}</div>}
  {!world&&!error&&<div className="loading-label">{r('preparing')}</div>}
  {error&&<div className="graphics-error" role="alert"><Icon name="target" size={32}/><h2>{r('failed3d')}</h2><p>{r('failed3dHelp')}</p><Button primary onClick={()=>location.reload()}>{r('retry')}</Button></div>}
  {screen!=='menu'&&!terminal&&<button className="fullscreen-button" onClick={actions.fullScreen} title={r('fullScreen')} aria-label={r('fullScreen')}><Icon name="full" size={17}/></button>}
 </div>;
}
function safeElapsed(dt){model.state.elapsed=(model.state.elapsed||0)+dt;}
