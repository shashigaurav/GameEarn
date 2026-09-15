(function () {
  "use strict";

  /* ---------------- mobile nav ---------------- */
  var hamburger = document.getElementById("hamburgerBtn");
  var mobileNav = document.getElementById("mobileNav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("menu-open", open);
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* ---------------- FAQ accordions ---------------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var answer = item.querySelector(".faq-a");
    if (!btn || !answer) return;
    btn.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";
      var list = item.closest(".faq-list");
      if (list) {
        list.querySelectorAll(".faq-item").forEach(function (sib) {
          if (sib !== item) {
            sib.setAttribute("data-open", "false");
            sib.querySelector(".faq-q").setAttribute("aria-expanded", "false");
            sib.querySelector(".faq-a").style.maxHeight = null;
          }
        });
      }
      item.setAttribute("data-open", isOpen ? "false" : "true");
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 24 + "px";
    });
  });

  /* ---------------- number counter animation ---------------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var duration = 900;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(step);
    };
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = parseFloat(el.getAttribute("data-count")).toLocaleString(); });
  }

  /* ---------------- generic grid filter/sort/load-more engine ---------------- */
  function wireGrid(config) {
    var grid = document.getElementById(config.gridId);
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll(config.cardSelector));
    var pageSize = parseInt(grid.getAttribute("data-page-size"), 10) || 12;
    var visibleCount = pageSize;
    var activePill = "all";

    var searchInput = document.getElementById(config.searchId);
    var selects = (config.selectIds || []).map(function (id) { return document.getElementById(id); });
    var resultCount = document.getElementById(config.resultCountId);
    var emptyState = document.getElementById(config.emptyStateId);
    var loadMoreWrap = document.getElementById(config.loadMoreWrapId);
    var loadMoreBtn = document.getElementById(config.loadMoreBtnId);
    var pillsWrap = config.pillsId ? document.getElementById(config.pillsId) : null;

    function matches(card) {
      var q = (searchInput && searchInput.value.trim().toLowerCase()) || "";
      if (q && config.searchFields.some(function (f) { return card.dataset[f]; })) {
        var haystack = config.searchFields.map(function (f) { return card.dataset[f] || ""; }).join(" ");
        if (haystack.indexOf(q) === -1) return false;
      }
      for (var i = 0; i < selects.length; i++) {
        var sel = selects[i];
        if (!sel || !sel.value) continue;
        var field = config.selectFields[i];
        if (field === "platform") {
          if (card.dataset.platform.indexOf(sel.value) === -1) return false;
        } else if (card.dataset[field] !== sel.value) {
          return false;
        }
      }
      if (activePill === "nocost" && card.dataset.nocost !== "true") return false;
      if (activePill === "easy" && card.dataset.difficulty !== "easy") return false;
      if (["tasks", "surveys", "app-offers", "cashback"].indexOf(activePill) !== -1 && card.dataset.category !== activePill) return false;
      return true;
    }

    function sortCards(list) {
      var sortSelectEl = config.sortId ? document.getElementById(config.sortId) : null;
      var mode = sortSelectEl ? sortSelectEl.value : "popular";
      return list.slice().sort(function (a, b) {
        if (mode === "rating") return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        if (mode === "newest") return new Date(b.dataset.date) - new Date(a.dataset.date);
        if (mode === "reward") return (parseFloat(b.dataset.rewardvalue) || 0) - (parseFloat(a.dataset.rewardvalue) || 0);
        var pa = a.dataset.popular === "true" || a.dataset.trending === "true" ? 1 : 0;
        var pb = b.dataset.popular === "true" || b.dataset.trending === "true" ? 1 : 0;
        if (pb !== pa) return pb - pa;
        return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
      });
    }

    function render() {
      var filtered = cards.filter(matches);
      var ordered = sortCards(filtered);
      cards.forEach(function (c) { c.style.display = "none"; });
      ordered.slice(0, visibleCount).forEach(function (c) {
        c.style.display = "";
        grid.appendChild(c);
      });
      if (resultCount) resultCount.textContent = filtered.length + " result" + (filtered.length === 1 ? "" : "s");
      if (emptyState) emptyState.style.display = filtered.length === 0 ? "block" : "none";
      if (loadMoreWrap) loadMoreWrap.style.display = filtered.length > visibleCount ? "flex" : "none";
    }

    [searchInput].concat(selects).forEach(function (el) {
      if (!el) return;
      var evt = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(evt, function () { visibleCount = pageSize; render(); });
    });
    var sortEl = config.sortId ? document.getElementById(config.sortId) : null;
    if (sortEl) sortEl.addEventListener("change", function () { visibleCount = pageSize; render(); });

    if (loadMoreBtn) loadMoreBtn.addEventListener("click", function () { visibleCount += pageSize; render(); });

    if (pillsWrap) {
      pillsWrap.querySelectorAll(".filter-pill").forEach(function (pill) {
        pill.addEventListener("click", function () {
          pillsWrap.querySelectorAll(".filter-pill").forEach(function (p) { p.classList.remove("active"); });
          pill.classList.add("active");
          activePill = pill.getAttribute("data-pill");
          visibleCount = pageSize;
          render();
        });
      });
    }

    render();
  }

  // games grid (/games/, /earning-games/, /trending/, /new-games/, /category/*)
  wireGrid({
    gridId: "gameGrid",
    cardSelector: ".game-card",
    searchId: "gridSearch",
    searchFields: ["name", "developer", "genre", "category"],
    selectIds: ["filterCategory", "filterPlatform", "filterReward", "filterGenre"],
    selectFields: ["category", "platform", "reward", "genre"],
    sortId: "sortBy",
    resultCountId: "resultCount",
    emptyStateId: "emptyState",
    loadMoreWrapId: "loadMoreWrap",
    loadMoreBtnId: "loadMoreBtn",
  });

  // offers grid (/offers/)
  wireGrid({
    gridId: "offerGrid",
    cardSelector: ".offer-card",
    searchId: "offerSearch",
    searchFields: ["name", "provider", "category"],
    selectIds: ["offerCategoryFilter", "offerDifficultyFilter"],
    selectFields: ["category", "difficulty"],
    sortId: "offerSort",
    resultCountId: "offerResultCount",
    emptyStateId: "offerEmptyState",
    loadMoreWrapId: "offerLoadMoreWrap",
    loadMoreBtnId: "offerLoadMoreBtn",
    pillsId: "offerPills",
  });

})();
