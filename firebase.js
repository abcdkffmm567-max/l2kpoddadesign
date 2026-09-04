// L2K TOP UP STORE - Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNRNmZJyxQiAj_AjNHLf43knOEmQ9e-FU",
  authDomain: "l2k-top-up-store.firebaseapp.com",
  databaseURL: "https://l2k-top-up-store-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "l2k-top-up-store",
  storageBucket: "l2k-top-up-store.firebasestorage.app"
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

    // Firebase Cloud Messaging is only available on supported HTTPS browsers.
    try {
      window.messaging = firebase.messaging ? firebase.messaging() : null;
    } catch (e) {
      console.warn("Firebase Messaging is not available on this page/browser.", e);
      window.messaging = null;
    }

    window.firebaseReady = true;
    console.log("L2K Firebase initialized successfully");
  } catch (err) {
    window.firebaseReady = false;
    console.error("Firebase initialization failed:", err);
  }
})();
