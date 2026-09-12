(()=>{
const backend=window.JamKarBackend;if(!backend)return;
let family=null;
const configured=()=>backend.state.mode==='supabase'&&backend.state.client;
function currentChild(){return family?.children?.find(c=>c.username===state.activeProfile)||family?.children?.[0]||null}
async function pullCloud(){
 if(!configured()){return}
 if(!backend.state.user){state.paid=false;renderStats();renderWorlds();return}
 family=await backend.getFamily();
 state.paid=!!family?.account?.lifetime_unlocked;
 const names=(family?.children||[]).map(c=>c.username);
 if(names.length){localStorage.setItem('jamkar_profiles',JSON.stringify(names));if(!names.includes(state.activeProfile))state.activeProfile=names[0];loadProfiles()}
 const child=currentChild();
 if(child){
   const rows=await backend.loadProgress(child.id);
   rows.forEach(r=>{state.progress[state.activeProfile+'|'+r.world_key]=Math.max(1,Number(r.highest_level||1))});
   localStorage.setItem('jamkar_progress',JSON.stringify(state.progress));
 }
 renderStats();renderWorlds();
 const demo=document.querySelector('#demoUnlock');if(demo){demo.textContent='Secure Revolut checkout coming next';demo.onclick=()=>toast('Secure payment setup is being connected. Demo unlock is disabled in production.')}
 const reset=document.querySelector('#resetDemo');if(reset)reset.style.display='none';
}
const originalSave=save;
save=function(){originalSave();if(!configured()||!backend.state.user)return;const child=currentChild();if(!child)return;const prefix=state.activeProfile+'|';Object.entries(state.progress).filter(([k])=>k.startsWith(prefix)).forEach(([k,v])=>backend.saveProgress(child.id,k.slice(prefix.length),Math.min(30,Number(v)||1),0).catch(err=>console.error('Cloud progress sync failed',err)))};
const switcher=document.querySelector('#switchProfile');switcher?.addEventListener('change',()=>{setTimeout(()=>pullCloud().catch(console.error),0)});
window.addEventListener('jamkar:backend',()=>pullCloud().catch(console.error));
window.addEventListener('jamkar:auth',()=>pullCloud().catch(console.error));
window.addEventListener('jamkar:family',e=>{family=e.detail;pullCloud().catch(console.error)});
if(configured())pullCloud().catch(console.error);
})();