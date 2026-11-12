// FR-06: keyword-matching chatbot with floating button
(function(){
  const replies = [
    [/hello|hi\b|hey/, 'Hi! Ask me about budgeting, saving, EMI or expenses.'],
    [/sav(e|ing)/, 'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.'],
    [/emi|loan/, 'EMI = P×r×(1+r)^n ÷ ((1+r)^n − 1). Use the EMI calculator on the dashboard.'],
    [/budget/, 'List your income, set a limit for each category, and review weekly.'],
    [/expense|spend/, 'Add expenses on the dashboard. Totals and categories update automatically.'],
    [/invest/, 'Build an emergency fund first, then consider diversified long-term options.'],
    [/thank|bye/, 'Happy to help. Keep tracking!']
  ];
  const box = document.createElement('div');
  box.innerHTML = '<button class="chat-fab" id="chatFab" aria-label="Open chat">💬</button>' +
    '<div class="chat-panel" id="chatPanel"><div class="chat-head">FinBot</div><div class="chat-log" id="chatLog"></div>' +
    '<div class="chat-input"><input id="chatText" placeholder="Ask something..."><button class="btn" id="chatSend">Send</button></div></div>';
  document.body.appendChild(box);
  const panel = document.getElementById('chatPanel'), log = document.getElementById('chatLog'), input = document.getElementById('chatText');
  function add(text, cls){
    const m = document.createElement('div'); m.className = cls; m.textContent = text;
    log.appendChild(m); log.scrollTop = log.scrollHeight;
  }
  function send(){
    const t = input.value.trim(); if(!t) return;
    add(t, 'user-msg'); input.value = '';
    const hit = replies.find(r => r[0].test(t.toLowerCase()));
    setTimeout(() => add(hit ? hit[1] : 'Sorry, try: save, budget, EMI, expenses or invest.', 'bot-msg'), 400);
  }
  document.getElementById('chatFab').onclick = () => { panel.classList.toggle('open'); if(!log.children.length) add('Hello! I\'m FinBot. How can I help?', 'bot-msg'); };
  document.getElementById('chatSend').onclick = send;
  input.addEventListener('keydown', e => { if(e.key === 'Enter') send(); });
})();
