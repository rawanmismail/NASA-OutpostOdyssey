import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createModels} from '../src/world/models.js';
import {batchGeometry} from '../src/world/batchGeometry.js';

function fixture(mobile=false){
 const scene=new THREE.Scene(),stations={},material=()=>new THREE.MeshStandardMaterial(),s=Object.fromEntries(['white','metal','dark','rubber','foil','visor','glass','soil','solar','tire','leaf','suit','contact'].map(k=>[k,material()])),labels=new Map();s.label=text=>{if(!labels.has(text))labels.set(text,material());return labels.get(text);};
 const mesh=(geometry,material,p,x=0,y=0,z=0,rx=0,ry=0,rz=0)=>{const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=m.receiveShadow=true;p.add(m);return m;};
 const box=(p,x,y,z,w,h,d,m=s.white)=>mesh(new THREE.BoxGeometry(w,h,d),m,p,x,y,z),cyl=(p,x,y,z,r,h,m=s.white)=>mesh(new THREE.CylinderGeometry(r,r,h,20),m,p,x,y,z),sphere=(p,x,y,z,r,m=s.white,sx=1,sy=1,sz=1)=>{const o=mesh(new THREE.SphereGeometry(r,20,12),m,p,x,y,z);o.scale.set(sx,sy,sz);return o;};
 const station=(id,x,z,r,door)=>{const g=new THREE.Group();g.position.set(x,0,z);g.userData.station=id;scene.add(g);stations[id]={group:g,r,door};return g;};
 return{scene,stations,models:createModels({scene,station,mesh,box,cyl,sphere,mat:material,surface:s,glow:material(),accent:material(),mobile})};
}
function meshCount(root){let n=0;root.traverse(o=>{if(o.isMesh)n++;});return n;}
test('detailed stations build all tiers with finite geometry and batch without changing their shape',()=>{
 for(const mobile of[false,true])for(const tier of[1,2,3]){
  const{models:m,stations}=fixture(mobile);m.habitat(13,-4,tier);const panels=m.solar(-6,0,tier);m.support(-10,-8);m.shelter(-17,-4,tier);m.greenhouse(1,-9);m.lab(2,3);const rover=m.rover(12,11,true);
  assert.equal(panels.length,tier+1);assert.equal(rover.userData.wheels.length,6);for(const p of rover.userData.wheels)p.userData.articulated=true;
  for(const[id,{group:g}]of Object.entries(stations)){
   const doors=[];g.traverse(o=>{if(o.userData.door)doors.push(o);if(o.geometry){for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v),id);}});
   const before=new THREE.Box3().setFromObject(g,true),count=meshCount(g);batchGeometry(g);const after=new THREE.Box3().setFromObject(g,true);
   assert.ok(before.min.distanceTo(after.min)<1e-4,id);assert.ok(before.max.distanceTo(after.max)<1e-4,id);assert.ok(meshCount(g)<count*.75,`${id} draw-call reduction`);
   for(const d of doors){assert.ok(d.parent);assert.equal(d.position.x,d.userData.closedX);d.position.x=1.3;assert.equal(d.position.x,1.3);}
  }
  for(const p of panels){assert.ok(p.parent);p.rotation.x=-.4;assert.equal(p.rotation.x,-.4);}
  for(const wheel of rover.userData.wheels){assert.equal(wheel.parent,rover);wheel.rotation.x=.5;assert.equal(wheel.rotation.x,.5);}
 }
});
test('all four detailed astronauts retain independently movable joints after batching',()=>{
 const{models}=fixture();for(let i=0;i<4;i++){
  const crew=models.astronaut([0xffaa61,0x65e0d0,0xa4acff,0xff7f94][i],i),count=meshCount(crew),before=new THREE.Box3().setFromObject(crew,true);batchGeometry(crew);const after=new THREE.Box3().setFromObject(crew,true);
  assert.ok(before.min.distanceTo(after.min)<1e-5);assert.ok(before.max.distanceTo(after.max)<1e-5);assert.ok(after.max.y<2.4&&after.max.y>2.1);assert.ok(meshCount(crew)<count*.7);
  const u=crew.userData;for(const array of[u.legs,u.arms,u.knees,u.elbows]){assert.equal(array.length,2);for(const joint of array){assert.ok(joint.parent);joint.rotation.x=.3;assert.equal(joint.rotation.x,.3);}}
 }
});
