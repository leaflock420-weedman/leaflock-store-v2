window.buildPayPalCheckoutUrl = function buildPayPalCheckoutUrl(amount) {
  const me = window.LEAFLOCK_CONFIG?.paypalMe || "leaflockstore";
  const currency = window.LEAFLOCK_CONFIG?.paypalCurrency || "AUD";
  const safeAmount = Math.max(0, Number(amount) || 0).toFixed(2);
  return `https://www.paypal.com/paypalme/${me}/${safeAmount}${currency}`;
};

window.buildOrderNote = function buildOrderNote(items) {
  if (!items?.length) return "";
  const lines = items.map(
    (item) => `${item.qty}x ${item.name} — ${item.variantLabel} (${window.formatMoney(item.price * item.qty)})`
  );
  const subtotal = window.LeafLockStore.cartSubtotal(items);
  const shipping = subtotal >= 200 ? 0 : 12.5;
  lines.push(`Total: ${window.formatMoney(subtotal + shipping)} AUD`);
  lines.push("LeafLock order — Friends & Family");
  return lines.join("\n");
};

window.startPayPalCheckout = async function startPayPalCheckout(items, total) {
  const url = window.buildPayPalCheckoutUrl(total);
  const note = window.buildOrderNote(items);

  if (note && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(note);
    } catch {
      /* clipboard optional */
    }
  }

  window.open(url, "_blank", "noopener,noreferrer");
  return { url, note };
};