import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Sparkles,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  FileText,
  SlidersHorizontal,
  Columns,
  Maximize2,
  Cpu,
  GripVertical,
} from 'lucide-react';
import { Header } from './components/Header';
import { InteractionLoopStepper, AssistantStage } from './components/InteractionLoopStepper';
import { ChatMessageBubble } from './components/ChatMessageBubble';
import { LetterDocumentViewer } from './components/LetterDocumentViewer';
import { ScenarioPrompts } from './components/ScenarioPrompts';
import { ToneAndClarificationHelpers } from './components/ToneAndClarificationHelpers';
import { GuidelinesModal } from './components/GuidelinesModal';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';
import { ChatMessage, ScenarioTemplate } from './types';

const SAMPLE_DEMO_DRAFT = `[Your Name]
[Student ID Number]
[Your Email Address]
[Date]

[Teacher's Name / Department Chair]
[Department of Economics]
[Institution Name]

Dear [Teacher's Name],

I am writing to formally request a review of the evaluation and 65% grade assigned to my submission for [Course Name / Final Paper]. The evaluation noted concerns regarding unoriginal structure and potential unauthorized AI assistance.

I want to clarify that my individual contributions were researched and authored independently using peer-reviewed sources retrieved through the library JSTOR archives. While I understand that maintaining academic integrity is vital, the score significantly impacted my overall course standing without specific rubric feedback indicating which sections raised questions. When I previously emailed requesting clarification on how the rubric was applied, I was informed that grades were final without an opportunity to review my source materials.

In light of this, I respectfully request a brief 1-on-1 meeting to review my research notes and draft history against the assignment rubric. Alternatively, I welcome guidance on departmental policy regarding independent secondary evaluation.

Thank you for your time, consideration, and dedication to fair evaluation. I look forward to your guidance on next steps.

Sincerely,

[Your Name]`;

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestDraft, setLatestDraft] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'chat' | 'letter'>('chat');
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [systemInfoOpen, setSystemInfoOpen] = useState(false);

  // Resizable canvas pane percentage (letter width: 28% to 72%, default 46%)
  const [letterPanePercent, setLetterPanePercent] = useState<number>(46);
  const [isDragging, setIsDragging] = useState(false);

  const workspaceContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const letterSectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle draggable pane resizing
  const handleMouseDownOnDivider = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !workspaceContainerRef.current) return;
      const rect = workspaceContainerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const totalWidth = rect.width;
      if (totalWidth <= 0) return;

      const chatWidthPercent = (relativeX / totalWidth) * 100;
      const newLetterPercent = 100 - chatWidthPercent;

      // Clamp between 28% and 72%
      if (newLetterPercent >= 28 && newLetterPercent <= 72) {
        setLetterPanePercent(Math.round(newLetterPercent));
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Determine current stage of the interaction loop
  const currentStage: AssistantStage = React.useMemo(() => {
    if (messages.length === 0) return 'start';
    if (!latestDraft) return 'clarify_choices';
    const draftCount = messages.filter((m) => m.letterDraft).length;
    if (draftCount === 1 && messages[messages.length - 1]?.letterDraft) {
      return 'draft_generated';
    }
    return 'review_revise';
  }, [messages, latestDraft]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend !== undefined ? textToSend : input).trim();
    if (!messageText || loading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        letterDraft: data.letterDraft || undefined,
      };

      setMessages([...newMessages, modelMessage]);

      if (data.letterDraft) {
        setLatestDraft(data.letterDraft);
        // Switch to letter tab on mobile
        if (window.innerWidth < 1024) {
          setMobileTab('letter');
        }
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (messages.length === 0 || window.confirm('Start a new letter draft? This will clear current progress.')) {
      setMessages([]);
      setInput('');
      setError(null);
      setLatestDraft(null);
      setMobileTab('chat');
    }
  };

  const handleSelectScenario = (scenario: ScenarioTemplate) => {
    setInput(scenario.initialPrompt);
  };

  const handleFocusLetter = () => {
    setMobileTab('letter');
    letterSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans select-text">
      <Header
        onReset={handleReset}
        onOpenGuidelines={() => setGuidelinesOpen(true)}
        onOpenSystemInfo={() => setSystemInfoOpen(true)}
        hasMessages={messages.length > 0}
      />

      <InteractionLoopStepper currentStage={currentStage} />

      {/* Workspace Top Layout Bar */}
      <div className="border-b border-stone-200 bg-white/70 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Mobile Tab Switcher */}
          <div className="lg:hidden flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMobileTab('chat')}
              className={`py-1 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                mobileTab === 'chat'
                  ? 'bg-stone-900 text-stone-100'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Assistant Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('letter')}
              className={`py-1 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                mobileTab === 'letter'
                  ? 'bg-stone-900 text-stone-100'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Letter Canvas</span>
              {latestDraft && (
                <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
              )}
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-stone-500">
            <Columns className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium text-stone-600">Canvas Layout:</span>
            <div className="flex items-center bg-stone-100 rounded-md p-0.5 border border-stone-200">
              <button
                type="button"
                onClick={() => setLetterPanePercent(35)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  letterPanePercent <= 38
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Expand chat, compact canvas"
              >
                Chat Focus (35%)
              </button>
              <button
                type="button"
                onClick={() => setLetterPanePercent(48)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  letterPanePercent > 38 && letterPanePercent < 58
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Balanced 50/50 dual pane view"
              >
                Balanced (50/50)
              </button>
              <button
                type="button"
                onClick={() => setLetterPanePercent(65)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  letterPanePercent >= 58
                    ? 'bg-white text-stone-900 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Expand letter canvas workspace"
              >
                Canvas Focus (65%)
              </button>
            </div>
            <span className="text-[11px] text-stone-400 hidden xl:inline">
              (or drag divider between panes)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSystemInfoOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-medium hover:underline text-xs"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-600" />
            <span>Agent Architecture & Flow</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout with Resizable Divider */}
      <main className="flex-1 w-full max-w-[1560px] mx-auto p-2 sm:p-4 lg:p-5 flex flex-col min-h-0">
        <div
          ref={workspaceContainerRef}
          className="flex-1 flex flex-col lg:flex-row gap-0 items-stretch min-h-[580px] lg:h-[calc(100vh-165px)] relative"
        >
          {/* Left Pane: Conversational Assistant */}
          <section
            style={{
              width: window.innerWidth >= 1024 ? `calc(${100 - letterPanePercent}% - 8px)` : '100%',
            }}
            className={`flex flex-col bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden h-full ${
              mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center max-w-xl mx-auto py-6 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                    <Sparkles className="w-6 h-6 text-amber-700" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900 tracking-tight mb-2">
                    Describe what happened
                  </h2>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    Share your frustrating experience candidly. In the first step, the assistant will acknowledge your feelings and ask up to four short clarification questions about your context, requested remedy, tone preference, and sensitive claim handling before drafting your letter.
                  </p>

                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-600 space-y-1 mb-2">
                    <p className="font-semibold text-stone-800">Guaranteed Guidelines:</p>
                    <p>• Never invents facts, names, or false consensus.</p>
                    <p>• Respects your choice of tone: Diplomatic, Firm-but-respectful, or Urgent.</p>
                    <p>• Strictly formats the final letter to 150–220 words.</p>
                  </div>

                  <ScenarioPrompts onSelectScenario={handleSelectScenario} />
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <ChatMessageBubble
                      key={msg.id}
                      message={msg}
                      onFocusLetter={msg.letterDraft ? handleFocusLetter : undefined}
                    />
                  ))}

                  {loading && (
                    <div className="flex items-center gap-3 text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-xl p-3.5 max-w-md">
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                      <span>Analyzing context and structuring objective guidance...</span>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">Notice</p>
                        <p>{error}</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Assistant Quick Helper Chips */}
            {messages.length > 0 && (
              <div className="px-4 border-t border-stone-100 bg-stone-50/70">
                <ToneAndClarificationHelpers
                  onSelectOption={(text) => handleSendMessage(text)}
                  disabled={loading}
                />
              </div>
            )}

            {/* User Input Bar */}
            <div className="border-t border-stone-200 p-3 sm:p-4 bg-white shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex flex-col gap-2"
              >
                <div className="relative">
                  <textarea
                    id="input-complaint-experience"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      messages.length === 0
                        ? 'Describe the frustrating experience (e.g. what occurred, who was involved, and what impact you felt)...'
                        : 'Answer clarification questions, choose tone (Diplomatic / Firm-but-respectful / Urgent), or request revisions...'
                    }
                    rows={3}
                    className="w-full resize-none rounded-lg border border-stone-300 p-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="text-[11px] text-stone-400 hidden sm:block">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border text-stone-600 font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border text-stone-600 font-mono">Shift+Enter</kbd> for line break
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      id="btn-send-message"
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-stone-100 text-xs font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      <span>{loading ? 'Processing...' : 'Send to Assistant'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          {/* Desktop Draggable Divider */}
          <div
            id="workspace-pane-splitter"
            onMouseDown={handleMouseDownOnDivider}
            className="hidden lg:flex w-4 items-center justify-center cursor-col-resize select-none group"
            title="Drag to resize letter canvas width"
          >
            <div className={`w-1 h-24 rounded-full transition-all duration-150 flex items-center justify-center ${
              isDragging ? 'bg-amber-500 w-1.5' : 'bg-stone-300 group-hover:bg-amber-400 group-hover:w-1.5'
            }`}>
              <GripVertical className="w-3 h-3 text-stone-500 opacity-0 group-hover:opacity-100" />
            </div>
          </div>

          {/* Right Pane: Letter Document Workspace */}
          <section
            ref={letterSectionRef}
            style={{
              width: window.innerWidth >= 1024 ? `calc(${letterPanePercent}% - 8px)` : '100%',
            }}
            className={`flex flex-col h-full ${
              mobileTab === 'letter' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {latestDraft ? (
              <LetterDocumentViewer
                rawLetter={latestDraft}
                onSendFeedback={(feedback) => handleSendMessage(feedback)}
              />
            ) : (
              <div className="h-full rounded-xl border border-dashed border-stone-300 bg-white/70 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-500 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-stone-400" />
                </div>
                <h3 className="text-base font-semibold text-stone-800 mb-1">
                  Letter Draft Workspace
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mb-4">
                  Your concise complaint letter draft (strictly aimed for 150–220 words) will appear here once you clarify the context, desired remedy, tone, and sensitive content choices.
                </p>

                <div className="text-left w-full max-w-xs bg-stone-50 border border-stone-200 rounded-lg p-3 text-[11px] text-stone-600 space-y-1.5 mb-4">
                  <div className="font-semibold text-stone-800">Draft Checklist:</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Recipient & clear reference context</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Concrete reported issue with 1st-person impact</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Clear, constructive requested remedy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Target length: 150–220 words</span>
                  </div>
                </div>

                {/* Instant Canvas Preview Button */}
                <button
                  type="button"
                  onClick={() => setLatestDraft(SAMPLE_DEMO_DRAFT)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors shadow-xs"
                  title="Load a sample letter into the canvas to test resizing and full screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Preview Canvas with Sample Letter</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <GuidelinesModal
        isOpen={guidelinesOpen}
        onClose={() => setGuidelinesOpen(false)}
      />

      <SystemArchitectureModal
        isOpen={systemInfoOpen}
        onClose={() => setSystemInfoOpen(false)}
      />
    </div>
  );
}
