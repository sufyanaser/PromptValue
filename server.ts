import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Unified API route for multiple AI providers
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction, apiKey, provider = 'gemini', model } = req.body;
      
      if (provider === 'gemini') {
        const finalApiKey = apiKey || process.env.GEMINI_API_KEY;
        if (!finalApiKey) return res.status(400).json({ error: "Gemini API Key is required." });

        const ai = new GoogleGenAI({ 
          apiKey: finalApiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });

        const response = await ai.models.generateContent({
          model: model || "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: systemInstruction || "You are a helpful prompt engineering assistant.",
          },
        });

        return res.json({ text: response.text });
      }

      if (provider === 'openai' || provider === 'copilot') {
        const finalApiKey = apiKey || process.env.OPENAI_API_KEY;
        if (!finalApiKey) return res.status(400).json({ error: "OpenAI API Key is required." });

        const openai = new OpenAI({ apiKey: finalApiKey });
        const response = await openai.chat.completions.create({
          model: model || (provider === 'copilot' ? "gpt-4o" : "gpt-3.5-turbo"),
          messages: [
            { role: "system", content: systemInstruction || "You are a helpful prompt engineering assistant." },
            { role: "user", content: prompt }
          ],
        });

        return res.json({ text: response.choices[0].message?.content || "" });
      }

      if (provider === 'claude') {
        const finalApiKey = apiKey || process.env.ANTHROPIC_API_KEY;
        if (!finalApiKey) return res.status(400).json({ error: "Anthropic API Key is required." });

        const anthropic = new Anthropic({ apiKey: finalApiKey });
        const response = await anthropic.messages.create({
          model: model || "claude-3-5-sonnet-20240620",
          max_tokens: 1024,
          system: systemInstruction || "You are a helpful prompt engineering assistant.",
          messages: [{ role: "user", content: prompt }],
        });

        // @ts-ignore
        return res.json({ text: response.content[0].text });
      }

      res.status(400).json({ error: "Unsupported provider" });
    } catch (error: any) {
      console.error("AI API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  // Backward compatibility for old endpoint
  app.post("/api/gemini/generate", async (req, res) => {
    // Redirect to the unified endpoint internal logic or just keep it simple
    req.body.provider = 'gemini';
    const response = await fetch(`http://localhost:${PORT}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
