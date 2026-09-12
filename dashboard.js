(()=>{
function profiles(){try{return JSON.parse(localStorage.getItem('jamkar_profiles')||'[]')}catch{return[]}}
function progress(){try{return JSON.parse(localStorage.getItem('jamkar_progress')||'{}')}catch{return{}}}
function completed(){try{return JSON.parse(localStorage.getItem('jamkar_completed')||'{}')}catch{return{}}}
function achievements(){try{return JSON.parse(localStorage.getItem('jamkar_achievements')||'{}')}catch{return{}}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function openDashboard(){
 const name=state.activeProfile||'Explorer', p=progress(), done=completed(), badges=achievements()[name]||[];
 const rows=worlds.map(w=>{const key=name+'|'+w.name;const level=Math.min(30,Number(p[key]||1));const finished=!!done[key];const pct=finished?100:Math.max(0,Math.round(((level-1)/30)*100));return `<div class="dashWorld"><div class="dashWorldTop"><span>${w.emoji||'🎮'} <b>${esc(w.name)}</b></span><span>${finished?'🏆 Complete':Math.max(0,level-1)+'/30'}</span></div><div class="dashBar"><i style="width:${pct}%"></i></div></div>`}).join('');
 const cloudActive=window.JamKarBackend?.state?.mode==='supabase'&&window.JamKarBackend?.state?.user;
 const syncNote=cloudActive?'Progress is securely synchronised to this child profile when you are signed in.':'Sign in to the parent account to synchronise this child’s progress securely across devices.';
 const modal=document.createElement('div');modal.className='modal open';modal.id='dashboardModal';modal.innerHTML=`<section class="modalCard dashboardCard"><div class="modalHead"><div><span class="eyebrow">Player journey</span><h2>${esc(name)}'s achievements</h2></div><button class="close" id="closeDash" aria-label="Close">✕</button></div><div class="dashSummary"><div><strong>${worlds.filter(w=>done[name+'|'+w.name]).length}</strong><span>worlds mastered</span></div><div><strong>${badges.length}</strong><span>badges earned</span></div><div><strong>${worlds.reduce((a,w)=>a+Math.max(0,Math.min(30,Number(p[name+'|'+w.name]||1))-1),0)}</strong><span>levels cleared</span></div></div><h3>🏆 Badge cabinet</h3><div class="badgeCabinet">${badges.length?badges.map(b=>`<span class="achievement">🏅 ${esc(b)}</span>`).join(''):'<p class="note">Complete levels 3, 10, 20 and 30 to earn badges.</p>'}</div><h3>🌍 World progress</h3><div class="dashWorlds">${rows}</div><p class="note">${syncNote}</p></section>`;document.body.appendChild(modal);modal.querySelector('#closeDash').onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};
}
document.querySelectorAll('.sideNav button').forEach(btn=>{if(btn.textContent.includes('Achievements'))btn.onclick=openDashboard;if(btn.textContent.includes('Parent Area'))btn.onclick=()=>openAccount('account');if(btn.textContent.includes('Discover'))btn.onclick=()=>document.querySelector('#worlds').scrollIntoView({behavior:'smooth'});});
window.JamKarDashboard={open:openDashboard};
})();