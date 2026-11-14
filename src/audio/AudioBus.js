// Synthesized audio is local. Speech uses an installed browser/device voice.
// No microphone, audio downloads, account or remote speech API is required.
export class AudioBus {
  constructor(){this.settings={master:.65,music:.3,ambience:.5,effects:.65,voice:.85,narration:true};this.nodes=[];this.started=false;this.lastStep=0;this.voiceKey='';this.hidden=false;}
  async unlock(){
    try{
      const Context=globalThis.AudioContext||globalThis.webkitAudioContext;
      if(!Context)return false;
      if(!this.ctx){
        this.ctx=new Context();const c=this.ctx;
        this.master=c.createGain();this.master.gain.value=0;this.master.connect(c.destination);
        this.music=c.createGain();this.music.connect(this.master);
        this.ambience=c.createGain();this.ambience.connect(this.master);
        this.effects=c.createGain();this.effects.connect(this.master);
        this.engine=c.createGain();this.engine.gain.value=0;this.engine.connect(this.ambience);
        this.machine=c.createGain();this.machine.gain.value=0;this.machine.connect(this.ambience);
        for(const [i,f]of[65.41,98,130.81,164.81,196].entries()){
          const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f;o.detune.value=i%2?-5:4;g.gain.value=.045/(i+1);o.connect(g);g.connect(this.music);o.start();this.nodes.push(o);
          const l=c.createOscillator(),depth=c.createGain();l.frequency.value=.018+i*.007;depth.gain.value=.014/(i+1);l.connect(depth);depth.connect(g.gain);l.start();this.nodes.push(l);
        }
        const hum=c.createOscillator(),hg=c.createGain();hum.type='sine';hum.frequency.value=78;hg.gain.value=.035;hum.connect(hg);hg.connect(this.machine);hum.start();this.nodes.push(hum);
        this.motor=c.createOscillator();this.motor.type='triangle';this.motor.frequency.value=50;const mg=c.createGain();mg.gain.value=.09;this.motor.connect(mg);mg.connect(this.engine);this.motor.start();this.nodes.push(this.motor);
        const buffer=c.createBuffer(1,c.sampleRate*2,c.sampleRate),data=buffer.getChannelData(0);let brown=0;
        for(let i=0;i<data.length;i++){brown=(brown+(Math.random()*2-1)*.02)/1.02;data[i]=brown*.9;}
        const noise=c.createBufferSource(),filter=c.createBiquadFilter(),ng=c.createGain();noise.buffer=buffer;noise.loop=true;filter.type='lowpass';filter.frequency.value=450;ng.gain.value=.07;noise.connect(filter);filter.connect(ng);ng.connect(this.ambience);noise.start();this.nodes.push(noise);
      }
      if(this.ctx.state==='suspended')await this.ctx.resume();
      this.started=true;this.setSettings(this.settings);return this.ctx.state==='running';
    }catch{return false;}
  }
  setSettings(settings){
    Object.assign(this.settings,settings);if(!this.ctx)return;
    const t=this.ctx.currentTime,s=this.settings;
    for(const key of['master','music','ambience','effects'])this[key].gain.setTargetAtTime(this.hidden?0:s[key],t,.12);
    if(!s.narration||!s.master||!s.voice)globalThis.speechSynthesis?.cancel();
  }
  tone(frequency,duration=.12,type='sine',volume=.12,delay=0){
    if(!this.ctx||this.ctx.state!=='running')return;
    const c=this.ctx,t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(frequency,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(this.effects);o.start(t);o.stop(t+duration+.02);o.onended=()=>{o.disconnect();g.disconnect();};
  }
  effect(kind){
    if(kind==='click'){this.tone(620,.055,'sine',.06);return;}
    if(kind==='open'){this.tone(440,.09,'sine',.07);this.tone(880,.16,'sine',.05,.06);return;}
    if(kind==='success'){[523.25,659.25,783.99].forEach((f,i)=>this.tone(f,.32,'sine',.09,i*.09));return;}
    if(kind==='warning'){this.tone(220,.22,'triangle',.1);this.tone(196,.22,'triangle',.08,.28);return;}
    if(kind==='work'){[280,420,560].forEach((f,i)=>this.tone(f,.12,'triangle',.06,i*.2));return;}
    if(kind==='scan'){for(let i=0;i<7;i++)this.tone(350+i*110,.1,'sine',.06,i*.13);return;}
    if(kind==='step'){this.tone(72,.12,'triangle',.13);this.tone(340,.045,'sine',.025,.03);}
  }
  tick({moving,rover,nearest,distance,sprinting,paused},dt){
    if(!this.ctx||this.ctx.state!=='running')return;
    const c=this.ctx,t=c.currentTime;this.lastStep+=dt;
    if(moving&&!rover&&!paused&&this.lastStep>(sprinting?.29:.47)){this.effect('step');this.lastStep=0;}
    this.engine.gain.setTargetAtTime(rover&&!paused?(moving?.8:.17):0,t,.15);
    this.motor.frequency.setTargetAtTime(moving?82:45,t,.25);
    this.machine.gain.setTargetAtTime(nearest&&!paused?Math.max(0,1-distance/14)*.6:0,t,.3);
  }
  localVoice(language){return globalThis.speechSynthesis?.getVoices().find(v=>v.localService&&v.lang.toLowerCase().startsWith(language))||null;}
  speak(text,language='en',key=text){
    if(!this.started||!this.settings.narration||!this.settings.voice||!this.settings.master||this.hidden||key===this.voiceKey)return false;
    const voice=this.localVoice(language);if(!voice)return false;
    this.voiceKey=key;globalThis.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.voice=voice;u.lang=voice.lang;u.rate=.94;u.pitch=1;u.volume=Math.min(1,this.settings.voice*this.settings.master);this.tone(920,.065,'sine',.04);globalThis.speechSynthesis.speak(u);return true;
  }
  repeat(text,language){this.voiceKey='';return this.speak(text,language);}
  async visibility(hidden){this.hidden=hidden;globalThis.speechSynthesis?.cancel();if(!this.ctx)return;this.setSettings(this.settings);if(hidden&&this.ctx.state==='running')await this.ctx.suspend();}
  stopVoice(){globalThis.speechSynthesis?.cancel();}
  dispose(){this.stopVoice();for(const n of this.nodes)try{n.stop();n.disconnect();}catch{}this.nodes=[];this.ctx?.close().catch(()=>{});this.ctx=null;this.started=false;}
}
