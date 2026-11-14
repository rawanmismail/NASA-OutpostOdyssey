import React,{useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import {model,t} from '../game/model.js';
import {r} from '../game/copy.js';
import {Button,Choice,Icon} from './UI.jsx';
import {Setup} from './Setup.jsx';
import {Station} from './Station.jsx';
import {SciencePanel,MapPanel,LogEntries,Goals,SettingsPanel,HelpPanel,MeterPanel,Report,stationName} from './Panels.jsx';
export function Terminal({terminal,world,frame,settings,audio,actions,trainingDone}){
 const heading=useRef(null);useEffect(()=>{heading.current?.focus({preventScroll:true});},[terminal.id,terminal.tab,model.state.phase,trainingDone]);
 const tab=terminal.tab,s=model.state;
 const title=tab==='station'?r('station',{name:stationName(terminal.id)}):r({training:'training',setup:'setup',library:'science',map:'map',log:'log',settings:'audio',help:'help',pause:'paused',meters:'equipment',report:'missionReport'}[tab]||'console');
 let body;
 if(tab==='training')body=trainingDone?<><div className="success-heading"><Icon name="check" size={40}/></div><h2>{r('trainingDone')}</h2><p className="intro">{t(trainingDone==='up'?'train.s2.resUp':'train.s2.resDown')}</p><p>{t('train.s0.p2')}</p><Button primary onClick={actions.setup}>{r('setup')}<Icon name="arrow"/></Button></>:<><h2>{r('trainingTitle')}</h2><p className="intro">{r('trainingIntro')}</p><div className="choices">{['up','down'].map((k,i)=><Choice key={k} title={t('train.s2.'+k+'.0')} description={t('train.s2.'+k+'.1')} fx={i?{power:6,prot:-4}:{power:-8,prot:4}} onClick={()=>actions.train(k)}/>)}</div><p className="note">{r('trainingNote')}</p></>;
 else if(tab==='setup')body=<Setup world={world} frame={frame} onLaunch={actions.launch} onNavigate={actions.navigate}/>;
 else if(tab==='station')body=<Station id={terminal.id} actions={actions}/>;
 else if(tab==='library')body=<SciencePanel/>;
 else if(tab==='map')body=<MapPanel world={world} frame={frame} onNavigate={actions.navigate}/>;
 else if(tab==='log')body=<><Goals/><LogEntries/></>;
 else if(tab==='settings')body=<SettingsPanel settings={settings} onSettings={actions.settings} audio={audio}/>;
 else if(tab==='help')body=<HelpPanel/>;
 else if(tab==='meters')body=<MeterPanel/>;
 else if(tab==='report')body=<Report onRestart={actions.start}/>;
 else if(tab==='pause')body=<><h2>{r('paused')}</h2><p className="intro">{r('saved')}</p><div className="choices"><Button primary onClick={actions.close}>{r('continue')}</Button><Button onClick={()=>actions.utility('settings')}>{r('audio')}</Button><Button onClick={()=>actions.utility('help')}>{r('help')}</Button><Button quiet onClick={actions.home}>{r('home')}</Button></div></>;
 return createPortal(<section className="terminal" aria-label={title} dir={model.language==='ar'?'rtl':'ltr'} onPointerDown={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key!=='Escape')e.stopPropagation();}}>
   <header className="terminal-header"><div className="terminal-heading"><span className="console-led"/><div><span className="terminal-eyebrow">{terminal.id==='portable'?r('portable'):r('console')}</span><h1 ref={heading} tabIndex={-1}>{title}</h1></div></div><button className="terminal-close" onClick={actions.close} aria-label={r('leave')}><Icon name="close" size={28}/></button></header>
   <div className="terminal-status"><span>● {r('live')}</span><span>{s.phase==='training'?r('training'):r('day',{n:Math.min(s.phase==='night'?s.turn:(s.turn||0)+1,5)})} / {r('sim')}</span></div>
   <div className="terminal-scroll" key={tab==='station'?s.phase:tab}>{body}</div>
   <footer className="terminal-bottom"><span>{r('reading')}</span><span>◈ DUNETECH</span></footer>
 </section>,world.terminalHost);
}
