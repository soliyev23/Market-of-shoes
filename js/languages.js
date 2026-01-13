// Language Management System
let i18n = null;

class LanguageManager {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.translations = {};
    this.loadAndInit();
  }

  async loadAndInit() {
    try {
      const response = await fetch('/languages.json');
      if (!response.ok) throw new Error('Failed to load languages.json');
      
      this.translations = await response.json();
      console.log('Translations loaded successfully', this.translations);
      
      // Apply language on load
      this.applyLanguage(this.currentLanguage);
      
      // Wait a bit for DOM to be fully ready, then add switcher
      setTimeout(() => {
        this.createLanguageSwitcher();
        this.attachEventListeners();
      }, 100);
      
    } catch (error) {
      console.error('Error initializing language manager:', error);
    }
  }

  createLanguageSwitcher() {
    // Remove old switcher if exists
    const oldSwitcher = document.querySelector('.language-switcher');
    if (oldSwitcher) {
      oldSwitcher.remove();
    }

    // Create new switcher
    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.innerHTML = `
      <button class="lang-btn" data-lang="en">EN</button>
      <button class="lang-btn" data-lang="ru">РУ</button>
      <button class="lang-btn" data-lang="uz">УЗ</button>
    `;
    
    // Find best place to add it
    let target = document.querySelector('header .user-items');
    if (!target) {
      target = document.querySelector('header');
    }
    if (!target) {
      target = document.querySelector('.navbar');
    }
    if (!target) {
      target = document.body;
    }

    if (target) {
      target.insertBefore(switcher, target.firstChild);
    }

    // Update button states
    this.updateButtonStates();
  }

  attachEventListeners() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const lang = e.target.dataset.lang;
        this.setLanguage(lang);
      });
    });
  }

  updateButtonStates() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.lang === this.currentLanguage) {
        btn.classList.add('active');
      }
    });
  }

  setLanguage(lang) {
    if (!this.translations[lang]) return;
    
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    this.applyLanguage(lang);
    this.updateButtonStates();
  }

  applyLanguage(lang) {
    if (!this.translations[lang]) {
      lang = 'en';
    }

    const translation = this.translations[lang];
    
    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      const text = this.getText(key, translation);
      if (text) {
        element.textContent = text;
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.dataset.i18nPlaceholder;
      const text = this.getText(key, translation);
      if (text) {
        element.placeholder = text;
      }
    });

    // Set document language
    document.documentElement.lang = lang;
  }

  getText(keyPath, translation) {
    const keys = keyPath.split('.');
    let value = translation;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }
    
    return typeof value === 'string' ? value : null;
  }
}

// Initialize when script loads
i18n = new LanguageManager();

// Also reinitialize on DOMContentLoaded to ensure all elements are loaded
document.addEventListener('DOMContentLoaded', () => {
  if (i18n) {
    setTimeout(() => {
      i18n.createLanguageSwitcher();
      i18n.attachEventListeners();
      i18n.applyLanguage(i18n.currentLanguage);
    }, 200);
  }
});
