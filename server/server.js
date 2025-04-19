import fetch from "node-fetch";
import dotenv from "dotenv";
import products from "./products.json" assert { type: "json" };

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { message } = req.body;

  const context = products.map(p => {
    return `- ${p.name}: Sizes ${p.sizes.join(", ")}, Availability: ${p.stock}`;
  }).join("\n");

  const systemPrompt = `
You are a helpful virtual store assistant. Only respond to questions about:
- Product availability
- Size options
- Store location and hours

If asked something off-topic, respond with:
"I'm sorry but I'm not smart enough to answer [topic] related questions. I can help you with anything you'd like to know about the store and our products however!"

Here is the current product info:
${context}
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral", // free OpenRouter model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Oops! Something went wrong.";
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
