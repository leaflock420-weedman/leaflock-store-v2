(function () {
  const CART_KEY = "leaflock-v2-cart";

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("leaflock:cart-updated", { detail: items }));
  }

  function cartCount(items = readCart()) {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }

  function cartSubtotal(items = readCart()) {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function addToCart({ productId, variantId, qty = 1 }) {
    const product = window.getProduct(productId);
    if (!product) return false;
    const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
    const items = readCart();
    const key = `${productId}:${variant.id}`;
    const existing = items.find((item) => item.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        key,
        productId,
        variantId: variant.id,
        name: product.name,
        variantLabel: variant.label,
        price: variant.price,
        image: product.image,
        qty
      });
    }
    writeCart(items);
    return true;
  }

  function updateQty(key, qty) {
    const items = readCart();
    const item = items.find((entry) => entry.key === key);
    if (!item) return;
    item.qty = Math.max(1, qty);
    writeCart(items);
  }

  function removeItem(key) {
    writeCart(readCart().filter((item) => item.key !== key));
  }

  function clearCart() {
    writeCart([]);
  }

  window.LeafLockStore = {
    readCart,
    writeCart,
    cartCount,
    cartSubtotal,
    addToCart,
    updateQty,
    removeItem,
    clearCart
  };
})();