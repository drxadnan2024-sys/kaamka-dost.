// api/ai/status.js - Vercel Serverless Function
export default function handler(req, res) {
  const isAiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10);
  res.status(200).json({
    configured: isAiConfigured,
    provider: 'Google Gemini',
    model: 'gemini-1.5-flash',
    mode: isAiConfigured ? 'live' : 'demo'
  });
}
