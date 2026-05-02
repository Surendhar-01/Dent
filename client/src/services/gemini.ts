import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY || '';

const getClient = () => {
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Add it to your .env file.');
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

// ─── Dental Image Analysis ────────────────────────────────────────────────────
export async function analyzeDentalImage(base64Image: string): Promise<string> {
  if (!API_KEY) {
    return simulateImageAnalysis();
  }

  try {
    const client = getClient();
    const model = 'gemini-2.0-flash';

    // Strip the data URL prefix if present
    const imageData = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const mimeType = base64Image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

    const response = await client.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: imageData,
              },
            },
            {
              text: `You are a dental AI assistant. Analyze this dental image carefully and provide:
1. Detection: What dental conditions or infections are visible (e.g., cavities, gum disease, plaque, etc.)
2. Severity: Rate as Low, Medium, or High severity
3. Prevention Tips: 3-5 specific prevention or treatment recommendations
4. Action Required: What the patient should do next

Keep your response clear, concise, and patient-friendly. If the image is not a dental image, say so politely.`,
            },
          ],
        },
      ],
    });

    return response.text ?? 'Analysis complete. Please consult your dentist.';
  } catch (error) {
    console.error('Gemini AI error:', error);
    return simulateImageAnalysis();
  }
}

// ─── AI Dental Chat ───────────────────────────────────────────────────────────
export async function chatWithDentalAI(
  messages: Array<{ role: 'user' | 'model'; text: string }>
): Promise<string> {
  if (!API_KEY) {
    return simulateChatResponse(messages[messages.length - 1]?.text || '');
  }

  try {
    const client = getClient();
    const model = 'gemini-2.0-flash';

    const systemPrompt = `You are Alpha Dent's friendly AI dental assistant. 
You help patients with dental questions, oral hygiene advice, and appointment guidance.
Be warm, professional, and concise. Always recommend consulting a dentist for serious issues.
Respond in 2-4 sentences unless more detail is clearly needed.`;

    const contents = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const response = await client.models.generateContent({
      model,
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood! I am Alpha Dent AI, ready to help with your dental questions.' }] },
        ...contents,
      ],
    });

    return response.text ?? 'I apologize, I could not process your question. Please try again.';
  } catch (error) {
    console.error('Gemini chat error:', error);
    return simulateChatResponse(messages[messages.length - 1]?.text || '');
  }
}

// ─── Fallback Simulations (when no API key) ──────────────────────────────────
function simulateImageAnalysis(): string {
  return `Detection: Mild plaque buildup observed along the gum line, with early signs of gingivitis.

Severity: Low to Medium — No immediate emergency, but attention needed.

Prevention Tips:
• Brush twice daily with fluoride toothpaste using circular motions
• Floss daily, especially between tight contact points
• Use an antiseptic mouthwash to reduce bacterial load
• Reduce sugary and acidic food/drink intake
• Schedule a professional cleaning every 6 months

Action Required: Book a routine check-up within the next 2-4 weeks. Your dentist may recommend a scaling procedure to remove hardened plaque.

Note: This is a simulated analysis. Add your GEMINI_API_KEY in the .env file for real AI-powered scanning.`;
}

function simulateChatResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('pain') || lower.includes('hurt') || lower.includes('ache')) {
    return "Tooth pain can have several causes including cavities, cracked teeth, or gum disease. I'd recommend booking an appointment with your dentist soon. In the meantime, over-the-counter pain relief and avoiding very hot or cold foods can help. 🦷";
  }
  if (lower.includes('bleed') || lower.includes('gum')) {
    return "Bleeding gums are often a sign of gingivitis, the early stage of gum disease. Make sure you're brushing gently twice a day and flossing daily. If bleeding persists after a week of good hygiene, please see your dentist. 🩺";
  }
  if (lower.includes('brac') || lower.includes('aligner') || lower.includes('ortho')) {
    return "With braces or aligners, it's essential to clean around brackets carefully with an orthodontic brush. Avoid hard and sticky foods, and wear your aligners at least 22 hours a day for best results. Your orthodontist will guide you through each stage! 😊";
  }
  if (lower.includes('whitening') || lower.includes('white')) {
    return "Professional teeth whitening is the safest and most effective option. Over-the-counter strips can help for mild staining. Avoid tea, coffee, and tobacco to maintain results. Always consult your dentist before starting any whitening treatment. ✨";
  }
  return "That's a great dental question! I recommend maintaining a consistent oral hygiene routine — brush twice daily, floss once, and visit your dentist every 6 months. For specific concerns, a consultation with our dental team would give you the most accurate guidance. 😊";
}
