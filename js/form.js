/* ==============================================
   form.js  —  Contact form handler
   ============================================== */

function handleForm(event) {
  event.preventDefault();
  const okMsg = document.getElementById('form-ok');
  if (okMsg) okMsg.style.display = 'block';
  event.target.reset();
}
