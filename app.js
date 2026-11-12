// FR-05: dashboard logic (auth guard, transactions, totals, EMI)
(function(){
  const session = JSON.parse(localStorage.getItem('fm_session') || 'null');
  if(!session){ location.href = 'signin.html'; return; }
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const fmt = n => '₹' + n.toLocaleString('en-IN', {maximumFractionDigits:2});
  $('welcome').textContent = 'Hi, ' + session.name.split(' ')[0];
  $('logout').onclick = () => { localStorage.removeItem('fm_session'); location.href = 'signin.html'; };
  $('menuBtn').onclick = () => $('sidebar').classList.toggle('open');
  $('date').valueAsDate = new Date();
  let tx = JSON.parse(localStorage.getItem('fm_tx_' + session.email) || '[]');

  function render(){
    localStorage.setItem('fm_tx_' + session.email, JSON.stringify(tx));
    const sum = t => tx.filter(x => x.type === t).reduce((a, x) => a + x.amount, 0);
    const inc = sum('income'), exp = sum('expense');
    $('income').textContent = fmt(inc); $('expense').textContent = fmt(exp); $('balance').textContent = fmt(inc - exp);
    $('list').innerHTML = tx.length ? tx.slice().reverse().map(t =>
      `<li class="${t.type}"><span>${esc(t.title)}<small>${esc(t.category)} · ${t.date}</small></span><b>${t.type === 'income' ? '+' : '-'}${fmt(t.amount)}</b><button data-id="${t.id}" aria-label="Delete">✕</button></li>`
    ).join('') : '<li>No transactions yet. Add your first one above.</li>';
    const cats = {};
    tx.filter(x => x.type === 'expense').forEach(x => cats[x.category] = (cats[x.category] || 0) + x.amount);
    $('cats').innerHTML = exp ? Object.entries(cats).map(([c, v]) =>
      `<div>${esc(c)} <small>${fmt(v)}</small><div class="bar"><i style="width:${v / exp * 100}%"></i></div></div>`).join('') : '<small>No expenses yet.</small>';
  }
  $('txForm').onsubmit = e => {
    e.preventDefault();
    const amount = parseFloat($('amount').value);
    if(!(amount > 0)) return;
    tx.push({id: Date.now(), title: $('title').value.trim(), amount, type: $('type').value, category: $('category').value, date: $('date').value});
    e.target.reset(); $('date').valueAsDate = new Date(); render();
  };
  $('list').onclick = e => { const id = e.target.dataset.id; if(id){ tx = tx.filter(x => x.id != id); render(); } };
  $('emiBtn').onclick = () => {
    const P = +$('p').value, r = +$('r').value / 12 / 100, n = +$('n').value * 12;
    if(!(P > 0) || !(n > 0)) return $('emiOut').textContent = 'Enter a loan amount and tenure.';
    const emi = r ? P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : P / n;
    $('emiOut').textContent = `Monthly EMI: ${fmt(emi)} | Total payable: ${fmt(emi * n)} | Interest: ${fmt(emi * n - P)}`;
  };
  render();
})();
