(function(){
var d=document.documentElement,KEY='ar-theme',mq=window.matchMedia?matchMedia('(prefers-color-scheme: light)'):null;
function saved(){try{var t=localStorage.getItem(KEY);return t==='light'||t==='dark'?t:null}catch(e){return null}}
function sys(){return mq&&mq.matches?'light':'dark'}
function apply(t){d.setAttribute('data-theme',t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='light'?'#F4F5F9':'#07081A');sync()}
function sync(){var b=document.querySelector('.pf-theme');if(!b)return;var fr=(document.querySelector('.pf-page')||d).getAttribute('lang')==='fr',light=d.getAttribute('data-theme')==='light';
b.setAttribute('aria-label',light?(fr?'Passer au thème sombre':'Switch to dark theme'):(fr?'Passer au thème clair':'Switch to light theme'));b.setAttribute('aria-pressed',light?'true':'false')}
apply(saved()||sys());
if(mq&&mq.addEventListener)mq.addEventListener('change',function(){if(!saved())apply(sys())});
function init(){var tools=document.querySelector('.pf-tools');if(!tools||document.querySelector('.pf-theme'))return;
var b=document.createElement('button');b.type='button';b.className='pf-theme';
b.innerHTML='<svg class="pf-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg><svg class="pf-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
tools.insertBefore(b,tools.firstChild);
b.addEventListener('click',function(){var t=d.getAttribute('data-theme')==='light'?'dark':'light';try{localStorage.setItem(KEY,t)}catch(e){}apply(t)});sync()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
(function(){
function init(){
var d=document,p=d.querySelector('.pf-page');if(!p)return;
var lang=p.getAttribute('lang');if(lang)d.documentElement.setAttribute('lang',lang);
p.classList.remove('pf-nojs');
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var h=d.querySelector('.pf-hdr');
function sc(){h&&h.classList.toggle('is-scrolled',window.scrollY>8)}
addEventListener('scroll',sc,{passive:true});sc();
/* burger button (built here so the markup stays simple in Webflow) */
var slot=d.querySelector('.pf-burger-slot'),m=d.getElementById('pf-mm');
if(slot&&m){
var b=d.createElement('button');b.type='button';b.className='pf-burger';
b.setAttribute('aria-controls','pf-mm');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label',slot.getAttribute('data-open'));
b.innerHTML='<span aria-hidden="true"></span>';slot.replaceWith(b);
function setOpen(o){m.classList.toggle('is-open',o);b.setAttribute('aria-expanded',o?'true':'false');
b.setAttribute('aria-label',o?slot.getAttribute('data-close'):slot.getAttribute('data-open'));d.documentElement.style.overflow=o?'hidden':''}
b.addEventListener('click',function(){setOpen(!m.classList.contains('is-open'))});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('is-open')){setOpen(false);b.focus()}});
m.addEventListener('click',function(e){if(e.target.closest('a'))setOpen(false)});
addEventListener('resize',function(){if(innerWidth>=1080&&m.classList.contains('is-open'))setOpen(false)});
}
/* copy email buttons */
d.querySelectorAll('.pf-copy-slot').forEach(function(s){
var c=d.createElement('button');c.type='button';c.className='pf-copy';c.textContent=s.getAttribute('data-label');
var t=s.getAttribute('data-copy'),done=s.getAttribute('data-done'),lab=s.getAttribute('data-label');
var live=d.createElement('span');live.className='pf-sr';live.setAttribute('aria-live','polite');
c.addEventListener('click',function(){
function ok(){c.textContent=done;live.textContent=done;setTimeout(function(){c.textContent=lab;live.textContent=''},1800)}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,function(){location.href='mailto:'+t})}else{location.href='mailto:'+t}});
s.replaceWith(c);c.after(live)});
/* scroll reveals */
var els=d.querySelectorAll('.pf-rv');
if(rm||!('IntersectionObserver'in window)){els.forEach(function(e){e.classList.add('is-in')})}else{
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.06});
els.forEach(function(e,i){var r=e.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){e.classList.add('is-in');return}e.style.transitionDelay=(i%3)*.07+'s';io.observe(e)});
if(!rm)d.querySelectorAll('.pf-marq').forEach(function(q){new IntersectionObserver(function(es){q.classList.toggle('is-on',es[0].isIntersecting)}).observe(q)})}
/* gallery lightbox */
var last=null;
d.querySelectorAll('.pf-gal-a').forEach(function(a){a.addEventListener('click',function(ev){
ev.preventDefault();last=a;var lb=d.createElement('div');lb.className='pf-lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');
var t=a.getAttribute('data-lb')||'';lb.setAttribute('aria-label',t);
var close=lang==='fr'?'Fermer':'Close';
lb.innerHTML='<button type="button">'+close+'</button><img alt=""><p></p>';
lb.querySelector('img').src=a.getAttribute('href');lb.querySelector('img').alt=t;lb.querySelector('p').textContent=t;
d.body.appendChild(lb);d.documentElement.style.overflow='hidden';
requestAnimationFrame(function(){lb.classList.add('is-open')});
var btn=lb.querySelector('button');btn.focus();
function shut(){lb.remove();d.documentElement.style.overflow='';last&&last.focus();d.removeEventListener('keydown',key)}
function key(e){if(e.key==='Escape')shut();if(e.key==='Tab'){e.preventDefault();btn.focus()}}
btn.addEventListener('click',shut);lb.addEventListener('click',function(e){if(e.target===lb)shut()});d.addEventListener('keydown',key);
})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

(function(){function init(){var form=document.querySelector('[data-contact-form]');if(!form||!window.fetch)return;
var fr=(document.querySelector('.pf-page')||document.documentElement).getAttribute('lang')==='fr';
var T=fr?{sending:'Envoi\u2026',sent:'Message envoy\u00e9. Merci, je vous r\u00e9ponds rapidement.',error:'Le message n\u2019a pas pu \u00eatre envoy\u00e9. \u00c9crivez-moi directement : ammar.rajabi.web@gmail.com'}
:{sending:'Sending\u2026',sent:'Message sent. Thank you, I will reply soon.',error:'The message could not be sent. Please email me directly: ammar.rajabi.web@gmail.com'};
var status=form.querySelector('[data-form-status]');
form.addEventListener('submit',function(e){e.preventDefault();status.textContent='';status.classList.remove('is-ok');if(!form.reportValidity())return;
var btn=form.querySelector('button[type="submit"]'),label=btn.textContent;btn.disabled=true;btn.textContent=T.sending;
fetch(form.action,{method:'POST',body:new FormData(form),headers:{'X-Requested-With':'XMLHttpRequest'}})
.then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d}})})
.then(function(res){if(!res.ok||!res.d.success)throw new Error('send');status.textContent=T.sent;status.classList.add('is-ok');form.reset()})
.catch(function(){status.textContent=T.error})
.then(function(){btn.disabled=false;btn.textContent=label})})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();
(function(){function init(){if(document.querySelector('.pf-top'))return;var page=document.querySelector('.pf-page');if(!page)return;
var fr=page.getAttribute('lang')==='fr',rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var b=document.createElement('button');b.type='button';b.className='pf-top';b.setAttribute('aria-label',fr?'Retour en haut':'Back to top');
b.innerHTML='<svg class="pf-top-r" viewBox="0 0 52 52" aria-hidden="true"><circle class="pf-top-bg" cx="26" cy="26" r="24"/><circle class="pf-top-fg" cx="26" cy="26" r="24"/></svg><svg class="pf-top-a" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
document.body.appendChild(b);var fg=b.querySelector('.pf-top-fg'),ticking=false;
function upd(){ticking=false;var h=document.documentElement.scrollHeight-innerHeight,y=window.scrollY,p=h>0?Math.min(1,y/h):0;
b.classList.toggle('is-on',y>600);fg.style.strokeDashoffset=(150.8*(1-p)).toFixed(1)}
addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd)}},{passive:true});upd();
b.addEventListener('click',function(){window.scrollTo({top:0,behavior:rm?'auto':'smooth'});var t=document.querySelector('.pf-brand');if(t)t.focus({preventScroll:true})})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();
(function(){function init(){var d=document,page=d.querySelector('.pf-page');if(!page)return;
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches&&innerWidth>=1024;
/* scroll progress bar */
if(!rm&&!d.querySelector('.pf-prog')){var bar=d.createElement('div');bar.className='pf-prog';bar.setAttribute('aria-hidden','true');d.body.appendChild(bar);var tk=false;
function up(){tk=false;var h=d.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0).toFixed(4)+')'}
addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(up)}},{passive:true});up()}
var hasIO='IntersectionObserver'in window;
/* count-up numbers */
if(!rm&&hasIO){var nums=d.querySelectorAll('.pf-stat strong,.pf-badge strong,.pf-score strong');
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);run(e.target)})},{threshold:.4});
nums.forEach(function(el){var txt=el.textContent,m=txt.match(/^(\D*)(\d[\d\s,.  ]*\d|\d)(.*)$/);if(!m)return;
var raw=m[2],sep=(raw.match(/[\s,.  ]/)||[''])[0],target=parseInt(raw.replace(/\D/g,''),10);if(!target||target<5)return;
var sr=d.createElement('span');sr.className='pf-sr';sr.textContent=txt;var v=d.createElement('span');v.setAttribute('aria-hidden','true');v.className='pf-cnt-v';
el.textContent='';el.appendChild(sr);el.appendChild(v);el._c={pre:m[1],post:m[3],sep:sep,t:target,v:v};paint(el,0);cio.observe(el)});
function fmt(n,s){var x=String(n);if(!s)return x;return x.replace(/\B(?=(\d{3})+(?!\d))/g,s)}
function paint(el,n){var c=el._c;c.v.textContent=c.pre+fmt(n,c.sep)+c.post}
function run(el){var c=el._c,t0=null,dur=1300;function f(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-p,3);paint(el,Math.round(c.t*e));if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}}
/* image clip reveal */
if(!rm&&hasIO){var wr=d.querySelectorAll('.pf-cover,.pf-fig,.pf-proj-img,.pf-studio-img,.pf-gal-a,.pf-portrait');
var rio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-shown');rio.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.05});
wr.forEach(function(w){var r=w.getBoundingClientRect();if(r.top<innerHeight*.92)return;w.classList.add('pf-clip');rio.observe(w)})}
/* desktop pointer effects */
if(!rm&&fine){page.classList.add('pf-fx');
d.querySelectorAll('.pf-proj,.pf-step,.pf-card,.pf-q,.pf-tl li,.pf-ol li').forEach(function(el){el.classList.add('pf-spot');var raf=0,ev=null;
el.addEventListener('pointermove',function(e){ev=e;if(raf)return;raf=requestAnimationFrame(function(){raf=0;var r=el.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width,y=(ev.clientY-r.top)/r.height;
el.style.setProperty('--mx',(x*100).toFixed(1)+'%');el.style.setProperty('--my',(y*100).toFixed(1)+'%');
var im=el.querySelector('.pf-proj-img');if(im){im.style.setProperty('--ry',((x-.5)*7).toFixed(2)+'deg');im.style.setProperty('--rx',((.5-y)*6).toFixed(2)+'deg')}})});
el.addEventListener('pointerleave',function(){var im=el.querySelector('.pf-proj-img');if(im){im.style.setProperty('--rx','0deg');im.style.setProperty('--ry','0deg')}})});
var hero=d.querySelector('.pf-hero'),scr=d.querySelector('.pf-screens');
if(hero&&scr){var rq=0,pe=null;addEventListener('pointermove',function(e){pe=e;if(rq||scrollY>innerHeight)return;rq=requestAnimationFrame(function(){rq=0;
scr.style.setProperty('--px',((pe.clientX/innerWidth-.5)*-18).toFixed(1)+'px');scr.style.setProperty('--py',((pe.clientY/innerHeight-.5)*-12).toFixed(1)+'px')})},{passive:true})}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();
(function(){function init(){var d=document,rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,hasIO='IntersectionObserver'in window;
/* gauges */
var gs=d.querySelectorAll('.pf-gauge');
gs.forEach(function(g){var v=+g.getAttribute('data-v')||0;if(rm||!hasIO){g.style.setProperty('--p',v);return}g.style.setProperty('--p',0);
var io=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;io.disconnect();var t0=null;
function f(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/1300),e=1-Math.pow(1-p,3);g.style.setProperty('--p',(v*e).toFixed(1));if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)},{threshold:.4});io.observe(g)});
/* before / after */
d.querySelectorAll('.pf-cmp').forEach(function(c){var slot=c.querySelector('.pf-cmp-slot');var r=d.createElement('input');r.type='range';r.min=0;r.max=100;r.value=50;r.className='pf-cmp-range';
r.setAttribute('aria-label',slot?slot.getAttribute('data-label'):'Compare');if(slot)slot.replaceWith(r);else c.appendChild(r);
function set(v){c.style.setProperty('--pos',v+'%');r.setAttribute('aria-valuetext',Math.round(v)+'%')}
r.addEventListener('input',function(){set(r.value)});set(50);
if(!rm&&hasIO){var io=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;io.disconnect();var t0=null,user=false;r.addEventListener('pointerdown',function(){user=true});r.addEventListener('keydown',function(){user=true});
function f(ts){if(user)return;if(!t0)t0=ts;var t=(ts-t0)/1800;if(t>=1){set(50);return}var v=50+Math.sin(t*Math.PI*2)*(1-t)*22;set(v.toFixed(1));requestAnimationFrame(f)}setTimeout(function(){requestAnimationFrame(f)},400)},{threshold:.5});io.observe(c)}});
/* vertical timeline */
var tl=d.querySelector('.pf-tl-v');if(tl){var lis=tl.querySelectorAll('li');
if(rm){tl.style.setProperty('--tl',1);lis.forEach(function(l){l.classList.add('is-past')})}else{var tk=false;
function up(){tk=false;var r=tl.getBoundingClientRect(),m=innerHeight*.62,p=(m-r.top)/r.height;p=Math.max(0,Math.min(1,p));tl.style.setProperty('--tl',p.toFixed(3));
lis.forEach(function(l){l.classList.toggle('is-past',l.getBoundingClientRect().top+30<m)})}
addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(up)}},{passive:true});addEventListener('resize',up);up()}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();
