import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  FileText,
  Sliders,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Printer,
  ZoomIn,
  ZoomOut,
  Expand,
  ArrowUpDown,
  AlignLeft,
} from 'lucide-react';

interface LetterDocumentViewerProps {
  rawLetter: string;
  onSendFeedback?: (feedback: string) => void;
}

export const LetterDocumentViewer: React.FC<LetterDocumentViewerProps> = ({
  rawLetter,
  onSendFeedback,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [replacements, setReplacements] = useState<Record<string, string>>({});
  const [showPlaceholderManager, setShowPlaceholderManager] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 90%, 100%, 115%, 130%
  const [canvasWidth, setCanvasWidth] = useState<'standard' | 'wide' | 'fluid'>('standard');

  // Extract unique placeholders like [Teacher's Name], [Course Name], [Your Name]
  const extractedPlaceholders = useMemo(() => {
    const regex = /\[([A-Za-z0-9\s'/_-]+)\]/g;
    const matches = new Set<string>();
    let match;
    while ((match = regex.exec(rawLetter)) !== null) {
      matches.add(match[1]);
    }
    return Array.from(matches);
  }, [rawLetter]);

  // Compute finalized letter with user-supplied replacements
  const finalizedLetter = useMemo(() => {
    let text = rawLetter;
    for (const [placeholder, val] of Object.entries(replacements)) {
      if (typeof val === 'string' && val.trim()) {
        const regex = new RegExp(`\\[${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'g');
        text = text.replace(regex, val.trim());
      }
    }
    return text;
  }, [rawLetter, replacements]);

  // Word count calculation
  const wordCount = useMemo(() => {
    if (!finalizedLetter.trim()) return 0;
    return finalizedLetter.trim().split(/\s+/).filter(Boolean).length;
  }, [finalizedLetter]);

  const wordCountStatus = useMemo(() => {
    if (wordCount >= 150 && wordCount <= 220) {
      return {
        label: 'Optimal target (150–220 words)',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      };
    } else if (wordCount < 150) {
      return {
        label: `${150 - wordCount} words below 150 target`,
        color: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    } else {
      return {
        label: `${wordCount - 220} words above 220 target`,
        color: 'text-blue-700 bg-blue-50 border-blue-200',
      };
    }
  }, [wordCount]);

  // Sync fullscreen change events & keyboard escape
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocFullscreen = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement
      );
      if (!isDocFullscreen && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        handleToggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const handleToggleFullscreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      // Try native HTML5 fullscreen API if supported, fall back cleanly to CSS modal overlay
      try {
        if (containerRef.current && containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current && (containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        }
      } catch (err) {
        // Sandboxed iframes may block native requestFullscreen; CSS fixed overlay handles it seamlessly
        console.warn('Native requestFullscreen not permitted in this frame; using full-viewport mode.');
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitFullscreenElement && (document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      } catch (err) {
        // Fallback cleanup
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalizedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([finalizedLetter], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Formal_Complaint_Letter_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Formal Complaint Letter</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              padding: 40px;
              color: #111;
              line-height: 1.6;
              font-size: 14pt;
              max-width: 800px;
              margin: 0 auto;
            }
            .pre {
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <div class="pre">${finalizedLetter.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handlePlaceholderChange = (key: string, value: string) => {
    setReplacements((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 145));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 85));
  };

  // Determine paper container width
  const paperWidthClass = useMemo(() => {
    if (canvasWidth === 'standard') return 'max-w-2xl';
    if (canvasWidth === 'wide') return 'max-w-4xl';
    return 'max-w-5xl w-full';
  }, [canvasWidth]);

  return (
    <div
      ref={containerRef}
      id="letter-draft-canvas-container"
      className={`flex flex-col bg-stone-100 rounded-xl border border-stone-300/80 overflow-hidden transition-all duration-200 select-text ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen bg-stone-900/95 backdrop-blur-md p-2 sm:p-5'
          : 'h-full w-full'
      }`}
    >
      {/* Canvas Top Action Bar */}
      <div className="bg-stone-800 text-stone-100 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 shrink-0 border-b border-stone-700">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-amber-400 shrink-0" />
          <h2 className="text-xs sm:text-sm font-semibold truncate tracking-tight">
            {isFullscreen ? 'Full-Screen Document Canvas' : 'Complaint Letter Draft'}
          </h2>
          <span
            className={`hidden md:inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full border ${wordCountStatus.color}`}
          >
            {wordCount} words • {wordCountStatus.label}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-stone-700/80 rounded px-1 py-0.5 border border-stone-600 text-xs">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 85}
              className="p-1 text-stone-300 hover:text-white disabled:opacity-40 transition-colors"
              title="Decrease font size"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] font-mono text-stone-300 select-none">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 145}
              className="p-1 text-stone-300 hover:text-white disabled:opacity-40 transition-colors"
              title="Increase font size"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Width mode selector in fullscreen or wide views */}
          {(isFullscreen || canvasWidth !== 'standard') && (
            <div className="hidden md:flex items-center bg-stone-700/80 rounded px-1 py-0.5 border border-stone-600 text-[11px]">
              <button
                type="button"
                onClick={() => setCanvasWidth('standard')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  canvasWidth === 'standard' ? 'bg-stone-900 text-amber-400 font-semibold' : 'text-stone-300'
                }`}
                title="Standard letterhead width"
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setCanvasWidth('wide')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  canvasWidth === 'wide' ? 'bg-stone-900 text-amber-400 font-semibold' : 'text-stone-300'
                }`}
                title="Wide letterhead width"
              >
                Wide
              </button>
            </div>
          )}

          {extractedPlaceholders.length > 0 && (
            <button
              id="btn-toggle-placeholders"
              type="button"
              onClick={() => setShowPlaceholderManager(!showPlaceholderManager)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                showPlaceholderManager
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
              }`}
              title="Fill bracketed placeholders like [Your Name]"
            >
              <Sliders className="w-3 h-3" />
              <span>
                Names ({Object.values(replacements).filter(Boolean).length}/
                {extractedPlaceholders.length})
              </span>
            </button>
          )}

          <button
            id="btn-copy-letter"
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-stone-700 hover:bg-stone-600 text-stone-100 rounded transition-colors"
            title="Copy draft to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            id="btn-download-letter"
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-stone-700 hover:bg-stone-600 text-stone-100 rounded transition-colors"
            title="Download letter as .txt file"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            id="btn-print-letter"
            type="button"
            onClick={handlePrint}
            className="p-1 text-stone-300 hover:text-white rounded hover:bg-stone-700 transition-colors"
            title="Print formal letter"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-fullscreen-toggle"
            type="button"
            onClick={handleToggleFullscreen}
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
              isFullscreen
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
            }`}
            title={isFullscreen ? 'Exit full screen (Esc)' : 'Open document canvas full screen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Full Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full Screen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Placeholders Editor Drawer */}
      {showPlaceholderManager && extractedPlaceholders.length > 0 && (
        <div className="bg-amber-50/95 border-b border-amber-200 px-4 py-3 shrink-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>Fill In Specific Names & Numbers (Preserves Objective Tone)</span>
            </div>
            <span className="text-[11px] text-amber-800 hidden sm:inline">
              Unknown names are never invented by the agent; you can type them directly here.
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {extractedPlaceholders.map((ph) => (
              <div key={ph} className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-stone-700 truncate" title={ph}>
                  [{ph}]
                </label>
                <input
                  type="text"
                  placeholder={`Replace [${ph}]`}
                  value={replacements[ph] || ''}
                  onChange={(e) => handlePlaceholderChange(ph, e.target.value)}
                  className="px-2.5 py-1 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800 placeholder:text-stone-400"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Letter Document Paper / Viewport */}
      <div
        className={`flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 flex justify-center transition-colors ${
          isFullscreen ? 'bg-stone-950/60' : 'bg-stone-200/50'
        }`}
      >
        <div
          className={`w-full ${paperWidthClass} bg-white shadow-md border border-stone-200/90 rounded-lg p-6 sm:p-10 lg:p-12 font-serif leading-relaxed text-stone-800 space-y-4 selection:bg-amber-100 transition-all duration-150 h-fit`}
          style={{
            fontSize: `${(15 * zoomLevel) / 100}px`,
            lineHeight: 1.68,
          }}
        >
          {/* Header watermark */}
          <div className="border-b border-stone-200 pb-3 mb-4 flex items-center justify-between text-xs font-sans text-stone-500 uppercase tracking-wider">
            <span>Formal Communication</span>
            <span>Document Preview</span>
          </div>

          {/* Letter Body */}
          <div className="whitespace-pre-wrap leading-relaxed font-['Source_Serif_4',Georgia,serif]">
            {finalizedLetter}
          </div>

          {/* Footer stats */}
          <div className="border-t border-stone-200 pt-4 mt-6 text-xs font-sans text-stone-400 flex flex-wrap items-center justify-between gap-2">
            <span>
              Word count: <strong className="text-stone-600 font-semibold">{wordCount}</strong> (Strict target: 150–220 words)
            </span>
            <span>Objective facts • First-person impact • Constructive remedy</span>
          </div>
        </div>
      </div>

      {/* Quick refinement triggers */}
      {onSendFeedback && (
        <div className="bg-white border-t border-stone-200 px-4 py-2.5 shrink-0 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-stone-500 font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" /> Refine Draft:
          </span>
          <button
            type="button"
            onClick={() => onSendFeedback('Please adjust the draft to be more diplomatic and collaborative in tone.')}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs whitespace-nowrap transition-colors"
          >
            Make More Diplomatic
          </button>
          <button
            type="button"
            onClick={() => onSendFeedback('Please make the tone firmer and more urgent regarding the immediate deadline.')}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs whitespace-nowrap transition-colors"
          >
            Make Firmer / Urgent
          </button>
          <button
            type="button"
            onClick={() => onSendFeedback('Please ensure the personal and academic/work impact is highlighted more clearly.')}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs whitespace-nowrap transition-colors"
          >
            Emphasize Personal Impact
          </button>
          <button
            type="button"
            onClick={() => onSendFeedback('Can you tighten the wording to be closer to 175 words?')}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs whitespace-nowrap transition-colors"
          >
            Tighten Word Count
          </button>
        </div>
      )}
    </div>
  );
};
