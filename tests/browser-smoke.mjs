import { chromium, webkit } from 'playwright';

const browserName=(process.env.BROWSER||'chromium').toLowerCase();
const browserType=browserName==='webkit'?webkit:chromium;
const browser=await browserType.launch({headless:true});
const activate=async locator=>locator.evaluate(el=>el.click());
async function desktopSmoke(){
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>localStorage.setItem('jamkar_paid','yes'));
 await page.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});await page.waitForSelector('#worlds .worldCard',{timeout:15000});
 if(!(await page.title()).includes('JamKar Online'))throw new Error('Unexpected page title');
 const cards=await page.locator('#worlds .worldCard').count();if(cards!==24)throw new Error(`Expected 24 world cards, found ${cards}`);
 if(await page.evaluate(()=>localStorage.getItem('jamkar_paid')!==null))throw new Error('Legacy browser paid flag was not removed');
 if(await page.locator('.safety').count())throw new Error('Safety copy still appears on child-facing main page');
 if(!(await page.locator('.musicToggle').isVisible()))throw new Error('Music control is not visible');
 if(await page.locator('.adminShortcut:visible').count())throw new Error('Admin shortcut appears on child-facing UI');
 await activate(page.locator('.top .nav button').first());await page.waitForTimeout(180);if(await page.locator('.hero').isVisible())throw new Error('Games navigation did not switch to game library view');
 await activate(page.locator('#worlds .worldCard').first());await page.waitForSelector('#worldModal.open');
 const levels=await page.locator('#levelGrid .level').count();if(levels!==30)throw new Error(`Expected 30 levels, found ${levels}`);
 if(!(await page.locator('#levelGrid .level').nth(3).isDisabled()))throw new Error('Free user can access Level 4');
 await page.waitForSelector('.jkGameWorld',{timeout:5000});
 if(!(await page.locator('.jkGameCanvas').isVisible()))throw new Error('Modern playable canvas world is not visible');
 if(!(await page.locator('.jkMovePad').isVisible()))throw new Error('Modern movement controls are not visible');
 if(!(await page.locator('.jkMissionToggle').isVisible()))throw new Error('Mission toggle is not visible');
 if(!(await page.locator('#backWorld').isVisible()))throw new Error('Back to Worlds button is not visible');
 await page.waitForTimeout(250);if(!(await page.locator('#gameStage').textContent())?.trim())throw new Error('Game did not start immediately after opening world');
 const full=await page.evaluate(()=>{const r=document.querySelector('#worldModal .modalCard').getBoundingClientRect();return Math.abs(r.width-innerWidth)<3&&Math.abs(r.height-innerHeight)<3});if(!full)throw new Error('World game does not fill viewport');
 const horizontalLevels=await page.evaluate(()=>{const g=document.querySelector('#levelGrid');return g.scrollWidth>=g.clientWidth&&getComputedStyle(g).display==='flex'});if(!horizontalLevels)throw new Error('Levels are not presented as horizontal game rail');
 if(!(await page.locator('#gameStage').getAttribute('data-world-theme')))throw new Error('World-specific game theme was not applied');
 await activate(page.locator('.jkMissionToggle'));await page.waitForTimeout(80);if(!(await page.locator('.jkQuest').evaluate(el=>el.classList.contains('is-hidden'))))throw new Error('Mission panel cannot be hidden for free exploration');
 await activate(page.locator('#backWorld'));await page.waitForTimeout(100);if(await page.locator('#worldModal.open').count())throw new Error('Back button did not leave game world');
 await activate(page.locator('#worlds .worldCard').nth(5));await page.waitForSelector('#accountModal.open');if(await page.locator('#worldModal.open').count())throw new Error('Paid world opened without verified entitlement');
 if(await page.locator('#child3').count())throw new Error('Unexpected third child profile field');
 if(await page.locator('#parentPassword').getAttribute('minlength')!=='8')throw new Error('Password minimum is not 8');
 if(!(await page.locator('.parentSafetyBox').isVisible()))throw new Error('Parent safety copy was not moved into Parent Area');
 await activate(page.locator('#closeAccount'));await activate(page.locator('#profileBtn'));await page.waitForSelector('#accountModal.open');
 if(errors.length)throw new Error(`${browserName} desktop page errors: `+errors.join(' | '));await page.close();
}
async function mobileSmoke(){
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});await page.waitForSelector('#worlds .worldCard',{timeout:15000});
 const dock=page.locator('.mobileDock');if(!(await dock.isVisible()))throw new Error('Mobile navigation dock is not visible');
 const bodyWidth=await page.evaluate(()=>document.documentElement.scrollWidth),viewportWidth=await page.evaluate(()=>window.innerWidth);if(bodyWidth>viewportWidth+2)throw new Error(`Mobile page overflows horizontally: ${bodyWidth}px > ${viewportWidth}px`);
 await activate(page.locator('#worlds .worldCard').first());await page.waitForSelector('#worldModal.open');await page.waitForSelector('.jkGameWorld',{timeout:5000});await page.waitForTimeout(250);
 if(!(await page.locator('.jkGameCanvas').isVisible()))throw new Error('Mobile playable world is not visible');
 if(!(await page.locator('.jkMovePad').isVisible()))throw new Error('Mobile movement pad is not visible');
 if(!(await page.locator('#backWorld').isVisible()))throw new Error('Mobile back button is not visible');
 const modalOverflow=await page.evaluate(()=>document.querySelector('#worldModal .modalCard')?.scrollWidth>window.innerWidth+2);if(modalOverflow)throw new Error('World modal overflows mobile viewport');
 await activate(page.locator('#backWorld'));await activate(page.locator('.mobileDock [data-dock="parent"]'));await page.waitForSelector('#accountModal.open');
 const accountOverflow=await page.evaluate(()=>document.querySelector('#accountModal .modalCard')?.scrollWidth>window.innerWidth+2);if(accountOverflow)throw new Error('Parent account modal overflows mobile viewport');
 if(errors.length)throw new Error(`${browserName} mobile page errors: `+errors.join(' | '));await page.close();
}
await desktopSmoke();await mobileSmoke();await browser.close();
console.log(`${browserName} browser smoke passed: modern full-screen canvas gameplay, smooth library navigation, back button, mission drawer, paywall, music and Parent Area.`);
