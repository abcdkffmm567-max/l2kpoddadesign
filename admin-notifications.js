
// L2K TOP UP STORE - Admin phone notifications
// Uses Firebase Cloud Messaging for real push notifications.
// A Realtime Database listener is also used as a fallback while Admin Panel is open.

(function(){
  const DEVICE_ID_KEY = 'l2k_admin_notification_device_id';
  const VAPID_KEY_KEY = 'l2k_admin_vapid_public_key';
  const ENABLED_KEY = 'l2k_admin_notifications_enabled';
  const OPENED_AT = Date.now();
  let fallbackListenerStarted = false;
  let foregroundListenerStarted = false;

  function byId(id){ return document.getElementById(id); }

  function status(message, ok){
    const el = byId('adminNotificationStatus');
    if(!el) return;
    el.textContent = 'Notification status: ' + message;
    el.style.borderColor = ok ? '#86efac' : '';
    el.style.background = ok ? '#f0fdf4' : '';
    el.style.color = ok ? '#166534' : '';
  }

  function deviceId(){
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if(!id){
      id = 'device_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,10);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id.replace(/[^A-Za-z0-9_-]/g,'_');
  }

  async function getServiceWorkerRegistration(){
    if(!('serviceWorker' in navigator)) throw new Error('Service Worker is not supported on this browser.');
    let reg = await navigator.serviceWorker.getRegistration('./');
    if(!reg) reg = await navigator.serviceWorker.register('./service-worker.js', {scope:'./'});
    await navigator.serviceWorker.ready;
    return reg;
  }

  async function saveToken(token){
    if(typeof db === 'undefined') throw new Error('Database service is not available.');
    const id = deviceId();
    await db.ref('adminNotificationTokens/' + id).set({
      token,
      enabled: true,
      platform: navigator.userAgent || '',
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
  }

  function showLocalNotification(title, body, orderId){
    if(Notification.permission !== 'granted') return;
    getServiceWorkerRegistration().then(reg=>{
      reg.showNotification(title, {
        body,
        icon: './icon-192.png',
        badge: './icon-192.png',
        tag: orderId ? 'l2k-order-' + orderId : 'l2k-order',
        renotify: true,
        data: { url: './admin.html', orderId: orderId || '' }
      });
    }).catch(console.error);
  }

  function startRealtimeFallback(){
    if(fallbackListenerStarted || typeof db === 'undefined') return;
    fallbackListenerStarted = true;

    db.ref('orders').limitToLast(1).on('child_added', snap=>{
      const order = snap.val() || {};
      const createdAt = Number(order.createdAt || 0);

      // Never alert for an old order that existed before this Admin page opened.
      if(!createdAt || createdAt < OPENED_AT - 3000) return;

      // If FCM is working, foreground FCM handles the notification to avoid duplicates.
      if(window.messaging && localStorage.getItem(ENABLED_KEY) === '1') return;

      const oid = order.orderId || ('L2KTP-' + snap.key);
      const customer = order.customerName || order.name || 'Customer';
      const amount = order.total || order.totalPrice || order.price || '';
      showLocalNotification(
        '🛒 New L2K Order',
        customer + ' placed order ' + oid + (amount ? ' • LKR ' + amount : ''),
        oid
      );
    });
  }

  function startForegroundMessaging(){
    if(foregroundListenerStarted || !window.messaging || typeof window.messaging.onMessage !== 'function') return;
    foregroundListenerStarted = true;

    window.messaging.onMessage(payload=>{
      const data = payload.data || {};
      const note = payload.notification || {};
      const title = data.title || note.title || '🛒 New L2K Order';
      const body = data.body || note.body || 'A customer placed a new order.';
      const oid = data.orderId || '';

      showLocalNotification(title, body, oid);
      if(typeof toast === 'function') toast(body);
    });
  }

  window.enableAdminPhoneNotifications = async function(){
    try{
      if(!window.isSecureContext){
        throw new Error('Notifications require HTTPS. Open the GitHub Pages website, not a local file.');
      }
      if(!('Notification' in window)){
        throw new Error('This browser does not support web notifications.');
      }
      if(!window.messaging){
        throw new Error('Push notification service is not available.');
      }

      const vapid = (byId('adminVapidKey')?.value || '').trim();
      if(!vapid){
        throw new Error('Paste your Firebase Web Push VAPID public key first.');
      }
      localStorage.setItem(VAPID_KEY_KEY, vapid);

      const permission = await Notification.requestPermission();
      if(permission !== 'granted'){
        throw new Error('Notification permission was not allowed.');
      }

      const swReg = await getServiceWorkerRegistration();
      const token = await window.messaging.getToken({
        vapidKey: vapid,
        serviceWorkerRegistration: swReg
      });

      if(!token) throw new Error('Notification service did not return a device token.');

      await saveToken(token);
      localStorage.setItem(ENABLED_KEY, '1');
      startForegroundMessaging();
      startRealtimeFallback();

      status('Enabled on this phone ✅', true);
      if(typeof toast === 'function') toast('Admin phone notifications enabled');
    }catch(err){
      console.error(err);
      status(err.message || 'Could not enable notifications', false);
      if(typeof toast === 'function') toast(err.message || 'Could not enable notifications');
    }
  };

  window.disableAdminPhoneNotifications = async function(){
    try{
      const id = deviceId();
      if(typeof db !== 'undefined'){
        await db.ref('adminNotificationTokens/' + id).remove();
      }

      try{
        if(window.messaging && typeof window.messaging.getToken === 'function'){
          const vapid = localStorage.getItem(VAPID_KEY_KEY) || '';
          const reg = await getServiceWorkerRegistration();
          const token = await window.messaging.getToken({vapidKey:vapid, serviceWorkerRegistration:reg});
          if(token && typeof window.messaging.deleteToken === 'function'){
            await window.messaging.deleteToken(token);
          }
        }
      }catch(e){ console.warn('Token cleanup skipped', e); }

      localStorage.removeItem(ENABLED_KEY);
      status('Turned off on this phone.', false);
      if(typeof toast === 'function') toast('Notifications turned off on this phone');
    }catch(err){
      console.error(err);
      if(typeof toast === 'function') toast(err.message || 'Could not turn off notifications');
    }
  };

  window.testAdminPhoneNotification = function(){
    if(Notification.permission !== 'granted'){
      if(typeof toast === 'function') toast('Enable notifications first');
      return;
    }
    showLocalNotification(
      '✅ L2K Notifications Working',
      'This phone can display L2K TOP UP STORE notifications.',
      'TEST'
    );
  };

  document.addEventListener('DOMContentLoaded', ()=>{
    const vapid = localStorage.getItem(VAPID_KEY_KEY) || '';
    if(byId('adminVapidKey')) byId('adminVapidKey').value = vapid;

    if(Notification.permission === 'granted' && localStorage.getItem(ENABLED_KEY) === '1'){
      status('Enabled on this phone ✅', true);
      startForegroundMessaging();
    }
    startRealtimeFallback();
  });
})();
