PROFILE PHOTO UPDATE

profile.html now supports:
- Uploading a custom profile photo to Firebase Storage
- Saving the photo URL to Realtime Database under users/{uid}/photoURL
- Updating Firebase Auth user.photoURL
- Automatically showing the Google account photo for Google sign-ins
- A "Use Google Photo" button

Firebase Storage path:
profile-photos/{uid}/profile.ext

IMPORTANT:
Firebase Storage must be enabled in Firebase Console.
Storage rules should only allow authenticated users to write to their own folder.
