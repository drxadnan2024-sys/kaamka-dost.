# 🇮🇳 KaamKa Dost (कामका दोस्त)

> **"Har chhote kaam ka, ek smart dost."**  
> An everyday digital assistant for Indian users to solve phone problems, analyze screenshots, generate formal applications and letters, understand tricky bank messages, learn app tricks, and calculate daily utilities in their preferred Indian language.

---

## 🌟 Key Features Overview

### 1. 📸 AI Screenshot Helper (स्क्रीनशॉट सहायक)
- **Problem Solver**: Upload any screenshot (UPI payment pending, Play Store download stuck, WhatsApp storage full, SIM error).
- **Honest AI Integration**:
  - **Live AI Mode**: Secure server-side Google Gemini Vision endpoint (`/api/ai/analyze-screenshot`) with multimodal analysis and security checks.
  - **Safe Demo Mode**: If no API key is configured, provides transparent interactive 1-click test scenarios for common Indian phone problems (UPI pending, Play Store storage, WhatsApp download fail, Electricity scam SMS, Emergency calls only).
  - Never falsely claims unanalyzed images were processed by AI.
- **Actionable Steps**: Numbered step-by-step resolution checklist with urgency badges, plain Hindi/English explanations, and one-click copy.

### 2. ✍️ Application & Letter Maker (आवेदन व पत्र निर्माता)
- Generates 8 standard Indian applications and letters:
  1. **Office / Work Leave Application** (Casual leave, sick leave, urgent family reason)
  2. **School / College Leave Application** (Principal leave letter, doctor illness advice)
  3. **Civic Complaint Letter** (Nagar Nigam garbage/water leak, electricity department power cut)
  4. **Job Application & Cover Letter** (Sales, clerical, operator, accountant)
  5. **Resume / Biodata Draft** (Standard Indian bio-data format with education, skills, experience)
  6. **Fee Concession Request** (Application to Principal for financial fee waiver)
  7. **Government Office Request Letter** (Ration card name addition, caste/domicile certificate)
  8. **WhatsApp & Email Formal Drafts** (Polite rent delay message to landlord, salary advance to boss)
- **Live Editable Preview**: Direct in-browser draft editing.
- **Export Options**: Copy to clipboard, Download as `.txt`, and Print / Save as PDF with clean letterhead styling.

### 3. 🌐 Indian Language Assistant (13 Languages)
- Supports **13 Indian Languages**:
  1. Hindi (हिंदी)
  2. English (English)
  3. Urdu (اردو) - **Full dynamic Right-to-Left (RTL) layout & Nastaliq typography**
  4. Marathi (मराठी)
  5. Bengali (বাংলা)
  6. Tamil (தமிழ்)
  7. Telugu (తెలుగు)
  8. Gujarati (ગુજરાતી)
  9. Punjabi (ਪੰਜਾਬੀ)
  10. Kannada (ಕನ್ನಡ)
  11. Malayalam (മലയാളം)
  12. Odia (ଓଡ଼ିଆ)
  13. Assamese (অসমীয়া)
- **Multilingual Translator**: AI-powered live translation with offline fallback dictionary for common daily queries (banking, transport, medical, greetings).
- **Tricky SMS Explainer**: Paste bank debit alerts, KYC update links, or parcel delivery messages to get plain Hindi explanations, safety checks, and fraud warnings.
- **Polite Reply Generator**: Paste messages received from your boss, landlord, or relatives and get respectful replies (Polite refusal, asking for time, formal acceptance) in both Hindi and English.

### 4. 📱 Phone & App Guides Library
- Step-by-step categorized tutorials:
  - **WhatsApp**: Clear storage without losing family photos, Google Drive chat backup.
  - **Social Media**: Instagram privacy, filtering scam DMs.
  - **App Errors**: Fix "Download pending" in Google Play Store.
  - **Storage**: Safe phone cleaner, finding hidden large videos.
  - **Shortcuts**: 3-finger screenshot and long scrolling screenshots.
  - **Account Recovery**: Recover lost Google/Gmail passwords.
  - **Online Safety**: Spot fake APKs, electricity disconnection frauds, and golden rules of UPI.

### 5. 🧮 Daily Utility Tools
- **Exam Marks & Percentage Calculator**: Exam marks percentage with division grading, simple `X% of Y`, and Discount + GST final price calculator.
- **Exact Age Calculator**: Computes exact years, months, and days, total days/weeks lived, and birthday countdown with day of week.
- **Date Difference Calculator**: Calculate calendar and working days between any two dates.
- **Word & Character Counter**: Real-time character, word, sentence count, and reading time.
- **Smart QR Code Generator**: Generate clean high-res QR codes for UPI payments (`upi://pay?pa=...`), website URLs, or plain text, with PNG download.
- **Simple Expense Tracker**: Monthly domestic expense log with categories (Ration, Recharge, Bills, Health) and CSV export.
- **Bill & Document Reminder**: Track upcoming electricity, LPG cylinder, or vehicle insurance due dates with days-remaining badges.

### 6. 🤝 Community Help Board
- Q&A community for everyday phone and document questions.
- Categories, keyword search, upvotes, verified answers, and report options.
- **Transparent Storage Status**: Clear notice indicating local server/browser storage mode until Supabase cloud database is connected.

### 7. 👤 User Accounts & Privacy Controls
- **Guest-first**: 100% of features usable with zero registration or login required.
- **Optional Account Sync**: Supabase Auth ready.
- **Data Erasure**: 1-click "Erase All Local Data" button for complete user control.
- **Zero Sensitive Data**: No passwords, OTPs, or UPI PINs are ever requested or stored.

---

## 🚀 Quick Start Guide (Beginner Friendly)

### Method 1: Double-Click Launcher (Windows)
1. Navigate to the `kaamka-dost` folder.
2. Double-click `start.bat`.
3. The server starts and automatically opens `http://localhost:3000` in your default browser!

### Method 2: Command Line (Node.js / Antigravity)
1. Open PowerShell or Command Prompt in the `kaamka-dost` folder:
   ```powershell
   agy-node server/server.js
   # or with standard Node:
   node server/server.js
   ```
2. Open your browser at:
   ```
   http://localhost:3000
   ```

---

## 🧪 Running Automated Tests

Run the included automated verification test suite:
```powershell
agy-node tests/app.test.js
# or
node tests/app.test.js
```
The test suite checks:
- All 20 essential project files
- 13 Indian languages dictionary & RTL configuration
- 8 Application & Letter templates
- Phone guides content integrity
- Server API routes (`/api/health`, `/api/ai/status`, `/api/ai/analyze-screenshot`, `/api/community/posts`)
- 100% pass rate (34/34 tests)

---

## 🔑 Environment Variables Setup (`.env`)

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | Optional (default: `3000`) | Port for the HTTP server |
| `GEMINI_API_KEY` | Optional | Free Google Gemini API Key for live AI screenshot analysis and translation. Get it at [Google AI Studio](https://aistudio.google.com/app/apikey). If omitted, the app runs in safe Demo Mode! |
| `SUPABASE_URL` | Optional | Supabase Project URL for public cloud community posts sync. |
| `SUPABASE_ANON_KEY` | Optional | Supabase Anonymous Key for database sync. |

---

## 🌐 Free-Tier Deployment Instructions

### Deploy to Vercel (Recommended - 100% Free)
1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of KaamKa Dost"
   git remote add origin https://github.com/YOUR_USERNAME/kaamka-dost.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and log in.
3. Click **"Add New Project"** and select your `kaamka-dost` repository.
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your free Gemini key)*
5. Click **"Deploy"**. Vercel will deploy the site with serverless functions in under 60 seconds!

### Deploy to Netlify / GitHub Pages (Static Mode)
1. Drag and drop the `public/` directory into Netlify Drop.
2. The entire client app, calculators, letter generators, QR generator, and demo modes will run completely client-side for free!

---

## 📱 PWA & Android Installation (Play Store Ready)
- The app includes a valid `manifest.json` and `sw.js` (Service Worker).
- Users on Android Chrome can tap **"Install App"** in the browser menu to add KaamKa Dost directly to their home screen as a standalone app.
- For Google Play Store release: Use **Bubblewrap CLI** or **PWABuilder** (`https://www.pwabuilder.com`) to package the live HTTPS URL into an Android `.aab` file.

---

## 🛡️ Privacy & Security Commitments
- **No Private Data Collection**: Zero unnecessary tracking or profiling.
- **Never Asks for Banking Credentials**: Never asks for OTPs, ATM PINs, UPI PINs, or banking passwords.
- **File Validation**: Image uploads are validated client-side (max 5 MB) and server-side (max 8 MB) for type safety.
- **Rate Limiting**: Built-in sliding-window rate limiter prevents abuse of server endpoints.
