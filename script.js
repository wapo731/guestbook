// Very small guestbook that stores entries in localStorage
(function(){
  const STORAGE_KEY = 'guestbook_entries_v1';

  function $(sel){return document.querySelector(sel)}
  function getEntries(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      console.error('Failed to load guestbook entries', e);
      return [];
    }
  }
  function saveEntries(entries){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function render(){
    const list = $("#entries");
    const empty = $("#empty");
    list.innerHTML = '';
    const entries = getEntries();
    if(entries.length === 0){
      empty.style.display = '';
      return;
    }
    empty.style.display = 'none';
    entries.slice().reverse().forEach(e => {
      const li = document.createElement('li');
      const meta = document.createElement('div');
      meta.className = 'entry-meta';
      const time = new Date(e.time);
      meta.textContent = `${e.name || 'Anonymous'} — ${time.toLocaleString()}`;
      const msg = document.createElement('div');
      msg.className = 'entry-message';
      msg.textContent = e.message;
      li.appendChild(meta);
      li.appendChild(msg);
      list.appendChild(li);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    render();

    const form = $('#guestbook-form');
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      const name = $('#name').value.trim();
      const message = $('#message').value.trim();
      if(!message) return;
      const entries = getEntries();
      entries.push({name: name || 'Anonymous', message, time: new Date().toISOString()});
      saveEntries(entries);
      $('#message').value = '';
      render();
    });

    $('#clear').addEventListener('click', function(){
      if(!confirm('Clear all guestbook entries? This cannot be undone.')) return;
      localStorage.removeItem(STORAGE_KEY);
      render();
    });
  });
})();
