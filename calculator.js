// FR-08: calculator with error handling
document.addEventListener('DOMContentLoaded', function(){
  const root = document.getElementById('calc'); if(!root) return;
  root.innerHTML = '<div class="calc-screen" id="screen">0</div><div class="calc-grid"></div>';
  const screen = root.querySelector('#screen'), grid = root.querySelector('.calc-grid');
  let exp = '';
  const show = t => screen.textContent = t || '0';
  const ops = '+-*/';
  ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','C','+','='].forEach(k => {
    const b = document.createElement('button'); b.textContent = k;
    if(k === '=') b.className = 'eq';
    b.onclick = function(){
      if(k === 'C'){ exp = ''; return show(''); }
      if(k === '='){
        if(!/^-?[\d.]+([+\-*/][\d.]+)*$/.test(exp)){ exp = ''; return show('Invalid expression'); }
        try{
          const r = Function('"use strict";return ' + exp)();
          if(!isFinite(r)){ exp = ''; return show('Cannot divide by zero'); }
          exp = String(+r.toFixed(8)); show(exp);
        }catch(e){ exp = ''; show('Error'); }
        return;
      }
      if(ops.includes(k) && ((exp === '' && k !== '-') || ops.includes(exp.slice(-1)))) return;
      exp += k; show(exp);
    };
    grid.appendChild(b);
  });
});
