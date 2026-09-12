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

  /* ---------------- daily streak claim (demo, localStorage only) ---------------- */
  var claimBtn = document.getElementById("claimRewardBtn");
  if (claimBtn) {
    var todayKey = "gameearn_demo_claim_" + new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(todayKey)) {
      claimBtn.textContent = "Claimed Today";
      claimBtn.setAttribute("disabled", "true");
    }
    claimBtn.addEventListener("click", function () {
      localStorage.setItem(todayKey, "1");
      var todayCard = document.querySelector(".streak-day.today");
      if (todayCard) {
        todayCard.classList.remove("today");
        todayCard.classList.add("claimed");
      }
      claimBtn.textContent = "Reward Claimed!";
      claimBtn.setAttribute("disabled", "true");
      setTimeout(function () { claimBtn.textContent = "Claimed Today"; }, 1400);
    });
  }

  /* ---------------- withdraw button (demo) ---------------- */
  var withdrawBtn = document.getElementById("withdrawBtn");
  if (withdrawBtn) {
    withdrawBtn.addEventListener("click", function () {
      alert("Withdrawals require a connected backend and payment provider. This is a UI demo only — no real balance exists yet.");
    });
  }

  /* ---------------- referral copy / share (demo) ---------------- */
  var copyBtn = document.getElementById("copyReferralBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var code = copyBtn.getAttribute("data-code");
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(function () {
          var original = copyBtn.textContent;
          copyBtn.textContent = "Copied!";
          setTimeout(function () { copyBtn.textContent = original; }, 1400);
        });
      }
    });
  }
  var shareBtn = document.getElementById("shareReferralBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      var code = shareBtn.getAttribute("data-code");
      var text = "Join me on GameEarn and discover verified games and reward opportunities! Use my code: " + code;
      if (navigator.share) {
        navigator.share({ title: "GameEarn", text: text }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        alert("Sharing isn't supported in this browser — your referral message was copied instead.");
      }
    });
  }

  /* ---------------- global search page (games + offers) ---------------- */
  var searchResults = document.getElementById("searchResults");
  if (searchResults) {
    var datasetEl = document.getElementById("site-dataset");
    var dataset = datasetEl ? JSON.parse(datasetEl.textContent) : [];
    var input = document.getElementById("siteSearchInput");
    var countEl = document.getElementById("searchResultCount");
    var emptyEl = document.getElementById("searchEmptyState");

    var params = new URLSearchParams(window.location.search);
    if (params.get("q") && input) input.value = params.get("q");

    function cardHtml(item) {
      var href = item.type === "offer" ? "/offer/" + item.slug + "/" : "/games/" + item.slug + "/";
      var freeBadge = item.freeToPlay ? '<span class="badge badge-free">' + (item.type === "offer" ? "No Cost" : "Free to Play") + '</span>' : '<span class="badge">Paid</span>';
      var rewardBadge = item.rewardType ? '<span class="badge badge-reward">' + item.rewardType + '</span>' : "";
      var desc = item.description.length > 96 ? item.description.slice(0, 96) + "…" : item.description;
      return (
        '<article class="game-card">' +
        '<a href="' + href + '" class="thumb-wrap"><img src="' + item.image + '" alt="' + item.name + ' cover" loading="lazy" width="640" height="320" />' +
        (item.newRelease ? '<span class="badge-row"><span class="badge badge-new">New</span></span>' : "") +
        "</a>" +
        '<div class="body"><div class="title-row"><img class="icon" src="' + item.icon + '" alt="" loading="lazy" width="34" height="34" /><h3><a href="' + href + '">' + item.name + "</a></h3></div>" +
        '<div class="meta-line"><span class="rating">★ ' + item.rating.toFixed(1) + '</span><span>&middot;</span><span>' + item.category + (item.platform ? '</span><span>&middot;</span><span>' + item.platform : "") + "</span></div>" +
        '<p class="desc">' + desc + "</p>" +
        '<div class="card-foot"><div style="display:flex;gap:6px;flex-wrap:wrap;">' + freeBadge + rewardBadge + '</div><a href="' + href + '" class="btn btn-ghost btn-sm">View Details</a></div>' +
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
      var results = dataset.filter(function (item) {
        return (
          item.name.toLowerCase().indexOf(q) !== -1 ||
          item.category.toLowerCase().indexOf(q) !== -1 ||
          (item.genre || "").toLowerCase().indexOf(q) !== -1 ||
          (item.developer || "").toLowerCase().indexOf(q) !== -1 ||
          String(item.rewardType || "").toLowerCase().indexOf(q) !== -1
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
