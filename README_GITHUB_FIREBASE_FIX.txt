L2K TOP UP STORE - Firebase Auth Fix

Why "auth is not defined" happened:
The page could not see the Firebase Auth instance from firebase.js.

This version fixes it by exposing:
window.auth
window.db
window.storage

For GitHub Pages also do this in Firebase Console:
1. Firebase Console > Authentication > Sign-in method
2. Enable Google
3. Enable Email/Password
4. Authentication > Settings > Authorized domains
5. Add your GitHub Pages domain, for example:
   abcdkffmm567-max.github.io

On GitHub upload/replace at least:
- firebase.js
- register.html
- login.html
- profile.html

Then wait for GitHub Pages deployment and hard refresh (Ctrl+F5).
