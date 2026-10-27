// server/server.js
// Production-ready, zero-dependency Node.js HTTP server for KaamKa Dost
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AIProvider } from './ai-provider.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');
const DATA_DIR = path.resolve(ROOT_DIR, 'data');

// Mini .env loader
try {
  const envPath = path.resolve(ROOT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {
  console.warn('Note: .env reading skipped or not found.');
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const aiProvider = new AIProvider();

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const COMMUNITY_FILE = path.join(DATA_DIR, 'community.json');
const INITIAL_COMMUNITY_POSTS = [
  {
    id: "post_1",
    title: "PhonePe payment successful but merchant says not received - what to do?",
    title_hindi: "PhonePe में पैसे कट गए पर दुकानदार को नहीं मिले - क्या करें?",
    category: "Phone Issues",
    author: "Ramesh Sharma, Jaipur",
    date: "2026-10-25",
    description: "Paid ₹350 at grocery shop. Money deducted from SBI account, green tick appeared on PhonePe, but merchant soundbox did not ring.",
    upvotes: 42,
    answers: [
      {
        id: "ans_1",
        author: "KaamKa Dost Assistant",
        is_verified: true,
        date: "2026-10-25",
        text: "1. Take a screenshot of the green tick page showing the 12-digit UTR number.\n2. In 95% of cases, the merchant's soundbox was on mute or delayed by 2 minutes. Ask the merchant to check their merchant app history.\n3. Do NOT pay cash immediately. If merchant forces, show the UTR number. If money doesn't settle within 24-48 hours, RBI rules mandate automatic reversal to your bank."
      }
    ],
    reports: 0
  },
  {
    id: "post_2",
    title: "Received SMS: 'Electricity will be disconnected at 9:30 PM due to unpaid bill'",
    title_hindi: "बिजली कटने का SMS आया है - क्या यह फ्रॉड है?",
    category: "Online Safety",
    author: "Pooja Verma, Lucknow",
    date: "2026-10-26",
    description: "Got an SMS with a personal 10-digit mobile number asking to call urgently or click a link to update electricity bill. My bill was already paid on Bijli app.",
    upvotes: 89,
    answers: [
      {
        id: "ans_2",
        author: "Cyber Safety Guide",
        is_verified: true,
        date: "2026-10-26",
        text: "🚨 100% FRAUD / SCAM! Electricity boards never send SMS from personal 10-digit mobile numbers or WhatsApp. They only send from official alphanumeric sender IDs (like UPPCL, DHBVN, BESCOM). Never call that number or install any app (AnyDesk/TeamViewer). Block the number immediately."
      }
    ],
    reports: 0
  },
  {
    id: "post_3",
    title: "How to clean WhatsApp storage when phone says 98% full?",
    title_hindi: "WhatsApp स्टोरेज कैसे खाली करें बिना फोटो डिलीट किए?",
    category: "App Queries",
    author: "Deepak Patel, Ahmedabad",
    date: "2026-10-27",
    description: "My Samsung phone is lagging terribly. In Settings > Storage, WhatsApp is taking 24 GB.",
    upvotes: 35,
    answers: [
      {
        id: "ans_3",
        author: "Tech Dost",
        is_verified: true,
        date: "2026-10-27",
        text: "Open WhatsApp > Settings > Storage and Data > Manage Storage. Here you will see 'Files larger than 5 MB' and 'Forwarded many times'. Delete those forward videos first! They take 80% of space and you will not lose personal family photos."
      }
    ],
    reports: 0
  }
];

if (!fs.existsSync(COMMUNITY_FILE)) {
  fs.writeFileSync(COMMUNITY_FILE, JSON.stringify(INITIAL_COMMUNITY_POSTS, null, 2), 'utf8');
}

// In-memory rate limiting map
const ipRateLimits = new Map();
function checkRateLimit(ip, limit = 30, windowMs = 60000) {
  const now = Date.now();
  const entry = ipRateLimits.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + windowMs;
  } else {
    entry.count += 1;
  }
  ipRateLimits.set(ip, entry);
  return entry.count <= limit;
}

// MIME types table
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) { // 10 MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const clientIp = req.socket.remoteAddress || '127.0.0.1';

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // --- API ROUTES ---

  // Health check
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJSON(res, 200, {
      status: 'ok',
      app: 'KaamKa Dost',
      version: '1.0.0',
      tagline: 'Har chhote kaam ka, ek smart dost.',
      time: new Date().toISOString(),
      ai: aiProvider.getStatus(),
      storage: 'Local + Supabase ready'
    });
  }

  // AI Status
  if (pathname === '/api/ai/status' && req.method === 'GET') {
    return sendJSON(res, 200, aiProvider.getStatus());
  }

  // AI Screenshot Analysis
  if (pathname === '/api/ai/analyze-screenshot' && req.method === 'POST') {
    if (!checkRateLimit(clientIp, 20, 60000)) {
      return sendJSON(res, 429, { error: 'Rate limit reached. Please wait a minute.' });
    }
    try {
      const body = await parseBody(req);
      const { image, mimeType, prompt } = body;
      if (!image) {
        return sendJSON(res, 400, { error: 'Image data is required' });
      }
      const result = await aiProvider.analyzeScreenshot(image, mimeType || 'image/jpeg', prompt || '');
      return sendJSON(res, 200, result);
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // AI Translation
  if (pathname === '/api/ai/translate' && req.method === 'POST') {
    if (!checkRateLimit(clientIp, 30, 60000)) {
      return sendJSON(res, 429, { error: 'Rate limit reached. Please wait a minute.' });
    }
    try {
      const { text, sourceLang, targetLang } = await parseBody(req);
      if (!text) {
        return sendJSON(res, 400, { error: 'Text is required for translation' });
      }
      const result = await aiProvider.translate(text, sourceLang || 'Hindi', targetLang || 'English');
      return sendJSON(res, 200, result);
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // AI Explain SMS / Notice
  if (pathname === '/api/ai/explain-sms' && req.method === 'POST') {
    if (!checkRateLimit(clientIp, 30, 60000)) {
      return sendJSON(res, 429, { error: 'Rate limit reached. Please wait a minute.' });
    }
    try {
      const { message } = await parseBody(req);
      if (!message) {
        return sendJSON(res, 400, { error: 'Message content is required' });
      }
      const result = await aiProvider.explainSMS(message);
      return sendJSON(res, 200, result);
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // Community Posts - GET
  if (pathname === '/api/community/posts' && req.method === 'GET') {
    try {
      const posts = JSON.parse(fs.readFileSync(COMMUNITY_FILE, 'utf8'));
      return sendJSON(res, 200, { posts, storage_mode: 'local_server_file', synced_cloud: false });
    } catch (err) {
      return sendJSON(res, 200, { posts: INITIAL_COMMUNITY_POSTS, storage_mode: 'memory_fallback' });
    }
  }

  // Community Posts - POST
  if (pathname === '/api/community/posts' && req.method === 'POST') {
    try {
      const { title, category, description, author } = await parseBody(req);
      if (!title || !description) {
        return sendJSON(res, 400, { error: 'Title and description are required' });
      }
      let posts = [];
      try {
        posts = JSON.parse(fs.readFileSync(COMMUNITY_FILE, 'utf8'));
      } catch (e) {
        posts = [...INITIAL_COMMUNITY_POSTS];
      }
      const newPost = {
        id: `post_${Date.now()}`,
        title: title.slice(0, 150),
        category: category || 'General Help',
        author: (author || 'Community Member').slice(0, 50),
        date: new Date().toISOString().split('T')[0],
        description: description.slice(0, 1000),
        upvotes: 1,
        answers: [],
        reports: 0
      };
      posts.unshift(newPost);
      fs.writeFileSync(COMMUNITY_FILE, JSON.stringify(posts, null, 2), 'utf8');
      return sendJSON(res, 201, { success: true, post: newPost });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // Community Post Upvote / Answer
  if (pathname.startsWith('/api/community/posts/') && req.method === 'POST') {
    const parts = pathname.split('/');
    const postId = parts[4];
    const action = parts[5]; // 'upvote' | 'answer' | 'report'

    try {
      let posts = JSON.parse(fs.readFileSync(COMMUNITY_FILE, 'utf8'));
      const post = posts.find(p => p.id === postId);
      if (!post) {
        return sendJSON(res, 404, { error: 'Post not found' });
      }

      if (action === 'upvote') {
        post.upvotes = (post.upvotes || 0) + 1;
      } else if (action === 'report') {
        post.reports = (post.reports || 0) + 1;
      } else if (action === 'answer') {
        const { text, author } = await parseBody(req);
        if (!text) return sendJSON(res, 400, { error: 'Answer text is required' });
        post.answers = post.answers || [];
        post.answers.push({
          id: `ans_${Date.now()}`,
          author: author || 'Helpful Dost',
          is_verified: false,
          date: new Date().toISOString().split('T')[0],
          text: text.slice(0, 1500)
        });
      }

      fs.writeFileSync(COMMUNITY_FILE, JSON.stringify(posts, null, 2), 'utf8');
      return sendJSON(res, 200, { success: true, post });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // --- STATIC FILES SERVING ---
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  // Security check: ensure within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA client-side routing
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  KaamKa Dost - "Har chhote kaam ka, ek smart dost"`);
  console.log(`  Server running at: http://localhost:${PORT}`);
  console.log(`  AI Status: ${aiProvider.isConfigured() ? 'LIVE (Gemini API Connected)' : 'DEMO MODE (Safe & Offline Ready)'}`);
  console.log(`====================================================`);
});

export default server;
