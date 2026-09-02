(function(){
  function initReveal(){
    const revealSelectors = [
      '.section-head','.service-card','.product-card','.why-head','.why-card','.why-note',
      '.reseller-head','.reseller-card','.cta-box','.live-stat-card','.reviews-head',
      '.review-card','.top-spenders','.app-box','.panel','.package-card','.profile-card',
      '.section-card','.admin-card','.footer-grid > *'
    ];

    const nodes=[];
    revealSelectors.forEach(sel=>{
      document.querySelectorAll(sel).forEach((el,i)=>{
        if(el.closest('.hero')) return;
        if(el.classList.contains('l2k-reveal') || el.classList.contains('l2k-reveal-left') || el.classList.contains('l2k-reveal-right')) return;

        // Directional movement for some larger blocks, normal reveal for cards.
        if(sel.includes('footer-grid')) el.classList.add(i%2===0?'l2k-reveal-left':'l2k-reveal-right');
        else el.classList.add('l2k-reveal');

        el.classList.add('l2k-delay-'+((i%5)+1));
        nodes.push(el);
      });
    });

    if(!('IntersectionObserver' in window)){
      nodes.forEach(el=>el.classList.add('l2k-visible'));
      return;
    }

    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('l2k-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -25px 0px'});

    nodes.forEach(el=>observer.observe(el));
  }

  function initHeader(){
    const header=document.querySelector('.topbar');
    if(!header)return;
    const update=()=>header.classList.toggle('l2k-scrolled',window.scrollY>10);
    update();
    window.addEventListener('scroll',update,{passive:true});
  }

  function initMagneticButtons(){
    if(window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.hero-actions .btn').forEach(btn=>{
      btn.addEventListener('mousemove',e=>{
        const r=btn.getBoundingClientRect();
        const x=(e.clientX-r.left-r.width/2)*.08;
        const y=(e.clientY-r.top-r.height/2)*.10;
        btn.style.transform=`translate(${x}px,${y}px) translateY(-2px)`;
      });
      btn.addEventListener('mouseleave',()=>btn.style.transform='');
    });
  }

  function initTilt(){
    if(window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.service-card,.why-card,.live-stat-card').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const rx=((e.clientY-r.top)/r.height-.5)*-4;
        const ry=((e.clientX-r.left)/r.width-.5)*4;
        card.style.transform=`perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave',()=>card.style.transform='');
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    initReveal();
    initHeader();
    initMagneticButtons();
    initTilt();
  });
})();
