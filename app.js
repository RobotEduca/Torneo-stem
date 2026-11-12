(()=>{
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

// Menú móvil
const burger=$('#burger'), menu=$('#menu');
burger.addEventListener('click',()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
menu.addEventListener('click',e=>{if(e.target.tagName==='A'){menu.classList.remove('open');burger.setAttribute('aria-expanded',false)}});

// Resaltar sección activa
const links=$$('#menu a');
const secObs=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>secObs.observe(s));

// Aparición al desplazar
const revObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revObs.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>revObs.observe(el));

// Contadores
const cObs=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return; const el=e.target, n=+el.dataset.count; let i=0;
  const t=setInterval(()=>{i+=Math.ceil(n/25);if(i>=n){i=n;clearInterval(t)}el.textContent=i},40);
  cObs.unobserve(el);
}));
$$('[data-count]').forEach(el=>cObs.observe(el));

// Galería
const photos=['g01.jpg','g02.jpg','g03.jpg','g04.jpg','g05.jpg','g06.jpg','g07.jpg','g08.webp','g09.webp','g10.webp','g11.webp'].map(f=>'img/'+f);
const alts=['Pareja resolviendo el examen STEAM','Equipo de tres estudiantes trabajando juntas','Equipo analizando el examen','Equipo resolviendo el reto','Estudiantes revisando una prueba','Docentes y equipos con robot','Equipo debatiendo una respuesta','Equipo programando en portátil','Aula con equipos trabajando','Estudiantes en el reto','Videojuego proyectado en pantalla'];
const g=$('#gallery');
photos.forEach((p,i)=>{const im=new Image();im.src=p;im.alt=alts[i];im.loading='lazy';im.dataset.i=i;g.appendChild(im)});

// Lightbox (galería + imágenes con data-zoom)
const lb=$('#lb'), lbImg=$('#lbImg'); let cur=0, list=photos;
const show=i=>{cur=(i+list.length)%list.length;lbImg.src=list[cur]};
const openLb=(l,i)=>{list=l;show(i);lb.classList.add('open');document.body.style.overflow='hidden'};
const closeLb=()=>{lb.classList.remove('open');document.body.style.overflow=''};
g.addEventListener('click',e=>{if(e.target.tagName==='IMG')openLb(photos,+e.target.dataset.i)});
$$('[data-zoom]').forEach(im=>im.addEventListener('click',()=>openLb([im.getAttribute('src')],0)));
$('#lbClose').onclick=closeLb;
$('#lbPrev').onclick=e=>{e.stopPropagation();show(cur-1)};
$('#lbNext').onclick=e=>{e.stopPropagation();show(cur+1)};
lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});
let sx=0;lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))});

// Juegos
const modal=$('#gameModal'), frame=$('#gameFrame');
$$('.play').forEach(b=>b.addEventListener('click',()=>{
  $('#gameTitle').textContent=b.dataset.title;$('#gameOpen').href=b.dataset.src;
  frame.src=b.dataset.src;modal.classList.add('open');document.body.style.overflow='hidden';
}));
const closeGame=()=>{modal.classList.remove('open');frame.src='about:blank';document.body.style.overflow=''};
$('#gameClose').onclick=closeGame;

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeLb();if(modal.classList.contains('open'))closeGame()}
  if(lb.classList.contains('open')&&list.length>1){if(e.key==='ArrowRight')show(cur+1);if(e.key==='ArrowLeft')show(cur-1)}
});
})();
