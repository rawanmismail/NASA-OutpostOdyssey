import React,{useState,useRef,useEffect} from 'react';
import {joystickVector} from '../world/math.js';
import {r} from '../game/copy.js';
import {Icon} from './UI.jsx';
export function TouchControls({world,canUse,onUse,onGuide,hidden=false}){
 const [stick,setStick]=useState({px:0,py:0}),[sprint,setSprint]=useState(false),pointer=useRef(null),base=useRef(null);
 const release=()=>{pointer.current=null;setStick({px:0,py:0});world?.setMove(0,0);};
 useEffect(()=>{if(hidden){release();setSprint(false);world?.sprint(false);}},[hidden]);
 useEffect(()=>{const stop=()=>{release();setSprint(false);world?.sprint(false);},visibility=()=>{if(document.hidden)stop();};window.addEventListener('blur',stop);document.addEventListener('visibilitychange',visibility);return()=>{window.removeEventListener('blur',stop);document.removeEventListener('visibilitychange',visibility);world?.setMove(0,0);world?.sprint(false);};},[world]);
 if(hidden)return null;
 function down(e){if(pointer.current!==null)return;e.preventDefault();pointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);move(e);}
 function move(e){if(pointer.current!==e.pointerId)return;e.preventDefault();const rect=base.current.getBoundingClientRect(),v=joystickVector(e.clientX-(rect.left+rect.width/2),e.clientY-(rect.top+rect.height/2),rect.width*.32);setStick(v);world?.setMove(v.x,v.y);}
 return <div className="touch-controls" dir="ltr"><div className="stick-area"><span>{r('move')}</span><div ref={base} className="joystick" onPointerDown={down} onPointerMove={move} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} aria-label={r('move')} role="group"><div className="stick-rings"/><i style={{transform:`translate(${stick.px}px,${stick.py}px)`}}/></div></div><div className="touch-actions"><button className={'touch-sprint '+(sprint?'active':'')} aria-label={r('sprint')} aria-pressed={sprint} onClick={()=>{setSprint(v=>!v);world?.sprint(!sprint);}}><Icon name="walk" size={24}/><span>{r('sprint')}</span></button><button className="touch-use" onClick={onUse} disabled={!canUse} aria-label={r('interact')}><Icon name="tool" size={30}/><span>{r('use')}</span></button><button className="touch-guide" onClick={onGuide} aria-label={r('go')}><Icon name="target" size={20}/></button></div></div>;
}
