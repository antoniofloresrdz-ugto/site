// script.js - loads data.json and populates the pages
async function loadData(){
    const res = await fetch('data.json');
    const data = await res.json();
    window.storeData = data;
    populateHeaderFooter(data.store);
    const page = document.body.getAttribute('data-page');
    if(page === 'home') populateHome(data);
    if(page === 'product') populateProduct(data);

    
    const htmlToInsert = `
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T5ZLNV3V');</script>
<!-- End Google Tag Manager -->
`;

document.head.insertAdjacentHTML('beforeend', htmlToInsert);
}

function populateHeaderFooter(store){
    // header
    document.getElementById('logo-text').textContent = store.logo_text;
    document.getElementById('store-name').textContent = store.name;
    document.getElementById('store-contact').textContent = store.phone + ' · ' + store.email;
    // footer
    document.getElementById('copyright').textContent = store.copyright;
    document.getElementById('socials').innerHTML = '';
    for(const [k,v] of Object.entries(store.socials)){
        const a = document.createElement('a');
        a.href = v; a.target='_blank'; a.rel='noopener';
        a.textContent = k;
        a.style.marginLeft = '10px';
        a.style.color = '#fff';
        document.getElementById('socials').appendChild(a);
    }
}

function populateHome(data){
    // slider
    const slides = document.querySelector('.slides');
    data.home.banners.forEach(src=>{
        const div = document.createElement('div');
        div.className='slide';
        const img = document.createElement('img');
        img.src = src; img.style.width='100%'; img.style.height='320px'; img.style.objectFit='cover';
        div.appendChild(img);
        slides.appendChild(div);
    });
    // simple slider auto
    let idx=0; setInterval(()=>{
        idx = (idx+1) % data.home.banners.length;
        slides.style.transform = `translateX(-${idx*100}%)`;
    },4000);

    // featured products mini catalog
    const catalog = document.getElementById('catalog');
    data.products.forEach(p=>{
        const card = document.createElement('div'); card.className='card';
        const img = document.createElement('img'); img.src = p.images[0]; img.onclick = function(){ window.location.href = p.id + '.html'; }
        const h3 = document.createElement('h3'); h3.textContent = p.name;
        const pdesc = document.createElement('p'); pdesc.textContent = p.short_description;
        const price = document.createElement('div'); price.className='price'; price.textContent = p.price;
        // const a = document.createElement('a'); a.href = `product.html?id=${p.id}`; a.textContent='Ver producto';
        const a = document.createElement('a'); a.href = `${p.id}.html`; a.textContent='Ver producto';
        card.append(img,h3,pdesc,price,a);
        catalog.appendChild(card);
    });
}

function getParam(name){
    // const url = new URL(location.href);
    // return url.searchParams.get(name);
    var path = window.location.pathname;
    var file = path.substring( path.lastIndexOf('/') + 1 );
    return file.split( '.' )[0];
}

function populateProduct(data){
    const id = getParam('id');
    const product = data.products.find(p=>p.id===id);
    if(!product){ document.getElementById('main').innerHTML='<p>Producto no encontrado</p>'; return; }
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-title2').textContent = product.name;
    document.getElementById('product-price').textContent = product.price;
    // images
    const gallery = document.getElementById('gallery');
    product.images.forEach(src=>{
        const img = document.createElement('img'); img.src = src;
        gallery.appendChild(img);
    });
    // characteristics
    const ul = document.getElementById('spec-list');
    product.characteristics.forEach(ch=>{
        const li = document.createElement('li'); li.textContent = ch;
        ul.appendChild(li);
    });
    // video
    const vid = document.getElementById('product-video');
    vid.src = product.video;

    // comments (from JSON)
    const cm = document.getElementById('comments-list');
    product.comments.forEach(c=>{
        const div = document.createElement('div'); div.className='comment';
        div.innerHTML = `<strong>${c.user}</strong> <small style="color:#666">(${c.date})</small><p>${c.text}</p>`;
        cm.appendChild(div);
    });
}

window.addEventListener('DOMContentLoaded', loadData);
