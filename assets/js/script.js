let fuse = null;
let searchDebounceTimer = null;

function getOverviewPages() {
  return {
    'Cơ bản': 'basics.html',
    'Kiểu dữ liệu': 'types.html',
    'Hàm & Closure': 'funcs.html',
    'Struct & Interface': 'structs.html',
    'Concurrency': 'concurrency.html',
    'Generics': 'generics.html',
    'Memory & GC': 'memory.html',
    'Nâng cao': 'advanced.html',
    'Keywords': 'keywords.html'
  };
}

function updateOverviewCounts() {
  if (!Array.isArray(window.SEARCH_DATA)) return;

  const countsByUrl = {};
  window.SEARCH_DATA.forEach(item => {
    countsByUrl[item.url] = (countsByUrl[item.url] || 0) + 1;
  });

  document.querySelectorAll('.overview-card[data-page]').forEach(card => {
    const page = card.dataset.page;
    const count = countsByUrl[page];
    const countEl = card.querySelector('.overview-count');
    if (!countEl || !count) return;

    countEl.textContent = page === 'keywords.html'
      ? `${count} mục tra cứu`
      : `${count} chủ đề`;
  });
}

function showSection(id){
  const section = document.getElementById(id);
  if (!section) {
    if (id === 'overview') window.location.href = 'index.html';
    else if (id === 'basics') window.location.href = 'basics.html';
    return;
  }
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  section.classList.add('active');
  window.scrollTo(0,0);
}

function toggleCard(card){
  card.classList.toggle('expanded');
}

function initSearch() {
  if (fuse) return;
  if (typeof window.SEARCH_DATA === 'undefined') {
    console.error("Search data is missing. Please ensure assets/js/search_data.js is loaded.");
    return;
  }
  
  const options = {
    includeScore: true,
    threshold: 0.3,
    ignoreLocation: true,
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'desc', weight: 0.3 },
      { name: 'content', weight: 0.2 }
    ]
  };
  fuse = new Fuse(window.SEARCH_DATA, options);
}

function globalSearch(query){
  clearTimeout(searchDebounceTimer);
  if (query.trim() === '') {
    executeSearch('');
  } else {
    searchDebounceTimer = setTimeout(() => {
      executeSearch(query);
    }, 250);
  }
}

function executeSearch(query){
  const q = query.trim();
  const results = document.getElementById('search-results');
  const content = document.getElementById('overview-content');
  if (!results || !content) return;

  if(q === ''){
    results.innerHTML = '';
    content.style.display = 'block';
    return;
  }

  initSearch();
  content.style.display = 'none';

  if (!fuse) {
    results.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">Không thể tải dữ liệu tìm kiếm.</div>';
    return;
  }

  const matches = fuse.search(q);
  results.innerHTML = '';
  
  if (matches.length === 0) {
    results.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">Không tìm thấy kết quả phù hợp.</div>';
    return;
  }

  matches.forEach(m => {
    const item = m.item;
    const el = document.createElement('div');
    el.className = 'topic-card';
    el.innerHTML = item.html;
    
    // Add click event listener to the newly created card
    el.addEventListener('click', function() { toggleCard(this); });
    
    const headerDiv = el.querySelector('.topic-header > div');
    if (headerDiv) {
      const badge = document.createElement('div');
      badge.className = 'search-cat-badge';
      badge.textContent = item.category + ' ↗';
      badge.title = 'Đi đến trang ' + item.category;
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = item.url;
      });
      headerDiv.appendChild(badge);
    }
    
    results.appendChild(el);
  });
  
  // Re-run Prism highlight on newly added content if Prism exists
  if (window.Prism) {
    Prism.highlightAllUnder(results);
  }
}

function clearGlobalSearch(){
  const input = document.getElementById('globalSearch');
  if(input) input.value = '';
  globalSearch('');
}

document.addEventListener('DOMContentLoaded', () => {
  updateOverviewCounts();

  // Global Search bindings
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => globalSearch(e.target.value));
  }
  
  const clearBtn = document.querySelector('.clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearGlobalSearch);
  }

  // Header click binding (Về trang chủ)
  document.querySelectorAll('header').forEach(hdr => {
    hdr.style.cursor = 'pointer';
    hdr.title = 'Về trang chủ';
    hdr.addEventListener('click', () => window.location.href = 'index.html');
  });

  // Overview card click binding
  const overviewPages = getOverviewPages();
  document.querySelectorAll('.overview-card').forEach(card => {
    card.addEventListener('click', () => {
      const label = card.querySelector('.overview-label').textContent;
      const page = card.dataset.page || overviewPages[label];
      if (page) window.location.href = page;
    });
  });

  // Topic card click bindings for existing cards
  document.querySelectorAll('.topic-card').forEach(card => {
    card.addEventListener('click', function() { toggleCard(this); });
  });

  // Add back buttons to sections
  const labels = {
    'basics':'Cơ bản',
    'types':'Kiểu dữ liệu',
    'funcs':'Hàm & Closure',
    'structs':'Struct & Interface',
    'concurrency':'Concurrency',
    'generics':'Generics',
    'memory':'Memory & GC',
    'advanced':'Kỹ thuật nâng cao',
    'keywords': 'Keywords'
  };
  
  document.querySelectorAll('.section').forEach(sec => {
    // Nếu section đã có tiêu đề (được hardcode trong HTML), không chèn thêm
    const existingTitle = sec.querySelector('.section-title');
    if (existingTitle) {
      const existingBack = Array.from(existingTitle.querySelectorAll('span')).find(span => span.textContent.includes('Quay lại Dashboard'));
      if (existingBack) {
        existingBack.addEventListener('click', () => window.location.href = 'index.html');
      }
      return;
    }

    if(sec.id !== 'overview' && labels[sec.id]) {
      const title = document.createElement('div');
      title.className = 'section-title';
      title.style.marginTop = '0';
      title.style.justifyContent = 'space-between';
      
      const spanTitle = document.createElement('span');
      spanTitle.textContent = labels[sec.id];
      
      const spanBack = document.createElement('span');
      spanBack.style.fontSize = '14px';
      spanBack.style.fontWeight = 'normal';
      spanBack.style.color = 'var(--text-secondary)';
      spanBack.style.cursor = 'pointer';
      spanBack.textContent = '← Quay lại Dashboard';
      spanBack.addEventListener('click', () => window.location.href = 'index.html');
      
      title.appendChild(spanTitle);
      title.appendChild(spanBack);
      sec.insertBefore(title, sec.firstChild);
    }
  });
});
