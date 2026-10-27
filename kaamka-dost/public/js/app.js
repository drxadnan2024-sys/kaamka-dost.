// public/js/app.js - Main Application Coordinator for KaamKa Dost

import { SUPPORTED_LANGUAGES, getCurrentLanguage, setLanguage, t } from './translations.js';
import { PHONE_GUIDES } from './guides-data.js';
import { initScreenshotHelper } from './screenshot-helper.js';
import { initLetterMaker } from './letter-maker.js';
import { initLanguageAssistant } from './language-assistant.js';
import { initUtilityTools } from './utility-tools.js';
import { initCommunityBoard } from './community-board.js';
import { initUserProfile } from './user-profile.js';

// Global Toast System
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
    info: 'bg-slate-900 text-white',
    success: 'bg-emerald-600 text-white',
    warning: 'bg-amber-500 text-white',
    error: 'bg-rose-600 text-white'
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  toast.className = `toast px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold max-w-sm ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span class="flex-1">${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

class KaamKaDostApp {
  constructor() {
    this.currentView = 'home';
    this.init();
  }

  async init() {
    // 1. Language Setup
    const savedLang = getCurrentLanguage();
    setLanguage(savedLang);

    // 2. Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.warn('SW registration skipped:', err);
        });
      });
    }

    // 3. Setup Navigation & Hash Routing
    this.setupRouting();
    this.setupGlobalSearch();
    this.setupPwaInstall();
    this.setupDesktopSidebar();

    // 4. Initial View Render
    const initialHash = window.location.hash.replace('#', '') || 'home';
    this.navigate(initialHash);
  }

  setupRouting() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      this.navigate(hash);
    });

    // Mobile Bottom Nav items & Desktop Sidebar items
    document.querySelectorAll('[data-nav-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-nav-target');
        window.location.hash = target;
      });
    });

    // Quick Action cards on Home
    document.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-quick-action]');
      if (actionBtn) {
        const target = actionBtn.getAttribute('data-quick-action');
        window.location.hash = target;
      }
    });
  }

  navigate(viewName) {
    this.currentView = viewName;
    const mainViewArea = document.getElementById('main-view-container');
    if (!mainViewArea) return;

    // Update active nav pills
    document.querySelectorAll('[data-nav-target]').forEach(el => {
      const target = el.getAttribute('data-nav-target');
      const isActive = target === viewName;

      if (el.classList.contains('mobile-nav-item')) {
        el.className = isActive
          ? 'mobile-nav-item flex flex-col items-center justify-center flex-1 py-1 text-purple-600 font-bold'
          : 'mobile-nav-item flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-600';
      } else if (el.classList.contains('desktop-sidebar-item')) {
        el.className = isActive
          ? 'desktop-sidebar-item flex items-center gap-3 px-4 py-3 rounded-2xl bg-purple-50 text-purple-700 font-bold transition shadow-sm'
          : 'desktop-sidebar-item flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 transition font-medium';
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Render corresponding view
    switch (viewName) {
      case 'home':
        this.renderHome(mainViewArea);
        break;
      case 'screenshot':
        initScreenshotHelper(mainViewArea, showToast);
        break;
      case 'letters':
        initLetterMaker(mainViewArea, showToast);
        break;
      case 'assistant':
        initLanguageAssistant(mainViewArea, showToast);
        break;
      case 'guides':
        this.renderGuides(mainViewArea);
        break;
      case 'tools':
        initUtilityTools(mainViewArea, showToast);
        break;
      case 'community':
        initCommunityBoard(mainViewArea, showToast);
        break;
      case 'profile':
        initUserProfile(mainViewArea, showToast);
        break;
      default:
        this.renderHome(mainViewArea);
    }
  }

  renderHome(container) {
    const greeting = this.getTimeGreeting();

    container.innerHTML = `
      <div class="space-y-6 max-w-5xl mx-auto">
        <!-- Hero Welcome Banner -->
        <div class="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div class="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
          <div class="space-y-3 relative z-10">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
                🇮🇳 "हर छोटे काम का, एक स्मार्ट दोस्त"
              </span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
              ${greeting}, स्वागत है!
            </h1>
            <p class="text-purple-100 text-xs sm:text-base max-w-xl leading-relaxed">
              फोन की परेशानी हो, अंग्रेजी मैसेज समझना हो, या कोई जरूरी आवेदन पत्र लिखना हो—कामका दोस्त आपके साथ है।
            </p>

            <!-- Quick Action Pills -->
            <div class="flex flex-wrap gap-2 pt-2">
              <button type="button" data-quick-action="screenshot" class="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full text-xs font-semibold transition flex items-center gap-1.5">
                📸 स्क्रीनशॉट से एरर ठीक करें
              </button>
              <button type="button" data-quick-action="letters" class="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full text-xs font-semibold transition flex items-center gap-1.5">
                ✍️ छुट्टी / राशन कार्ड का पत्र
              </button>
              <button type="button" data-quick-action="tools" class="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full text-xs font-semibold transition flex items-center gap-1.5">
                ➗ परीक्षा प्रतिशत
              </button>
              <button type="button" data-quick-action="assistant" class="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full text-xs font-semibold transition flex items-center gap-1.5">
                📩 बैंक SMS समझें
              </button>
            </div>
          </div>
        </div>

        <!-- 6 Main Feature Cards Grid -->
        <div>
          <div class="flex items-center justify-between mb-3 px-1">
            <h2 class="font-bold text-slate-800 text-base sm:text-lg">मुख्य सुविधाएं (Main Features):</h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- 1. AI Screenshot Helper -->
            <div data-quick-action="screenshot" class="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition cursor-pointer flex flex-col justify-between group space-y-4">
              <div class="space-y-2.5">
                <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  📸
                </div>
                <h3 class="font-bold text-slate-900 text-lg group-hover:text-purple-700 transition">
                  AI स्क्रीनशॉट सहायक
                </h3>
                <p class="text-xs text-slate-500 leading-relaxed">
                  PhonePe, GPay, WhatsApp या Play Store की समस्या का स्क्रीनशॉट दें, आसान हिंदी में समाधान पाएं।
                </p>
              </div>
              <span class="text-xs font-bold text-purple-600 flex items-center gap-1">
                समस्या हल करें →
              </span>
            </div>

            <!-- 2. Letter Maker -->
            <div data-quick-action="letters" class="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition cursor-pointer flex flex-col justify-between group space-y-4">
              <div class="space-y-2.5">
                <div class="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  ✍️
                </div>
                <h3 class="font-bold text-slate-900 text-lg group-hover:text-purple-700 transition">
                  आवेदन व पत्र निर्माता
                </h3>
                <p class="text-xs text-slate-500 leading-relaxed">
                  ऑफिस छुट्टी, स्कूल पत्र, राशन कार्ड, नगर निगम शिकायत, या नौकरी का कवर लेटर आसानी से तैयार करें।
                </p>
              </div>
              <span class="text-xs font-bold text-indigo-600 flex items-center gap-1">
                पत्र बनाएं →
              </span>
            </div>

            <!-- 3. Indian Language AI -->
            <div data-quick-action="assistant" class="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition cursor-pointer flex flex-col justify-between group space-y-4">
              <div class="space-y-2.5">
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  🌐
                </div>
                <h3 class="font-bold text-slate-900 text-lg group-hover:text-purple-700 transition">
                  13 भारतीय भाषाएं
                </h3>
                <p class="text-xs text-slate-500 leading-relaxed">
                  कठिन बैंक SMS का मतलब, प्यार से मना करने वाला जवाब, और उर्दू सहित 13 भाषाओं में अनुवाद।
                </p>
              </div>
              <span class="text-xs font-bold text-emerald-600 flex items-center gap-1">
                भाषा सहायक खोलें →
              </span>
            </div>

            <!-- 4. Phone Guides -->
            <div data-quick-action="guides" class="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition cursor-pointer flex flex-col justify-between group space-y-4">
              <div class="space-y-2.5">
                <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  📱
                </div>
                <h3 class="font-bold text-slate-900 text-lg group-hover:text-purple-700 transition">
                  फोन व ऐप गाइड्स
                </h3>
                <p class="text-xs text-slate-500 leading-relaxed">
                  WhatsApp स्टोरेज खाली करना, पासवर्ड रीसेट, और ऑनलाइन फ्रॉड से बचने के 100% सही तरीके।
                </p>
              </div>
              <span class="text-xs font-bold text-blue-600 flex items-center gap-1">
                गाइड्स देखें →
              </span>
            </div>

            <!-- 5. Daily Utility Tools -->
            <div data-quick-action="tools" class="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition cursor-pointer flex flex-col justify-between group space-y-4">
              <div class="space-y-2.5">
                <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  🧮
                </div>
                <h3 class="font-bold text-slate-900 text-lg group-hover:text-purple-700 transition">
                  उपयोगी रोजमर्रा टूल्स
                </h3>
                <p class="text-xs text-slate-500 leading-relaxed">
                  प्रतिशत, सटीक उम्र, UPI QR कोड, घरेलू खर्च ट्रैकर, और जरूरी बिलों का रिमाइंडर।
                </p>
              </div>
              <span class="text-xs font-bold text-amber-600 flex items-center gap-1">
                टूल्स खोलें →
              </span>
            </div>

            <!-- 6. Community Help Board -->
            <div data-quick-action="community" class="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition cursor-pointer flex flex-col justify-between group space-y-4">
              <div class="space-y-2.5">
                <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  🤝
                </div>
                <h3 class="font-bold text-slate-900 text-lg group-hover:text-purple-700 transition">
                  मदद मंच (Community)
                </h3>
                <p class="text-xs text-slate-500 leading-relaxed">
                  अपने फोन या दस्तावेज की समस्या पूछें और दूसरों के अनुभव से सही सलाह प्राप्त करें।
                </p>
              </div>
              <span class="text-xs font-bold text-rose-600 flex items-center gap-1">
                चर्चा में शामिल हों →
              </span>
            </div>
          </div>
        </div>

        <!-- Recent Activity & Quick Safety Tip -->
        <div class="bg-purple-50 rounded-3xl p-6 border border-purple-200 flex flex-col sm:flex-row items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl flex-shrink-0">
            🛡️
          </div>
          <div class="space-y-1 text-center sm:text-left flex-1">
            <h4 class="font-bold text-purple-900 text-sm">आज का सुरक्षा नियम (Daily Safety Tip):</h4>
            <p class="text-xs text-purple-800 leading-relaxed">
              पैसे प्राप्त (Receive) करने के लिए कभी भी UPI पिन डालने की आवश्यकता नहीं होती। पिन डालने से हमेशा आपके खाते से पैसे कटते हैं!
            </p>
          </div>
          <button type="button" data-quick-action="guides" class="px-4 py-2 bg-white text-purple-700 font-bold rounded-xl text-xs hover:bg-purple-100 transition shadow-sm whitespace-nowrap">
            सभी सुरक्षा नियम पढ़ें
          </button>
        </div>
      </div>
    `;
  }

  renderGuides(container) {
    let activeCat = 'all';
    let searchQuery = '';

    function renderGuideList() {
      const filtered = PHONE_GUIDES.filter(g => {
        const matchCat = activeCat === 'all' || g.category === activeCat;
        const matchSearch = !searchQuery || 
          g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          g.title_hindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.summary.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
      });

      const categories = ['all', 'WhatsApp', 'Online Safety', 'App Errors', 'Social Media', 'Storage', 'Shortcuts'];

      container.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6">
          <div class="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              📱 Phone & App Guides Library
            </span>
            <h2 class="text-2xl sm:text-3xl font-bold">फोन की हर समस्या का आसान और सही तरीका</h2>
            <p class="text-purple-100 text-sm max-w-2xl">
              कदम-दर-कदम तस्वीरें व निर्देश। किसी मैकेनिक के पास जाने से पहले यहाँ खुद सीखें।
            </p>
          </div>

          <!-- Search and filter -->
          <div class="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm space-y-3">
            <div class="relative">
              <input type="text" id="guide-search-input" placeholder="गाइड खोजें (उदा. WhatsApp, Storage, Fake APK)..." value="${searchQuery}" class="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-purple-500" />
              <span class="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
            </div>

            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              ${categories.map(c => `
                <button type="button" data-guide-cat="${c}" class="guide-filter-btn px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${activeCat === c ? 'bg-purple-600 text-white border-purple-600 font-bold' : 'border-slate-200 text-slate-600 hover:border-purple-300'}">
                  ${c === 'all' ? 'सभी गाइड्स' : c}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Guide Cards List -->
          <div class="space-y-4">
            ${filtered.map(guide => `
              <div class="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-4 transition hover:border-purple-200">
                <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
                      ${guide.category}
                    </span>
                    <span class="text-xs text-slate-400">⏱️ ${guide.readTime} • ${guide.lastUpdated}</span>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${guide.difficulty === 'Crucial' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}">
                    ${guide.difficulty}
                  </span>
                </div>

                <div class="space-y-1">
                  <h3 class="font-bold text-slate-900 text-base sm:text-lg">${guide.title_hindi}</h3>
                  <div class="text-xs text-slate-500 font-medium">${guide.title}</div>
                </div>

                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${guide.summary}</p>

                <!-- Steps -->
                <div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div class="text-xs font-bold text-slate-900 uppercase">कदम-दर-कदम निर्देश (Steps):</div>
                  <ol class="space-y-1.5 list-decimal list-inside text-xs sm:text-sm text-slate-800">
                    ${guide.steps.map(s => `<li class="leading-relaxed">${s}</li>`).join('')}
                  </ol>
                </div>

                ${guide.proTip ? `
                  <div class="bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs text-purple-900">
                    💡 <strong>खास टिप (Pro-tip):</strong> ${guide.proTip}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;

      container.querySelector('#guide-search-input')?.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderGuideList();
      });

      container.querySelectorAll('.guide-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCat = btn.getAttribute('data-guide-cat');
          renderGuideList();
        });
      });
    }

    renderGuideList();
  }

  setupGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    const resultsDropdown = document.getElementById('search-results-dropdown');
    if (!searchInput || !resultsDropdown) return;

    // Keyboard shortcut '/'
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    });

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        resultsDropdown.classList.add('hidden');
        resultsDropdown.innerHTML = '';
        return;
      }

      // Search across guides, tools, and letters
      const matches = [];

      // Guides
      PHONE_GUIDES.forEach(g => {
        if (g.title.toLowerCase().includes(q) || g.title_hindi.toLowerCase().includes(q)) {
          matches.push({ type: 'गाइड', title: g.title_hindi, target: 'guides' });
        }
      });

      // Quick tools
      if ('प्रतिशत exam marks percentage'.includes(q)) {
        matches.push({ type: 'टूल', title: 'परीक्षा प्रतिशत कैलकुलेटर', target: 'tools' });
      }
      if ('उम्र age birthday'.includes(q)) {
        matches.push({ type: 'टूल', title: 'सटीक उम्र कैलकुलेटर', target: 'tools' });
      }
      if ('qr code upi payment'.includes(q)) {
        matches.push({ type: 'टूल', title: 'UPI और वेबसाइट QR कोड जनरेटर', target: 'tools' });
      }
      if ('खर्च expense money हिसाब'.includes(q)) {
        matches.push({ type: 'टूल', title: 'घरेलू खर्च ट्रैकर', target: 'tools' });
      }
      if ('letter आवेदन पत्र छुट्टी leave school'.includes(q)) {
        matches.push({ type: 'आवेदन', title: 'ऑफिस व स्कूल छुट्टी पत्र', target: 'letters' });
      }

      if (matches.length === 0) {
        resultsDropdown.innerHTML = `<div class="p-3 text-xs text-slate-400 italic">कोई परिणाम नहीं मिला</div>`;
      } else {
        resultsDropdown.innerHTML = matches.slice(0, 5).map(m => `
          <button type="button" data-jump="${m.target}" class="w-full text-left px-3.5 py-2 hover:bg-purple-50 text-xs flex items-center justify-between border-b border-slate-100 last:border-0">
            <span class="font-medium text-slate-800">${m.title}</span>
            <span class="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">${m.type}</span>
          </button>
        `).join('');
      }

      resultsDropdown.classList.remove('hidden');

      resultsDropdown.querySelectorAll('[data-jump]').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-jump');
          window.location.hash = target;
          resultsDropdown.classList.add('hidden');
          searchInput.value = '';
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
        resultsDropdown.classList.add('hidden');
      }
    });
  }

  setupPwaInstall() {
    let deferredPrompt;
    const installBtn = document.getElementById('pwa-install-btn');
    if (!installBtn) return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.classList.remove('hidden');
    });

    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast('कामका दोस्त ऐप इंस्टॉल हो गया!', 'success');
        }
        deferredPrompt = null;
        installBtn.classList.add('hidden');
      }
    });
  }

  setupDesktopSidebar() {
    // Language dropdown in header
    const langSelect = document.getElementById('header-lang-select');
    if (langSelect) {
      langSelect.value = getCurrentLanguage();
      langSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
        showToast('भाषा सफलतापूर्वक बदली गई!', 'success');
        this.navigate(this.currentView);
      });
    }
  }

  getTimeGreeting() {
    const hours = new Date().getHours();
    if (hours < 12) return 'सुप्रभात (Good Morning)';
    if (hours < 17) return 'शुभ दोपहर (Good Afternoon)';
    return 'शुभ संध्या (Good Evening)';
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.KaamKaDost = new KaamKaDostApp();
});
