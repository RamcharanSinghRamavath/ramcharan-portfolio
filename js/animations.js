/* ==============================================
   animations.js  —  Stat counter animation
   ============================================== */

function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let value = 0;
    const inc = target / 35;

    const timer = setInterval(() => {
      value = Math.min(value + inc, target);
      el.textContent = (Number.isInteger(target)
        ? Math.round(value)
        : value.toFixed(1)) + suffix;
      if (value >= target) clearInterval(timer);
    }, 40);
  });
}

setTimeout(animateCounters, 700);
