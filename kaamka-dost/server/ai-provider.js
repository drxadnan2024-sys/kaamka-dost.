// server/ai-provider.js
// Secure server-side AI integration for KaamKa Dost
// Connects to Google Gemini API when GEMINI_API_KEY is configured.
// Provides honest, graceful demo fallbacks when unconfigured.

export class AIProvider {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.model = 'gemini-1.5-flash';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  getStatus() {
    return {
      configured: this.isConfigured(),
      provider: 'Google Gemini (Server-side)',
      model: this.model,
      mode: this.isConfigured() ? 'live' : 'demo'
    };
  }

  /**
   * Analyze screenshot with problem description
   */
  async analyzeScreenshot(base64Data, mimeType = 'image/jpeg', userPrompt = '') {
    if (!this.isConfigured()) {
      return {
        configured: false,
        demo: true,
        message: 'No Gemini API key configured. Switch to interactive demo scenarios below to see full capabilities.'
      };
    }

    try {
      const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const systemPrompt = `You are 'KaamKa Dost' (कामका दोस्त), an everyday digital assistant for Indian users with the tagline 'Har chhote kaam ka, ek smart dost'.
Analyze this smartphone screenshot and the user's issue: "${userPrompt}".
Provide a beginner-friendly, simple, step-by-step resolution designed for everyday Indian phone users.
Always respond strictly in JSON matching this format:
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

      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: cleanBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            response_mime_type: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', errorText);
        return {
          configured: true,
          error: true,
          message: `AI provider error (${response.status}). Please verify API key.`
        };
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(textOutput);

      return {
        configured: true,
        demo: false,
        result: parsed
      };
    } catch (err) {
      console.error('AI Analysis Exception:', err);
      return {
        configured: true,
        error: true,
        message: 'Failed to process image with AI: ' + err.message
      };
    }
  }

  /**
   * Translate text between Indian languages
   */
  async translate(text, sourceLang, targetLang) {
    if (!this.isConfigured()) {
      return {
        configured: false,
        demo: true,
        message: 'AI API not configured on server. Showing built-in smart phrase dictionary.'
      };
    }

    try {
      const prompt = `You are KaamKa Dost translation assistant.
Translate the following text accurately, keeping natural conversational tone in Indian context.
Source language: ${sourceLang}
Target language: ${targetLang}
Text:
${text}

Respond strictly in JSON format:
{
  "translated_text": "Translated result here",
  "pronunciation": "Pronunciation in Roman script if applicable",
  "polite_variant": "A slightly more polite variation of the same message",
  "notes": "Any cultural or formal context note"
}`;

      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, response_mime_type: 'application/json' }
        })
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return {
        configured: true,
        demo: false,
        result: JSON.parse(textOutput)
      };
    } catch (err) {
      return { configured: true, error: true, message: err.message };
    }
  }

  /**
   * Explain confusing SMS / Legal / Bank alerts
   */
  async explainSMS(messageText) {
    if (!this.isConfigured()) {
      return { configured: false, demo: true };
    }

    try {
      const prompt = `You are KaamKa Dost. An Indian user received this confusing SMS or message:
"${messageText}"

Explain it in simple, reassuring Hindi and English.
Respond strictly in JSON format:
{
  "summary_hindi": "एक पंक्ति में सारांश (हिंदी)",
  "meaning_hindi": "विस्तार से समझाइए कि इसका क्या अर्थ है",
  "meaning_english": "Clear explanation in plain English",
  "money_status": "सुरक्षित (Safe)" | "कटौती हुई (Debited)" | "धोखाधड़ी का संदेह (Suspected Scam)",
  "action_required": "उपयोगकर्ता को अब क्या करना चाहिए (Step-by-step next steps)",
  "warning": "क्या कोई खतरा है? (Never share OTP / PIN warning)"
}`;

      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, response_mime_type: 'application/json' }
        })
      });

      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return {
        configured: true,
        demo: false,
        result: JSON.parse(textOutput)
      };
    } catch (err) {
      return { configured: true, error: true, message: err.message };
    }
  }
}
