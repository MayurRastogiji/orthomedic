// Handles dynamic rendering of product catalogue, product detail page and UI interactions.

(function(){
  const PHONE = "+91XXXXXXXXXX";

  function q(sel){ return document.querySelector(sel); }
  function qa(sel){ return Array.from(document.querySelectorAll(sel)); }

  function buildProductCard(p){
    const a = document.createElement('a');
    a.href = `product-detail.html?id=${encodeURIComponent(p.id)}`;
    a.className = "product-card";
    a.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.shortDescription}</p>
      <div style="display:flex;gap:.5rem;margin-top:.6rem;">
        <a class="btn btn-ghost" href="product-detail.html?id=${encodeURIComponent(p.id)}">View Details</a>
      </div>
    `;
    return a;
  }

  // Render products on products.html
  function renderProductsList(){
    const grid = q('#productsGrid');
    if(!grid || !window.PRODUCTS) return;
    grid.innerHTML = '';
    PRODUCTS.forEach(p => {
      const col = buildProductCard(p);
      grid.appendChild(col);
    });
  }

  // Render product detail based on ?id=slug
  function renderProductDetail(){
    if(!window.PRODUCTS) return;
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if(!id) return;
    const product = PRODUCTS.find(x => x.id === id);
    if(!product){
      q('.product-detail').innerHTML = '<p>Product not found.</p>';
      return;
    }

    document.getElementById('metaTitle').textContent = `${product.name} | Orthomedic`;
    document.getElementById('metaDescription').setAttribute('content', product.shortDescription);
    document.getElementById('crumbName').textContent = product.name;
    document.getElementById('prodName').textContent = product.name;
    document.getElementById('prodShort').textContent = product.shortDescription;
    document.getElementById('prodImage').src = product.image;
    document.getElementById('prodImage').alt = product.name;

    // Features
    const feats = document.getElementById('prodFeatures');
    feats.innerHTML = '';
    (product.features || []).forEach(f=>{
      const li = document.createElement('li'); li.textContent = f; feats.appendChild(li);
    });

    document.getElementById('prodFull').textContent = product.fullDescription || '';
    document.getElementById('prodIdeal').innerHTML = `<strong>Ideal For:</strong> ${product.idealFor || ''}`;

    const care = document.getElementById('prodCare');
    care.innerHTML = '';
    (product.careInstructions || []).forEach(ci=>{
      const li = document.createElement('li'); li.textContent = ci; care.appendChild(li);
    });

    // Thumbs (repeat same image for demo)
    const thumbsWrap = q('#thumbs');
    thumbsWrap.innerHTML = '';
    for(let i=0;i<3;i++){
      const t = document.createElement('img');
      t.src = product.image;
      t.alt = product.name + ' view ' + (i+1);
      t.addEventListener('click', ()=> {
        q('.gallery .main-img img').src = t.src;
      });
      thumbsWrap.appendChild(t);
    }

    // CTA links
    const message = encodeURIComponent(product.whatsappMessageText || `Hi, I’m interested in Orthomedic ${product.name}. Please share details.`);
    q('#whatsappBtn').setAttribute('href', `https://wa.me/91${PHONE.replace(/[^\d]/g,'')}?text=${message}`);
    q('#callBtn').setAttribute('href', `tel:${PHONE}`);
  }

  // Contact form handling (no backend)
  function bindContactForm(){
    const form = q('#contactForm');
    if(!form) return;
    const notice = q('#contactNotice');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const message = form.message.value.trim();
      if(!name || !phone || !message){ notice.hidden=false; notice.textContent = 'Please fill in all fields.'; return; }
      notice.hidden=false;
      notice.textContent = 'Thanks! Your message has been received. We will contact you shortly.';
      form.reset();
    });
  }

  // Basic accessibility: close mobile nav on link click (if implemented)
  function smallUI(){
    // placeholder for small UX tweaks
  }

  // Init per page
  document.addEventListener('DOMContentLoaded', function(){
    const page = document.body.dataset.page;
    if(page === 'products') renderProductsList();
    if(page === 'product-detail') renderProductDetail();
    if(page === 'contact') bindContactForm();

    // common: make product cards navigable via keyboard
    qa('.product-card').forEach(card=>{
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { window.location = card.querySelector('a')?.href || card.href; }});
    });
  });

})();