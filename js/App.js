// ═══════════════════════════════════════
//   VITRU — app.js
// ═══════════════════════════════════════

// ── STATE ──
let profiles = [
  { name: 'Vitão',  theme: 'av-1', kids: false },
  { name: 'Yasmin', theme: 'av-2', kids: false },
  { name: 'Kids',  theme: 'av-3', kids: true  },
];
let activeProfile = null;
let selectedTheme = 'av-1';
let kidsOn = false;

// ══════════════════════════════════════
//   NAVEGAÇÃO ENTRE TELAS (SPA)
// ══════════════════════════════════════

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goToProfiles() {
  renderProfiles();
  showScreen('screen-profiles');
  closeDropdown();
}

function goToCreate() {
  // Reseta o formulário antes de exibir
  document.getElementById('profile-name-input').value = '';
  document.getElementById('avatar-initial').textContent = '?';
  document.getElementById('avatar-preview').className = 'avatar-preview-big av-1';
  document.getElementById('kids-toggle').classList.remove('on');
  selectedTheme = 'av-1';
  kidsOn = false;
  document.querySelectorAll('.av-swatch').forEach(s =>
    s.classList.toggle('selected', s.dataset.theme === 'av-1')
  );
  closeDropdown();
  showScreen('screen-create');
}

function goToMain(profile) {
  activeProfile = profile;
  updateNavForProfile();
  renderDropdownProfiles();
  showScreen('screen-main');
  showToast(`Bem-vindo(a), <strong>${profile.name}</strong>! 👋`);
}

// ══════════════════════════════════════
//   TELA 1 — SELEÇÃO DE PERFIL
// ══════════════════════════════════════

function renderProfiles() {
  const grid = document.getElementById('profiles-grid');
  grid.innerHTML = '';

  profiles.forEach(p => {
    const initial = p.name.trim()[0]?.toUpperCase() || '?';
    const div = document.createElement('div');
    div.className = 'profile-item';
    div.innerHTML = `
      <div class="profile-avatar ${p.theme}">${initial}</div>
      <div class="profile-name">${p.name}${p.kids ? ' 🧒' : ''}</div>
    `;
    div.onclick = () => goToMain(p);
    grid.appendChild(div);
  });

  // Botão "Novo Perfil"
  const add = document.createElement('div');
  add.className = 'profile-item profile-add';
  add.innerHTML = `
    <div class="profile-avatar">+</div>
    <div class="profile-name">Novo Perfil</div>
  `;
  add.onclick = goToCreate;
  grid.appendChild(add);
}

// ══════════════════════════════════════
//   TELA 2 — CRIAR PERFIL
// ══════════════════════════════════════

/** Atualiza a inicial do avatar conforme o usuário digita */
function updateAvatarInitial(val) {
  document.getElementById('avatar-initial').textContent =
    val.trim()[0]?.toUpperCase() || '?';
}

/** Seleciona a cor/tema do avatar */
function selectTheme(el) {
  document.querySelectorAll('.av-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  selectedTheme = el.dataset.theme;
  document.getElementById('avatar-preview').className = 'avatar-preview-big ' + selectedTheme;
}

/** Liga/desliga o toggle de perfil infantil */
function toggleKids() {
  kidsOn = !kidsOn;
  document.getElementById('kids-toggle').classList.toggle('on', kidsOn);
}

/** Salva o novo perfil e vai direto pra tela principal */
function saveProfile() {
  const name = document.getElementById('profile-name-input').value.trim();
  if (!name) {
    // Feedback visual de erro no campo
    const inp = document.getElementById('profile-name-input');
    inp.style.borderColor = 'rgba(229,9,20,0.7)';
    inp.focus();
    setTimeout(() => (inp.style.borderColor = ''), 1600);
    return;
  }
  const p = { name, theme: selectedTheme, kids: kidsOn };
  profiles.push(p);
  goToMain(p);
}

// ══════════════════════════════════════
//   TELA 3 — NAVBAR / DROPDOWN
// ══════════════════════════════════════

/** Atualiza o avatar no canto da navbar com o perfil ativo */
function updateNavForProfile() {
  if (!activeProfile) return;
  const av = document.getElementById('nav-avatar');
  av.className = 'nav-avatar ' + activeProfile.theme;
  av.textContent = activeProfile.name.trim()[0]?.toUpperCase() || '?';
}

/** Renderiza a lista de perfis dentro do dropdown */
function renderDropdownProfiles() {
  const list = document.getElementById('dropdown-profiles-list');
  list.innerHTML = '';

  profiles.forEach(p => {
    const initial = p.name.trim()[0]?.toUpperCase() || '?';
    const isActive =
      activeProfile &&
      p.name === activeProfile.name &&
      p.theme === activeProfile.theme;

    const div = document.createElement('div');
    div.className = 'dropdown-profile';
    div.innerHTML = `
      <div class="dp-av ${p.theme}">${initial}</div>
      <div class="dp-name" style="${isActive ? 'color:white;font-weight:500' : ''}">
        ${p.name}${p.kids ? ' 🧒' : ''}
      </div>
      ${isActive ? '<span style="margin-left:auto;font-size:0.7rem;color:var(--text-dim)">ativo</span>' : ''}
    `;
    div.onclick = () => { closeDropdown(); goToMain(p); };
    list.appendChild(div);
  });
}

function toggleDropdown() {
  renderDropdownProfiles();
  document.getElementById('nav-dropdown').classList.toggle('open');
}

function closeDropdown() {
  document.getElementById('nav-dropdown').classList.remove('open');
}

// Fecha o dropdown ao clicar fora
document.addEventListener('click', e => {
  if (!e.target.closest('.nav-user')) closeDropdown();
});

// ══════════════════════════════════════
//   NAVBAR SCROLL
// ══════════════════════════════════════
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

// ══════════════════════════════════════
//   CATEGORIAS
// ══════════════════════════════════════
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ══════════════════════════════════════
//   TOAST (notificação de boas-vindas)
// ══════════════════════════════════════
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

// ══════════════════════════════════════
//   INIT — roda ao carregar a página
// ══════════════════════════════════════
renderProfiles();