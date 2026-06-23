const AGE_KEY = "leaflock-age-verified";

function initAgeGate() {
  const gate = document.getElementById("age-gate");
  const yes = document.getElementById("age-yes");
  if (!gate || !yes) return;
  if (localStorage.getItem(AGE_KEY) === "yes") return;
  gate.hidden = false;
  document.body.style.overflow = "hidden";
  yes.addEventListener("click", () => {
    localStorage.setItem(AGE_KEY, "yes");
    gate.hidden = true;
    document.body.style.overflow = "";
  });
}

function setMenuOpen(open) {
  const btn = document.getElementById("menu-btn");
  const nav = document.getElementById("main-nav");
  const overlay = document.getElementById("menu-overlay");
  if (!btn || !nav) return;
  nav.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
  if (overlay) overlay.hidden = !open;
}

function refreshHeaderOffset() {
  const header = document.getElementById("site-header");
  if (!header) return;
  document.documentElement.style.setProperty("--header-offset", `${header.offsetHeight}px`);
}

function initHeaderOffset() {
  const header = document.getElementById("site-header");
  if (!header) return;
  refreshHeaderOffset();
  window.addEventListener("resize", refreshHeaderOffset);
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(refreshHeaderOffset);
    ro.observe(header);
  }
}

function initMenu() {
  const btn = document.getElementById("menu-btn");
  const nav = document.getElementById("main-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    setMenuOpen(!nav.classList.contains("open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  const overlay = document.getElementById("menu-overlay");
  overlay?.addEventListener("click", () => setMenuOpen(false));

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("open")) return;
    if (nav.contains(event.target) || btn.contains(event.target)) return;
    setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) setMenuOpen(false);
  });

  window.addEventListener("orientationchange", () => {
    requestAnimationFrame(() => {
      refreshHeaderOffset();
      if (window.innerWidth > 1100) setMenuOpen(false);
    });
  });
}

function productCard(product, { rail = false } = {}) {
  const sale = product.compareAt
    ? `<span class="sale-tag">${product.badge || "Sale"}</span>`
    : product.badge
      ? `<span class="sale-tag">${product.badge}</span>`
      : "";
  const compare = product.compareAt
    ? `<p class="price"><s>${window.formatMoney(product.compareAt)}</s> ${window.formatMoney(product.price)}</p>`
    : `<p class="price">${product.priceLabel}</p>`;
  const cls = rail ? "product-card product-card--rail" : "product-card";
  return `
    <article class="${cls}">
      <a href="product.html?id=${product.id}">
        ${sale}
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>
      <div class="product-body">
        <p class="product-cat">${product.categoryLabel}</p>
        <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
        ${compare}
        <button class="btn btn-small" type="button" data-quick-add="${product.id}">Cop it</button>
      </div>
    </article>`;
}

function bindQuickAdd(root = document) {
  root.querySelectorAll("[data-quick-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = window.getProduct(btn.dataset.quickAdd);
      if (!product) return;
      window.LeafLockStore.addToCart({
        productId: product.id,
        variantId: product.variants[0].id,
        qty: 1
      });
      showToast(`${product.name} added to cart`);
      window.updateCartBadge?.();
    });
  });
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

function initHome() {
  const popular = document.getElementById("popular-products");
  if (!popular) return;
  const picks = ["humidity-pack-62", "gummy-mix-90g", "branch-whisperers", "master-ties", "humidity-pack-62", "gummy-mix-90g"];
  popular.innerHTML = picks
    .map((id) => window.getProduct(id))
    .filter(Boolean)
    .map((p) => productCard(p, { rail: true }))
    .join("");
  bindQuickAdd(popular);
  initReveal();
  initHeroParallax();
}

function initDropCountdown() {
  const el = document.getElementById("drop-countdown");
  if (!el) return;
  function tick() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const diff = end - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    el.textContent = `Ends ${h}:${m}:${s}`;
  }
  tick();
  clearInterval(window._dropTimer);
  window._dropTimer = setInterval(tick, 1000);
}
window.initDropCountdown = initDropCountdown;

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

function initHeroParallax() {
  const hero = document.querySelector(".hero-full");
  const watermark = document.querySelector(".hero-watermark");
  if (!hero || !watermark) return;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y > window.innerHeight) return;
      watermark.style.transform = `translateX(${y * 0.15}px)`;
    },
    { passive: true }
  );
}

function initShop() {
  const grid = document.getElementById("shop-grid");
  const filters = document.getElementById("shop-filters");
  const title = document.getElementById("shop-title");
  if (!grid || !filters) return;

  const params = new URLSearchParams(location.search);
  let activeCat = params.get("cat") || "all";
  let query = (params.get("q") || "").toLowerCase().trim();

  function render() {
    const products = window.LEAFLOCK_PRODUCTS.filter((product) => {
      const catMatch = activeCat === "all" || product.category === activeCat;
      const queryMatch = !query || product.name.toLowerCase().includes(query);
      return catMatch && queryMatch;
    });
    grid.innerHTML = products.length
      ? products.map(productCard).join("")
      : `<div class="empty">No products match your filters.</div>`;
    bindQuickAdd(grid);
    const cat = window.LEAFLOCK_CATEGORIES.find((c) => c.id === activeCat);
    if (title) title.textContent = cat?.label || "All products";
  }

  filters.innerHTML = window.LEAFLOCK_CATEGORIES.map(
    (cat) => `<button type="button" class="filter-btn${cat.id === activeCat ? " active" : ""}" data-cat="${cat.id}">${cat.label}</button>`
  ).join("");

  filters.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-cat]");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    filters.querySelectorAll(".filter-btn").forEach((el) => el.classList.toggle("active", el.dataset.cat === activeCat));
    render();
  });

  const search = document.getElementById("shop-search");
  if (search) {
    search.value = query;
    search.addEventListener("input", () => {
      query = search.value.toLowerCase().trim();
      render();
    });
  }

  render();
}

function initProduct() {
  const root = document.getElementById("product-page");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const product = window.getProduct(id);
  if (!product) {
    root.innerHTML = `<div class="empty">Product not found. <a href="shop.html">Back to shop</a></div>`;
    return;
  }

  let selectedVariant = product.variants[0];
  const hasMultipleImages = product.images.length > 1;

  root.innerHTML = `
    <nav class="breadcrumb"><a href="index.html">Home</a> / <a href="shop.html?cat=${product.category}">${product.categoryLabel}</a> / <span>${product.name}</span></nav>
    <div class="product-layout">
      <div class="product-gallery">
        <div class="product-media">
          <img id="product-main-image" src="${product.images[0]}" alt="${product.name}">
        </div>
        ${hasMultipleImages ? `<div class="thumb-row">${product.images.map((img, i) => `<button type="button" class="thumb${i === 0 ? " active" : ""}" data-img="${img}"><img src="${img}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="product-info">
        <p class="eyebrow">${product.categoryLabel}</p>
        <h1>${product.name}</h1>
        <p class="product-lead">${product.description}</p>
        <div class="product-price-row">
          <strong id="product-price">${window.formatMoney(selectedVariant.price)}</strong>
          ${product.compareAt ? `<s>${window.formatMoney(product.compareAt)}</s>` : ""}
        </div>
        ${product.variants.length > 1 ? `
          <label class="field">
            <span>Choose option</span>
            <select id="variant-select">
              ${product.variants.map((v) => `<option value="${v.id}">${v.label} — ${window.formatMoney(v.price)}</option>`).join("")}
            </select>
          </label>` : ""}
        <label class="field qty-field">
          <span>Quantity</span>
          <div class="qty-control">
            <button type="button" id="qty-minus" aria-label="Decrease">−</button>
            <input id="qty-input" type="number" min="1" value="1">
            <button type="button" id="qty-plus" aria-label="Increase">+</button>
          </div>
        </label>
        <div class="product-buy-actions">
          <button class="btn btn-primary btn-wide" id="add-to-cart" type="button">Add to bag</button>
        </div>
        <ul class="feature-list">${product.features.map((f) => `<li>${f}</li>`).join("")}</ul>
        <div class="product-trust">
          <span>Ships Australia-wide</span>
          <span>30-day returns</span>
          <span>Secure checkout</span>
        </div>
      </div>
    </div>`;

  const priceEl = document.getElementById("product-price");
  const variantSelect = document.getElementById("variant-select");
  const qtyInput = document.getElementById("qty-input");

  if (variantSelect) {
    variantSelect.addEventListener("change", () => {
      selectedVariant = product.variants.find((v) => v.id === variantSelect.value);
      priceEl.textContent = window.formatMoney(selectedVariant.price);
    });
  }

  document.getElementById("qty-minus")?.addEventListener("click", () => {
    qtyInput.value = String(Math.max(1, Number(qtyInput.value) - 1));
  });
  document.getElementById("qty-plus")?.addEventListener("click", () => {
    qtyInput.value = String(Number(qtyInput.value) + 1);
  });

  root.querySelectorAll(".thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("product-main-image").src = btn.dataset.img;
      root.querySelectorAll(".thumb").forEach((el) => el.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  document.getElementById("add-to-cart").addEventListener("click", () => {
    window.LeafLockStore.addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      qty: Number(qtyInput.value) || 1
    });
    showToast("Added to cart");
    window.updateCartBadge?.();
  });
}

function initCart() {
  const root = document.getElementById("cart-page");
  if (!root) return;

  function render() {
    const items = window.LeafLockStore.readCart();
    const subtotal = window.LeafLockStore.cartSubtotal(items);
    const shipping = subtotal >= 200 || subtotal === 0 ? 0 : 12.5;
    const total = subtotal + shipping;

    if (!items.length) {
      root.innerHTML = `
        <div class="empty cart-empty">
          <h1>Your cart is empty</h1>
          <p>Add humidity packs, gummies, or grow tools to get started.</p>
          <a class="btn btn-primary" href="shop.html">Browse shop</a>
        </div>`;
      return;
    }

    root.innerHTML = `
      <h1>Your cart</h1>
      <div class="cart-layout">
        <div class="cart-lines">
          ${items.map((item) => `
            <article class="cart-line">
              <div class="cart-thumb"><img src="${item.image}" alt=""></div>
              <div>
                <h3>${item.name}</h3>
                <p>${item.variantLabel}</p>
                <strong>${window.formatMoney(item.price)}</strong>
              </div>
              <div class="cart-line-actions">
                <div class="qty-control compact">
                  <button type="button" data-dec="${item.key}">−</button>
                  <span>${item.qty}</span>
                  <button type="button" data-inc="${item.key}">+</button>
                </div>
                <button class="text-btn" type="button" data-remove="${item.key}">Remove</button>
              </div>
              <strong class="line-total">${window.formatMoney(item.price * item.qty)}</strong>
            </article>`).join("")}
        </div>
        <aside class="cart-summary">
          <h2>Order summary</h2>
          <div class="summary-row"><span>Subtotal</span><strong>${window.formatMoney(subtotal)}</strong></div>
          <div class="summary-row"><span>Shipping</span><strong>${shipping ? window.formatMoney(shipping) : "Free"}</strong></div>
          ${subtotal < 200 ? `<p class="shipping-note">Spend ${window.formatMoney(200 - subtotal)} more for free shipping.</p>` : `<p class="shipping-note success">You unlocked free shipping.</p>`}
          <div class="summary-row total"><span>Total</span><strong>${window.formatMoney(total)}</strong></div>
          <button class="btn btn-primary btn-wide" id="checkout-btn" type="button">Proceed to checkout</button>
          <a class="btn btn-secondary btn-wide" href="shop.html">Continue shopping</a>
        </aside>
      </div>`;

    root.querySelectorAll("[data-inc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = items.find((entry) => entry.key === btn.dataset.inc);
        if (item) window.LeafLockStore.updateQty(item.key, item.qty + 1);
        render();
        window.updateCartBadge?.();
      });
    });
    root.querySelectorAll("[data-dec]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = items.find((entry) => entry.key === btn.dataset.dec);
        if (item) window.LeafLockStore.updateQty(item.key, item.qty - 1);
        render();
        window.updateCartBadge?.();
      });
    });
    root.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.LeafLockStore.removeItem(btn.dataset.remove);
        render();
        window.updateCartBadge?.();
      });
    });
    document.getElementById("checkout-btn")?.addEventListener("click", () => {
      const paypalId = window.LEAFLOCK_CONFIG?.paypalClientId;
      if (paypalId) {
        showToast("PayPal checkout loading…");
        // PayPal Smart Buttons will mount here once client ID is set in js/config.js
        return;
      }
      showToast("PayPal checkout coming soon — add your client ID in js/config.js");
    });
  }

  render();
}

function initNewsletter() {
  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      showToast("Subscribed — thanks for joining LeafLock");
      form.reset();
    });
  });
}

function initLocatorPage() {
  window.initLeafLockLocator?.();
}

document.addEventListener("DOMContentLoaded", () => {
  initAgeGate();
  window.renderLayout?.(document.body.dataset.active || "");
  initHeaderOffset();
  initMenu();
  initHome();
  initShop();
  initProduct();
  initCart();
  initLocatorPage();
  initNewsletter();
  initReveal();
  window.updateCartBadge?.();
});

window.addEventListener("leaflock:cart-updated", () => window.updateCartBadge?.());