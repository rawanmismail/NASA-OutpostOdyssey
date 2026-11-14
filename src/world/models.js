import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createModels({scene,station,mesh,box,cyl,sphere,mat,surface:s,glow,accent,mobile}) {
 const {white,metal,dark,rubber,foil,visor,glass,soil,solar:cellMaterial,leaf}=s;
 const dishMaterial=white.clone();dishMaterial.side=THREE.DoubleSide;
 const segment=mobile?16:24;
 const rounded=(p,x,y,z,w,h,d,m=white,r=.06)=>mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)),m,p,x,y,z);
 const torus=(p,x,y,z,r,t,m=metal,rx=0,ry=0)=>mesh(new THREE.TorusGeometry(r,t,6,segment),m,p,x,y,z,rx,ry);
 function rod(p,a,b,r=.035,m=metal){const v=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)),o=cyl(p,...a,r,v.length(),m);o.position.addScaledVector(v,.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return o;}
 function hose(p,points,r=.027,m=rubber){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),mobile?12:20,r,6,false),m,p,0,0,0);}
 function decal(p,text,x,y,z,w=.8,h=.18,color,bg){return box(p,x,y,z,w,h,.006,s.label(text,color,bg));}
 function contact(p,w,d){const o=mesh(new THREE.PlaneGeometry(w,d),s.contact,p,0,.025,0,-Math.PI/2);o.castShadow=o.receiveShadow=false;return o;}
 function bolts(p,coords,r=.025){const inst=new THREE.InstancedMesh(new THREE.CylinderGeometry(r,r,.018,6),metal,coords.length);const dummy=new THREE.Object3D();coords.forEach(([x,y,z],i)=>{dummy.position.set(x,y,z);dummy.rotation.x=Math.PI/2;dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);});p.add(inst);}
 function radiator(p,x,y,z,w,h){const g=new THREE.Group();g.position.set(x,y,z);p.add(g);rounded(g,0,0,0,w,h,.12,white);for(let i=0;i<8;i++)box(g,-w*.43+i*w*.123,0,.07,.018,h*.88,.025,metal);return g;}
 function hatch(g,z,w=1.3){rounded(g,0,1.37,z,w+.38,2.65,.25,metal,.12);const door=rounded(g,0,1.36,z+.16,w,2.35,.14,white,.1);door.userData.door=true;door.userData.closedX=0;torus(door,0,.36,.09,.23,.045,dark);sphere(door,0,.36,.1,.2,visor,1,1,.12);decal(door,'AIRLOCK',0,-.26,.085,w*.8,.16);cyl(door,.37,-.1,.12,.035,.4,metal);for(const x of[-w/2,w/2])box(g,x,2.72,z+.2,.08,.12,.08,glow);bolts(g,[[-w/2-.1,.25,z+.14],[w/2+.1,.25,z+.14],[-w/2-.1,2.5,z+.14],[w/2+.1,2.5,z+.14]]);}
 function habitat(x,z,tier){const g=station('hab',x,z,4.3,[0,5]);contact(g,9,8);
  const radius=2.18,center=2.76;
  mesh(new THREE.CylinderGeometry(radius,radius,5.1,segment,1,true),white,g,0,center,0,Math.PI/2);
  for(const z1 of[-2.55,2.55])sphere(g,0,center,z1,radius,white,1,1,.26);
  for(const z1 of[-2.4,-1.2,0,1.2,2.4])torus(g,0,center,z1,radius+.02,.065,metal);
  for(const x1 of[-1.65,1.65])for(const z1 of[-1.9,1.9]){rod(g,[x1,1.3,z1],[x1*1.35,.25,z1],.085);cyl(g,x1*1.35,.13,z1,.4,.12,dark);}
  rounded(g,0,.4,0,4.4,.18,5.5,dark);
  rounded(g,0,1.45,3.05,2.03,2.95,1.2,white,.16);hatch(g,3.68,1.3);
  for(let i=0;i<3;i++)box(g,0,.13+i*.16,4.75-i*.38,2,.24,.5,metal);
  for(const x1 of[-1.05,1.05]){rod(g,[x1,.6,4.9],[x1,1.3,3.8],.035);rod(g,[x1,.3,4.9],[x1,.6,4.9]);rod(g,[x1,.7,3.85],[x1,1.3,3.85]);}
  for(const x1 of[-1.05,1.05]){torus(g,x1,3.46,2.99,.33,.07,dark);sphere(g,x1,3.46,3.01,.29,visor,1,1,.15);}
  decal(g,'DUNE / HAB-01',0,4.15,2.99,1.6,.24);decal(g,'CAUTION • PRESSURISED',0,.55,3.9,1.1,.1,'#e2c26c');
  for(const x1 of[-2.22,2.22]){const r=new THREE.Group();r.position.set(x1,2.9,0);r.rotation.y=Math.sign(x1)*Math.PI/2;g.add(r);radiator(r,0,0,0,2.8,1.2);}
  hose(g,[[1.3,.3,3],[2.4,.2,2],[2.4,.2,-1],[1.4,1,-2.7]],.06);
  cyl(g,-1.2,5.05,-1.4,.035,1.3,metal);sphere(g,-1.2,5.72,-1.4,.08,glow);
  if(tier===3){rounded(g,0,5.03,-.5,1.8,.3,2.5,white);radiator(g,0,5.27,-.5,1.6,.2);}
 }
 function solar(x,z,tier){const g=station('pow',x,z,4.5,[0,4.8]),heads=[];contact(g,10,7);
  for(let i=0;i<tier+1;i++){const px=(i-tier/2)*2.1,p=new THREE.Group();p.position.set(px,1.9,-.5);p.rotation.x=-.5;g.add(p);
   cyl(g,px,.95,-.5,.075,1.9,metal);cyl(g,px,.08,-.5,.35,.12,dark);rod(g,[px,.3,-.5],[px,.9,-1.4],.045);rod(g,[px,.3,-.5],[px,.9,.4],.045);
   rounded(p,0,0,0,1.96,.09,3.55,metal,.025);box(p,0,.055,0,1.82,.016,3.4,cellMaterial);box(p,0,.08,0,.025,.02,3.4,metal);box(p,0,.08,0,1.82,.02,.025,metal);cyl(p,0,-.15,0,.18,.3,dark);p.userData.articulated=true;heads.push(p);
  }
  rounded(g,0,.65,3.05,1.8,1.15,1.25,white,.12);radiator(g,-.55,.65,3.72,.45,.65);box(g,.2,.87,3.71,.55,.25,.015,dark);box(g,.2,.87,3.73,.46,.16,.01,glow);decal(g,'PWR / 48V',.2,.51,3.73,.6,.13);for(const xx of[-.3,.05,.4])sphere(g,xx,1.05,3.73,.026,xx>.1?accent:glow,1,1,.4);
  hose(g,[[0,.1,2.6],[1,.08,1.5],[1,.1,-.5],[0,.6,-.5]],.045);return heads;
 }
 function support(x,z){const g=station('life',x,z,2.8,[0,3.2]);contact(g,6,4);rounded(g,0,.18,0,4.6,.25,3.1,dark);
  for(const x1 of[-1.15,1.15]){cyl(g,x1,1.7,-.1,.62,2.6,white);sphere(g,x1,3,-.1,.62,white,1,.65,1);sphere(g,x1,.4,-.1,.62,metal,1,.5,1);for(const y of[.8,2.6])torus(g,x1,y,-.1,.635,.045,metal,Math.PI/2);
   cyl(g,x1,3.46,-.1,.09,.25,metal);torus(g,x1,3.6,-.1,.17,.025,accent,Math.PI/2);rod(g,[x1,3.46,-.1],[x1*.5,3.46,-.1],.055);decal(g,x1<0?'O₂ / 01':'H₂O / 02',x1,1.9,.53,.7,.22);hose(g,[[x1,.6,.5],[x1,1.1,1],[x1*.3,1.2,1.3]],.065);}
  rounded(g,0,1.16,1.35,1.25,1.55,.5,white);box(g,0,1.36,1.61,.85,.36,.025,dark);box(g,0,1.36,1.63,.72,.23,.01,glow);for(const x1 of[-.28,.28]){cyl(g,x1,.91,1.65,.1,.035,white).rotation.x=Math.PI/2;rod(g,[x1,.91,1.68],[x1+.03,.96,1.68],.009,dark);}decal(g,'LIFE SUPPORT',0,.6,1.62,1,.14);
 }
 function shelter(x,z,tier){const g=station('shelter',x,z,3.1,[0,3.7]);contact(g,7,7);sphere(g,0,.4,-.3,2.9,soil,1,.9,.95);rounded(g,0,1.43,2.08,2.4,2.9,2.15,dark,.15);hatch(g,3.17,1.35);box(g,0,.12,3.45,2.4,.2,.7,metal);
  // Layered shielding blocks follow the curved roof; no floating decorative boulders.
  for(let row=0;row<4;row++)for(let i=0;i<9;i++){const a=(i+.5)/9*Math.PI,x1=Math.cos(a)*2.35,y=Math.sin(a)*2.35+.38,z1=-1.65+row*.83;const o=rounded(g,x1,y,z1,.8,.46,.78,tier===3?soil:white,.13);o.rotation.z=a-Math.PI/2;}
  decal(g,'RADIATION SHELTER',0,2.76,3.32,1.7,.18,'#e6cd89');rod(g,[-1.35,.3,2.8],[-1.35,1.1,3.4]);rod(g,[1.35,.3,2.8],[1.35,1.1,3.4]);
 }
 function greenhouse(x,z){const g=station('green',x,z,3,[0,3.5]);contact(g,7,6);rounded(g,0,.2,0,5.5,.38,4.6,dark);const cover=sphere(g,0,.25,0,2.65,glass,1,1,.86);cover.castShadow=false;
  for(let i=-2;i<=2;i++){const zz=i*.83,rr=Math.sqrt(2.65**2-(zz/.86)**2);mesh(new THREE.TorusGeometry(rr,.035,6,32,Math.PI),metal,g,0,.25,zz);}
  for(const xx of[-1.25,1.25]){rounded(g,xx,.7,0,1.05,.25,3.1,white);box(g,xx,.85,0,.86,.04,2.92,soil);rod(g,[xx-.48,1.6,-1.3],[xx-.48,1.6,1.3],.018,glow);for(const zz of[-1,-.5,0,.5,1]){cyl(g,xx,1.04,zz,.022,.4,leaf);for(let k=0;k<4;k++){const a=k*Math.PI/2,l=sphere(g,xx+Math.sin(a)*.16,1.18+(k%2)*.12,zz+Math.cos(a)*.16,.2,leaf,.48,.16,1.4);l.rotation.y=a;l.rotation.z=.4;}}}
  rounded(g,0,1.35,2.22,1.55,2.45,.3,white);hatch(g,2.46,1.12);decal(g,'BOTANY / GH-01',0,2.68,2.48,1.6,.16);hose(g,[[-2.3,.4,-1.5],[-2,.5,0],[-2,.4,1.5]],.04);
 }
 function lab(x,z){const g=station('lab',x,z,1.6,[0,2.3]);contact(g,4,4);for(const xx of[-.85,.85])for(const zz of[-.7,.7]){rod(g,[xx,.15,zz],[xx,.9,zz],.055);cyl(g,xx,.08,zz,.18,.06,metal);}
  rounded(g,0,1,0,2.2,1.25,1.5,foil);rounded(g,0,1.7,0,2.3,.16,1.65,metal);rounded(g,.3,2.02,.15,1.1,.5,.8,white);box(g,.3,2.05,.56,.72,.22,.012,glow);decal(g,'SCIENCE / 01',0,.99,.76,1.2,.19);radiator(g,-.72,1.1,.78,.45,.72);
  for(const xx of[-.4,0,.4]){cyl(g,xx,1.95,-.44,.11,.35,white);cyl(g,xx,2.14,-.44,.12,.06,accent);}
  cyl(g,-.85,2.42,-.45,.035,2,metal);const dish=new THREE.Group();dish.position.set(-.85,3.4,-.45);dish.rotation.x=.9;dish.rotation.z=.3;g.add(dish);
  const points=[];for(let i=0;i<=12;i++){const rr=i/12*.68;points.push(new THREE.Vector2(rr,rr*rr*.55));}mesh(new THREE.LatheGeometry(points,24),dishMaterial,dish,0,0,0);torus(dish,0,.254,0,.68,.025,metal,Math.PI/2);for(const a of[0,2.09,4.19])rod(dish,[Math.cos(a)*.6,.2,Math.sin(a)*.6],[0,.65,0],.014);sphere(dish,0,.65,0,.055,dark);
  hose(g,[[-.85,1.9,-.45],[-1,1.2,-.7],[-.5,.5,-.7]],.025);
 }
 function rover(x,z,rugged){const g=station('rover',x,z,1.7,[0,2.8]);contact(g,4.5,4.8);rounded(g,0,1.15,0,1.85,.75,2.55,foil);rounded(g,0,1.59,0,2.15,.13,2.85,metal);box(g,0,1.67,-.3,2,.025,1.8,cellMaterial);radiator(g,0,1.15,1.29,1.4,.5);decal(g,'DUNE / R-01',0,1.44,1.3,.9,.13);
  const wheels=[];for(const xx of[-1.34,1.34])for(const zz of[-1.1,0,1.1]){const side=Math.sign(xx),pivot=new THREE.Group();pivot.position.set(xx,.51,zz);g.add(pivot);mesh(new THREE.CylinderGeometry(.47,.47,.36,segment),s.tire,pivot,0,0,0,0,0,Math.PI/2);mesh(new THREE.CylinderGeometry(.27,.27,.38,12),metal,pivot,0,0,0,0,0,Math.PI/2);mesh(new THREE.CylinderGeometry(.12,.12,.41,12),dark,pivot,0,0,0,0,0,Math.PI/2);for(let j=0;j<6;j++){const a=j/6*Math.PI*2;rod(pivot,[side*.21,Math.sin(a)*.13,Math.cos(a)*.13],[side*.21,Math.sin(a)*.25,Math.cos(a)*.25],.021,metal);}wheels.push(pivot);rod(g,[side*.75,1.15,zz*.55],[xx,.51,zz],.065,metal);rod(g,[side*.8,1.32,zz*.6],[xx,.7,zz],.035,dark);}
  cyl(g,.68,2.3,.7,.055,1.4,metal);rounded(g,.68,3.04,.7,.65,.26,.3,white);for(const xx of[.48,.85]){sphere(g,xx,3.04,.87,.09,dark,1,1,.3);sphere(g,xx,3.04,.894,.055,visor,1,1,.1);}cyl(g,-.72,2.15,-1,.022,1.1,metal);sphere(g,-.72,2.71,-1,.055,glow);
  for(const xx of[-.75,.75]){rounded(g,xx,1.55,1.45,.28,.18,.2,dark);box(g,xx,1.55,1.56,.2,.1,.01,glow);}rod(g,[-.6,1.05,1.3],[-.8,.8,1.83],.065);rod(g,[-.8,.8,1.83],[-.1,.65,1.88],.05);cyl(g,-.1,.58,1.88,.09,.25,metal);torus(g,-.1,.43,1.88,.13,.025,accent,Math.PI/2);g.userData.wheels=wheels;g.userData.rugged=!!rugged;return g;
 }
 function astronaut(color,index){const g=new THREE.Group(),body=new THREE.Group();g.add(body);const trim=mat(color,.3,.52),name=['HESSA','MAYA','KENJI','SAM'][index];
  // Adult proportions: helmet, pressure torso, articulated hips / knees / elbows.
  rounded(body,0,1.29,0,.65,.7,.43,s.suit,.13);sphere(body,0,.94,0,.38,s.suit,1,.55,.7);cyl(body,0,1.62,0,.225,.09,metal);torus(body,0,1.65,0,.23,.035,dark,Math.PI/2);
  sphere(body,0,1.93,0,.315,s.suit,1,1.03,.98);sphere(body,0,1.94,.075,.294,dark,1,.87,.94);
  // A curved front visor rather than another full sphere protruding from the face.
  mesh(new THREE.SphereGeometry(.292,24,16,Math.PI*.1,Math.PI*.8,.34,Math.PI*.72),visor,body,0,1.955,.04);
  rounded(body,0,2.2,-.03,.42,.075,.36,white,.03);for(const xx of[-.22,.22]){sphere(body,xx,2.17,.11,.058,metal);sphere(body,xx,2.17,.15,.038,glow,1,1,.5);}
  rounded(body,0,1.31,.244,.39,.29,.09,dark,.025);decal(body,name,0,1.37,.296,.32,.075);for(let k=0;k<3;k++)box(body,-.1+k*.1,1.24,.298,.04,.027,.012,k?trim:glow);
  rounded(body,0,1.29,-.37,.57,.74,.31,white,.075);radiator(body,0,1.33,-.535,.42,.4).rotation.y=Math.PI;decal(body,`DUNE / ${String(index+1).padStart(2,'0')}`,0,1.61,-.535,.45,.08).rotation.y=Math.PI;
  rounded(body,0,.99,-.4,.47,.12,.35,trim,.03);for(const xx of[-.24,.24]){rod(body,[xx,1.55,.18],[xx,1.02,.18],.025,dark);cyl(body,xx,.99,.22,.048,.05,metal).rotation.x=Math.PI/2;}
  hose(body,[[.23,1.04,.25],[.43,.95,.32],[.48,1.18,.11],[.35,1.25,-.34]],.027);hose(body,[[-.25,1.04,.25],[-.42,.95,.12],[-.38,1.16,-.35]],.022);
  const legs=[],arms=[],knees=[],elbows=[];
  for(const side of[-1,1]){const leg=new THREE.Group();leg.position.set(side*.19,.96,0);body.add(leg);sphere(leg,0,-.11,0,.17,s.suit,.93,1.35,1);mesh(new THREE.CapsuleGeometry(.135,.2,4,12),s.suit,leg,0,-.25,0);torus(leg,0,-.38,0,.135,.022,dark,Math.PI/2);const knee=new THREE.Group();knee.position.y=-.42;leg.add(knee);rounded(knee,0,-.015,.13,.21,.18,.07,trim,.04);mesh(new THREE.CapsuleGeometry(.126,.19,4,12),s.suit,knee,0,-.2,0);rounded(knee,0,-.4,.085,.3,.2,.43,s.suit,.05);rounded(knee,0,-.5,.09,.31,.045,.46,rubber,.01);torus(knee,0,-.29,0,.133,.025,metal,Math.PI/2);legs.push(leg);knees.push(knee);
   const arm=new THREE.Group();arm.position.set(side*.43,1.49,0);body.add(arm);sphere(arm,0,0,0,.19,s.suit,1,1,.95);torus(arm,0,-.075,0,.165,.024,trim,Math.PI/2);mesh(new THREE.CapsuleGeometry(.113,.13,4,12),s.suit,arm,0,-.2,0);const elbow=new THREE.Group();elbow.position.y=-.34;arm.add(elbow);sphere(elbow,0,0,0,.12,dark);mesh(new THREE.CapsuleGeometry(.105,.13,4,12),s.suit,elbow,0,-.14,0);torus(elbow,0,-.25,0,.11,.023,metal,Math.PI/2);sphere(elbow,0,-.33,.025,.12,s.suit,.85,1.15,1);sphere(elbow,-side*.085,-.31,.085,.05,rubber,.8,1.4,.8);arms.push(arm);elbows.push(elbow);}
  for(const joint of[body,...legs,...arms,...knees,...elbows])joint.userData.articulated=true;
  // Crew patch, seams and safety strips remain legible at the follow-camera distance.
  decal(body,'SURFACE CREW',0,1.05,.252,.34,.054,'#374347','#c9cbc0');for(const xx of[-.26,.26])box(body,xx,1.31,.22,.013,.42,.012,metal);
  const shadow=contact(g,1.6,1.6);g.userData={body,legs,arms,knees,elbows,shadow};return g;
 }
 function flag(parent){cyl(parent,0,2.3,0,.038,4.6,metal);rod(parent,[0,4.47,0],[1.55,4.47,0],.025);const geom=new THREE.PlaneGeometry(1.55,.82,18,6),p=geom.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,Math.sin(p.getX(i)*15)*.035);geom.computeVertexNormals();mesh(geom,new THREE.MeshStandardMaterial({map:s.label('DUNE / LUNAR','#f5e8d0','#9b5c36').map,roughness:.92,side:THREE.DoubleSide}),parent,.78,4.06,0);}
 return {habitat,solar,support,shelter,greenhouse,lab,rover,astronaut,flag,rounded,rod,hose,decal,contact};
}
