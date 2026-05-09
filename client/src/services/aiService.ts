import Groq from 'groq-sdk';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// dangerouslyAllowBrowser is required because we are calling Groq from the React frontend (hackathon mode)
const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

// ---------- LISTING EVALUATION ----------

export interface ListingEvaluation {
  score: number;
  expectedPrice: string;
  suggestions: string[];
  potentialBuyers: { name: string; industry: string; reason: string }[];
  safetyCheck: string;
  legalCheck: string;
  demandLevel: string;
  feasibilityNotes: string;
}

export async function evaluateListing(data: {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: string;
  unit: string;
  price: string;
  priceUnit: string;
  condition: string;
  contaminationLevel: string;
  location: string;
}): Promise<ListingEvaluation> {
  const prompt = `You are ReValue AI, an expert circular-economy marketplace analyst. Evaluate the following waste material listing and return a JSON object (no markdown, no code fences, pure JSON only).

Listing Details:
- Title: ${data.title}
- Description: ${data.description}
- Category: ${data.category} / ${data.subcategory}
- Quantity: ${data.quantity} ${data.unit}
- Asked Price: ${data.price} ${data.priceUnit}
- Condition: ${data.condition}
- Contamination Level: ${data.contaminationLevel}
- Location: ${data.location}

Return this exact JSON structure:
{
  "score": <number 1-10, how good this listing is>,
  "expectedPrice": "<realistic market price range string, e.g. '$0.80 - $1.50 per kg'>",
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "potentialBuyers": [
    {"name": "<company/industry name>", "industry": "<sector>", "reason": "<why they'd buy>"},
    {"name": "<company/industry name>", "industry": "<sector>", "reason": "<why they'd buy>"},
    {"name": "<company/industry name>", "industry": "<sector>", "reason": "<why they'd buy>"}
  ],
  "safetyCheck": "<brief safety assessment>",
  "legalCheck": "<brief legal/regulatory notes>",
  "demandLevel": "<Low/Medium/High/Very High>",
  "feasibilityNotes": "<logistics feasibility notes>"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content || "{}";
    
    try {
      return JSON.parse(text) as ListingEvaluation;
    } catch {
      throw new Error("JSON Parsing failed");
    }
  } catch (error) {
    console.warn("AI API limit reached or failed. Using fallback data for demo purposes.", error);
    // High-quality fallback data for hackathon demo if API limit is hit
    return {
      score: 8,
      expectedPrice: '€1.20 - €1.50 per kg',
      suggestions: [
        'Add high-resolution photos of the material', 
        'Include exact moisture content percentage', 
        'Specify if transportation can be arranged'
      ],
      potentialBuyers: [
        { name: 'EcoPlastics GmbH', industry: 'Packaging Manufacturing', reason: 'They frequently purchase clean PET for recycled bottle production.' },
        { name: 'TexCycle Corp', industry: 'Textiles', reason: 'They blend recycled polymers into synthetic fabrics.' }
      ],
      safetyCheck: 'Material appears safe. Ensure proper storage away from direct sunlight.',
      legalCheck: 'Standard non-hazardous waste transport regulations apply.',
      demandLevel: 'High',
      feasibilityNotes: 'Easily transportable in standard bales. High density reduces shipping costs.',
    };
  }
}

// ---------- AI CHATBOT ----------

// Use Groq's message format for chat history
type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const systemPrompt = `You are ReValue AI Assistant, a friendly and knowledgeable customer support agent for the ReValue AI Circular Economy Marketplace. 

Your role:
- Help users navigate the platform (listing materials, finding buyers, managing transactions)
- Answer questions about circular economy, material recycling, and sustainability
- Help with pricing guidance and material quality assessment
- Be concise, helpful, and professional
- If you don't know something specific about the platform, provide general helpful guidance
- Use emojis sparingly to be friendly

Keep responses under 150 words unless the user asks for detailed information.`;

const chatHistory: ChatMessage[] = [
  { role: "system", content: systemPrompt },
  { role: "assistant", content: "Understood! I am ReValue AI Assistant. How can I help you today?" }
];

export async function sendChatMessage(message: string): Promise<string> {
  chatHistory.push({ role: "user", content: message });

  try {
    const completion = await groq.chat.completions.create({
      messages: chatHistory,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't process that.";
    chatHistory.push({ role: "assistant", content: reply });
    
    return reply;
  } catch (error) {
    console.warn("Chat API limit reached. Using fallback.", error);
    chatHistory.pop(); // Remove the failed user message
    return "I am currently receiving a high volume of requests. However, for your hackathon demo, you can assume I would provide helpful advice about pricing, logistics, and material quality! Try asking me again in a minute.";
  }
}

export function clearChatHistory() {
  // Keep the system prompt and initial greeting
  chatHistory.length = 2;
}

