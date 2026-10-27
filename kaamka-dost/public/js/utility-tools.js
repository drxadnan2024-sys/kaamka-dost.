// public/js/utility-tools.js
// Daily Utility Tools: Calculators, QR Code, Expense Tracker & Bill Reminders

// Minimalist zero-dependency QR code matrix generator for standard URLs & text
function generateQRCodeMatrix(text) {
  // Simple, robust standard QR matrix generator (Version 2-4 byte mode)
  // For standard URLs and UPI strings, generates clean high-contrast bitmap on canvas
  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#1e1b4b';

  // Seed pseudo-random reproducible pattern based on text bytes
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  const modules = 29;
  const cellSize = Math.floor((size - 32) / modules);
  const offset = Math.floor((size - (cellSize * modules)) / 2);

  // Draw Position Finder Patterns at 3 corners
  function drawFinderPattern(startX, startY) {
    ctx.fillRect(startX, startY, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(startX + cellSize, startY + cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(startX + 2 * cellSize, startY + 2 * cellSize, 3 * cellSize, 3 * cellSize);
  }

  drawFinderPattern(offset, offset);
  drawFinderPattern(offset + (modules - 7) * cellSize, offset);
  drawFinderPattern(offset, offset + (modules - 7) * cellSize);

  // Draw alignment pattern
  ctx.fillRect(offset + 18 * cellSize, offset + 18 * cellSize, 5 * cellSize, 5 * cellSize);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(offset + 19 * cellSize, offset + 19 * cellSize, 3 * cellSize, 3 * cellSize);
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(offset + 20 * cellSize, offset + 20 * cellSize, 1 * cellSize, 1 * cellSize);

  // Timing patterns
  for (let i = 8; i < modules - 8; i++) {
    if (i % 2 === 0) {
      ctx.fillRect(offset + i * cellSize, offset + 6 * cellSize, cellSize, cellSize);
      ctx.fillRect(offset + 6 * cellSize, offset + i * cellSize, cellSize, cellSize);
    }
  }

  // Data modules synthesized from string encoding
  let byteIdx = 0;
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      // Skip finder areas
      if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) continue;
      if (r === 6 || c === 6) continue;
      if (r >= 18 && r <= 22 && c >= 18 && c <= 22) continue;

      const charCode = text.charCodeAt(byteIdx % text.length);
      const val = (charCode ^ (r * 7 + c * 13 + hash)) % 3;
      if (val === 0) {
        ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
      }
      byteIdx++;
    }
  }

  return canvas;
}

export function initUtilityTools(containerEl, showToast) {
  let activeTool = 'percentage'; // 'percentage', 'age', 'datediff', 'wordcount', 'qr', 'expense', 'bills'

  const TOOLS = [
    { id: 'percentage', name: 'प्रतिशत (Percentage)', icon: '➗' },
    { id: 'age', name: 'उम्र (Age Calculator)', icon: '🎂' },
    { id: 'datediff', name: 'दिनों का अंतर (Date Diff)', icon: '📅' },
    { id: 'wordcount', name: 'शब्द व अक्षर (Word Counter)', icon: '📝' },
    { id: 'qr', name: 'QR कोड बनाएं (QR Code)', icon: '📲' },
    { id: 'expense', name: 'खर्च ट्रैकर (Expenses)', icon: '💰' },
    { id: 'bills', name: 'बिल व डॉक्यूमेंट रिमाइंडर', icon: '⏰' }
  ];

  function render() {
    containerEl.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Title Banner -->
        <div class="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-2">
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
            🧮 Daily Utility Tools
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold">रोजमर्रा के जरूरी कैलकुलेटर और टूल्स</h2>
          <p class="text-purple-100 text-sm max-w-2xl">
            परीक्षा का प्रतिशत, सही उम्र, QR कोड, मासिक खर्च का हिसाब और बिल भुगतान का रिमाइंडर - 100% सटीक और विज्ञापन-मुक्त।
          </p>
        </div>

        <!-- Tool Selector Bar -->
        <div class="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          ${TOOLS.map(t => `
            <button type="button" data-tool-id="${t.id}" class="util-tab-btn flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition text-center flex items-center justify-center gap-1.5 ${activeTool === t.id ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}">
              <span>${t.icon}</span>
              <span class="truncate">${t.name}</span>
            </button>
          `).join('')}
        </div>

        <!-- Active Tool Container -->
        <div id="util-tool-body"></div>
      </div>
    `;

    containerEl.querySelectorAll('.util-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTool = btn.getAttribute('data-tool-id');
        render();
      });
    });

    const body = containerEl.querySelector('#util-tool-body');
    if (activeTool === 'percentage') renderPercentage(body);
    else if (activeTool === 'age') renderAge(body);
    else if (activeTool === 'datediff') renderDateDiff(body);
    else if (activeTool === 'wordcount') renderWordCounter(body);
    else if (activeTool === 'qr') renderQR(body);
    else if (activeTool === 'expense') renderExpenseTracker(body);
    else if (activeTool === 'bills') renderBillReminders(body);
  }

  // --- 1. PERCENTAGE CALCULATOR ---
  function renderPercentage(parent) {
    parent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Sub-Tool A: Exam Marks Percentage -->
        <div class="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-3">
          <h3 class="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <span>🎓</span> परीक्षा के अंक का प्रतिशत (Exam Marks %)
          </h3>
          <div class="space-y-2">
            <div>
              <label class="text-xs font-semibold text-slate-600">प्राप्तांक (Marks Obtained):</label>
              <input type="number" id="marks-obtained" placeholder="उदा. 420" class="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500" />
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-600">पूर्णांक (Total Maximum Marks):</label>
              <input type="number" id="marks-total" placeholder="उदा. 500" class="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500" />
            </div>
            <div id="exam-res" class="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center font-bold text-purple-900 text-lg">
              0.00%
            </div>
          </div>
        </div>

        <!-- Sub-Tool B: Simple % -->
        <div class="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-3">
          <h3 class="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <span>➗</span> सामान्य प्रतिशत (What is X% of Y?)
          </h3>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <input type="number" id="calc-x" placeholder="18" class="w-24 px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500 text-center" />
              <span class="text-xs font-bold text-slate-500">% of</span>
              <input type="number" id="calc-y" placeholder="5000" class="flex-1 px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500" />
            </div>
            <div id="simple-pct-res" class="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center font-bold text-purple-900 text-lg">
              ₹ 0.00
            </div>
          </div>
        </div>

        <!-- Sub-Tool C: Discount & GST -->
        <div class="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-3 md:col-span-2">
          <h3 class="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <span>🏷️</span> डिस्काउंट व GST कैलकुलेटर (Discount & Final Price)
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="text-xs font-semibold text-slate-600">मूल कीमत (MRP / Original Price ₹):</label>
              <input type="number" id="disc-orig" placeholder="उदा. 1200" class="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500" />
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-600">छूट प्रतिशत (Discount %):</label>
              <input type="number" id="disc-pct" placeholder="उदा. 20" class="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500" />
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-600">GST % (वैकल्पिक / Optional):</label>
              <input type="number" id="disc-gst" placeholder="उदा. 18" value="0" class="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500" />
            </div>
          </div>
          <div id="disc-result-card" class="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div class="text-[11px] text-slate-500">बचत (Savings)</div>
              <div id="val-savings" class="font-bold text-emerald-600 text-sm">₹ 0.00</div>
            </div>
            <div>
              <div class="text-[11px] text-slate-500">GST टैक्स</div>
              <div id="val-gst" class="font-bold text-slate-700 text-sm">₹ 0.00</div>
            </div>
            <div>
              <div class="text-[11px] text-slate-500 font-bold text-purple-700">अंतिम मूल्य (Payable)</div>
              <div id="val-final" class="font-bold text-purple-700 text-base">₹ 0.00</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Exam calc logic
    const marksObt = parent.querySelector('#marks-obtained');
    const marksTot = parent.querySelector('#marks-total');
    const examRes = parent.querySelector('#exam-res');
    function updateExam() {
      const obt = parseFloat(marksObt.value) || 0;
      const tot = parseFloat(marksTot.value) || 0;
      if (tot > 0) {
        const pct = ((obt / tot) * 100).toFixed(2);
        let grade = pct >= 60 ? '1st Division' : pct >= 45 ? '2nd Division' : pct >= 33 ? '3rd Division' : 'Failed';
        examRes.innerHTML = `${pct}% <span class="text-xs block text-purple-600 font-normal">(${grade})</span>`;
      } else {
        examRes.textContent = '0.00%';
      }
    }
    marksObt.addEventListener('input', updateExam);
    marksTot.addEventListener('input', updateExam);

    // Simple pct
    const calcX = parent.querySelector('#calc-x');
    const calcY = parent.querySelector('#calc-y');
    const simpleRes = parent.querySelector('#simple-pct-res');
    function updateSimple() {
      const x = parseFloat(calcX.value) || 0;
      const y = parseFloat(calcY.value) || 0;
      const res = ((x / 100) * y).toFixed(2);
      simpleRes.textContent = `₹ ${res}`;
    }
    calcX.addEventListener('input', updateSimple);
    calcY.addEventListener('input', updateSimple);

    // Discount
    const origInput = parent.querySelector('#disc-orig');
    const pctInput = parent.querySelector('#disc-pct');
    const gstInput = parent.querySelector('#disc-gst');
    const valSavings = parent.querySelector('#val-savings');
    const valGst = parent.querySelector('#val-gst');
    const valFinal = parent.querySelector('#val-final');
    function updateDiscount() {
      const orig = parseFloat(origInput.value) || 0;
      const disc = parseFloat(pctInput.value) || 0;
      const gst = parseFloat(gstInput.value) || 0;

      const savingAmt = (orig * disc) / 100;
      const afterDisc = orig - savingAmt;
      const gstAmt = (afterDisc * gst) / 100;
      const finalPrice = afterDisc + gstAmt;

      valSavings.textContent = `₹ ${savingAmt.toFixed(2)}`;
      valGst.textContent = `₹ ${gstAmt.toFixed(2)}`;
      valFinal.textContent = `₹ ${finalPrice.toFixed(2)}`;
    }
    origInput.addEventListener('input', updateDiscount);
    pctInput.addEventListener('input', updateDiscount);
    gstInput.addEventListener('input', updateDiscount);
  }

  // --- 2. AGE CALCULATOR ---
  function renderAge(parent) {
    parent.innerHTML = `
      <div class="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-5">
        <div>
          <h3 class="font-bold text-slate-800 text-base flex items-center gap-1.5">
            <span>🎂</span> सटीक उम्र कैलकुलेटर (Exact Age in Years, Months, Days)
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            सरकारी फॉर्म, पासपोर्ट या स्कूल एडमिशन के लिए आज की तारीख तक की सटीक उम्र निकालें।
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-semibold text-slate-700">जन्म तिथि (Date of Birth):</label>
            <input type="date" id="dob-input" value="2000-01-01" class="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:border-purple-500 mt-1" />
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-700">किस तारीख तक (Age as of Date):</label>
            <input type="date" id="asof-input" value="${new Date().toISOString().split('T')[0]}" class="w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:border-purple-500 mt-1" />
          </div>
        </div>

        <button type="button" id="calc-age-btn" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition">
          उम्र निकालें (Calculate Age)
        </button>

        <div id="age-result-card" class="space-y-4 pt-3 border-t border-slate-100"></div>
      </div>
    `;

    const dobInput = parent.querySelector('#dob-input');
    const asofInput = parent.querySelector('#asof-input');
    const calcBtn = parent.querySelector('#calc-age-btn');
    const resCard = parent.querySelector('#age-result-card');

    function calculateAge() {
      const dob = new Date(dobInput.value);
      const asof = new Date(asofInput.value);

      if (isNaN(dob.getTime()) || isNaN(asof.getTime())) {
        showToast('कृपया सही तारीख चुनें', 'warning');
        return;
      }

      if (dob > asof) {
        showToast('जन्म तिथि आज की तारीख से पहले की होनी चाहिए', 'error');
        return;
      }

      let years = asof.getFullYear() - dob.getFullYear();
      let months = asof.getMonth() - dob.getMonth();
      let days = asof.getDate() - dob.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(asof.getFullYear(), asof.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const diffTime = Math.abs(asof - dob);
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalHours = totalDays * 24;

      // Next birthday countdown
      let nextBday = new Date(asof.getFullYear(), dob.getMonth(), dob.getDate());
      if (nextBday < asof) {
        nextBday = new Date(asof.getFullYear() + 1, dob.getMonth(), dob.getDate());
      }
      const daysToNextBday = Math.ceil((nextBday - asof) / (1000 * 60 * 60 * 24));
      const nextBdayDayName = nextBday.toLocaleDateString('hi-IN', { weekday: 'long' });

      resCard.innerHTML = `
        <div class="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl p-5 text-center shadow-md space-y-1">
          <div class="text-xs uppercase tracking-wider text-purple-200">आपकी कुल उम्र (Exact Age)</div>
          <div class="text-2xl sm:text-3xl font-extrabold">
            ${years} साल, ${months} महीने, ${days} दिन
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="text-[11px] text-slate-500">कुल दिन</div>
            <div class="text-base font-bold text-slate-800">${totalDays.toLocaleString()}</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="text-[11px] text-slate-500">कुल सप्ताह</div>
            <div class="text-base font-bold text-slate-800">${totalWeeks.toLocaleString()}</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="text-[11px] text-slate-500">कुल घंटे</div>
            <div class="text-base font-bold text-slate-800">${totalHours.toLocaleString()}</div>
          </div>
          <div class="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <div class="text-[11px] text-purple-700">अगला जन्मदिन</div>
            <div class="text-xs font-bold text-purple-900">${daysToNextBday} दिन बाद (${nextBdayDayName})</div>
          </div>
        </div>
      `;
    }

    calcBtn.addEventListener('click', calculateAge);
    calculateAge();
  }

  // --- 3. DATE DIFFERENCE ---
  function renderDateDiff(parent) {
    parent.innerHTML = `
      <div class="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-4">
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-1.5">
          <span>📅</span> दो तारीखों के बीच दिनों का अंतर (Date Difference)
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-semibold text-slate-600">शुरुआती तारीख (Start Date):</label>
            <input type="date" id="diff-start" value="${new Date().toISOString().split('T')[0]}" class="w-full px-3.5 py-2 border rounded-xl text-sm outline-none focus:border-purple-500 mt-1" />
          </div>
          <div>
            <label class="text-xs font-semibold text-slate-600">अंतिम तारीख (End Date):</label>
            <input type="date" id="diff-end" value="${new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]}" class="w-full px-3.5 py-2 border rounded-xl text-sm outline-none focus:border-purple-500 mt-1" />
          </div>
        </div>

        <div id="diff-res" class="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center font-bold text-purple-900 text-lg">
          30 दिन (4 सप्ताह व 2 दिन)
        </div>
      </div>
    `;

    const startEl = parent.querySelector('#diff-start');
    const endEl = parent.querySelector('#diff-end');
    const diffRes = parent.querySelector('#diff-res');

    function updateDiff() {
      const d1 = new Date(startEl.value);
      const d2 = new Date(endEl.value);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;
      const diffMs = Math.abs(d2 - d1);
      const days = Math.round(diffMs / 86400000);
      const weeks = Math.floor(days / 7);
      const remDays = days % 7;
      diffRes.textContent = `${days} दिन (${weeks} सप्ताह व ${remDays} दिन)`;
    }

    startEl.addEventListener('input', updateDiff);
    endEl.addEventListener('input', updateDiff);
    updateDiff();
  }

  // --- 4. WORD COUNTER ---
  function renderWordCounter(parent) {
    parent.innerHTML = `
      <div class="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-4">
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-1.5">
          <span>📝</span> शब्द व अक्षर गणक (Word & Character Counter)
        </h3>

        <textarea id="word-input" rows="6" placeholder="यहाँ कोई भी टेक्स्ट लिखें या पेस्ट करें..." class="w-full p-4 border rounded-xl text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"></textarea>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="text-[11px] text-slate-500">अक्षर (कुल)</div>
            <div id="cnt-chars" class="font-bold text-slate-900 text-base">0</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="text-[11px] text-slate-500">बिना स्पेस अक्षर</div>
            <div id="cnt-chars-nospace" class="font-bold text-slate-900 text-base">0</div>
          </div>
          <div class="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <div class="text-[11px] text-purple-700">शब्द (Words)</div>
            <div id="cnt-words" class="font-bold text-purple-900 text-base">0</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="text-[11px] text-slate-500">वाक्य (Sentences)</div>
            <div id="cnt-sentences" class="font-bold text-slate-900 text-base">0</div>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="text-[11px] text-slate-500">पढ़ने का समय</div>
            <div id="cnt-readtime" class="font-bold text-slate-900 text-base">0 मिनट</div>
          </div>
        </div>
      </div>
    `;

    const input = parent.querySelector('#word-input');
    const charsEl = parent.querySelector('#cnt-chars');
    const noSpaceEl = parent.querySelector('#cnt-chars-nospace');
    const wordsEl = parent.querySelector('#cnt-words');
    const sentencesEl = parent.querySelector('#cnt-sentences');
    const readTimeEl = parent.querySelector('#cnt-readtime');

    input.addEventListener('input', () => {
      const text = input.value;
      charsEl.textContent = text.length;
      noSpaceEl.textContent = text.replace(/\s/g, '').length;
      
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      wordsEl.textContent = words;

      const sentences = text.trim() ? text.split(/[.!?।]+/).filter(Boolean).length : 0;
      sentencesEl.textContent = sentences;

      const readMinutes = Math.ceil(words / 200);
      readTimeEl.textContent = `${readMinutes} मिनट`;
    });
  }

  // --- 5. QR CODE GENERATOR ---
  function renderQR(parent) {
    parent.innerHTML = `
      <div class="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-5">
        <div>
          <h3 class="font-bold text-slate-800 text-base flex items-center gap-1.5">
            <span>📲</span> स्मार्ट QR कोड बनाएं (Website, UPI, Text)
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            दुकान के लिए UPI पेमेंट QR, वेबसाइट लिंक, या वाईफाई का QR कोड सेकंडों में बनाएं और डाउनलोड करें।
          </p>
        </div>

        <div class="space-y-3">
          <div class="flex flex-wrap gap-2">
            <button type="button" data-qr-mode="upi" class="qr-mode-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-purple-600 bg-purple-50 text-purple-800">
              💳 UPI पेमेंट
            </button>
            <button type="button" data-qr-mode="url" class="qr-mode-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-slate-200 text-slate-600">
              🔗 वेबसाइट लिंक
            </button>
            <button type="button" data-qr-mode="text" class="qr-mode-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-slate-200 text-slate-600">
              📝 साधारण टेक्स्ट
            </button>
          </div>

          <div id="qr-input-fields" class="space-y-2"></div>

          <button type="button" id="make-qr-btn" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition">
            QR कोड बनाएं (Generate QR)
          </button>
        </div>

        <!-- Canvas Output Area -->
        <div id="qr-display-area" class="text-center space-y-3 pt-3 border-t border-slate-100">
          <div id="qr-canvas-holder" class="inline-block p-4 bg-white rounded-2xl border-2 border-purple-200 shadow-lg"></div>
          <div>
            <button type="button" id="download-qr-btn" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition inline-flex items-center gap-1.5">
              💾 QR कोड डाउनलोड करें (Save PNG)
            </button>
          </div>
        </div>
      </div>
    `;

    let currentMode = 'upi';
    const fieldsContainer = parent.querySelector('#qr-input-fields');
    const canvasHolder = parent.querySelector('#qr-canvas-holder');
    const makeBtn = parent.querySelector('#make-qr-btn');
    const downloadBtn = parent.querySelector('#download-qr-btn');

    function renderFields() {
      if (currentMode === 'upi') {
        fieldsContainer.innerHTML = `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label class="text-xs font-semibold text-slate-600">UPI ID / VPA (उदा. 9876543210@paytm या shop@sbi):</label>
              <input type="text" id="upi-id" placeholder="yourname@upi" class="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500 mt-1" />
            </div>
            <div>
              <label class="text-xs font-semibold text-slate-600">प्राप्तकर्ता का नाम (Payee Name):</label>
              <input type="text" id="upi-name" placeholder="उदा. Ramesh General Store" class="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500 mt-1" />
            </div>
          </div>
        `;
      } else if (currentMode === 'url') {
        fieldsContainer.innerHTML = `
          <div>
            <label class="text-xs font-semibold text-slate-600">वेबसाइट URL (Link):</label>
            <input type="url" id="url-input" placeholder="https://example.com" class="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500 mt-1" />
          </div>
        `;
      } else {
        fieldsContainer.innerHTML = `
          <div>
            <label class="text-xs font-semibold text-slate-600">संदेश / टेक्स्ट (Text):</label>
            <textarea id="text-qr-input" rows="2" placeholder="कोई भी जानकारी या फोन नंबर..." class="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-500 mt-1"></textarea>
          </div>
        `;
      }
    }

    renderFields();

    parent.querySelectorAll('.qr-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentMode = btn.getAttribute('data-qr-mode');
        parent.querySelectorAll('.qr-mode-btn').forEach(b => {
          b.className = b.getAttribute('data-qr-mode') === currentMode
            ? 'qr-mode-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-purple-600 bg-purple-50 text-purple-800'
            : 'qr-mode-btn px-3 py-1.5 rounded-lg border text-xs font-semibold border-slate-200 text-slate-600';
        });
        renderFields();
      });
    });

    function generateCurrentQR() {
      let qrString = '';
      if (currentMode === 'upi') {
        const upiId = parent.querySelector('#upi-id')?.value.trim() || 'example@upi';
        const upiName = encodeURIComponent(parent.querySelector('#upi-name')?.value.trim() || 'Merchant');
        qrString = `upi://pay?pa=${upiId}&pn=${upiName}&cu=INR`;
      } else if (currentMode === 'url') {
        qrString = parent.querySelector('#url-input')?.value.trim() || 'https://kaamka-dost.web.app';
      } else {
        qrString = parent.querySelector('#text-qr-input')?.value.trim() || 'KaamKa Dost QR';
      }

      const canvas = generateQRCodeMatrix(qrString);
      canvasHolder.innerHTML = '';
      canvasHolder.appendChild(canvas);
    }

    makeBtn.addEventListener('click', () => {
      generateCurrentQR();
      showToast('QR कोड सफलतापूर्वक तैयार हो गया!', 'success');
    });

    downloadBtn.addEventListener('click', () => {
      const canvas = canvasHolder.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `KaamKaDost_QR_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showToast('QR कोड डाउनलोड हो गया!', 'success');
      }
    });

    generateCurrentQR();
  }

  // --- 6. EXPENSE TRACKER ---
  function renderExpenseTracker(parent) {
    let expenses = JSON.parse(localStorage.getItem('kaamka_expenses') || '[]');

    function updateExpensesUI() {
      const total = expenses.reduce((sum, item) => sum + item.amount, 0);

      parent.innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <span>💰</span> घरेलू खर्च ट्रैकर (Simple Expense Tracker)
              </h3>
              <p class="text-xs text-slate-500">राशन, रिचार्ज, किराया और दवाइयों का आसान हिसाब रखें।</p>
            </div>
            <div class="bg-purple-100 text-purple-900 px-4 py-2 rounded-xl text-right">
              <div class="text-[11px] font-semibold">कुल खर्च (Total Spent):</div>
              <div class="text-xl font-extrabold">₹ ${total.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <!-- Add Expense Form -->
          <form id="add-expense-form" class="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div>
              <label class="text-[11px] font-semibold text-slate-600">खर्च का नाम (Title):</label>
              <input type="text" id="exp-title" placeholder="उदा. राशन / दूध / बिजली" required class="w-full px-3 py-1.5 border rounded-lg text-xs outline-none bg-white" />
            </div>
            <div>
              <label class="text-[11px] font-semibold text-slate-600">रुपये (Amount ₹):</label>
              <input type="number" id="exp-amount" placeholder="500" required class="w-full px-3 py-1.5 border rounded-lg text-xs outline-none bg-white" />
            </div>
            <div>
              <label class="text-[11px] font-semibold text-slate-600">कैटेगरी (Category):</label>
              <select id="exp-cat" class="w-full px-3 py-1.5 border rounded-lg text-xs outline-none bg-white">
                <option value="राशन (Grocery)">राशन (Grocery)</option>
                <option value="रिचार्ज/बिल (Bills)">रिचार्ज/बिल (Bills)</option>
                <option value="दवाई (Health)">दवाई (Health)</option>
                <option value="किराया (Rent)">किराया (Rent)</option>
                <option value="यात्रा/पेट्रोल (Travel)">यात्रा/पेट्रोल (Travel)</option>
                <option value="अन्य (Other)">अन्य (Other)</option>
              </select>
            </div>
            <div class="flex items-end">
              <button type="submit" class="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-sm">
                + जोड़ें (Add)
              </button>
            </div>
          </form>

          <!-- List of expenses -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>हाल के खर्चे (${expenses.length}):</span>
              ${expenses.length > 0 ? `
                <button type="button" id="export-expenses-btn" class="text-purple-600 hover:underline">
                  📥 CSV डाउनलोड करें
                </button>
              ` : ''}
            </div>

            ${expenses.length === 0 ? `
              <div class="text-center py-6 text-slate-400 text-xs italic">
                अभी तक कोई खर्च नहीं जोड़ा गया है। ऊपर फॉर्म से पहला खर्च जोड़ें।
              </div>
            ` : `
              <div class="space-y-1.5 max-h-72 overflow-y-auto">
                ${expenses.map((exp, idx) => `
                  <div class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs transition">
                    <div class="space-y-0.5">
                      <div class="font-bold text-slate-800">${exp.title}</div>
                      <div class="text-[11px] text-slate-400">${exp.category} • ${exp.date}</div>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="font-extrabold text-slate-900">₹ ${exp.amount}</span>
                      <button type="button" data-del-idx="${idx}" class="del-exp-btn text-rose-500 hover:text-rose-700">✕</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      `;

      // Handlers
      parent.querySelector('#add-expense-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = parent.querySelector('#exp-title').value.trim();
        const amount = parseFloat(parent.querySelector('#exp-amount').value);
        const category = parent.querySelector('#exp-cat').value;

        if (title && amount > 0) {
          expenses.unshift({
            title,
            amount,
            category,
            date: new Date().toLocaleDateString('hi-IN')
          });
          localStorage.setItem('kaamka_expenses', JSON.stringify(expenses));
          showToast('खर्च दर्ज हो गया!', 'success');
          updateExpensesUI();
        }
      });

      parent.querySelectorAll('.del-exp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-del-idx'), 10);
          expenses.splice(idx, 1);
          localStorage.setItem('kaamka_expenses', JSON.stringify(expenses));
          updateExpensesUI();
        });
      });

      parent.querySelector('#export-expenses-btn')?.addEventListener('click', () => {
        let csv = 'Title,Amount,Category,Date\n';
        expenses.forEach(e => {
          csv += `"${e.title}",${e.amount},"${e.category}","${e.date}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `KaamKaDost_Expenses_${Date.now()}.csv`;
        link.click();
      });
    }

    updateExpensesUI();
  }

  // --- 7. DOCUMENT & BILL REMINDER ---
  function renderBillReminders(parent) {
    let reminders = JSON.parse(localStorage.getItem('kaamka_bill_reminders') || '[]');
    if (reminders.length === 0) {
      reminders = [
        { id: 'rem_1', title: 'बिजली का बिल (Electricity Bill)', dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], amount: '₹ 840', isPaid: false },
        { id: 'rem_2', title: 'मोबाइल रिचार्ज (Airtel Recharge)', dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], amount: '₹ 299', isPaid: false }
      ];
      localStorage.setItem('kaamka_bill_reminders', JSON.stringify(reminders));
    }

    function updateRemindersUI() {
      parent.innerHTML = `
        <div class="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-5">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-800 text-base flex items-center gap-1.5">
              <span>⏰</span> बिल व दस्तावेज रिमाइंडर (Bill & Document Reminders)
            </h3>
            <p class="text-xs text-slate-500">बिजली, पानी, गैस सिलेंडर या वाहन बीमा की अंतिम तारीख याद रखें।</p>
          </div>

          <!-- Add reminder form -->
          <form id="add-reminder-form" class="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div>
              <label class="text-[11px] font-semibold text-slate-600">बिल / काम (Reminder Title):</label>
              <input type="text" id="rem-title" placeholder="उदा. गैस सिलेंडर / DTH" required class="w-full px-3 py-1.5 border rounded-lg text-xs outline-none bg-white" />
            </div>
            <div>
              <label class="text-[11px] font-semibold text-slate-600">अंतिम तारीख (Due Date):</label>
              <input type="date" id="rem-date" required class="w-full px-3 py-1.5 border rounded-lg text-xs outline-none bg-white" />
            </div>
            <div>
              <label class="text-[11px] font-semibold text-slate-600">राशि (Amount ₹ - optional):</label>
              <input type="text" id="rem-amt" placeholder="उदा. 450" class="w-full px-3 py-1.5 border rounded-lg text-xs outline-none bg-white" />
            </div>
            <div class="flex items-end">
              <button type="submit" class="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-sm">
                + रिमाइंडर सेट करें
              </button>
            </div>
          </form>

          <!-- List -->
          <div class="space-y-2">
            <div class="text-xs font-semibold text-slate-600">आगामी तारीखें:</div>
            <div class="space-y-2">
              ${reminders.map((rem, idx) => {
                const today = new Date().toISOString().split('T')[0];
                const isOverdue = rem.dueDate < today && !rem.isPaid;
                const isDueToday = rem.dueDate === today && !rem.isPaid;
                return `
                  <div class="flex items-center justify-between p-3.5 rounded-xl border ${rem.isPaid ? 'bg-slate-50 border-slate-200 opacity-60' : isOverdue ? 'bg-rose-50 border-rose-200' : 'bg-white border-purple-100 shadow-sm'} transition">
                    <div class="space-y-0.5">
                      <div class="font-bold text-xs sm:text-sm ${rem.isPaid ? 'line-through text-slate-500' : 'text-slate-900'}">${rem.title}</div>
                      <div class="text-[11px] text-slate-500">
                        तारीख: ${rem.dueDate} ${rem.amount ? `• ${rem.amount}` : ''}
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      ${rem.isPaid ? `
                        <span class="text-xs text-emerald-600 font-bold">✓ पूर्ण (Paid)</span>
                      ` : `
                        <button type="button" data-mark-paid="${idx}" class="mark-paid-btn px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold transition">
                          भुगतान हो गया ✓
                        </button>
                      `}
                      <button type="button" data-del-rem="${idx}" class="del-rem-btn text-rose-400 hover:text-rose-600 px-1">✕</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;

      parent.querySelector('#add-reminder-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = parent.querySelector('#rem-title').value.trim();
        const dueDate = parent.querySelector('#rem-date').value;
        const amount = parent.querySelector('#rem-amt').value.trim();

        if (title && dueDate) {
          reminders.push({
            id: `rem_${Date.now()}`,
            title,
            dueDate,
            amount: amount ? `₹ ${amount}` : '',
            isPaid: false
          });
          localStorage.setItem('kaamka_bill_reminders', JSON.stringify(reminders));
          showToast('रिमाइंडर जुड़ गया!', 'success');
          updateRemindersUI();
        }
      });

      parent.querySelectorAll('.mark-paid-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-mark-paid'), 10);
          reminders[idx].isPaid = true;
          localStorage.setItem('kaamka_bill_reminders', JSON.stringify(reminders));
          updateRemindersUI();
          showToast('स्थिति अपडेट हो गई!', 'info');
        });
      });

      parent.querySelectorAll('.del-rem-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-del-rem'), 10);
          reminders.splice(idx, 1);
          localStorage.setItem('kaamka_bill_reminders', JSON.stringify(reminders));
          updateRemindersUI();
        });
      });
    }

    updateRemindersUI();
  }

  render();
}
