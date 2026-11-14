import {attachController} from './controller.js';
import * as THREE from 'three';
import {createSurfaces} from './surfaces.js';
import {createModels} from './models.js';
import {batchGeometry} from './batchGeometry.js';
export function createWorld({mount,onFrame,onInteract,onError}) {
 const mobile=matchMedia('(pointer: coarse)').matches;
 const api={ready:false,objects:{},crew:[],active:0,roverMode:false,paused:false,mode:'menu',target:null,goal:null,working:null,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches};
 const T3=THREE,scene=new T3.Scene(),camera=new T3.PerspectiveCamera(60,innerWidth/innerHeight,.1,600);
 let renderer;try{renderer=new T3.WebGLRenderer({antialias:true,alpha:false,powerPreference:mobile?'low-power':'high-performance'});}catch(e){onError?.(e);return api;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.75));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T3.PCFSoftShadowMap;renderer.outputColorSpace=T3.SRGBColorSpace;renderer.toneMapping=T3.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 mount.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 scene.background=new T3.Color('#020307');scene.fog=new T3.Fog('#080a0c',100,240);
 const hemi=new T3.HemisphereLight(0xb1c3d3,0x4c4942,.8);scene.add(hemi);
 const sun=new T3.DirectionalLight(0xfff1d9,3.7);sun.position.set(-45,27,25);sun.castShadow=true;sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);Object.assign(sun.shadow.camera,{left:-50,right:50,top:50,bottom:-50,near:1,far:170});sun.shadow.normalBias=.025;scene.add(sun);
 const rim=new T3.DirectionalLight(0x92bbd4,.38);rim.position.set(10,20,-40);scene.add(rim);
 const mat=(c,m=0,r=.7)=>new T3.MeshStandardMaterial({color:c,metalness:m,roughness:r});
 const surface=createSurfaces(renderer);scene.environment=surface.environment;scene.environmentIntensity=.6;
 const {white,dark,metal,glass,soil}=surface,accent=mat(0xc68343,.4,.5);
 const glow=new T3.MeshStandardMaterial({color:0x74e4fa,emissive:0x279bc2,emissiveIntensity:1.4,roughness:.3});
 function mesh(g,m,p,x,y,z,rx=0,ry=0,rz=0){const o=new T3.Mesh(g,m);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;}
 function box(p,x,y,z,w,h,d,m=white){return mesh(new T3.BoxGeometry(w,h,d),m,p,x,y,z);}
 function cyl(p,x,y,z,r,h,m=white,r2=r){return mesh(new T3.CylinderGeometry(r,r2,h,20),m,p,x,y,z);}
 function sphere(p,x,y,z,r,m=white,sx=1,sy=1,sz=1){const a=mesh(new T3.SphereGeometry(r,20,12),m,p,x,y,z);a.scale.set(sx,sy,sz);return a;}
 function group(x=0,y=0,z=0){const g=new T3.Group();g.position.set(x,y,z);scene.add(g);return g;}
 let seed=513;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
 // Smooth crater bowls and non-repeating, continuous terrain. Keep the base level.
 const crater={x:25,z:-24,r:12},craters=[crater,{x:-32,z:-29,r:5.5},{x:36,z:20,r:7},{x:-26,z:23,r:4}];
 function height(x,z){let h=(Math.sin(x*.15)*Math.cos(z*.18)*.36+Math.sin(x*.42+z*.24)*.12+Math.sin(x*.81-z*.62)*.035)*Math.min(1,Math.max(0,(Math.hypot(x,z)-17)/12));for(const c of craters){const d=Math.hypot(x-c.x,z-c.z)/c.r;if(d<1)h-=c.r*.22*Math.pow(1-d*d,2);h+=Math.exp(-Math.pow((d-1.02)/.12,2))*c.r*.07;}return h;}
 const geo=new T3.PlaneGeometry(260,260,mobile?150:200,mobile?150:200);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position,colors=[];
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);pos.setY(i,height(x,z));const shade=.7+(Math.sin(x*.22+z*.17)+Math.cos(z*.31-x*.1))*.055;colors.push(shade,shade*.985,shade*.96);}
 geo.setAttribute('color',new T3.Float32BufferAttribute(colors,3));geo.computeVertexNormals();const terrain=mesh(geo,new T3.MeshStandardMaterial({map:surface.regolith,bumpMap:surface.grain,bumpScale:.1,vertexColors:true,roughness:1}),scene,0,0,0);terrain.castShadow=false;
 // Broad irregular ridges replace the old cone mountains.
 for(let i=0;i<28;i++){const a=i/28*Math.PI*2,r=88+rand()*22,x=Math.cos(a)*r,z=Math.sin(a)*r,geo=new T3.SphereGeometry(1,mobile?24:32,mobile?14:20),v=geo.attributes.position;for(let j=0;j<v.count;j++){const xx=v.getX(j),yy=v.getY(j),zz=v.getZ(j),n=1+Math.sin(xx*5+zz*7+i)*.12+Math.sin(yy*9-xx*4)*.08;v.setXYZ(j,xx*n,yy*n,zz*n);}geo.computeVertexNormals();const rock=mesh(geo,soil,scene,x,-1,z);rock.scale.set(12+rand()*14,5+rand()*10,10+rand()*13);rock.rotation.y=rand()*6;}
 const rocks=[];for(let i=0;i<(mobile?180:380);i++){const x=(rand()-.5)*140,z=(rand()-.5)*140;if(Math.hypot(x,z)<18||Math.hypot(x-25,z+24)<11)continue;rocks.push({x,z,r:.06+rand()**2*.75,a:rand()*6});}
 const rockGeo=new T3.IcosahedronGeometry(1,1),rp=rockGeo.attributes.position;for(let i=0;i<rp.count;i++){const x=rp.getX(i),y=rp.getY(i),z=rp.getZ(i),n=1+.14*Math.sin(x*9+z*8+y*11);rp.setXYZ(i,x*n,y*n,z*n);}rockGeo.computeVertexNormals();const field=new T3.InstancedMesh(rockGeo,soil,rocks.length),dummy=new T3.Object3D();rocks.forEach((r,i)=>{dummy.position.set(r.x,height(r.x,r.z)+r.r*.22,r.z);dummy.scale.set(r.r*1.4,r.r*.7,r.r);dummy.rotation.set(.2,r.a,.12);dummy.updateMatrix();field.setMatrixAt(i,dummy.matrix);});field.castShadow=field.receiveShadow=true;scene.add(field);
 // Star field and a local NASA Blue Marble Earth texture.
 const starGeo=new T3.BufferGeometry(),sp=[];for(let i=0;i<(mobile?650:1400);i++){const a=rand()*Math.PI*2,y=rand()*.85+.04,r=230;sp.push(Math.cos(a)*Math.sqrt(1-y*y)*r,y*r,Math.sin(a)*Math.sqrt(1-y*y)*r);}starGeo.setAttribute('position',new T3.Float32BufferAttribute(sp,3));scene.add(new T3.Points(starGeo,new T3.PointsMaterial({color:0xc9dfff,size:.43,sizeAttenuation:true})));
 const earthTexture=new T3.TextureLoader().load(`${import.meta.env.BASE_URL}assets/earth-blue-marble.jpg`);earthTexture.colorSpace=T3.SRGBColorSpace;
 const earthMat=new T3.MeshStandardMaterial({map:earthTexture,roughness:1,emissive:0x12233a,emissiveIntensity:.12});const earth=sphere(scene,-40,26,-85,3.4,earthMat);earth.rotation.z=.3;
 const atmos=sphere(scene,-40,26,-85,3.45,new T3.MeshBasicMaterial({color:0x7bcfff,transparent:true,opacity:.06,side:T3.BackSide}));atmos.castShadow=false;
 const bases=group(),obstacles=[];
 const defaults={hab:[-7,0],pow:[11,-4],life:[-10,-8],shelter:[-17,-4],green:[1,-9],lab:[2,3],rover:[12,11]};
 function station(id,x,z,r,door){const g=new T3.Group();g.position.set(x,height(x,z),z);g.userData.station=id;bases.add(g);api.objects[id]={id,group:g,r,door:new T3.Vector3(x+door[0],height(x+door[0],z+door[1]),z+door[1]),label:null};obstacles.push({id,x,z,r});return g;}
 const models=createModels({scene,station,mesh,box,cyl,sphere,mat,surface,glow,accent,mobile});
 const {habitat,support,shelter,greenhouse,lab}=models;
 let panelHeads=[],rover;
 const solar=(x,z,tier)=>{panelHeads=models.solar(x,z,tier);};
 const makeRover=(x,z,rugged)=>{rover=models.rover(x,z,rugged);rover.userData.wheels.forEach(w=>w.userData.articulated=true);};
 const flag=group(-4,0,9);models.flag(flag);
 const crewColors=[0xffaa61,0x65e0d0,0xa4acff,0xff7f94];
 for(let i=0;i<4;i++){const g=batchGeometry(models.astronaut(crewColors[i],i));g.position.set(-2+i*1.9,0,8);scene.add(g);api.crew.push(g);}
 const selection=mesh(new T3.RingGeometry(.7,.8,40),new T3.MeshBasicMaterial({color:0x9deaff,side:T3.DoubleSide,transparent:true,opacity:.9}),scene,0,.04,0,-Math.PI/2);selection.castShadow=false;
 const handTool=new T3.Group();box(handTool,0,-.12,0,.12,.4,.12,metal);box(handTool,0,-.36,0,.4,.14,.22,accent);handTool.visible=false;
 const workLight=new T3.PointLight(0x7be6ff,0,8);scene.add(workLight);
 const beacon=group();const ring=mesh(new T3.TorusGeometry(1,.045,6,48),glow,beacon,0,.09,0,Math.PI/2);const arrow=mesh(new T3.ConeGeometry(.28,.5,4),glow,beacon,0,3.5,0,Math.PI);const beam=mesh(new T3.CylinderGeometry(.32,.8,5,16,1,true),new T3.MeshBasicMaterial({color:0x63d9ff,transparent:true,opacity:.07,depthWrite:false,side:T3.DoubleSide}),beacon,0,2.5,0);beam.castShadow=false;
 const configureBuildings=(b={hab:2,pow:2,shelter:2,green:true,rover:true},place=null)=>{
   for(const child of [...bases.children]){bases.remove(child);child.traverse(o=>{if(o.isMesh)o.geometry.dispose();});}
   api.objects={};obstacles.length=0;
   const spotpos={high:[13,-4],low:[-6,0],edge:[16,-17]};
   const hp=place?.hab?spotpos[place.hab]:defaults.hab, pp=place?.pow?spotpos[place.pow]:defaults.pow;
   habitat(...hp,b.hab);solar(...pp,b.pow);support(...defaults.life);shelter(...defaults.shelter,b.shelter);
   greenhouse(...defaults.green);api.objects.green.group.visible=!!b.green;
   if(!b.green)obstacles.splice(obstacles.findIndex(o=>o.id==='green'),1);
   lab(...defaults.lab);makeRover(...defaults.rover,b.rover);
   for(const o of Object.values(api.objects)){
     const p=o.door;const consoleStand=new T3.Group();consoleStand.position.set(p.x+1.5,p.y,p.z);
     cyl(consoleStand,0,.55,0,.075,1.1,metal);models.rounded(consoleStand,0,1.25,0,.9,.55,.12,dark);box(consoleStand,0,1.25,.07,.75,.4,.018,glow);models.decal(consoleStand,o.id.toUpperCase(),0,.88,.07,.55,.08);cyl(consoleStand,0,.08,0,.32,.1,metal);
     consoleStand.userData.station=o.id;bases.add(consoleStand);
     batchGeometry(o.group);batchGeometry(consoleStand);
   }
 };
 return attachController({api,scene,camera,renderer,mount,onFrame,onInteract,onError,mobile,height,terrain,mesh,box,cyl,group,mat,glow,dark,white,metal,bases,obstacles,defaults,configureBuildings,getRover:()=>rover,getPanels:()=>panelHeads,handTool,workLight,beacon,arrow,ring,selection,earth,footprintMaterial:surface.footprint,disposeEnvironment:surface.dispose});
}
