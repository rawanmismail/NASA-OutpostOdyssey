import test from 'node:test';
import assert from 'node:assert/strict';
import {movementVector,followCameraPose,joystickVector,consoleLayout} from '../src/world/math.js';
import {findPath,isBlocked} from '../src/world/navigation.js';
import {PerspectiveCamera,Vector3} from 'three';
test('D/right arrow and right joystick move screen-right at every camera heading',()=>{
 for(const yaw of[0,.7,Math.PI/2,Math.PI,4.3,6.2])for(const rover of[false,true]){
  const p={x:0,y:0,z:0},pose=followCameraPose(p,yaw,.12,rover),camera=new PerspectiveCamera(60,390/844,.1,600);
  camera.position.set(pose.eye.x,pose.eye.y,pose.eye.z);camera.lookAt(pose.look.x,pose.look.y,pose.look.z);camera.updateMatrixWorld();
  const origin=new Vector3(0,1.2,0).project(camera);
  for(const input of[{x:1,y:0},joystickVector(43,0)]){const v=movementVector(input.x,input.y,yaw),point=new Vector3(v.x,1.2,v.z).project(camera);assert.ok(point.x>origin.x,`right at ${yaw}`);}
  for(const input of[{x:-1,y:0},joystickVector(-43,0)]){const v=movementVector(input.x,input.y,yaw),point=new Vector3(v.x,1.2,v.z).project(camera);assert.ok(point.x<origin.x,`left at ${yaw}`);}
 }
});
test('follow camera stays behind the crew for every heading and follows their location',()=>{
 for(const yaw of[0,.7,Math.PI,4.3,6.2])for(const rover of[false,true]){const p={x:20,y:-2,z:-17},pose=followCameraPose(p,yaw,.12,rover),behind=(pose.eye.x-p.x)*Math.sin(yaw)+(pose.eye.z-p.z)*Math.cos(yaw);assert.ok(behind<-5);assert.ok(pose.eye.y>p.y+2);const p2=followCameraPose({x:23,y:-2,z:-12},yaw,.12,rover);assert.ok(Math.abs(p2.eye.x-pose.eye.x-3)<1e-8);assert.ok(Math.abs(p2.eye.z-pose.eye.z-5)<1e-8);}
});
test('movement follows view heading and clamps diagonal/touch speed',()=>{const f=movementVector(0,1,Math.PI);assert.ok(Math.abs(f.x)<1e-8&&f.z<-.99);for(const x of[-1,0,1])for(const y of[-1,0,1]){const v=movementVector(x,y,.8);assert.ok(Math.hypot(v.x,v.z)<=1.000001);}assert.equal(movementVector(0,0,0).amount,0);});
test('virtual joystick supports simultaneous camera control without excess movement magnitude',()=>{for(const [dx,dy]of[[0,0],[10,-15],[200,100],[-999,0]]){const v=joystickVector(dx,dy);assert.ok(Math.hypot(v.x,v.y)<=1.000001);assert.ok(Math.hypot(v.px,v.py)<=43.00001);}assert.equal(joystickVector(0,-43).y,1);});
test('world consoles fit portrait phones, landscape phones, tablets and desktop',()=>{for(const [w,h]of[[360,800],[390,844],[430,932],[844,390],[932,430],[768,1024],[1440,900],[1920,1080]]){const l=consoleLayout(w,h),visibleH=2*l.distance*Math.tan(Math.PI/6),visibleW=visibleH*w/h;assert.ok(l.width*l.scale<visibleW);assert.ok(l.height*l.scale<visibleH);const projectedFont=(l.portrait?29:l.compact?28:23)*l.scale/visibleH*h;assert.ok(projectedFont>=13.5,`${w}x${h}: ${projectedFont}px text`);}});
test('obstacle-aware routes reach every station and every build placement',()=>{
 const spots={high:[13,-4],low:[-6,0],edge:[16,-17]},base={life:[-10,-8,2.8,3.2],shelter:[-17,-4,3.1,3.7],green:[1,-9,3,3.5],lab:[2,3,1.6,2.3],rover:[12,11,1.7,2.8]};let count=0;
 for(const h of Object.keys(spots))for(const p of Object.keys(spots)){if(h===p)continue;const stations={...base,hab:[...spots[h],4.3,5],pow:[...spots[p],4.5,4.8]},obstacles=Object.entries(stations).map(([id,[x,z,r]])=>({id,x,z,r}));for(const [id,[x,z,,door]]of Object.entries(stations)){const path=findPath({x:0,z:9},{x,z:z+door},obstacles);assert.ok(path.length,`${h}/${p}/${id}`);const end=path.at(-1);assert.equal(end.x,x);assert.equal(end.z,z+door);for(const step of path.slice(0,-1))assert.equal(isBlocked(step.x,step.z,obstacles,.18),false);count++;}}
 assert.equal(count,42);
});
test('rover paths reach the three survey points and home',()=>{const obstacles=[{id:'hab',x:16,z:-17,r:4.3},{id:'pow',x:13,z:-4,r:4.5},{id:'rover',x:12,z:11,r:1.7}];let start={x:12,z:11};for(const [x,z]of[[21,-14],[28,-22],[26,-29],[12,13.8]]){const path=findPath(start,{x,z},obstacles,true);assert.ok(path.length);start=path.at(-1);}assert.equal(start.z,13.8);});
