// api/ai/translate.js - Vercel Serverless Function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      configured: false,
      demo: true,
      message: 'GEMINI_API_KEY not configured. Falling back to built-in translations.'
    });
  }

  try {
    const { text, sourceLang = 'Hindi', targetLang = 'English' } = req.body || {};
    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    const prompt = `Translate naturally for Indian users. Source: ${sourceLang}, Target: ${targetLang}. Text: "${text}".
Return JSON:
{
  "translated_text": "...",
  "polite_variant": "...",
  "notes": "..."
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
