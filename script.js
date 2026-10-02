const $=s=>document.querySelector(s);
// theme
const root=document.documentElement;
try{const t=localStorage.getItem('theme');if(t)root.dataset.theme=t}catch(e){}
$('#theme').onclick=()=>{
  const dark=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;
  root.dataset.theme=dark?'light':'dark';
  try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}
};
$('#burger').onclick=()=>$('#links').classList.toggle('open');
$('#links').onclick=e=>{if(e.target.tagName==='A')$('#links').classList.remove('open')};

// hero code typing
const SRC={
cpp:{n:'C++',t:`<span class="k">class</span> <span class="t">Developer</span> {
  <span class="k">string</span> name  = <span class="s">"Tayyab"</span>;
  <span class="k">string</span> field = <span class="s">"CS"</span>;
  <span class="k">string</span> now   = <span class="s">"Mobile Apps"</span>;

  <span class="k">void</span> build() {
    cout &lt;&lt; <span class="s">"Hello World"</span>;
  }
};`},
dart:{n:'Dart',t:`<span class="k">class</span> <span class="t">Developer</span> {
  <span class="k">final</span> <span class="t">String</span> name  = <span class="s">'Tayyab'</span>;
  <span class="k">final</span> <span class="t">String</span> field = <span class="s">'CS'</span>;
  <span class="k">final</span> <span class="t">String</span> now   = <span class="s">'Mobile Apps'</span>;

  <span class="k">void</span> build() {
    <span class="k">print</span>(<span class="s">'Hello Flutter'</span>);
  }
}`}};
const code=$('#code');let timer;
function type(key){
  clearInterval(timer);
  const html=SRC[key].t;$('#lang').textContent=SRC[key].n;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){code.innerHTML=html;return}
  let i=0;
  timer=setInterval(()=>{
    // advance through tags atomically
    if(html[i]==='<'){i=html.indexOf('>',i)+1}else if(html[i]==='&'){i=html.indexOf(';',i)+1}else i++;
    code.innerHTML=html.slice(0,i)+'<span class="caret"></span>';
    if(i>=html.length){clearInterval(timer);code.innerHTML=html+'<span class="caret"></span>'}
  },16);
}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));
  type(b.dataset.l);
});
type('cpp');

// skills
const SK=[['C',70,'Programming Fundamentals'],['C++',65,'Basics + problem solving'],['OOP (C++)',55,'Classes, objects, inheritance'],['Dart',60,'Language for Flutter apps'],['Mobile App Dev',45,'Currently learning'],['HTML & CSS',20,'Next on my list']];
$('#sk').innerHTML=SK.map(s=>`<div class="sk"><div><h3>${s[0]}</h3><em>${s[1]}%</em></div><div class="bar"><i data-w="${s[1]}"></i></div><small>${s[2]}</small></div>`).join('');
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;io.unobserve(e.target);
  e.target.querySelectorAll('.bar i').forEach(b=>b.style.width=b.dataset.w+'%');
  e.target.querySelectorAll('[data-n]').forEach(n=>{n.textContent=n.dataset.n+(n.dataset.n==='4'?'+':'')});
}),{threshold:.25});
document.querySelectorAll('#skills,#about').forEach(s=>io.observe(s));

// active nav
const secs=[...document.querySelectorAll('section')];
const nio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('.links a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s=>nio.observe(s));

// todo demo
let todos=[{t:'Study OOP',d:1},{t:'Build UI',d:1},{t:'Push to GitHub',d:0},{t:'Revise C++',d:0}];
try{const s=JSON.parse(localStorage.getItem('todos')||'null');if(Array.isArray(s))todos=s}catch(e){}
function save(){try{localStorage.setItem('todos',JSON.stringify(todos))}catch(e){}}
function render(){
  const l=$('#list');l.innerHTML='';
  todos.forEach((x,i)=>{
    const li=document.createElement('li');if(x.d)li.className='done';
    const c=document.createElement('button');c.className='ck';c.textContent=x.d?'✓':'';c.setAttribute('aria-label','Toggle task');
    c.onclick=()=>{x.d=x.d?0:1;save();render()};
    const t=document.createElement('span');t.className='tx';t.textContent=x.t;
    const r=document.createElement('button');r.className='rm';r.textContent='×';r.setAttribute('aria-label','Remove task');
    r.onclick=()=>{todos.splice(i,1);save();render()};
    li.append(c,t,r);l.append(li);
  });
  if(!todos.length)l.innerHTML='<li style="color:var(--mute)">No tasks yet. Add one above.</li>';
  $('#cnt').textContent=todos.filter(x=>x.d).length+'/'+todos.length+' done';
}
function add(){const v=$('#in').value.trim();if(!v)return;todos.push({t:v,d:0});$('#in').value='';save();render()}
$('#addb').onclick=add;$('#in').onkeydown=e=>{if(e.key==='Enter')add()};
render();
