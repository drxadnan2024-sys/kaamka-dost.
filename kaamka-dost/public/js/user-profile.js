// public/js/user-profile.js
// Guest Mode, User Profile, Saved Drafts, Data Erasure, and Privacy Controls

import { SUPPORTED_LANGUAGES, getCurrentLanguage, setLanguage } from './translations.js';

export function initUserProfile(containerEl, showToast) {
  let isGuest = localStorage.getItem('kaamka_auth_user') === null;
  let userEmail = localStorage.getItem('kaamka_auth_user') || 'Guest User (अतिथि)';

  function render() {
    const savedDrafts = JSON.parse(localStorage.getItem('kaamka_saved_drafts') || '[]');
    const currentLang = getCurrentLanguage();

    containerEl.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Hero Profile Banner -->
        <div class="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              👤 User Profile & Settings
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${isGuest ? 'bg-amber-400 text-amber-950' : 'bg-emerald-400 text-emerald-950'}">
              ${isGuest ? 'Guest Mode (No Login Required)' : 'Signed In'}
            </span>
          </div>

          <div class="flex items-center gap-4 pt-2">
            <div class="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-inner">
              ${isGuest ? '👤' : '⭐'}
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-bold">${isGuest ? 'अतिथि उपयोगकर्ता (Guest)' : userEmail}</h2>
              <p class="text-xs text-purple-200">
                ${isGuest ? 'आप बिना किसी लॉगिन के सभी टूल्स और फीचर्स का पूर्ण उपयोग कर रहे हैं।' : 'आपका अकाउंट सुरक्षित रूप से सिंक है।'}
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Preferences -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-4">
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <span>⚙️</span> ऐप प्राथमिकताएं (Preferences)
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Language selector -->
            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-700">पसंदीदा भाषा (Preferred Language):</label>
              <select id="profile-lang-select" class="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm outline-none bg-white">
                ${SUPPORTED_LANGUAGES.map(l => `<option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.nativeName} (${l.name})</option>`).join('')}
              </select>
            </div>

            <!-- Optional login trigger -->
            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-700">अकाउंट स्थिति (Account Sync):</label>
              <div>
                ${isGuest ? `
                  <button type="button" id="open-login-btn" class="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold transition">
                    🔑 क्लाउड सिंक हेतु लॉगिन करें (वैकल्पिक)
                  </button>
                ` : `
                  <button type="button" id="do-logout-btn" class="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition">
                    लॉगआउट करें
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>

        <!-- Saved Drafts Section -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>💾</span> सुरक्षित किए गए आवेदन पत्र (Saved Drafts - ${savedDrafts.length})
            </h3>
          </div>

          ${savedDrafts.length === 0 ? `
            <div class="py-6 text-center text-slate-400 text-xs italic">
              कोई सुरक्षित ड्राफ्ट नहीं है। लेटर मेकर में पत्र बनाकर 'सुरक्षित रखें' पर क्लिक करें।
            </div>
          ` : `
            <div class="space-y-2.5">
              ${savedDrafts.map((d, idx) => `
                <div class="p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-sm text-slate-900">${d.title}</span>
                    <span class="text-[11px] text-slate-400">${d.date}</span>
                  </div>
                  <p class="text-xs text-slate-600 line-clamp-2 font-mono bg-slate-50 p-2 rounded-lg">${d.content}</p>
                  <div class="flex items-center justify-end gap-2 pt-1 text-xs">
                    <button type="button" data-copy-draft="${idx}" class="copy-draft-btn text-purple-600 hover:underline font-semibold">📋 कॉपी</button>
                    <button type="button" data-del-draft="${idx}" class="del-draft-btn text-rose-500 hover:underline">हटाएं</button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Privacy & Security Controls -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-sm space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>🛡️</span> गोपनीयता और डेटा सुरक्षा (Privacy & Data Control)
            </h3>
            <p class="text-xs text-slate-500 mt-1">
              आपका डेटा आपके डिवाइस में सुरक्षित रहता है। हम कभी भी पासवर्ड, OTP या UPI PIN नहीं मांगते।
            </p>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <button type="button" id="show-privacy-btn" class="text-xs font-semibold text-purple-700 hover:underline">
                📜 प्राइवेसी पॉलिसी पढ़ें
              </button>
              <span class="text-slate-300">•</span>
              <button type="button" id="show-terms-btn" class="text-xs font-semibold text-purple-700 hover:underline">
                📄 नियम व शर्तें
              </button>
            </div>

            <!-- Danger Zone: Clear Data -->
            <button type="button" id="clear-all-data-btn" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5">
              <span>🗑️</span> सभी लोकल डेटा हटाएं (Erase Local Data)
            </button>
          </div>
        </div>
      </div>

      <!-- Modals Container -->
      <div id="profile-modals"></div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Language change
    containerEl.querySelector('#profile-lang-select')?.addEventListener('change', (e) => {
      setLanguage(e.target.value);
      showToast('भाषा सफलतापूर्वक बदली गई!', 'success');
      render();
    });

    // Login modal
    containerEl.querySelector('#open-login-btn')?.addEventListener('click', openLoginModal);

    // Logout
    containerEl.querySelector('#do-logout-btn')?.addEventListener('click', () => {
      localStorage.removeItem('kaamka_auth_user');
      isGuest = true;
      userEmail = 'Guest User (अतिथि)';
      showToast('लॉगआउट संपन्न हुआ। गेस्ट मोड सक्रिय है।', 'info');
      render();
    });

    // Copy draft
    containerEl.querySelectorAll('.copy-draft-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-copy-draft'), 10);
        const saved = JSON.parse(localStorage.getItem('kaamka_saved_drafts') || '[]');
        if (saved[idx]) {
          navigator.clipboard.writeText(saved[idx].content).then(() => {
            showToast('ड्राफ्ट कॉपी हो गया!', 'success');
          });
        }
      });
    });

    // Delete draft
    containerEl.querySelectorAll('.del-draft-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-del-draft'), 10);
        const saved = JSON.parse(localStorage.getItem('kaamka_saved_drafts') || '[]');
        saved.splice(idx, 1);
        localStorage.setItem('kaamka_saved_drafts', JSON.stringify(saved));
        showToast('ड्राफ्ट हटा दिया गया!', 'info');
        render();
      });
    });

    // Clear all data
    containerEl.querySelector('#clear-all-data-btn')?.addEventListener('click', () => {
      const confirmFirst = confirm('क्या आप वाकई इस डिवाइस से अपने सभी सुरक्षित ड्राफ्ट, खर्च और रिमाइंडर हटाना चाहते हैं?');
      if (confirmFirst) {
        localStorage.removeItem('kaamka_saved_drafts');
        localStorage.removeItem('kaamka_expenses');
        localStorage.removeItem('kaamka_bill_reminders');
        localStorage.removeItem('kaamka_community_posts');
        showToast('सभी स्थानीय डेटा सफलतापूर्वक हटा दिया गया!', 'success');
        render();
      }
    });

    // Privacy modal
    containerEl.querySelector('#show-privacy-btn')?.addEventListener('click', () => {
      openPolicyModal('गोपनीयता नीति (Privacy Policy)', `
        <div class="space-y-3 text-xs leading-relaxed text-slate-700">
          <p><strong>1. शून्य अनावश्यक डेटा संग्रहण:</strong> 'कामका दोस्त' उपयोगकर्ताओं से कोई भी अनावश्यक व्यक्तिगत डेटा एकत्रित नहीं करता है।</p>
          <p><strong>2. बैंक क्रेडेंशियल सुरक्षा:</strong> हम कभी भी आपसे पासवर्ड, OTP (वन-टाइम पासवर्ड), UPI पिन, बैंक खाता विवरण या एटीएम कार्ड नंबर नहीं मांगते हैं। यदि कोई व्यक्ति हमारे नाम पर ऐसी जानकारी मांगे, तो तुरंत मना करें।</p>
          <p><strong>3. स्क्रीनशॉट और फोटो सुरक्षा:</strong> आपके द्वारा अपलोड किए गए स्क्रीनशॉट केवल आपके फोन की तकनीकी समस्या का विश्लेषण करने हेतु उपयोग किए जाते हैं। इन्हें कभी भी किसी तीसरे पक्ष को नहीं बेचा जाता।</p>
          <p><strong>4. स्थानीय संग्रहण (Local Storage):</strong> आपके खर्च, पत्र प्रारूप और रिमाइंडर आपके अपने ब्राउज़र के LocalStorage में सुरक्षित रहते हैं। आप प्रोफाइल में जाकर कभी भी 'डेटा हटाएं' बटन से इन्हें हमेशा के लिए मिटा सकते हैं।</p>
        </div>
      `);
    });

    // Terms modal
    containerEl.querySelector('#show-terms-btn')?.addEventListener('click', () => {
      openPolicyModal('नियम व शर्तें (Terms of Service)', `
        <div class="space-y-3 text-xs leading-relaxed text-slate-700">
          <p><strong>1. सेवा का उद्देश्य:</strong> कामकाज दोस्त एक डिजिटल सहायक है जो सामान्य तकनीकी ज्ञान, पत्र प्रारूप और भाषा अनुवाद में मदद के लिए बनाया गया है।</p>
          <p><strong>2. कानूनी व वित्तीय सलाह नहीं:</strong> पत्र जनरेटर केवल सामान्य प्रारूप प्रदान करता है। किसी भी कानूनी विवाद अथवा गंभीर बैंक मामले में संबंधित आधिकारिक संस्था अथवा अधिवक्ता से परामर्श लें।</p>
          <p><strong>3. साइबर फ्रॉड रोकथाम:</strong> हमारा साइबर फ्रॉड डिटेक्शन टूल उपयोगकर्ताओं को जागरूक करने के लिए है। किसी भी वित्तीय नुकसान की स्थिति में तुरंत आधिकारिक राष्ट्रीय हेल्पलाइन 1930 पर संपर्क करें।</p>
        </div>
      `);
    });
  }

  function openPolicyModal(title, htmlContent) {
    const holder = containerEl.querySelector('#profile-modals');
    holder.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp max-h-[80vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-base">${title}</h3>
            <button type="button" id="close-policy-modal" class="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
          </div>
          <div>${htmlContent}</div>
          <div class="text-right pt-2 border-t border-slate-100">
            <button type="button" id="done-policy-btn" class="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold">ठीक है (Close)</button>
          </div>
        </div>
      </div>
    `;
    holder.querySelector('#close-policy-modal').onclick = () => holder.innerHTML = '';
    holder.querySelector('#done-policy-btn').onclick = () => holder.innerHTML = '';
  }

  function openLoginModal() {
    const holder = containerEl.querySelector('#profile-modals');
    holder.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-base">लॉगिन / साइन-अप (वैकल्पिक)</h3>
            <button type="button" id="close-login-modal" class="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
          </div>

          <div class="bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs text-purple-900">
            💡 <strong>याद रखें:</strong> आप बिना लॉगिन किए भी सभी टूल्स का उपयोग कर सकते हैं। लॉगिन केवल अलग-अलग फोन में ड्राफ्ट सिंक करने के लिए है।
          </div>

          <form id="login-form" class="space-y-3">
            <div>
              <label class="text-xs font-semibold text-slate-700">ईमेल (Email):</label>
              <input type="email" id="login-email" placeholder="name@example.com" required class="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm outline-none focus:border-purple-500 mt-1" />
            </div>

            <div>
              <label class="text-xs font-semibold text-slate-700">पासवर्ड (Password):</label>
              <input type="password" id="login-password" placeholder="••••••••" required class="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm outline-none focus:border-purple-500 mt-1" />
            </div>

            <button type="submit" class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm">
              लॉगिन / जारी रखें
            </button>
          </form>
        </div>
      </div>
    `;

    holder.querySelector('#close-login-modal').onclick = () => holder.innerHTML = '';
    holder.querySelector('#login-form').onsubmit = (e) => {
      e.preventDefault();
      const email = holder.querySelector('#login-email').value.trim();
      if (email) {
        localStorage.setItem('kaamka_auth_user', email);
        isGuest = false;
        userEmail = email;
        holder.innerHTML = '';
        showToast('लॉगिन सफल हुआ!', 'success');
        render();
      }
    };
  }

  render();
}
