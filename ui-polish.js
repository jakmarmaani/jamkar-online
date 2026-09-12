(()=>{
const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];

function addMascots(){const art=$('.planetArt');if(!art)return;art.innerHTML=`<div class="mascotScene" aria-label="JamKar adventure mascots"><div class="mascotOrb" aria-hidden="true"></div><div class="mascot3d mascotJam" aria-label="Jam the space explorer">🧑‍🚀<span class="mascotLabel">Jam</span></div><div class="mascot3d mascotKar" aria-label="Kar the friendly robot">🤖<span class="mascotLabel">Kar</span></div><span class="spark s1" aria-hidden="true">✨</span><span class="spark s2" aria-hidden="true">⭐</span><span class="spark s3" aria-hidden="true">💫</span></div>`}

function addKidTip(){const shield=$('.parentShield');if(!shield||$('.kidTip'))return;shield.insertAdjacentHTML('afterend','<div class="kidTip"><span style="font-size:20px">🌟</span><div><b>Play your way</b><br>Explore, solve, build and level up. No public chat and no adverts.</div></div>')}

function addMissingFilters(){const box=$('.filters');if(!box)return;const existing=new Set($$('.filter',box).map(b=>b.dataset.cat));['History','Nature','Geography','Creative','Challenge'].forEach(cat=>{if(existing.has(cat))return;const b=document.createElement('button');b.className='filter';b.dataset.cat=cat;b.textContent=cat;b.onclick=()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.category=cat;renderWorlds()};box.appendChild(b)})}

function openBuilder(){const w=worlds.find(x=>x.name==='Time Builder');if(!w)return;if(!state.paid){openAccount('unlock');return}openWorld(w.name)}
function openMyWorlds(){if(window.JamKarDashboard?.open)window.JamKarDashboard.open();else $('.sideNav button:nth-child(4)')?.click()}
function goHome(){window.scrollTo({top:0,behavior:'smooth'})}
function goWorlds(){$('#worlds')?.scrollIntoView({behavior:'smooth',block:'start'})}

function wireTopNav(){const buttons=$$('.top .nav button');if(buttons[0])buttons[0].onclick=goWorlds;if(buttons[1])buttons[1].onclick=openBuilder;if(buttons[2])buttons[2].onclick=openMyWorlds;const side=$$('.sideNav button');if(side[0])side[0].onclick=goHome;if(side[2])side[2].onclick=openBuilder}

function mobileDock(){if($('.mobileDock'))return;document.body.insertAdjacentHTML('beforeend',`<nav class="mobileDock" aria-label="Mobile navigation"><button class="active" data-dock="home"><span>🏠</span>Home</button><button data-dock="worlds"><span>🎮</span>Worlds</button><button data-dock="build"><span>🧱</span>Build</button><button data-dock="parent"><span>👨‍👩‍👧</span>Parent</button></nav>`);$$('.mobileDock button').forEach(b=>b.onclick=()=>{$$('.mobileDock button').forEach(x=>x.classList.remove('active'));b.classList.add('active');if(b.dataset.dock==='home')goHome();if(b.dataset.dock==='worlds')goWorlds();if(b.dataset.dock==='build')openBuilder();if(b.dataset.dock==='parent')openAccount('join')})}

function syncAvatar(){const avatar=localStorage.getItem('jamkar_avatar')||'🧒🏾';const a=$('.playerMini .avatar');if(a)a.textContent=avatar}

function accessibility(){const worldModal=$('#worldModal'),accountModal=$('#accountModal');worldModal?.setAttribute('role','dialog');worldModal?.setAttribute('aria-modal','true');accountModal?.setAttribute('role','dialog');accountModal?.setAttribute('aria-modal','true');const stage=$('#gameStage');stage?.setAttribute('aria-live','polite');document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(worldModal?.classList.contains('open'))worldModal.classList.remove('open');else if(accountModal?.classList.contains('open'))accountModal.classList.remove('open')})}

function protectLockedNavigation(){document.addEventListener('click',e=>{const level=e.target.closest?.('.level.locked');if(level){e.preventDefault();if(!state.paid)toast('Level 4+ unlocks with the £4.99 family pass.')}})}

function updateHeroForSession(){const btn=$('#joinHero');if(!btn)return;const signed=!!window.JamKarBackend?.state?.user;btn.textContent=signed?'Open parent area':'Create family account';btn.onclick=()=>openAccount(signed?'account':'join')}

function init(){addMascots();addKidTip();addMissingFilters();wireTopNav();mobileDock();syncAvatar();accessibility();protectLockedNavigation();updateHeroForSession();window.addEventListener('jamkar:auth',()=>{syncAvatar();updateHeroForSession()});window.addEventListener('jamkar:family',syncAvatar)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
