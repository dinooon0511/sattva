import{readFileSync,writeFileSync,mkdirSync}from'node:fs';
let html=readFileSync('dist/index.html','utf8');
const js=html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/)[1];
const css=html.match(/<link[^>]*href="([^"]+\.css)"[^>]*>/)[1];
const art='data:image/png;base64,'+readFileSync('dist/contour.png').toString('base64');
let code=readFileSync('dist/'+js.replace(/^\.\//,''),'utf8').replaceAll('./contour.png',art).replaceAll('</script','<\\/script');
html=html.replace(/<script[^>]*src="[^"]+"[^>]*><\/script>/,()=>`<script type="module">${code}</script>`).replace(/<link[^>]*href="[^"]+\.css"[^>]*>/,()=>`<style>${readFileSync('dist/'+css.replace(/^\.\//,''),'utf8')}</style>`).replace('./favicon.svg','data:image/svg+xml;base64,'+readFileSync('dist/favicon.svg').toString('base64'));
mkdirSync('artifacts',{recursive:true});writeFileSync('artifacts/sattva-prototype.html',html);console.log('artifacts/sattva-prototype.html');
