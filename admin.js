function login(){
  if(document.querySelector('#au').value==='admin' && document.querySelector('#ap').value==='l2k123'){
    localStorage.setItem('l2k_admin','1');showDash()
  }else toast('Wrong username or password')
}
function showDash(){
  document.querySelector('#login').style.display='none';document.querySelector('#dashboard').style.display='block';
  const d=data();document.querySelector('#wa').value=d.whatsapp;document.querySelector('#brand').value=d.brand;
  if(d.heroBanner){document.querySelector('#bannerPreview').src=d.heroBanner;document.querySelector('#bannerPreview').style.display='block'}
  document.querySelector('#heroFile')?.addEventListener('change',handleBanner);renderAdmin()
}
function saveSettings(){const d=data();d.whatsapp=document.querySelector('#wa').value;d.brand=document.querySelector('#brand').value;save(d);toast('Settings saved')}
function handleBanner(e){const file=e.target.files?.[0];if(!file)return;if(file.size>2.5*1024*1024){toast('Please use a banner under 2.5MB');e.target.value='';return}const r=new FileReader();r.onload=()=>{const d=data();d.heroBanner=r.result;save(d);document.querySelector('#bannerPreview').src=r.result;document.querySelector('#bannerPreview').style.display='block';toast('Hero banner saved')};r.readAsDataURL(file)}
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
document.addEventListener('DOMContentLoaded',()=>{if(localStorage.getItem('l2k_admin')==='1')showDash()})
