// ============================================
// RECOMMEND FUNCTIONALITY
// ============================================
const btn = document.getElementById('recommendBtn');
const input = document.getElementById('movieInput');
const grid = document.getElementById('movieGrid');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const resultsHeader = document.getElementById('resultsHeader');
const resultMovieName = document.getElementById('resultMovieName');
const errorMsg = document.getElementById('errorMsg');

btn.addEventListener('click', async () => {
  const movie = input.value.trim();
  if (!movie) return;

  grid.innerHTML = '';
  errorMsg.style.display = 'none';
  resultsHeader.style.display = 'none';
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';
  btn.disabled = true;

  try {
    const res = await fetch('/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie })
    });
    const data = await res.json();

    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
    btn.disabled = false;

    if (!data.length) {
      errorMsg.style.display = 'block';
      return;
    }

    resultsHeader.style.display = 'block';
    resultMovieName.textContent = `Because you searched: "${movie}"`;

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="${item.poster}" alt="${item.title}"
          onerror="this.src='https://via.placeholder.com/300x450/141414/888?text=No+Poster'"/>
        <div class="card-body">
          <div class="card-title">${item.title}</div>
          <span class="card-badge">Recommended</span>
        </div>
      `;
      grid.appendChild(card);
    });

    resultsHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (err) {
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
    btn.disabled = false;
    errorMsg.style.display = 'block';
  }
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') btn.click();
});

// ============================================
// HAMBURGER MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// ============================================
// DARK / LIGHT MODE
// ============================================
const darkToggle = document.getElementById('darkToggle');
let isDark = true;
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    isDark = !isDark;
    if (!isDark) {
      document.documentElement.style.setProperty('--bg', '#f5f5f5');
      document.documentElement.style.setProperty('--surface', '#ffffff');
      document.documentElement.style.setProperty('--surface2', '#eeeeee');
      document.documentElement.style.setProperty('--border', '#dddddd');
      document.documentElement.style.setProperty('--text', '#111111');
      document.documentElement.style.setProperty('--muted', '#666666');
      darkToggle.textContent = '☀️ Light Mode';
      document.body.style.background = '#f5f5f5';
      document.body.style.color = '#111';
    } else {
      document.documentElement.style.setProperty('--bg', '#0a0a0a');
      document.documentElement.style.setProperty('--surface', '#141414');
      document.documentElement.style.setProperty('--surface2', '#1f1f1f');
      document.documentElement.style.setProperty('--border', '#2a2a2a');
      document.documentElement.style.setProperty('--text', '#e5e5e5');
      document.documentElement.style.setProperty('--muted', '#888');
      darkToggle.textContent = '🌙 Dark Mode';
      document.body.style.background = '#0a0a0a';
      document.body.style.color = '#e5e5e5';
    }
  });
}

// ============================================
// LOGIN MODAL
// ============================================
const loginBtn = document.querySelector('.login-btn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const goSignup = document.getElementById('goSignup');
const goLogin = document.getElementById('goLogin');

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    modalOverlay.classList.add('open');
  });
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('open');
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('open');
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay) {
    modalOverlay.classList.remove('open');
  }
});

if (loginTab) {
  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
  });
}

if (signupTab) {
  signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
  });
}

if (goSignup) goSignup.addEventListener('click', () => signupTab.click());
if (goLogin) goLogin.addEventListener('click', () => loginTab.click());

// ============================================
// LOGIN SUBMIT
// ============================================
function handleUserLogin(name, email) {
  modalOverlay.classList.remove('open');

  // Navbar update
  const navActions = document.querySelector('.nav-actions');
  navActions.innerHTML = `
    <div class="user-info">
      <div class="user-avatar">${name.charAt(0).toUpperCase()}</div>
      <span class="user-name">Hi, ${name}!</span>
      <button class="logout-btn" id="logoutBtn">Logout</button>
    </div>
  `;

  // Hero update
  document.querySelector('.hero-content h1').innerHTML =
    `Welcome Back,<br/><span class="highlight">${name}! 🎬</span>`;
  document.querySelector('.hero-desc').textContent =
    'Your personalized recommendations are ready. Search a movie to get started!';

  // Show profile section
  const profileSection = document.getElementById('profileSection');
  if (profileSection) {
    profileSection.style.display = 'block';
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email;
  }

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    location.reload();
  });
}

// Login form submit
const loginFormBtn = document.querySelector('#loginForm .modal-btn');
if (loginFormBtn) {
  loginFormBtn.addEventListener('click', () => {
    const inputs = loginForm.querySelectorAll('input');
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    if (!email || !password) {
      alert('⚠️ Please fill all fields!');
      return;
    }

    handleUserLogin(email.split('@')[0], email);
  });
}

// Signup form submit
const signupFormBtn = document.querySelector('#signupForm .modal-btn');
if (signupFormBtn) {
  signupFormBtn.addEventListener('click', () => {
    const inputs = signupForm.querySelectorAll('input');
    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value.trim();

    if (!name || !email || !password) {
      alert('⚠️ Please fill all fields!');
      return;
    }
    if (password.length < 6) {
      alert('⚠️ Password must be at least 6 characters!');
      return;
    }

    handleUserLogin(name, email);
  });
}