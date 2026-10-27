// public/js/screenshot-helper.js
// AI Screenshot Helper with Honest Demo Mode and Live API integration

const DEMO_SCENARIOS = [
  {
    id: "demo_upi_pending",
    title: "UPI Payment Pending / Stuck (PhonePe / GPay)",
    badge: "Safe to Wait",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Paid ₹850 at supermarket, green/yellow clock shows 'Payment Pending'. Money deducted from bank account.",
    explanationHindi: "आपका पैसा बैंक के सुरक्षित बैंकिंग चैनल में है। यह सर्वर की व्यस्तता के कारण अटका हुआ है, लेकिन सुरक्षित है।",
    explanationEnglish: "Your money has left your bank and is in the NPCI banking transit. It is completely safe and will not be lost.",
    steps: [
      { step: 1, title: "Do NOT pay again immediately", action: "Wait 5-10 minutes. In 80% of cases, the payment either completes or auto-reverses." },
      { step: 2, title: "Note the 12-digit UTR Number", action: "Tap 'View Details' in your UPI app and copy or screenshot the 12-digit UTR / UPI Reference Number." },
      { step: 3, title: "Show UTR to Merchant", action: "Show the UTR number to the shopkeeper so they can check their settlement ledger." },
      { step: 4, title: "RBI 48-Hour Auto Reversal Rule", action: "If payment fails, RBI guidelines mandate that your bank must refund the money to your account within 48 hours." }
    ],
    safetyTip: "Never call any random phone number found on Google for 'PhonePe / GPay Customer Care'. They are cyber scammers."
  },
  {
    id: "demo_play_storage",
    title: "Google Play Store 'Storage Space Running Out' Error",
    badge: "Easy Fix",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description: "Cannot install new app or update WhatsApp. Phone keeps saying 'Not enough storage space'.",
    explanationHindi: "आपके फोन की मुख्य इंटरनल मेमोरी में 500 MB से कम जगह बची है, इसलिए प्ले स्टोर नए ऐप्स को ब्लॉक कर रहा है।",
    explanationEnglish: "Android requires at least 1 GB of free internal space for system swap files. It blocks installations when below threshold.",
    steps: [
      { step: 1, title: "Clean WhatsApp Viral Forwards", action: "Open WhatsApp > Settings > Storage and Data > Manage Storage > Delete videos larger than 5 MB." },
      { step: 2, title: "Clear Play Store Cache", action: "Go to Phone Settings > Apps > Google Play Store > Storage > Tap 'Clear Cache'." },
      { step: 3, title: "Delete Screen Recordings & Junk", action: "Open Gallery/Files app and delete old screen recordings and downloaded movies." },
      { step: 4, title: "Restart Device", action: "Restart your phone and retry the download. It will start immediately." }
    ],
    safetyTip: "Do not install cleaning apps from unknown websites; they install adware."
  },
  {
    id: "demo_wa_download_fail",
    title: "WhatsApp 'Download Failed' / Can't Download Media",
    badge: "Quick Fix",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    description: "Tapping photos or voice messages in WhatsApp gives 'Download failed: The download was unable to complete. Please try again later.'",
    explanationHindi: "व्हाट्सएप आपके फोन के स्टोरेज में फाइल नहीं लिख पा रहा है या फोन की तारीख और समय गलत सेट है।",
    explanationEnglish: "Usually caused by incorrect phone date/time, full internal storage, or missing media storage permissions.",
    steps: [
      { step: 1, title: "Check Phone Date & Time", action: "Go to phone Settings > System > Date & Time > Ensure 'Set time automatically' is turned ON." },
      { step: 2, title: "Check Storage Permission", action: "Settings > Apps > WhatsApp > Permissions > Ensure 'Photos and Videos' or 'Storage' is Allowed." },
      { step: 3, title: "Restart WiFi / Mobile Data", action: "Toggle Airplane mode ON for 10 seconds, then turn it OFF." },
      { step: 4, title: "Restart Phone", action: "Reboot your smartphone and test downloading the photo again." }
    ],
    safetyTip: "If only one specific photo fails to download, ask the sender to re-send it (the file on WhatsApp server may have expired)."
  },
  {
    id: "demo_fake_sms",
    title: "Suspicious SMS: 'Bijli Bill Unpaid / Disconnection Tonight'",
    badge: "SECURITY ALERT",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300 animate-pulse",
    description: "SMS from 10-digit number: 'Dear consumer, your electricity will be disconnected tonight at 9:30 PM. Call officer at 9876543210 immediately.'",
    explanationHindi: "🚨 यह 100% साइबर फ्रॉड है! यह भारत में चल रहा सबसे बड़ा बिजली बिल घोटाला है। बिजली विभाग कभी भी व्यक्तिगत मोबाइल नंबर से ऐसा मैसेज नहीं भेजता।",
    explanationEnglish: "CRITICAL SCAM ALERT! Fraudsters send this panicking message to trick you into calling them or installing a remote-control app.",
    steps: [
      { step: 1, title: "DO NOT call the number", action: "Never call the phone number given in the SMS, and never click any website link." },
      { step: 2, title: "DO NOT install AnyDesk/TeamViewer", action: "The scammer will ask you to install an app to 'pay ₹10 verification fee'. This lets them steal all money from your bank account." },
      { step: 3, title: "Check Official Bijli App", action: "Open your official state electricity board app or website (e.g. UPPCL, BSES, DHBVN) to check your real bill status." },
      { step: 4, title: "Block & Report", action: "Mark the SMS as Spam and block the sender number in your Messages app." }
    ],
    safetyTip: "If you already shared an OTP or downloaded an app, immediately call 1930 (National Cyber Crime Helpline) and freeze your bank cards."
  },
  {
    id: "demo_emergency_calls",
    title: "SIM Card 'Emergency Calls Only' / No Network",
    badge: "Network Issue",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    description: "Top status bar shows 'Emergency Calls Only' or 'No Service' on Jio/Airtel/Vi.",
    explanationHindi: "फोन सिम कार्ड से संपर्क नहीं कर पा रहा है या नेटवर्क एंटीना कनेक्ट नहीं हो रहा है।",
    explanationEnglish: "Usually occurs due to loose SIM tray, temporary network tower outage, or wrong Network Mode in settings.",
    steps: [
      { step: 1, title: "Toggle Airplane Mode", action: "Turn on Airplane Mode for 15 seconds, then turn it off to force the antenna to search for towers." },
      { step: 2, title: "Re-seat SIM Card", action: "Turn off phone, eject the SIM tray with a pin, gently clean the golden chip with a dry cloth, and insert firmly." },
      { step: 3, title: "Check Preferred Network Type", action: "Settings > Mobile Network > SIM 1 > Preferred network type > Select '5G/4G/3G/2G (Auto)'." },
      { step: 4, title: "Check SIM Validity", action: "Ensure your SIM plan has not expired (most Indian telcos disconnect incoming after 7 days of plan expiry)." }
    ],
    safetyTip: "If the SIM stopped working after receiving an SMS about SIM swap, immediately contact your operator store from another phone."
  }
];

export function initScreenshotHelper(containerEl, showToast) {
  let selectedFile = null;
  let base64Image = null;
  let isAiLive = false;

  // Check AI configuration from backend
  fetch('/api/ai/status')
    .then(res => res.json())
    .then(data => {
      isAiLive = Boolean(data.configured);
      updateStatusBadge();
    })
    .catch(() => {
      isAiLive = false;
      updateStatusBadge();
    });

  function updateStatusBadge() {
    const badgeEl = containerEl.querySelector('#ai-config-status-badge');
    if (!badgeEl) return;
    if (isAiLive) {
      badgeEl.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300";
      badgeEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span> Live Gemini AI Active`;
    } else {
      badgeEl.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300";
      badgeEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span> Demo Mode (Offline Safe)`;
    }
  }

  containerEl.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div class="relative z-10 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
              📸 AI Screenshot Helper
            </span>
            <div id="ai-config-status-badge"></div>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold">फोन में क्या खराबी आई है? स्क्रीनशॉट दिखाएं</h2>
          <p class="text-purple-100 text-sm sm:text-base max-w-2xl">
            PhonePe, WhatsApp, Google Play या फोन में कोई एरर आया है? उसका स्क्रीनशॉट अपलोड करें। हम आसान हिंदी में स्टेप-बाय-स्टेप समाधान देंगे।
          </p>
        </div>
      </div>

      <!-- Quick Demo Scenarios (Always accessible) -->
      <div class="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
            <span class="text-purple-600">⚡</span> सबसे आम समस्याएं (तुरंत क्लिक करके देखें):
          </h3>
          <span class="text-xs text-purple-600 font-medium">1-क्लिक टेस्ट</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          ${DEMO_SCENARIOS.map(demo => `
            <button type="button" data-demo-id="${demo.id}" class="demo-select-btn text-left p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition flex items-start gap-3 group">
              <span class="text-lg mt-0.5">📱</span>
              <div class="space-y-0.5 flex-1 min-w-0">
                <div class="font-semibold text-xs text-slate-800 group-hover:text-purple-700 truncate">${demo.title}</div>
                <div class="text-[11px] text-slate-500 line-clamp-1">${demo.description}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Upload Section -->
      <div class="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-5">
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
          <span>📤</span> अपना स्क्रीनशॉट अपलोड करें (Upload Screenshot)
        </h3>

        <!-- Drag & Drop Dropzone -->
        <div id="dropzone" class="border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition bg-purple-50/30 hover:bg-purple-50/60">
          <input type="file" id="screenshot-input" accept="image/png,image/jpeg,image/webp" class="hidden" />
          
          <div id="upload-prompt" class="space-y-3">
            <div class="w-14 h-14 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl shadow-inner">
              📷
            </div>
            <div>
              <p class="font-semibold text-slate-700 text-sm sm:text-base">स्क्रीनशॉट चुनें या यहाँ खींच कर छोड़ें</p>
              <p class="text-xs text-slate-400 mt-1">PNG, JPG या WebP (अधिकतम 5 MB)</p>
            </div>
            <button type="button" id="browse-btn" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition">
              फोटो गैलरी से चुनें
            </button>
          </div>

          <!-- Preview Container (hidden by default) -->
          <div id="preview-container" class="hidden space-y-4">
            <div class="relative inline-block max-w-xs mx-auto">
              <img id="preview-image" src="" alt="Screenshot Preview" class="max-h-64 rounded-xl shadow-md border border-purple-200 object-contain mx-auto" />
              <button type="button" id="remove-image-btn" class="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-rose-700 transition" title="हटाएं">
                ✕
              </button>
            </div>
            <div id="file-meta" class="text-xs text-slate-500 font-mono"></div>
          </div>
        </div>

        <!-- Problem Description Input -->
        <div class="space-y-2">
          <label for="problem-desc" class="block text-xs font-semibold text-slate-700">
            आपकी समस्या क्या है? (संक्षेप में लिखें)
          </label>
          <textarea id="problem-desc" rows="2" placeholder="उदा. पैसे कट गए पर दुकान वाले को नहीं मिले, या प्ले स्टोर में जगह कम बता रहा है..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm transition"></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-3">
          <button type="button" id="analyze-btn" class="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2">
            <span>🔍</span> समस्या का समाधान पाएं
          </button>
          <button type="button" id="clear-btn" class="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl transition">
            रीसेट करें
          </button>
        </div>
      </div>

      <!-- Analysis Result Area -->
      <div id="analysis-result-area" class="hidden"></div>
    </div>
  `;

  // Attach event handlers
  const dropzone = containerEl.querySelector('#dropzone');
  const fileInput = containerEl.querySelector('#screenshot-input');
  const browseBtn = containerEl.querySelector('#browse-btn');
  const uploadPrompt = containerEl.querySelector('#upload-prompt');
  const previewContainer = containerEl.querySelector('#preview-container');
  const previewImage = containerEl.querySelector('#preview-image');
  const removeImageBtn = containerEl.querySelector('#remove-image-btn');
  const fileMeta = containerEl.querySelector('#file-meta');
  const problemDesc = containerEl.querySelector('#problem-desc');
  const analyzeBtn = containerEl.querySelector('#analyze-btn');
  const clearBtn = containerEl.querySelector('#clear-btn');
  const resultArea = containerEl.querySelector('#analysis-result-area');

  // Browse triggers
  browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });
  dropzone.addEventListener('click', () => {
    if (!selectedFile) fileInput.click();
  });

  // Drag and drop
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-purple-500', 'bg-purple-100/40');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-purple-500', 'bg-purple-100/40');
  });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-purple-500', 'bg-purple-100/40');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('कृपया केवल इमेज (PNG, JPG, WebP) फाइल चुनें', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('फाइल बहुत बड़ी है (अधिकतम 5 MB)', 'error');
      return;
    }

    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      base64Image = e.target.result;
      previewImage.src = base64Image;
      fileMeta.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      uploadPrompt.classList.add('hidden');
      previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  removeImageBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetUpload();
  });

  function resetUpload() {
    selectedFile = null;
    base64Image = null;
    fileInput.value = '';
    previewImage.src = '';
    fileMeta.textContent = '';
    uploadPrompt.classList.remove('hidden');
    previewContainer.classList.add('hidden');
  }

  clearBtn.addEventListener('click', () => {
    resetUpload();
    problemDesc.value = '';
    resultArea.classList.add('hidden');
    resultArea.innerHTML = '';
  });

  // Demo Scenarios click
  containerEl.querySelectorAll('.demo-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const demoId = btn.getAttribute('data-demo-id');
      const scenario = DEMO_SCENARIOS.find(s => s.id === demoId);
      if (scenario) {
        problemDesc.value = scenario.description;
        renderResult(scenario, true);
        showToast(`'${scenario.title}' का समाधान लोड हुआ`, 'info');
      }
    });
  });

  // Analyze button click
  analyzeBtn.addEventListener('click', async () => {
    const userPrompt = problemDesc.value.trim();

    if (!selectedFile && !userPrompt) {
      showToast('कृपया पहले कोई स्क्रीनशॉट चुनें या समस्या लिखें, या ऊपर दिए गए 1-क्लिक टेस्ट को चुनें', 'warning');
      return;
    }

    // Loading state
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = `<span class="animate-spin inline-block mr-2">⏳</span> विश्लेषण हो रहा है...`;

    try {
      if (isAiLive && base64Image) {
        const response = await fetch('/api/ai/analyze-screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Image,
            mimeType: selectedFile.type,
            prompt: userPrompt
          })
        });
        const data = await response.json();
        if (data.configured && data.result) {
          const res = data.result;
          renderResult({
            title: res.title || "विश्लेषण परिणाम",
            badge: res.urgency || "Normal",
            badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
            explanationHindi: res.simple_explanation_hindi,
            explanationEnglish: res.simple_explanation_english,
            steps: res.steps || [],
            safetyTip: res.safety_tip
          }, false);
          showToast('AI विश्लेषण पूरा हुआ!', 'success');
        } else {
          // Fallback to matching demo scenario
          fallbackToScenario(userPrompt);
        }
      } else {
        // Safe Demo mode handling
        fallbackToScenario(userPrompt);
      }
    } catch (err) {
      console.error(err);
      fallbackToScenario(userPrompt);
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = `<span>🔍</span> समस्या का समाधान पाएं`;
    }
  });

  function fallbackToScenario(prompt) {
    const lower = prompt.toLowerCase();
    let matched = DEMO_SCENARIOS[0]; // default UPI
    if (lower.includes('storage') || lower.includes('space') || lower.includes('मेमोरी') || lower.includes('जगह')) {
      matched = DEMO_SCENARIOS[1];
    } else if (lower.includes('download') || lower.includes('whatsapp') || lower.includes('फोटो')) {
      matched = DEMO_SCENARIOS[2];
    } else if (lower.includes('bill') || lower.includes('बिजली') || lower.includes('sms') || lower.includes('fraud')) {
      matched = DEMO_SCENARIOS[3];
    } else if (lower.includes('sim') || lower.includes('नेटवर्क') || lower.includes('network') || lower.includes('call')) {
      matched = DEMO_SCENARIOS[4];
    }

    renderResult(matched, true);
    if (!isAiLive) {
      showToast('डेमो मोड: समाधान तैयार है (AI कुंजी कॉन्फ़िगर नहीं है)', 'info');
    }
  }

  function renderResult(data, isDemo = false) {
    resultArea.classList.remove('hidden');
    resultArea.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-xl space-y-6 animate-fadeIn">
        <!-- Result Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xl">✅</span>
              <h3 class="text-xl sm:text-2xl font-bold text-slate-900">${data.title}</h3>
            </div>
            ${isDemo ? `
              <p class="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-block border border-amber-200">
                ℹ️ <strong>डेमो मोड:</strong> यह पूर्व-विश्लेषित समाधान है। सर्वर पर GEMINI_API_KEY जोड़ने पर लाइव AI इमेज स्कैन सक्रिय हो जाएगा।
              </p>
            ` : `
              <p class="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block border border-emerald-200">
                ✨ <strong>लाइव AI विश्लेषण:</strong> Google Gemini द्वारा सीधे विश्लेषित।
              </p>
            `}
          </div>
          <span class="px-3 py-1 text-xs font-bold uppercase rounded-full border ${data.badgeColor || 'bg-purple-100 text-purple-800 border-purple-300'}">
            ${data.badge}
          </span>
        </div>

        <!-- Explanations -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-purple-50/70 rounded-2xl p-4 border border-purple-100 space-y-1">
            <h4 class="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
              <span>🇮🇳</span> आसान भाषा में समझें (हिंदी)
            </h4>
            <p class="text-sm text-slate-800 leading-relaxed font-medium">
              ${data.explanationHindi || data.simple_explanation_hindi || "विवरण उपलब्ध नहीं है।"}
            </p>
          </div>

          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span>🌐</span> In Plain English
            </h4>
            <p class="text-sm text-slate-700 leading-relaxed">
              ${data.explanationEnglish || data.simple_explanation_english || "No English description provided."}
            </p>
          </div>
        </div>

        <!-- Numbered Step-by-Step Fixes -->
        <div class="space-y-3">
          <h4 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">🛠️</span>
            समस्या को ठीक करने के स्टेप्स (Step-by-step Solution):
          </h4>

          <div class="space-y-2.5">
            ${(data.steps || []).map((step, idx) => `
              <div class="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  ${step.step || (idx + 1)}
                </span>
                <div class="space-y-0.5">
                  <div class="font-bold text-sm text-slate-900">${step.title}</div>
                  <div class="text-xs sm:text-sm text-slate-600 leading-relaxed">${step.action}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Safety Precaution Alert Box -->
        ${data.safetyTip ? `
          <div class="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl space-y-1">
            <h5 class="text-xs font-bold uppercase text-rose-800 flex items-center gap-1.5">
              <span>🛡️</span> महत्वपूर्ण सुरक्षा नियम (Safety Tip):
            </h5>
            <p class="text-xs sm:text-sm text-rose-900 font-medium leading-relaxed">
              ${data.safetyTip}
            </p>
          </div>
        ` : ''}

        <!-- Bottom Actions -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button type="button" id="copy-solution-btn" class="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-1.5">
            <span>📋</span> समाधान कॉपी करें (Copy Steps)
          </button>
          
          <span class="text-xs text-slate-400">कामका दोस्त - आपकी डिजिटल सहायता</span>
        </div>
      </div>
    `;

    // Scroll smoothly to result
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Copy solution
    resultArea.querySelector('#copy-solution-btn').addEventListener('click', () => {
      let copyText = `📱 *${data.title}* - समाधान (KaamKa Dost):\n\n`;
      copyText += `${data.explanationHindi || ''}\n\n*कदम (Steps):*\n`;
      (data.steps || []).forEach((s, i) => {
        copyText += `${i + 1}. ${s.title}: ${s.action}\n`;
      });
      if (data.safetyTip) {
        copyText += `\n⚠️ *सुरक्षा चेतावनी:* ${data.safetyTip}\n`;
      }
      navigator.clipboard.writeText(copyText).then(() => {
        showToast('समाधान कॉपी हो गया! अब आप इसे WhatsApp पर भेज सकते हैं।', 'success');
      });
    });
  }
}
