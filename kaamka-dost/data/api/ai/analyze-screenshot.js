// api/ai/analyze-screenshot.js - Vercel Serverless Function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      configured: false,
      demo: true,
      message: 'GEMINI_API_KEY not configured on server. Use interactive demo scenarios.'
    });
  }

  try {
    const { image, mimeType = 'image/jpeg', prompt = '' } = req.body || {};
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, '');
    const systemPrompt = `You are KaamKa Dost (कामका दोस्त), an everyday digital assistant for Indian users ("Har chhote kaam ka, ek smart dost").
Analyze this smartphone screenshot and the user's issue: "${prompt}".
Respond strictly in JSON format:
{
  "title": "Short problem summary in English & Hindi",
  "urgency": "low" | "medium" | "high" | "security_alert",
  "simple_explanation_hindi": "आसान हिंदी में बताएं कि क्या समस्या हुई है",
  "simple_explanation_english": "Clear 2-sentence explanation in plain English",
  "steps": [
    { "step": 1, "title": "Step title", "action": "Exact button to tap or action to take in simple words" }
  ],
  "safety_tip": "Important warning if any (e.g., Do NOT share OTP/UPI PIN, Do NOT click unknown links)",
  "is_money_safe": true | false | "not_applicable"
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const apiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { inline_data: { mime_type: mimeType, data: cleanBase64 } }
            ]
          }
        ],
        generationConfig: { temperature: 0.2, response_mime_type: 'application/json' }
      })
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return res.status(apiRes.status).json({ configured: true, error: true, message: errText });
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
