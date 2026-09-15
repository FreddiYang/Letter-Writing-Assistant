import type { IncomingMessage, ServerResponse } from "http";
import { processChatRequest, generateFallbackResponse, ChatMessage } from "./agentCore";

interface VercelRequest extends IncomingMessage {
  method?: string;
  body?: any;
  query?: Record<string, string | string[]>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: any) => void;
  send: (body: any) => void;
  setHeader: (name: string, value: string | number | readonly string[]) => this;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).send("OK");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // use raw body
      }
    }

    const messages = body?.messages as ChatMessage[];

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Missing or invalid messages array." });
      return;
    }

    const result = await processChatRequest(messages);
    res.status(200).json(result);
  } catch (err: any) {
    console.error("Vercel /api/chat error:", err);

    let messages = req.body?.messages as ChatMessage[];
    if (messages && Array.isArray(messages)) {
      const fallback = generateFallbackResponse(messages);
      res.status(200).json(fallback);
      return;
    }

    res.status(500).json({
      error: err.message || "An error occurred while generating a response.",
    });
  }
}
