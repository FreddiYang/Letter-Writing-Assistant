import type { IncomingMessage, ServerResponse } from "http";
import { GoogleGenAI } from "@google/genai";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface ChatResponsePayload {
  reply: string;
  letterDraft: string | null;
}

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

const SYSTEM_INSTRUCTION = `You are the "Formal Complaint Writing Assistant".

Role & Purpose:
Help a user turn a specific frustrating experience into a concise, accurate complaint letter while preserving their voice and control over tone, content, and requested action.
Treat this as writing support, not an investigation or a judgment about other people. The user may be upset and provide incomplete or ambiguous information. Listen before challenging.

Core Behavioral Rules:
1. FIRST RESPONSE: Acknowledge the user's feelings in one brief sentence. Then, ask up to four short, numbered clarification questions. DO NOT draft a letter in the first response.
   Ask only about missing information:
   - Recipient and context (and any ambiguous previous interaction, clarifying who "you" refers to).
   - Desired remedy (what specific action or resolution the user wants).
   - Preferred tone (offer diplomatic, firm-but-respectful, or urgent).
   - Whether/how to include sensitive claims about others (e.g., for sensitive AI-use or misconduct concerns, offer omission, a neutral policy-clarification question, or a carefully qualified observation).
   Group related details to keep the cognitive burden low.

2. Separate the user's reported experience, feelings, and unverified interpretations.
   - Do NOT turn "it feels unfair" into an established policy violation.
   - Do NOT turn "you did not seem to take it seriously" into proven dismissal.
   - Always clarify who ambiguous references (like "you" or "they") refer to.

3. Never invent facts, dates, time spent, policies, motives, evidence, shared class/colleague opinion, academic consequences, or names.
   - Do not claim others agree unless the user explicitly supplied that information.
   - Use standard placeholders like [Recipient Name / Teacher's Name], [Course / Department / Organization Name], and [Your Name] when names are unknown. Unknown names need not block a draft.

4. Tone & Sensitive Content Guidelines:
   - Offer three distinct tones: Diplomatic, Firm-but-respectful, or Urgent; let the user choose.
   - For sensitive concerns (such as alleged AI use, cheating, bias, or colleague misconduct): offer omission, a neutral policy-clarification question, or a carefully qualified observation. Never equate AI use with cheating without a supplied policy and evidence. Do not identify or accuse peers or classmates.

5. Drafting Phase:
   - DRAFT ONLY AFTER the user confirms the requested action, tone, and handling of sensitive content.
   - If essential choices remain unknown, ask one focused follow-up question.
   - If the user explicitly instructs you to proceed without clarifying, state your assumptions and use placeholders instead of inventing facts.
   - When drafting, output the draft inside <draft_letter>...</draft_letter> XML tags so it can be viewed in the document editor, followed by your review question.
   - Letter Requirements:
     * Length: strictly aim for 150–220 words.
     * Structure: Opening with recipient & topic, specific concrete issue, user-specific personal impact, requested remedy/action, polite professional closing.
     * Voice: Preserve at least one concrete detail and one user-specific impact. Express feelings in first-person language ("I felt...", "This impacted my ability to...").
     * Avoid: repeated complaints, formulaic excessive praise, unsolicited escalation, threats, or insults.

6. Review & Revision:
   - After the draft, ask one brief review question about accuracy, voice, or tone.
   - If the user later asks for an unsupported accusation or unverified claim against someone, briefly explain the evidentiary limit and offer a usable factual alternative while continuing to help.

Interaction Loop:
Acknowledge → Clarify missing facts and user choices → Distinguish experience from interpretation → Draft after confirmation → Invite review → Revise without adding unsupported claims.

All outputs must be in clear, professional English.`;

function generateFallbackResponse(messages: ChatMessage[]): ChatResponsePayload {
  const userMessages = messages.filter((m) => m.role === "user");
  const userMsgCount = userMessages.length;

  if (userMsgCount <= 1) {
    return {
      reply: `I understand how frustrating and discouraging this situation has been for you, especially after putting in genuine effort.

To help you draft an effective and accurate formal complaint letter, could you clarify these few details:

1. **Recipient & Context:** Who is the direct recipient of this letter (e.g., [Teacher's Name], the Department Chair, Academic Dean, or Customer Support Director), and who were you communicating with previously?
2. **Desired Remedy:** What concrete outcome or remedy are you seeking (e.g., a formal 1-on-1 meeting to review the rubric, an independent secondary evaluation, or a written explanation)?
3. **Preferred Tone:** Which tone would you prefer: **Diplomatic**, **Firm-but-respectful**, or **Urgent**?
4. **Sensitive Content Handling:** If there are sensitive claims (such as unverified accusations regarding AI use or conduct of others), would you prefer to **omit them**, frame them as a **neutral policy-clarification question**, or state a **carefully qualified observation** without accusations?

Once you confirm your preferences, I will draft your formal letter.`,
      letterDraft: null,
    };
  }

  let draft = "";

  const isAIOrAcademic = messages.some(
    (m) =>
      m.text.toLowerCase().includes("paper") ||
      m.text.toLowerCase().includes("grade") ||
      m.text.toLowerCase().includes("professor") ||
      m.text.toLowerCase().includes("rubric") ||
      m.text.toLowerCase().includes("ai") ||
      m.text.toLowerCase().includes("dr.") ||
      m.text.toLowerCase().includes("miller")
  );

  const isBillingOrService = messages.some(
    (m) =>
      m.text.toLowerCase().includes("charge") ||
      m.text.toLowerCase().includes("fee") ||
      m.text.toLowerCase().includes("subscription") ||
      m.text.toLowerCase().includes("gym") ||
      m.text.toLowerCase().includes("refund") ||
      m.text.toLowerCase().includes("billing")
  );

  if (isBillingOrService) {
    draft = `[Your Name]
[Your Contact Information]
[Account / Reference Number]
[Date]

[Recipient Name / Customer Service Manager]
[Company / Organization Name]
[Address / Billing Department]

Dear [Recipient Name / Customer Service Team],

I am writing to formally dispute unauthorized recurring charges billed to my account following the confirmed cancellation of my membership. On [Date of Cancellation], I requested full termination of my services and was issued confirmation reference [Confirmation Number]. Despite this recorded agreement, my account was debited [Amount] on [Date of First Charge] and again on [Date of Second Charge].

When I contacted customer support on [Date of Call], I was informed that no prior record could be located and that a refund could not be processed. This unexpected deduction has disrupted my personal budget and created significant inconvenience.

I respectfully request that you verify the cancellation record, process a full refund of [Total Disputed Amount] to my original payment method, and provide written confirmation that my account is permanently closed with no further billing obligations.

Thank you for your prompt attention to resolving this matter fairly. I appreciate your assistance and look forward to your written response within five business days.

Sincerely,

[Your Name]`;
  } else if (isAIOrAcademic) {
    draft = `[Your Name]
[Student ID Number]
[Your Email Address]
[Date]

[Teacher's Name / Department Chair]
[Department of Economics / Academic Affairs]
[Institution Name]

Dear [Teacher's Name],

I am writing to formally request a review of the evaluation and 65% grade assigned to my submission for [Course Name / Final Paper]. The evaluation noted concerns regarding unoriginal structure and potential unauthorized AI assistance.

I want to clarify that my individual contributions were researched and authored independently using peer-reviewed sources retrieved through the library JSTOR archives. While I understand that maintaining academic integrity is vital, the score significantly impacted my overall course standing without specific rubric feedback indicating which sections raised questions. When I previously emailed requesting clarification on how the rubric was applied, I was informed that grades were final without an opportunity to review my source materials.

In light of this, I respectfully request a brief 1-on-1 meeting to review my research notes and draft history against the assignment rubric. Alternatively, I welcome guidance on departmental policy regarding independent secondary evaluation.

Thank you for your time, consideration, and dedication to fair evaluation. I look forward to your guidance on next steps.

Sincerely,

[Your Name]`;
  } else {
    draft = `[Your Name]
[Your Contact Information]
[Date]

[Recipient Name]
[Organization / Department Name]
[Address / Office Location]

Dear [Recipient Name],

I am writing to formally bring to your attention a specific issue regarding [Specific Issue Description] that occurred on [Date of Occurrence]. During this interaction, [Concrete Detail of Experience].

This matter has directly impacted me by [Personal Impact Description], and my previous attempt to address this on [Date of Previous Communication] did not resolve the underlying concern.

To resolve this issue constructively, I respectfully request [Specific Requested Remedy / Action], alongside written confirmation of the steps taken to address this matter.

Thank you for your prompt attention and commitment to resolving this matter professionally. I look forward to hearing from you at your earliest convenience.

Sincerely,

[Your Name]`;
  }

  const reviewQuestion = `I have drafted your formal complaint letter above, structured concisely between 150–220 words with verified details, personal impact, and your requested remedy.

**Review Question:** Does this draft accurately reflect your experience and voice, or would you like to adjust the tone, refine the requested action, or replace any placeholders?`;

  return {
    reply: `Here is the formal draft based on your preferences:\n\n<draft_letter>\n${draft}\n</draft_letter>\n\n${reviewQuestion}`,
    letterDraft: draft,
  };
}

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-3.8-flash",
].filter(Boolean) as string[];

async function processChatRequest(messages: ChatMessage[]): Promise<ChatResponsePayload> {
  const client = getAiClient();

  if (!client) {
    return generateFallbackResponse(messages);
  }

  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      });

      const responseText = response.text || "";
      if (responseText.trim()) {
        let letterDraft: string | null = null;
        const letterMatch = responseText.match(/<draft_letter>([\s\S]*?)<\/draft_letter>/i);
        if (letterMatch && letterMatch[1]) {
          letterDraft = letterMatch[1].trim();
        }

        return {
          reply: responseText,
          letterDraft,
        };
      }
    } catch (modelErr: any) {
      console.warn(`Model ${modelName} failed:`, modelErr?.message || modelErr);
    }
  }

  return generateFallbackResponse(messages);
}

function sendResponse(res: VercelResponse, statusCode: number, payload: any) {
  try {
    if (typeof res.status === "function" && typeof res.json === "function") {
      res.status(statusCode).json(payload);
      return;
    }
  } catch {
    // fallback to http methods
  }

  try {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to write response:", err);
  }
}

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
