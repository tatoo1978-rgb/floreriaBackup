(function(){function L(){var g=document.querySelector('#galeria .gallery-grid');if(!g)return;var W=g.clientWidth;if(!W)return;var it=Array.prototype.slice.call(g.querySelectorAll('.gallery-item:not(.gallery-extra)'));var N=it.length;if(!N)return;var C=W<700?2:3;it.forEach(function(e){e.style.gridColumn='';});var r=N%C;if(r!==0){var base=Math.floor(C/r),extra=C%r,last=it.slice(N-r);last.forEach(function(e,i){e.style.gridColumn='span '+(base+(i<extra?1:0));});}}function S(){clearTimeout(window.__gT);window.__gT=setTimeout(L,80);}L();window.addEventListener('load',L);window.addEventListener('resize',S);})();

const header = document.getElementById("header");
  window.addEventListener("scroll", () => { header.classList.toggle("scrolled", window.scrollY > 20); }, {passive:true});
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileClose = document.getElementById("mobile-close");
  const closeMobileNav = () => { mobileNav.classList.remove("open"); hamburger.setAttribute("aria-expanded","false"); document.body.style.overflow=""; };
  hamburger.addEventListener("click", () => { mobileNav.classList.add("open"); hamburger.setAttribute("aria-expanded","true"); document.body.style.overflow="hidden"; });
  mobileClose.addEventListener("click", closeMobileNav);
  mobileNav.querySelectorAll(".mobile-link").forEach(l => l.addEventListener("click", closeMobileNav));
  const observer = new IntersectionObserver(entries => { entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add("visible"); observer.unobserve(e.target); } }); }, {threshold:0.12,rootMargin:"0px 0px -40px 0px"});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item"); const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => { i.classList.remove("open"); i.querySelector(".faq-question").setAttribute("aria-expanded","false"); });
      if(!isOpen){ item.classList.add("open"); btn.setAttribute("aria-expanded","true"); }
    });
  });
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".ribbon-track,.scroll-arrow").forEach(el => el.style.animation="none");
  }

  // SERVICES CAROUSEL — mobile only (max-width: 768px)
  (function() {
    var IDX = 0, TOTAL = 6, TIMER = null, SX = 0;

    function slide() {
      var track = document.getElementById('scTrack');
      if (!track) return;
      var slides = track.children;
      if (!slides.length) return;
      var vw = track.parentElement.offsetWidth;
      var active = slides[IDX];
      // Centrar la tarjeta activa midiendo su posición real en el layout
      var offset = active.offsetLeft + active.offsetWidth / 2 - vw / 2;
      track.style.transform = 'translateX(' + (-offset) + 'px)';
      for (var i = 0; i < slides.length; i++) slides[i].classList.toggle('sc-active', i === IDX);
      var dots = document.querySelectorAll('.sc-dot');
      for (var j = 0; j < dots.length; j++) dots[j].classList.toggle('active', j === IDX);
    }

    function goTo(n) { IDX = (n % TOTAL + TOTAL) % TOTAL; slide(); }
    function next()  { goTo(IDX + 1); }
    function prev()  { goTo(IDX - 1); }
    function auto()  { clearInterval(TIMER); TIMER = setInterval(next, 4000); }

    function init() {
      if (window.innerWidth > 768) return;
      var track = document.getElementById('scTrack');
      var dw    = document.getElementById('scDots');
      var bp    = document.getElementById('scPrev');
      var bn    = document.getElementById('scNext');
      if (!track || !dw) return;

      dw.innerHTML = '';
      for (var i = 0; i < TOTAL; i++) {
        (function(n) {
          var d = document.createElement('button');
          d.className = 'sc-dot' + (n === 0 ? ' active' : '');
          d.setAttribute('aria-label', 'Servicio ' + (n + 1));
          d.onclick = function() { goTo(n); auto(); };
          dw.appendChild(d);
        })(i);
      }

      if (bp) bp.onclick = function() { prev(); auto(); };
      if (bn) bn.onclick = function() { next(); auto(); };

      track.addEventListener('touchstart', function(e) { SX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', function(e) {
        var d = SX - e.changedTouches[0].clientX;
        if (Math.abs(d) > 40) { d > 0 ? next() : prev(); auto(); }
      }, { passive: true });

      goTo(0);
      auto();
      window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) slide();
      });
    }

    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', init)
      : init();
  })();


  // ── LIGHTBOX GALERÍA (reutilizable, escalable) ──────────────────────────
  (function() {
    var lb       = document.getElementById('lightbox');
    var lbImg    = document.getElementById('lightboxImg');
    var lbClose  = document.getElementById('lightboxClose');
    var lbPrev   = document.getElementById('lightboxPrev');
    var lbNext   = document.getElementById('lightboxNext');
    var lbCount  = document.getElementById('lightboxCounter');
    if (!lb || !lbImg) return;

    // Recolectar dinámicamente todas las imágenes de la galería
    // (cualquier cantidad — escalable sin tocar el JS)
    function getItems() {
      return Array.prototype.slice.call(
        document.querySelectorAll('#galeria .gallery-item img')
      );
    }

    var items = [];
    var idx   = 0;

    function open(i, list) {
      items = list || getItems();
      idx = i;
      show();
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function show() {
      if (!items.length) return;
      var img = items[idx];
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      lbCount.textContent = (idx + 1) + ' / ' + items.length;
      // Con una sola imagen: ocultar flechas y contador (vista simple, sin carrusel)
      var single = items.length < 2;
      lbNext.style.display = single ? 'none' : '';
      lbPrev.style.display = single ? 'none' : '';
      lbCount.style.display = single ? 'none' : '';
    }

    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function next() { if (items.length < 2) return; idx = (idx + 1) % items.length; show(); }
    function prev() { if (items.length < 2) return; idx = (idx - 1 + items.length) % items.length; show(); }

    // Delegación de eventos — funciona con cualquier cantidad de imágenes,
    // incluso las que se agreguen dinámicamente en el futuro
    var galeria = document.getElementById('galeria');
    if (galeria) {
      galeria.addEventListener('click', function(e) {
        var item = e.target.closest('.gallery-item');
        if (!item) return;
        var allItems = getItems();
        var clickedImg = item.querySelector('img');
        var i = allItems.indexOf(clickedImg);
        if (i !== -1) open(i);
      });
      // Accesibilidad: Enter/Space sobre item enfocado
      galeria.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var item = e.target.closest('.gallery-item');
        if (!item) return;
        e.preventDefault();
        var allItems = getItems();
        var i = allItems.indexOf(item.querySelector('img'));
        if (i !== -1) open(i);
      });
    }

    lbClose.addEventListener('click', close);
    lbNext.addEventListener('click', next);
    lbPrev.addEventListener('click', prev);

    // Visor reutilizable: otras secciones (p. ej. Productos Destacados)
    // pueden abrirlo pasando su propia lista de imágenes.
    window.__mlLightboxOpen = open;

    // Cerrar al hacer clic fuera de la imagen
    lb.addEventListener('click', function(e) {
      if (e.target === lb) close();
    });

    // Teclado: ESC cierra, flechas navegan
    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    });
  })();

(function(){
  var lb=document.getElementById('lightbox');
  if(!lb) return;
  var isTouch=window.matchMedia('(hover:none)').matches;
  // swipe horizontal para navegar
  var sx=null, sy=null;
  lb.addEventListener('touchstart',function(e){ if(e.touches.length!==1) return; sx=e.touches[0].clientX; sy=e.touches[0].clientY; },{passive:true});
  lb.addEventListener('touchend',function(e){
    if(sx===null) return;
    var dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy;
    sx=null; sy=null;
    if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy)*1.2) return;
    var btn=document.getElementById(dx<0?'lightboxNext':'lightboxPrev');
    if(btn) btn.click();
  },{passive:true});
  // aviso discreto la primera vez (solo táctil)
  var shown=false;
  var mo=new MutationObserver(function(){
    if(!lb.classList.contains('open')||shown||!isTouch) return;
    if(localStorage.getItem('ml_gal_hint')) { shown=true; return; }
    shown=true;
    try{ localStorage.setItem('ml_gal_hint','1'); }catch(e){}
    var h=document.createElement('div');
    h.className='lightbox-hint';
    h.textContent='Deslizá para ver más fotos';
    lb.appendChild(h);
    requestAnimationFrame(function(){ h.classList.add('show'); });
    setTimeout(function(){ h.classList.remove('show'); setTimeout(function(){ h.remove(); },500); },2600);
  });
  mo.observe(lb,{attributes:true,attributeFilter:['class']});
})();

