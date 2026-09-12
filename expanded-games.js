(()=>{
const priorStartLevel=startLevel;
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
function choiceMission(n,title,icon,q,answers,correct,hint){
  els.stage.innerHTML=`<div class="miniGame missionGame"><div class="missionCharacter" aria-hidden="true">${icon}</div><div class="eyebrow">${title} · Level ${n}</div><p class="question">${q}</p><div class="choices">${answers.map((a,i)=>`<button class="choice" data-answer="${i}">${a}</button>`).join('')}</div><p class="note" id="feedback">${hint||'Choose the best answer.'}</p></div>`;
  document.querySelectorAll('[data-answer]').forEach(btn=>btn.onclick=()=>answer(btn,Number(btn.dataset.answer),correct));
}
function shuffledQuestion(n,title,icon,q,correctAnswer,wrong,hint){const all=shuffle([correctAnswer,...wrong.slice(0,3)]);choiceMission(n,title,icon,q,all,all.indexOf(correctAnswer),hint)}

function futureCity(n){const tiers=[
 ['A neighbourhood needs cleaner travel. What should you add?','Electric buses',['More traffic jams','Remove pavements','Burn more fuel']],
 ['A school wants to save energy. Best upgrade?','Solar panels',['Leave lights on','Heat empty rooms','Block daylight']],
 ['A park is getting too hot in summer. What helps most?','Plant shade trees',['Cover it in concrete','Remove water fountains','Add more exhaust fumes']],
 ['A city has too much rubbish. Best system?','Reuse and recycling',['Dump it in rivers','Burn everything','Use more single-use plastic']],
 ['A smart crossing should first protect…','People walking and cycling',['Only fast cars','Advertising screens','Empty roads']],
 ['A city is short of water. Best idea?','Fix leaks and collect rainwater',['Run taps all day','Pollute reservoirs','Ignore broken pipes']]
 ];const x=tiers[(n-1)%tiers.length];shuffledQuestion(n,'Future City','🤖',x[0],x[1],x[2],'Design a city that is safe, fair and sustainable.')}

function wordQuest(n){const bank=[
 ['Choose the correctly spelt word.','adventure',['adventur','advanture','advencher']],
 ['Which word means the same as “happy”?','joyful',['angry','tiny','silent']],
 ['Complete the sentence: “The explorers ___ ready.”','are',['is','am','be']],
 ['Which word is a describing word?','bright',['run','quickly','planet']],
 ['Choose the opposite of “ancient”.','modern',['old','historic','past']],
 ['Which sentence uses a capital letter correctly?','London is a city.',['london is a city.','London Is a city.','london Is A City.']],
 ['Which word is a verb?','build',['blue','tower','careful']],
 ['Complete: “She ___ a map every day.”','reads',['readed','reading','read']],
 ['Which word rhymes with “star”?','car',['sun','moon','sky']],
 ['Choose the plural of “city”.','cities',['citys','cityes','city']]
 ];const x=bank[(n-1)%bank.length];shuffledQuestion(n,'Word Quest','📚',x[0],x[1],x[2],'Read carefully — language clues get trickier as you level up.')}

function mathGalaxy(n){const tier=Math.floor((n-1)/10);let a=2+(n*3)%12,b=2+(n*5)%10,q,ans;if(tier===0){q=`What is ${a} + ${b}?`;ans=a+b}else if(tier===1){a=4+(n*2)%12;b=2+(n%7);q=`What is ${a} × ${b}?`;ans=a*b}else{a=20+(n*7)%60;b=2+(n%8);q=`A rover has ${a} energy cells and uses ${b}. How many remain?`;ans=a-b}const wrong=[ans+1,Math.max(0,ans-2),ans+3].map(String);shuffledQuestion(n,'Math Galaxy','🪐',q,String(ans),wrong,'Use patterns, number facts and problem-solving skills.')}

function scienceLab(n){const bank=[
 ['Which material is attracted strongly by a magnet?','Iron',['Wood','Glass','Paper']],
 ['What happens to water at about 0°C?','It freezes',['It boils','It glows','It disappears']],
 ['Plants make food using sunlight in…','photosynthesis',['evaporation','gravity','orbit']],
 ['Which organ pumps blood around the body?','Heart',['Lungs','Stomach','Skin']],
 ['Which state of matter keeps its own shape?','Solid',['Liquid','Gas','Steam only']],
 ['What force pulls objects toward Earth?','Gravity',['Magnetism only','Sound','Light']],
 ['Which is a renewable energy source?','Wind',['Coal','Oil','Diesel']],
 ['What do we call water changing into vapour?','Evaporation',['Freezing','Melting','Condensing']],
 ['Which part of a plant usually absorbs water?','Roots',['Flowers','Fruit','Petals']],
 ['Which simple machine helps lift a bucket from a well?','Pulley',['Battery','Compass','Thermometer']]
 ];const x=bank[(n-1)%bank.length];shuffledQuestion(n,'Science Lab','🧪',x[0],x[1],x[2],'Think like a scientist: observe, compare and choose the evidence-based answer.')}

function puzzleTemple(n){const mode=(n-1)%5;if(mode===0){const start=1+(n%5),step=2+(n%4),seq=[start,start+step,start+2*step,start+3*step];const ans=start+4*step;shuffledQuestion(n,'Puzzle Temple','🧩',`What comes next: ${seq.join(', ')}, …?`,String(ans),[String(ans+step),String(ans-1),String(ans+1)],'Find the rule in the number pattern.')}else if(mode===1){shuffledQuestion(n,'Puzzle Temple','🔷','Which shape has no corners?','Circle',['Square','Triangle','Rectangle'],'Use shape properties, not size or colour.')}else if(mode===2){shuffledQuestion(n,'Puzzle Temple','🧠','If RED = 3 letters and BLUE = 4 letters, how many letters are in PURPLE?','6',['5','7','8'],'Count carefully.')}else if(mode===3){shuffledQuestion(n,'Puzzle Temple','🔐','Which one does not belong?','Banana',['Triangle','Square','Circle'],'Look for the item from a different category.')}else{shuffledQuestion(n,'Puzzle Temple','🗝️','A door needs two keys. You have 5 keys and use 2. How many are left?','3',['2','4','5'],'Turn the story into a simple calculation.')}}

function worldExplorer(n){const bank=[
 ['Which continent is Egypt in?','Africa',['Europe','Asia','South America']],
 ['What is the capital of France?','Paris',['Madrid','Rome','Berlin']],
 ['The Amazon rainforest is mainly in…','South America',['Europe','Antarctica','Australia']],
 ['Which ocean lies between Africa and Australia?','Indian Ocean',['Arctic Ocean','Atlantic Ocean','Southern Ocean']],
 ['Mount Fuji is in…','Japan',['Canada','Kenya','Spain']],
 ['Which direction is opposite east?','West',['North','South','Up']],
 ['The Sahara is a…','desert',['river','city','forest']],
 ['Which country is famous for the Great Barrier Reef?','Australia',['Iceland','Peru','Poland']],
 ['A map scale helps us estimate…','distance',['sound','taste','age']],
 ['Which line divides Earth into Northern and Southern Hemispheres?','Equator',['Prime Meridian','Arctic Circle','Tropic of Capricorn only']]
 ];const x=bank[(n-1)%bank.length];shuffledQuestion(n,'World Explorer','🗺️',x[0],x[1],x[2],'Use maps, places, climate and direction clues.')}

startLevel=function(n){state.selectedLevel=n;switch(state.selected.name){case'Future City':futureCity(n);break;case'Word Quest':wordQuest(n);break;case'Math Galaxy':mathGalaxy(n);break;case'Science Lab':scienceLab(n);break;case'Puzzle Temple':puzzleTemple(n);break;case'World Explorer':worldExplorer(n);break;default:priorStartLevel(n)}};
})();
