// public/js/letter-maker.js
// 8 Indian Application and Letter Generators with Live Preview, Copy, Download & Print

export const LETTER_TYPES = [
  {
    id: "leave_office",
    name: "Leave Application (Office / Work)",
    nameHindi: "ऑफिस से छुट्टी का आवेदन",
    category: "Work",
    icon: "🏢",
    fields: [
      { id: "sender_name", label: "आपका नाम (Your Name)", placeholder: "उदा. राहुल शर्मा", default: "" },
      { id: "sender_role", label: "पद / डेजिगनेशन (Job Title / Role)", placeholder: "उदा. सेल्स एग्जीक्यूटिव / सॉफ्टवेयर इंजीनियर", default: "" },
      { id: "manager_name", label: "मैनेजर का नाम / पद (Manager Name / Designation)", placeholder: "उदा. श्रीमान राजेश वर्मा, ब्रांच मैनेजर", default: "" },
      { id: "company_name", label: "कंपनी का नाम (Company / Office Name)", placeholder: "उदा. एबीसी टेक्नोलॉजीज प्रा. लि.", default: "" },
      { id: "leave_reason", label: "छुट्टी का कारण (Reason)", type: "select", options: ["अचानक तबियत खराब (Fever / Sick Leave)", "पारिवारिक जरूरी काम (Urgent Family Work)", "रिश्तेदार की शादी (Family Wedding)", "व्यक्तिगत कारण (Personal Reason)"] },
      { id: "leave_days", label: "दिनों की संख्या (Days)", placeholder: "उदा. 2 दिन", default: "2 दिन" },
      { id: "start_date", label: "किस तारीख से (From Date)", type: "date", default: new Date().toISOString().split('T')[0] }
    ]
  },
  {
    id: "leave_school",
    name: "School / College Leave Application",
    nameHindi: "स्कूल या कॉलेज में छुट्टी का आवेदन",
    category: "Education",
    icon: "🎓",
    fields: [
      { id: "student_name", label: "छात्र / छात्रा का नाम (Student Name)", placeholder: "उदा. अमन कुमार", default: "" },
      { id: "class_roll", label: "कक्षा और रोल नंबर (Class & Roll No.)", placeholder: "उदा. कक्षा 10-A, रोल नं. 24", default: "" },
      { id: "school_name", label: "स्कूल / कॉलेज का नाम (School / College Name)", placeholder: "उदा. राजकीय उच्चतर माध्यमिक विद्यालय", default: "" },
      { id: "school_city", label: "शहर (City)", placeholder: "उदा. भोपाल, मध्य प्रदेश", default: "" },
      { id: "leave_reason", label: "छुट्टी का कारण (Reason)", type: "select", options: ["तेज बुखार और डॉक्टर की सलाह (Illness / Doctor's Advice)", "भाई/बहन की शादी (Sibling's Marriage)", "घर पर आवश्यक कार्य (Urgent Work at Home)"] },
      { id: "leave_days", label: "दिनों की संख्या (Number of Days)", placeholder: "उदा. 3 दिन", default: "3 दिन" },
      { id: "start_date", label: "आरंभ तिथि (Start Date)", type: "date", default: new Date().toISOString().split('T')[0] }
    ]
  },
  {
    id: "complaint_civic",
    name: "Civic Complaint (Garbage / Water / Electricity)",
    nameHindi: "नगर निगम / बिजली विभाग शिकायत पत्र",
    category: "Civic",
    icon: "⚠️",
    fields: [
      { id: "sender_name", label: "शिकायतकर्ता का नाम (Your Name)", placeholder: "उदा. सुरेश यादव", default: "" },
      { id: "locality", label: "आपका पता / मोहल्ला (Locality & Address)", placeholder: "उदा. मकान नं. 45, गांधी नगर", default: "" },
      { id: "authority", label: "संबंधित अधिकारी (Target Officer / Department)", type: "select", options: ["नगर आयुक्त, नगर निगम (Municipal Commissioner)", "सहायक अभियंता, बिजली विभाग (Electricity Department SDO)", "जलकल अभियंता, जल निगम (Water Works Dept)", "प्रभारी निरीक्षक, स्थानीय पुलिस थाना (Police Station SHO)"] },
      { id: "city", label: "शहर (City)", placeholder: "उदा. कानपुर", default: "" },
      { id: "issue_details", label: "समस्या का विवरण (Problem Details)", placeholder: "उदा. पिछले 4 दिनों से मोहल्ले में कचरा गाड़ी नहीं आई है और दुर्गंध फैल रही है...", default: "" }
    ]
  },
  {
    id: "fee_concession",
    name: "Fee Concession / Waiver Request",
    nameHindi: "स्कूल / कॉलेज फीस माफी का प्रार्थना पत्र",
    category: "Education",
    icon: "📝",
    fields: [
      { id: "student_name", label: "छात्र का नाम (Student Name)", placeholder: "उदा. विकास वर्मा", default: "" },
      { id: "course_year", label: "कक्षा / वर्ष (Class / Course & Year)", placeholder: "उदा. B.Com द्वितीय वर्ष, रोल नं. 112", default: "" },
      { id: "father_occupation", label: "पिताजी का व्यवसाय व स्थिति (Father's Occupation)", placeholder: "उदा. दैनिक मजदूर / किसान", default: "" },
      { id: "institution_name", label: "कॉलेज / स्कूल का नाम (Institution Name)", placeholder: "उदा. स्वामी विवेकानंद महाविद्यालय", default: "" },
      { id: "concession_reason", label: "माफी का कारण (Reason for Financial Need)", placeholder: "उदा. परिवार की कमजोर आर्थिक स्थिति के कारण पूरी फीस एकमुश्त जमा करने में असमर्थ...", default: "" }
    ]
  },
  {
    id: "job_application",
    name: "Job Application & Cover Letter",
    nameHindi: "नौकरी के लिए आवेदन पत्र (Job Application)",
    category: "Work",
    icon: "💼",
    fields: [
      { id: "applicant_name", label: "आपका नाम (Your Name)", placeholder: "उदा. सुमित गुप्ता", default: "" },
      { id: "phone_email", label: "मोबाइल नंबर व ईमेल (Phone & Email)", placeholder: "उदा. 9876543210 / sumit@email.com", default: "" },
      { id: "target_role", label: "किस पद के लिए आवेदन (Job Role Applied For)", placeholder: "उदा. कंप्यूटर ऑपरेटर / अकाउंटेंट / स्टोर मैनेजर", default: "" },
      { id: "company_name", label: "कंपनी / फर्म का नाम (Company Name)", placeholder: "उदा. श्री ट्रेडर्स प्रा. लि.", default: "" },
      { id: "qualification", label: "आपकी योग्यता व अनुभव (Qualification & Experience)", placeholder: "उदा. 12वीं पास / B.A., 2 वर्ष का कंप्यूटर व टैली का अनुभव", default: "" }
    ]
  },
  {
    id: "resume_draft",
    name: "Simple Indian Biodata / Resume",
    nameHindi: "सरल बायोडाटा / रिज्यूम प्रारूप",
    category: "Work",
    icon: "📄",
    fields: [
      { id: "full_name", label: "पूरा नाम (Full Name)", placeholder: "उदा. पूजा शर्मा", default: "" },
      { id: "contact_info", label: "पता, फोन व ईमेल (Contact & Address)", placeholder: "उदा. शास्त्री नगर, जयपुर | मो. 9876543210", default: "" },
      { id: "education", label: "शैक्षणिक योग्यता (Education Qualifications)", placeholder: "उदा. 1. 10th (CBSE) - 78% | 2. 12th (CBSE) - 82% | 3. BCA (University) - 75%", default: "" },
      { id: "skills", label: "विशेष कौशल (Key Skills)", placeholder: "उदा. MS Office, Tally Prime, Hindi/English Typing, Customer Service", default: "" },
      { id: "experience", label: "कार्य अनुभव (Work Experience)", placeholder: "उदा. 1 साल का अनुभव बतौर बिलिंग एग्जीक्यूटिव", default: "" }
    ]
  },
  {
    id: "govt_office",
    name: "Government Office Request Letter",
    nameHindi: "सरकारी दफ्तर आवेदन (राशन कार्ड / प्रमाण पत्र)",
    category: "Civic",
    icon: "🏛️",
    fields: [
      { id: "applicant_name", label: "आवेदक का नाम (Applicant Name)", placeholder: "उदा. मुन्ना लाल", default: "" },
      { id: "father_husband", label: "पिता / पति का नाम (Father / Husband Name)", placeholder: "उदा. श्री रामेश्वर प्रसाद", default: "" },
      { id: "address", label: "स्थायी पता (Permanent Address)", placeholder: "उदा. ग्राम व पोस्ट: रामपुर, जिला: मेरठ", default: "" },
      { id: "officer_title", label: "संबंधित अधिकारी (Officer Title)", type: "select", options: ["उपजिलाधिकारी (SDM महोदय)", "तहसीलदार महोदय (Tehsildar)", "जिला आपूर्ति अधिकारी (Ration Supply Officer)", "खंड विकास अधिकारी (BDO)"] },
      { id: "purpose", label: "आवेदन का विषय / उद्देश्य (Purpose of Letter)", type: "select", options: ["राशन कार्ड में नए सदस्य का नाम जोड़ने बाबत", "निवास प्रमाण पत्र निर्गत कराने हेतु", "जाति प्रमाण पत्र सत्यापन बाबत", "आय प्रमाण पत्र संशोधन हेतु"] }
    ]
  },
  {
    id: "whatsapp_formal",
    name: "Polite WhatsApp & Email Message Drafts",
    nameHindi: "मकान मालिक / बॉस / शिक्षक को औपचारिक WhatsApp मैसेज",
    category: "Messaging",
    icon: "💬",
    fields: [
      { id: "recipient_type", label: "किसे भेजना है? (Recipient)", type: "select", options: ["मकान मालिक को किराया देर से देने की सूचना (Landlord Rent Delay)", "बॉस को एडवांस वेतन या छुट्टी का निवेदन (Boss Advance Salary Request)", "बच्चे के क्लास टीचर को मैसेज (Message to School Teacher)", "क्लाइंट या कस्टमर को पेमेंट रिमाइंडर (Client Payment Reminder)"] },
      { id: "sender_name", label: "आपका नाम (Your Name)", placeholder: "उदा. अमित", default: "" },
      { id: "specific_note", label: "विशेष विवरण / तारीख (Specific Details / Expected Date)", placeholder: "उदा. 5 तारीख के बजाय 10 तारीख को किराया दूंगा", default: "" }
    ]
  }
];

export function initLetterMaker(containerEl, showToast) {
  let selectedTypeId = LETTER_TYPES[0].id;
  let selectedLanguage = 'hi'; // 'hi' or 'en'
  let selectedTone = 'formal'; // 'formal', 'polite', 'urgent'

  function render() {
    const currentType = LETTER_TYPES.find(t => t.id === selectedTypeId) || LETTER_TYPES[0];

    containerEl.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Title Banner -->
        <div class="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              ✍️ Application & Letter Maker
            </span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold">आसानी से बनाएं सरकारी, स्कूल व ऑफिस के आवेदन</h2>
          <p class="text-purple-100 text-sm sm:text-base max-w-2xl">
            छुट्टी का पत्र, राशन कार्ड आवेदन, नौकरी का कवर लेटर या मकान मालिक को फॉर्मल मैसेज - बस जानकारी भरें और सेकंडों में तैयार करें।
          </p>
        </div>

        <!-- Type Selector Grid -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm space-y-3">
          <div class="text-xs font-bold uppercase tracking-wider text-slate-500">
            पत्र या आवेदन का प्रकार चुनें (Select Document Type):
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            ${LETTER_TYPES.map(type => `
              <button type="button" data-type-id="${type.id}" class="letter-type-btn p-3 rounded-xl border text-left transition flex flex-col gap-1.5 ${type.id === selectedTypeId ? 'border-purple-600 bg-purple-50/70 shadow-sm font-semibold' : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'}">
                <span class="text-xl">${type.icon}</span>
                <span class="text-xs text-slate-800 line-clamp-1">${type.nameHindi}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Form + Controls -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left: Input Fields -->
          <div class="lg:col-span-5 bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <span>📋</span> विवरण भरें (Fill Details)
              </h3>
              
              <!-- Language Switcher for Letter -->
              <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                <button type="button" id="lang-hi-btn" class="px-2.5 py-1 rounded-md transition ${selectedLanguage === 'hi' ? 'bg-white shadow text-purple-700 font-bold' : 'text-slate-600'}">हिंदी</button>
                <button type="button" id="lang-en-btn" class="px-2.5 py-1 rounded-md transition ${selectedLanguage === 'en' ? 'bg-white shadow text-purple-700 font-bold' : 'text-slate-600'}">English</button>
              </div>
            </div>

            <!-- Tone Selector -->
            <div class="space-y-1">
              <label class="block text-[11px] font-semibold text-slate-500 uppercase">टोन / शैली (Tone):</label>
              <div class="grid grid-cols-3 gap-1.5 text-xs">
                <button type="button" data-tone="formal" class="tone-btn py-1.5 px-2 rounded-lg border text-center transition ${selectedTone === 'formal' ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold' : 'border-slate-200 text-slate-600'}">औपचारिक (Formal)</button>
                <button type="button" data-tone="polite" class="tone-btn py-1.5 px-2 rounded-lg border text-center transition ${selectedTone === 'polite' ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold' : 'border-slate-200 text-slate-600'}">विनम्र (Polite)</button>
                <button type="button" data-tone="urgent" class="tone-btn py-1.5 px-2 rounded-lg border text-center transition ${selectedTone === 'urgent' ? 'border-purple-600 bg-purple-50 text-purple-800 font-bold' : 'border-slate-200 text-slate-600'}">आवश्यक (Urgent)</button>
              </div>
            </div>

            <!-- Dynamic Fields -->
            <form id="letter-input-form" class="space-y-3">
              ${currentType.fields.map(f => `
                <div class="space-y-1">
                  <label for="field_${f.id}" class="block text-xs font-semibold text-slate-700">${f.label}</label>
                  ${f.type === 'select' ? `
                    <select id="field_${f.id}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none bg-white">
                      ${f.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                  ` : f.type === 'date' ? `
                    <input type="date" id="field_${f.id}" value="${f.default || ''}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
                  ` : `
                    <input type="text" id="field_${f.id}" placeholder="${f.placeholder || ''}" value="${f.default || ''}" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
                  `}
                </div>
              `).join('')}

              <button type="button" id="generate-letter-btn" class="w-full py-2.5 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-1.5">
                <span>✨</span> पत्र तैयार करें (Generate Draft)
              </button>
            </form>
          </div>

          <!-- Right: Live Letter Preview & Actions -->
          <div class="lg:col-span-7 space-y-3">
            <div class="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                  <span>📄</span> तैयार पत्र (Editable Live Preview)
                </span>
                
                <div class="flex items-center gap-1.5">
                  <button type="button" id="copy-letter-btn" class="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold transition flex items-center gap-1">
                    📋 कॉपी करें
                  </button>
                  <button type="button" id="download-letter-btn" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1">
                    💾 डाउनलोड (.txt)
                  </button>
                  <button type="button" id="print-letter-btn" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-sm">
                    🖨️ प्रिंट / PDF
                  </button>
                </div>
              </div>

              <!-- Printable & Editable Draft Area -->
              <div id="letter-printable-area" class="relative">
                <textarea id="letter-output-text" rows="18" class="w-full p-4 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 font-serif text-slate-800 text-sm leading-relaxed outline-none resize-y bg-slate-50/50"></textarea>
              </div>

              <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>💡 आप ऊपर टेक्स्ट पर क्लिक करके सीधे बदलाव भी कर सकते हैं।</span>
                <button type="button" id="save-draft-btn" class="text-purple-600 hover:underline font-medium">
                  💾 ड्राफ्ट सुरक्षित रखें
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
    generateLetterDraft();
  }

  function attachEvents() {
    // Type selector buttons
    containerEl.querySelectorAll('.letter-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedTypeId = btn.getAttribute('data-type-id');
        render();
      });
    });

    // Language buttons
    const langHiBtn = containerEl.querySelector('#lang-hi-btn');
    const langEnBtn = containerEl.querySelector('#lang-en-btn');
    langHiBtn.addEventListener('click', () => {
      selectedLanguage = 'hi';
      render();
    });
    langEnBtn.addEventListener('click', () => {
      selectedLanguage = 'en';
      render();
    });

    // Tone buttons
    containerEl.querySelectorAll('.tone-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedTone = btn.getAttribute('data-tone');
        containerEl.querySelectorAll('.tone-btn').forEach(b => {
          b.className = b.getAttribute('data-tone') === selectedTone
            ? 'tone-btn py-1.5 px-2 rounded-lg border text-center transition border-purple-600 bg-purple-50 text-purple-800 font-bold'
            : 'tone-btn py-1.5 px-2 rounded-lg border text-center transition border-slate-200 text-slate-600';
        });
        generateLetterDraft();
      });
    });

    // Generate button
    containerEl.querySelector('#generate-letter-btn').addEventListener('click', () => {
      generateLetterDraft();
      showToast('पत्र का नया प्रारूप तैयार किया गया!', 'info');
    });

    // Copy button
    containerEl.querySelector('#copy-letter-btn').addEventListener('click', () => {
      const text = containerEl.querySelector('#letter-output-text').value;
      navigator.clipboard.writeText(text).then(() => {
        showToast('पत्र क्लिपबोर्ड में कॉपी हो गया!', 'success');
      });
    });

    // Download .txt button
    containerEl.querySelector('#download-letter-btn').addEventListener('click', () => {
      const text = containerEl.querySelector('#letter-output-text').value;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Application_${selectedTypeId}_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('फाइल डाउनलोड हो गई!', 'success');
    });

    // Print / PDF button
    containerEl.querySelector('#print-letter-btn').addEventListener('click', () => {
      window.print();
    });

    // Save draft button
    containerEl.querySelector('#save-draft-btn').addEventListener('click', () => {
      const text = containerEl.querySelector('#letter-output-text').value;
      const saved = JSON.parse(localStorage.getItem('kaamka_saved_drafts') || '[]');
      saved.unshift({
        id: `draft_${Date.now()}`,
        typeId: selectedTypeId,
        title: LETTER_TYPES.find(t => t.id === selectedTypeId)?.nameHindi || 'आवेदन ड्राफ्ट',
        date: new Date().toLocaleDateString('hi-IN'),
        content: text
      });
      localStorage.setItem('kaamka_saved_drafts', JSON.stringify(saved.slice(0, 20)));
      showToast('ड्राफ्ट आपकी प्रोफाइल में सुरक्षित कर दिया गया!', 'success');
    });
  }

  function getFieldValue(fieldId) {
    const el = containerEl.querySelector(`#field_${fieldId}`);
    return el ? el.value.trim() : '';
  }

  function generateLetterDraft() {
    const isHindi = selectedLanguage === 'hi';
    const outputEl = containerEl.querySelector('#letter-output-text');
    if (!outputEl) return;

    let draft = '';
    const today = new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    switch (selectedTypeId) {
      case 'leave_office': {
        const name = getFieldValue('sender_name') || (isHindi ? '[आपका नाम]' : '[Your Name]');
        const role = getFieldValue('sender_role') || (isHindi ? '[आपका पद]' : '[Your Role]');
        const manager = getFieldValue('manager_name') || (isHindi ? '[मैनेजर का नाम/पद]' : '[Manager Name/Role]');
        const company = getFieldValue('company_name') || (isHindi ? '[कंपनी का नाम]' : '[Company Name]');
        const reason = getFieldValue('leave_reason') || (isHindi ? 'अचानक तबियत खराब होने के कारण' : 'personal emergency');
        const days = getFieldValue('leave_days') || '2';
        const startDate = getFieldValue('start_date') || today;

        if (isHindi) {
          draft = `दिनांक: ${today}

सेवा में,
${manager},
${company}

विषय: आकस्मिक अवकाश (छुट्टी) हेतु प्रार्थना पत्र

महोदय/महोदया,

सविनय निवेदन यह है कि मैं आपकी कंपनी में ${role} के पद पर कार्यरत हूँ। ${reason} के चलते, मैं दिनांक ${startDate} से आगामी ${days} तक कार्यालय में उपस्थित होने में असमर्थ हूँ।

मेरा आपसे विनम्र अनुरोध है कि कृपया मुझे उक्त तिथियों का अवकाश प्रदान करने की कृपा करें। अवकाश के दौरान यदि कोई अति-आवश्यक कार्य हो, तो मैं फोन अथवा ईमेल पर उपलब्ध रहूँगा।

सधन्यवाद,

भवदीय,
${name}
पद: ${role}
मो. नं.: [आपका फोन नंबर]`;
        } else {
          draft = `Date: ${today}

To,
${manager},
${company}

Subject: Application for Leave of Absence (${days})

Respected Sir/Madam,

I am writing to formally request leave from my duties as ${role} for ${days}, starting from ${startDate}, due to ${reason}.

I will ensure all my pending tasks are handed over or addressed upon my return. In case of any urgent work requirement, I will be reachable via phone or email.

I kindly request you to approve my leave application.

Thanking you.

Sincerely,
${name}
Designation: ${role}
Contact: [Your Phone Number]`;
        }
        break;
      }

      case 'leave_school': {
        const student = getFieldValue('student_name') || (isHindi ? '[छात्र/छात्रा का नाम]' : '[Student Name]');
        const classRoll = getFieldValue('class_roll') || (isHindi ? '[कक्षा व रोल नं.]' : '[Class & Roll No.]');
        const school = getFieldValue('school_name') || (isHindi ? '[विद्यालय का नाम]' : '[School Name]');
        const city = getFieldValue('school_city') || (isHindi ? '[शहर]' : '[City]');
        const reason = getFieldValue('leave_reason') || (isHindi ? 'अचानक अस्वस्थ होने के कारण' : 'unforeseen illness');
        const days = getFieldValue('leave_days') || '3 दिन';
        const startDate = getFieldValue('start_date') || today;

        if (isHindi) {
          draft = `दिनांक: ${today}

सेवा में,
प्रधानाचार्य महोदय,
${school},
${city}

विषय: अस्वस्थता/कारणवश अवकाश हेतु प्रार्थना पत्र

आदरणीय महोदय,

सविनय निवेदन है कि मैं आपके विद्यालय में ${classRoll} का छात्र/छात्रा हूँ। मुझे ${reason} के कारण दिनांक ${startDate} से ${days} तक विद्यालय आने में असमर्थता होगी।

अतः आपसे विनम्र प्रार्थना है कि मुझे उक्त दिनों का अवकाश प्रदान करने की कृपा करें। इसके लिए मैं आपका सदैव आभारी रहूँगा।

आपका आज्ञाकारी शिष्य/शिष्या,
नाम: ${student}
${classRoll}
अभिभावक के हस्ताक्षर: [हस्ताक्षर]`;
        } else {
          draft = `Date: ${today}

To,
The Principal,
${school},
${city}

Subject: Application for Leave of Absence

Respected Sir/Madam,

With due respect, I beg to state that I am a student of ${classRoll} in your esteemed institution. Due to ${reason}, I will be unable to attend classes starting from ${startDate} for ${days}.

I kindly request you to grant me leave for the aforementioned period. I will ensure I catch up on all class notes and homework missed.

Thanking you.

Yours obediently,
Name: ${student}
${classRoll}`;
        }
        break;
      }

      case 'complaint_civic': {
        const name = getFieldValue('sender_name') || (isHindi ? '[आपका नाम]' : '[Your Name]');
        const loc = getFieldValue('locality') || (isHindi ? '[मोहल्ला/पता]' : '[Address]');
        const auth = getFieldValue('authority') || (isHindi ? 'नगर आयुक्त' : 'Concerned Officer');
        const city = getFieldValue('city') || (isHindi ? '[शहर]' : '[City]');
        const details = getFieldValue('issue_details') || (isHindi ? 'गंदगी और सफाई न होने के संबंध में...' : 'sanitation issue in our area...');

        if (isHindi) {
          draft = `दिनांक: ${today}

सेवा में,
श्रीमान ${auth},
${city}

विषय: ${loc} में जन-समस्या के निराकरण बाबत शिकायत पत्र

महोदय,

मैं इस पत्र के माध्यम से आपका ध्यान हमारे क्षेत्र ${loc}, ${city} की एक गंभीर समस्या की ओर आकर्षित करना चाहता हूँ।

विवरण:
${details}

इस समस्या के कारण स्थानीय निवासियों, वृद्धों और बच्चों को भारी कठिनाइयों का सामना करना पड़ रहा है तथा बीमारियों के फैलने का खतरा बन गया है। पूर्व में भी मौखिक सूचना दी गई थी परंतु अभी तक कोई ठोस कार्रवाई नहीं हुई है।

अतः आपसे विनम्र आग्रह है कि मामले की गंभीरता को देखते हुए संबंधित कर्मचारियों को तुरंत उचित कदम उठाने के निर्देश देने की कृपा करें।

सधन्यवाद,

प्रार्थी,
${name}
पता: ${loc}, ${city}
मोबाइल: [आपका फोन नंबर]`;
        } else {
          draft = `Date: ${today}

To,
The ${auth},
${city}

Subject: Urgent Complaint Regarding Public Grievance at ${loc}

Respected Sir/Madam,

I am writing this letter to bring to your immediate attention a persistent issue being faced by the residents of ${loc}, ${city}.

Issue Details:
${details}

This condition is causing immense inconvenience and health risks to the residents, particularly children and elderly citizens. 

Therefore, I earnestly request you to kindly direct the concerned personnel to inspect the site and resolve the issue on top priority.

Thanking you in anticipation.

Yours faithfully,
${name}
Address: ${loc}, ${city}
Mobile: [Your Phone Number]`;
        }
        break;
      }

      case 'fee_concession': {
        const student = getFieldValue('student_name') || '[छात्र का नाम]';
        const course = getFieldValue('course_year') || '[कक्षा/वर्ष]';
        const fatherOcc = getFieldValue('father_occupation') || '[पिता का व्यवसाय]';
        const college = getFieldValue('institution_name') || '[महाविद्यालय का नाम]';
        const reason = getFieldValue('concession_reason') || 'कमजोर आर्थिक स्थिति';

        draft = `दिनांक: ${today}

सेवा में,
प्राचार्य / प्रधानाचार्य महोदय,
${college}

विषय: शिक्षण शुल्क में रियायत / छूट हेतु प्रार्थना पत्र

महोदय,

सविनय निवेदन है कि मैं आपके प्रतिष्ठित संस्थान में ${course} का नियमित छात्र हूँ। मैं अपनी पढ़ाई में सदैव परिश्रमी रहा हूँ तथा पिछली परीक्षाओं में अच्छे अंक प्राप्त किए हैं।

मेरे पिताजी ${fatherOcc} हैं तथा हमारे परिवार की आर्थिक स्थिति अत्यधिक सीमित है। ${reason} के चलते मेरे परिवार के लिए कॉलेज की पूरी फीस एक साथ वहन करना अत्यंत कठिन हो रहा है।

अतः आपसे विनम्र प्रार्थना है कि मेरी पारिवारिक स्थिति और अध्ययन के प्रति मेरी लगन को ध्यान में रखते हुए मुझे शुल्क में यथासंभव छूट (Fee Concession) प्रदान करने अथवा किश्तों में भुगतान की अनुमति देने की कृपा करें।

मैं आपको विश्वास दिलाता हूँ कि मैं अपने अध्ययन में निरंतर उत्कृष्ट प्रदर्शन करूँगा।

आपका आज्ञाकारी छात्र,
नाम: ${student}
${course}
संलग्नक: आय प्रमाण पत्र एवं पूर्व परीक्षा अंकतालिका`;
        break;
      }

      case 'job_application': {
        const applicant = getFieldValue('applicant_name') || '[आवेदक का नाम]';
        const contact = getFieldValue('phone_email') || '[फोन / ईमेल]';
        const role = getFieldValue('target_role') || '[पद का नाम]';
        const company = getFieldValue('company_name') || '[कंपनी का नाम]';
        const qual = getFieldValue('qualification') || '[शैक्षणिक योग्यता व अनुभव]';

        draft = `Date: ${today}

To,
The Hiring Manager / HR Department,
${company}

Subject: Application for the Position of ${role}

Respected Sir/Madam,

I am writing to express my strong interest in the ${role} opening at ${company}. 

My Qualifications & Profile:
${qual}

I am a diligent, quick-learning, and disciplined individual with proven dedication to organizational growth. Given my background and skills, I am confident that I can contribute effectively to your team's goals.

I have attached my detailed Biodata / Resume for your review. I would welcome the opportunity to discuss my application with you in an interview.

Thank you for your time and consideration.

Sincerely,
${applicant}
Contact: ${contact}`;
        break;
      }

      case 'resume_draft': {
        const name = getFieldValue('full_name') || 'नाम (Name)';
        const contact = getFieldValue('contact_info') || 'पता व संपर्क सूत्र';
        const edu = getFieldValue('education') || '10वीं / 12वीं / स्नातक';
        const skills = getFieldValue('skills') || 'कंप्यूटर, टाइपिंग, बातचीत कौशल';
        const exp = getFieldValue('experience') || 'फ्रेशर / 1 वर्ष का अनुभव';

        draft = `================================================
                    BIODATA / RESUME
================================================

1. व्यक्तिगत विवरण (PERSONAL DETAILS):
   पूरा नाम (Full Name)      : ${name}
   संपर्क (Contact & Email) : ${contact}
   भाषा ज्ञान (Languages)   : हिंदी, English

2. करियर उद्देश्य (CAREER OBJECTIVE):
   एक ऐसे प्रतिष्ठित संस्थान में कार्य करना जहाँ मैं अपनी मेहनत, ईमानदारी और कौशल से संस्थान की प्रगति में योगदान दे सकूँ और व्यक्तिगत विकास भी कर सकूँ।

3. शैक्षणिक योग्यता (EDUCATIONAL QUALIFICATIONS):
   ${edu}

4. तकनीकी व व्यावसायिक कौशल (KEY SKILLS):
   ${skills}

5. कार्य अनुभव (WORK EXPERIENCE):
   ${exp}

6. घोषणा (DECLARATION):
   मैं प्रमाणित करता/करती हूँ कि ऊपर दी गई समस्त जानकारी मेरे ज्ञान और विश्वास के अनुसार पूर्णतः सत्य है।

दिनांक: ${today}
स्थान : [आपका शहर]

हस्ताक्षर:
(${name})`;
        break;
      }

      case 'govt_office': {
        const name = getFieldValue('applicant_name') || '[आवेदक का नाम]';
        const father = getFieldValue('father_husband') || '[पिता/पति का नाम]';
        const address = getFieldValue('address') || '[स्थायी पता]';
        const officer = getFieldValue('officer_title') || 'उपजिलाधिकारी (SDM)';
        const purpose = getFieldValue('purpose') || 'प्रमाण पत्र निर्गत कराने बाबत';

        draft = `दिनांक: ${today}

सेवा में,
श्रीमान ${officer},
तहसील / ब्लॉक कार्यालय

विषय: ${purpose}

महोदय,

सविनय निवेदन है कि मैं प्रार्थी ${name}, आत्मज/पत्नी श्री ${father}, निवासी ${address} का स्थायी नागरिक हूँ।

प्रार्थी को पारिवारिक व शासकीय आवश्यकताओं के कारण उक्त कार्य (${purpose}) कराना नितांत आवश्यक है। प्रार्थी द्वारा इसके समर्थन में सभी वांछित अभिलेख (आधार कार्ड, निवास प्रमाण पत्र, शपथ पत्र आदि) इस आवेदन के साथ संलग्न किए जा रहे हैं।

अतः श्रीमान जी से विनम्र निवेदन है कि प्रार्थी के आवेदन पर सहानुभूतिपूर्वक विचार करते हुए नियमानुसार त्वरित कार्रवाई करने की कृपा करें।

संलग्नक:
1. आधार कार्ड की छायाप्रति
2. आवश्यक सहायक दस्तावेज

प्रार्थी:
नाम: ${name}
पता: ${address}
मो. नं.: [आपका फोन नंबर]`;
        break;
      }

      case 'whatsapp_formal': {
        const note = getFieldValue('specific_note') || 'जरूरी कारण';
        const name = getFieldValue('sender_name') || '[आपका नाम]';
        const type = getFieldValue('recipient_type');

        draft = `नमस्ते जी,

आशा है आप सकुशल होंगे। मैं ${name} बोल रहा/रही हूँ।

${type} के संबंध में आपसे एक विनम्र निवेदन करना था। ${note}।

असुविधा के लिए क्षमा चाहता हूँ। कृपया इसे स्वीकार करने की कृपा करें। किसी भी प्रश्न हेतु मैं कॉल पर उपलब्ध हूँ।

सधन्यवाद,
${name}`;
        break;
      }

      default:
        draft = 'कृपया फॉर्म भरकर पत्र तैयार करें।';
    }

    outputEl.value = draft;
  }

  render();
}
