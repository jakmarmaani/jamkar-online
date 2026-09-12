(()=>{
const backend=window.JamKarBackend;if(!backend)return;
let family=null;
const configured=()=>backend.state.mode==='supabase'&&backend.state.client;

// Never trust a browser/local demo flag for paid access. Until Supabase confirms
// the entitlement, always render the account as unpaid.
state.paid=false;
try{localStorage.removeItem('jamkar_paid')}catch{}
renderStats();renderWorlds();
const initialPay=document.querySelector('#paySection');if(initialPay)initialPay.style.display='block';
const initialCheckout=document.querySelector('#demoUnlock');if(initialCheckout){initialCheckout.textContent='Sign in to unlock securely with Revolut — £4.99';initialCheckout.disabled=false;}
const initialReset=document.querySelector('#resetDemo');if(initialReset)initialReset.style.display='none';

function currentChild(){return family?.children?.find(c=>c.username===state.activeProfile)||family?.children?.[0]||null}
async function pullCloud(){
 if(!configured())return;
 if(!backend.state.user){state.paid=false;renderStats();renderWorlds();const pay=document.querySelector('#paySection');if(pay)pay.style.display='block';return}
 family=await backend.getFamily();
 state.paid=!!family?.account?.lifetime_unlocked;
 const names=(family?.children||[]).map(c=>c.username);
 if(names.length){localStorage.setItem('jamkar_profiles',JSON.stringify(names));if(!names.includes(state.activeProfile))state.activeProfile=names[0];loadProfiles()}
 const child=currentChild();
 if(child){const rows=await backend.loadProgress(child.id);rows.forEach(r=>{state.progress[state.activeProfile+'|'+r.world_key]=Math.max(1,Number(r.highest_level||1))});localStorage.setItem('jamkar_progress',JSON.stringify(state.progress))}
 renderStats();renderWorlds();
 const pay=document.querySelector('#paySection');if(pay)pay.style.display=state.paid?'none':'block';
 const checkout=document.querySelector('#demoUnlock');if(checkout){checkout.textContent=state.paid?'Lifetime access active':'Unlock securely with Revolut — £4.99';checkout.disabled=state.paid;checkout.onclick=async()=>{if(!backend.state.user){toast('Please sign in to the parent account first.');openAccount('join');return}checkout.disabled=true;const old=checkout.textContent;checkout.textContent='Opening secure checkout…';try{const result=await backend.createCheckout();if(result?.alreadyUnlocked){await pullCloud();toast('Lifetime access is already active.');return}if(!result?.checkoutUrl)throw new Error('Checkout link was not returned.');location.href=result.checkoutUrl}catch(err){console.error(err);toast(err?.message||'Could not open Revolut checkout.');checkout.disabled=false;checkout.textContent=old}}}
 const reset=document.querySelector('#resetDemo');if(reset)reset.style.display='none';
}
const originalSave=save;save=function(){originalSave();if(!configured()||!backend.state.user)return;const child=currentChild();if(!child)return;const prefix=state.activeProfile+'|';Object.entries(state.progress).filter(([k])=>k.startsWith(prefix)).forEach(([k,v])=>backend.saveProgress(child.id,k.slice(prefix.length),Math.min(30,Number(v)||1),0).catch(err=>console.error('Cloud progress sync failed',err)))};
const switcher=document.querySelector('#switchProfile');switcher?.addEventListener('change',()=>{setTimeout(()=>pullCloud().catch(console.error),0)});
window.addEventListener('jamkar:backend',()=>pullCloud().catch(console.error));window.addEventListener('jamkar:auth',()=>pullCloud().catch(console.error));window.addEventListener('jamkar:family',e=>{family=e.detail;pullCloud().catch(console.error)});
async function handlePaymentReturn(){const params=new URLSearchParams(location.search);if(params.get('payment')!=='returned')return;toast('Payment received. Verifying with Revolut…');for(let i=0;i<6;i++){await pullCloud();if(state.paid){toast('Payment verified — lifetime access unlocked!');params.delete('payment');history.replaceState({},'',location.pathname+(params.toString()?'?'+params.toString():'')+location.hash);return}await new Promise(r=>setTimeout(r,2000))}toast('Payment is still being verified. Your access will unlock automatically once Revolut confirms it.')}
if(configured())pullCloud().then(handlePaymentReturn).catch(console.error);
})();