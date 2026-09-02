// L2K TOP UP STORE - Firebase reviews system
window.L2KReviews = {
  ref(){
    if(typeof db === 'undefined') throw new Error('Firebase database is not available.');
    return db.ref('reviews');
  },

  async submit({name, city, rating, message}){
    const user = (typeof auth !== 'undefined') ? auth.currentUser : null;
    const ref = this.ref().push();
    const review = {
      reviewId: ref.key,
      name: (name || user?.displayName || 'Customer').trim(),
      city: (city || '').trim(),
      rating: Number(rating || 5),
      message: (message || '').trim(),
      customerUid: user?.uid || null,
      customerEmail: user?.email || null,
      status: 'approved',
      createdAt: firebase.database.ServerValue.TIMESTAMP
    };
    if(!review.message) throw new Error('Please write your review.');
    await ref.set(review);
    return review;
  },

  listenApproved(callback){
    return this.ref().orderByChild('createdAt').on('value', snap => {
      const raw = snap.val() || {};
      const reviews = Object.entries(raw)
        .map(([id, r]) => ({id, ...r}))
        .filter(r => (r.status || 'approved') === 'approved')
        .sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(reviews);
    });
  },

  stars(rating){
    const n = Math.max(1, Math.min(5, Number(rating || 5)));
    return '★'.repeat(n) + '☆'.repeat(5-n);
  },

  escape(text){
    return String(text ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#039;");
  }
};
