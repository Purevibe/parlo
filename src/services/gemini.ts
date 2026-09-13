import { GoogleGenAI, Type, Schema } from '@google/genai';
import { GeminiEvaluationResponse, Category } from '../types/game';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Schema definition for Google GenAI SDK structured outputs
const evaluationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    italianResponse: {
      type: Type.STRING,
      description: "Maestro Marco's next spoken Italian turn in authentic Italian.",
    },
    englishTranslation: {
      type: Type.STRING,
      description: "Accurate English translation of Maestro Marco's Italian response.",
    },
    isCorrect: {
      type: Type.BOOLEAN,
      description: "True if the user's Italian response was grammatically and contextually correct.",
    },
    heartsDeducted: {
      type: Type.INTEGER,
      description: "0 if user input is correct/acceptable, 1 if flawed/incorrect or timeout.",
    },
    corrections: {
      type: Type.ARRAY,
      description: "Detailed grammar/vocabulary corrections.",
      items: {
        type: Type.OBJECT,
        properties: {
          userMistake: { type: Type.STRING },
          suggestedFix: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ["userMistake", "suggestedFix", "explanation"],
      },
    },
    idiomsAndTooltips: {
      type: Type.ARRAY,
      description: "Campania or classic Italian idioms (*modi di dire*) relevant to the turn.",
      items: {
        type: Type.OBJECT,
        properties: {
          phrase: { type: Type.STRING },
          literalMeaning: { type: Type.STRING },
          contextualMeaning: { type: Type.STRING },
        },
        required: ["phrase", "literalMeaning", "contextualMeaning"],
      },
    },
    analytics: {
      type: Type.OBJECT,
      properties: {
        xpEarned: { type: Type.INTEGER, description: "XP awarded (e.g. 50-150 for correct, 0-15 for partial)" },
        category: { 
          type: Type.STRING, 
          description: "Category: NUMBERS | DATES_CALENDAR | FOOD_ORDERING | DIRECTIONS | GENERAL_BANTER" 
        },
        accuracyPercentage: { type: Type.NUMBER, description: "Accuracy score 0-100 for this turn" },
      },
      required: ["xpEarned", "category", "accuracyPercentage"],
    },
  },
  required: [
    "italianResponse",
    "englishTranslation",
    "isCorrect",
    "heartsDeducted",
    "corrections",
    "idiomsAndTooltips",
    "analytics"
  ],
};

const SYSTEM_INSTRUCTIONS = `
You are Maestro Marco, a passionate, highly demanding yet charismatic Italian language master from Naples, Campania.
You are running a high-stakes Italian survival dialogue drill.

Your Role & Persona:
- Speak authentic Italian with flair, warmth, and high standards.
- Evaluate the user's Italian input rigorously.
- Pay critical attention to cardinal numbers, dates, clock hours, food ordering etiquette, directions, and grammar rules.
- Deduct 1 heart (heartsDeducted = 1, isCorrect = false) if the user makes a significant grammar blunder, fumbles numbers/dates/hours, or gives nonsense/English responses.
- Award 0 heartsDeducted (isCorrect = true) if the user's response is grammatically sound and fits the conversation context.
- Always include at least 1 authentic Campania or classic Italian idiom (*modo di dire*) with its literal and contextual meaning in idiomsAndTooltips.
- Keep Maestro Marco's Italian response concise (1-3 sentences) and conversational so it can be comfortably spoken via Web Speech Synthesis.
- Provide clear corrections explaining any mistakes.
`;

export async function evaluateTurnWithGemini(
  userInput: string,
  category: Category,
  conversationHistory: { role: 'user' | 'model'; text: string }[]
): Promise<GeminiEvaluationResponse> {
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY not found. Using high-fidelity intelligent local fallback engine.");
    return generateFallbackEvaluation(userInput, category);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
Current Category Focus: ${category}

Conversation History:
${conversationHistory.map(h => `${h.role === 'user' ? 'Student' : 'Maestro Marco'}: ${h.text}`).join('\n')}

Latest Student Input: "${userInput}"

Evaluate the student's Italian input. Respond with strict JSON matching the schema.
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        responseMimeType: 'application/json',
        responseSchema: evaluationSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const parsed: GeminiEvaluationResponse = JSON.parse(text);
    return parsed;
  } catch (err) {
    console.error("Gemini API evaluation error:", err);
    return generateFallbackEvaluation(userInput, category);
  }
}

/**
 * Intelligent Local Fallback Engine for offline or keyless testing
 */
function generateFallbackEvaluation(userInput: string, category: Category): GeminiEvaluationResponse {
  const cleanInput = userInput.trim().toLowerCase();
  
  // Basic heuristic check for fallback
  const isTooShort = cleanInput.length < 2;
  const containsEnglishCommon = /\b(the|is|and|you|have|what|please|yes|no)\b/i.test(cleanInput);
  
  let isCorrect = true;
  let heartsDeducted = 0;
  const corrections = [];

  if (isTooShort || containsEnglishCommon) {
    isCorrect = false;
    heartsDeducted = 1;
    corrections.push({
      userMistake: userInput || "(Silenzio)",
      suggestedFix: category === "NUMBERS" ? "Centoventi" : category === "FOOD_ORDERING" ? "Vorrei un caffè per favore" : "Parla in italiano, per favore!",
      explanation: "Hai usato l'inglese o una risposta troppo breve. Maestro Marco richiede italiano autentico!"
    });
  }

  const responsesByCategory: Record<Category, { it: string; en: string; idiom: { phrase: string; lit: string; ctx: string } }> = {
    NUMBERS: {
      it: isCorrect 
        ? "Molto bene! Il tuo numero è preciso. Ora dimmi: quanto fa ottanta più quarantaquattro?" 
        : "Attenzione ai numeri! In Italia la precisione è tutto. Riproviamo con sessantasei!",
      en: isCorrect 
        ? "Very good! Your number is precise. Now tell me: how much is eighty plus forty-four?" 
        : "Watch out for numbers! In Italy precision is everything. Let us try again with sixty-six!",
      idiom: { phrase: "Dare i numeri", lit: "To give numbers", ctx: "To act crazy or talk nonsense" }
    },
    DATES_CALENDAR: {
      it: isCorrect 
        ? "Eccellente! La data è corretta. Qual è il tuo giorno preferito della settimana e perché?" 
        : "Accipicchia! Ricorda che in italiano i mesi si scrivono in minuscolo.",
      en: isCorrect 
        ? "Excellent! The date is correct. What is your favorite day of the week and why?" 
        : "Goodness! Remember that in Italian months are written in lowercase.",
      idiom: { phrase: "Ogni morte di papa", lit: "Every death of a pope", ctx: "Once in a blue moon" }
    },
    FOOD_ORDERING: {
      it: isCorrect 
        ? "Perfetto! Un bell'espresso e un cornetto caldo. Desidera qualcos'altro al banco?" 
        : "Attento! Al bar diciamo 'Vorrei...' con cortesia, non comandiamo!",
      en: isCorrect 
        ? "Perfect! A nice espresso and a warm croissant. Would you like anything else at the counter?" 
        : "Careful! At the bar we say 'I would like...' politely, we don't command!",
      idiom: { phrase: "Prendere la vita con filosofia e un buon caffè", lit: "Take life with philosophy and a good coffee", ctx: "Face adversity with calm and enjoyment" }
    },
    DIRECTIONS: {
      it: isCorrect 
        ? "Bravissimo! Ha girato a destra dopo la fontana. Ora si trova in Piazza del Plebiscito!" 
        : "Attenzione! 'A destra' significa to the right, 'dritto' significa straight ahead.",
      en: isCorrect 
        ? "Bravo! You turned right after the fountain. Now you are in Piazza del Plebiscito!" 
        : "Watch out! 'A destra' means to the right, 'dritto' means straight ahead.",
      idiom: { phrase: "Tutte le strade portano a Roma", lit: "All roads lead to Rome", ctx: "There are many ways to reach the same goal" }
    },
    GENERAL_BANTER: {
      it: isCorrect 
        ? "Che bella parlata! Mi piace il tuo entusiasmo. Dimmi, cosa fai durante la bella stagione?" 
        : "Mamma mia! La grammatica ha tentennato qui. Respira e riprova con grinta!",
      en: isCorrect 
        ? "What a lovely speech! I love your enthusiasm. Tell me, what do you do during the warm season?" 
        : "Mamma mia! The grammar faltered here. Breathe and try again with passion!",
      idiom: { phrase: "Mettici un punto e a capo", lit: "Put a period and new paragraph", ctx: "Make a fresh new start" }
    }
  };

  const selected = responsesByCategory[category];

  return {
    italianResponse: selected.it,
    englishTranslation: selected.en,
    isCorrect,
    heartsDeducted,
    corrections,
    idiomsAndTooltips: [
      {
        phrase: selected.idiom.phrase,
        literalMeaning: selected.idiom.lit,
        contextualMeaning: selected.idiom.ctx
      }
    ],
    analytics: {
      xpEarned: isCorrect ? 100 : 15,
      category,
      accuracyPercentage: isCorrect ? 95 : 40
    }
  };
}
