import React from 'react';
import { User, Bot, FileText, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onFocusLetter?: () => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  onFocusLetter,
}) => {
  const isUser = message.role === 'user';

  // Format content to remove raw <draft_letter> tags from conversational view if already parsed
  let displayContent = message.text;
  const hasLetterDraft = message.letterDraft || message.text.includes('<draft_letter>');

  if (hasLetterDraft) {
    displayContent = displayContent.replace(/<draft_letter>[\s\S]*?<\/draft_letter>/gi, '').trim();
  }

  return (
    <div className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center shrink-0 shadow-xs mt-1">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-2xl rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 text-sm leading-relaxed transition-all ${
          isUser
            ? 'bg-stone-900 text-stone-50 rounded-br-xs shadow-xs'
            : 'bg-white text-stone-800 border border-stone-200/90 rounded-bl-xs shadow-xs'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.text}</p>
        ) : (
          <div className="space-y-3">
            {/* Display parsed conversational message */}
            <div className="whitespace-pre-wrap text-stone-800">
              {displayContent}
            </div>

            {/* If a draft was generated in this response */}
            {hasLetterDraft && (
              <div className="mt-3 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-950">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-amber-200/70 text-amber-900">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Formal Complaint Letter Draft Generated</p>
                    <p className="text-[11px] text-amber-800">
                      Framed with verified facts, personal impact, and specific remedy (150–220w).
                    </p>
                  </div>
                </div>

                {onFocusLetter && (
                  <button
                    type="button"
                    onClick={onFocusLetter}
                    className="shrink-0 px-3 py-1.5 bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-lg text-xs font-medium transition-colors"
                  >
                    View in Letter Editor
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        <div
          className={`text-[10px] mt-1.5 flex items-center gap-1 ${
            isUser ? 'text-stone-400 justify-end' : 'text-stone-400'
          }`}
        >
          <span>{message.timestamp}</span>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
