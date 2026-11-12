// Shared: regex rules, user storage, form validation (FR-02, FR-03, FR-04)
const RE = {
  name: /^[a-zA-Z\s]{2,50}$/,
  id: /^[a-zA-Z0-9]{6,12}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  mobile: /^[6-9]\d{9}$/,
  pass: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
};
const getUsers = () => JSON.parse(localStorage.getItem('fm_users') || '[]');
function saveUser(u){
  const list = getUsers();
  if(list.some(x => x.email === u.email)) return false;
  list.push(u); localStorage.setItem('fm_users', JSON.stringify(list)); return true;
}
function setupForm(form, rules, onSubmit){
  const btn = form.querySelector('button[type=submit]');
  const check = (el, show) => {
    const r = rules[el.id], ok = r.test(el.value, form);
    let s = el.parentElement.querySelector('.error-msg');
    if(!s){ s = document.createElement('span'); s.className = 'error-msg'; el.parentElement.appendChild(s); }
    if(show){ el.classList.toggle('invalid', !ok); el.classList.toggle('valid', ok); s.textContent = ok ? '' : r.msg; }
    return ok;
  };
  const ids = Object.keys(rules);
  const allValid = () => ids.every(id => check(form.querySelector('#' + id), false));
  btn.disabled = true;
  ids.forEach(id => {
    const el = form.querySelector('#' + id);
    el.addEventListener('blur', () => check(el, true));
    el.addEventListener('input', () => { if(el.classList.contains('invalid')) check(el, true); btn.disabled = !allValid(); });
    el.addEventListener('change', () => { check(el, true); btn.disabled = !allValid(); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if(ids.map(id => check(form.querySelector('#' + id), true)).every(Boolean)) onSubmit();
  });
}
function toggleEye(btn){
  const i = btn.previousElementSibling;
  i.type = i.type === 'password' ? 'text' : 'password';
  btn.textContent = i.type === 'password' ? '👁️' : '🙈';
}
