import type { IncomingMessage, ServerResponse } from "http";
import { processChatRequest, generateFallbackResponse, ChatMessage } from "./agentCore";

interface VercelRequest extends IncomingMessage {
  method?: string;
  body?: any;
  query?: Record<string, string | string[]>;
}

interface VercelResponse extends ServerResponse {
  status?: (statusCode: number) => VercelResponse;
  json?: (body: any) => void;
  send?: (body: any) => void;
}

// Safely send JSON response regardless of whether running under @vercel/node, Express, or raw Node.js
function sendResponse(res: VercelResponse, statusCode: number, payload: any) {
  try {
    if (typeof res.status === "function" && typeof res.json === "function") {
      res.status(statusCode).json(payload);
      return;
    }
  } catch {
    // fallback to native http methods
  }

  try {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to write response:", err);
  }
}

// Safely parse JSON body from either pre-parsed object or incoming raw stream
async function parseRequestBody(req: VercelRequest): Promise<any> {
  if (req.body) {
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }

  // Read stream if req.body is undefined in standard Node.js serverless invocation
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk: any) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on("error", () => {
      resolve({});
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    sendResponse(res, 200, { status: "ok" });
    return;
  }

  if (req.method !== "POST") {
    sendResponse(res, 405, { error: "Method not allowed. Please use POST." });
    return;
  }

  let messages: ChatMessage[] = [];

  try {
    const body = await parseRequestBody(req);
    messages = (body?.messages || []) as ChatMessage[];

    if (!Array.isArray(messages) || messages.length === 0) {
      sendResponse(res, 400, { error: "Missing or invalid messages array." });
      return;
    }

    const result = await processChatRequest(messages);
    sendResponse(res, 200, result);
  } catch (err: any) {
    console.error("Vercel /api/chat error:", err);

    // Guaranteed resilience: always return a compliant response rather than crashing with 500
    if (messages.length > 0) {
      const fallback = generateFallbackResponse(messages);
      sendResponse(res, 200, fallback);
      return;
    }

    sendResponse(res, 200, {
      reply: "I am ready to help you draft your formal complaint letter. Could you please describe what occurred, who was involved, and what specific remedy you are seeking?",
      letterDraft: null,
    });
  }
}
