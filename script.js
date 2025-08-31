// PLUTO main script - fixed
document.addEventListener('DOMContentLoaded', () => {
  // Nav link routing
  document.querySelectorAll('[data-page]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      changePage(a.getAttribute('data-page'));
    });
  });

  // Sidebar toggle
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (sidebarToggle) sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('active'));

  // Language menu (stub)
  document.querySelector('.language-btn')?.addEventListener('click', () => changeLanguage('tr'));

  // Auth buttons
  document.querySelectorAll('.open-login').forEach(b => b.addEventListener('click', () => openModal(document.getElementById('loginModal'))));
  document.querySelectorAll('.open-register').forEach(b => b.addEventListener('click', () => openModal(document.getElementById('registerModal'))));

  // Close buttons
  document.querySelectorAll('.modal .close').forEach(b => b.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    closeModal(modal);
  }));

  // Close on backdrop
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (e) => { if (e.target === m) closeModal(m); });
  });

  // Forms
  document.getElementById('loginForm')?.addEventListener('submit', (e) => { e.preventDefault(); loginUser(); });
  document.getElementById('registerForm')?.addEventListener('submit', (e) => { e.preventDefault(); registerUser(); });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => { e.preventDefault(); logoutUser(); });

  // Profile dropdown
  document.querySelector('.user-profile-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const dd = document.querySelector('.user-dropdown');
    if (dd) dd.style.display = (dd.style.display === 'block') ? 'none' : 'block';
  });
  document.addEventListener('click', () => { const dd = document.querySelector('.user-dropdown'); if (dd) dd.style.display = 'none'; });

  // Support form
  document.getElementById('supportForm')?.addEventListener('submit', (e) => { e.preventDefault(); submitSupportRequest(); });

  // Download buttons
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); downloadFile(btn); });
  });

  // Init
  checkLoginStatus();
});

// Routing
function changePage(pageId){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId + '-page');
  if (!target){ console.error('Sayfa bulunamadı:', pageId); return; }
  target.classList.add('active');
  document.title = 'PLUTO - ' + getPageTitle(pageId);
  window.scrollTo({top:0, behavior:'smooth'});

  // Guard download page
  if (pageId === 'download' && localStorage.getItem('userLoggedIn') !== 'true'){
    setTimeout(() => alert('Dosya indirmek için giriş yapmalısınız!'), 300);
  }
}

function getPageTitle(pageId){
  const t = {home:'Ana Sayfa', features:'Özellikler', pricing:'Fiyatlandırma', download:'Dosya İndirme', support:'Destek', profile:'Profil', subscription:'Abonelik', downloads:'İndirme Geçmişi'};
  return t[pageId] || 'PLUTO';
}

// Support
function submitSupportRequest(){
  const s = document.getElementById('supportSubject').value.trim();
  const c = document.getElementById('supportCategory').value.trim();
  const m = document.getElementById('supportMessage').value.trim();
  if (!s || !c || !m){ alert('Lütfen tüm alanları doldurun.'); return; }
  alert('Destek talebiniz başarıyla gönderildi! En kısa sürede dönüş yapacağız.');
  document.getElementById('supportForm').reset();
}

// Download
function downloadFile(button){
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  if (!isLoggedIn){
    alert('Dosya indirmek için giriş yapmalısınız!');
    openModal(document.getElementById('loginModal'));
    return;
  }
  const name = button.closest('.download-item')?.querySelector('h3')?.textContent || 'Dosya';
  alert(name + ' indiriliyor...\n\nGerçek bir uygulamada dosya indirme işlemi başlayacaktır.');
  button.disabled = true; const original = button.innerHTML;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> İndiriliyor...';
  setTimeout(() => { button.innerHTML = '<i class="fas fa-check"></i> İndirildi'; setTimeout(() => { button.innerHTML = original; button.disabled = false; }, 1800); }, 1500);
}

// Language (stub for extension)
function changeLanguage(lang){
  const btn = document.querySelector('.language-btn');
  if (!btn) return;
  if (lang === 'tr'){ btn.innerHTML = '<i class="fas fa-globe"></i> <span class="nav-text">Türkçe</span> <i class="fas fa-chevron-down"></i>'; }
  else if (lang === 'en'){ btn.innerHTML = '<i class="fas fa-globe"></i> <span class="nav-text">English</span> <i class="fas fa-chevron-down"></i>'; }
  else if (lang === 'ru'){ btn.innerHTML = '<i class="fas fa-globe"></i> <span class="nav-text">Русский</span> <i class="fas fa-chevron-down"></i>'; }
}

// Auth
function openModal(modal){ if (modal){ modal.style.display = 'block'; modal.setAttribute('aria-hidden','false'); } }
function closeModal(modal){ if (modal){ modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); } }

function loginUser(){
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  if (!email || !pass){ alert('E‑posta ve şifre gerekli.'); return; }
  localStorage.setItem('userLoggedIn','true');
  localStorage.setItem('userEmail', email);
  closeModal(document.getElementById('loginModal'));
  checkLoginStatus();
  changePage('profile');
}

function registerUser(){
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const pass = document.getElementById('registerPassword').value;
  if (!name || !email || pass.length < 6){ alert('Lütfen bilgileri doğru girin.'); return; }
  localStorage.setItem('userLoggedIn','true');
  localStorage.setItem('userName', name);
  localStorage.setItem('userEmail', email);
  closeModal(document.getElementById('registerModal'));
  checkLoginStatus();
  changePage('profile');
}

function logoutUser(){
  localStorage.removeItem('userLoggedIn');
  // keep name/email for demo or clear if preferred
  checkLoginStatus();
  changePage('home');
}

function checkLoginStatus(){
  const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
  document.querySelectorAll('.auth-only').forEach(el => el.style.display = loggedIn ? '' : 'none');
  document.querySelector('.sidebar .open-login')?.closest('div')?.classList.toggle('hidden', loggedIn);
  // Switch action blocks
  const userBlock = document.querySelector('.user-actions');
  const loginBtn = document.querySelector('.open-login')?.closest('.sidebar-actions');
  if (userBlock){
    userBlock.style.display = loggedIn ? 'flex' : 'none';
  }
  // profile values
  document.getElementById('profileName').textContent = localStorage.getItem('userName') || 'Kullanıcı';
  document.getElementById('profileEmail').textContent = localStorage.getItem('userEmail') || '—';
}
