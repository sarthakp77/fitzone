document.addEventListener('DOMContentLoaded',()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
/* dark/light mode */
const root=document.documentElement,tb=$('.theme-btn');
let saved='dark';try{saved=localStorage.getItem('fz-theme')||'dark'}catch(e){}
const setTheme=t=>{root.setAttribute('data-theme',t);tb.textContent=t==='dark'?'☀️ Light':'🌙 Dark';try{localStorage.setItem('fz-theme',t)}catch(e){}};
setTheme(saved);tb.addEventListener('click',()=>setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'));
/* hamburger */
const hb=$('.hamburger'),links=$('.nav-links');
hb.addEventListener('click',()=>{const o=links.classList.toggle('open');hb.classList.toggle('open',o);hb.setAttribute('aria-expanded',o)});
$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');hb.classList.remove('open')}));
/* smooth scroll for in-page anchors */
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}}));
/* scroll-to-top */
const up=document.createElement('button');up.id='toTop';up.textContent='↑';up.setAttribute('aria-label','Scroll to top');document.body.append(up);
up.onclick=()=>scrollTo({top:0,behavior:'smooth'});
addEventListener('scroll',()=>up.classList.toggle('show',scrollY>400));
/* ripple click animation */
document.addEventListener('click',e=>{const b=e.target.closest('.btn,.filter');if(!b||b.classList.contains('filter'))return;
const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height),d=document.createElement('span');d.className='ripple';
d.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;b.append(d);setTimeout(()=>d.remove(),600)});
/* scroll reveal */
const io=new IntersectionObserver(en=>en.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});
$$('.reveal').forEach(el=>io.observe(el));
/* animated counters */
const co=new IntersectionObserver(en=>en.forEach(x=>{if(!x.isIntersecting)return;co.unobserve(x.target);
const el=x.target,end=+el.dataset.count,suf=el.dataset.suffix||'',t0=performance.now();
const tick=n=>{const p=Math.min((n-t0)/1800,1);el.textContent=Math.floor(end*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}),{threshold:.6});
$$('[data-count]').forEach(el=>co.observe(el));
/* shared modal */
const ov=document.createElement('div');ov.className='overlay';ov.innerHTML='<div class="modal" role="dialog" aria-modal="true"></div>';document.body.append(ov);
const modal=$('.modal',ov),closeM=()=>ov.classList.remove('show');
const openM=html=>{modal.innerHTML=html+'<button class="btn sm" id="mClose">Close</button>';ov.classList.add('show');$('#mClose').onclick=closeM;$('#mClose').focus()};
ov.addEventListener('click',e=>{if(e.target===ov)closeM()});addEventListener('keydown',e=>{if(e.key==='Escape')closeM()});
/* workout modal + filter */
$$('[data-workout]').forEach(b=>b.addEventListener('click',()=>{const d=b.closest('[data-name]').dataset;
openM(`<h3>${d.name}</h3><div class="meta"><span class="tag hot">⏱ ${d.duration}</span><span class="tag">${d.level}</span></div><h4 style="margin-top:16px">Exercises</h4><ul>${d.exercises.split('|').map(x=>`<li>${x}</li>`).join('')}</ul>`)}));
$$('.filter').forEach(f=>f.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));f.classList.add('active');
$$('.w-card').forEach(c=>{const show=f.dataset.filter==='all'||c.dataset.cat.split(' ').includes(f.dataset.filter);
if(show){c.classList.remove('gone');requestAnimationFrame(()=>requestAnimationFrame(()=>c.classList.remove('hide')))}
else{c.classList.add('hide');setTimeout(()=>{if(c.classList.contains('hide'))c.classList.add('gone')},350)}})}));
/* plan modal */
$$('[data-plan]').forEach(b=>b.addEventListener('click',()=>openM(`<h3>🎉 ${b.dataset.plan} selected</h3><p style="margin:10px 0 20px;color:var(--muted-color)">Great choice! Your fitness journey starts today.</p>`)));
/* current day */
const day=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
$$('#schedule tr[data-day]').forEach(r=>{if(r.dataset.day===day){r.classList.add('today');r.lastElementChild.textContent+=' (Today)'}});
/* BMI */
const bf=$('#bmiForm');if(bf)bf.addEventListener('submit',e=>{e.preventDefault();
const h=parseFloat($('#height').value)/100,w=parseFloat($('#weight').value),out=$('#bmiResult');
if(!(h>0.5&&h<2.8&&w>10&&w<500)){out.innerHTML='<span style="color:#ff6b6b">Please enter a valid height (cm) and weight (kg).</span>';out.classList.add('show');return}
const b=w/(h*h),c=b<18.5?'Underweight':b<25?'Normal Weight':b<30?'Overweight':'Obese';
out.innerHTML=`<b>${b.toFixed(1)}</b><p>Category: <strong>${c}</strong></p>`;out.classList.add('show')});
/* contact validation */
const cf=$('#contactForm');if(cf){const setErr=(id,m)=>{const f=$('#'+id).closest('.field');f.classList.toggle('err',!!m);f.querySelector('.error').textContent=m||''};
cf.addEventListener('submit',e=>{e.preventDefault();let ok=true;
const n=$('#name').value.trim(),em=$('#email').value.trim(),m=$('#message').value.trim();
const chk=(id,bad,msg)=>{setErr(id,bad?msg:'');if(bad)ok=false};
chk('name',!n,'Please enter your full name.');chk('email',!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em),'Please enter a valid email address.');chk('message',!m,'Please write a message.');
$('#success').classList.toggle('show',ok);if(ok)cf.reset()});
$$('#contactForm input,#contactForm textarea').forEach(i=>i.addEventListener('input',()=>setErr(i.id,'')))}
/* FAQ accordion */
$$('.faq-q').forEach(q=>q.addEventListener('click',()=>{const it=q.parentElement,a=$('.faq-a',it),open=it.classList.contains('open');
$$('.faq-item').forEach(x=>{x.classList.remove('open');$('.faq-a',x).style.maxHeight=0});
if(!open){it.classList.add('open');a.style.maxHeight=a.scrollHeight+'px'}}));
});
