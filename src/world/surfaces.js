import * as THREE from 'three';

// Small, deterministic, locally generated PBR maps: no texture service at runtime.
export function createSurfaces(renderer) {
 let seed=706;const random=()=>((seed=seed*16807%2147483647)-1)/2147483646;
 function texture(w,h,paint,color=true){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;paint(canvas.getContext('2d'),w,h);const t=new THREE.CanvasTexture(canvas);if(color)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return t;}
 const grain=texture(256,256,(c,w,h)=>{const data=c.createImageData(w,h);for(let i=0;i<data.data.length;i+=4){const n=90+random()*100;data.data[i]=n;data.data[i+1]=n;data.data[i+2]=n;data.data[i+3]=255;}c.putImageData(data,0,0);},false);grain.wrapS=grain.wrapT=THREE.RepeatWrapping;
 const cloth=texture(128,128,(c,w,h)=>{c.fillStyle='#b7b7b7';c.fillRect(0,0,w,h);for(let i=0;i<128;i+=4){c.fillStyle=i%8?'#b0b0b0':'#d2d2d2';c.fillRect(i,0,1,h);c.fillRect(0,i,w,1);}},false);cloth.wrapS=cloth.wrapT=THREE.RepeatWrapping;cloth.repeat.set(5,5);
 const foil=texture(256,256,(c,w,h)=>{c.fillStyle='#b2b2b2';c.fillRect(0,0,w,h);for(let i=0;i<700;i++){const x=random()*w,y=random()*h;c.strokeStyle=`rgba(${random()>.5?'255,255,255':'0,0,0'},.2)`;c.lineWidth=1+random()*2;c.beginPath();c.moveTo(x,y);c.lineTo(x+random()*60-30,y+random()*60-30);c.stroke();}},false);foil.wrapS=foil.wrapT=THREE.RepeatWrapping;
 const regolith=texture(512,512,(c,w,h)=>{c.fillStyle='#8d8b87';c.fillRect(0,0,w,h);for(let i=0;i<42000;i++){const v=70+random()*110;c.fillStyle=`rgba(${v},${v},${v},${.15+random()*.4})`;const r=random()*1.7;c.fillRect(random()*w,random()*h,r,r);}for(let i=0;i<220;i++){c.fillStyle='rgba(35,34,32,.13)';c.beginPath();c.ellipse(random()*w,random()*h,random()*4+.5,random()*2+.4,random()*6,0,Math.PI*2);c.fill();}});regolith.wrapS=regolith.wrapT=THREE.RepeatWrapping;regolith.repeat.set(32,32);
 const cells=texture(256,512,(c,w,h)=>{c.fillStyle='#111c32';c.fillRect(0,0,w,h);for(let x=3;x<w;x+=32)for(let y=3;y<h;y+=64){const g=c.createLinearGradient(x,y,x+29,y+61);g.addColorStop(0,'#263f68');g.addColorStop(.5,'#182b51');g.addColorStop(1,'#344873');c.fillStyle=g;c.fillRect(x,y,28,60);c.strokeStyle='#617b9c';c.lineWidth=.7;for(let k=6;k<28;k+=7){c.beginPath();c.moveTo(x+k,y);c.lineTo(x+k,y+60);c.stroke();}c.fillStyle='#b3bac2';c.fillRect(x+13,y,1,60);}});
 const tread=texture(128,256,(c,w,h)=>{c.fillStyle='#5b5c59';c.fillRect(0,0,w,h);for(let y=-20;y<h;y+=24){c.strokeStyle='#cecebf';c.lineWidth=6;c.beginPath();c.moveTo(0,y);c.lineTo(w/2,y+14);c.lineTo(w,y);c.stroke();}c.strokeStyle='#30332f';c.lineWidth=2;for(let x=0;x<w;x+=8){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}},false);tread.wrapS=tread.wrapT=THREE.RepeatWrapping;tread.repeat.set(1,3);
 const standard=(color,metalness=0,roughness=.7,extra={})=>new THREE.MeshStandardMaterial({color,metalness,roughness,...extra});
 const materials={
  suit:standard('#deded4',.04,.87,{bumpMap:cloth,bumpScale:.013}),
  white:standard('#d5d5cc',.32,.49,{bumpMap:grain,bumpScale:.005}),
  metal:standard('#9eaaa9',.82,.34,{bumpMap:grain,bumpScale:.008}),
  dark:standard('#242c30',.65,.43),rubber:standard('#252624',.05,.91),
  foil:standard('#b3974f',.8,.4,{bumpMap:foil,bumpScale:.05}),
  visor:new THREE.MeshPhysicalMaterial({color:'#cda955',metalness:1,roughness:.14,clearcoat:1,clearcoatRoughness:.08}),
  glass:new THREE.MeshPhysicalMaterial({color:'#a4c2c9',metalness:.1,roughness:.12,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide}),
  soil:standard('#96918a',0,1,{map:regolith,bumpMap:grain,bumpScale:.09}),
  solar:standard('#b4c8fa',.65,.29,{map:cells}),
  tire:standard('#77776c',.58,.82,{bumpMap:tread,bumpScale:.045,map:tread}),
  leaf:standard('#4c7851',0,.85,{side:THREE.DoubleSide}),
 };
 const labelCache=new Map();
 function label(text,color='#dfe8df',bg='#202b30'){const key=text+color+bg;if(labelCache.has(key))return labelCache.get(key);const map=texture(512,128,c=>{c.fillStyle=bg;c.fillRect(0,0,512,128);c.fillStyle=color;c.font='bold 47px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(text,256,67,470);c.fillRect(20,12,472,3);c.fillRect(20,112,472,3);});const material=standard('#ffffff',.1,.6,{map});labelCache.set(key,material);return material;}
 // An economical reflection environment: bright sun, black sky, grey regolith.
 const reflection=texture(256,128,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#050608');g.addColorStop(.47,'#0c1118');g.addColorStop(.51,'#79756a');g.addColorStop(1,'#343533');c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle='#fff5d7';c.fillRect(38,28,8,8);c.fillStyle='#629fc1';c.beginPath();c.arc(172,42,4,0,7);c.fill();});reflection.mapping=THREE.EquirectangularReflectionMapping;
 const pmrem=new THREE.PMREMGenerator(renderer),env=pmrem.fromEquirectangular(reflection);reflection.dispose();pmrem.dispose();
 const shadow=texture(64,64,c=>{const g=c.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(0,0,0,.55)');g.addColorStop(.5,'rgba(0,0,0,.25)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,64,64);});
 const contact=new THREE.MeshBasicMaterial({map:shadow,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
 const sole=texture(64,128,c=>{c.clearRect(0,0,64,128);c.fillStyle='rgba(30,27,23,.24)';c.fillRect(10,12,44,102);c.fillStyle='rgba(20,18,15,.45)';for(let y=16;y<112;y+=12)c.fillRect(12,y,40,5);c.fillRect(28,14,7,96);});
 const footprint=new THREE.MeshBasicMaterial({map:sole,transparent:true,opacity:.65,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
 return {...materials,label,regolith,grain,contact,footprint,environment:env.texture,dispose:()=>env.dispose()};
}
