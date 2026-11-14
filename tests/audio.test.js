import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioBus} from '../src/audio/AudioBus.js';
class Param{value=0;setTargetAtTime(v){this.value=v;}setValueAtTime(v){this.value=v;}exponentialRampToValueAtTime(v){this.value=v;}}
class Node{gain=new Param();frequency=new Param();detune=new Param();connect(){}disconnect(){}start(){}stop(){this.onended?.();}}
class Context{currentTime=0;sampleRate=8000;state='suspended';destination={};createGain(){return new Node();}createOscillator(){return new Node();}createBufferSource(){return new Node();}createBiquadFilter(){return new Node();}createBuffer(a,n){return{getChannelData:()=>new Float32Array(n)};}async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}}
test('audio is created only after a player gesture and volume controls are independent',async()=>{
 globalThis.AudioContext=Context;const b=new AudioBus();assert.equal(b.ctx,undefined);assert.equal(await b.unlock(),true);assert.ok(b.nodes.length>=12);b.setSettings({master:0,music:.1,effects:.8,ambience:.3});assert.equal(b.master.gain.value,0);assert.equal(b.music.gain.value,.1);assert.equal(b.effects.gain.value,.8);assert.equal(b.ambience.gain.value,.3);for(const kind of['click','open','success','warning','work','scan','step'])assert.doesNotThrow(()=>b.effect(kind));b.dispose();assert.equal(b.ctx,null);
});
test('missing voices degrade to captions without network speech or errors',async()=>{globalThis.AudioContext=Context;globalThis.speechSynthesis={getVoices:()=>[],cancel(){}};const b=new AudioBus();await b.unlock();assert.equal(b.speak('Hello','en'),false);globalThis.speechSynthesis.getVoices=()=>[{lang:'en-US',localService:false}];assert.equal(b.speak('Hello','en'),false);b.dispose();});
test('local speech uses the selected language, respects mute and cancels on background',async()=>{
 let spoken=null,cancelled=0;globalThis.AudioContext=Context;globalThis.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};globalThis.speechSynthesis={getVoices:()=>[{lang:'en-US',localService:true},{lang:'ar-SA',localService:true}],cancel(){cancelled++;},speak(u){spoken=u;}};
 const b=new AudioBus();await b.unlock();assert.equal(b.speak('مرحباً','ar','cue1'),true);assert.equal(spoken.lang,'ar-SA');assert.equal(b.speak('مرحباً','ar','cue1'),false);b.setSettings({master:0});assert.equal(b.speak('Again','en','cue2'),false);b.setSettings({master:.65});await b.visibility(true);assert.equal(b.ctx.state,'suspended');assert.equal(b.speak('Again','en','cue3'),false);assert.ok(cancelled>0);await b.visibility(false);await b.unlock();assert.equal(b.ctx.state,'running');b.dispose();
});
