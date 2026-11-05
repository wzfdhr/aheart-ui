from pathlib import Path
import argparse,tempfile,subprocess,json,time,datetime,shutil,hashlib,urllib.request,urllib.parse
root=Path(__file__).resolve().parents[3]
parser=argparse.ArgumentParser()
parser.add_argument('--out',help='New evidence directory; never overwrites existing evidence')
args=parser.parse_args()
out=Path(args.out).resolve() if args.out else Path(tempfile.mkdtemp(prefix='aheart-registry-evidence-'))
if args.out:out.mkdir(parents=True,exist_ok=False)
scratch=Path(tempfile.mkdtemp(prefix='aheart-clean-consumer-2026-11-05-'))
fixture=root/'docs/superpowers/evidence/v1.1.0-release-2026-09-29/registry-smoke'
result={'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'baselineSha':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'scratch':str(scratch),'toolchain':{name:subprocess.check_output(args,cwd=root,text=True).strip() for name,args in [('node',['node','--version']),('npm',['npm','--version']),('pnpm',['corepack','pnpm','--version'])]},'commands':[],'packages':[],'limitations':['No browser hydration, iframe, visual or owner acceptance in this Node-only smoke.']}
manifest={'name':'aheart-m0-clean-consumer','private':True,'type':'module','dependencies':{'aheart-ui':'1.1.0','@aheart-ui/dnd':'1.0.0','@aheart-ui/ai':'1.0.0','vue':'3.5.44','typescript':'5.9.3'}}
(scratch/'package.json').write_text(json.dumps(manifest,indent=2)+'\n')
for name in ['esm.mjs','cjs.cjs','types.ts','tsconfig.json']:shutil.copy2(fixture/name,scratch/name)
config=json.loads((scratch/'tsconfig.json').read_text());config['compilerOptions']['skipLibCheck']=False
(scratch/'tsconfig.strict.json').write_text(json.dumps(config,indent=2)+'\n')
for package,version in [('aheart-ui','1.1.0'),('@aheart-ui/dnd','1.0.0'),('@aheart-ui/ai','1.0.0')]:
 url='https://registry.npmjs.org/'+urllib.parse.quote(package,safe='')+'/'+version
 with urllib.request.urlopen(url,timeout=30) as r:d=json.load(r)
 result['packages'].append({'name':package,'version':version,'registryUrl':url,'dist':d['dist']})
for label,args in [('install',['npm','install','--registry=https://registry.npmjs.org/','--ignore-scripts','--no-audit','--no-fund']),('esm-ssr-css',['node','esm.mjs']),('cjs',['node','cjs.cjs']),('types-compatible',['node','node_modules/typescript/bin/tsc','-p','tsconfig.json','--pretty','false']),('types-strict',['node','node_modules/typescript/bin/tsc','-p','tsconfig.strict.json','--pretty','false'])]:
 started=time.monotonic();r=subprocess.run(args,cwd=scratch,capture_output=True,text=True,timeout=180)
 (out/(label+'.log')).write_text(r.stdout+r.stderr)
 item={'label':label,'args':args,'exitCode':r.returncode,'durationSeconds':round(time.monotonic()-started,3),'log':label+'.log'};result['commands'].append(item);print(json.dumps(item),flush=True)
 if label=='install' and r.returncode:break
for name in ['package.json','package-lock.json','esm.mjs','cjs.cjs','types.ts','tsconfig.json','tsconfig.strict.json']:
 if (scratch/name).is_file():shutil.copy2(scratch/name,out/name)
result['workspaceSymlinks']={}
for package in manifest['dependencies']:
 p=scratch/'node_modules'/package
 if p.exists():result['workspaceSymlinks'][package]=p.is_symlink()
result['lockfileSha256']=hashlib.sha256((scratch/'package-lock.json').read_bytes()).hexdigest() if (scratch/'package-lock.json').exists() else None
(out/'results.json').write_text(json.dumps(result,indent=2)+'\n')
print('Results:',out/'results.json',flush=True)
