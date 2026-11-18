// 保留原始粉色粒子爱心背景
(() => {
  const canvas=document.getElementById('pinkboard'); if(!canvas)return;
  const ctx=canvas.getContext('2d'); let w=0,h=0,particles=[],last=0;
  const heartPoint=t=>({x:160*Math.pow(Math.sin(t),3),y:130*Math.cos(t)-50*Math.cos(2*t)-20*Math.cos(3*t)-10*Math.cos(4*t)+25});
  function resize(){const dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  function add(){const p=heartPoint(Math.PI-Math.random()*Math.PI*2),s=Math.min(w,h)*.00165;particles.push({x:w/2+p.x*s,y:h/2-p.y*s,vx:p.x*.42,vy:-p.y*.42,age:0,size:Math.random()*2.5+1.3,life:1.6+Math.random()*.7})}
  function draw(now){const dt=Math.min((now-last)/1000||.016,.04);last=now;ctx.clearRect(0,0,w,h);if(particles.length<330)for(let i=0;i<7;i++)add();particles.forEach(p=>{p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.988;p.vy*=.988;const a=Math.max(0,1-p.age/p.life);ctx.globalAlpha=a*.85;ctx.fillStyle='#f3a2c3';ctx.shadowColor='#ff85b8';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(p.x,p.y,p.size*a,0,Math.PI*2);ctx.fill()});ctx.globalAlpha=1;ctx.shadowBlur=0;particles=particles.filter(p=>p.age<p.life);requestAnimationFrame(draw)}
  addEventListener('resize',resize);resize();requestAnimationFrame(draw);
})();

// 翻页、第二页双侧烟花、最后一页点击爱心
(() => {
 const pages=[...document.querySelectorAll('.page')],dots=[...document.querySelectorAll('.dot')],canvas=document.getElementById('fireworks');if(!pages.length||!canvas)return;
 const ctx=canvas.getContext('2d');let current=0,particles=[],raf=0;
 function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0)}addEventListener('resize',resize);resize();
 function showPage(n){n=Math.max(0,Math.min(pages.length-1,n));if(n===current)return;current=n;pages.forEach((p,i)=>{p.classList.toggle('active',i===n);p.setAttribute('aria-hidden',i===n?'false':'true')});dots.forEach((d,i)=>d.classList.toggle('current',i===n));if(n===1)fireworks()}
 document.querySelectorAll('.next-btn').forEach(b=>b.addEventListener('click',()=>showPage(current+1)));document.querySelectorAll('.prev-btn').forEach(b=>b.addEventListener('click',()=>showPage(current-1)));dots.forEach(d=>d.addEventListener('click',()=>showPage(+d.dataset.to)));document.querySelector('.restart-btn')?.addEventListener('click',()=>showPage(0));
 const palette=['#ffe4ad','#ff91bd','#fff5dc','#e8b8ff','#fff'];
 function burst(x,y,count=85){for(let i=0;i<count;i++){const a=Math.PI*2*i/count+(Math.random()-.5)*.12,s=1.2+Math.random()*4.1;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,age:0,life:75+Math.random()*50,r:1+Math.random()*2,color:palette[Math.random()*palette.length|0],gravity:.02,kind:'spark'})}}
 function fireworks(){const y=innerHeight*.34;[innerWidth*.09,innerWidth*.91].forEach((x,i)=>{burst(x,y);burst(i?x-30:x+30,y+innerHeight*.16,58)});if(!raf)raf=requestAnimationFrame(animate)}
 function animate(){ctx.clearRect(0,0,innerWidth,innerHeight);particles.forEach(p=>{p.age++;p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=.992;p.vy*=.992;const a=Math.max(0,1-p.age/p.life);ctx.globalAlpha=a;ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=p.kind==='heart'?10:13;if(p.kind==='heart'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.scale(p.size/18,p.size/18);ctx.beginPath();ctx.moveTo(0,6);ctx.bezierCurveTo(-18,-5,-9,-17,0,-8);ctx.bezierCurveTo(9,-17,18,-5,0,6);ctx.fill();ctx.restore();p.rotation+=p.spin}else{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}});ctx.globalAlpha=1;ctx.shadowBlur=0;particles=particles.filter(p=>p.age<p.life&&p.y<innerHeight+50);if(particles.length)raf=requestAnimationFrame(animate);else{ctx.clearRect(0,0,innerWidth,innerHeight);raf=0}}
 const heart=document.getElementById('heartSurprise');heart?.addEventListener('click',()=>{const r=heart.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,colors=['#f06f9f','#ff9fc4','#d98ab7','#f5c0d7','#fff','#c58be8'];for(let i=0;i<190;i++){const t=Math.random()*Math.PI*2,px=16*Math.pow(Math.sin(t),3),py=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)),a=Math.atan2(py,px)+(Math.random()-.5)*.7,s=1.4+Math.random()*6.2;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1.4,age:0,life:100+Math.random()*95,size:5+Math.random()*10,color:colors[Math.random()*colors.length|0],gravity:.035+Math.random()*.025,kind:'heart',rotation:Math.random()*6,spin:(Math.random()-.5)*.12})}heart.classList.add('is-loved');setTimeout(()=>heart.classList.remove('is-loved'),900);if(!raf)raf=requestAnimationFrame(animate)});
 let startX=0;const book=document.getElementById('book');book?.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true});book?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>65&&!e.target.closest('button'))showPage(current+(dx<0?1:-1))},{passive:true});
})();
