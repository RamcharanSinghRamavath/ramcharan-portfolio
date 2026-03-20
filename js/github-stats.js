

(function () {
  "use strict";

  /* ── CONFIG ───────────────────────────────────────────────── */
  const GITHUB_USERNAME = "RamcharanSinghRamavath";

  /**
   * Selector helpers — find the two stat boxes you want to be
   * live. We match by their sibling label text so the code does
   * NOT depend on element order.
   */
  function findStatByLabel(labelFragment) {
    const labels = document.querySelectorAll(".stat-label");
    for (const lbl of labels) {
      if (lbl.textContent.toLowerCase().includes(labelFragment.toLowerCase())) {
        return lbl.previousElementSibling; // the .stat-num above it
      }
    }
    return null;
  }

  /* ── COUNTER ANIMATION ────────────────────────────────────── */
  function animateCounter(el, target, suffix, duration = 1400) {
    if (!el) return;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── UPDATE HELPER ────────────────────────────────────────── */
  function updateStat(el, value, suffix) {
    if (!el) return;
    el.setAttribute("data-target", value);
    el.setAttribute("data-suffix", suffix);
    animateCounter(el, value, suffix);
  }

  /* ── 1. PUBLIC REPOS — GitHub REST API (no auth needed) ───── */
  async function fetchRepoCount() {
    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}`,
        { headers: { Accept: "application/vnd.github.v3+json" } }
      );
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const data = await res.json();
      return data.public_repos ?? null;
    } catch (err) {
      console.warn("[github-stats] repo fetch failed:", err.message);
      return null;
    }
  }

  /* ── 2. CONTRIBUTIONS — public contributions API ──────────── */
  /**
   * Uses the open-source proxy: https://github-contributions-api.jogruber.de
   * Returns total contributions for the past 12 months ("last" year).
   * Falls back gracefully if the service is unavailable.
   */
  async function fetchContributions() {
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=all`
      );
      if (!res.ok) throw new Error(`Contributions API ${res.status}`);
      const data = await res.json();
      // Sum every day's contribution count
      const total = (data.contributions ?? []).reduce(
        (sum, day) => sum + (day.count ?? 0),
        0
      );
      return total > 0 ? total : null;
    } catch (err) {
      console.warn("[github-stats] contributions fetch failed:", err.message);
      return null;
    }
  }

  /* ── MAIN ─────────────────────────────────────────────────── */
  async function init() {
    const repoEl   = findStatByLabel("repositories");
    const contribEl = findStatByLabel("contributions");

    // Fetch both in parallel
    const [repoCount, contribCount] = await Promise.all([
      fetchRepoCount(),
      fetchContributions(),
    ]);

    if (repoCount !== null) {
      console.log(`[github-stats] repos: ${repoCount}`);
      updateStat(repoEl, repoCount, "+");
    }

    if (contribCount !== null) {
      console.log(`[github-stats] contributions: ${contribCount}`);
      updateStat(contribEl, contribCount, "+");
    }
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
