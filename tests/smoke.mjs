import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const app=read('app.js');
const index=read('index.html');
const free=read('free-games.js');
const extras=read('enhancements.js');
const cloud=read('cloud-sync.js');
const account=read('account.js');
const polish=read('ui-polish.js');

const checks=[];
const ok=(name,cond)=>checks.push({name,cond:!!cond});

const worldNames=[...app.matchAll(/\{name:'([^']+)'/g)].map(m=>m[1]);
const freeWorlds=[...app.matchAll(/\{name:'([^']+)'[^\n]*free:true/g)].map(m=>m[1]);
ok('16 game worlds declared',worldNames.length===16);
ok('World names unique',new Set(worldNames).size===16);
ok('Exactly 5 free worlds',freeWorlds.length===5);
ok('Level grid contains 30 levels',/Array\.from\(\{length:30\}/.test(app));
ok('Free trial locks after Level 3',/!state\.paid&&n>3/.test(app));
ok('Paid-only worlds route to unlock',/!state\.paid&&!w\.free/.test(app)&&/openAccount\('unlock'\)/.test(app));
ok('Browser paid flag removed in production sync',/removeItem\('jamkar_paid'\)/.test(cloud));
ok('Lifetime entitlement comes from Supabase family account',/lifetime_unlocked/.test(cloud));
ok('Revolut checkout invoked through backend',/backend\.createCheckout\(\)/.test(cloud));
ok('Parent password minimum is 8',/minlength="8"/.test(account)&&/pass\.length<8/.test(account));
ok('Parent sign out implemented',/parentSignOut/.test(account)&&/backend\.signOut\(\)/.test(account));
ok('Two child profile fields only',index.includes('Child profile 1')&&index.includes('Child profile 2')&&!index.includes('Child profile 3'));
ok('No public chat safety copy present',index.includes('No public chat'));
ok('Privacy and terms links present',index.includes('legal.html#privacy')&&index.includes('legal.html#terms'));
ok('Five free mini-games implemented',['Dino Frontier','Deep Ocean','Ancient Worlds','Wild Planet','Deep Space'].every(n=>free.includes(`case'${n}'`)));
ok('Advanced mini-games implemented',['Memory Islands','Code Crew','Eco Rescue','Time Builder','Sky Racers'].every(n=>extras.includes(`case'${n}'`)));
ok('Mobile/kid navigation polish loaded',index.includes('ui-polish.js')&&index.includes('polish.css'));
ok('Create/My Worlds navigation wired',polish.includes('openBuilder')&&polish.includes('openMyWorlds'));
ok('Reduced-motion accessibility supported',read('polish.css').includes('prefers-reduced-motion'));
ok('Supabase client library pinned',/@supabase\/supabase-js@2\.112\.4/.test(index));

const failed=checks.filter(x=>!x.cond);
for(const c of checks)console.log(`${c.cond?'PASS':'FAIL'}  ${c.name}`);
console.log(`\n${checks.length-failed.length}/${checks.length} checks passed.`);
if(failed.length)process.exit(1);
