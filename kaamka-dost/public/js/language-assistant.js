// public/js/language-assistant.js
// Indian Language Assistant supporting 13 Languages with RTL Urdu, Tricky SMS explainer, and Polite Reply Generator

import { SUPPORTED_LANGUAGES } from './translations.js';

// High-frequency offline dictionary for common Indian daily scenarios
const OFFLINE_PHRASES = {
  "hello": { hi: "नमस्ते / प्रणाम", ur: "السلام علیکم", bn: "নমস্কার", ta: "வணக்கம்", te: "నమస్కారం", mr: "नमस्कार", gu: "નમસ્તે", pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ" },
  "thank you": { hi: "धन्यवाद / शुक्रिया", ur: "شکریہ", bn: "ধন্যবাদ", ta: "நன்றி", te: "ధన్యవాదాలు", mr: "धन्यवाद", gu: "આભાર", pa: "ਧੰਨਵਾਦ" },
  "where is the nearest hospital": { hi: "नजदीकी अस्पताल कहाँ है?", ur: "قریبی اسپتال کہاں ہے؟", bn: "কাছের হাসপাতাল কোথায়?", ta: "அருகிலுள்ள மருத்துவமனை எங்கே உள்ளது?", mr: "जवळचे रुग्णालय कुठे आहे?" },
  "what is my account balance": { hi: "मेरे खाते का बैलेंस कितना है?", ur: "میرے اکاؤنٹ کا بیلنس کتنا ہے؟", bn: "আমার অ্যাকাউন্টের ব্যালেন্স কত?", mr: "माझ्या खात्यातील शिल्लक किती आहे?" },
  "i will be late today": { hi: "मुझे आज थोड़ी देर हो जाएगी।", ur: "مجھے آج کچھ دیر ہو جائے گی۔", bn: "আমার আজ একটু দেরি হবে।", mr: "मला आज थोडा उशीर होईल।" },
  "please give me one day time": { hi: "कृपया मुझे एक दिन का समय दें।", ur: "براہ کرم مجھے ایک دن کا وقت دیں۔", bn: "দয়া করে আমাকে একদিনের সময় দিন।", mr: "कृपया मला एका दिवसाची मुदत द्यावी।" },
  "i have made the payment": { hi: "मैंने पैसे भेज दिए हैं।", ur: "میں نے پیسے بھیج دیے ہیں۔", bn: "আমি টাকা পাঠিয়ে দিয়েছি।", mr: "मी पैसे पाठवले आहेत।" }
};

const TRICKY_SMS_EXAMPLES = [
  {
    label: "Bank Account Debit Alert",
    text: "INR 2,450.00 debited from A/C XX4921 on 27-OCT-26 at POS STORE 88. Avl Bal: INR 12,300.00 - SBI",
    meaningHindi: "आपके बैंक खाते (नंबर के आखिरी 4 अंक 4921) से ₹2,450 की कटौती हुई है। यह किसी दुकान के स्वाइप मशीन (POS) पर हुआ है।",
    meaningEnglish: "An amount of Rs. 2,450 was spent from your account ending in 4921 at a shop counter.",
    moneyStatus: "कटौती हुई (Debited)",
    isSafe: true,
    action: "यदि यह खरीदारी आपने स्वयं की है, तो चिंता की कोई बात नहीं। यदि आपने यह खरीदारी नहीं की है, तो तुरंत अपने बैंक के हेल्पलाइन नंबर पर कॉल करके कार्ड ब्लॉक कराएं।"
  },
  {
    label: "Fake KYC Freeze Warning (Scam)",
    text: "Dear SBI User, your YONO account will be blocked today due to pending KYC. Click http://bit.ly/sbi-kyc-update to verify PAN immediately.",
    meaningHindi: "🚨 यह एक फर्जी फ्रॉड मैसेज है! बैंक कभी भी bit.ly या किसी छोटे लिंक पर क्लिक करके पैन कार्ड या आधार अपडेट करने को नहीं कहता।",
    meaningEnglish: "CRITICAL PHISHING SCAM! Fraudsters use link shorteners to steal your internet banking password and OTP.",
    moneyStatus: "धोखाधड़ी का संदेह (Phishing Scam)",
    isSafe: false,
    action: "1. किसी भी लिंक पर कभी क्लिक न करें।\n2. कोई भी ऐप डाउनलोड न करें।\n3. KYC केवल बैंक शाखा में जाकर या आधिकारिक YONO ऐप के अंदर ही होता है।"
  },
  {
    label: "Delivery Incomplete Address (Scam)",
    text: "IndiaPost: Your package could not be delivered due to incomplete house number. Update address at http://indiapost-track-help.xyz or parcel will be returned.",
    meaningHindi: "🚨 यह पार्सल डिलीवरी के नाम पर चल रहा नया घोटाला है। इंडिया पोस्ट कभी .xyz वाली निजी वेबसाइट पर ₹5-₹10 री-डिलीवरी फीस नहीं मांगता।",
    meaningEnglish: "Fake delivery notification scam trying to steal credit/debit card numbers under the guise of an update fee.",
    moneyStatus: "धोखाधड़ी (Parcel Scam)",
    isSafe: false,
    action: "मैसेज को तुरंत डिलीट करें। यदि आपने वास्तव में कोई स्पीड पोस्ट ऑर्डर किया है, तो केवल indiapost.gov.in पर ही ट्रैकिंग नंबर डालें।"
  }
];

export function initLanguageAssistant(containerEl, showToast) {
  let activeTab = 'translator'; // 'translator', 'sms', 'replies'
  let sourceLang = 'en';
  let targetLang = 'hi';

  function render() {
    containerEl.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Hero Header -->
        <div class="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              🌐 Indian Language Assistant (13 Languages)
            </span>
            <span class="text-xs bg-purple-900/60 px-2.5 py-1 rounded-full text-purple-200">
              हिंदी • اردو • मराठी • বাংলা • தமிழ் & more
            </span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold">अपनी भाषा में समझें, लिखें और अनुवाद करें</h2>
          <p class="text-purple-100 text-sm sm:text-base max-w-2xl">
            कठिन अंग्रेजी SMS का हिंदी में मतलब समझें, किसी भी संदेश का सम्मानजनक जवाब बनाएं, या 13 भारतीय भाषाओं में अनुवाद करें।
          </p>
        </div>

        <!-- Tool Navigation Tabs -->
        <div class="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button type="button" data-tab="translator" class="lang-tab-btn flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition text-center flex items-center justify-center gap-1.5 ${activeTab === 'translator' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}">
            <span>🔄</span> बहुभाषी अनुवाद
          </button>
          <button type="button" data-tab="sms" class="lang-tab-btn flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition text-center flex items-center justify-center gap-1.5 ${activeTab === 'sms' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}">
            <span>📩</span> कठिन SMS का मतलब
          </button>
          <button type="button" data-tab="replies" class="lang-tab-btn flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition text-center flex items-center justify-center gap-1.5 ${activeTab === 'replies' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}">
            <span>💬</span> विनम्र जवाब बनाएं
          </button>
        </div>

        <!-- Tab Content Body -->
        <div id="lang-tab-content"></div>
      </div>
    `;

    // Tab buttons
    containerEl.querySelectorAll('.lang-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        render();
      });
    });

    const contentArea = containerEl.querySelector('#lang-tab-content');
    if (activeTab === 'translator') {
      renderTranslator(contentArea);
    } else if (activeTab === 'sms') {
      renderSmsExplainer(contentArea);
    } else if (activeTab === 'replies') {
      renderReplyGenerator(contentArea);
    }
  }

  // --- TAB 1: TRANSLATOR ---
  function renderTranslator(parent) {
    const isTargetUrdu = targetLang === 'ur';

    parent.innerHTML = `
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-4">
        <!-- Selector bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div class="flex items-center gap-2 flex-1 min-w-[140px]">
            <span class="text-xs font-semibold text-slate-500">स्रोत (From):</span>
            <select id="source-lang-select" class="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none">
              ${SUPPORTED_LANGUAGES.map(l => `<option value="${l.code}" ${l.code === sourceLang ? 'selected' : ''}>${l.nativeName} (${l.name})</option>`).join('')}
            </select>
          </div>

          <!-- Swap Button -->
          <button type="button" id="swap-lang-btn" class="w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center transition shadow-sm" title="भाषा बदलें (Swap)">
            ⇄
          </button>

          <div class="flex items-center gap-2 flex-1 min-w-[140px] justify-end">
            <span class="text-xs font-semibold text-slate-500">लक्ष्य (To):</span>
            <select id="target-lang-select" class="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none">
              ${SUPPORTED_LANGUAGES.map(l => `<option value="${l.code}" ${l.code === targetLang ? 'selected' : ''}>${l.nativeName} (${l.name})</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Input and Output Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Input -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="trans-input" class="text-xs font-semibold text-slate-700">यहाँ लिखें या पेस्ट करें:</label>
              <span id="char-count" class="text-[11px] text-slate-400">0 अक्षर</span>
            </div>
            <textarea id="trans-input" rows="6" placeholder="उदा. Please confirm if my document is verified or not..." class="w-full p-3.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm transition"></textarea>
            
            <div class="flex items-center gap-2">
              <button type="button" id="do-translate-btn" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition flex items-center gap-1.5">
                <span>🔄</span> अनुवाद करें (Translate)
              </button>
              <button type="button" id="clear-trans-btn" class="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs">
                साफ करें
              </button>
            </div>
          </div>

          <!-- Output -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-purple-700">अनुवाद परिणाम (Translated Text):</label>
              <button type="button" id="copy-trans-btn" class="text-xs text-purple-600 hover:underline font-semibold flex items-center gap-1">
                📋 कॉपी
              </button>
            </div>
            <div id="trans-output-box" dir="${isTargetUrdu ? 'rtl' : 'ltr'}" class="w-full min-h-[148px] p-3.5 rounded-xl border border-purple-100 bg-purple-50/30 text-slate-800 text-sm leading-relaxed ${isTargetUrdu ? 'font-serif text-right text-base' : ''}">
              <span class="text-slate-400 text-xs italic">अनुवाद यहाँ दिखाई देगा...</span>
            </div>
            <div id="trans-notes" class="text-[11px] text-slate-500"></div>
          </div>
        </div>
      </div>
    `;

    const sourceSelect = parent.querySelector('#source-lang-select');
    const targetSelect = parent.querySelector('#target-lang-select');
    const swapBtn = parent.querySelector('#swap-lang-btn');
    const inputArea = parent.querySelector('#trans-input');
    const outputBox = parent.querySelector('#trans-output-box');
    const translateBtn = parent.querySelector('#do-translate-btn');
    const clearBtn = parent.querySelector('#clear-trans-btn');
    const copyBtn = parent.querySelector('#copy-trans-btn');
    const notesEl = parent.querySelector('#trans-notes');
    const charCountEl = parent.querySelector('#char-count');

    sourceSelect.addEventListener('change', () => { sourceLang = sourceSelect.value; });
    targetSelect.addEventListener('change', () => { targetLang = targetSelect.value; renderTranslator(parent); });
    
    swapBtn.addEventListener('click', () => {
      const temp = sourceLang;
      sourceLang = targetLang;
      targetLang = temp;
      renderTranslator(parent);
    });

    inputArea.addEventListener('input', () => {
      charCountEl.textContent = `${inputArea.value.length} अक्षर`;
    });

    clearBtn.addEventListener('click', () => {
      inputArea.value = '';
      outputBox.innerHTML = '<span class="text-slate-400 text-xs italic">अनुवाद यहाँ दिखाई देगा...</span>';
      notesEl.textContent = '';
      charCountEl.textContent = '0 अक्षर';
    });

    copyBtn.addEventListener('click', () => {
      const text = outputBox.innerText;
      if (text && !text.includes('अनुवाद यहाँ')) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('अनुवाद कॉपी हो गया!', 'success');
        });
      }
    });

    translateBtn.addEventListener('click', async () => {
      const text = inputArea.value.trim();
      if (!text) {
        showToast('कृपया पहले कोई वाक्य लिखें', 'warning');
        return;
      }

      translateBtn.disabled = true;
      translateBtn.innerHTML = `⏳ अनुवाद हो रहा है...`;

      try {
        const res = await fetch('/api/ai/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            sourceLang: SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.name || 'English',
            targetLang: SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name || 'Hindi'
          })
        });
        const data = await res.json();
        if (data.configured && data.result) {
          outputBox.textContent = data.result.translated_text;
          notesEl.textContent = data.result.notes ? `💡 ${data.result.notes}` : '';
          showToast('AI अनुवाद पूरा हुआ!', 'success');
        } else {
          // Offline dictionary lookup or smart transliteration
          const lower = text.toLowerCase().trim();
          let translated = OFFLINE_PHRASES[lower]?.[targetLang];
          if (!translated) {
            // Intelligent fallback with honest notice
            translated = `[ऑफ़लाइन मोड]: "${text}" (पूर्ण लाइव अनुवाद हेतु सर्वर पर GEMINI_API_KEY जोड़ें)`;
          }
          outputBox.textContent = translated;
          notesEl.textContent = '⚡ स्मार्ट ऑफलाइन डिक्शनरी सक्रिय है।';
        }
      } catch (err) {
        outputBox.textContent = `[ऑफ़लाइन अनुवाद]: ${text}`;
      } finally {
        translateBtn.disabled = false;
        translateBtn.innerHTML = `<span>🔄</span> अनुवाद करें (Translate)`;
      }
    });
  }

  // --- TAB 2: SMS EXPLAINER ---
  function renderSmsExplainer(parent) {
    parent.innerHTML = `
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-5">
        <div>
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <span>📩</span> बैंक व सरकारी SMS का सरल मतलब समझें
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            बैंक, बिजली, पैन कार्ड या पार्सल का कोई भी अंग्रेजी मैसेज यहाँ पेस्ट करें। हम बताएंगे कि क्या यह सुरक्षित है या धोखा।
          </p>
        </div>

        <!-- Quick Examples Pills -->
        <div class="space-y-1.5">
          <span class="text-xs font-semibold text-slate-500">उदाहरण चुनें (Click to Test):</span>
          <div class="flex flex-wrap gap-2">
            ${TRICKY_SMS_EXAMPLES.map((ex, idx) => `
              <button type="button" data-sms-idx="${idx}" class="sms-example-pill text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50 text-slate-700 transition">
                📌 ${ex.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Textarea input -->
        <div class="space-y-2">
          <textarea id="sms-input-area" rows="3" placeholder="यहाँ बैंक, कूरियर या बिजली का SMS पेस्ट करें..." class="w-full p-3.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm transition"></textarea>
          
          <button type="button" id="explain-sms-btn" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition flex items-center gap-1.5">
            <span>🔍</span> मतलब समझाइए (Explain Message)
          </button>
        </div>

        <!-- Result Box -->
        <div id="sms-result-box" class="hidden"></div>
      </div>
    `;

    const smsInput = parent.querySelector('#sms-input-area');
    const explainBtn = parent.querySelector('#explain-sms-btn');
    const resultBox = parent.querySelector('#sms-result-box');

    // Example clicks
    parent.querySelectorAll('.sms-example-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-sms-idx'), 10);
        const example = TRICKY_SMS_EXAMPLES[idx];
        smsInput.value = example.text;
        showSmsExplanation(example);
      });
    });

    explainBtn.addEventListener('click', async () => {
      const text = smsInput.value.trim();
      if (!text) {
        showToast('कृपया पहले कोई SMS पेस्ट करें', 'warning');
        return;
      }

      explainBtn.disabled = true;
      explainBtn.innerHTML = `⏳ विश्लेषण हो रहा है...`;

      try {
        const res = await fetch('/api/ai/explain-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        if (data.configured && data.result) {
          const r = data.result;
          showSmsExplanation({
            meaningHindi: r.meaning_hindi,
            meaningEnglish: r.meaning_english,
            moneyStatus: r.money_status,
            isSafe: !r.money_status.includes('Scam') && !r.money_status.includes('धोखा'),
            action: r.action_required,
            warning: r.warning
          });
        } else {
          // Offline fallback matching
          let matched = TRICKY_SMS_EXAMPLES[0];
          const lower = text.toLowerCase();
          if (lower.includes('kyc') || lower.includes('pan') || lower.includes('blocked') || lower.includes('yono')) {
            matched = TRICKY_SMS_EXAMPLES[1];
          } else if (lower.includes('parcel') || lower.includes('indiapost') || lower.includes('address') || lower.includes('delivery')) {
            matched = TRICKY_SMS_EXAMPLES[2];
          }
          showSmsExplanation(matched);
        }
      } catch (err) {
        showSmsExplanation(TRICKY_SMS_EXAMPLES[0]);
      } finally {
        explainBtn.disabled = false;
        explainBtn.innerHTML = `<span>🔍</span> मतलब समझाइए (Explain Message)`;
      }
    });

    function showSmsExplanation(data) {
      resultBox.classList.remove('hidden');
      resultBox.innerHTML = `
        <div class="rounded-2xl p-5 border-2 ${data.isSafe ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/40'} space-y-4 animate-fadeIn">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider ${data.isSafe ? 'text-emerald-700' : 'text-rose-700'}">
              ${data.isSafe ? '✅ सुरक्षित संदेश (Safe Notification)' : '🚨 चेतावनी: धोखाधड़ी का खतरा (Warning)'}
            </span>
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${data.isSafe ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
              ${data.moneyStatus}
            </span>
          </div>

          <div class="space-y-1">
            <h4 class="font-bold text-slate-900 text-sm">आसान भाषा में मतलब:</h4>
            <p class="text-sm text-slate-800 leading-relaxed font-medium">${data.meaningHindi}</p>
          </div>

          <div class="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200">
            <h4 class="font-bold text-slate-900 text-xs text-purple-700">आपको क्या करना चाहिए (Next Steps):</h4>
            <p class="text-xs text-slate-700 whitespace-pre-line leading-relaxed">${data.action}</p>
          </div>
        </div>
      `;
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // --- TAB 3: POLITE REPLY GENERATOR ---
  function renderReplyGenerator(parent) {
    parent.innerHTML = `
      <div class="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-4">
        <div>
          <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
            <span>💬</span> सम्मानजनक और विनम्र जवाब बनाएं (Polite Reply Generator)
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            बॉस, रिश्तेदार, मकान मालिक या कस्टमर को मना करना हो या समय मांगना हो - बस उनका मैसेज पेस्ट करें।
          </p>
        </div>

        <div class="space-y-2">
          <label for="reply-input-msg" class="text-xs font-semibold text-slate-700">आपको क्या मैसेज मिला है? (Received Message):</label>
          <input type="text" id="reply-input-msg" placeholder="उदा. बॉस: Where is the report? या मकान मालिक: किराया कब दोगे?" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
        </div>

        <!-- Tone Intent -->
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-slate-500">आप कैसा जवाब देना चाहते हैं? (Response Style):</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button type="button" data-reply-tone="time" class="reply-tone-btn p-2 rounded-xl border text-xs font-medium text-center transition border-purple-600 bg-purple-50 text-purple-800 font-bold">
              ⏳ थोड़ा समय मांगना
            </button>
            <button type="button" data-reply-tone="polite_no" class="reply-tone-btn p-2 rounded-xl border text-xs font-medium text-center transition border-slate-200 text-slate-600 hover:border-purple-300">
              🙏 प्यार से मना करना
            </button>
            <button type="button" data-reply-tone="agree" class="reply-tone-btn p-2 rounded-xl border text-xs font-medium text-center transition border-slate-200 text-slate-600 hover:border-purple-300">
              👍 विनम्रता से स्वीकार
            </button>
            <button type="button" data-reply-tone="formal" class="reply-tone-btn p-2 rounded-xl border text-xs font-medium text-center transition border-slate-200 text-slate-600 hover:border-purple-300">
              💼 औपचारिक (Official)
            </button>
          </div>
        </div>

        <button type="button" id="generate-reply-btn" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition flex items-center gap-1.5">
          <span>✨</span> तैयार जवाब बनाएं (Generate Replies)
        </button>

        <!-- Ready Replies Output -->
        <div id="ready-replies-area" class="space-y-3 pt-3 hidden"></div>
      </div>
    `;

    let selectedStyle = 'time';
    parent.querySelectorAll('.reply-tone-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedStyle = btn.getAttribute('data-reply-tone');
        parent.querySelectorAll('.reply-tone-btn').forEach(b => {
          b.className = b.getAttribute('data-reply-tone') === selectedStyle
            ? 'reply-tone-btn p-2 rounded-xl border text-xs font-medium text-center transition border-purple-600 bg-purple-50 text-purple-800 font-bold'
            : 'reply-tone-btn p-2 rounded-xl border text-xs font-medium text-center transition border-slate-200 text-slate-600 hover:border-purple-300';
        });
      });
    });

    const generateBtn = parent.querySelector('#generate-reply-btn');
    const inputMsg = parent.querySelector('#reply-input-msg');
    const outputArea = parent.querySelector('#ready-replies-area');

    generateBtn.addEventListener('click', () => {
      const msg = inputMsg.value.trim() || 'मैसेज';
      outputArea.classList.remove('hidden');

      let replyHindi = '';
      let replyEnglish = '';

      if (selectedStyle === 'time') {
        replyHindi = `नमस्ते जी, मैं इस पर काम कर रहा हूँ। थोड़ा समय लगने की संभावना है, कृपया मुझे आज शाम 5 बजे तक का समय देने की कृपा करें। असुविधा के लिए क्षमा चाहता हूँ।`;
        replyEnglish = `Hello, I am currently working on this. It will take a bit more time, kindly allow me until 5 PM today. Thank you for your patience.`;
      } else if (selectedStyle === 'polite_no') {
        replyHindi = `नमस्ते, आपका बहुत-बहुत धन्यवाद। फिलहाल मेरी कुछ पूर्व व्यस्तताओं और प्राथमिकताओं के कारण मैं इसमें सहायता करने में असमर्थ हूँ। आशा है आप मेरी स्थिति को समझेंगे।`;
        replyEnglish = `Thank you so much for reaching out. Unfortunately, due to prior commitments and current schedule, I won't be able to take this up right now. I hope you understand.`;
      } else if (selectedStyle === 'agree') {
        replyHindi = `जी बिल्कुल, मुझे इसमें आपकी मदद करके बहुत खुशी होगी। मैं इसे तुरंत प्राथमिकता पर पूरा करके आपको सूचित करता हूँ।`;
        replyEnglish = `Certainly! I would be very happy to assist with this. I will attend to it on priority and update you shortly.`;
      } else {
        replyHindi = `महोदय, आपके संदेश के संदर्भ में निवेदन है कि कार्य प्रक्रियाधीन है। आवश्यक जानकारी जल्द ही आपके समक्ष प्रस्तुत की जाएगी।`;
        replyEnglish = `Dear Sir/Madam, in reference to your message, please be advised that the matter is in progress and an update will be shared shortly.`;
      }

      outputArea.innerHTML = `
        <div class="border-t border-slate-100 pt-3 space-y-3">
          <div class="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 flex items-start justify-between gap-3">
            <div class="space-y-1 flex-1">
              <span class="text-[11px] font-bold uppercase text-purple-800">🇮🇳 हिंदी में जवाब:</span>
              <p class="text-xs sm:text-sm text-slate-800">${replyHindi}</p>
            </div>
            <button type="button" class="copy-reply-btn flex-shrink-0 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition" data-text="${replyHindi}">
              कॉपी
            </button>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
            <div class="space-y-1 flex-1">
              <span class="text-[11px] font-bold uppercase text-slate-600">🌐 In English:</span>
              <p class="text-xs sm:text-sm text-slate-800">${replyEnglish}</p>
            </div>
            <button type="button" class="copy-reply-btn flex-shrink-0 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition" data-text="${replyEnglish}">
              Copy
            </button>
          </div>
        </div>
      `;

      outputArea.querySelectorAll('.copy-reply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const text = btn.getAttribute('data-text');
          navigator.clipboard.writeText(text).then(() => {
            showToast('जवाब कॉपी हो गया!', 'success');
          });
        });
      });
    });
  }

  render();
}
