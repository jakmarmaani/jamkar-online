(()=>{
const profileKey=()=>`jamkar_progression_${state.activeProfile}`;
const defaults={xp:0,stars:0,streak:0,lastWorld:'',lastLevel:0,companion:'egg',badges:[]};
let prog={...defaults};
let snapshot={};
const tiers=[
 {min:1,max:5,name:'Explorer',icon:'🌱',mult:1},
 {min:6,max:10,name:'Adventurer',icon:'🧭',mult:1.15},
 {min:11,max:15,name:'Pathfinder',icon:'⚡',mult:1.3},
 {min:16,max:20,name:'Master',icon:'🏆',mult:1.5},
 {min:21,max:25,name:'Champion',icon:'🌟',mult:1.75},
 {min:26,max:30,name:'Legend',icon:'👑',mult:2}
];
const companions=[
 {xp:0,key:'egg',icon:'🥚',name:'Spark Egg'},
 {xp:120,key:'cub',icon:'🐣',name:'Spark Cub'},
 {xp:350,key:'buddy',icon:'🐲',name:'Quest Buddy'},
 {xp:800,key:'hero',icon:'🦄',name:'Star Hero'},
 {xp:1500,key:'legend',icon:'🐉',name:'Legend Companion'}
];
function load(){try{prog={...defaults,...JSON.parse(localStorage.getItem(profileKey())||'{}')}}catch{prog={...defaults}}}
function save(){localStorage.setItem(profileKey(),JSON.stringify(prog))}
function tier(level){return tiers.find(t=>level>=t.min&&level<=t.max)||tiers[0]}
function companion(){let c=companions[0];for(const x of companions)if(prog.xp>=x.xp)c=x;return c}
function nextCompanion(){return companions.find(x=>x.xp>prog.xp)||null}
function currentWorldLevel(){if(!state.selected)return 1;return Math.min(30,Math.max(1,state.selectedLevel||progressFor(state.selected.name)))}
function addBadge(name){if(!prog.badges.includes(name)){prog.badges.push(name);toast(`Badge earned: ${name} 🏅`)}}
function award(world,level){const t=tier(level);const base=20+Math.floor(level*2.5);const gain=Math.round(base*t.mult);prog.xp+=gain;prog.stars+=level%10===0?3:level%5===0?2:1;prog.streak=prog.lastWorld===world&&prog.lastLevel===level-1?prog.streak+1:1;prog.lastWorld=world;prog.lastLevel=level;if(level===5)addBadge(`${world} Explorer`);if(level===10)addBadge(`${world} Adventurer`);if(level===20)addBadge(`${world} Master`);if(level===30)addBadge(`${world} Legend`);if(prog.streak>=5)addBadge('5-Level Streak');if(prog.streak>=10)addBadge('10-Level Streak');const c=companion();if(c.key!==prog.companion){prog.companion=c.key;toast(`${c.icon} Your companion evolved into ${c.name}!`)}save();renderHud();celebrate(gain,level)}
function celebrate(gain,level){const stage=document.querySelector('#gameStage');if(!stage)return;const pop=document.createElement('div');pop.className='rewardPop';pop.innerHTML=`<strong>+${gain} XP</strong><span>${level%10===0?'⭐⭐⭐':level%5===0?'⭐⭐':'⭐'}</span>`;stage.appendChild(pop);setTimeout(()=>pop.remove(),1300);if(level%5===0){for(let i=0;i<12;i++){const s=document.createElement('i');s.className='rewardSpark';s.textContent=['✨','⭐','💫'][i%3];s.style.setProperty('--x',`${(Math.random()*180-90).toFixed(0)}px`);s.style.setProperty('--y',`${(-40-Math.random()*120).toFixed(0)}px`);stage.appendChild(s);setTimeout(()=>s.remove(),1000)}}}
function renderHud(){let hud=document.querySelector('#progressionHud');if(!hud){hud=document.createElement('section');hud.id='progressionHud';hud.className='progressionHud';const stats=document.querySelector('.stats');stats?.insertAdjacentElement('afterend',hud)}if(!hud)return;const c=companion(),next=nextCompanion();const level=currentWorldLevel(),t=tier(level);const nextPct=next?Math.min(100,Math.round((prog.xp/(next.xp||1))*100)):100;hud.innerHTML=`<div class="companionPod"><div class="companionIcon">${c.icon}</div><div><b>${c.name}</b><small>${next?`${next.xp-prog.xp} XP to ${next.name}`:'Maximum evolution reached'}</small></div></div><div class="xpPod"><div class="xpTop"><b>${t.icon} ${t.name}</b><span>${prog.xp} XP · ${prog.stars} ⭐</span></div><div class="xpBar"><i style="width:${nextPct}%"></i></div><small>${prog.streak>1?`🔥 ${prog.streak}-level streak`:'Complete levels to build a streak'}</small></div><div class="badgePod"><b>🏅 ${prog.badges.length}</b><small>badges earned</small></div>`}
function decorateStage(){const stage=document.querySelector('#gameStage');if(!stage||!state.selected)return;let strip=stage.querySelector('.difficultyStrip');if(!strip){strip=document.createElement('div');strip.className='difficultyStrip';stage.prepend(strip)}const lvl=currentWorldLevel(),t=tier(lvl);strip.innerHTML=`<span>${t.icon} ${t.name}</span><span>Level ${lvl}/30</span><span>${lvl<=10?'Skill building':lvl<=20?'Multi-step challenge':'Master challenge'}</span>`}
function takeSnapshot(){snapshot={};for(const w of worlds)snapshot[w.name]=progressFor(w.name)}
function detectProgress(){if(!state?.activeProfile)return;if(Object.keys(snapshot).length===0){takeSnapshot();return}for(const w of worlds){const before=snapshot[w.name]||1,now=progressFor(w.name);if(now>before){for(let completed=before;completed<now;completed++)award(w.name,Math.min(30,completed));snapshot[w.name]=now}}}
function hook(){load();takeSnapshot();renderHud();const stage=document.querySelector('#gameStage');if(stage){new MutationObserver(()=>decorateStage()).observe(stage,{childList:true,subtree:false})}setInterval(detectProgress,450);window.addEventListener('jamkar:auth',()=>{load();takeSnapshot();renderHud()});const select=document.querySelector('#switchProfile');select?.addEventListener('change',()=>setTimeout(()=>{load();takeSnapshot();renderHud()},0))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
