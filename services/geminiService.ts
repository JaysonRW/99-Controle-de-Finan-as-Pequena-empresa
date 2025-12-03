import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionType } from "../types";

// Helper for simple ID generation if uuid package isn't available in this specific runtime env
const generateId = () => Math.random().toString(36).substr(2, 9);

export const parseBankStatement = async (text: string): Promise<Transaction[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not configured");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prompt configuration for parsing
  const prompt = `
    Analyze the following bank statement text or list of transactions.
    Extract each transaction with its date, description, amount, and determine if it is an INCOME, EXPENSE, or TAX.
    Also assign a short, generic category (e.g., Alimentação, Transporte, Salário, Serviços, Impostos).
    
    Rules:
    - If the amount is negative in the text (e.g., -50.00), it is likely an EXPENSE or TAX.
    - If the amount is positive, check context to see if it's credit (INCOME) or just a listed expense.
    - Convert all amounts to positive absolute numbers for the JSON.
    - Format dates as YYYY-MM-DD.
    
    Text to parse:
    ${text}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              date: { type: Type.STRING },
              type: { 
                type: Type.STRING, 
                enum: [TransactionType.INCOME, TransactionType.EXPENSE, TransactionType.TAX] 
              },
              category: { type: Type.STRING }
            },
            required: ["description", "amount", "date", "type", "category"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Map to application Transaction type with IDs
    return data.map((item: any) => ({
      ...item,
      id: generateId()
    }));

  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw new Error("Falha ao processar o extrato. Tente novamente ou insira manualmente.");
  }
};