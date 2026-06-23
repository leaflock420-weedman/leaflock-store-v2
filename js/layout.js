(function () {
  const LOGO = "assets/leaflock-logo.png";

  const nav = [
    { href: "shop.html?cat=humidity", label: "Humidity" },
    { href: "shop.html?cat=grow", label: "Grow" },
    { href: "shop.html?cat=gummies", label: "Gummies" },
    { href: "shop.html?cat=merch", label: "Merch", badge: "New" },
    { href: "find-leaflock.html", label: "Stores" },
    { href: "contact.html", label: "Wholesale" }
  ];

  function cartBadge() {
    const count = window.LeafLockStore?.cartCount?.() || 0;
    return count ? `<span class="cart-count">${count}</span>` : "";
  }

  window.renderLayout = function renderLayout(active = "") {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    if (!header || !footer) return;

    const ticker = [
      "Free shipping $200+",
      "Merch drop live",
      "Lock in freshness",
      "8 stockists nationwide",
      "Bundle & save",
      "AU designed",
      "Cop online 24/7",
    ];
    const marqueeItems = [...ticker, ...ticker].map((item) => `<span>${item}</span>`).join("");
    const marqueeReverse = [...ticker].reverse().concat([...ticker].reverse())
      .map((item) => `<span>${item}</span>`).join("");

    header.innerHTML = `
      <button type="button" class="menu-overlay" id="menu-overlay" hidden aria-label="Close menu"></button>
      <div class="announce announce--dual">
        <div class="marquee"><div class="marquee-track">${marqueeItems}</div></div>
        <div class="marquee marquee--reverse" aria-hidden="true"><div class="marquee-track">${marqueeReverse}</div></div>
      </div>
      <div class="drop-bar">
        <span class="drop-pulse"></span>
        <strong>Restock live</strong>
        <span class="drop-divider">|</span>
        <span id="drop-countdown">Loading...</span>
        <a href="shop.html?cat=humidity" class="drop-cta">Shop now →</a>
      </div>
      <div class="header">
        <button class="menu-btn" id="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <a class="logo" href="index.html">
          <img src="${LOGO}" width="160" height="48" alt="LeafLock">
        </a>
        <div class="header-actions">
          <a class="icon-link" href="shop.html" aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </a>
          <a class="btn btn-cart" href="cart.html">Bag ${cartBadge()}</a>
        </div>
        <nav class="nav" id="main-nav" aria-label="Main">
          ${nav.map((item) => {
            const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : "";
            return `<a href="${item.href}"${active === item.label ? ' aria-current="page"' : ""}>${item.label}${badge}</a>`;
          }).join("")}
        </nav>
      </div>`;

    footer.innerHTML = `
      <div class="footer-mega" aria-hidden="true">LEAFLOCK</div>
      <div class="social-bar">
        <p class="social-bar-label">Follow LeafLock</p>
        <div class="social-bar-links">
          <a class="social-pill" href="https://www.instagram.com/leaflockstore/" target="_blank" rel="noopener">Instagram</a>
          <a class="social-pill" href="https://www.facebook.com/profile.php?id=100092366541281" target="_blank" rel="noopener">Facebook</a>
          <a class="social-pill" href="https://tiktok.com/@leaflock420" target="_blank" rel="noopener">TikTok</a>
        </div>
      </div>
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="${LOGO}" width="130" alt="LeafLock">
          <p>Surfers Paradise, QLD 4217<br><a href="mailto:info@leaflock.com.au">info@leaflock.com.au</a><br>0431 295 201</p>
        </div>
        <div>
          <h3>Shop</h3>
          <a href="shop.html?cat=humidity">Humidity</a>
          <a href="shop.html?cat=grow">Grow Tools</a>
          <a href="shop.html?cat=merch">Merch</a>
          <a href="shop.html">All products</a>
        </div>
        <div>
          <h3>Info</h3>
          <a href="about.html">About</a>
          <a href="find-leaflock.html">Store locator</a>
          <a href="contact.html">Contact</a>
          <a href="contact.html#wholesale">Wholesale</a>
        </div>
        <div>
          <h3>Stay locked in</h3>
          <p>First access to drops & restocks.</p>
          <form class="newsletter" data-newsletter>
            <input type="email" placeholder="Email" required>
            <button class="btn btn-primary" type="submit">Join</button>
          </form>
        </div>
      </div>
      <p class="copyright">© 2026 LeafLock · Locked in.</p>`;

    window.initDropCountdown?.();
  };

  window.updateCartBadge = function updateCartBadge() {
    const badge = document.querySelector(".cart-count");
    const count = window.LeafLockStore?.cartCount?.() || 0;
    if (badge) {
      badge.textContent = String(count);
      badge.hidden = !count;
      return;
    }
    const cartBtn = document.querySelector(".btn-cart");
    if (cartBtn) {
      cartBtn.innerHTML = `Bag ${count ? `<span class="cart-count">${count}</span>` : ""}`;
    }
  };
})();