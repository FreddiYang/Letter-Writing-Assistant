import React, { useState } from 'react';
import {
  X,
  Info,
  Cpu,
  Layers,
  ShieldAlert,
  ArrowRight,
  Database,
  Terminal,
  FileText,
  User,
  CheckCircle2,
  Workflow,
  Sparkles,
  Lock,
  Compass,
} from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'agent_rules' | 'data_flow' | 'specs'>(
    'diagram'
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 border border-stone-200 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  System Architecture & Agent Specification
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-800 text-amber-300 border border-stone-700">
                  v1.2 Agent Engine
                </span>
              </div>
              <p className="text-xs text-stone-400">
                End-to-end overview of the client, backend proxy, and governed Gemini agent
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-stone-200 px-6 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('diagram')}
            className={`py-3 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'diagram'
                ? 'border-amber-600 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Workflow className="w-4 h-4 text-amber-600" />
            <span>Interactive System Diagram</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('agent_rules')}
            className={`py-3 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'agent_rules'
                ? 'border-amber-600 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Agent Guardrails & Loop</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('data_flow')}
            className={`py-3 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'data_flow'
                ? 'border-amber-600 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ArrowRight className="w-4 h-4 text-amber-600" />
            <span>Data Flow & Security</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-amber-600 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Stack Specifications</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 text-sm">
          {activeTab === 'diagram' && (
            <div className="space-y-6">
              {/* Visual System Diagram */}
              <div className="bg-stone-900 rounded-xl p-5 sm:p-6 text-stone-100 shadow-inner overflow-x-auto">
                <div className="min-w-[620px] flex flex-col gap-6">
                  {/* Layer 1: Client Front-End */}
                  <div className="border border-stone-700 bg-stone-800/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3 border-b border-stone-700 pb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                          Layer 1: Client Application (React 19 + Vite)
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">Port 3000 / Browser SPA</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="bg-stone-900/90 border border-stone-700 p-2.5 rounded-lg">
                        <p className="font-semibold text-stone-200 mb-1">Interactive Conversational UI</p>
                        <p className="text-[11px] text-stone-400">
                          Captures user story, feelings, clarification replies & tone preferences.
                        </p>
                      </div>

                      <div className="bg-stone-900/90 border border-stone-700 p-2.5 rounded-lg">
                        <p className="font-semibold text-stone-200 mb-1">State Machine & Stepper</p>
                        <p className="text-[11px] text-stone-400">
                          Tracks interaction loop: Acknowledge → Clarify → Draft → Review.
                        </p>
                      </div>

                      <div className="bg-stone-900/90 border border-amber-500/40 p-2.5 rounded-lg">
                        <p className="font-semibold text-amber-300 mb-1">Resizable Document Canvas</p>
                        <p className="text-[11px] text-stone-400">
                          Full-screen reader, live placeholder injector, 150-220w verification counter.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex items-center justify-center -my-3">
                    <div className="px-3 py-1 bg-stone-800 text-stone-300 rounded-full text-[10px] font-mono border border-stone-700 flex items-center gap-1.5">
                      <span>HTTP POST /api/chat</span>
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                    </div>
                  </div>

                  {/* Layer 2: Express Server & Proxy */}
                  <div className="border border-stone-700 bg-stone-800/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3 border-b border-stone-700 pb-2">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                          Layer 2: Backend Proxy & Safety Layer (Express.js)
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">server.ts (Node.js ESM/CJS)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-stone-900/90 border border-stone-700 p-2.5 rounded-lg">
                        <div className="flex items-center gap-1.5 text-stone-200 font-semibold mb-1">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          <span>Secret Security Isolation</span>
                        </div>
                        <p className="text-[11px] text-stone-400">
                          Manages <code className="text-amber-300 font-mono">GEMINI_API_KEY</code> server-side; protects credentials from browser exposure.
                        </p>
                      </div>

                      <div className="bg-stone-900/90 border border-stone-700 p-2.5 rounded-lg">
                        <div className="flex items-center gap-1.5 text-stone-200 font-semibold mb-1">
                          <Database className="w-3 h-3 text-emerald-400" />
                          <span>Rule-Governed Fallback Engine</span>
                        </div>
                        <p className="text-[11px] text-stone-400">
                          Ensures zero downtime with instant deterministic guidance if API secrets are being configured.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex items-center justify-center -my-3">
                    <div className="px-3 py-1 bg-stone-800 text-stone-300 rounded-full text-[10px] font-mono border border-stone-700 flex items-center gap-1.5">
                      <span>@google/genai SDK v2.4</span>
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                    </div>
                  </div>

                  {/* Layer 3: Agent Core */}
                  <div className="border border-amber-500/50 bg-amber-950/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3 border-b border-amber-500/30 pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                          Layer 3: Agent Core (Gemini 3.8 Flash + Deep Behavioral Instructions)
                        </span>
                      </div>
                      <span className="text-[11px] text-amber-300/80 font-mono">models/gemini-3.8-flash</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5 text-xs">
                      <div className="bg-stone-900/90 border border-amber-900/40 p-2 rounded-lg">
                        <p className="font-semibold text-amber-200 mb-0.5 text-[11px]">Rule 1: Empathetic Listening</p>
                        <p className="text-[10px] text-stone-400">1-sentence emotional validation + max 4 questions.</p>
                      </div>

                      <div className="bg-stone-900/90 border border-amber-900/40 p-2 rounded-lg">
                        <p className="font-semibold text-amber-200 mb-0.5 text-[11px]">Rule 2: Facts vs Beliefs</p>
                        <p className="text-[10px] text-stone-400">Separates reported events from subjective interpretations.</p>
                      </div>

                      <div className="bg-stone-900/90 border border-amber-900/40 p-2 rounded-lg">
                        <p className="font-semibold text-amber-200 mb-0.5 text-[11px]">Rule 3: Zero-Fabrication</p>
                        <p className="text-[10px] text-stone-400">Never invents dates, policies, motives, or consensus.</p>
                      </div>

                      <div className="bg-stone-900/90 border border-amber-900/40 p-2 rounded-lg">
                        <p className="font-semibold text-amber-200 mb-0.5 text-[11px]">Rule 5: 150-220w Target</p>
                        <p className="text-[10px] text-stone-400">Generates structured &lt;draft_letter&gt; with verified remedy.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanatory Callout */}
              <div className="bg-stone-100 border border-stone-200 rounded-xl p-4 text-xs text-stone-600 flex items-start gap-3">
                <Compass className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-stone-900">
                    Why the Agent Architecture is Governed by Behavioral Guardrails
                  </p>
                  <p className="leading-relaxed">
                    Unlike standard generative chatbots that immediately draft speculative letters or hallucinate administrative policies, this agent is restricted to an objective <strong>Interaction Loop</strong>. It listens and validates first, clarifies user intent and evidentiary choices, and only drafts once essential parameters are established.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agent_rules' && (
            <div className="space-y-4 text-xs">
              <h4 className="text-sm font-bold text-stone-900">
                Core Behavioral Guardrails Programmed into the Agent
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>First-Response Empathy & Clarification</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Validates feelings in one brief sentence. Asks up to four clarification questions covering: recipient, desired remedy, preferred tone, and handling of sensitive allegations. Strictly avoids drafting premature letters on turn 1.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>Experience vs. Interpretation</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Does not convert "it feels unfair" into a proven policy breach, or ambiguous communication into malicious intent. Clarifies who pronouns like "you" refer to.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>Anti-Hallucination & Placeholder Standard</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Never fabricates dates, time spent, specific rules, or classmate opinions. When names or references are unknown, injects clear placeholders like <code className="bg-stone-100 px-1 py-0.5 rounded">[Recipient Name]</code>.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">4</span>
                    <span>Tone & Sensitive Claim Choices</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Offers Diplomatic, Firm-but-respectful, or Urgent tones. For sensitive AI-use or conduct claims, offers omission, neutral policy inquiry, or carefully qualified observation. Never equates AI with cheating without proof.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">5</span>
                    <span>150–220 Word Conciseness Target</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Preserves at least one concrete reported fact and one personal impact in first-person language. Avoids repetitive venting, unsolicited legal threats, or sycophantic praise.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-stone-900">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">6</span>
                    <span>Evidentiary Review Loop</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Concludes drafts with a review question. If a user requests unsupported accusations later, the agent explains the evidentiary limit and provides an actionable factual alternative.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data_flow' && (
            <div className="space-y-4 text-xs">
              <h4 className="text-sm font-bold text-stone-900">
                Data Flow & Privacy Principles
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white border border-stone-200 rounded-xl">
                  <div className="p-2 bg-stone-100 rounded-lg text-stone-700">
                    <Lock className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Ephemeral Client-Side State</p>
                    <p className="text-stone-600 text-[11px] leading-relaxed mt-0.5">
                      Your conversation history and draft letters exist only in your current active browser tab session. No letters are permanently logged to cloud databases or exposed to external third parties.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-stone-200 rounded-xl">
                  <div className="p-2 bg-stone-100 rounded-lg text-stone-700">
                    <Terminal className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Server-Side Proxy Architecture</p>
                    <p className="text-stone-600 text-[11px] leading-relaxed mt-0.5">
                      All LLM inference calls pass through the internal Node.js Express server (`/api/chat`). The client browser never receives or requires access to raw Gemini API credentials.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white border border-stone-200 rounded-xl">
                  <div className="p-2 bg-stone-100 rounded-lg text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-sky-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Zero Unsolicited Actions</p>
                    <p className="text-stone-600 text-[11px] leading-relaxed mt-0.5">
                      The assistant never automatically dispatches emails, contacts teachers or employers, or publishes complaints. The user maintains 100% manual control over final review, edits, and delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4 text-xs">
              <h4 className="text-sm font-bold text-stone-900">
                Technical Stack Specifications
              </h4>

              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-4">Component</th>
                      <th className="py-2.5 px-4">Technology</th>
                      <th className="py-2.5 px-4">Role & Function</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-stone-600">
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Agent Intelligence</td>
                      <td className="py-2.5 px-4 font-mono text-[11px]">Gemini 3.8 Flash (@google/genai)</td>
                      <td className="py-2.5 px-4">Fast, low-latency reasoning and strict prompt following</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Backend Server</td>
                      <td className="py-2.5 px-4 font-mono text-[11px]">Express 4.21 + tsx / esbuild</td>
                      <td className="py-2.5 px-4">API proxy on port 3000, environment key isolation</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Frontend Framework</td>
                      <td className="py-2.5 px-4 font-mono text-[11px]">React 19 + TypeScript</td>
                      <td className="py-2.5 px-4">Reactive UI, dual-pane document canvas, state machine</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Styling System</td>
                      <td className="py-2.5 px-4 font-mono text-[11px]">Tailwind CSS v4 + Plus Jakarta Sans</td>
                      <td className="py-2.5 px-4">Clean editorial design system with Source Serif 4 letterhead</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-stone-900">Iconography</td>
                      <td className="py-2.5 px-4 font-mono text-[11px]">Lucide React</td>
                      <td className="py-2.5 px-4">Consistent visual semantics across all controls</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>Formal Complaint Writing Assistant • AI Studio System</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
