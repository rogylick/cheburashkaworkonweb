
class Store {
  constructor() {
    this.state = this.loadState();
    this.listeners = []; // Масив функцій, які треба викликати при зміні стану
  }

  // Завантаження даних з localStorage при ініціалізації
  loadState() {
    return {
      users: JSON.parse(localStorage.getItem('users')) || [],
      currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
      urls: JSON.parse(localStorage.getItem('urls')) || []
    };
  }

  // Підписка на оновлення (View підписується на Store)
  subscribe(listener) {
    this.listeners.push(listener);
  }

  // Оповіщення всіх підписників про зміну стану
  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // ЄДИНИЙ спосіб змінити стан (основа Unidirectional Data Flow)
  setState(newState) {
    this.state = { ...this.state, ...newState };
    
    // Зберігаємо оновлений стан у localStorage
    localStorage.setItem('users', JSON.stringify(this.state.users));
    localStorage.setItem('currentUser', JSON.stringify(this.state.currentUser));
    localStorage.setItem('urls', JSON.stringify(this.state.urls));
    
    // Сповіщаємо інтерфейс, що треба оновитись
    this.notify();
  }

  // Отримання поточного стану
  getState() {
    return this.state;
  }
}

// Створюємо глобальний екземпляр сховища
window.AppStore = new Store();