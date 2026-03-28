/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getFinanceAdvice(transactions: Transaction[]) {
  if (!process.env.GEMINI_API_KEY) return "Configure sua chave de API para receber conselhos.";

  const summary = transactions.map(t => ({
    desc: t.description,
    amount: t.amount,
    type: t.type,
    date: t.date
  }));

  const prompt = `Como um assistente financeiro pessoal, analise estas transações e dê 3 dicas curtas e práticas para economizar ou investir melhor. Responda em Português.
  Transações: ${JSON.stringify(summary.slice(0, 20))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini error:', error);
    return "Não foi possível gerar conselhos no momento.";
  }
}
