import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
test('React renders station states, setup, maps and field panels in both languages',async()=>{
 const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
 const server=await createServer({server:{middlewareMode:true},appType:'custom'});
 try{
  const {model}=await server.ssrLoadModule('/src/game/model.js');
  const {Station}=await server.ssrLoadModule('/src/components/Station.jsx');
  const {Setup}=await server.ssrLoadModule('/src/components/Setup.jsx');
  const panels=await server.ssrLoadModule('/src/components/Panels.jsx');
  const noop=()=>{},actions=new Proxy({},{get:()=>noop}),world={goalId:'lab',positions:()=>({lab:{x:2,z:3},hab:{x:-6,z:0}})},frame={position:{x:0,z:9}};
  const check=(Component,props,name)=>{const html=renderToStaticMarkup(React.createElement(Component,props));assert.ok(html.length>20,name);assert.doesNotMatch(html,/\[(?:x|ev|res|obj|scene|site|place|r|plan|debrief|train|terms)\./,name);assert.doesNotMatch(html,/\[object Object\]/,name);};
  let count=0;
  for(const lg of['en','ar']){
   await model.newMission({weather:false});model.setLanguage(lg);model.change(s=>s.place={hab:'edge',pow:'high'});model.run('start');
   check(Setup,{onLaunch:noop,world,frame,onNavigate:noop},'setup');
   for(const id of['power','rad','dust','micro','freeze','ice','life']){model.change(s=>{s.events[0]=id;s.turn=0;s.phase='event';s.cur=null;s.eventApplied=false;s.m={life:85,power:100,prot:85};});model.run('current');const at={power:'pow',rad:'shelter',dust:'pow',micro:'hab',freeze:'rover',ice:'rover',life:'life'}[id];check(Station,{id:at,actions},id);model.run('choose',id==='ice'?1:0);check(Station,{id:at,actions},id+' result');count+=2;}
   for(const id of['hab','pow','life','shelter','green','lab','rover']){model.change(s=>s.phase='job');check(Station,{id,actions},id+' job');count++;}
   for(const[name,props]of[['FieldGuide',{}],['LogEntries',{}],['Goals',{}],['MapPanel',{world,frame,onNavigate:noop}],['MeterPanel',{}],['HelpPanel',{}],['Forecast',{}],['SettingsPanel',{settings:{master:.6,music:.3,ambience:.5,effects:.5,voice:.8,narration:true,quality:'low',motion:false},onSettings:noop,audio:{localVoice:()=>null}}]]){check(panels[name],props,name);count++;}
   model.change(s=>{s.phase='route';s.m.power=100;});check(Station,{id:'rover',actions},'routes');model.run('depart','deep');model.change(s=>s.scan.result='strong');model.run('arrive');check(Station,{id:'survey',actions},'scan');model.run('sample',true);check(Station,{id:'survey',actions},'ice');model.run('useIce','water');model.change(s=>s.phase='nightReady');model.run('night');check(Station,{id:'hab',actions},'night');model.run('debrief');check(panels.Report,{onRestart:noop},'report');model.change(s=>s.phase='emergency');check(Station,{id:'lab',actions},'emergency');count+=6;
  }
  assert.equal(count,70);
 }finally{await server.close();}
});

test('CSA learning resources are bilingual, optional, and available during greenhouse jobs',async()=>{
 const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
 const server=await createServer({server:{middlewareMode:true},appType:'custom'});
 try{
  const {model}=await server.ssrLoadModule('/src/game/model.js');
  const {LearningLab,GreenhouseLearning}=await server.ssrLoadModule('/src/components/LearningLab.jsx');
  const {SciencePanel}=await server.ssrLoadModule('/src/components/Panels.jsx');
  const {Station}=await server.ssrLoadModule('/src/components/Station.jsx');
  const {CSA_RESOURCES,LEARNING_COPY}=await server.ssrLoadModule('/src/game/learning.js');
  const render=(component,props={})=>renderToStaticMarkup(React.createElement(component,props));
  for(const language of['en','ar']){
   await model.newMission({weather:false});model.setLanguage(language);model.change(s=>s.phase='job');const before=JSON.stringify(model.state);
   const lab=render(LearningLab);for(const resource of Object.values(CSA_RESOURCES)){assert.ok(lab.includes(`href="${resource.href}"`));assert.ok(lab.includes(resource[language].title));}
   assert.equal((lab.match(/rel="noopener noreferrer"/g)||[]).length,2);assert.equal((lab.match(/target="_blank"/g)||[]).length,2);
   assert.ok(render(SciencePanel).includes(LEARNING_COPY[language].lab));
   const greenhouse=render(GreenhouseLearning);assert.match(greenhouse,/^<details class="greenhouse-learning"><summary>/);assert.ok(greenhouse.includes(CSA_RESOURCES.food.href));
   assert.ok(render(Station,{id:'green',actions:{}}).includes(CSA_RESOURCES.food.href));assert.ok(!render(Station,{id:'hab',actions:{}}).includes(CSA_RESOURCES.food.href));
   assert.equal(JSON.stringify(model.state),before,'reading learning resources leaves mission state unchanged');
  }
 }finally{await server.close();}
});
