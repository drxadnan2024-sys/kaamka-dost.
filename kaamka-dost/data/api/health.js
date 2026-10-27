// api/health.js - Vercel Serverless Function
export default function handler(req, res) {
  const isAiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10);
  res.status(200).json({
    status: 'ok',
    app: 'KaamKa Dost',
    version: '1.0.0',
    platform: 'Vercel Serverless',
    ai: {
      configured: isAiConfigured,
      provider: 'Google Gemini',
      mode: isAiConfigured ? 'live' : 'demo'
    }
  });
}
