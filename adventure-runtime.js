(()=>{
const stage=document.querySelector('#gameStage');if(!stage)return;
const worldsCfg={
'Dino Frontier':{sky:'🌤️',ground:'🌿',hero:'🧑‍🌾',npcs:['🦕','🦖','🦤'],props:['🌴','🪨','🌿','🦴'],collect:'🦴',goal:'⛺'},
'Deep Ocean':{sky:'🫧',ground:'🌊',hero:'🤿',npcs:['🐠','🐢','🐬'],props:['🪸','🌿','🪨','🐚'],collect:'🐚',goal:'⚓'},
'Ancient Worlds':{sky:'☀️',ground:'🏜️',hero:'🧭',npcs:['🐪','🦅','🐈'],props:['🏺','🗿','🌴','🧱'],collect:'🏺',goal:'🏛️'},
'Wild Planet':{sky:'🌤️',ground:'🌾',hero:'🧑‍🔬',npcs:['🦁','🦓','🐘'],props:['🌳','🪨','🌾','🌿'],collect:'🔎',goal:'🏕️'},
'Deep Space':{sky:'✨',ground:'🌑',hero:'🧑‍🚀',npcs:['🛸','🤖','🛰️'],props:['🪨','🌌','☄️','📡'],collect:'⭐',goal:'🚀'},
'Future City':{sky:'🌇',ground:'🛣️',hero:'🧑‍🚀',npcs:['🤖','🚕','🛸'],props:['🏙️','🌳','🔋','🚦'],collect:'⚡',goal:'🏢'},
'Word Quest':{sky:'☁️',ground:'📚',hero:'🧙',npcs:['🦉','📖','✏️'],props:['🔤','📝','📚','🪶'],collect:'🔤',goal:'📖'},
'Math Galaxy':{sky:'🌌',ground:'🔢',hero:'🧑‍🚀',npcs:['🤖','➗','✖️'],props:['🔺','🔷','🧮','📐'],collect:'⭐',goal:'🪐'},
'Science Lab':{sky:'💡',ground:'🧪',hero:'🧑‍🔬',npcs:['🤖','🧬','⚛️'],props:['🔬','🧫','🧪','⚗️'],collect:'🧬',goal:'🔬'},
'Puzzle Temple':{sky:'🌅',ground:'🧩',hero:'🧭',npcs:['🦉','🗿','🔮'],props:['🧩','🗝️','🗿','🔷'],collect:'🗝️',goal:'🏯'},
'Eco Rescue':{sky:'🌤️',ground:'🌱',hero:'🧑‍🌾',npcs:['🐼','🐢','🦜'],props:['🌳','♻️','🌻','💧'],collect:'♻️',goal:'🌍'},
'Code Crew':{sky:'🌃',ground:'💻',hero:'🧑‍💻',npcs:['🤖','👾','🛰️'],props:['💾','🧩','🔌','📡'],collect:'💾',goal:'🖥️'},
'Time Builder':{sky:'🌤️',ground:'🏗️',hero:'👷',npcs:['👷','🚜','🤖'],props:['🧱','🪵','⚙️','🏠'],collect:'🧱',goal:'🏰'},
'Sky Racers':{sky:'☁️',ground:'🌈',hero:'🧑‍✈️',npcs:['🛩️','🛸','🚁'],props:['☁️','🎈','⚡','🌤️'],collect:'🏁',goal:'🏆'},
'Memory Islands':{sky:'🌤️',ground:'🏝️',hero:'🧭',npcs:['🦜','🐒','🐬'],props:['🌴','🗿','🐚','🌺'],collect:'💎',goal:'🏝️'},
'World Explorer':{sky:'🌍',ground:'🗺️',hero:'🧭',npcs:['🚌','🛶','🚲'],props:['🗺️','🏔️','🏝️','🏙️'],collect:'📍',goal:'🌐'},
'Music Makers':{sky:'🎵',ground:'🎼',hero:'🎸',npcs:['🥁','🎺','🎹'],props:['🎵','🎶','🎤','🎧'],collect:'🎵',goal:'🎤'},
'Art Studio':{sky:'🎨',ground:'🖼️',hero:'🧑‍🎨',npcs:['🖌️','🖍️','🧑‍🎨'],props:['🎨','🖼️','✏️','🪄'],collect:'🎨',goal:'🖼️'},
'Weather Watch':{sky:'🌤️',ground:'🌦️',hero:'🧑‍🔬',npcs:['🌧️','🌪️','☀️'],props:['☁️','🌈','💧','🌬️'],collect:'🌡️',goal:'📡'},
'Engineering Bay':{sky:'💡',ground:'⚙️',hero:'👷',npcs:['🤖','🚜','🦾'],props:['⚙️','🔧','📐','🔋'],collect:'🔩',goal:'🏭'},
'Language Lab':{sky:'💬',ground:'🔤',hero:'🧑‍🏫',npcs:['🦜','🤖','📣'],props:['💬','🔤','📚','🎧'],collect:'💬',goal:'🗣️'},
'Mystery Maze':{sky:'🌙',ground:'🌀',hero:'🕵️',npcs:['🦉','👻','🔮'],props:['🗝️','🕯️','🧩','🚪'],collect:'🗝️',goal:'🏁'},
'Garden Guardians':{sky:'☀️',ground:'🌻',hero:'🧑‍🌾',npcs:['🐝','🦋','🐞'],props:['🌻','🌷','🌳','💧'],collect:'🌱',goal:'🌳'},
'Robot Factory':{sky:'⚙️',ground:'🏭',hero:'🧑‍🔧',npcs:['🤖','🦾','🚚'],props:['⚙️','🔋','🔧','📦'],collect:'🔩',goal:'🤖'}
};
const points=[[16,24],[34,68],[54,35],[72,72],[86,24]];
let root=null,current='',collected=new Set(),px=50,py=78,keys=new Set(),raf=0,session=0;
function cfg(){return worldsCfg[state?.selected?.name]||worldsCfg['Dino Frontier']}
function el(tag,cls,html=''){const n=document.createElement(tag);n.className=cls;if(html)n.innerHTML=html;return n}
function mount(){const world=state?.selected?.name||'';if(!world||!document.querySelector('#worldModal.open')){destroy();return}if(current===world&&root?.isConnected)return;destroy();current=world;session++;collected=new Set();px=50;py=78;const c=cfg();root=el('div','adventureViewport');root.setAttribute('aria-label',`${world} adventure playground`);root.innerHTML=`<div class="adventureSky">${c.sky}</div><div class="adventureWorld"></div><div class="adventureHud"><span class="adventureMission">Collect 5 ${c.collect} and reach ${c.goal}</span><span class="adventureCount">0 / 5</span></div><div class="adventureGoal" title="Goal">${c.goal}</div><div class="adventurePlayer" tabindex="0" aria-label="Player character">${c.hero}<i></i></div><div class="adventurePad" aria-label="Movement controls"><button data-dir="up">▲</button><button data-dir="left">◀</button><button data-dir="down">▼</button><button data-dir="right">▶</button></div>`;
 const worldLayer=root.querySelector('.adventureWorld');
 for(let i=0;i<14;i++){const p=el('span','adventureProp',c.props[i%c.props.length]);p.style.left=`${6+(i*17)%90}%`;p.style.top=`${18+(i*29)%62}%`;p.style.setProperty('--d',`${(i%5)*-.7}s`);worldLayer.appendChild(p)}
 c.npcs.forEach((x,i)=>{const n=el('span','adventureNpc',x);n.style.left=`${18+i*28}%`;n.style.top=`${22+(i%2)*34}%`;n.style.setProperty('--n',`${i}`);worldLayer.appendChild(n)});
 points.forEach((p,i)=>{const n=el('button','adventureCollect',c.collect);n.dataset.collect=i;n.style.left=p[0]+'%';n.style.top=p[1]+'%';n.setAttribute('aria-label',`Collect ${c.collect}`);worldLayer.appendChild(n)});
 stage.prepend(root);bind(root);update();loop(session)}
function bind(r){r.querySelectorAll('[data-dir]').forEach(b=>{const dir=b.dataset.dir;const fire=()=>step(dir,.95);b.onpointerdown=e=>{e.preventDefault();fire();const id=setInterval(fire,70);const stop=()=>{clearInterval(id);removeEventListener('pointerup',stop)};addEventListener('pointerup',stop)};b.onclick=e=>e.preventDefault()});r.querySelectorAll('.adventureCollect').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.collect);if(!collected.has(i)){collected.add(i);b.classList.add('taken');burst(b);updateHud()}})}
function step(dir,amt=.65){if(dir==='left')px-=amt;if(dir==='right')px+=amt;if(dir==='up')py-=amt;if(dir==='down')py+=amt;px=Math.max(8,Math.min(92,px));py=Math.max(14,Math.min(88,py));update();checkCollect();checkGoal()}
function update(){if(!root)return;const p=root.querySelector('.adventurePlayer');p.style.left=px+'%';p.style.top=py+'%';p.dataset.walk=keys.size?'1':'0';const world=root.querySelector('.adventureWorld');world.style.transform=`translate(${(50-px)*.12}px,${(58-py)*.08}px) scale(1.025)`}
function checkCollect(){root?.querySelectorAll('.adventureCollect:not(.taken)').forEach(b=>{const r=b.getBoundingClientRect(),p=root.querySelector('.adventurePlayer').getBoundingClientRect();if(Math.hypot((r.left+r.width/2)-(p.left+p.width/2),(r.top+r.height/2)-(p.top+p.height/2))<55){const i=Number(b.dataset.collect);collected.add(i);b.classList.add('taken');burst(b);updateHud()}})}
function checkGoal(){if(collected.size<5||!root)return;const g=root.querySelector('.adventureGoal').getBoundingClientRect(),p=root.querySelector('.adventurePlayer').getBoundingClientRect();if(Math.hypot((g.left+g.width/2)-(p.left+p.width/2),(g.top+g.height/2)-(p.top+p.height/2))<70&&!root.classList.contains('complete')){root.classList.add('complete');root.querySelector('.adventureMission').textContent='Adventure route complete! Bonus stars earned ✨';root.querySelector('.adventureCount').textContent='🏆 Complete';window.JamKarArcade?.burst?.('🏆');window.dispatchEvent(new CustomEvent('jamkar:adventurebonus',{detail:{world:current,level:state.selectedLevel,profile:state.activeProfile}}))}}
function updateHud(){if(!root)return;root.querySelector('.adventureCount').textContent=`${collected.size} / 5`;if(collected.size===5)root.querySelector('.adventureMission').textContent=`All collected — reach ${cfg().goal}!`}
function burst(node){const b=el('span','adventureBurst','✨');const r=node.getBoundingClientRect(),s=root.getBoundingClientRect();b.style.left=(r.left-s.left+r.width/2)+'px';b.style.top=(r.top-s.top)+'px';root.appendChild(b);setTimeout(()=>b.remove(),700);window.JamKarArcade?.burst?.(cfg().collect)}
function loop(id){cancelAnimationFrame(raf);const tick=()=>{if(id!==session||!root?.isConnected)return;let dx=0,dy=0;if(keys.has('arrowleft')||keys.has('a'))dx=-1;if(keys.has('arrowright')||keys.has('d'))dx=1;if(keys.has('arrowup')||keys.has('w'))dy=-1;if(keys.has('arrowdown')||keys.has('s'))dy=1;if(dx||dy){px+=dx*.32;py+=dy*.32;px=Math.max(8,Math.min(92,px));py=Math.max(14,Math.min(88,py));update();checkCollect();checkGoal()}raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)}
function destroy(){session++;cancelAnimationFrame(raf);root?.remove();root=null;current='';keys.clear()}
addEventListener('keydown',e=>{if(!root?.isConnected||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown','a','d','w','s'].includes(k)){keys.add(k);e.preventDefault();update()}});addEventListener('keyup',e=>{keys.delete(e.key.toLowerCase());update()});
new MutationObserver(()=>{clearTimeout(window.__jamkarAdventure);window.__jamkarAdventure=setTimeout(mount,90)}).observe(stage,{childList:true,subtree:false});
window.addEventListener('jamkar:family',()=>{destroy();setTimeout(mount,100)});window.JamKarAdventure={mount,destroy};
})();