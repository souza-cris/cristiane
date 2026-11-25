/* Decrypts a private page in the visitor's browser. The password is never sent
   or stored, so reloading the page asks for it again. */
(function () {
  'use strict';
  var form = document.getElementById('lock-form');
  if (!form) { return; }
  var status = document.getElementById('lock-status');
  var input = document.getElementById('lock-password');
  var button = form.querySelector('button');
  var box = document.getElementById('lock-content');
  var data = JSON.parse(document.getElementById('lock-data').textContent);

  function bytes(b64) {
    return Uint8Array.from(atob(b64), function (c) { return c.charCodeAt(0); });
  }

  async function decrypt(password) {
    var raw = new TextEncoder().encode(password.trim().normalize('NFC'));
    var base = await crypto.subtle.importKey('raw', raw, 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', hash: 'SHA-256', salt: bytes(data.salt), iterations: data.iterations },
      base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    var plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: bytes(data.iv) }, key, bytes(data.text));
    return JSON.parse(new TextDecoder().decode(plain)).html;
  }

  /* Scripts inserted as text do not run, so each is recreated. async = false
     keeps them in order: the game needs its library loaded first. */
  function show(html) {
    box.innerHTML = html;
    form.remove();
    var hint = document.getElementById('lock-hint');
    if (hint) { hint.remove(); }
    box.querySelectorAll('script[src]').forEach(function (old) {
      var fresh = document.createElement('script');
      fresh.src = old.getAttribute('src');
      fresh.async = false;
      old.replaceWith(fresh);
    });
    box.tabIndex = -1;
    box.focus();
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!window.crypto || !crypto.subtle) {
      status.textContent = 'Open this page at its https:// address to unlock it.';
      return;
    }
    status.textContent = 'Unlocking…';
    button.disabled = true;
    var html;
    try {
      html = await decrypt(input.value);
    } catch (e) {
      status.textContent = 'That password did not work.';
      button.disabled = false;
      input.select();
      return;
    }
    show(html);
  });
}());
