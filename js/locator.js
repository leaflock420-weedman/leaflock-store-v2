(function () {
  const MAPS_KEY = "AIzaSyDDf0Gs4OUdIIRbJGc3hn6GRZ8aT37fFiw";
  const DEFAULT_RADIUS = 100;

  let map;
  let markers = [];
  let userMarker;
  let autocomplete;
  let searchCenter = null;
  let viewMode = "map";

  function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function fullAddress(store) {
    const parts = [store.address, store.city, store.state, store.zip, store.country]
      .filter(Boolean)
      .join(", ");
    return parts.replace(/,\s*,/g, ",");
  }

  function getCountries(stores) {
    return [...new Set(stores.map((s) => s.country || "Australia").filter(Boolean))].sort();
  }

  function getTags(stores) {
    return [...new Set(stores.flatMap((s) => s.tags || []).filter(Boolean))].sort();
  }

  function filterStores(stores, { radius, country, tags }) {
    return stores
      .map((store) => {
        const distance = searchCenter
          ? haversineKm(searchCenter.lat, searchCenter.lng, store.lat, store.lng)
          : null;
        return { ...store, distance };
      })
      .filter((store) => {
        if (country && country !== "all" && store.country !== country) return false;
        if (tags.length && !tags.some((tag) => store.tags?.includes(tag))) return false;
        if (searchCenter && radius < 5000 && store.distance > radius) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.distance == null && b.distance == null) return a.name.localeCompare(b.name);
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      });
  }

  function clearMarkers() {
    markers.forEach((m) => m.setMap(null));
    markers = [];
  }

  function renderMarkers(stores) {
    if (!map) return;
    clearMarkers();
    const bounds = new google.maps.LatLngBounds();

    stores.forEach((store) => {
      const position = { lat: store.lat, lng: store.lng };
      const marker = new google.maps.Marker({
        position,
        map,
        title: store.name,
        icon: store.marker
          ? { url: store.marker, scaledSize: new google.maps.Size(36, 44) }
          : undefined,
      });
      marker.addListener("click", () => {
        highlightStore(store.id);
        map.panTo(position);
        map.setZoom(Math.max(map.getZoom(), 12));
      });
      markers.push(marker);
      bounds.extend(position);
    });

    if (userMarker) bounds.extend(userMarker.getPosition());
    if (stores.length) {
      map.fitBounds(bounds, 48);
      if (stores.length === 1) map.setZoom(13);
    }
  }

  function storeCard(store) {
    const distance =
      store.distance != null
        ? `<span class="store-distance">${store.distance.toFixed(1)} km</span>`
        : "";
    const directions = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
    return `
      <article class="store-card" data-store-id="${store.id}">
        <div class="store-card-head">
          <h3>${store.name}</h3>
          ${distance}
        </div>
        <p class="store-address">${fullAddress(store)}</p>
        ${store.phone ? `<p><a href="tel:${store.phone.replace(/\s/g, "")}">${store.phone}</a></p>` : ""}
        ${store.email ? `<p><a href="mailto:${store.email}">${store.email}</a></p>` : ""}
        ${store.website ? `<p><a href="${store.website}" target="_blank" rel="noopener">Visit website</a></p>` : ""}
        <a class="btn btn-small" href="${directions}" target="_blank" rel="noopener">Get directions</a>
      </article>`;
  }

  function highlightStore(id) {
    document.querySelectorAll(".store-card").forEach((card) => {
      card.classList.toggle("active", Number(card.dataset.storeId) === id);
    });
    const active = document.querySelector(`.store-card[data-store-id="${id}"]`);
    active?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderList(stores) {
    const list = document.getElementById("store-list");
    const count = document.getElementById("store-count");
    if (!list) return;
    if (count) count.textContent = `${stores.length} store${stores.length === 1 ? "" : "s"}`;
    list.innerHTML = stores.length
      ? stores.map(storeCard).join("")
      : `<div class="empty">No stores found in this area. Try increasing the radius.</div>`;
    list.querySelectorAll(".store-card").forEach((card) => {
      card.addEventListener("click", () => {
        const store = stores.find((s) => s.id === Number(card.dataset.storeId));
        if (!store || !map) return;
        highlightStore(store.id);
        map.panTo({ lat: store.lat, lng: store.lng });
        map.setZoom(13);
      });
    });
  }

  function isCompactLocator() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function setView(mode) {
    viewMode = mode;
    const mapEl = document.getElementById("locator-map");
    const listEl = document.getElementById("store-list-panel");
    const bodyEl = document.querySelector(".locator-body");
    const compact = isCompactLocator();
    document.querySelectorAll("[data-view]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === mode);
    });
    bodyEl?.classList.toggle("list-only", mode === "list");
    bodyEl?.classList.toggle("map-with-list", compact && mode === "map");
    if (mapEl) mapEl.hidden = mode === "list";
    if (listEl) listEl.hidden = !compact && mode === "map";
    if (mode === "map" && map) {
      requestAnimationFrame(() => google.maps.event.trigger(map, "resize"));
    }
  }

  function loadMaps() {
    return new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places&callback=__leaflockMapsReady`;
      script.async = true;
      script.onerror = reject;
      window.__leaflockMapsReady = resolve;
      document.head.appendChild(script);
    });
  }

  window.initLeafLockLocator = function initLeafLockLocator() {
    const root = document.getElementById("store-locator");
    if (!root || !window.LEAFLOCK_STORES?.length) return;

    const stores = window.LEAFLOCK_STORES;
    const countries = getCountries(stores);
    const tags = getTags(stores);
    let selectedCountry = "all";
    let selectedTags = [];

    const radiusInput = document.getElementById("locator-radius");
    const radiusValue = document.getElementById("locator-radius-value");
    const searchInput = document.getElementById("locator-search");
    const countrySelect = document.getElementById("locator-country");
    const tagSelect = document.getElementById("locator-tags");

    if (radiusInput && radiusValue) {
      radiusValue.textContent = radiusInput.value;
      radiusInput.addEventListener("input", () => {
        radiusValue.textContent = radiusInput.value;
        update();
      });
    }

    if (countrySelect) {
      countrySelect.innerHTML =
        `<option value="all">All countries</option>` +
        countries.map((c) => `<option value="${c}">${c}</option>`).join("");
      countrySelect.addEventListener("change", () => {
        selectedCountry = countrySelect.value;
        update();
      });
    }

    if (tagSelect) {
      if (tags.length) {
        tagSelect.innerHTML = tags.map((t) => `<option value="${t}">${t}</option>`).join("");
        tagSelect.multiple = true;
        tagSelect.addEventListener("change", () => {
          selectedTags = [...tagSelect.selectedOptions].map((o) => o.value);
          update();
        });
      } else {
        tagSelect.closest(".locator-filter")?.classList.add("is-disabled");
        tagSelect.disabled = true;
      }
    }

    document.getElementById("locator-search-btn")?.addEventListener("click", update);
    document.getElementById("locator-find-me")?.addEventListener("click", findMyLocation);
    document.getElementById("locator-clear")?.addEventListener("click", clearFilters);
    document.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => setView(btn.dataset.view));
    });

    function update() {
      const radius = Number(radiusInput?.value || DEFAULT_RADIUS);
      const filtered = filterStores(stores, {
        radius,
        country: selectedCountry,
        tags: selectedTags,
      });
      renderList(filtered);
      renderMarkers(filtered);
    }

    function clearFilters() {
      searchCenter = null;
      if (searchInput) searchInput.value = "";
      if (radiusInput) {
        radiusInput.value = String(DEFAULT_RADIUS);
        if (radiusValue) radiusValue.textContent = String(DEFAULT_RADIUS);
      }
      if (countrySelect) countrySelect.value = "all";
      selectedCountry = "all";
      selectedTags = [];
      if (tagSelect) [...tagSelect.options].forEach((o) => (o.selected = false));
      if (userMarker) {
        userMarker.setMap(null);
        userMarker = null;
      }
      update();
    }

    function findMyLocation() {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          searchCenter = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (map) {
            if (userMarker) userMarker.setMap(null);
            userMarker = new google.maps.Marker({
              position: searchCenter,
              map,
              title: "You are here",
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#1f9d55",
                fillOpacity: 1,
                strokeColor: "#fff",
                strokeWeight: 2,
              },
            });
            map.panTo(searchCenter);
          }
          update();
        },
        () => {
          const status = document.getElementById("locator-status");
          if (status) status.textContent = "Could not access your location.";
        }
      );
    }

    loadMaps()
      .then(() => {
        const center = { lat: -27.5, lng: 133.0 };
        map = new google.maps.Map(document.getElementById("locator-map"), {
          center,
          zoom: 4,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        if (searchInput) {
          autocomplete = new google.maps.places.Autocomplete(searchInput, {
            componentRestrictions: { country: "au" },
            fields: ["geometry", "formatted_address"],
          });
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry?.location) return;
            searchCenter = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            map.panTo(searchCenter);
            map.setZoom(10);
            update();
          });
        }

        update();
        setView("map");
        window.addEventListener("resize", () => setView(viewMode));
      })
      .catch(() => {
        const status = document.getElementById("locator-status");
        if (status) status.textContent = "Map failed to load. Check your connection.";
      });
  };
})();