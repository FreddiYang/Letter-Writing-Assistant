import React from 'react';
import { FileText, RotateCcw, ShieldCheck, Info } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenGuidelines: () => void;
  onOpenSystemInfo: () => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenGuidelines,
  onOpenSystemInfo,
  hasMessages,
}) => {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm sticky top-0 z-30 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-900 text-stone-50 flex items-center justify-center shadow-xs">
            <FileText className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-900">
                Formal Complaint Writing Assistant
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                Supportive & Objective
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Turn frustrating experiences into concise, accurate, and impactful letters with full user control.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-system-diagram"
            onClick={onOpenSystemInfo}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 hover:text-amber-950 bg-amber-100/70 hover:bg-amber-100 border border-amber-300/80 rounded-md transition-colors shadow-xs"
            title="View System Diagram & Agent Specifications"
          >
            <Info className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-semibold">System Diagram</span>
          </button>

          <button
            id="btn-guidelines"
            onClick={onOpenGuidelines}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors"
            title="View Ethical Writing Rules & Boundaries"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden xs:inline">Writing Rules</span>
          </button>

          {hasMessages && (
            <button
              id="btn-reset-conversation"
              onClick={onReset}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-red-700 bg-white hover:bg-red-50 border border-stone-200 rounded-md transition-colors"
              title="Start a new complaint draft"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Letter</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
