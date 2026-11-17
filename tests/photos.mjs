import {chromium, expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
await mkdir('artifacts/supplied-photos',{recursive:true});
const base=process.env.TEST_URL || 'http://127.0.0.1:4173';
const remote=base.startsWith('https:');
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox'],proxy:remote&&process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined});
try{
 const p=await b.newPage({viewport:{width:1440,height:1200}}), errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 if(remote)await p.route('https://**/*',async r=>r.fulfill({response:await r.fetch()}));
 await p.emulateMedia({reducedMotion:'reduce'});await p.goto(base);await p.evaluate(()=>document.fonts.ready);
 const a=p.getByTestId('device-screen');
 async function pictures(){await a.locator('img').evaluateAll(is=>Promise.all(is.map(i=>{i.loading="eager";return i.decode()})))}
 async function snap(name){await pictures();await a.screenshot({path:`artifacts/supplied-photos/${name}.png`})}
 await expect(a.locator('[data-scene="yoga"]')).toBeVisible();
 await expect(a.locator('[data-scene="yoga"] img')).toHaveAttribute('src',/yoga-pose/);
 expect(await a.locator('[data-visual="softLight"],[data-visual="oliveSurface"]').count()).toBe(0);
 await snap('01-sattva-home');
 await a.getByRole('button',{name:'Практики',exact:true}).click();
 await expect(a.locator('.media-row .row-art img').first()).toBeVisible();
 await snap('02-practice-library');
 await a.getByRole('button',{name:'Йога',exact:true}).click();
 await a.getByRole('button',{name:/Подвижность после рабочего дня/}).click();
 await a.getByRole('button',{name:'Открыть видеоурок',exact:true}).click();
 await expect(a).toHaveClass(/photo-room/);
 await expect(a.locator('.media-preview .content-photo')).toHaveAttribute('src',/yoga-pose/);
 await a.getByRole('button',{name:'Начать',exact:true}).click();
 await expect(a.getByText('Демонстрация идёт',{exact:true})).toBeVisible();
 await a.getByRole('button',{name:'Пауза',exact:true}).click();
 await snap('03-video-practice');
 await a.getByRole('button',{name:'Курсы',exact:true}).click();
 await snap('04-course-library');
 await a.getByRole('button',{name:'Онлайн',exact:true}).click();
 await a.getByRole('button',{name:/Медитация: первая неделя/}).click();
 await a.getByRole('button',{name:/01 · Опора/}).click();
 await expect(a).toHaveClass(/photo-room/);
 await expect(a.locator('.media-preview img')).toBeVisible();
 await a.getByRole('button',{name:'Начать демонстрацию урока',exact:true}).click();
 await expect(a.getByText('Демонстрация урока идёт',{exact:true})).toBeVisible();
 await snap('05-course-lesson');
 const overlays=await a.locator('.app-content,.brand-description,.media-preview > span:not(.photo-panel)').evaluateAll(es=>es.map(e=>({bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color})));
 // Conservative contrast: composite every glass surface over a completely dark backdrop.
 function luminance(rgb){return rgb.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0)}
 function rgba(s){return s.match(/[\d.]+/g).map(Number)}
 for(const overlay of overlays){const bg=rgba(overlay.bg),fg=rgba(overlay.color),alpha=bg[3]??1;const bgDark=bg.slice(0,3).map(x=>x*alpha);const l1=luminance(bgDark),l2=luminance(fg.slice(0,3));expect((Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05),'Glass text contrast against worst-case dark image').toBeGreaterThanOrEqual(4.5)}
 await a.getByRole('button',{name:'SATTVA',exact:true}).click();
 await a.getByRole('button',{name:/Моя неделя заботы/}).click();
 await expect(a.locator('.room-backdrop')).toHaveAttribute('src',/sheer-fabric/);
 await snap('08-weekly-plan');
 await a.getByRole('button',{name:'YOG',exact:true}).click();
 await expect(a.locator('[data-scene="tea"] img')).toHaveAttribute('src',/tea-pouring/);
 await snap('06-yog-home');
 await a.getByRole('button',{name:'Форматы',exact:true}).click();await a.getByRole('button',{name:'Для бренда',exact:true}).click();await a.getByRole('button',{name:/PR-событие для бренда/}).click();
 await expect(a.locator('[data-visual="bowl"] img')).toBeVisible();await snap('07-yog-format');
 await a.getByRole('button',{name:'Истории',exact:true}).click();await expect(a.locator('.completed-projects li')).toHaveCount(3);
 for(const width of [375,390,768,1024,1440]){await p.setViewportSize({width,height:1000});expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(a.locator('.app-bottom')).toBeVisible()}
 expect(errors).toEqual([]);
 console.log('PASS original photos: SATTVA/YOG covers, catalog thumbnails, photo-backed video and lesson controls, glass contrast >=4.5:1, three YOG projects, five responsive widths, no console/runtime/asset errors.');
}finally{await b.close()}
