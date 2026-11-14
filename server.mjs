import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createGzip} from 'node:zlib';
import {pipeline} from 'node:stream';

const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.txt':'text/plain; charset=utf-8','.woff2':'font/woff2'};

export function createGameServer(root=fileURLToPath(new URL('./dist/',import.meta.url))){
 root=resolve(root);
 return createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
  try{
   const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   if(path==='/healthz'){res.writeHead(200,{'Content-Type':'text/plain','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:'ok');return;}
   const file=resolve(root,'.'+(path==='/'?'/index.html':path));
   if(!file.startsWith(root+sep)||path.includes('\0')||path.split(/[\\/]/).some(part=>part.startsWith('.'))){res.writeHead(404);res.end();return;}
   let info;try{info=await stat(file);}catch{res.writeHead(404);res.end();return;}
   if(!info.isFile()){res.writeHead(404);res.end();return;}
   const ext=extname(file),compress=/\.(html|js|css|json|svg|webmanifest|txt)$/.test(file)&&/\bgzip\b/.test(req.headers['accept-encoding']||'');
   res.setHeader('Content-Type',types[ext]||'application/octet-stream');
   res.setHeader('Cache-Control',ext==='.html'?'no-cache':/[-_][A-Za-z0-9_-]{8,}\.(js|css)$/.test(file)?'public, max-age=31536000, immutable':'public, max-age=3600');
   res.setHeader('Vary','Accept-Encoding');
   if(compress)res.setHeader('Content-Encoding','gzip');else res.setHeader('Content-Length',info.size);
   res.writeHead(200);if(req.method==='HEAD'){res.end();return;}
   const streams=compress?[createReadStream(file),createGzip(),res]:[createReadStream(file),res];
   pipeline(...streams,()=>{});
  }catch{if(!res.headersSent)res.writeHead(400);res.end();}
 });
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT||8080),server=createGameServer();
 server.listen(port,'0.0.0.0',()=>console.log(`Surface Crew listening on port ${port}`));
 for(const signal of['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
}
