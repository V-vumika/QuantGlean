import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {rm,stat} from 'node:fs/promises';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';

const root=new URL('../',import.meta.url);
const output=new URL('_site/',root);
const required=[
  'index.html',
  'app.js',
  'styles.css',
  'locales.js',
  'assets/QuantGlean.png',
  '.nojekyll',
];

test('demo build contains every required artifact',async()=>{
  await rm(output,{recursive:true,force:true});
  execFileSync(process.execPath,[fileURLToPath(new URL('scripts/build-demo.mjs',root))],{
    cwd:fileURLToPath(root),
    stdio:'inherit',
  });

  for(const relativePath of required){
    let entry;
    try{
      entry=await stat(new URL(relativePath,output));
    }catch(error){
      if(error?.code==='ENOENT'){
        assert.fail(`Missing required demo output: _site/${relativePath}`);
      }
      throw error;
    }
    assert.ok(entry.isFile(),`Expected a file at _site/${relativePath}`);
  }
});

