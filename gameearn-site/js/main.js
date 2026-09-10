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
      // close siblings within the same faq-list for a tidy single-open accordion
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

  /* ---------------- listing grid: search / filter / sort / load more ---------------- */
  var grid = document.getElementById("gameGrid");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".game-card"));
    var pageSize = parseInt(grid.getAttribute("data-page-size"), 10) || 12;
    var visibleCount = pageSize;

    var searchInput = document.getElementById("gridSearch");
    var catSelect = document.getElementById("filterCategory");
    var platformSelect = document.getElementById("filterPlatform");
    var rewardSelect = document.getElementById("filterReward");
    var genreSelect = document.getElementById("filterGenre");
    var sortSelect = document.getElementById("sortBy");
    var resultCount = document.getElementById("resultCount");
    var emptyState = document.getElementById("emptyState");
    var loadMoreWrap = document.getElementById("loadMoreWrap");
    var loadMoreBtn = document.getElementById("loadMoreBtn");

    function matches(card) {
      var q = (searchInput && searchInput.value.trim().toLowerCase()) || "";
      if (q) {
        var haystack = [card.dataset.name, card.dataset.developer, card.dataset.genre, card.dataset.category].join(" ");
        if (haystack.indexOf(q) === -1) return false;
      }
      if (catSelect && catSelect.value && card.dataset.category !== catSelect.value) return false;
      if (platformSelect && platformSelect.value && card.dataset.platform.indexOf(platformSelect.value) === -1) return false;
      if (rewardSelect && rewardSelect.value && card.dataset.reward !== rewardSelect.value) return false;
      if (genreSelect && genreSelect.value && card.dataset.genre !== genreSelect.value) return false;
      return true;
    }

    function sortCards(list) {
      var mode = sortSelect ? sortSelect.value : "popular";
      return list.slice().sort(function (a, b) {
        if (mode === "rating") return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        if (mode === "newest") return new Date(b.dataset.date) - new Date(a.dataset.date);
        // popular: popular flag first, then rating
        var pa = a.dataset.popular === "true" ? 1 : 0;
        var pb = b.dataset.popular === "true" ? 1 : 0;
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
        grid.appendChild(c); // re-order in the DOM to match sort
      });

      if (resultCount) resultCount.textContent = filtered.length + " result" + (filtered.length === 1 ? "" : "s");
      if (emptyState) emptyState.style.display = filtered.length === 0 ? "block" : "none";
      if (loadMoreWrap) loadMoreWrap.style.display = filtered.length > visibleCount ? "flex" : "none";
    }

    [searchInput, catSelect, platformSelect, rewardSelect, genreSelect, sortSelect].forEach(function (el) {
      if (!el) return;
      var evt = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(evt, function () {
        visibleCount = pageSize;
        render();
      });
    });

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () {
        visibleCount += pageSize;
        render();
      });
    }

    render();
  }

  /* ---------------- global search page ---------------- */
  var searchResults = document.getElementById("searchResults");
  if (searchResults) {
    var datasetEl = document.getElementById("site-dataset");
    var dataset = datasetEl ? JSON.parse(datasetEl.textContent) : [];
    var input = document.getElementById("siteSearchInput");
    var countEl = document.getElementById("searchResultCount");
    var emptyEl = document.getElementById("searchEmptyState");

    var params = new URLSearchParams(window.location.search);
    if (params.get("q") && input) input.value = params.get("q");

    function cardHtml(g) {
      var freeBadge = g.freeToPlay ? '<span class="badge badge-free">Free to Play</span>' : '<span class="badge">Paid</span>';
      var rewardBadge = g.rewardType && g.rewardType !== "None" ? '<span class="badge badge-reward">' + g.rewardType + '</span>' : "";
      var desc = g.description.length > 96 ? g.description.slice(0, 96) + "…" : g.description;
      return (
        '<article class="game-card">' +
        '<a href="/games/' + g.slug + '/" class="thumb-wrap"><img src="' + g.image + '" alt="' + g.name + ' cover" loading="lazy" width="640" height="320" />' +
        (g.newRelease ? '<span class="badge-row"><span class="badge badge-new">New</span></span>' : "") +
        "</a>" +
        '<div class="body"><div class="title-row"><img class="icon" src="' + g.icon + '" alt="" loading="lazy" width="34" height="34" /><h3><a href="/games/' + g.slug + '/">' + g.name + "</a></h3></div>" +
        '<div class="meta-line"><span class="rating">★ ' + g.rating.toFixed(1) + '</span><span>&middot;</span><span>' + g.category + '</span><span>&middot;</span><span>' + g.platform + "</span></div>" +
        '<p class="desc">' + desc + "</p>" +
        '<div class="card-foot"><div style="display:flex;gap:6px;flex-wrap:wrap;">' + freeBadge + rewardBadge + '</div><a href="/games/' + g.slug + '/" class="btn btn-ghost btn-sm">View Details</a></div>' +
        "</div></article>"
      );
    }

    function runSearch() {
      var q = (input && input.value.trim().toLowerCase()) || "";
      if (!q) {
        searchResults.innerHTML = "";
        countEl.textContent = "Type to search";
        emptyEl.style.display = "none";
        return;
      }
      var results = dataset.filter(function (g) {
        return (
          g.name.toLowerCase().indexOf(q) !== -1 ||
          g.category.toLowerCase().indexOf(q) !== -1 ||
          g.genre.toLowerCase().indexOf(q) !== -1 ||
          g.developer.toLowerCase().indexOf(q) !== -1 ||
          g.rewardType.toLowerCase().indexOf(q) !== -1
        );
      });
      searchResults.innerHTML = results.map(cardHtml).join("");
      countEl.textContent = results.length + " result" + (results.length === 1 ? "" : "s") + ' for "' + (input ? input.value : "") + '"';
      emptyEl.style.display = results.length === 0 ? "block" : "none";
    }

    if (input) {
      input.addEventListener("input", runSearch);
      if (input.value) runSearch();
    }
  }
})();
