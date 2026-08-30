const STORE_KEY='l2k_store_v1';
const defaults={
  brand:'L2K TOP UP STORE',
  whatsapp:'+94 77 123 4567',
  services:[
    {id:'topup',icon:'🎮',title:'Game TopUp',desc:'Instant in-game currency delivered directly to your account at unbeatable prices.',button:'SHOP NOW'},
    {id:'cards',icon:'🎁',title:'Cards',desc:'Garena Shells, Riot Recharge Codes & premium gift cards for gamers.',button:'SHOP NOW'},
    {id:'posts',icon:'🎨',title:'Post Designs',desc:'Custom posts & logos created for your gaming brand identity.',button:'CREATE NOW'},
    {id:'other',icon:'⚡',title:'Other Services',desc:'Explore our growing portfolio of premium digital services.',button:'VIEW MORE'}
  ],
  products:[
    {id:'ff100',name:'Free Fire 100 Diamonds',price:290,cat:'Game TopUp'},
    {id:'ff310',name:'Free Fire 310 Diamonds',price:790,cat:'Game TopUp'},
    {id:'ff520',name:'Free Fire 520 Diamonds',price:1290,cat:'Game TopUp'},
    {id:'ff1060',name:'Free Fire 1060 Diamonds',price:2490,cat:'Game TopUp'},
    {id:'gc',name:'Garena Shells',price:500,cat:'Cards'},
    {id:'design',name:'Gaming Post Design',price:500,cat:'Post Designs'}
  ],
  posts:[
    {title:'Fast & Trusted Game TopUps',text:'Get your diamonds quickly with L2K TOP UP STORE. Simple ordering and friendly support.'},
    {title:'New Services Are Here',text:'We are adding more digital services and gaming products every month.'},
    {title:'Need a Custom Gaming Design?',text:'Send your idea and let our design team create a clean post for your page.'}
  ]
};
function data(){
  try{return {...defaults,...JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}}
  catch(e){return defaults}
}
function save(d){localStorage.setItem(STORE_KEY,JSON.stringify(d))}
function money(n){return 'LKR '+Number(n).toLocaleString('en-LK')}
function toast(msg){
  let t=document.querySelector('.toast'); if(!t)return;
  t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)
}
function renderServices(){
  const el=document.querySelector('#serviceGrid');if(!el)return;
  el.innerHTML=data().services.map(s=>`<article class="card service-card">
    <div class="service-icon">${s.icon}</div><h3>${s.title}</h3><p>${s.desc}</p>
    <button class="btn btn-primary" onclick="serviceAction('${s.id}')">${s.button} →</button></article>`).join('')
}
function serviceAction(id){
  if(id==='topup'||id==='cards'){location.href='topup.html?cat='+encodeURIComponent(id==='cards'?'Cards':'Game TopUp')}
  else if(id==='posts'){location.href='designs.html'}
  else{location.href='services.html'}
}
function renderProducts(filter=''){
  const el=document.querySelector('#products');if(!el)return;
  const ps=data().products.filter(p=>!filter||p.cat===filter);
  el.innerHTML=ps.map(p=>`<article class="card product-card">
    <span class="badge">${p.cat}</span><h3 style="margin-top:12px">${p.name}</h3>
    <div class="price">${money(p.price)}</div><p>Fast delivery • Trusted service • Sri Lanka</p>
    <button class="btn btn-primary" onclick="openOrder('${p.id}')">ORDER NOW →</button>
  </article>`).join('') || '<div class="card">No products found.</div>'
}
function openOrder(id){
  const p=data().products.find(x=>x.id===id);if(!p)return;
  document.querySelector('#orderProduct').value=p.name;
  document.querySelector('#orderPrice').textContent=money(p.price);
  document.querySelector('#orderModal').classList.add('open');
}
function closeModal(){document.querySelector('#orderModal')?.classList.remove('open')}
function submitOrder(e){
  e.preventDefault();
  const f=new FormData(e.target);
  const msg=`L2K TOP UP STORE ORDER%0A%0AProduct: ${encodeURIComponent(f.get('product'))}%0AUID / Account: ${encodeURIComponent(f.get('uid'))}%0APayment: ${encodeURIComponent(f.get('payment'))}%0AName: ${encodeURIComponent(f.get('name'))}`;
  const wa=data().whatsapp.replace(/\D/g,'');
  window.open(`https://wa.me/${wa}?text=${msg}`,'_blank');
  toast('Order details opened in WhatsApp');closeModal();e.target.reset();
}
function renderPosts(){
  const el=document.querySelector('#blogGrid');if(!el)return;
  el.innerHTML=data().posts.map((p,i)=>`<article class="card post"><div class="post-cover"></div><div class="post-body">
  <span class="badge">L2K UPDATE</span><h3 style="margin-top:10px">${p.title}</h3><p>${p.text}</p><a href="contact.html" class="btn btn-light">READ MORE →</a></div></article>`).join('')
}
function applyHeroBanner(){
  const d=data(), hero=document.querySelector('.hero'), layer=document.querySelector('#heroBanner');
  if(!hero||!layer)return;
  if(d.heroBanner){layer.style.backgroundImage=`url("${d.heroBanner}")`;hero.classList.add('has-banner')}
  else{hero.classList.remove('has-banner');layer.style.backgroundImage=''}
}
function setupNav(){
  const b=document.querySelector('#menuBtn'),n=document.querySelector('#navlinks');
  b?.addEventListener('click',()=>n.classList.toggle('open'))
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.navlinks a').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('active')})
}
document.addEventListener('DOMContentLoaded',()=>{
  setupNav();applyHeroBanner();renderServices();renderProducts(new URLSearchParams(location.search).get('cat')||'');renderPosts();
  document.querySelector('#orderForm')?.addEventListener('submit',submitOrder);
  document.querySelector('#closeModal')?.addEventListener('click',closeModal);
  document.querySelector('#orderModal')?.addEventListener('click',e=>{if(e.target.id==='orderModal')closeModal()});
  document.querySelector('#search')?.addEventListener('input',e=>{
    const q=e.target.value.toLowerCase();
    const el=document.querySelector('#products');
    if(!el)return;
    const ps=data().products.filter(p=>(p.name+p.cat).toLowerCase().includes(q));
    el.innerHTML=ps.map(p=>`<article class="card product-card"><span class="badge">${p.cat}</span><h3 style="margin-top:12px">${p.name}</h3><div class="price">${money(p.price)}</div><p>Fast delivery • Trusted service • Sri Lanka</p><button class="btn btn-primary" onclick="openOrder('${p.id}')">ORDER NOW →</button></article>`).join('');
  })
})
