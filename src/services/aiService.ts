import { GoogleGenAI, Type } from "@google/genai";
import { Product, SaleRecord, Customer, PredictionResult, SalesInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getSalesInsights = async (sales: SaleRecord[], products: Product[]): Promise<SalesInsight[]> => {
  const salesSummary = sales.map(s => {
    const p = products.find(prod => prod.id === s.productId);
    return `${s.timestamp}: ${p?.name} - $${s.totalPrice}`;
  }).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze these sales records and provide 3 key business insights. 
      Focus on trends, top performing categories, and areas for improvement.
      Return the response as a JSON array of objects with 'trend' (up/down/stable), 'message' (string), and 'confidence' (number 0-1).
      
      Sales Data:
      ${salesSummary}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              trend: { type: Type.STRING, enum: ['up', 'down', 'stable'] },
              message: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ['trend', 'message', 'confidence']
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Insight Error:", error);
    return [{ trend: 'stable', message: "Unable to generate real-time insights at this moment.", confidence: 0.5 }];
  }
};

export const getCustomerPredictions = async (customer: Customer, products: Product[]): Promise<PredictionResult> => {
  const history = customer.purchaseHistory.map(id => products.find(p => p.id === id)?.name).join(', ');
  const available = products.map(p => `${p.id}: ${p.name} (${p.category})`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Based on this customer's purchase history: [${history}], 
      predict the top 3 items they are most likely to buy next from this catalog:
      ${available}
      
      Return a JSON object with 'customerId', 'recommendedProducts' (array of IDs), and 'reasoning' (a brief explanation).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            customerId: { type: Type.STRING },
            recommendedProducts: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoning: { type: Type.STRING }
          },
          required: ['customerId', 'recommendedProducts', 'reasoning']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return {
      customerId: customer.id,
      recommendedProducts: products.slice(0, 3).map(p => p.id),
      reasoning: "Standard recommendations based on popular items."
    };
  }
};
