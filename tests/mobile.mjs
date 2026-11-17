import {chromium, expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
await mkdir('artifacts/mobile-app',{recursive:true});
const base=process.env.TEST_URL||'http://127.0.0.1:4174/';
const url=new URL('app.html',base).href;
const remote=url.startsWith('https:');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox'],proxy:remote&&process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 if(remote)await page.route('https://**/*',async r=>r.fulfill({response:await r.fetch()}));
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);await page.evaluate(()=>document.fonts.ready);
 const app=page.getByTestId('device-screen');
 await expect(app.getByRole('heading',{name:'Вернуться к себе'})).toBeVisible();
 await expect(page.locator('.sidebar,.guide,.workspace-header,.page-heading,.preview-label,.workspace-footer')).toHaveCount(0);
 async function fit(width,height){await page.setViewportSize({width,height});const box=await app.boundingBox();expect(box.x).toBe(0);expect(box.y).toBe(0);expect(box.width).toBe(width);expect(box.height).toBe(height);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight)).toBe(true);const nav=await app.locator('.app-bottom').boundingBox();expect(nav.y+nav.height).toBeLessThanOrEqual(height+1);await expect(app.locator('.app-bottom')).toBeVisible()}
 await fit(390,844);await app.locator('img').evaluateAll(is=>Promise.all(is.map(i=>i.decode())));await page.screenshot({path:'artifacts/mobile-app/01-home.png'});
 await app.getByRole('button',{name:'Практики',exact:true}).tap();await app.getByRole('button',{name:'Йога',exact:true}).tap();await app.getByRole('button',{name:/Подвижность после рабочего дня/}).tap();await app.getByRole('button',{name:'Открыть видеоурок',exact:true}).tap();await expect(app).toHaveClass(/photo-room/);await app.getByRole('button',{name:'Начать',exact:true}).tap();await expect(app.getByText('Демонстрация идёт',{exact:true})).toBeVisible();await page.screenshot({path:'artifacts/mobile-app/02-video.png'});
 await app.getByRole('button',{name:'Главная',exact:true}).tap();await app.getByRole('button',{name:/Тишина внутри/}).tap();await app.getByRole('button',{name:'Сохранить на потом',exact:true}).tap();await page.reload();await app.getByRole('button',{name:'Моё',exact:true}).tap();await app.getByRole('button',{name:/Избранное/}).tap();await expect(app.getByRole('button',{name:/Тишина внутри/})).toBeVisible();
 await app.locator('.app-bottom').getByRole('button',{name:'Курсы',exact:true}).tap();await app.getByRole('button',{name:'Онлайн',exact:true}).tap();await app.getByRole('button',{name:/Медитация: первая неделя/}).tap();await app.getByRole('button',{name:/01 · Опора/}).tap();await expect(app.locator('.media-preview .content-photo')).toBeVisible();
 await app.getByRole('button',{name:'YOG',exact:true}).tap();await app.getByRole('button',{name:'Истории',exact:true}).tap();await expect(app.locator('.completed-projects li')).toHaveCount(3);
 for(const [width,height]of[[375,667],[390,844],[844,390],[768,1024]])await fit(width,height);
 await page.goto(url+'#flows');await page.reload();await expect(page.locator('.sidebar,.full-document,.guide')).toHaveCount(0);await expect(app.getByRole('heading',{name:'Вернуться к себе'})).toBeVisible();
 await page.goto(base);await expect(page.locator('.sidebar')).toBeVisible();await expect(page.getByRole('link',{name:'Только приложение'})).toHaveAttribute('href','./app.html');
 expect(errors).toEqual([]);console.log('PASS mobile-only page: full viewport, no workspace UI, touch navigation, video and lessons, favorites persist after reload, YOG projects, portrait/landscape/tablet, main workspace preserved; no console/runtime/asset errors.');
}finally{await browser.close()}
