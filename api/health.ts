import type { IncomingMessage, ServerResponse } from "http";

interface VercelRequest extends IncomingMessage {
  method?: string;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: any) => void;
}

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ status: "ok", role: "Formal Complaint Writing Assistant", platform: "vercel" });
}
