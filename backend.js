(()=>{
const cfg=window.JAMKAR_CONFIG||{};
const state={mode:'demo',client:null,user:null};
const required=['supabaseUrl','supabaseKey'];
function ready(){return required.every(k=>typeof cfg[k]==='string'&&cfg[k].trim())&&window.supabase?.createClient}
function emit(name,detail={}){window.dispatchEvent(new CustomEvent('jamkar:'+name,{detail}))}
async function init(){
 if(!ready()){emit('backend',{mode:'demo'});return state}
 state.client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 const {data}=await state.client.auth.getUser();state.user=data?.user||null;state.mode='supabase';
 state.client.auth.onAuthStateChange((_event,session)=>{state.user=session?.user||null;emit('auth',{user:state.user})});
 emit('backend',{mode:'supabase',user:state.user});return state
}
async function signUp(email,password){if(!state.client)throw new Error('Backend is not configured yet.');return state.client.auth.signUp({email,password,options:{emailRedirectTo:location.origin}})}
async function signIn(email,password){if(!state.client)throw new Error('Backend is not configured yet.');return state.client.auth.signInWithPassword({email,password})}
async function signOut(){if(!state.client)return;await state.client.auth.signOut();state.user=null;emit('auth',{user:null})}
async function getFamily(){if(!state.client||!state.user)return null;const [{data:account,error:ae},{data:children,error:ce}]=await Promise.all([state.client.from('parent_accounts').select('user_id,lifetime_unlocked,created_at').eq('user_id',state.user.id).maybeSingle(),state.client.from('child_profiles').select('id,slot,username,avatar_key,created_at').order('slot')]);if(ae)throw ae;if(ce)throw ce;return{account,children:children||[]}}
async function saveChild(slot,username,avatarKey='explorer'){if(!state.client||!state.user)throw new Error('Sign in first.');const payload={parent_id:state.user.id,slot,username,avatar_key:avatarKey};const {data,error}=await state.client.from('child_profiles').upsert(payload,{onConflict:'parent_id,slot'}).select().single();if(error)throw error;return data}
async function loadProgress(childId){if(!state.client)return[];const {data,error}=await state.client.from('game_progress').select('world_key,highest_level,stars,updated_at').eq('child_profile_id',childId);if(error)throw error;return data||[]}
async function saveProgress(childId,worldKey,highestLevel,stars=0){if(!state.client)throw new Error('Backend is not configured yet.');const payload={child_profile_id:childId,world_key:worldKey,highest_level:Math.max(1,Math.min(30,highestLevel)),stars:Math.max(0,stars)};const {data,error}=await state.client.from('game_progress').upsert(payload,{onConflict:'child_profile_id,world_key'}).select().single();if(error)throw error;return data}
async function entitlement(){if(!state.client||!state.user)return false;const {data,error}=await state.client.from('parent_accounts').select('lifetime_unlocked').eq('user_id',state.user.id).maybeSingle();if(error)throw error;return !!data?.lifetime_unlocked}
window.JamKarBackend={state,init,signUp,signIn,signOut,getFamily,saveChild,loadProgress,saveProgress,entitlement};
init().catch(err=>{console.error('JamKar backend init failed',err);emit('backend-error',{message:err.message})});
})();