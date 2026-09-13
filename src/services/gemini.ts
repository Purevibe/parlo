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
          suggestedFixTranslation: { type: Type.STRING, description: "English translation of the suggested correct fix." },
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

Evaluation Guidelines:
- Evaluate the student's Italian input rigorously. Do NOT accept single-word fragment answers or random keyword drops.
- Demand complete, grammatically sound Italian sentence structures (e.g. "Vorrei un espresso, per favore" instead of just "caffè").
- Pay critical attention to cardinal numbers, dates, clock hours, food ordering etiquette, directions, and grammar rules.
- Deduct 1 heart (heartsDeducted = 1, isCorrect = false) if the user makes a significant grammar blunder, fumbles numbers/dates/hours, or gives incomplete/nonsense/English responses.
- Always provide clear corrections with English translations of suggested fixes explaining mistakes.
- Keep Maestro Marco's Italian response conversational (1-3 sentences) so it can be comfortably spoken via Web Speech Synthesis.
`;

export async function evaluateTurnWithGemini(
  userInput: string,
  category: Category,
  conversationContext: { role: 'user' | 'model'; text: string }[]
): Promise<GeminiEvaluationResponse> {
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY not found in .env. Using strict intelligent local fallback engine.");
    return generateStrictFallbackEvaluation(userInput, category);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
Current Category Focus: ${category}

Conversation Context:
${conversationContext.map(h => `${h.role === 'user' ? 'Student' : 'Maestro Marco'}: ${h.text}`).join('\n')}

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
    return generateStrictFallbackEvaluation(userInput, category);
  }
}

/**
 * Strict Local Fallback Engine (requires complete Italian sentence structures)
 */
function generateStrictFallbackEvaluation(userInput: string, category: Category): GeminiEvaluationResponse {
  const cleanInput = userInput.trim().toLowerCase();
  const wordCount = cleanInput.split(/\s+/).length;
  
  // Require at least 3 words and valid Italian phrasing structure
  const containsEnglish = /\b(the|is|and|you|have|what|please|yes|no|want|give|coffee|water)\b/i.test(cleanInput);
  const containsPoliteOrVerb = /\b(vorrei|vorremmo|prendo|gradirei|vorrei|sono|siamo|c'è|dov'è|quanti|quanto|grazie|per favore|buongiorno)\b/i.test(cleanInput);

  let isCorrect = true;
  let heartsDeducted = 0;
  const corrections = [];

  if (wordCount < 3 || containsEnglish || !containsPoliteOrVerb) {
    isCorrect = false;
    heartsDeducted = 1;

    let fix = "Vorrei un espresso e un cornetto, per favore";
    let fixTr = "I would like an espresso and a croissant, please";
    let explanation = "Hai usato una risposta troppo breve o senza verbo. Maestro Marco richiede una frase completa in italiano!";

    if (category === "NUMBERS") {
      fix = "Sono venticinque euro in totale";
      fixTr = "It is twenty-five euros in total";
      explanation = "Devi esprimere il numero o il conto con precisione in una frase completa.";
    } else if (category === "DIRECTIONS") {
      fix = "Giri a destra dopo la chiesa, per favore";
      fixTr = "Turn right after the church, please";
      explanation = "Per le indicazioni stradali usa verbi di direzione chiari come 'girare' o 'andare dritto'.";
    }

    corrections.push({
      userMistake: userInput || "(Frase incompleta)",
      suggestedFix: fix,
      suggestedFixTranslation: fixTr,
      explanation
    });
  }

  const responsesByCategory: Record<Category, { it: string; en: string; idiom: { phrase: string; lit: string; ctx: string } }> = {
    FOOD_ORDERING: {
      it: isCorrect 
        ? "Eccellente! Frase perfetta. Desidera qualcos'altro prima che le porti il conto?" 
        : "Attenzione! Al bar neapolitano diciamo 'Vorrei...' con cortesia, non usiamo frasi incomplete!",
      en: isCorrect 
        ? "Excellent! Perfect sentence. Would you like anything else before I bring the bill?" 
        : "Watch out! At the Neapolitan bar we say 'I would like...' politely, we don't use incomplete fragments!",
      idiom: { phrase: "Prendere la vita con filosofia e un buon caffè", lit: "Take life with philosophy and a good coffee", ctx: "Face adversity with calm and enjoyment" }
    },
    NUMBERS: {
      it: isCorrect 
        ? "Molto bene! Il tuo numero è preciso. Ora dimmi: quanto fa ottanta più quarantaquattro?" 
        : "Attenzione ai numeri! In Italia la precisione è tutto. Riproviamo con una frase completa!",
      en: isCorrect 
        ? "Very good! Your number is precise. Now tell me: how much is eighty plus forty-four?" 
        : "Watch out for numbers! In Italy precision is everything. Let us try again with a complete sentence!",
      idiom: { phrase: "Dare i numeri", lit: "To give numbers", ctx: "To act crazy or talk nonsense" }
    },
    DATES_CALENDAR: {
      it: isCorrect 
        ? "Eccellente! La data e l'ora sono corrette. A che ora ti svegli solitamente la mattina?" 
        : "Accipicchia! Ricorda che in italiano i mesi si scrivono in minuscolo e le ore richiedono 'sono le'.",
      en: isCorrect 
        ? "Excellent! The date and time are correct. What time do you usually wake up in the morning?" 
        : "Goodness! Remember that in Italian months are lowercase and hours require 'sono le'.",
      idiom: { phrase: "Ogni morte di papa", lit: "Every death of a pope", ctx: "Once in a blue moon" }
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
        : "Mamma mia! La grammatica ha tentennato qui. Respira e riprova con una frase completa!",
      en: isCorrect 
        ? "What a lovely speech! I love your enthusiasm. Tell me, what do you do during the warm season?" 
        : "Mamma mia! The grammar faltered here. Breathe and try again with a complete sentence!",
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
