function login(){
  if(document.querySelector('#au').value==='admin' && document.querySelector('#ap').value==='l2k123'){
    sessionStorage.setItem('l2k_admin','1');showDash()
  }else toast('Wrong username or password')
}
function showDash(){
  document.querySelector('#login').style.display='none';document.querySelector('#dashboard').style.display='block';
  const d=data();document.querySelector('#wa').value=d.whatsapp;document.querySelector('#brand').value=d.brand;
  if(typeof db!=='undefined'){
    db.ref('site/heroBannerUrl').once('value').then(snap=>{
      const img=document.querySelector('#bannerPreview');
      if(img && snap.val()){img.src=snap.val();img.style.display='block'}
    }).catch(console.error);
  }
  document.querySelector('#heroFile')?.addEventListener('change',handleBanner);
  renderAdmin();
  renderGameImageUrlFields();
  loadWebsiteImageUrls();
}
function saveSettings(){const d=data();d.whatsapp=document.querySelector('#wa').value;d.brand=document.querySelector('#brand').value;save(d);toast('Settings saved')}
async function handleBanner(e){
  const file=e.target.files?.[0];if(!file)return;
  if(file.size>5*1024*1024){toast('Please use a banner under 5MB');e.target.value='';return}
  try{
    toast('Uploading banner...');
    const ref=storage.ref('site/hero/'+Date.now()+'_'+file.name.replace(/[^a-zA-Z0-9._-]/g,'_'));
    const snap=await ref.put(file);
    const url=await snap.ref.getDownloadURL();
    await db.ref('site/heroBannerUrl').set(url);
    document.querySelector('#bannerPreview').src=url;
    document.querySelector('#bannerPreview').style.display='block';
    toast('Banner uploaded — everyone can see it now');
  }catch(err){console.error(err);toast(err.message||'Banner upload failed')}
}
function renderAdmin(){
 const d=data();
 document.querySelector('#ptable').innerHTML='<table class="table"><tr><th>Product</th><th>Category</th><th>Price</th><th>Action</th></tr>'+d.products.map((p,i)=>`<tr><td>${p.name}</td><td>${p.cat}</td><td><input style="width:100px;padding:6px;border:1px solid #ddd;border-radius:6px" type="number" value="${p.price}" onchange="updatePrice(${i},this.value)"></td><td><button class="small-btn" onclick="removeProduct(${i})">Delete</button></td></tr>`).join('')+'</table>';
 document.querySelector('#posts').innerHTML=d.posts.map((p,i)=>`<div style="border-bottom:1px solid #eee;padding:10px 0"><b>${p.title}</b><p style="font-size:9px;color:#8893a5;margin:3px 0">${p.text}</p><button class="small-btn" onclick="removePost(${i})">Delete</button></div>`).join('');
}
function updatePrice(i,v){const d=data();d.products[i].price=Number(v);save(d);toast('Price updated')}
function removeProduct(i){const d=data();d.products.splice(i,1);save(d);renderAdmin()}
function addProduct(){const d=data();const name=prompt('Product name');if(!name)return;const price=Number(prompt('Price in LKR','500'));const cat=prompt('Category','Game TopUp');d.products.push({id:'p'+Date.now(),name,price,cat});save(d);renderAdmin()}
function removePost(i){const d=data();d.posts.splice(i,1);save(d);renderAdmin()}
function addPost(){const d=data();const title=prompt('Update title');if(!title)return;const text=prompt('Update description','New update from L2K TOP UP STORE');d.posts.push({title,text});save(d);renderAdmin()}
document.addEventListener('DOMContentLoaded',()=>{sessionStorage.removeItem('l2k_admin');})

async function removeHeroBanner(){
  try{
    await db.ref('site/heroBannerUrl').remove();
    const img=document.querySelector('#bannerPreview');
    if(img){img.src='';img.style.display='none'}
    toast('Hero banner removed');
  }catch(err){console.error(err);toast(err.message||'Could not remove banner')}
}


const adminGameCards = [
  ['freefire-sg','Free Fire (SG/MY)'],
  ['pubg','PUBG Mobile'],
  ['delta','Delta Force Mobile'],
  ['blood','Blood Strike'],
  ['farlight','Farlight 84'],
  ['newstate','PUBG New State'],
  ['freefire-id','Free Fire (Indonesia)'],
  ['wwm','Where Winds Meet'],
  ['valorant','Valorant']
];

function renderGameImageUrlFields(){
  const box=document.querySelector('#gameImageUrlFields');
  if(!box)return;
  box.innerHTML=adminGameCards.map(([id,name])=>`
    <div class="field">
      <label>${name}</label>
      <input id="gameurl_${id}" placeholder="https://example.com/${id}.jpg">
    </div>
  `).join('');
  if(typeof db!=='undefined'){
    db.ref('site/gameCards').once('value').then(s=>{
      const v=s.val()||{};
      adminGameCards.forEach(([id])=>{
        const el=document.getElementById('gameurl_'+id);
        if(el)el.value=(v[id]&&v[id].imageUrl)||'';
      });
    });
  }
}

async function saveGameImageUrls(){
  if(typeof db==='undefined'){toast('Firebase not loaded');return}
  try{
    const updates={};
    adminGameCards.forEach(([id,name])=>{
      updates[id]={name,imageUrl:(document.getElementById('gameurl_'+id)?.value||'').trim()};
    });
    await db.ref('site/gameCards').set(updates);
    toast('Game card image URLs saved for all visitors');
  }catch(err){console.error(err);toast(err.message||'Could not save game image URLs')}
}

function loadWebsiteImageUrls(){
  if(typeof db==='undefined')return;
  db.ref('site').once('value').then(s=>{
    const v=s.val()||{};
    const h=document.getElementById('heroUrl');
    const p=document.getElementById('promoUrl');
    if(h)h.value=v.heroBannerUrl||'';
    if(p)p.value=(v.images&&v.images.promoBannerUrl)||'';
  });
}

async function saveWebsiteImageUrls(){
  if(typeof db==='undefined'){toast('Firebase not loaded');return}
  try{
    const hero=(document.getElementById('heroUrl')?.value||'').trim();
    const promo=(document.getElementById('promoUrl')?.value||'').trim();
    await db.ref('site/heroBannerUrl').set(hero||null);
    await db.ref('site/images/promoBannerUrl').set(promo||null);
    toast('Website image URLs saved');
  }catch(err){console.error(err);toast(err.message||'Could not save image URLs')}
}

document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{renderGameImageUrlFields();loadWebsiteImageUrls()},50);
});


const ffDefaultAdminPackages=[
 {id:'weekly-lite',name:'Weekly Lite Membership',price:130,imageUrl:''},
 {id:'weekly',name:'Weekly Membership',price:580,imageUrl:''},
 {id:'monthly',name:'Monthly Membership',price:2900,imageUrl:''},
 {id:'vip',name:'VIP Membership',price:3480,imageUrl:''},
 {id:'super-vip',name:'Super VIP Membership',price:5220,imageUrl:''},
 {id:'465',name:'465 Diamonds Bonus Pack',price:1180,oldPrice:1485,imageUrl:'',discount:'21% OFF'},
 {id:'780',name:'780 Diamonds Bonus Pack',price:1970,oldPrice:2470,imageUrl:'',discount:'20% OFF'},
 {id:'1590',name:'1590 Diamonds Bonus Pack',price:3960,oldPrice:4900,imageUrl:'',discount:'19% OFF'},
 {id:'3270',name:'3270 Diamonds Bonus Pack',price:7980,oldPrice:9900,imageUrl:'',discount:'19% OFF'},
 {id:'8400',name:'8400 Diamonds Bonus Pack',price:19880,oldPrice:24740,imageUrl:'',discount:'20% OFF'},
 {id:'25',name:'25 Diamonds',price:85,imageUrl:''},
 {id:'100',name:'100 Diamonds',price:325,imageUrl:''},
 {id:'310',name:'310 Diamonds',price:990,imageUrl:''},
 {id:'520',name:'520 Diamonds',price:1650,imageUrl:''},
 {id:'1060',name:'1,060 Diamonds',price:3250,imageUrl:''},
 {id:'2180',name:'2,180 Diamonds',price:6565,imageUrl:''},
 {id:'5600',name:'5,600 Diamonds',price:16200,imageUrl:''},
 {id:'11500',name:'11,500 Diamonds',price:33000,imageUrl:''},
 {id:'level06',name:'Level Up Pass - 06',price:120,imageUrl:''},
 {id:'level10',name:'Level Up Pass - 10',price:230,imageUrl:''},
 {id:'level15',name:'Level Up Pass - 15',price:230,imageUrl:''},
 {id:'level20',name:'Level Up Pass - 20',price:230,imageUrl:''},
 {id:'level25',name:'Level Up Pass - 25',price:230,imageUrl:''},
 {id:'level30',name:'Level Up Pass - 30',price:330,imageUrl:''}
];

let ffAdminPackages=[...ffDefaultAdminPackages];

function renderFreeFireAdmin(){
 const box=document.getElementById('ffPackageAdmin'); if(!box)return;
 box.innerHTML='<table class="table"><tr><th>Package</th><th>Price</th><th>Old Price</th><th>Image URL</th></tr>'+
 ffAdminPackages.map((p,i)=>`<tr>
 <td><input style="width:170px;padding:6px;border:1px solid #ddd;border-radius:6px" value="${(p.name||'').replace(/"/g,'&quot;')}" onchange="ffAdminPackages[${i}].name=this.value"></td>
 <td><input style="width:90px;padding:6px;border:1px solid #ddd;border-radius:6px" type="number" value="${p.price||0}" onchange="ffAdminPackages[${i}].price=Number(this.value)"></td>
 <td><input style="width:90px;padding:6px;border:1px solid #ddd;border-radius:6px" type="number" value="${p.oldPrice||0}" onchange="ffAdminPackages[${i}].oldPrice=Number(this.value)||null"></td>
 <td><input style="width:260px;padding:6px;border:1px solid #ddd;border-radius:6px" value="${(p.imageUrl||'').replace(/"/g,'&quot;')}" placeholder="https://..." onchange="ffAdminPackages[${i}].imageUrl=this.value"></td>
 </tr>`).join('')+'</table>';
}

function loadFreeFireAdmin(){
 if(typeof db==='undefined')return;
 db.ref('site/freefiresg').once('value').then(s=>{
   const v=s.val()||{};
   const h=document.getElementById('ffHeroUrl'); if(h)h.value=v.heroImageUrl||'';
   const saved=v.packages||{};
   ffAdminPackages=ffDefaultAdminPackages.map(p=>({...p,...(saved[p.id]||{})}));
   renderFreeFireAdmin();
 }).catch(console.error);
}

async function saveFreeFireSG(){
 if(typeof db==='undefined'){toast('Firebase not loaded');return}
 try{
   const packagesObj={};
   ffAdminPackages.forEach(p=>packagesObj[p.id]=p);
   await db.ref('site/freefiresg').set({
     heroImageUrl:(document.getElementById('ffHeroUrl')?.value||'').trim(),
     packages:packagesObj,
     updatedAt:firebase.database.ServerValue.TIMESTAMP
   });
   toast('Free Fire SG page saved to Firebase');
 }catch(err){console.error(err);toast(err.message||'Could not save Free Fire page')}
}

document.addEventListener('DOMContentLoaded',()=>setTimeout(loadFreeFireAdmin,120));


let adminOrders = [];
let adminOrderFilter = 'all';

function listenForOrders(){
  if(typeof db==='undefined')return;
  db.ref('orders').orderByChild('createdAt').on('value',snap=>{
    const raw=snap.val()||{};
    adminOrders=Object.entries(raw).map(([id,o])=>({id,...o})).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    renderOrders();
  },err=>{
    console.error(err);
    const el=document.getElementById('ordersSummary');
    if(el)el.textContent='Could not load orders: '+err.message;
  });
}

function setOrderFilter(filter){
  adminOrderFilter=filter;
  renderOrders();
}

function orderStatusBadge(status){
  const map={
    pending:['#fff4d8','#9a6a00'],
    active:['#e5f1ff','#1764d8'],
    completed:['#dcf8e8','#13864f'],
    rejected:['#ffe5e5','#b42318']
  };
  const c=map[status]||['#eef2f7','#526078'];
  return `<span style="background:${c[0]};color:${c[1]};padding:5px 8px;border-radius:20px;font-size:8px;font-weight:900;text-transform:uppercase">${status||'pending'}</span>`;
}

function formatOrderItems(order){
  if(Array.isArray(order.items)){
    return order.items.map(i=>`${i.name||'Item'}${i.qty?` ×${i.qty}`:''}`).join('<br>');
  }
  return order.packageName||'-';
}

function renderOrders(){
  const box=document.getElementById('ordersTable');
  const summary=document.getElementById('ordersSummary');
  if(!box||!summary)return;

  const list=adminOrderFilter==='all'
    ? adminOrders
    : adminOrders.filter(o=>(o.status||'pending')===adminOrderFilter);

  const pending=adminOrders.filter(o=>(o.status||'pending')==='pending').length;
  const active=adminOrders.filter(o=>o.status==='active').length;
  const completed=adminOrders.filter(o=>o.status==='completed').length;
  summary.textContent=`Total: ${adminOrders.length} • Pending: ${pending} • Active: ${active} • Completed: ${completed}`;

  if(!list.length){
    box.innerHTML='<div class="notice">No orders in this filter.</div>';
    return;
  }

  box.innerHTML=`<table class="table">
    <tr>
      <th>Order</th>
      <th>Customer</th>
      <th>Game / Player ID</th>
      <th>Items</th>
      <th>Total</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
    ${list.map(o=>`
      <tr>
        <td><b>${o.id.slice(-8)}</b><br><small>${o.createdAt?new Date(o.createdAt).toLocaleString():'-'}</small></td>
        <td>${o.customerName||'-'}<br><small>${o.whatsapp||o.customerEmail||'-'}</small></td>
        <td>${o.game||'-'}<br><small>UID: ${o.playerId||'-'}</small></td>
        <td>${formatOrderItems(o)}</td>
        <td>${o.total==null?'-':'LKR '+Number(o.total).toLocaleString('en-LK')}</td>
        <td>${orderStatusBadge(o.status||'pending')}</td>
        <td style="min-width:210px">
          <button class="small-btn" onclick="changeOrderStatus('${o.id}','active')">Activate</button>
          <button class="small-btn" onclick="changeOrderStatus('${o.id}','completed')">Complete</button>
          <button class="small-btn" onclick="changeOrderStatus('${o.id}','rejected')">Reject</button>
        </td>
      </tr>`).join('')}
  </table>`;
}

async function changeOrderStatus(orderId,status){
  try{
    await setOrderStatus(orderId,status);
    toast('Order marked '+status);
  }catch(err){
    console.error(err);
    toast(err.message||'Could not update order');
  }
}

document.addEventListener('DOMContentLoaded',()=>setTimeout(listenForOrders,150));


let adminReviews=[];

function listenForReviews(){
  if(typeof db==='undefined')return;
  db.ref('reviews').orderByChild('createdAt').on('value',snap=>{
    const raw=snap.val()||{};
    adminReviews=Object.entries(raw).map(([id,r])=>({id,...r})).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    renderAdminReviews();
  });
}

function renderAdminReviews(){
  const box=document.getElementById('adminReviewsTable');
  const summary=document.getElementById('adminReviewsSummary');
  if(!box||!summary)return;
  const approved=adminReviews.filter(r=>(r.status||'approved')==='approved').length;
  const hidden=adminReviews.filter(r=>r.status==='hidden').length;
  summary.textContent=`Total: ${adminReviews.length} • Approved: ${approved} • Hidden: ${hidden}`;

  if(!adminReviews.length){
    box.innerHTML='<div class="notice">No reviews yet.</div>';
    return;
  }

  box.innerHTML=`<table class="table">
    <tr><th>Customer</th><th>Rating</th><th>Review</th><th>Status</th><th>Actions</th></tr>
    ${adminReviews.map(r=>`
      <tr>
        <td>${L2KReviews.escape(r.name||'Customer')}<br><small>${L2KReviews.escape(r.city||'')}</small></td>
        <td style="color:#2f7df2">${L2KReviews.stars(r.rating)}</td>
        <td style="max-width:330px;white-space:normal">${L2KReviews.escape(r.message||'')}</td>
        <td>${r.status||'approved'}</td>
        <td style="min-width:185px">
          <button class="small-btn" onclick="setReviewStatus('${r.id}','approved')">Approve</button>
          <button class="small-btn" onclick="setReviewStatus('${r.id}','hidden')">Hide</button>
          <button class="small-btn" onclick="deleteReview('${r.id}')">Delete</button>
        </td>
      </tr>`).join('')}
  </table>`;
}

async function setReviewStatus(id,status){
  try{
    await db.ref('reviews/'+id).update({status});
    toast('Review '+status);
  }catch(err){console.error(err);toast(err.message||'Could not update review')}
}
async function deleteReview(id){
  if(!confirm('Delete this review?'))return;
  try{
    await db.ref('reviews/'+id).remove();
    toast('Review deleted');
  }catch(err){console.error(err);toast(err.message||'Could not delete review')}
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(listenForReviews,200));


function loadHeroSliderBanners(){
  if(typeof db==='undefined')return;
  db.ref('site/heroBanners').once('value').then(s=>{
    const v=s.val()||{};
    for(let i=1;i<=4;i++){
      const el=document.getElementById('heroBanner'+i);
      if(el)el.value=v['banner'+i]||'';
    }
  }).catch(console.error);
}

async function saveHeroSliderBanners(){
  if(typeof db==='undefined'){toast('Firebase not loaded');return}
  try{
    const data={};
    for(let i=1;i<=4;i++){
      const value=(document.getElementById('heroBanner'+i)?.value||'').trim();
      if(value)data['banner'+i]=value;
    }
    await db.ref('site/heroBanners').set(data);
    toast('Hero slider banners saved');
  }catch(err){
    console.error(err);
    toast(err.message||'Could not save hero slider');
  }
}

document.addEventListener('DOMContentLoaded',()=>setTimeout(loadHeroSliderBanners,220));


function millisToLocalInput(ms){
  if(!ms)return '';
  const d=new Date(Number(ms));
  const pad=n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function loadBonusOfferSettings(){
  if(typeof db==='undefined')return;
  db.ref('site/freefiresg/bonusOffer').once('value').then(s=>{
    const v=s.val()||{};
    const enabled=document.getElementById('bonusOfferEnabled');
    const hide=document.getElementById('bonusHideExpired');
    const title=document.getElementById('bonusOfferTitleAdmin');
    const end=document.getElementById('bonusOfferEndTime');

    if(enabled)enabled.value=String(v.enabled===true);
    if(hide)hide.value=String(v.hideWhenExpired!==false);
    if(title)title.value=v.title||'🔥 BONUS OFFER!';
    if(end)end.value=millisToLocalInput(v.endTime||0);
  }).catch(console.error);
}

async function saveBonusOfferSettings(){
  if(typeof db==='undefined'){toast('Firebase not loaded','error');return}

  const enabled=document.getElementById('bonusOfferEnabled')?.value==='true';
  const hideWhenExpired=document.getElementById('bonusHideExpired')?.value==='true';
  const title=(document.getElementById('bonusOfferTitleAdmin')?.value||'🔥 BONUS OFFER!').trim();
  const rawTime=document.getElementById('bonusOfferEndTime')?.value||'';

  let endTime=0;
  if(rawTime){
    const parsed=new Date(rawTime);
    if(Number.isNaN(parsed.getTime())){
      toast('Please select a valid end date/time','error');
      return;
    }
    endTime=parsed.getTime();
  }

  if(enabled && !endTime){
    toast('Select the end date/time before turning the offer ON','error');
    return;
  }

  try{
    await db.ref('site/freefiresg/bonusOffer').set({
      enabled,
      hideWhenExpired,
      title,
      endTime,
      updatedAt:firebase.database.ServerValue.TIMESTAMP
    });
    toast(enabled?'Bonus Offer is ON and timer saved':'Bonus Offer turned OFF');
  }catch(err){
    console.error(err);
    toast(err.message||'Could not save Bonus Offer settings','error');
  }
}

document.addEventListener('DOMContentLoaded',()=>setTimeout(loadBonusOfferSettings,250));
