'use strict';
const products = [
  {id:'mouse',name:'Quantum X Mouse',category:'Periféricos',price:59.99,tag:'PRECISIÓN TOTAL',spec:'20.000 DPI · 8 botones · RGB',description:'Control preciso para tus partidas y un diseño liviano que acompaña cada movimiento.',features:['Sensor óptico de 20.000 DPI','8 botones programables','Conexión USB y luz RGB']},
  {id:'keyboard',name:'MechForce Pro Keyboard',category:'Periféricos',price:129.99,tag:'FAVORITO NEO',spec:'Switches ópticos · Aluminio · RGB',description:'Una respuesta definida en cada tecla. Un teclado pensado para jugar y crear durante horas.',features:['Switches ópticos','Estructura de aluminio','Iluminación RGB por tecla']},
  {id:'headset',name:'AudioPhase VR Headset',category:'Periféricos',price:89.99,tag:'INMERSIÓN TOTAL',spec:'Sonido 7.1 · Micrófono · Memory foam',description:'Escuchá cada detalle de tu partida y coordiná con tu equipo con claridad.',features:['Sonido envolvente virtual 7.1','Micrófono con reducción de ruido','Almohadillas de espuma viscoelástica']},
  {id:'tower',name:'Nova Core RGB Case',category:'Componentes',price:149.99,tag:'TU PRÓXIMA BUILD',spec:'Formato ATX · 3 ventiladores · RGB',description:'Dale a tu próxima computadora un espacio con estilo. Gabinete sin componentes internos incluidos.',features:['Compatible con placas ATX y microATX','3 ventiladores RGB incluidos','Panel lateral transparente; no incluye CPU, GPU ni fuente']},
  {id:'microphone',name:'StreamCast One',category:'Streaming',price:79.99,tag:'DALE PLAY A TU VOZ',spec:'USB · Patrón cardioide · Base incluida',description:'Tu voz al frente en transmisiones, llamadas y grabaciones, con una conexión sencilla.',features:['Conexión USB','Captación cardioide','Control de volumen y soporte de escritorio']},
  {id:'chair',name:'NeoSeat Pro',category:'Sillas',price:249.99,tag:'TU LUGAR EN EL JUEGO',spec:'Reclinable · Soporte lumbar · Ajustable',description:'Completá tu espacio con una silla ajustable que se adapta a tu escritorio.',features:['Respaldo reclinable','Soporte lumbar','Altura ajustable y base de cinco ruedas']}
];
const $ = selector => document.querySelector(selector);
const money = cents => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents / 100);
const cost = product => Math.round(product.price * 100);
const storageKey = 'neogamer-cart-v1';
let cart = {};
let storageAvailable = true;
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
    for (const p of products) if (Number.isInteger(stored[p.id]) && stored[p.id] > 0) cart[p.id] = Math.min(99, stored[p.id]);
  }
} catch { storageAvailable = false; }
let category = 'Todos';
let toastTimer;
function notify(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200);
}
function saveCart() {
  try { localStorage.setItem(storageKey, JSON.stringify(cart)); storageAvailable = true; }
  catch { storageAvailable = false; }
  renderCart();
}
function add(id) {
  if (!products.some(p => p.id === id)) return;
  if ((cart[id] || 0) >= 99) { notify('El máximo por producto es 99 unidades.'); return; }
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  notify(storageAvailable ? 'Equipo agregado a tu carrito.' : 'Agregado. El carrito solo se conservará durante esta visita.');
}
const normalized = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function renderProducts() {
  const query = normalized($('#search').value.trim());
  let selected = products.filter(p => (category === 'Todos' || p.category === category) && normalized(`${p.name} ${p.category} ${p.spec}`).includes(query));
  if ($('#sort').value !== 'featured') selected.sort((a,b) => $('#sort').value === 'asc' ? a.price-b.price : b.price-a.price);
  $('#products').innerHTML = selected.map(p => `<article class="product-card"><button class="product-image" data-detail="${p.id}" aria-label="Ver detalles de ${p.name}"><span class="product-tag">${p.tag}</span><img src="assets/${p.id}.svg" alt="Ilustración de ${p.name}" width="400" height="300" loading="lazy"></button><div class="product-content"><p class="product-category">${p.category}</p><h3><button class="product-name" data-detail="${p.id}">${p.name}</button></h3><p class="product-spec">${p.spec}</p><div class="product-bottom"><span class="price">${money(cost(p))}<small>USD</small></span><button class="add-button" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito">Agregar +</button></div></div></article>`).join('');
  $('#result-count').textContent = `${selected.length} ${selected.length === 1 ? 'equipo disponible' : 'equipos disponibles'} · Productos ilustrativos`;
  $('#empty').hidden = selected.length > 0;
  document.querySelectorAll('[data-filter]').forEach(b => { const active = b.dataset.filter === category; b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active)); });
}
function filter(value) { category = value; renderProducts(); }
function renderCart() {
  const selected = products.filter(p => cart[p.id]);
  const quantity = selected.reduce((n,p) => n + cart[p.id],0);
  $('#cart-count').textContent = quantity;
  $('#open-cart').setAttribute('aria-label',`Abrir carrito, ${quantity} productos`);
  $('#cart-items').innerHTML = selected.length ? selected.map(p => `<div class="cart-row"><img src="assets/${p.id}.svg" alt="" width="60" height="60"><div><h3>${p.name}</h3><p>${money(cost(p))} por unidad</p><div class="quantity-controls"><button data-change="${p.id}" data-delta="-1" aria-label="Reducir cantidad de ${p.name}" ${cart[p.id] === 1 ? 'disabled' : ''}>−</button><span aria-label="Cantidad">${cart[p.id]}</span><button data-change="${p.id}" data-delta="1" aria-label="Aumentar cantidad de ${p.name}" ${cart[p.id] === 99 ? 'disabled' : ''}>+</button><button class="remove-item" data-remove="${p.id}" aria-label="Eliminar ${p.name}">Eliminar</button></div></div><strong>${money(cost(p)*cart[p.id])}</strong></div>`).join('') : '<div class="empty-state"><h3>Tu próximo setup te espera</h3><p>Explorá el catálogo y agregá tu primer equipo.</p><button class="button secondary" id="continue-shopping">Explorar catálogo →</button></div>';
  $('#cart-summary').hidden = !selected.length;
  $('#cart-total').textContent = money(selected.reduce((n,p) => n + cost(p)*cart[p.id],0));
}
function detail(id) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  $('#product-detail').innerHTML = `<img src="assets/${p.id}.svg" alt="Ilustración de ${p.name}"><p class="eyebrow">${p.category}</p><h2 id="product-title">${p.name}</h2><p>${p.description}</p><ul>${p.features.map(f=>`<li>${f}</li>`).join('')}</ul><div class="price">${money(cost(p))} <small>USD</small></div><p class="muted">Producto ficticio para demostración.</p><button class="button primary full" data-add="${p.id}">Agregar al carrito +</button>`;
  $('#product-dialog').showModal();
}
document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.add) { add(b.dataset.add); if ($('#product-dialog').open) $('#product-dialog').close(); }
  if (b.dataset.detail) detail(b.dataset.detail);
  if (b.dataset.filter) filter(b.dataset.filter);
  if (b.dataset.category) { $('#search').value = ''; filter(b.dataset.category); $('#featured').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); }
  if (b.dataset.change) {
    const id = b.dataset.change;
    cart[id] = Math.max(1,Math.min(99, cart[id]+Number(b.dataset.delta)));
    saveCart();
    const replacement = document.querySelector(`[data-change="${id}"][data-delta="${b.dataset.delta}"]`);
    if (replacement && !replacement.disabled) replacement.focus();
    else document.querySelector(`[data-remove="${id}"]`)?.focus();
  }
  if (b.dataset.remove) { delete cart[b.dataset.remove]; saveCart(); $('#cart-dialog .close-dialog').focus(); }
  if (b.classList.contains('close-dialog')) b.closest('dialog').close();
  if (b.id === 'continue-shopping') { $('#cart-dialog').close(); $('#featured').scrollIntoView(); }
});
$('#open-cart').addEventListener('click', () => { renderCart(); $('#cart-dialog').showModal(); });
$('#clear-cart').addEventListener('click', () => { cart = {}; saveCart(); $('#continue-shopping').focus(); });
$('#search').addEventListener('input', renderProducts);
$('#sort').addEventListener('change', renderProducts);
$('#reset-filters').addEventListener('click', () => { $('#search').value = ''; $('#sort').value = 'featured'; filter('Todos'); $('#search').focus(); });
const toggle = $('.menu-toggle');
function closeMenu() { $('#navigation').classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Abrir menú'); }
toggle.addEventListener('click', () => { const open = $('#navigation').classList.toggle('open'); toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open ? 'Cerrar menú' : 'Abrir menú'); });
$('#navigation').addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#navigation').classList.contains('open')) { closeMenu(); toggle.focus(); } });
document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { const r = d.getBoundingClientRect(); if (e.target === d && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) d.close(); }));
$('#download-cart').addEventListener('click', () => {
  const selected = products.filter(p => cart[p.id]);
  if (!selected.length) return;
  const lines = ['NEOGAMER HUB — RESUMEN DE SELECCIÓN','DEMOSTRACIÓN: no es una compra ni una confirmación de pedido.','', ...selected.map(p => `${cart[p.id]} × ${p.name} — ${money(cost(p)*cart[p.id])} USD`),'',`Total ilustrativo: ${money(selected.reduce((n,p)=>n+cost(p)*cart[p.id],0))} USD`,'No se calculan impuestos ni envío. No se ha realizado ningún cobro.'];
  const url = URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'neogamer-mi-setup.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
});
window.addEventListener('storage', e => { if (e.key === storageKey || e.key === null) { try { const value = JSON.parse(localStorage.getItem(storageKey) || '{}'); cart = {}; if(value && typeof value === 'object') for(const p of products) if(Number.isInteger(value[p.id]) && value[p.id] > 0) cart[p.id] = Math.min(99,value[p.id]); renderCart(); } catch { /* Preserve current cart if another tab writes invalid data. */ } } });
$('#year').textContent = new Date().getFullYear();
renderProducts(); renderCart();
