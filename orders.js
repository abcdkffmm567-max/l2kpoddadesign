// L2K TOP UP STORE - Firebase order helpers
async function createStoreOrder(orderData){
  if(typeof db === 'undefined') throw new Error('Firebase database is not available.');

  let uid = null;
  let email = null;
  let displayName = null;

  try{
    const user = (typeof auth !== 'undefined') ? auth.currentUser : null;
    if(user){
      uid = user.uid || null;
      email = user.email || null;
      displayName = user.displayName || null;
    }
  }catch(e){}

  const ref = db.ref('orders').push();
  // Customer-facing ID: L2KTP-XXXXXX. Firebase key remains the internal record key.
  const publicOrderId = 'L2KTP-' + String(Date.now()).slice(-6);
  const order = {
    ...orderData,
    orderId: publicOrderId,
    customerUid: uid,
    customerEmail: email,
    customerName: orderData.customerName || displayName || '',
    status: 'pending',
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    updatedAt: firebase.database.ServerValue.TIMESTAMP
  };

  await ref.set(order);
  return { id: publicOrderId, firebaseKey: ref.key, ...order };
}

async function setOrderStatus(orderId, status){
  if(typeof db === 'undefined') throw new Error('Firebase database is not available.');
  await db.ref('orders/' + orderId).update({
    status,
    updatedAt: firebase.database.ServerValue.TIMESTAMP
  });
}
