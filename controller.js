
const Controller = {
  // Ініціалізація додатку
  init() {
    // 1. Підписуємось на зміни у Store
    AppStore.subscribe((state) => {
      // Фільтруємо посилання: показуємо лише ті, що належать поточному користувачу
      const currentUserEmail = state.currentUser ? state.currentUser.email : null;
      const userUrls = state.urls.filter(url => url.userEmail === currentUserEmail);
      
      this.renderUrls(userUrls);
      this.renderProfile(state.currentUser);
    });

    // 2. Робимо початковий рендер
    const initialState = AppStore.getState();
    const currentUserEmail = initialState.currentUser ? initialState.currentUser.email : null;
    const userUrls = initialState.urls.filter(url => url.userEmail === currentUserEmail);

    this.renderUrls(userUrls);
    this.renderProfile(initialState.currentUser);

    this.setupEventListeners();
  },

  setupEventListeners() {
    // Перехоплюємо форму додавання URL на головній сторінці
    const urlForm = document.querySelector('form');
    // Перевіряємо, чи ми на сторінці index.html
    if (urlForm && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
      urlForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addUrl();
      });
    }
  },

  // ==========================================
  // ACTIONS (Дії) - Оновлюють Store
  // ==========================================

  register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('reg-email').value;
    const gender = document.getElementById('gender').value;
    const birth = document.getElementById('birth').value;
    const password = document.getElementById('reg-password').value;

    if (!name || !email || !password) {
      alert('Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    const state = AppStore.getState();
    const userExists = state.users.some((user) => user.email === email);

    if (userExists) {
      alert('Користувач з таким email вже існує!');
      return;
    }

    const newUser = { name, email, gender, birth, password };
    AppStore.setState({ users: [...state.users, newUser] });

    alert('Реєстрація успішна! Тепер ви можете увійти.');
    window.location.href = 'login.html';
  },

  login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const state = AppStore.getState();
    const user = state.users.find((u) => u.email === email && u.password === password);

    if (user) {
      AppStore.setState({ currentUser: user });
      window.location.href = 'details.html';
    } else {
      alert('Невірний email або пароль');
    }
  },

  logout() {
    AppStore.setState({ currentUser: null });
    window.location.href = 'login.html';
  },

  addUrl() {
  const originalInput = document.querySelector('input[type="url"]');
  if (!originalInput || !originalInput.value.trim()) return;

  const original = originalInput.value.trim();
  const shortString = Math.random().toString(36).substring(2, 8);
  const short = `https://short.ly/${shortString}`;

  const state = AppStore.getState();
  
  // Додаємо прив'язку до поточного користувача (або null для гостей)
  const userEmail = state.currentUser ? state.currentUser.email : null;
  const newUrl = { id: Date.now(), original, short, userEmail };

  AppStore.setState({ urls: [...state.urls, newUrl] });
  originalInput.value = '';
},

  // Заглушки для сумісності з вашим HTML, 
  // хоча init() вже все робить автоматично
  loadUrls() {
    const state = AppStore.getState();
    const currentUserEmail = state.currentUser ? state.currentUser.email : null;
    const userUrls = state.urls.filter(url => url.userEmail === currentUserEmail);
    this.renderUrls(userUrls);
  },

  loadProfile() {
    this.renderProfile(AppStore.getState().currentUser);
  },

  // ==========================================
  // VIEW RENDERERS - Оновлюють DOM
  // ==========================================

  renderUrls(urls) {
    const tbody = document.getElementById('url-list');
    if (!tbody) return; // Виходимо, якщо елемента немає на поточній сторінці

    tbody.innerHTML = ''; // Очищаємо таблицю
    urls.forEach((url, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><a href="${url.original}" target="_blank" rel="noopener noreferrer">${url.original}</a></td>
        <td><a href="${url.short}" class="short-url" target="_blank" rel="noopener noreferrer">${url.short}</a></td>
      `;
      tbody.appendChild(tr);
    });
  },

  renderProfile(user) {
    const nameEl = document.getElementById('p-name');
    if (!nameEl) return; 

    if (!user) {
      nameEl.textContent = 'Неавторизований (Гість)';
      document.getElementById('p-email').textContent = '—';
      document.getElementById('p-gender').textContent = '—';
      document.getElementById('p-birth').textContent = '—';
      return;
    }

    document.getElementById('p-name').textContent = user.name;
    document.getElementById('p-email').textContent = user.email || '—';
    document.getElementById('p-gender').textContent = user.gender || '—';
    document.getElementById('p-birth').textContent = user.birth || '—';
  }
};

// Запускаємо ініціалізацію після повного завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
  Controller.init();
});

// Експортуємо Controller в глобальну область видимості для inline-викличків з HTML
window.Controller = Controller;