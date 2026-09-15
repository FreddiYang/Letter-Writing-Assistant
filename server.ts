import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { processChatRequest, generateFallbackResponse, ChatMessage } from "./api/agentCore";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // API Health Check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", role: "Formal Complaint Writing Assistant" });
  });

  // Chat API endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { messages } = req.body as { messages: ChatMessage[] };

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "Missing messages array." });
        return;
      }

      const result = await processChatRequest(messages);
      res.json(result);
    } catch (err: any) {
      console.error("Chat API error:", err);
      const { messages } = req.body as { messages: ChatMessage[] };
      if (messages && Array.isArray(messages)) {
        const fallback = generateFallbackResponse(messages);
        res.json(fallback);
        return;
      }
      res.status(500).json({
        error: err.message || "An error occurred while generating a response.",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Complaint Assistant server running on port ${PORT}`);
  });
}

startServer();
