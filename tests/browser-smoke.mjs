import { chromium, webkit } from 'playwright';

const browserName=(process.env.BROWSER||'chromium').toLowerCase();
const browserType=browserName==='webkit'?webkit:chromium;
const browser=await browserType.launch({headless:true});
async function desktopSmoke(){
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>localStorage.setItem('jamkar_paid','yes'));
 await page.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});await page.waitForSelector('#worlds .worldCard',{timeout:15000});
 if(!(await page.title()).includes('JamKar Online'))throw new Error('Unexpected page title');
 const cards=await page.locator('#worlds .worldCard').count();if(cards!==24)throw new Error(`Expected 24 world cards, found ${cards}`);
 if(await page.evaluate(()=>localStorage.getItem('jamkar_paid')!==null))throw new Error('Legacy browser paid flag was not removed');
 if(!(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor!=='')))throw new Error('Light production theme did not load');
 if(await page.locator('.safety').count())throw new Error('Safety copy still appears on child-facing main page');
 if(!(await page.locator('.musicToggle').isVisible()))throw new Error('Music control is not visible');
 await page.locator('#worlds .worldCard').first().click();await page.waitForSelector('#worldModal.open');
 const levels=await page.locator('#levelGrid .level').count();if(levels!==30)throw new Error(`Expected 30 levels, found ${levels}`);
 if(!(await page.locator('#levelGrid .level').nth(3).isDisabled()))throw new Error('Free user can access Level 4');
 await page.locator('#levelGrid .level').first().click();await page.waitForTimeout(450);if(!(await page.locator('#gameStage').textContent())?.trim())throw new Error('Game stage did not render');
 if(!(await page.locator('#gameStage').getAttribute('data-world-theme')))throw new Error('World-specific game theme was not applied');
 await page.locator('#closeWorld').click();
 await page.locator('#worlds .worldCard').nth(5).click();await page.waitForSelector('#accountModal.open');if(await page.locator('#worldModal.open').count())throw new Error('Paid world opened without verified entitlement');
 if(await page.locator('#child3').count())throw new Error('Unexpected third child profile field');
 if(await page.locator('#parentPassword').getAttribute('minlength')!=='8')throw new Error('Password minimum is not 8');
 if(!(await page.locator('.parentSafetyBox').isVisible()))throw new Error('Parent safety copy was not moved into Parent Area');
 await page.locator('#closeAccount').click();await page.locator('#profileBtn').click();await page.waitForSelector('#accountModal.open');
 if(errors.length)throw new Error(`${browserName} desktop page errors: `+errors.join(' | '));await page.close();
}
async function mobileSmoke(){
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});await page.waitForSelector('#worlds .worldCard',{timeout:15000});
 const dock=page.locator('.mobileDock');if(!(await dock.isVisible()))throw new Error('Mobile navigation dock is not visible');
 const bodyWidth=await page.evaluate(()=>document.documentElement.scrollWidth),viewportWidth=await page.evaluate(()=>window.innerWidth);if(bodyWidth>viewportWidth+2)throw new Error(`Mobile page overflows horizontally: ${bodyWidth}px > ${viewportWidth}px`);
 await page.locator('#worlds .worldCard').first().click();await page.waitForSelector('#worldModal.open');await page.locator('#levelGrid .level').first().click();await page.waitForTimeout(450);
 const modalOverflow=await page.evaluate(()=>document.querySelector('#worldModal .modalCard')?.scrollWidth>window.innerWidth+2);if(modalOverflow)throw new Error('World modal overflows mobile viewport');
 await page.locator('#closeWorld').click();await page.locator('.mobileDock [data-dock="parent"]').click();await page.waitForSelector('#accountModal.open');
 const accountOverflow=await page.evaluate(()=>document.querySelector('#accountModal .modalCard')?.scrollWidth>window.innerWidth+2);if(accountOverflow)throw new Error('Parent account modal overflows mobile viewport');
 if(errors.length)throw new Error(`${browserName} mobile page errors: `+errors.join(' | '));await page.close();
}
await desktopSmoke();await mobileSmoke();await browser.close();
console.log(`${browserName} browser smoke passed: redesigned desktop/mobile runtime, paywall tamper resistance, themed gameplay, music, navigation and Parent Area.`);
