export function isBlocked(x,z,obstacles,padding=.18,rover=false){return obstacles.some(o=>(!rover||o.id!=='rover')&&Math.hypot(x-o.x,z-o.z)<o.r+padding);}
export function findPath(start,dest,obstacles,rover=false){
 const step=1.2,N=65,off=32,grid=v=>Math.max(0,Math.min(N-1,Math.round(v/step)+off));
 const sx=grid(start.x),sz=grid(start.z),ex=grid(dest.x),ez=grid(dest.z),s=sz*N+sx,end=ez*N+ex;
 const open=[s],came=new Map(),scores=new Map([[s,0]]),priority=new Map([[s,Math.hypot(ex-sx,ez-sz)]]),closed=new Set();
 for(let iter=0;open.length&&iter<5000;iter++){
  open.sort((a,b)=>priority.get(a)-priority.get(b));const c=open.shift();
  if(c===end){const path=[{x:dest.x,z:dest.z}];let n=c===s?s:came.get(end);while(n!==s){if(n===undefined)return [];path.unshift({x:(n%N-off)*step,z:(Math.floor(n/N)-off)*step});n=came.get(n);}return path;}
  closed.add(c);const x=c%N,z=Math.floor(c/N);
  for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
   const xx=x+dx,zz=z+dz,n=zz*N+xx;if(xx<0||zz<0||xx>=N||zz>=N||closed.has(n))continue;
   if(n!==end&&isBlocked((xx-off)*step,(zz-off)*step,obstacles,.3,rover))continue;
   if(dx&&dz&&(isBlocked((x+dx-off)*step,(z-off)*step,obstacles,.3,rover)||isBlocked((x-off)*step,(z+dz-off)*step,obstacles,.3,rover)))continue;
   const score=scores.get(c)+Math.hypot(dx,dz);if(score<(scores.get(n)??Infinity)){came.set(n,c);scores.set(n,score);priority.set(n,score+Math.hypot(ex-xx,ez-zz));if(!open.includes(n))open.push(n);}
  }
 }return [];
}
