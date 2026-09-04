importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBNRNmZJyxQiAj_AjNHLf43knOEmQ9e-FU",
  authDomain: "l2k-top-up-store.firebaseapp.com",
  databaseURL: "https://l2k-top-up-store-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "l2k-top-up-store",
  storageBucket: "l2k-top-up-store.firebasestorage.app",
  messagingSenderId: "968217753616",
  appId: "1:968217753616:web:50cf1aefb82c6af2247295"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const data = payload.data || {};
  const notification = payload.notification || {};
  const title = data.title || notification.title || "🛒 New L2K Order";
  const options = {
    body: data.body || notification.body || "A customer placed a new order.",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: data.orderId ? "l2k-order-" + data.orderId : "l2k-new-order",
    renotify: true,
    data: {
      url: data.url || "./admin.html",
      orderId: data.orderId || ""
    }
  };
  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "./admin.html";
  event.waitUntil(
    clients.matchAll({type:"window", includeUncontrolled:true}).then(list => {
      for(const client of list){
        if("focus" in client && client.url.includes("admin.html")){
          client.navigate(target);
          return client.focus();
        }
      }
      if(clients.openWindow) return clients.openWindow(target);
    })
  );
});

const CACHE_NAME = "l2k-topup-fcm-fixed-v7";
const CORE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./animations.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).catch(err => {
      console.warn("Initial cache failed:", err);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if(response && response.status === 200){
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>{});
        }
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html")))
  );
});
