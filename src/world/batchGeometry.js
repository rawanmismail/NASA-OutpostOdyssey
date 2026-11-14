import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Merge stationary details by material. Marked joints, wheels, doors and panel
// pivots stay separate so interactions and animation continue to work.
export function batchGeometry(root) {
 root.updateMatrixWorld(true);
 const inverse=root.matrixWorld.clone().invert(),buckets=new Map(),animated=[];
 function collect(node){
  for(const child of [...node.children]){
   if(child.userData.articulated||child.userData.door){animated.push(child);continue;}
   if(child.isMesh&&!child.isInstancedMesh&&!Array.isArray(child.material)&&!child.material.transparent){
    const key=`${child.material.uuid}:${child.castShadow}:${child.receiveShadow}`;
    if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(child);
   }else collect(child);
  }
 }
 collect(root);
 for(const list of buckets.values()){
  if(list.length<2)continue;
  const copies=list.map(o=>{let g=o.geometry.clone();if(g.index)g=g.toNonIndexed();g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,o.matrixWorld));return g;});
  const merged=mergeGeometries(copies,false);copies.forEach(g=>g.dispose());
  if(!merged)continue;
  const m=new THREE.Mesh(merged,list[0].material);m.castShadow=list[0].castShadow;m.receiveShadow=list[0].receiveShadow;root.add(m);
  for(const o of list){o.removeFromParent();o.geometry.dispose();}
 }
 for(const joint of animated)batchGeometry(joint);
 return root;
}
