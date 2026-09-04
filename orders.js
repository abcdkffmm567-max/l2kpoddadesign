// L2K TOP UP STORE - Firebase order helpers
function generateL2KOrderId(){
  const time = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(2,6).padEnd(4,'0');
  return `L2KTP-${time}${rand}`;
}

async function createStoreOrder(orderData){
  if(typeof db === 'undefined') throw new Error('Database service is not available.');

  let uid = null, email = null, displayName = null;
  try{
    const user = (typeof auth !== 'undefined') ? auth.currentUser : null;
    if(user){
      uid = user.uid || null;
      email = user.email || null;
      displayName = user.displayName || null;
    }
  }catch(e){}

  const ref = db.ref('orders').push();
  const publicOrderId = generateL2KOrderId();
  const order = {
    ...orderData,
    orderId: publicOrderId,
    firebaseKey: ref.key,
    customerUid: uid,
    customerEmail: email,
    customerName: orderData.customerName || displayName || '',
    status: 'pending',
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    updatedAt: firebase.database.ServerValue.TIMESTAMP
  };

  await ref.set(order);
  return { id: ref.key, firebaseKey: ref.key, orderId: publicOrderId, ...order };
}

async function setOrderStatus(firebaseKey, status){
  if(typeof db === 'undefined') throw new Error('Database service is not available.');
  if(!firebaseKey) throw new Error('Order key is missing.');
  await db.ref('orders/' + firebaseKey).update({
    status,
    updatedAt: firebase.database.ServerValue.TIMESTAMP
  });
}

function copyTextToClipboard(text){
  if(navigator.clipboard && window.isSecureContext){
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve,reject)=>{
    const ta=document.createElement('textarea');
    ta.value=text; ta.setAttribute('readonly','');
    ta.style.position='fixed'; ta.style.left='-9999px';
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0,99999);
    try{ document.execCommand('copy') ? resolve() : reject(new Error('Copy failed')); }
    catch(e){ reject(e); }
    finally{ ta.remove(); }
  });
}
