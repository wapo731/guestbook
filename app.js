// app.js — simple client-side guestbook using localStorage
(function(){
  const STORAGE_KEY = 'guestbook.entries.v1';
  const form = document.getElementById('guestbook-form');
  const entriesList = document.getElementById('entries-list');
  const clearBtn = document.getElementById('clear-local');

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function loadEntries(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      console.error('Failed to load entries', e);
      return [];
    }
  }

  function saveEntries(entries){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }catch(e){
      console.error('Failed to save entries', e);
    }
  }

  function render(){
    const entries = loadEntries();
    entriesList.innerHTML = '';
    if(entries.length === 0){
      entriesList.innerHTML = '<li class="muted">No entries yet — be the first to sign!</li>';
      return;
    }
    entries.slice().reverse().forEach(entry => {
      const li = document.createElement('li');
      li.className = 'entry';
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${entry.name} • ${new Date(entry.timestamp).toLocaleString()}`;
      const msg = document.createElement('div');
      msg.className = 'message';
      msg.innerHTML = escapeHtml(entry.message);
      li.appendChild(meta);
      li.appendChild(msg);
      entriesList.appendChild(li);
    });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = (form.name.value || 'Anonymous').trim();
    const message = (form.message.value || '').trim();
    if(!message){
      form.message.focus();
      return;
    }
    const entries = loadEntries();
    entries.push({name: name || 'Anonymous', message: message, timestamp: Date.now()});
    saveEntries(entries);
    form.reset();
    render();
  });

  clearBtn.addEventListener('click', function(){
    if(!confirm('Clear all guestbook entries stored in this browser?')) return;
    localStorage.removeItem(STORAGE_KEY);
    render();
  });

  // initial render
  render();
})();
