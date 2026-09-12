(()=>{
const account=document.querySelector('#accountModal');if(!account)return;
const email=account.querySelector('input[type="email"]');const child1=document.querySelector('#child1');const child2=document.querySelector('#child2');
const backend=window.JamKarBackend;const cloud=()=>backend?.state?.mode==='supabase'&&backend?.state?.client;
const avatars=['🧒🏾','🧑🏻','👧🏽','👦🏼','🧒🏻','👧🏾','👦🏿','🧑🏽'];
let selectedAvatar=localStorage.getItem('jamkar_avatar')||avatars[0];
const top=account.querySelector('.modalHead');top.insertAdjacentHTML('afterend',`<div class="accountTabs"><button class="accountTab active" data-mode="create">Create account</button><button class="accountTab" data-mode="signin">Parent sign in</button></div><div class="accountNotice"><strong>🔐 Parent account protection</strong><small>Children use their own profile names. Parent email, password and payment details are never shown in the child area.</small></div>`);
const grid=account.querySelector('.accountGrid');grid.insertAdjacentHTML('beforeend',`<div class="field full" id="passwordFields"><div class="passwordRow"><div><label>Password</label><input id="parentPassword" type="password" minlength="8" placeholder="At least 8 characters" autocomplete="new-password"></div><div><label>Confirm password</label><input id="parentPassword2" type="password" minlength="8" placeholder="Repeat password" autocomplete="new-password"></div></div></div><div class="field full"><label>Child avatar</label><div class="avatarPicker" id="avatarPicker">${avatars.map(a=>`<button type="button" class="avatarChoice ${a===selectedAvatar?'active':''}" data-avatar="${a}">${a}</button>`).join('')}</div></div>`);
const save=document.querySelector('#saveProfiles');save.insertAdjacentHTML('beforebegin',`<div class="termsRow" id="termsRow"><input id="parentTerms" type="checkbox"><label for="parentTerms">I confirm I am the parent or guardian creating this family account and I agree to the parent privacy, child-safety and purchase terms.</label></div><div id="accountStatus" class="accountStatus"></div>`);
const pay=document.querySelector('#paySection');pay.insertAdjacentHTML('beforeend',`<div class="secureCheckout"><div style="font-size:28px">🛡️</div><div><b>Secure £4.99 one-time unlock</b><span>Checkout will be completed through Revolut. JamKar unlocks access only after the payment is verified by the server.</span></div></div>`);
let mode='create';
function setMode(next){mode=next;document.querySelectorAll('.accountTab').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));document.querySelector('#termsRow').style.display=mode==='create'?'flex':'none';document.querySelector('#accountHeading').textContent=mode==='create'?'Create parent account':'Parent sign in';document.querySelector('#parentPassword2').parentElement.style.display=mode==='create'?'block':'none';save.textContent=mode==='create'?'Create family account':'Parent sign in'}
document.querySelectorAll('.accountTab').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
document.querySelectorAll('.avatarChoice').forEach(b=>b.onclick=()=>{selectedAvatar=b.dataset.avatar;document.querySelectorAll('.avatarChoice').forEach(x=>x.classList.remove('active'));b.classList.add('active')});
function status(message,ok=false){const el=document.querySelector('#accountStatus');el.className='accountStatus'+(ok?' ok':'');el.textContent=message}
function validUsername(v){return !v||/^[A-Za-z0-9 _-]{3,18}$/.test(v)}
async function saveCloudChildren(){const p1=child1.value.trim();const p2=child2.value.trim();if(!p1)throw new Error('Enter the first child username.');if(!validUsername(p1)||!validUsername(p2))throw new Error('Child usernames must be 3–18 characters using letters, numbers, spaces, _ or -.');await backend.saveChild(1,p1,selectedAvatar);if(p2)await backend.saveChild(2,p2,selectedAvatar);else await backend.deleteChild(2);localStorage.setItem('jamkar_profiles',JSON.stringify([p1,p2].filter(Boolean)));localStorage.setItem('jamkar_avatar',selectedAvatar)}
async function hydrateFamily(){if(!cloud()||!backend.state.user)return;const family=await backend.getFamily();const children=family?.children||[];child1.value=children.find(c=>c.slot===1)?.username||'';child2.value=children.find(c=>c.slot===2)?.username||'';const names=children.map(c=>c.username);if(names.length){localStorage.setItem('jamkar_profiles',JSON.stringify(names));if(window.state){window.state.activeProfile=names[0]||'Explorer'}}if(typeof window.loadProfiles==='function')window.loadProfiles();window.dispatchEvent(new CustomEvent('jamkar:family',{detail:family}))}
save.onclick=async()=>{status('');const e=(email.value||'').trim();const pass=document.querySelector('#parentPassword').value;const pass2=document.querySelector('#parentPassword2').value;if(!/^\S+@\S+\.\S+$/.test(e)){status('Enter a valid parent email address.');return}if(pass.length<8){status('Password must contain at least 8 characters.');return}if(mode==='create'&&pass!==pass2){status('The two password entries do not match.');return}if(mode==='create'&&!document.querySelector('#parentTerms').checked){status('Please confirm the parent/guardian terms to continue.');return}save.disabled=true;try{
 if(cloud()){
   if(mode==='create'){
     const {data,error}=await backend.signUp(e,pass);if(error)throw error;
     if(data?.session){await backend.refreshUser();await saveCloudChildren();await hydrateFamily();status('Family account created and saved securely.',true);toast('Family account created')}
     else{status('Account created. Check the parent email to confirm the address, then sign in to save the child profiles.',true)}
   }else{
     const {error}=await backend.signIn(e,pass);if(error)throw error;await backend.refreshUser();await hydrateFamily();status('Signed in securely. Your family profiles are loaded.',true);toast('Parent signed in')
   }
 }else{
   const p1=child1.value.trim()||'Explorer',p2=child2.value.trim();localStorage.setItem('jamkar_profiles',JSON.stringify([p1,p2].filter(Boolean)));localStorage.setItem('jamkar_avatar',selectedAvatar);status('Demo profile saved on this device. Secure cloud authentication is currently unavailable.',true);toast('Family profile saved')
 }
}catch(err){console.error(err);status(err?.message||'Could not complete that action. Please try again.')}finally{save.disabled=false}};
window.addEventListener('jamkar:auth',()=>hydrateFamily().catch(console.error));
window.addEventListener('jamkar:backend',()=>hydrateFamily().catch(console.error));
if(backend?.state?.user)hydrateFamily().catch(console.error);
})();