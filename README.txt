L2K TOP UP STORE - MULTI PAGE WEBSITE
=====================================

Included:
- index.html          Main landing page matching the supplied NOVA-style reference
- topup.html          Game top-up products + WhatsApp order modal
- cards.html          Digital cards page
- designs.html        Graphic design services
- services.html       Services page
- contact.html        Contact / WhatsApp page
- about.html          About page
- terms.html          Terms page
- privacy.html        Privacy page
- admin.html          Front-end demo admin panel
- css/style.css       Full responsive styling
- js/app.js           Store logic
- js/admin.js         Demo admin controls
- assets/logo.svg     L2K logo

HOW TO RUN
1. Extract the ZIP.
2. Open index.html in Chrome/Edge/Opera, or use VS Code + Live Server.
3. No Node.js is required.

ADMIN DEMO
Username: admin
Password: l2k123

The admin page uses browser localStorage, so price/update changes are stored only in that browser.
For a real online store with Google login, real payments, real orders, shared admin access and database storage,
connect the same UI to Firebase/Supabase/a backend before publishing.

IMPORTANT
- Change the WhatsApp number in Admin before using it publicly.
- Replace sample prices/products with your actual prices.
- The site is inspired by the visual layout in the supplied screenshot, but uses original HTML/CSS artwork rather than copying proprietary site code/assets.


UPDATED: Reference-style Why Choose Us, Reseller Program and Ready CTA sections added. Admin now has Hero Background Banner upload; the selected banner appears behind L2K TOP UP on Home.

HEADER UPDATE: The L2K TOP UP STORE branding is now styled like the supplied NOVA reference: compact circular L2K mark, bold main name and small uppercase subtitle.


FIREBASE UPDATE
===============
Firebase Realtime Database + Authentication SDKs are now included on the website.
Configuration is in: js/firebase.js

Register page:
- Email/password account creation -> Firebase Authentication
- User profile -> Realtime Database /users/{uid}
- Google sign-up -> Firebase Google Auth
- Verification email -> sent after email/password registration

Firebase Console setup still required:
1. Authentication > Sign-in method: enable Email/Password and Google.
2. Authentication > Settings > Authorized domains: add your deployed website domain.
3. Realtime Database: configure secure rules before public launch.
4. Google sign-in popups generally require hosting (localhost or HTTPS); they may not work from file:// preview.


LOGIN + FIREBASE STORAGE UPDATE
===============================
New page: login.html
- Firebase Email/Password login
- Google login
- Keep me logged in
- Forgot password email
- Link to register.html

Shared image uploads:
- Admin hero banner is uploaded to Firebase Storage.
- Its public download URL is saved to Realtime Database at: site/heroBannerUrl
- Home page listens to that Firebase value, so all visitors see the same banner.

Firebase Console setup required:
1. Authentication > Sign-in method: enable Email/Password and Google.
2. Authentication > Settings > Authorized domains: add your deployed domain.
3. Storage: create/enable Firebase Storage.
4. Realtime Database: create/enable Realtime Database.
5. Configure secure Database and Storage Rules before publishing.

NOTE:
The configured Storage bucket is l2k-top-up-store.firebasestorage.app.
If your Firebase Console shows a different bucket name, change storageBucket in js/firebase.js.


GAME TOP-UP PAGE UPDATE
=======================
topup.html has been redesigned to match the supplied reference layout:
- Large Game Top-Up Center hero
- Search bar
- 9 game cards
- Active badges
- Top Spenders leaderboard area
- Download Our App section
- Footer
- Clicking a game opens game-order.html with the selected game name.


ADMIN IMAGE URL UPDATE
======================
Admin can now paste image URLs instead of uploading files.

Firebase paths:
- site/gameCards/{gameId}/imageUrl  -> images for game cards on topup.html
- site/heroBannerUrl                -> homepage hero background
- site/images/promoBannerUrl        -> homepage promotion banner

These are stored in Firebase Realtime Database, so all visitors see the same images.
Use direct/public HTTPS image URLs. If an image host blocks hotlinking, the image may not display.


ADMIN ACCESS UPDATE
- Home page now includes an ADMIN PANEL button linking to admin.html.
- Admin username: admin
- Admin password: l2k123


FREE FIRE SG/MY PAGE
====================
New page: freefiresg.html

The Free Fire (SG/MY) card on topup.html now opens freefiresg.html.

Admin Panel > Free Fire SG/MY Page Manager can edit:
- Hero background image URL
- Package name
- Package price
- Old price
- Package image URL

Saved Firebase path:
site/freefiresg

All visitors read the same Firebase values, so admin changes are shared publicly.

HOME PAGE COUNTER UPDATE
========================
Added animated statistics cards to index.html:
- 0 -> 5,000+ Happy Customers
- 0 -> 99% Success Rate
- 0 -> 200+ Daily Avg TopUp
- 0 -> 2s Delivery

The animation starts when the section scrolls into view.


FIREBASE ORDER SYSTEM
=====================
Customer orders are now saved directly from the website to Firebase Realtime Database.

Firebase path:
orders/{orderId}

Customer order status starts as:
pending

Admin Panel > Customer Orders can change status to:
- active
- completed
- rejected

Pages using the order system:
- freefiresg.html
- game-order.html

Admin reads orders live, so new orders appear without refreshing.

IMPORTANT:
For production, secure Realtime Database rules so customers can create their own orders but cannot change order status. Only authorized admins should be able to update status.


PROFILE PAGE
============
New page: profile.html

Features:
- Requires Firebase login
- Shows username/email/WhatsApp/UID
- Edit and save username + WhatsApp to Firebase
- Shows total, active and completed order counts
- Shows the logged-in customer's Firebase order history
- Email verification button
- Password reset button
- Logout button

User data path:
users/{uid}

Order history query:
orders where customerUid == logged-in Firebase UID


CUSTOMER REVIEWS SYSTEM
=======================
index.html:
- Customer Reviews slider
- Automatic horizontal slide every few seconds
- Write a Review modal
- View All Reviews button

allreviews.html:
- Shows all approved Firebase reviews
- Review count and average rating

Firebase path:
reviews/{reviewId}

Admin Panel:
- Approve review
- Hide review
- Delete review

Current submit behavior:
- New reviews are saved with status=approved so they appear immediately.
- For stronger moderation, change reviews.js default status from approved to pending and approve them from Admin.


HERO BANNER AUTO SLIDER
=======================
Home page hero now supports up to 4 auto-sliding background banners.

Admin Panel:
Hero Slider Banners
- Banner 1 URL
- Banner 2 URL
- Banner 3 URL
- Banner 4 URL

Firebase path:
site/heroBanners/banner1
site/heroBanners/banner2
site/heroBanners/banner3
site/heroBanners/banner4

Slider behavior:
- Crossfade every 4.5 seconds
- Navigation dots under hero buttons
- Supports 1 to 4 banners
- Falls back to the old site/heroBannerUrl if no slider banners exist


ANIMATION UPDATE
================
Added polished animations across the full website:
- Smooth page fade-in
- Scroll reveal animations
- Staggered card entrances
- Hero title entrance animation
- Floating hero badge and accent shape
- Button shine + magnetic hover
- 3D card hover on desktop
- Animated navigation underline
- Header shadow on scroll
- Icon pulse/glow animations
- Smooth input focus effects
- Review card motion
- Ambient reseller-section motion
- Reduced-motion accessibility support

Files:
- css/style.css
- js/animations.js


LATEST FIXES
============
Admin Panel:
- Admin page now always shows Username + Password login first.
- Username: admin
- Password: l2k123

Contact:
- WhatsApp number changed to +94 74 068 2507
- wa.me target changed to 94740682507

Notifications:
- Added premium animated notification toast
- Glass dark panel, success icon, progress bar, mobile responsive
