import React from 'react';
import { X, Shield, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900">Writing Assistant Behavioral Rules</h3>
              <p className="text-xs text-stone-500">Built-in principles for accurate, credible complaint letters</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-sm text-stone-700">
          <div>
            <h4 className="font-semibold text-stone-900 flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Empathetic Listening & Clarification First
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed pl-6">
              In the first response, your feelings are acknowledged in one brief sentence, followed by up to four focused clarification questions. No premature draft is produced until your context, requested remedy, tone, and sensitive content preferences are established.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 flex items-center gap-2 mb-1.5">
              <Scale className="w-4 h-4 text-amber-600" />
              2. Experience vs. Interpretation
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed pl-6">
              Subjective impressions ("it feels unfair") are not converted into established policy violations. Prior communications and ambiguous pronouns ("you") are verified to prevent misunderstanding.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 flex items-center gap-2 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              3. Strict Zero-Fabrication Standard
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed pl-6">
              Dates, time spent, specific policies, other people's motives, shared peer opinions, or names are never invented. Unknown names default to standard placeholders like <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-900">[Teacher's Name]</code> or <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-900">[Your Name]</code>.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              4. Three Tones & Sensitive Claims Handling
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed pl-6">
              Choose between <strong>Diplomatic</strong>, <strong>Firm-but-respectful</strong>, or <strong>Urgent</strong>. For sensitive allegations (such as unauthorized AI accusations, discrimination, or colleague misconduct), you choose whether to <em>omit</em>, frame as a <em>neutral policy-clarification question</em>, or state a <em>carefully qualified observation</em> without unsupported claims.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              5. 150–220 Word Conciseness Target
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed pl-6">
              Recipients are far more responsive to structured, concise letters. The draft preserves at least one concrete detail and one personal impact in first-person language, avoiding repeated venting or formulaic praise.
            </p>
          </div>

          <div className="bg-stone-100 p-3.5 rounded-lg border border-stone-200">
            <h5 className="font-medium text-xs text-stone-900 uppercase tracking-wider mb-1">
              What the Assistant Does NOT Do
            </h5>
            <p className="text-xs text-stone-600">
              The user retains full control over inclusion, tone, remedy, and final approval. The assistant never insults, threatens, falsifies evidence, contacts the recipient, or sends letters on your behalf.
            </p>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
