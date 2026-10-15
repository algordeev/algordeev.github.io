const {chromium} = require(process.env.PARETO_PLAYWRIGHT_MODULE || 'playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const artifacts = process.env.PARETO_ARTIFACT_DIR || path.join(__dirname, 'verification');
fs.mkdirSync(artifacts, {recursive:true});
const baseURL = process.env.PARETO_URL || 'http://127.0.0.1:8000/pareto-explorer/';
let activeBrowser;
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.PARETO_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-first-run','--disable-background-networking']});
 activeBrowser=browser;
 const page=await browser.newPage({viewport:{width:1440,height:1100}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const requests=[];page.on('request',r=>requests.push(r.url()));
 await page.goto(baseURL);
 await page.locator('#explorer').waitFor({state:'visible'});
 if(await page.locator('#load-status').isVisible())throw Error(await page.locator('#load-status').textContent());
 await page.screenshot({path:path.join(artifacts, 'desktop.png'),fullPage:true});
 const results=await page.evaluate(async()=>{
  const data=await (await fetch('data/pareto_solutions.json')).json(), results=[];
  const $=id=>document.getElementById(id), change=(id,value)=>{$(id).value=value;$(id).dispatchEvent(new Event('change',{bubbles:true}));};
  const assert=(v,msg)=>{if(!v)throw Error(msg);};
  for(const g of data.groups){
   change('lake',g.lake);change('fleet',String(g.fleet));change('configuration',g.configuration);
   assert(document.querySelectorAll('#front .point').length===g.solutions.length,'Point count '+g.id);
   assert($('point-count').textContent===`${g.solutions.length} representative solutions from a front of ${g.frontCount}.`,'Representative count wording');
   const lake=data.lakes.find(l=>l.id===g.lake);
   for(const s of g.solutions){
    const point=document.querySelector(`#front [data-index="${s.index}"]`);point.dispatchEvent(new MouseEvent('click',{bubbles:true}));
    assert(point.classList.contains('selected'),'Selected point');
    assert(document.querySelectorAll('#front .selected').length===1,'One selected point');
    assert($('map').dataset.solutionIndex===String(s.index),'Map index');
    assert($('mission').value===String(s.index),'Select sync');
    assert($('selection-context').textContent.includes(`Solution ${s.index} (MATLAB index)`),'Summary sync');
    assert(!$('tooltip').hidden&&$('tooltip').textContent.includes(`Solution ${s.index}`),'Tooltip sync');
    const paths=[...document.querySelectorAll('#map path[data-boat]')];assert(paths.length===g.fleet,'Boat count');
    const image=document.querySelector('#map image'),scale=Number(image.getAttribute('width'))/(lake.bounds[2]-lake.bounds[0]);
    const ox=Number(image.getAttribute('x'))-lake.bounds[0]*scale,oy=Number(image.getAttribute('y'))+lake.bounds[3]*scale;
    s.boats.forEach((b,i)=>{
     const actual=paths[i].getAttribute('d').match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi).map(Number);
     const expected=[b.start,...b.segments.flatMap(c=>[c.slice(0,2),c.slice(2,4),c.slice(4)])].flatMap(([x,y])=>[ox+x*scale,oy-y*scale]);
     assert(actual.length===expected.length,'Route command dimensions');
     assert(actual.every((v,k)=>Math.abs(v-expected[k])<1e-7),'Wrong route for '+g.id+' solution '+s.index);
     assert(actual.every(v=>Number.isFinite(v)),'Nonfinite route');
    });
   }
   results.push({group:g.id,clicked:g.solutions.length});
  }
  change('lake','E2');change('fleet','2');
  return results;
 });
 await page.locator('#front .point.selected').focus();
 const before=await page.locator('#map').getAttribute('data-solution-index');
 await page.keyboard.press('ArrowRight');
 const after=await page.locator('#map').getAttribute('data-solution-index');
 if(before===after)throw Error('Keyboard did not change mission');
 await page.getByRole('button',{name:'Greater Cyanobacteria-density coverage',exact:true}).click();
 if(await page.getByRole('button',{name:'Greater Cyanobacteria-density coverage',exact:true}).getAttribute('aria-pressed')!=='true')throw Error('Preset sync');
 await page.getByRole('button',{name:'Balanced solution',exact:true}).click();
 await page.locator('#front .point').last().hover();
 if(!await page.locator('#tooltip').isVisible())throw Error('Hover tooltip');
 await page.mouse.move(0,0);
 await page.getByRole('button',{name:'Balanced solution',exact:true}).click();
 await page.screenshot({path:path.join(artifacts, 'desktop.png'),fullPage:true});
 await page.selectOption('#lake','E4'); await page.selectOption('#fleet','3');
 if(await page.locator('#configuration').inputValue()!=='A2R3X1')throw Error('Recommended config for E4 fleet3');
 await page.screenshot({path:path.join(artifacts, 'campillo.png'),fullPage:true});
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce',deviceScaleFactor:1});
 const m=await mobile.newPage();m.on('pageerror',e=>errors.push(e.message));await m.goto(page.url());await m.locator('#explorer').waitFor({state:'visible'});
 const layout=await m.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,columns:getComputedStyle(document.querySelector('.panels')).gridTemplateColumns,transition:getComputedStyle(document.querySelector('button')).transitionDuration}));
 if(layout.overflow)throw Error('Mobile horizontal overflow');
 await m.locator('#front .point').last().tap();
 if(!await m.locator('#tooltip').isVisible())throw Error('Touch tooltip');
 await m.getByRole('button',{name:'Balanced solution',exact:true}).tap();
 await m.screenshot({path:path.join(artifacts, 'mobile.png'),fullPage:true});
 for(const width of [320,390,760,1024,1440]){
  await m.setViewportSize({width,height:844});
  const invalid=await m.evaluate(()=>[...document.querySelectorAll('.controls select')].some(e=>{const r=e.getBoundingClientRect(),p=e.parentElement.getBoundingClientRect();return r.right>p.right+1||r.left<p.left-1;}));
  if(invalid)throw Error('Control overflow at '+width);
  if(await m.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Horizontal overflow at '+width);
 }

 // Only the local server is allowed during this check; no MATLAB is running.
 if(requests.some(u=>!u.startsWith(new URL(baseURL).origin + '/')))throw Error('External dependency');
 const intro=await page.locator('.intro').innerText();
 if(!intro.includes('feasible nondominated mission found in the final population')||intro.includes('Pareto-optimal'))throw Error('Final-population wording');
 if(!intro.includes('Cyanobacteria-density coverage'))throw Error('Coverage wording');
 if(await page.locator('#full-page-link').isVisible())throw Error('Redundant full-page link in dedicated view');
 const embedded=await browser.newPage();
 await embedded.goto(baseURL);
 await embedded.setContent(`<iframe title="Explorer" src="${baseURL}" style="width:900px;height:700px"></iframe>`);
 const fullPageLink=embedded.frameLocator('iframe').locator('#full-page-link');
 await fullPageLink.waitFor({state:'visible'});
 if(await fullPageLink.getAttribute('target')!=='_blank')throw Error('Full-page launch target');
 await embedded.close();
 if(errors.length)throw Error(errors.join('\n'));
 fs.writeFileSync(path.join(artifacts, 'results.json'),JSON.stringify({groups:results,solutions:results.reduce((s,r)=>s+r.clicked,0),keyboard:true,hover:true,touch:true,mobile:layout,errors,requests},null,2));
 console.log(JSON.stringify({groups:results.length,solutions:results.reduce((s,r)=>s+r.clicked,0),keyboard:true,hover:true,touch:true,mobile:layout,errors},null,2));
 await browser.close();
})().catch(async e=>{console.error(e);if(activeBrowser)await activeBrowser.close();process.exitCode=1});
