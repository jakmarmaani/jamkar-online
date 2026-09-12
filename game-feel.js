(()=>{
function emojiForWorld(name){const w=worlds.find(x=>x.name===name);return w?.emoji||'✨'}
function decorate(){const stage=document.querySelector('#gameStage');if(!stage||!state.selected)return;let scene=stage.querySelector('.worldAmbience');if(!scene){scene=document.createElement('div');scene.className='worldAmbience';scene.setAttribute('aria-hidden','true');stage.prepend(scene)}const icon=emojiForWorld(state.selected.name);scene.innerHTML=`<span class="ambientOrb orbA">${icon}</span><span class="ambientOrb orbB">✨</span><span class="ambientOrb orbC">⭐</span><span class="jamMascot"><i class="mascotHead">🙂</i><i class="mascotBody">🚀</i></span>`;}
function react(kind='happy'){const mascot=document.querySelector('.jamMascot');if(!mascot)return;mascot.dataset.mood=kind;mascot.classList.remove('react');void mascot.offsetWidth;mascot.classList.add('react');setTimeout(()=>mascot.classList.remove('react'),650)}
const obsTarget=document.querySelector('#gameStage');if(obsTarget)new MutationObserver(()=>decorate()).observe(obsTarget,{childList:true});
document.addEventListener('click',e=>{if(e.target.closest('.choice.correct,.used,.matched,.filled'))react('happy');if(e.target.closest('.wrong,.bad'))react('oops')});
window.JamKarGameFeel={react,decorate};decorate();
})();