import fetch from "node-fetch";
import dotenv from "dotenv";
import { getContext } from "../config/contextManager.js";
import { getSystemPrompt } from "../config/promptTemplates.js";

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { message, chatType = "store", conversationHistory = [] } = req.body;

  try {
    // Get the relevant context for this type of chatbot
    const context = await getContext(chatType);

    // Generate the system prompt with context
    const systemPrompt = getSystemPrompt(chatType, context);

    // Build messages array including conversation history for context
    const messages = [
      { role: "system", content: systemPrompt },
      // Include up to last 10 messages for context (adjust as needed)
      ...conversationHistory.slice(-10),
      { role: "user", content: message },
    ];

    // Call the OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000", // Required by OpenRouter
        },
        body: JSON.stringify({
          model: process.env.LLM_MODEL || "openai/gpt-4o", // Set default model or use from env
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      return res.status(response.status).json({
        error: "Error from LLM provider",
        details: data,
      });
    }

    const reply =
      data.choices?.[0]?.message?.content || "Oops! Something went wrong.";

    // Return the AI response and updated conversation history
    res.status(200).json({
      reply,
      // Return updated history for the frontend to save
      updatedHistory: [
        ...conversationHistory,
        { role: "user", content: message },
        { role: "assistant", content: reply },
      ],
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
}
