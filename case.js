(function(){
  // case.js — small UI helpers used by the case-study pages
  // - theme toggle (honors saved preference and system preference)
  // - attaches to any element with id="themeToggle"
  // - exposes a global `setTheme()` for debugging

  var root = document.documentElement;
  var toggleSelector = '#themeToggle';

  var sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function getSavedTheme(){
    try{ return localStorage.getItem('ar-theme'); }catch(e){ return null; }
  }
  function saveTheme(t){ try{ localStorage.setItem('ar-theme', t); }catch(e){} }

  function detectSystemPreference(){
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(t){
    if(!t) return;
    root.setAttribute('data-theme', t);
    var btns = document.querySelectorAll(toggleSelector);
    btns.forEach(function(b){
      try{ b.innerHTML = (t === 'dark') ? sun : moon; }catch(e){}
      // ensure accessible name
      try{ b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false'); }catch(e){}
    });
  }

  function toggleTheme(){
    var current = root.getAttribute('data-theme') || detectSystemPreference();
    var next = (current === 'dark') ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
  }

  // public setter for debugging or other scripts
  window.setTheme = function(t){ applyTheme(t); saveTheme(t); };

  // initialize
  var initial = getSavedTheme();
  if(!initial) initial = detectSystemPreference();
  applyTheme(initial);

  // wire up buttons
  document.addEventListener('DOMContentLoaded', function(){
    var btns = document.querySelectorAll(toggleSelector);
    btns.forEach(function(b){
      // if a page already set innerHTML via server-side, don't clobber it until after DOM ready
      try{ b.innerHTML = (root.getAttribute('data-theme') === 'dark') ? sun : moon; }catch(e){}
      b.addEventListener('click', function(e){
        e.preventDefault();
        toggleTheme();
      });
    });

    // optional: smooth in-page link behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var href = a.getAttribute('href');
        if(!href || href === '#') return;
        var target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
          history.replaceState(null, '', href);
        }
      });
    });
  });
})();
