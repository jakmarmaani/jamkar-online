(()=>{
const $=s=>document.querySelector(s);const ADMIN_EMAIL='mohamed.a.elmonim@gmail.com';
const backend=window.JamKarBackend;
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function waitBackend(){for(let i=0;i<50;i++){if(backend?.state?.client)return;await new Promise(r=>setTimeout(r,100))}throw new Error('Backend unavailable')}
async function authorised(){await waitBackend();await backend.refreshUser();return (backend.state.user?.email||'').toLowerCase()===ADMIN_EMAIL}
async function rpc(name,args={}){const {data,error}=await backend.state.client.rpc(name,args);if(error)throw error;return data}
function metric(label,value){return `<div class="metric"><strong>${Number(value||0).toLocaleString()}</strong><span>${label}</span></div>`}
async function sendMagic(){const status=$('#gateStatus');status.textContent='Sending secure admin link…';await waitBackend();const {error}=await backend.state.client.auth.signInWithOtp({email:ADMIN_EMAIL,options:{emailRedirectTo:'https://jamkar.online/admin.html',shouldCreateUser:true}});if(error)throw error;status.textContent='Secure sign-in link sent to '+ADMIN_EMAIL+'. Open it on this device to activate the administrator account.'}
async function recoverMisroutedAuth(){if(location.hostname!=='jamkar.online')return false;return false}
async function createFamily(){const s=$('#createStatus');s.textContent='Creating family…';const payload={email:$('#newParentEmail').value.trim(),child1:$('#newChild1').value.trim(),child2:$('#newChild2').value.trim(),unlock:$('#newUnlock').checked};const {data,error}=await backend.state.client.functions.invoke('admin-create-family',{body:payload});if(error)throw error;if(data?.error)throw new Error(data.error);s.textContent='Family created and secure invite sent.';$('#newParentEmail').value='';$('#newChild1').value='';$('#newChild2').value='';await load()}
async function load(){
 const gate=$('#gate'),app=$('#adminApp'),status=$('#gateStatus');status.textContent='Checking access…';
 if(!await authorised()){gate.classList.remove('hidden');app.classList.add('hidden');status.textContent='Administrator account not signed in on this browser.';return}
 gate.classList.add('hidden');app.classList.remove('hidden');
 const [overview,families]=await Promise.all([rpc('admin_get_overview'),rpc('admin_list_families')]);
 $('#metrics').innerHTML=[metric('Parent accounts',overview.parents),metric('Child profiles',overview.children),metric('Unlocked families',overview.unlockedFamilies),metric('Completed purchases',overview.completedPurchases),metric('Pending purchases',overview.pendingPurchases)].join('');
 $('#maintenance').checked=!!overview.settings?.maintenance_mode;$('#announcement').value=overview.settings?.announcement||'';
 $('#families').innerHTML=(families||[]).map(f=>`<tr><td>${esc(f.email)}</td><td>${f.child_count}</td><td class="${f.lifetime_unlocked?'unlocked':'locked'}">${f.lifetime_unlocked?'Lifetime unlocked':'Locked'}</td><td>${new Date(f.created_at).toLocaleDateString()}</td><td><button class="btn ${f.lifetime_unlocked?'danger':'primary'}" data-user="${f.user_id}" data-unlocked="${f.lifetime_unlocked}">${f.lifetime_unlocked?'Lock':'Unlock'}</button></td></tr>`).join('')||'<tr><td colspan="5">No family accounts yet.</td></tr>';
 document.querySelectorAll('[data-user]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await rpc('admin_set_family_unlock',{p_user_id:b.dataset.user,p_unlocked:b.dataset.unlocked!=='true'});await load()}catch(e){alert(e.message)}finally{b.disabled=false}})
}
$('#adminMagic').onclick=()=>sendMagic().catch(e=>$('#gateStatus').textContent=e.message);$('#retry').onclick=()=>load().catch(e=>$('#gateStatus').textContent=e.message);$('#refresh').onclick=()=>load().catch(console.error);$('#createFamily').onclick=()=>createFamily().catch(e=>$('#createStatus').textContent=e.message);
$('#adminSignOut').onclick=async()=>{await backend.state.client.auth.signOut();location.reload()};
$('#saveSettings').onclick=async()=>{const s=$('#settingsStatus');s.textContent='Saving…';try{await rpc('admin_update_settings',{p_maintenance:$('#maintenance').checked,p_announcement:$('#announcement').value.trim()});s.textContent='Saved.'}catch(e){s.textContent=e.message}};
window.addEventListener('jamkar:backend',()=>load().catch(console.error));window.addEventListener('jamkar:auth',()=>load().catch(console.error));recoverMisroutedAuth();load().catch(e=>$('#gateStatus').textContent=e.message);
})();