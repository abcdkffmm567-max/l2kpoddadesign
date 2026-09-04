// L2K TOP UP STORE - Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNRNmZJyxQiAj_AjNHLf43knOEmQ9e-FU",
  authDomain: "l2k-top-up-store.firebaseapp.com",
  databaseURL: "https://l2k-top-up-store-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "l2k-top-up-store",
  storageBucket: "l2k-top-up-store.firebasestorage.app",
  messagingSenderId: "968217753616",
  appId: "1:968217753616:web:50cf1aefb82c6af2247295"
};

(function initL2KFirebase(){
  try {
    if (typeof firebase === "undefined") {
      console.error("Firebase SDK did not load.");
      window.firebaseReady = false;
      return;
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Explicit window globals so every HTML page can safely access them.
    window.db = firebase.database();
    window.auth = firebase.auth();

    // Storage is optional for pages that don't use it.
    try {
      window.storage = firebase.storage ? firebase.storage() : null;
    } catch (e) {
      console.warn("Firebase Storage is not available on this page.", e);
      window.storage = null;
    }

    // Firebase Cloud Messaging for admin phone push notifications.
    window.messaging = null;
    try {
      if (firebase.messaging && window.isSecureContext) {
        window.messaging = firebase.messaging();
        console.log("L2K push notification service ready.");
      }
    } catch (e) {
      console.warn("Push notification service initialization failed.", e);
      window.messaging = null;
    }

window.firebaseReady = true;
    console.log("L2K Firebase initialized successfully");
  } catch (err) {
    window.firebaseReady = false;
    console.error("Firebase initialization failed:", err);
  }
})();
