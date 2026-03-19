/* ==============================================
   cursor.js  —  Custom cursor
   ============================================== */

const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .tab-btn').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cur.style.width  = '18px';
    cur.style.height = '18px';
    ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width  = '10px';
    cur.style.height = '10px';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});
