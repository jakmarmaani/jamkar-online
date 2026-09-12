(()=>{
const stage=document.querySelector('#gameStage');if(!stage)return;
const supported=new Set(['Dino Frontier','Deep Ocean','Ancient Worlds','Wild Planet','Deep Space','Future City','Robot Factory','Code Crew','Time Builder','Engineering Bay']);
const labels={
'Dino Frontier':['Fossil dig','Fern valley','Research camp'],
'Deep Ocean':['Coral reef','Sunken rock','Research buoy'],
'Ancient Worlds':['Temple gate','Market ruins','Stone archive'],
'Wild Planet':['Waterhole','Forest edge','Rock lookout'],
'Deep Space':['Crater beacon','Moon ridge','Landing pad'],
'Future City':['Solar tower','Transit hub','Eco plaza'],
'Robot Factory':['Assembly bay','Power core','Test zone'],
'Code Crew':['Logic node','Robot dock','Data gate'],
'Time Builder':['Settlement','Workshop','Future district'],
'Engineering Bay':['Design bench','Prototype zone','Test platform']};
const points=[{x:-1.8,z:.3},{x:1.7,z:-.4},{x:.2,z:1.7}];
window.JamKar3DPlayer=window.JamKar3DPlayer||{x:0,z:0,facing:0,moving:false};
let collected=new Set(),currentWorld='',panel=null,holdTimer=0;
function clamp(v){return Math.max(-2.4,Math.min(2.4,v))}
function move(dx,dz){const p=window.JamKar3DPlayer;p.x=clamp(p.x+dx);p.z=clamp(p.z+dz);p.facing=Math.atan2(dx||.001,dz||.001);p.moving=true;clearTimeout(holdTimer);holdTimer=setTimeout(()=>p.moving=false,160);checkPoints();updateHud();window.dispatchEvent(new CustomEvent('jamkar:3dmove',{detail:{...p}}))}
function checkPoints(){const p=window.JamKar3DPlayer;points.forEach((q,i)=>{if(collected.has(i))return;const d=Math.hypot(p.x-q.x,p.z-q.z);if(d<.58){collected.add(i);const name=(labels[currentWorld]||[])[i]||'checkpoint';if(window.toast)toast(`Discovered ${name}! ✨`);if(collected.size===points.length&&window.toast)toast('3D exploration route complete! 🏆')}})}
function updateHud(){if(!panel)return;const status=panel.querySelector('.nav3dStatus');if(status)status.textContent=`Explore: ${collected.size}/3 landmarks`;panel.querySelectorAll('[data-landmark]').forEach((el,i)=>el.classList.toggle('found',collected.has(i)))}
function mount(){const world=state?.selected?.name||'';if(!supported.has(world)||!document.querySelector('#worldModal.open')){panel?.remove();panel=null;return}if(currentWorld!==world){currentWorld=world;collected=new Set();Object.assign(window.JamKar3DPlayer,{x:0,z:0,facing:0,moving:false})}if(panel?.isConnected)return;panel=document.createElement('div');panel.className='nav3dPanel';panel.innerHTML=`<div class="nav3dHead"><b>Explore the 3D world</b><span class="nav3dStatus">Explore: 0/3 landmarks</span></div><div class="nav3dLandmarks">${points.map((_,i)=>`<span data-landmark="${i}">● ${(labels[world]||[])[i]||'Landmark'}</span>`).join('')}</div><div class="nav3dPad" aria-label="3D movement controls"><button data-move="up" aria-label="Move forward">▲</button><button data-move="left" aria-label="Move left">◀</button><button data-move="down" aria-label="Move back">▼</button><button data-move="right" aria-label="Move right">▶</button></div><small>Use the arrows or WASD/arrow keys. Find all three landmarks while you play.</small>`;stage.appendChild(panel);panel.querySelector('[data-move="up"]').onclick=()=>move(0,-.28);panel.querySelector('[data-move="down"]').onclick=()=>move(0,.28);panel.querySelector('[data-move="left"]').onclick=()=>move(-.28,0);panel.querySelector('[data-move="right"]').onclick=()=>move(.28,0);updateHud()}
addEventListener('keydown',e=>{if(!panel?.isConnected)return;if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;const k=e.key.toLowerCase();if(k==='arrowup'||k==='w'){e.preventDefault();move(0,-.28)}else if(k==='arrowdown'||k==='s'){e.preventDefault();move(0,.28)}else if(k==='arrowleft'||k==='a'){e.preventDefault();move(-.28,0)}else if(k==='arrowright'||k==='d'){e.preventDefault();move(.28,0)}});
new MutationObserver(()=>{clearTimeout(window.__jamkarNav3d);window.__jamkarNav3d=setTimeout(mount,70)}).observe(stage,{childList:true,subtree:false});
})();