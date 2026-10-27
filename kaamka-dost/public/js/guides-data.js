// public/js/guides-data.js
// Comprehensive, beginner-friendly Phone & App Guides for Indian users

export const PHONE_GUIDES = [
  {
    id: "g_wa_storage",
    title: "How to Clear WhatsApp Storage Without Losing Family Photos",
    title_hindi: "व्हाट्सएप स्टोरेज कैसे खाली करें बिना जरूरी फोटो डिलीट किए",
    category: "WhatsApp",
    readTime: "2 min",
    lastUpdated: "October 2026",
    difficulty: "Easy",
    summary: "WhatsApp often fills up 15-30 GB of internal storage with repeated forward videos and good-morning greetings. Follow these steps to clean only the junk.",
    steps: [
      "Open WhatsApp and tap the 3 dots (⋮) in the top-right corner.",
      "Go to Settings > Storage and Data > Manage Storage.",
      "At the very top, tap 'Larger than 5 MB'. Review these heavy videos and delete unnecessary clips.",
      "Next, tap 'Forwarded many times'. These are viral forwards that take up space without any personal value. Tap 'Select all' and delete.",
      "Notice your phone storage immediately frees up 5 to 10 GB!"
    ],
    proTip: "Turn off auto-download in Settings > Storage and Data > Media auto-download. Uncheck 'Videos' when using mobile data."
  },
  {
    id: "g_wa_backup",
    title: "How to Backup WhatsApp Chats to Google Drive",
    title_hindi: "व्हाट्सएप चैट का गूगल ड्राइव बैकअप कैसे लें",
    category: "WhatsApp",
    readTime: "3 min",
    lastUpdated: "October 2026",
    difficulty: "Easy",
    summary: "Never lose your memories or business chats when switching or losing your phone.",
    steps: [
      "In WhatsApp, tap 3 dots (⋮) > Settings > Chats.",
      "Scroll down and tap 'Chat backup'.",
      "Tap 'Google Account' and select your primary Gmail ID.",
      "Under 'Back up to Google Drive', select 'Daily' or 'Weekly'.",
      "Tap the green 'Back Up' button now to create your first full backup over WiFi or Mobile Data."
    ],
    proTip: "Enable 'End-to-end encrypted backup' with a 64-digit key or password if you want complete privacy from Google."
  },
  {
    id: "g_insta_privacy",
    title: "How to Make Your Instagram Account Private & Safe",
    title_hindi: "इंस्टाग्राम अकाउंट को प्राइवेट और सुरक्षित कैसे बनाएं",
    category: "Social Media",
    readTime: "2 min",
    lastUpdated: "October 2026",
    difficulty: "Easy",
    summary: "Protect your photos, reels, and stories from unknown strangers and stalkers.",
    steps: [
      "Open Instagram and tap your profile picture in the bottom-right corner.",
      "Tap the 3 lines (☰) menu in top-right > 'Settings and privacy'.",
      "Scroll down to 'Who can see your content' and tap 'Account privacy'.",
      "Toggle on 'Private account' and confirm by tapping 'Switch to private'.",
      "Now, only people you manually approve can follow you and see your posts."
    ],
    proTip: "Also turn on 'Hidden Words' under How others can interact with you to automatically filter abusive comments and scam DMs."
  },
  {
    id: "g_play_download_pending",
    title: "How to Fix 'Download Pending' Error in Google Play Store",
    title_hindi: "प्ले स्टोर पर 'Download Pending' समस्या कैसे ठीक करें",
    category: "App Errors",
    readTime: "3 min",
    lastUpdated: "October 2026",
    difficulty: "Medium",
    summary: "When an app won't download or update and stays stuck saying 'Pending'.",
    steps: [
      "Check if another app is already updating: Open Play Store > Tap Profile icon > Manage apps & device > Overview.",
      "If stuck, open phone Settings > Apps (or App Management).",
      "Find and tap 'Google Play Store'.",
      "Tap 'Storage' > Tap 'Clear Cache' first. If still stuck, tap 'Clear Data' (your apps will NOT be deleted).",
      "Restart your phone and re-open Play Store. The download will start smoothly."
    ],
    proTip: "Ensure date and time are set to 'Automatic' in phone settings; incorrect time blocks Play Store downloads."
  },
  {
    id: "g_fake_apk_safety",
    title: "How to Spot Fake APKs, Loan Apps & Electricity Bill Scams",
    title_hindi: "फर्जी ऐप्स, लोन ऐप्स और बिजली बिल फ्रॉड से कैसे बचें",
    category: "Online Safety",
    readTime: "4 min",
    lastUpdated: "October 2026",
    difficulty: "Crucial",
    summary: "Cyber criminals in India frequently send WhatsApp messages with malicious .APK files pretending to be PM Yojana, Wedding Cards, or Electricity alerts.",
    steps: [
      "RULE 1: Never install any file ending in '.apk' received over WhatsApp, Telegram, or SMS. Genuine companies never send apps via WhatsApp chat.",
      "RULE 2: Electricity boards (like UPPCL, Tata Power, BESCOM) never send messages from 10-digit mobile numbers (e.g. 98xxxxxx). Official alerts come from sender IDs with alphabets.",
      "RULE 3: If an app asks for 'Accessibility Service' or 'SMS permission', immediately cancel! This allows hackers to read your bank OTPs without your knowledge.",
      "RULE 4: If you already clicked an APK, turn on Airplane Mode immediately, uninstall the app from Settings > Apps, and contact your bank to freeze UPI."
    ],
    proTip: "Government cyber crime helpline is 1930. Report online fraud within 2 hours at cybercrime.gov.in for immediate bank account freezing."
  },
  {
    id: "g_storage_full_clean",
    title: "Phone Says 'Storage Full'? How to Clean Safely",
    title_hindi: "फोन में 'Storage Full' आ रहा है? सुरक्षित सफाई कैसे करें",
    category: "Storage",
    readTime: "3 min",
    lastUpdated: "October 2026",
    difficulty: "Easy",
    summary: "Free up 5-15 GB without deleting your important photos or uninstalling favorite apps.",
    steps: [
      "Install Google Files app (safe and official from Google).",
      "Open 'Files by Google' and tap the 'Clean' tab at bottom-left.",
      "Tap 'Confirm and free up' under Junk files (temporary cache files).",
      "Scroll down to 'Large files' and delete long screen recordings or downloaded movies you already watched.",
      "Check Google Chrome Downloads: Open Chrome > 3 dots > Downloads > Delete old PDF receipts, timetables, and documents."
    ],
    proTip: "Never install shady 3rd-party 'Ram Booster' or 'Super Cleaner' apps; they show ads and drain battery."
  },
  {
    id: "g_three_finger_screenshot",
    title: "How to Take 3-Finger & Scrolling Long Screenshots",
    title_hindi: "3 उंगलियों से और लंबा (Scrolling) स्क्रीनशॉट कैसे लें",
    category: "Shortcuts",
    readTime: "2 min",
    lastUpdated: "October 2026",
    difficulty: "Easy",
    summary: "Capture entire WhatsApp chats or shopping pages in a single tall screenshot image.",
    steps: [
      "Swipe down on your screen with 3 fingers together. The phone captures the screen instantly.",
      "If 3-finger swipe doesn't work, enable it in Settings > Additional Settings / Gestures > Screenshot > 3-finger swipe down.",
      "To take a LONG screenshot (scrolling): Right after taking the screenshot, tap the 'Scroll' or 'Capture More' button that appears at the bottom.",
      "Scroll down as far as you need, then tap 'Done' or 'Save'."
    ],
    proTip: "Standard physical shortcut on almost all Android phones: Press Volume Down + Power button simultaneously for 1 second."
  },
  {
    id: "g_recover_gmail",
    title: "How to Recover Forgotten Google / Gmail Password",
    title_hindi: "भूला हुआ गूगल/जीमेल पासवर्ड कैसे वापस पाएं",
    category: "Account Recovery",
    readTime: "3 min",
    lastUpdated: "October 2026",
    difficulty: "Medium",
    summary: "Recover your primary phone account when you don't remember the password.",
    steps: [
      "Open your browser and visit: accounts.google.com/signin/recovery",
      "Enter your email address or the mobile number linked to the account.",
      "When asked for the password, tap 'Try another way'.",
      "Google will send a 6-digit verification code to your registered phone number or recovery email.",
      "Enter the code and set a strong, new password with letters, numbers, and symbols."
    ],
    proTip: "Always keep your phone number updated in your Google account so you never get permanently locked out."
  },
  {
    id: "g_upi_safe_rules",
    title: "Golden Rules of UPI: Never Lose Money to Scammers",
    title_hindi: "UPI इस्तेमाल करने के 5 जरूरी नियम - कभी फ्रॉड नहीं होगा",
    category: "Online Safety",
    readTime: "2 min",
    lastUpdated: "October 2026",
    difficulty: "Crucial",
    summary: "Learn how UPI works so you never enter your PIN for receiving money.",
    steps: [
      "GOLDEN RULE: You NEVER need to enter your UPI PIN to RECEIVE money. Entering UPI PIN always DEDUCTS money from your account.",
      "If someone on OLX or Facebook says 'I sent you a QR code, scan it and enter PIN to receive ₹5000', IT IS A 100% SCAM.",
      "Never click links sent via SMS claiming your KYC is expiring or rewards are waiting.",
      "Do not install screen sharing apps (AnyDesk, TeamViewer, RustDesk) if someone on call instructs you to.",
      "Set a lower daily UPI transaction limit in your banking app for extra safety."
    ],
    proTip: "If money was accidentally sent or scammed, call 1930 immediately within the golden hour to freeze the beneficiary account."
  }
];
