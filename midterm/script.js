// ===== Task 3: live search, price sort, premium label =====
document.addEventListener("DOMContentLoaded", () => {
  const PREMIUM_LIMIT = 22 * 100; // N = 22  ->  2200

  const searchBox = document.getElementById("search-box");
  const sortBtn = document.getElementById("sort-price");
  const noResults = document.getElementById("no-results");
  const categoryRadios = document.querySelectorAll('input[name="category"]');
  const sections = document.querySelectorAll("main section");
  const items = document.querySelectorAll(".product-item");

  let ascending = true; // first click = low to high

  // Read the price from the card itself ("Rs. 2500" -> 2500)
  function getPrice(item) {
    const priceEl = item.querySelector(".price");
    if (!priceEl) return 0;
    return parseInt(priceEl.textContent.replace(/[^0-9]/g, ""), 10) || 0;
  }

  function getName(item) {
    return item.querySelector("h3").textContent.trim().toLowerCase();
  }

  // ----- Premium label (runs first, on page load) -----
  function addPremiumLabels() {
    items.forEach((item) => {
      if (getPrice(item) > PREMIUM_LIMIT) {
        const info = item.querySelector(".product-info");
        if (!info || info.querySelector(".premium-badge")) return; // no duplicates

        const badge = document.createElement("span");
        badge.className = "premium-badge";
        badge.textContent = "Premium";

        // Inline styles so it shows even if the CSS rule is missing
        badge.style.alignSelf = "flex-start";
        badge.style.padding = "2px 10px";
        badge.style.borderRadius = "12px";
        badge.style.backgroundColor = "#c07854";
        badge.style.color = "#fff";
        badge.style.fontSize = "0.75rem";
        badge.style.fontWeight = "bold";
        badge.style.letterSpacing = "0.5px";

        info.insertBefore(badge, info.firstChild);
      }
    });
  }

  addPremiumLabels();

  // ----- Search + category filter + empty message -----
  function updateDisplay() {
    if (!searchBox) return;
    const query = searchBox.value.trim().toLowerCase();

    items.forEach((item) => {
      item.hidden = !getName(item).includes(query);
    });

    let visibleCount = 0;
    sections.forEach((section) => {
      section.hidden = false; // reset so computed styles are accurate
      const anyVisible = Array.from(
        section.querySelectorAll(".product-item"),
      ).some((item) => getComputedStyle(item).display !== "none");

      section.hidden = !anyVisible;
      if (anyVisible) visibleCount++;
    });

    if (noResults) noResults.hidden = visibleCount > 0;
  }

  // ----- Sort by price (moves existing cards with appendChild) -----
  function sortByPrice() {
    document.querySelectorAll("main .row").forEach((row) => {
      const cards = Array.from(row.querySelectorAll(".product-item"));

      cards.sort((a, b) =>
        ascending ? getPrice(a) - getPrice(b) : getPrice(b) - getPrice(a),
      );

      cards.forEach((card) => row.appendChild(card));
    });

    if (sortBtn) {
      sortBtn.textContent = ascending
        ? "Sort by price (low → high)"
        : "Sort by price (high → low)";
    }

    ascending = !ascending;
  }

  // ----- Events -----
  if (searchBox) searchBox.addEventListener("input", updateDisplay);
  categoryRadios.forEach((radio) =>
    radio.addEventListener("change", updateDisplay),
  );
  if (sortBtn) sortBtn.addEventListener("click", sortByPrice);

  updateDisplay();
});
