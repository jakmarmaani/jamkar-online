(()=>{
const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const ADMIN_EMAIL='mohamed.a.elmonim@gmail.com';

function worldTheme(name=''){
 const n=name.toLowerCase();
 if(n.includes('ocean'))return'ocean';if(n.includes('space')||n.includes('galaxy'))return'space';if(n.includes('dino')||n.includes('prehistoric'))return'dino';if(n.includes('ancient')||n.includes('temple'))return'ancient';if(n.includes('wild')||n.includes('eco')||n.includes('garden'))return'nature';if(n.includes('future')||n.includes('robot')||n.includes('code')||n.includes('engineering'))return'future';return'future';
}
function applyGameTheme(){const stage=$('#gameStage');if(!stage)return;const name=window.state?.selected?.name||$('#worldTitle')?.textContent||'';stage.dataset.worldTheme=worldTheme(name)}

function improveHomeCopy(){
 const hero=$('.hero>div:first-child');if(hero){
   const eyebrow=hero.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='🌈 Play • Learn • Create • Grow';
   const h1=hero.querySelector('h1');if(h1)h1.innerHTML='A brighter world<br><span>through play.</span>';
   const p=hero.querySelector('p');if(p)p.textContent='Jump into colourful adventures, solve puzzles, build worlds and learn something new in every game. Pick a world and start exploring.';
   const primary=$('#joinHero');if(primary){primary.textContent='▶ Explore games';primary.onclick=()=>$('#worlds')?.scrollIntoView({behavior:'smooth',block:'start'})}
   const secondary=hero.querySelector('.heroActions .secondary');if(secondary){secondary.textContent='👨‍👩‍👧 For parents';secondary.onclick=()=>window.openAccount?.('join')}
 }
 const head=$('.sectionHead h2');if(head)head.textContent='Our worlds';
 const sub=$('.sectionHead p');if(sub)sub.textContent='Choose a world to start playing. Every adventure has its own look, challenge and learning style.';
}

function removeSafetyFromMain(){document.querySelectorAll('.safety,.kidTip').forEach(x=>x.remove())}

function music(){
 let ctx=null,timer=null,on=false,step=0;
 const sequence=[261.63,329.63,392,523.25,392,329.63,293.66,349.23,440,587.33,440,349.23];
 function tick(){if(!ctx||!on)return;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='triangle';osc.frequency.value=sequence[step++%sequence.length];gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.035,ctx.currentTime+.03);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.32);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.34)}
 function start(){if(on)return;ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();ctx.resume?.();on=true;tick();timer=setInterval(tick,440);btn.setAttribute('aria-pressed','true');btn.textContent='♫ Music on'}
 function stop(){on=false;if(timer)clearInterval(timer);timer=null;btn.setAttribute('aria-pressed','false');btn.textContent='♪ Music'}
 const btn=document.createElement('button');btn.className='musicToggle';btn.type='button';btn.setAttribute('aria-pressed','false');btn.textContent='♪ Music';btn.onclick=()=>on?stop():start();document.body.appendChild(btn);
 const first=()=>{start();document.removeEventListener('pointerdown',first);document.removeEventListener('keydown',first)};
 document.addEventListener('pointerdown',first,{once:true});document.addEventListener('keydown',first,{once:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&on)stop()});
}

function adminShortcut(){const a=document.createElement('a');a.href='admin.html';a.className='adminShortcut';a.textContent='⚙ Admin';document.body.appendChild(a);const sync=()=>{const e=window.JamKarBackend?.state?.user?.email||'';document.body.classList.toggle('jamkar-admin',e.toLowerCase()===ADMIN_EMAIL)};sync();window.addEventListener('jamkar:auth',sync);window.addEventListener('jamkar:backend',sync)}

function keepChildSession(){
 const saved=localStorage.getItem('jamkar_profile');if(saved&&window.state){window.state.activeProfile=saved;window.renderStats?.();window.renderWorlds?.()}
 window.addEventListener('beforeunload',()=>{try{if(window.state?.activeProfile)localStorage.setItem('jamkar_profile',window.state.activeProfile)}catch{}})
}

function moveSafetyToParent(){
 const modal=$('#accountModal .modalCard');if(!modal||modal.querySelector('.parentSafetyBox'))return;
 const box=document.createElement('div');box.className='parentSafetyBox';box.innerHTML='<strong>🛡️ JamKar Safe Play</strong><p>No public chat, no third-party advertising and no child-to-child messaging. Parent account details stay separate from child profiles.</p>';
 modal.insertBefore(box,modal.querySelector('.accountGrid'));
}

function watchWorld(){const modal=$('#worldModal');if(!modal)return;new MutationObserver(()=>applyGameTheme()).observe(modal,{attributes:true,attributeFilter:['class'],subtree:false});new MutationObserver(()=>applyGameTheme()).observe($('#worldTitle'),{childList:true,subtree:true});applyGameTheme()}

function init(){improveHomeCopy();removeSafetyFromMain();moveSafetyToParent();music();adminShortcut();keepChildSession();watchWorld();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
