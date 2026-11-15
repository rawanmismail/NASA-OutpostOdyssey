import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,rmdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createGameServer} from '../server.mjs';

test('production server serves compressed game assets, health checks and safe errors',async()=>{
 const root=await mkdtemp(join(tmpdir(),'surface-crew-http-'));
 await writeFile(join(root,'index.html'),'<h1>Surface Crew</h1>');await writeFile(join(root,'game-abcdefgh.js'),'console.log("ready")');
 const server=createGameServer(root);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}`;
 try{
  const home=await fetch(url);assert.equal(home.status,200);assert.equal(home.headers.get('cache-control'),'no-cache');assert.equal(await home.text(),'<h1>Surface Crew</h1>');
  const js=await fetch(url+'/game-abcdefgh.js',{headers:{'Accept-Encoding':'gzip'}});assert.match(js.headers.get('content-type'),/javascript/);assert.equal(js.headers.get('content-encoding'),'gzip');assert.match(js.headers.get('cache-control'),/immutable/);assert.equal(await js.text(),'console.log("ready")');
  const head=await fetch(url+'/game-abcdefgh.js',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
  assert.equal(await(await fetch(url+'/healthz')).text(),'ok');
  for(const path of['/missing.js','/.git/config','/..%2fsecret.txt'])assert.equal((await fetch(url+path)).status,404);
  assert.equal((await fetch(url+'/%invalid')).status,400);assert.equal((await fetch(url,{method:'POST'})).status,405);
 }finally{await new Promise(resolve=>server.close(resolve));await rm(join(root,'index.html'));await rm(join(root,'game-abcdefgh.js'));await rmdir(root);}
});

test('NASA endpoint returns public data with CORS for Netlify and never serves env files',async()=>{
 const server=createGameServer(undefined,{nasaFlare:async()=>({cls:'X3.2',date:'2026-11-10',ar:4321,live:true})});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}`;
 try{
  const response=await fetch(url+'/api/nasa/flare');assert.equal(response.status,200);assert.equal(response.headers.get('access-control-allow-origin'),'*');assert.equal((await response.json()).record.cls,'X3.2');assert.match(response.headers.get('cache-control'),/max-age=300/);
  assert.equal((await fetch(url+'/.env.local')).status,404);
  const head=await fetch(url+'/api/nasa/flare',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 }finally{await new Promise(resolve=>server.close(resolve));}
});
