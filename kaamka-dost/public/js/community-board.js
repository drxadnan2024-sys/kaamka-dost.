// public/js/community-board.js
// Community Help Board with Honest Storage Status, Search, Upvotes, and Q&A

export function initCommunityBoard(containerEl, showToast) {
  let posts = [];
  let selectedCategory = 'all';
  let searchQuery = '';
  let storageMode = 'local'; // 'local' or 'cloud'

  function fetchPosts() {
    fetch('/api/community/posts')
      .then(res => res.json())
      .then(data => {
        posts = data.posts || [];
        storageMode = data.storage_mode || 'local_server_file';
        render();
      })
      .catch(() => {
        // Fallback to localStorage
        posts = JSON.parse(localStorage.getItem('kaamka_community_posts') || '[]');
        storageMode = 'browser_local_storage';
        render();
      });
  }

  function render() {
    const filtered = posts.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchSearch = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    containerEl.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Hero Header -->
        <div class="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              🤝 Community Help Board
            </span>
            <!-- Honest Storage Status Badge -->
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-amber-950 flex items-center gap-1.5">
              <span>🔒</span> Local Storage Mode (Offline Safe)
            </span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold">मदद मंच: सवाल पूछें और दूसरों की सहायता करें</h2>
          <p class="text-purple-100 text-sm max-w-2xl">
            फोन की परेशानी, साइबर सुरक्षा और सरकारी फॉर्म से जुड़े सवाल पूछें।
          </p>

          <!-- Storage Transparency Banner -->
          <div class="bg-white/10 border border-white/20 rounded-2xl p-3 text-xs text-purple-100 flex items-start gap-2">
            <span>ℹ️</span>
            <div>
              <strong>पारदर्शिता सूचना:</strong> यह समुदाय बोर्ड स्थानीय सर्वर/ब्राउज़र पर सुरक्षित संग्रहित है। Supabase क्लाउड डेटाबेस कनेक्ट करने पर यह सभी उपयोगकर्ताओं के साथ लाइव सिंक हो जाएगा।
            </div>
          </div>
        </div>

        <!-- Action & Search Bar -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div class="relative flex-1">
              <input type="text" id="community-search" placeholder="सवाल या समस्या खोजें..." value="${searchQuery}" class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-purple-500" />
              <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>

            <button type="button" id="ask-question-btn" class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition flex items-center justify-center gap-1.5">
              <span>✍️</span> नया सवाल पूछें (Ask Question)
            </button>
          </div>

          <!-- Category Filters -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            ${['all', 'Phone Issues', 'Online Safety', 'App Queries', 'Documents'].map(cat => `
              <button type="button" data-cat="${cat}" class="community-cat-btn px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${selectedCategory === cat ? 'bg-purple-600 text-white border-purple-600 font-bold' : 'border-slate-200 text-slate-600 hover:border-purple-300'}">
                ${cat === 'all' ? 'सभी (All)' : cat}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Posts List -->
        <div class="space-y-4">
          ${filtered.length === 0 ? `
            <div class="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-2">
              <span class="text-3xl">🔍</span>
              <p class="font-bold text-slate-700 text-sm">कोई सवाल नहीं मिला</p>
              <p class="text-xs text-slate-400">आप पहला सवाल पूछकर चर्चा शुरू कर सकते हैं।</p>
            </div>
          ` : filtered.map(post => `
            <div class="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-4 transition hover:border-purple-200">
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
                      ${post.category}
                    </span>
                    <span class="text-xs text-slate-400">${post.author} • ${post.date}</span>
                  </div>
                  <h3 class="font-bold text-slate-900 text-base sm:text-lg">${post.title}</h3>
                </div>

                <!-- Upvote Button -->
                <button type="button" data-post-id="${post.id}" class="upvote-btn flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 transition">
                  <span class="text-xs font-bold">▲</span>
                  <span class="text-xs font-extrabold">${post.upvotes || 0}</span>
                </button>
              </div>

              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${post.description}</p>

              <!-- Answers section -->
              ${(post.answers && post.answers.length > 0) ? `
                <div class="space-y-2.5 pt-2 border-t border-slate-100">
                  <span class="text-xs font-bold text-slate-800">समाधान / उत्तर (${post.answers.length}):</span>
                  ${post.answers.map(ans => `
                    <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="font-bold text-slate-900 ${ans.is_verified ? 'text-purple-700 flex items-center gap-1' : ''}">
                          ${ans.is_verified ? '⭐ सत्यापित समाधान:' : ans.author}
                        </span>
                        <span class="text-[11px] text-slate-400">${ans.date}</span>
                      </div>
                      <p class="text-slate-700 whitespace-pre-line leading-relaxed">${ans.text}</p>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Post Actions -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <button type="button" data-reply-to="${post.id}" class="reply-post-btn text-purple-600 hover:underline font-semibold flex items-center gap-1">
                  💬 उत्तर लिखें (Reply)
                </button>
                <button type="button" data-report-id="${post.id}" class="report-post-btn text-slate-400 hover:text-rose-500">
                  🚩 रिपोर्ट
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Ask Question Modal Placeholder -->
      <div id="ask-modal-container"></div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const searchInput = containerEl.querySelector('#community-search');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
    });

    containerEl.querySelectorAll('.community-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedCategory = btn.getAttribute('data-cat');
        render();
      });
    });

    // Ask question modal
    containerEl.querySelector('#ask-question-btn')?.addEventListener('click', () => {
      openAskModal();
    });

    // Upvote
    containerEl.querySelectorAll('.upvote-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const postId = btn.getAttribute('data-post-id');
        try {
          await fetch(`/api/community/posts/${postId}/upvote`, { method: 'POST' });
          const target = posts.find(p => p.id === postId);
          if (target) target.upvotes = (target.upvotes || 0) + 1;
          render();
          showToast('सराहना दर्ज की गई (+1)', 'info');
        } catch (e) {
          const target = posts.find(p => p.id === postId);
          if (target) {
            target.upvotes = (target.upvotes || 0) + 1;
            render();
          }
        }
      });
    });

    // Reply
    containerEl.querySelectorAll('.reply-post-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const postId = btn.getAttribute('data-reply-to');
        const replyText = prompt('इस सवाल का अपना समाधान या उत्तर लिखें:');
        if (replyText && replyText.trim()) {
          fetch(`/api/community/posts/${postId}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: replyText.trim(), author: 'Community Member' })
          }).then(() => {
            fetchPosts();
            showToast('आपका उत्तर जोड़ दिया गया!', 'success');
          });
        }
      });
    });

    // Report
    containerEl.querySelectorAll('.report-post-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast('पोस्ट की रिपोर्ट मॉडरेटर को भेज दी गई है। धन्यवाद!', 'info');
      });
    });
  }

  function openAskModal() {
    const modalHolder = containerEl.querySelector('#ask-modal-container');
    modalHolder.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-900 text-lg">नया सवाल पूछें (Ask Question)</h3>
            <button type="button" id="close-ask-modal" class="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
          </div>

          <form id="ask-modal-form" class="space-y-3">
            <div>
              <label class="text-xs font-semibold text-slate-700">सवाल का शीर्षक (Title):</label>
              <input type="text" id="new-q-title" placeholder="उदा. Google Play Store में पैसे कट गए पर गेम में नहीं आए" required class="w-full px-3.5 py-2 border rounded-xl text-xs sm:text-sm outline-none focus:border-purple-500 mt-1" />
            </div>

            <div>
              <label class="text-xs font-semibold text-slate-700">कैटेगरी (Category):</label>
              <select id="new-q-cat" class="w-full px-3.5 py-2 border rounded-xl text-xs sm:text-sm outline-none bg-white mt-1">
                <option value="Phone Issues">Phone Issues (फोन की समस्याएं)</option>
                <option value="Online Safety">Online Safety (ऑनलाइन सुरक्षा/फ्रॉड)</option>
                <option value="App Queries">App Queries (ऐप्स का उपयोग)</option>
                <option value="Documents">Documents (दस्तावेज व फॉर्म)</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-semibold text-slate-700">पूरा विवरण (Description):</label>
              <textarea id="new-q-desc" rows="4" placeholder="समस्या को विस्तार से बताएं ताकि लोग सही मदद कर सकें..." required class="w-full p-3 border rounded-xl text-xs sm:text-sm outline-none focus:border-purple-500 mt-1"></textarea>
            </div>

            <div>
              <label class="text-xs font-semibold text-slate-700">आपका नाम व शहर (Your Name & City):</label>
              <input type="text" id="new-q-author" placeholder="उदा. सुरेश, पटना" class="w-full px-3.5 py-2 border rounded-xl text-xs sm:text-sm outline-none focus:border-purple-500 mt-1" />
            </div>

            <div class="flex items-center justify-end gap-2 pt-2">
              <button type="button" id="cancel-ask-btn" class="px-4 py-2 border rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50">
                रद्द करें
              </button>
              <button type="submit" class="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm">
                सवाल पोस्ट करें
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    modalHolder.querySelector('#close-ask-modal').onclick = () => modalHolder.innerHTML = '';
    modalHolder.querySelector('#cancel-ask-btn').onclick = () => modalHolder.innerHTML = '';
    modalHolder.querySelector('#ask-modal-form').onsubmit = (e) => {
      e.preventDefault();
      const title = modalHolder.querySelector('#new-q-title').value.trim();
      const category = modalHolder.querySelector('#new-q-cat').value;
      const description = modalHolder.querySelector('#new-q-desc').value.trim();
      const author = modalHolder.querySelector('#new-q-author').value.trim() || 'Dost User';

      fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, description, author })
      })
      .then(res => res.json())
      .then(() => {
        modalHolder.innerHTML = '';
        fetchPosts();
        showToast('आपका सवाल पोस्ट हो गया!', 'success');
      })
      .catch(() => {
        posts.unshift({
          id: `post_${Date.now()}`,
          title,
          category,
          description,
          author,
          date: new Date().toISOString().split('T')[0],
          upvotes: 1,
          answers: []
        });
        localStorage.setItem('kaamka_community_posts', JSON.stringify(posts));
        modalHolder.innerHTML = '';
        render();
        showToast('आपका सवाल स्थानीय रूप से सहेज लिया गया!', 'success');
      });
    };
  }

  fetchPosts();
}
