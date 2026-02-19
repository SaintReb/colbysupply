(function () {
  function setStatus(el, msg, ok) {
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
    el.classList.toggle('ok', !!ok);
    el.classList.toggle('err', !ok);
  }

  async function postForm(endpoint, form) {
    const fd = new FormData(form);
    // Basic honeypot support if we add it later
    if (fd.get('website')) return { ok: true, skipped: true };

    // Send JSON to make it easy for serverless endpoints
    const payload = {};
    fd.forEach((v, k) => (payload[k] = v));

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let data = null;
    try { data = await res.json(); } catch (_) {}
    return { ok: res.ok, data };
  }

  function attach(formId, endpoint, mailtoSubject) {
    const form = document.getElementById(formId);
    if (!form) return;

    const status = form.querySelector('.form-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus(status, 'Sending…', true);

      try {
        const out = await postForm(endpoint, form);
        if (out.ok) {
          form.reset();
          setStatus(status, 'Thanks — we received your request. We’ll reply ASAP.', true);
          return;
        }
        throw new Error('non-200');
      } catch (err) {
        // GitHub Pages / static hosting fallback: guide them to email or call
        const name = (form.querySelector('[name="name"]') || {}).value || '';
        const email = (form.querySelector('[name="email"]') || {}).value || '';
        const msgEl = form.querySelector('[name="message"], [name="details"]');
        const msg = msgEl ? msgEl.value : '';
        const body = encodeURIComponent(
          (name ? `Name: ${name}\n` : '') +
          (email ? `Email: ${email}\n` : '') +
          (msg ? `\n${msg}\n` : '')
        );

        const mailto = `mailto:sales@colbysupply.com?subject=${encodeURIComponent(mailtoSubject)}&body=${body}`;
        setStatus(
          status,
          'This site is currently running in static mode. Please email us (button opens your email app) or call — we’ll take care of it.',
          false
        );

        // Create a one-click fallback button
        let btn = form.querySelector('[data-mailto-fallback]');
        if (!btn) {
          btn = document.createElement('a');
          btn.href = mailto;
          btn.className = 'cta secondary';
          btn.setAttribute('data-mailto-fallback', '1');
          btn.textContent = 'Email Colby Now';
          status.insertAdjacentElement('afterend', btn);
        } else {
          btn.href = mailto;
        }
      }
    });
  }

  attach('contactForm', '/api/contact', 'Colby Supply — Website Contact');
  attach('quoteForm', '/api/quote', 'Colby Supply — Quote Request');
})();