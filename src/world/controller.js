import * as THREE from 'three';
import {CSS3DRenderer,CSS3DObject} from 'three/addons/renderers/CSS3DRenderer.js';
import {followCameraPose,movementVector,consoleLayout} from './math.js';
import {findPath,isBlocked} from './navigation.js';

export function attachController(r){
 const {api,scene,camera,renderer,mount,onFrame,onInteract,mobile,height,terrain,mesh,box,cyl,group,mat,glow,dark,metal,bases,obstacles,defaults,configureBuildings,getRover,getPanels,handTool,workLight,beacon,arrow,ring,selection,earth}=r;
 let path=[],keys={},stick={x:0,y:0},yaw=Math.PI,pitch=.12,autoUse=false,disposed=false,raf=0,lastTime=0,tick=0,moving=false,sprinting=false,drag=null,menuAngle=.6,workClock=0;
 let terminal=null,terminalYaw=0,terminalCenter=new THREE.Vector3(),terminalDistance=10;
 const actor=()=>api.roverMode?getRover():api.crew[api.active];
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),cameraRay=new THREE.Raycaster();
 const css=new CSS3DRenderer();css.setSize(innerWidth,innerHeight);css.domElement.className='css-world';css.domElement.dir='ltr';css.domElement.style.pointerEvents='none';mount.appendChild(css.domElement);
 const host=document.createElement('div');host.className='world-terminal-host';host.dir='ltr';host.style.left='0';host.style.top='0';host.style.pointerEvents='auto';
 const cssScreen=new CSS3DObject(host);cssScreen.visible=false;scene.add(cssScreen);
 const consoleRig=group();consoleRig.visible=false;
 const panel=box(consoleRig,0,0,-.1,1,1,.18,dark),trim=box(consoleRig,0,0,-.14,1.04,1.04,.16,metal);
 const stand=cyl(consoleRig,0,-2.5,0,.13,3,metal),pad=box(consoleRig,0,-3,1,3,.18,2,mat(0x314f63,.45,.5));
 const trail=group(),trailGeometry=new THREE.SphereGeometry(.065,5,4),dots=[];
 function drawTrail(){
  if(!api.goal){trail.visible=false;beacon.visible=false;return;}
  trail.visible=true;beacon.visible=true;beacon.position.set(api.goal.x,height(api.goal.x,api.goal.z),api.goal.z);
  const points=[actor().position,...findPath(actor().position,api.goal,obstacles,api.roverMode)];let used=0,carry=0;
  for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],len=Math.hypot(b.x-a.x,b.z-a.z);for(let d=carry;d<len;d+=.95){const mix=d/len,x=a.x+(b.x-a.x)*mix,z=a.z+(b.z-a.z)*mix;let dot=dots[used];if(!dot){dot=mesh(trailGeometry,glow,trail,0,0,0);dot.castShadow=false;dots.push(dot);}dot.position.set(x,height(x,z)+.1,z);dot.visible=true;used++;}carry=(.95-(len-carry)%.95)%.95;}for(let i=used;i<dots.length;i++)dots[i].visible=false;
 }
 function resize(){
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);css.setSize(innerWidth,innerHeight);
  if(terminal)sizeTerminal();
 }
 function sizeTerminal(){
  const layout=consoleLayout(innerWidth,innerHeight);host.style.width=layout.width+'px';host.style.height=layout.height+'px';host.classList.toggle('portrait-console',layout.portrait);
  host.classList.toggle('compact-console',layout.compact);cssScreen.scale.setScalar(layout.scale);panel.scale.set(layout.width*layout.scale,layout.height*layout.scale,1);trim.scale.set(layout.width*layout.scale,layout.height*layout.scale,1);
  const bottom=-layout.height*layout.scale/2;stand.position.y=bottom-.7;stand.scale.y=.5;pad.position.y=bottom-1.45;terminalDistance=layout.distance;
 }
 api.terminalHost=host;
 api.openTerminal=id=>{
  api.stop();api.paused=true;terminal=id;
  const o=api.objects[id];
  if(o){terminalCenter.set(o.door.x+1.8,o.door.y+2.8,o.door.z+.2);terminalYaw=0;}
  else{const p=actor().position;terminalCenter.set(p.x+Math.sin(yaw)*3.5,p.y+2.8,p.z+Math.cos(yaw)*3.5);terminalYaw=yaw+Math.PI;}
  cssScreen.position.copy(terminalCenter);cssScreen.rotation.y=terminalYaw;consoleRig.position.copy(terminalCenter);consoleRig.rotation.y=terminalYaw;consoleRig.visible=cssScreen.visible=true;sizeTerminal();
  return host;
 };
 api.closeTerminal=()=>{terminal=null;consoleRig.visible=cssScreen.visible=false;api.paused=false;api.stop();};
 api.getTerminal=()=>terminal;
 api.setMode=mode=>{api.mode=mode;api.stop();};
 api.setGoal=id=>{api.goal=typeof id==='string'?api.objects[id]?.door.clone():id?new THREE.Vector3(id[0],0,id[1]):null;api.goalId=typeof id==='string'?id:null;drawTrail();};
 api.goPoint=(x,z)=>{if(api.paused||api.working||Math.abs(x)>37||Math.abs(z)>37||isBlocked(x,z,obstacles,.3,api.roverMode))return;path=findPath(actor().position,{x,z},obstacles,api.roverMode);api.target=null;autoUse=false;};
 api.navigate=(id,use=true)=>{if(api.paused||api.working)return;const o=api.objects[id];if(!o||!o.group.visible)return;path=findPath(actor().position,o.door,obstacles,api.roverMode);api.target=id;autoUse=use;};
 api.nearest=()=>{let best=null,distance=3;const p=actor().position;for(const [id,o]of Object.entries(api.objects)){if(!o.group.visible||api.roverMode&&id==='rover')continue;const d=Math.hypot(p.x-o.door.x,p.z-o.door.z);if(d<distance){best=id;distance=d;}}return best;};
 api.nearGoal=()=>!!api.goal&&Math.hypot(actor().position.x-api.goal.x,actor().position.z-api.goal.z)<2.6;
 api.stop=()=>{path=[];keys={};stick={x:0,y:0};autoUse=false;sprinting=false;drag=null;};
 api.setMove=(x,y)=>{stick={x,y};if(x||y){path=[];autoUse=false;}};
 api.key=(key,down)=>{keys[key.toLowerCase()]=down;if(down){path=[];autoUse=false;}};
 api.sprint=on=>sprinting=on;
 api.resetCamera=()=>{yaw=actor().rotation.y||Math.PI;pitch=.12;};
 api.look=(dx,dy)=>{yaw-=dx*(mobile?.005:.0045);pitch=Math.max(-.28,Math.min(.65,pitch+dy*.0035));};
 api.select=i=>{if(api.roverMode||api.working||!api.crew[i])return;api.active=i;api.stop();yaw=api.crew[i].rotation.y||Math.PI;drawTrail();};
 api.setRover=on=>{
  if(on===api.roverMode)return;api.roverMode=on;api.stop();for(const c of api.crew)c.visible=true;
  if(on)api.crew[api.active].visible=false;
  else{const p=getRover().position;api.crew[api.active].position.set(p.x+2,height(p.x+2,p.z+2),p.z+2);}
  yaw=actor().rotation.y||Math.PI;
 };
 api.resetRover=()=>{getRover().position.set(defaults.rover[0],0,defaults.rover[1]);api.objects.rover.door.set(defaults.rover[0],0,defaults.rover[1]+2.8);};
 api.perform=(id,seconds,cb)=>{api.closeTerminal();api.stop();api.working={id,seconds,remaining:seconds,cb};workClock=0;api.crew[api.active].userData.arms[1].add(handTool);handTool.position.set(0,-.6,0);handTool.visible=true;};
 api.cancelWork=()=>{api.working=null;handTool.visible=false;workLight.intensity=0;for(const o of Object.values(api.objects))o.group.traverse(m=>{if(m.userData.door)m.position.x=m.userData.closedX;});api.stop();};
 api.configure=(build,place)=>{api.cancelWork();api.closeTerminal();configureBuildings(build,place);drawTrail();};
 api.snapshot=()=>({crew:api.crew.map(c=>c.position.toArray()),rover:getRover().position.toArray(),yaw,pitch});
 api.restore=s=>{if(s?.crew)s.crew.forEach((p,i)=>api.crew[i]?.position.fromArray(p));if(s?.rover)getRover().position.fromArray(s.rover);if(Number.isFinite(s?.yaw))yaw=s.yaw;if(Number.isFinite(s?.pitch))pitch=s.pitch;};
 api.setQuality=low=>{renderer.setPixelRatio(low?1:Math.min(devicePixelRatio,mobile?1.25:1.75));renderer.shadowMap.enabled=!low;};
 api.setReduced=on=>api.reduced=on;
 api.positions=()=>Object.fromEntries(Object.entries(api.objects).filter(([,o])=>o.group.visible).map(([id,o])=>[id,{x:o.group.position.x,z:o.group.position.z}]));
 function pointerDown(e){if(api.paused||api.working||drag)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};renderer.domElement.setPointerCapture(e.pointerId);}
 function pointerMove(e){if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.lastX,dy=e.clientY-drag.lastY;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5)drag.moved=true;if(drag.moved)api.look(dx,dy);drag.lastX=e.clientX;drag.lastY=e.clientY;}
 function pointerUp(e){if(!drag||e.pointerId!==drag.id)return;const clicked=!drag.moved;drag=null;if(!clicked||e.button===2||api.paused||api.working||api.mode==='menu')return;
  pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(bases.children,true);for(const hit of hits){let p=hit.object;while(p&&!p.userData.station)p=p.parent;if(p){api.navigate(p.userData.station,true);return;}}const ground=raycaster.intersectObject(terrain)[0];if(ground)api.goPoint(ground.point.x,ground.point.z);
 }
 function pointerCancel(){drag=null;api.stop();}
 const canvas=renderer.domElement;canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointercancel',pointerCancel);canvas.addEventListener('lostpointercapture',()=>{drag=null;});
 function lostContext(e){e.preventDefault();api.paused=true;r.onError?.(new Error('context-lost'));}
 canvas.addEventListener('webglcontextlost',lostContext);
 window.addEventListener('resize',resize);window.addEventListener('blur',pointerCancel);
 const mixAngle=(a,b,amount)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*amount;
 const lookTarget=new THREE.Vector3(),cameraTarget=new THREE.Vector3();
 const prints=new THREE.InstancedMesh(new THREE.PlaneGeometry(.25,.43),r.footprintMaterial,160),printPose=new THREE.Object3D();prints.count=0;prints.frustumCulled=false;scene.add(prints);let printCursor=0,printSide=1,lastPrint=new THREE.Vector3(999,0,999);
 function animate(now){
  if(disposed)return;raf=requestAnimationFrame(animate);const dt=Math.min((now-lastTime)/1000,.05)||.016;lastTime=now;const time=now*.001,p=actor();moving=false;
  if(!api.paused&&api.mode!=='menu'&&!api.working){
   const ix=stick.x+(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),iy=stick.y+(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0);
   let v=movementVector(ix,iy,yaw);
   if(!v.amount&&path.length){const target=path[0],dx=target.x-p.position.x,dz=target.z-p.position.z,d=Math.hypot(dx,dz);if(d<.32)path.shift();else{v={x:dx/d,z:dz/d,amount:1};if(!drag)yaw=mixAngle(yaw,Math.atan2(v.x,v.z),Math.min(1,dt*4));}}
   if(v.amount){const speed=api.roverMode?7.2:sprinting||keys.shift?6.7:4.1,nx=p.position.x+v.x*speed*dt,nz=p.position.z+v.z*speed*dt,oldX=p.position.x,oldZ=p.position.z;
    if(Math.abs(nx)<38&&!isBlocked(nx,p.position.z,obstacles,.18,api.roverMode))p.position.x=nx;
    if(Math.abs(nz)<38&&!isBlocked(p.position.x,nz,obstacles,.18,api.roverMode))p.position.z=nz;
    p.rotation.y=mixAngle(p.rotation.y,Math.atan2(v.x,v.z),Math.min(1,dt*12));moving=Math.hypot(p.position.x-oldX,p.position.z-oldZ)>.001;
   }
   if(!path.length&&autoUse){autoUse=false;if(api.target&&api.nearest()===api.target)onInteract?.(api.target);}
  }
  for(const c of api.crew){c.position.y=height(c.position.x,c.position.z);const active=c===p,u=c.userData,walk=active&&moving&&!api.reduced,phase=time*(sprinting?10:7);u.body.position.y=walk?Math.abs(Math.sin(phase))*.065:0;u.body.rotation.z=walk?Math.sin(phase)*.025:0;u.legs[0].rotation.x=walk?Math.sin(phase)*.48:0;u.legs[1].rotation.x=-u.legs[0].rotation.x;u.arms[0].rotation.x=-u.legs[0].rotation.x*.55;u.arms[1].rotation.x=-u.legs[1].rotation.x*.55;u.knees?.forEach((k,i)=>{k.rotation.x=walk?-Math.max(0,Math.sin(phase+i*Math.PI))*.6:0;});u.elbows?.forEach(e=>{e.rotation.x=walk?-.15:-.05;});}
  const rover=getRover();rover.position.y=height(rover.position.x,rover.position.z);
  if(moving&&!api.roverMode&&lastPrint.distanceToSquared(p.position)>.5){
   printSide*=-1;const a=p.rotation.y,x=p.position.x+Math.cos(a)*.17*printSide,z=p.position.z-Math.sin(a)*.17*printSide;
   printPose.position.set(x,height(x,z)+.022,z);printPose.rotation.set(-Math.PI/2,0,a);printPose.updateMatrix();prints.setMatrixAt(printCursor,printPose.matrix);printCursor=(printCursor+1)%160;prints.count=Math.min(160,prints.count+1);prints.instanceMatrix.needsUpdate=true;lastPrint.copy(p.position);
  }
  if(api.roverMode&&moving&&!api.reduced)rover.userData.wheels?.forEach(w=>{w.rotation.x+=dt*7.2/.47;});
  if(api.roverMode)api.objects.rover.door.set(rover.position.x+2,rover.position.y,rover.position.z+2);
  if(api.working&&!api.paused){const w=api.working;w.remaining-=dt;workClock+=dt;const c=api.crew[api.active],o=api.objects[w.id];c.userData.arms[1].rotation.x=-1.3+Math.sin(time*12)*.25;
   if(o){c.rotation.y=Math.atan2(o.group.position.x-c.position.x,o.group.position.z-c.position.z);yaw=mixAngle(yaw,c.rotation.y,dt*3);workLight.position.copy(o.door).add(new THREE.Vector3(0,2,0));workLight.intensity=2+Math.sin(time*8);o.group.traverse(m=>{if(m.userData.door)m.position.x=1.3*Math.sin(Math.min(1,workClock)*Math.PI/2);});}
   if(w.id==='pow')getPanels().forEach((panel,i)=>panel.rotation.x=-.5+Math.sin(workClock+i)*.08);
   if(w.remaining<=0){const cb=w.cb;api.working=null;handTool.visible=false;workLight.intensity=0;o?.group.traverse(m=>{if(m.userData.door)m.position.x=m.userData.closedX;});cb?.();}
  }
  if(terminal){const normal=new THREE.Vector3(Math.sin(terminalYaw),0,Math.cos(terminalYaw));cameraTarget.copy(terminalCenter).addScaledVector(normal,terminalDistance);cameraTarget.y+=.1;lookTarget.copy(terminalCenter);}
  else if(api.mode==='menu'){if(!api.reduced)menuAngle+=dt*.015;cameraTarget.set(Math.sin(menuAngle)*45,12,Math.cos(menuAngle)*45);lookTarget.set(0,2,0);}
  else{const pose=followCameraPose(p.position,yaw,pitch,api.roverMode);cameraTarget.set(pose.eye.x,pose.eye.y,pose.eye.z);lookTarget.set(pose.look.x,pose.look.y,pose.look.z);
   const origin=p.position.clone().add(new THREE.Vector3(0,1.8,0)),direction=cameraTarget.clone().sub(origin),length=direction.length();cameraRay.set(origin,direction.normalize());cameraRay.far=length;const hit=cameraRay.intersectObjects(bases.children,true)[0];if(hit&&hit.distance<length)cameraTarget.copy(origin).addScaledVector(direction,Math.max(1.15,hit.distance-.35));cameraTarget.y=Math.max(cameraTarget.y,height(cameraTarget.x,cameraTarget.z)+.65);
  }
  camera.position.lerp(cameraTarget,api.reduced?1:1-Math.exp(-dt*8));camera.lookAt(lookTarget);camera.updateMatrixWorld();
  selection.position.set(p.position.x,height(p.position.x,p.position.z)+.07,p.position.z);selection.visible=api.mode!=='menu'&&!terminal;selection.scale.setScalar(api.roverMode?1.6:1);
  arrow.position.y=3.6+(api.reduced?0:Math.sin(time*3)*.18);ring.scale.setScalar(api.reduced?1:1+Math.sin(time*2)*.07);earth.rotation.y+=dt*.003;
  renderer.render(scene,camera);css.render(scene,camera);
  tick+=dt;if(tick>.1){
   const elapsed=tick;tick=0;const nearest=api.nearest(),distance=api.goal?Math.hypot(p.position.x-api.goal.x,p.position.z-api.goal.z):0;
   const labels=Object.entries(api.objects).filter(([,o])=>o.group.visible&&Math.hypot(o.door.x-p.position.x,o.door.z-p.position.z)<13).map(([id,o])=>{const a=o.group.position.clone();a.y+=id==='hab'?6.6:3.7;a.project(camera);return{id,x:(a.x*.5+.5)*innerWidth,y:(-.5*a.y+.5)*innerHeight,visible:a.z<1&&a.z>-1};});
   onFrame?.({dt:elapsed,moving,rover:api.roverMode,sprinting:sprinting||keys.shift,nearest,distance,position:{x:p.position.x,z:p.position.z},labels,nearGoal:api.nearGoal(),paused:api.paused,work:api.working?{remaining:api.working.remaining,seconds:api.working.seconds}:null});
   if(moving&&api.goal)drawTrail();
  }
 }
 api.dispose=()=>{disposed=true;cancelAnimationFrame(raf);api.cancelWork();window.removeEventListener('resize',resize);window.removeEventListener('blur',pointerCancel);canvas.removeEventListener('webglcontextlost',lostContext);css.domElement.remove();
  const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[]){materials.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v);}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());r.disposeEnvironment?.();renderer.dispose();renderer.forceContextLoss();canvas.remove();
 };
 api.configure();api.ready=true;api.crew.forEach(c=>c.rotation.y=Math.PI);raf=requestAnimationFrame(animate);return api;
}
