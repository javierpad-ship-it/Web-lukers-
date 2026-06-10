/* ============================================================
   LUKERS — Lógica de la tienda
   Catálogo, filtros, carrito (localStorage), tema, animaciones
   ============================================================ */

"use strict";

/* ---------- Datos del catálogo ---------- */
const PRODUCTS = [
  { id: 1,  name: "Terno Slim Fit Azul Marino",      brand: "Donatelli",   cat: "formal",     art: "terno",     price: 399, oldPrice: 899, tag: "Top ventas" },
  { id: 2,  name: "Terno Modern Fit Gris Acero",     brand: "Donatelli",   cat: "formal",     art: "terno",     price: 449, oldPrice: 949, tag: "" },
  { id: 3,  name: "Camisa Clásica Blanca",           brand: "John Holden", cat: "formal",     art: "camisa",    price: 79,  oldPrice: 159, tag: "Top ventas" },
  { id: 4,  name: "Camisa Slim Celeste",             brand: "John Holden", cat: "formal",     art: "camisa",    price: 89,  oldPrice: 169, tag: "" },
  { id: 5,  name: "Corbata Seda Burdeos",            brand: "John Holden", cat: "formal",     art: "correa",    price: 49,  oldPrice: 99,  tag: "" },
  { id: 6,  name: "Polo Piqué Navy",                 brand: "Nautica",     cat: "casual",     art: "polo",      price: 69,  oldPrice: 149, tag: "Nuevo" },
  { id: 7,  name: "Jean Straight Fit Índigo",        brand: "Levi's",      cat: "casual",     art: "jean",      price: 129, oldPrice: 259, tag: "" },
  { id: 8,  name: "Casaca Bomber Negra",             brand: "Tommy",       cat: "casual",     art: "casaca",    price: 199, oldPrice: 449, tag: "Nuevo" },
  { id: 9,  name: "Polo Básico Algodón Pima",        brand: "Polo Club",   cat: "casual",     art: "polo",      price: 39,  oldPrice: 79,  tag: "" },
  { id: 10, name: "Zapato de Vestir Oxford",         brand: "Donatelli",   cat: "calzado",    art: "zapato",    price: 159, oldPrice: 329, tag: "Top ventas" },
  { id: 11, name: "Zapatilla Urbana Blanca",         brand: "Nautica",     cat: "calzado",    art: "zapatilla", price: 139, oldPrice: 279, tag: "" },
  { id: 12, name: "Zapato Casual Chukka Marrón",     brand: "Dockers",     cat: "calzado",    art: "zapato",    price: 149, oldPrice: 299, tag: "" },
  { id: 13, name: "Correa de Cuero Reversible",      brand: "John Holden", cat: "accesorios", art: "correa",    price: 59,  oldPrice: 119, tag: "" },
  { id: 14, name: "Billetera Cuero Genuino",         brand: "Donatelli",   cat: "accesorios", art: "billetera", price: 69,  oldPrice: 139, tag: "" },
  { id: 15, name: "Reloj Acero Inoxidable",          brand: "Nautica",     cat: "accesorios", art: "reloj",     price: 249, oldPrice: 549, tag: "Nuevo" },
  { id: 16, name: "Camisa Casual a Cuadros",         brand: "Van Heusen",  cat: "casual",     art: "camisa",    price: 95,  oldPrice: 189, tag: "" },
];

const STORES = [
  { name: "Lukers San Miguel",       city: "Lima",     address: "Av. La Marina 1666, San Miguel" },
  { name: "Lukers Jr. de la Unión",  city: "Lima",     address: "Jr. de la Unión 455, Centro Histórico" },
  { name: "Lukers Chorrillos",       city: "Lima",     address: "Av. El Sol 1175, Chorrillos" },
  { name: "Lukers Breña",            city: "Lima",     address: "Av. Brasil 1099, Breña" },
  { name: "Lukers Lince",            city: "Lima",     address: "Av. Arequipa 1890, Lince" },
  { name: "Lukers Pueblo Libre",     city: "Lima",     address: "Av. Sucre 545, Pueblo Libre" },
  { name: "Lukers Independencia",    city: "Lima",     address: "Av. Carlos Izaguirre 210, Independencia" },
  { name: "Lukers Surco Outlet",     city: "Lima",     address: "Av. Tomás Marsano 3025, Surco" },
  { name: "Lukers Trujillo",         city: "Trujillo", address: "Jr. Pizarro 540, Centro de Trujillo" },
  { name: "Lukers Chiclayo",         city: "Chiclayo", address: "Av. Balta 1050, Chiclayo" },
  { name: "Lukers Tarapoto",         city: "Tarapoto", address: "Jr. San Martín 320, Tarapoto" },
  { name: "Lukers Iquitos",          city: "Iquitos",  address: "Jr. Próspero 615, Iquitos" },
];

const fmt = (n) => `S/ ${n.toFixed(2)}`;
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

/* ---------- Tema claro / oscuro ---------- */
const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("lukers-theme");
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.dataset.theme = "dark";
}
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("lukers-theme", next);
});

/* ---------- Header, menú móvil y back-to-top ---------- */
const header = $("#header");
const backTop = $("#backTop");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
  backTop.classList.toggle("visible", window.scrollY > 600);
}, { passive: true });
backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const hamburger = $("#hamburger");
const navLinks = $("#navLinks");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  }
});

/* Resaltar enlace activo según sección visible */
const sections = $$("main section[id]");
const linkMap = new Map($$(".nav-links a").map((a) => [a.getAttribute("href").slice(1), a]));
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && linkMap.has(entry.target.id)) {
      linkMap.forEach((a) => a.classList.remove("active"));
      linkMap.get(entry.target.id).classList.add("active");
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach((s) => sectionObserver.observe(s));

/* ---------- Animaciones de scroll (reveal) ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Contadores animados del hero ---------- */
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.6 });
$$("[data-count]").forEach((el) => statObserver.observe(el));

/* ---------- Cuenta regresiva de la promo ---------- */
function startCountdown() {
  // La promo termina al final de la semana en curso (domingo 23:59)
  const end = new Date();
  end.setDate(end.getDate() + (7 - end.getDay()) % 7 || 7);
  end.setHours(23, 59, 59, 0);

  const pad = (n) => String(n).padStart(2, "0");
  const update = () => {
    const diff = Math.max(0, end - Date.now());
    $("#cdDays").textContent = pad(Math.floor(diff / 864e5));
    $("#cdHours").textContent = pad(Math.floor(diff / 36e5) % 24);
    $("#cdMins").textContent = pad(Math.floor(diff / 6e4) % 60);
    $("#cdSecs").textContent = pad(Math.floor(diff / 1e3) % 60);
  };
  update();
  setInterval(update, 1000);
}
startCountdown();

/* ---------- Catálogo: render, filtros, orden y búsqueda ---------- */
const productGrid = $("#productGrid");
const emptyMsg = $("#emptyMsg");
let activeFilter = "todos";
let activeSort = "relevancia";
let searchTerm = "";

function getVisibleProducts() {
  let list = PRODUCTS.filter((p) => activeFilter === "todos" || p.cat === activeFilter);
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    list = list.filter((p) =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.cat.includes(q)
    );
  }
  const off = (p) => 1 - p.price / p.oldPrice;
  switch (activeSort) {
    case "precio-asc": list.sort((a, b) => a.price - b.price); break;
    case "precio-desc": list.sort((a, b) => b.price - a.price); break;
    case "descuento": list.sort((a, b) => off(b) - off(a)); break;
  }
  return list;
}

function renderProducts() {
  const list = getVisibleProducts();
  emptyMsg.hidden = list.length > 0;
  productGrid.innerHTML = list.map((p, i) => {
    const off = Math.round((1 - p.price / p.oldPrice) * 100);
    return `
      <article class="product-card" style="animation-delay:${i * 0.04}s">
        <div class="product-art" data-art="${p.art}">
          <span class="badge-off">-${off}%</span>
          ${p.tag ? `<span class="badge-tag">${p.tag}</span>` : ""}
        </div>
        <div class="product-body">
          <span class="product-brand">${p.brand}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-prices">
            <span class="price-now">${fmt(p.price)}</span>
            <span class="price-old">${fmt(p.oldPrice)}</span>
          </div>
          <button class="add-btn" data-add="${p.id}">Agregar al carrito</button>
        </div>
      </article>`;
  }).join("");
}

$("#filterPills").addEventListener("click", (e) => {
  const btn = e.target.closest(".pill");
  if (!btn) return;
  $$("#filterPills .pill").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  renderProducts();
});

$("#sortSelect").addEventListener("change", (e) => {
  activeSort = e.target.value;
  renderProducts();
});

$("#searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value.trim();
  renderProducts();
  if (searchTerm) $("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
});

/* Clic en una tarjeta de categoría filtra el catálogo */
$$(".cat-card").forEach((card) => {
  card.addEventListener("click", () => {
    const pill = document.querySelector(`#filterPills .pill[data-filter="${card.dataset.cat}"]`);
    if (pill) pill.click();
  });
});

/* ---------- Carrito ---------- */
let cart = JSON.parse(localStorage.getItem("lukers-cart") || "[]");

const cartDrawer = $("#cartDrawer");
const cartOverlay = $("#cartOverlay");

function saveCart() {
  localStorage.setItem("lukers-cart", JSON.stringify(cart));
}

function openCart(open) {
  cartDrawer.classList.toggle("open", open);
  cartOverlay.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);

  const badge = $("#cartCount");
  badge.textContent = count;
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 220);

  $("#cartTotal").textContent = fmt(total);

  const box = $("#cartItems");
  if (!cart.length) {
    box.innerHTML = `<p class="cart-empty">Tu carrito está vacío 🛒<br /><small>Agrega productos del catálogo</small></p>`;
    return;
  }
  box.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div class="product-art" data-art="${item.art}"></div>
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${fmt(item.price)} c/u</div>
        <div class="qty-controls">
          <button data-qty="-1" data-id="${item.id}" aria-label="Quitar uno">−</button>
          <span>${item.qty}</span>
          <button data-qty="1" data-id="${item.id}" aria-label="Agregar uno">+</button>
        </div>
      </div>
      <button class="remove-item" data-remove="${item.id}" aria-label="Eliminar del carrito">🗑</button>
    </div>`).join("");
}

function addToCart(id) {
  const product = PRODUCTS.find((p) => p.id === id);
  const existing = cart.find((i) => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ id: product.id, name: product.name, price: product.price, art: product.art, qty: 1 });
  saveCart();
  renderCart();
  showToast(`✓ "${product.name}" agregado al carrito`);
}

productGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(+btn.dataset.add);
});

$("#cartItems").addEventListener("click", (e) => {
  const qtyBtn = e.target.closest("[data-qty]");
  const removeBtn = e.target.closest("[data-remove]");
  if (qtyBtn) {
    const item = cart.find((i) => i.id === +qtyBtn.dataset.id);
    item.qty += +qtyBtn.dataset.qty;
    if (item.qty <= 0) cart = cart.filter((i) => i !== item);
  }
  if (removeBtn) cart = cart.filter((i) => i.id !== +removeBtn.dataset.remove);
  if (qtyBtn || removeBtn) { saveCart(); renderCart(); }
});

$("#cartBtn").addEventListener("click", () => openCart(true));
$("#cartClose").addEventListener("click", () => openCart(false));
cartOverlay.addEventListener("click", () => openCart(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") openCart(false); });

$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) { showToast("Tu carrito está vacío"); return; }
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  cart = [];
  saveCart();
  renderCart();
  openCart(false);
  showToast(`🎉 ¡Gracias por tu compra de ${fmt(total)}! (demo)`);
});

/* ---------- Tiendas ---------- */
function renderStores(city = "todas") {
  const list = STORES.filter((s) => city === "todas" || s.city === city);
  $("#storeGrid").innerHTML = list.map((s, i) => `
    <div class="store-card" style="animation-delay:${i * 0.05}s">
      <span class="store-city">${s.city}</span>
      <h3>${s.name}</h3>
      <p>📍 ${s.address}</p>
      <p class="hours">🕙 Lun a Dom · 10:00 a.m. – 10:00 p.m.</p>
    </div>`).join("");
}

$("#storeTabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".store-tab");
  if (!tab) return;
  $$("#storeTabs .store-tab").forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  renderStores(tab.dataset.city);
});

/* ---------- Newsletter ---------- */
$("#newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#newsletterEmail");
  const msg = $("#formMsg");
  const email = input.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    msg.textContent = "✗ Ingresa un correo válido";
    return;
  }
  msg.textContent = "✓ ¡Listo! Te llegarán nuestras mejores ofertas.";
  input.value = "";
  showToast("🎉 ¡Bienvenido al club Lukers!");
});

/* ---------- Toast ---------- */
let toastTimer;
function showToast(text) {
  const toast = $("#toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
renderStores();
