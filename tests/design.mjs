import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('artifacts', {recursive:true});
const base=process.env.TEST_URL || 'http://127.0.0.1:4173';
const remote=base.startsWith('https://');
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  headless:true,
  args:['--no-sandbox'],
  proxy: remote && process.env.HTTPS_PROXY ? {server:process.env.HTTPS_PROXY} : undefined,
});
const page = await browser.newPage({viewport:{width:1440,height:1200}});
const errors=[];
page.on('pageerror', e=>errors.push(e.message));
page.on('console', m=>{if(m.type()==='error')errors.push(m.text());});
page.on('response', r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
if (remote) {
  // Use Node's trusted CA through the inherited proxy; preserve TLS verification.
  await page.route('https://**/*', async route => {
    await route.fulfill({response:await route.fetch()});
  });
}
async function checkPalette() {
  const violations=await page.locator('body *').evaluateAll(elements=>{
    const props=['color','backgroundColor','borderTopColor','borderRightColor','borderBottomColor','borderLeftColor','outlineColor','fill','stroke','boxShadow','textShadow'];
    return elements.filter(e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().height).flatMap(e=>{
      const s=getComputedStyle(e);
      return props.filter(prop=>!['fill','stroke'].includes(prop)||e instanceof SVGElement).flatMap(prop=>[...s[prop].matchAll(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/g)].filter(m=>Number(m[4]??1)>0&&Math.max(+m[1],+m[2],+m[3])<70).map(m=>`${e.tagName}.${e.className.baseVal??e.className}: ${prop} ${m[0]}`));
    });
  });
  expect(violations, 'No black or near-black interface colors').toEqual([]);
}
try {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base);
  await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.fonts.check('16px Manrope'))).toBe(true);
  expect(await page.locator('body').evaluate(e=>getComputedStyle(e).color)).toBe('rgb(98, 97, 67)');
  await checkPalette();
  const app=page.getByTestId('device-screen');
  await app.getByRole('button',{name:'YOG',exact:true}).click();
  await app.getByRole('button',{name:'Истории',exact:true}).click();
  await expect(app.locator('.completed-projects li')).toHaveCount(3);
  for (const name of ['Шишкин пар','Nordic Spa','Kelo бани']) await expect(app.locator('.completed-projects').getByRole('heading',{name,exact:true})).toBeVisible();
  expect(await app.innerText()).not.toMatch(/Мобани|День рождения для 10|корпоратив на 30/);
  await checkPalette();
  await app.screenshot({path:'artifacts/design-yog-projects.png'});
  await app.getByRole('button',{name:'Форматы',exact:true}).click();
  await app.getByRole('button',{name:'Для бренда',exact:true}).click();
  await app.getByRole('button',{name:/PR-событие для бренда/}).click();
  await expect(app.getByText(/PR-размещения/)).toBeVisible();
  await checkPalette();
  for (const name of ['Jobs to Be Done','CJM','User Flow','Концепция','Аудит','Бизнес и рост']) {
    await page.locator('.sidebar').getByRole('button',{name:new RegExp(name)}).click();
    await checkPalette();
  }
  await page.locator('.wordmark').click();
  for (const width of [375,390,768,1024,1440]) {
    await page.setViewportSize({width,height:1000});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow at ${width}px`).toBe(true);
    await expect(app.locator('.app-bottom')).toBeVisible();
    if(width<700){
      const names=page.locator('.sidebar .side-link');
      for(const el of await names.all()) expect(await el.evaluate(e=>getComputedStyle(e).whiteSpace)).toBe('nowrap');
    }
    await checkPalette();
  }
  await page.setViewportSize({width:390,height:1000});
  await app.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(im=>im.decode())));
  await page.screenshot({path:'artifacts/design-mobile.png',fullPage:true});
  await page.setViewportSize({width:1440,height:1200});
  await page.screenshot({path:'artifacts/design-desktop.png',fullPage:true});
  const button=app.getByRole('button',{name:'Подобрать практику',exact:true});
  await page.keyboard.press('Tab');
  await button.focus();
  expect(await button.evaluate(e=>getComputedStyle(e).outlineStyle)).toBe('solid');
  expect(errors).toEqual([]);
  console.log('PASS design: Manrope, olive palette across all sections, three factual YOG projects, YOG navigation, five responsive widths, keyboard focus, no console/runtime/asset errors.');
} finally {await browser.close();}
