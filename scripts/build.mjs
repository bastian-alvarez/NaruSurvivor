import { cp, mkdir, writeFile } from 'node:fs/promises';
await mkdir('dist', {recursive:true});
await cp('public','dist',{recursive:true});
await writeFile('dist/.nojekyll','');
console.log('Web lista en dist/');
