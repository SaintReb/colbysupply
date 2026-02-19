(function(){
  const btn = document.querySelector('[data-menu-button]');
  const panel = document.querySelector('[data-mobile-panel]');
  if(btn && panel){
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if(expanded){
        panel.setAttribute('hidden', '');
      }else{
        panel.removeAttribute('hidden');
        // Focus first link for keyboard users
        const first = panel.querySelector('a, button');
        if(first) first.focus();
      }
    });
  }

  // Set current year
  const y = document.querySelector('[data-year]');
  if(y) y.textContent = String(new Date().getFullYear());
})();
