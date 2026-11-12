// FR-07: theme toggle, saved in localStorage
(function(){
  document.documentElement.dataset.theme = window.localStorage.getItem('theme') || 'light';
  document.addEventListener('DOMContentLoaded', function(){
    const b = document.getElementById('themeToggle'); if(!b) return;
    const upd = () => b.textContent = document.documentElement.dataset.theme === 'dark' ? '☀️' : '🌙';
    upd();
    b.onclick = function(){
      const n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = n;
      window.localStorage.setItem('theme', n); upd();
    };
  });
})();
