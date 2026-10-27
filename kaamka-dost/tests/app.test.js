// tests/app.test.js
// Automated verification test suite for KaamKa Dost

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log(`\n========================================`);
  console.log(`  KAAMKA DOST - AUTOMATED TEST SUITE`);
  console.log(`========================================\n`);

  // --- TEST GROUP 1: FILE SYSTEM INTEGRITY ---
  console.log(`[1] Checking Essential Project Files:`);
  const requiredFiles = [
    'package.json',
    '.env.example',
    '.gitignore',
    'vercel.json',
    'server/server.js',
    'server/ai-provider.js',
    'public/index.html',
    'public/manifest.json',
    'public/sw.js',
    'public/favicon.svg',
    'public/css/styles.css',
    'public/js/translations.js',
    'public/js/guides-data.js',
    'public/js/screenshot-helper.js',
    'public/js/letter-maker.js',
    'public/js/language-assistant.js',
    'public/js/utility-tools.js',
    'public/js/community-board.js',
    'public/js/user-profile.js',
    'public/js/app.js'
  ];

  for (const relPath of requiredFiles) {
    const fullPath = path.join(ROOT_DIR, relPath);
    assert(fs.existsSync(fullPath), `File exists: ${relPath}`);
  }

  // --- TEST GROUP 2: MULTILINGUAL CONFIGURATION ---
  console.log(`\n[2] Checking 13 Indian Languages Configuration:`);
  const { SUPPORTED_LANGUAGES, TRANSLATIONS } = await import('../public/js/translations.js');
  assert(SUPPORTED_LANGUAGES.length === 13, `Configured exactly 13 Indian languages (Found: ${SUPPORTED_LANGUAGES.length})`);
  
  const urdu = SUPPORTED_LANGUAGES.find(l => l.code === 'ur');
  assert(urdu && urdu.isRtl === true, `Urdu is configured with RTL (Right-to-Left) layout`);

  const expectedCodes = ['hi', 'en', 'ur', 'mr', 'bn', 'ta', 'te', 'gu', 'pa', 'kn', 'ml', 'or', 'as'];
  const allCodesPresent = expectedCodes.every(code => SUPPORTED_LANGUAGES.some(l => l.code === code));
  assert(allCodesPresent, `All 13 required language codes are present: ${expectedCodes.join(', ')}`);

  // --- TEST GROUP 3: LETTER MAKER DEFINITIONS ---
  console.log(`\n[3] Checking Application & Letter Maker Types:`);
  const { LETTER_TYPES } = await import('../public/js/letter-maker.js');
  assert(LETTER_TYPES.length >= 8, `Defined at least 8 Indian letter types (Found: ${LETTER_TYPES.length})`);

  const leaveLetter = LETTER_TYPES.find(l => l.id === 'leave_office');
  assert(leaveLetter && leaveLetter.fields.length >= 5, `Office leave letter contains structured input fields`);

  const civicComplaint = LETTER_TYPES.find(l => l.id === 'complaint_civic');
  assert(civicComplaint !== undefined, `Civic & electricity complaint generator is available`);

  // --- TEST GROUP 4: PHONE GUIDES REPOSITORY ---
  console.log(`\n[4] Checking Phone & App Guides Library:`);
  const { PHONE_GUIDES } = await import('../public/js/guides-data.js');
  assert(PHONE_GUIDES.length >= 8, `Includes rich library of phone guides (Found: ${PHONE_GUIDES.length})`);

  const scamGuide = PHONE_GUIDES.find(g => g.category === 'Online Safety');
  assert(scamGuide && scamGuide.steps.length > 0, `Cyber safety and fraud prevention guide is present`);

  // --- TEST GROUP 5: SERVER API & HEALTH INTEGRATION ---
  console.log(`\n[5] Testing Server Endpoints & AI Fallback:`);
  
  // Set test port
  process.env.PORT = '3899';
  const serverModule = await import('../server/server.js');
  const server = serverModule.default;

  // Wait a moment for server to bind
  await new Promise(r => setTimeout(r, 600));

  function makeRequest(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 3899,
        path,
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {}
      };
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.status, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.status, data });
          }
        });
      });
      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  try {
    // Health check
    const health = await makeRequest('/api/health');
    assert(health.data.status === 'ok', `GET /api/health returned status ok`);
    assert(health.data.app === 'KaamKa Dost', `App name is 'KaamKa Dost'`);

    // AI Status
    const aiStatus = await makeRequest('/api/ai/status');
    assert(aiStatus.data.mode === 'demo' || aiStatus.data.mode === 'live', `GET /api/ai/status reports honest mode: ${aiStatus.data.mode}`);

    // AI Screenshot fallback (when no key is set)
    const screenshotRes = await makeRequest('/api/ai/analyze-screenshot', 'POST', {
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      prompt: 'Test prompt'
    });
    assert(screenshotRes.data.configured === false || screenshotRes.data.configured === true, `Screenshot endpoint handles requests gracefully without crashing`);

    // Community posts
    const communityRes = await makeRequest('/api/community/posts');
    assert(Array.isArray(communityRes.data.posts), `GET /api/community/posts returns posts array`);
    assert(communityRes.data.posts.length > 0, `Community board includes pre-populated seed posts`);

  } catch (err) {
    assert(false, `Server HTTP request failed: ${err.message}`);
  } finally {
    // Graceful close of test server
    server.close();
  }

  // --- FINAL RESULTS ---
  console.log(`\n========================================`);
  console.log(`  TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log(`========================================\n`);

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});
