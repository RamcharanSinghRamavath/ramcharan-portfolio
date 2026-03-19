/* ==============================================
   navigation.js  —  Page & tab switching
   ============================================== */

function showPage(id) {
  document.querySelectorAll('section').forEach((s) => s.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach((a) => a.classList.remove('active'));

  const section = document.getElementById(id);
  if (section) section.classList.add('active');

  const navLink = document.getElementById('nav-' + id);
  if (navLink) navLink.classList.add('active');

  window.scrollTo(0, 0);
}

function showTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));

  const tab = document.getElementById(id);
  if (tab) tab.classList.add('active');
  if (btn) btn.classList.add('active');
}
