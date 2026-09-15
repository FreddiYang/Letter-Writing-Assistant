import React from 'react';
import { MessageSquarePlus } from 'lucide-react';

interface ToneAndClarificationHelpersProps {
  onSelectOption: (text: string) => void;
  disabled?: boolean;
}

export const ToneAndClarificationHelpers: React.FC<ToneAndClarificationHelpersProps> = ({
  onSelectOption,
  disabled,
}) => {
  const toneOptions = [
    { label: 'Diplomatic Tone', text: 'I would prefer a diplomatic and collaborative tone.' },
    { label: 'Firm-but-Respectful Tone', text: 'I want a firm-but-respectful tone.' },
    { label: 'Urgent Tone', text: 'I need an urgent tone given the time-sensitive consequences.' },
  ];

  const sensitiveOptions = [
    {
      label: 'Omit Sensitive Accusations',
      text: 'Please omit the sensitive claims about others and focus entirely on my direct experience.',
    },
    {
      label: 'Neutral Policy Question',
      text: 'Frame the sensitive issue as a neutral question requesting policy clarification.',
    },
    {
      label: 'Qualified Observation',
      text: 'State it as a carefully qualified observation without accusing anyone of misconduct.',
    },
  ];

  const actionOptions = [
    {
      label: 'Request 1-on-1 Review',
      text: 'Desired remedy: I would like to request a formal 1-on-1 meeting to review the evaluation.',
    },
    {
      label: 'Request Written Explanation / Refund',
      text: 'Desired remedy: A written explanation and immediate correction or refund.',
    },
    {
      label: 'Proceed with Placeholders',
      text: 'You can proceed with placeholders like [Recipient Name] and [Your Name] for now.',
    },
  ];

  return (
    <div className="flex flex-col gap-2 py-2 text-xs">
      <div className="flex items-center gap-1.5 text-stone-500 font-medium px-1">
        <MessageSquarePlus className="w-3.5 h-3.5 text-amber-600" />
        <span>Quick answer suggestions for clarification:</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[11px] text-stone-400 mr-0.5">Tone:</span>
          {toneOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              disabled={disabled}
              onClick={() => onSelectOption(opt.text)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 rounded-full transition-colors disabled:opacity-50"
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 flex-wrap mt-0.5">
          <span className="text-[11px] text-stone-400 mr-0.5">Sensitive claims:</span>
          {sensitiveOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              disabled={disabled}
              onClick={() => onSelectOption(opt.text)}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-full transition-colors disabled:opacity-50"
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 flex-wrap mt-0.5">
          <span className="text-[11px] text-stone-400 mr-0.5">Remedy & Placeholders:</span>
          {actionOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              disabled={disabled}
              onClick={() => onSelectOption(opt.text)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 rounded-full transition-colors disabled:opacity-50"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
