// api/ai/explain-sms.js - Vercel Serverless Function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      configured: false,
      demo: true,
      message: 'GEMINI_API_KEY not configured. Falling back to built-in rules.'
    });
  }

  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const prompt = `You are KaamKa Dost. An Indian user received this confusing SMS: "${message}".
Explain it in simple, clear Hindi and English.
Return JSON:
{
  "summary_hindi": "एक पंक्ति में सारांश",
  "meaning_hindi": "आसान भाषा में मतलब",
  "meaning_english": "Clear explanation in English",
  "money_status": "सुरक्षित (Safe)" | "कटौती हुई (Debited)" | "धोखाधड़ी का संदेह (Suspected Scam)",
  "action_required": "आपको क्या करना चाहिए (Next steps)",
  "warning": "चेतावनी (OTP / PIN warning if needed)"
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const apiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, response_mime_type: 'application/json' }
      })
    });

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ configured: true, error: true, message: await apiRes.text() });
    }

    const data = await apiRes.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({
      configured: true,
      demo: false,
      result: JSON.parse(textOutput)
    });
  } catch (err) {
    return res.status(500).json({ configured: true, error: true, message: err.message });
  }
}
