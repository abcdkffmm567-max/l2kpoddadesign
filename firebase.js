// L2K TOP UP STORE - Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNRNmZJyxQiAj_AjNHLf43knOEmQ9e-FU",
  authDomain: "l2k-top-up-store.firebaseapp.com",
  databaseURL: "https://l2k-top-up-store-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "l2k-top-up-store",
  storageBucket: "l2k-top-up-store.firebasestorage.app"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

console.log("L2K Firebase initialized");
