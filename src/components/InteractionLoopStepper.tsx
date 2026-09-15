import React from 'react';
import { HeartHandshake, HelpCircle, FileEdit, CheckCheck } from 'lucide-react';

export type AssistantStage =
  | 'start'
  | 'clarify_choices'
  | 'draft_generated'
  | 'review_revise';

interface InteractionLoopStepperProps {
  currentStage: AssistantStage;
}

export const InteractionLoopStepper: React.FC<InteractionLoopStepperProps> = ({
  currentStage,
}) => {
  const steps = [
    {
      id: 'start',
      label: '1. Acknowledge & Listen',
      desc: 'No rush, validate feelings without prejudging',
      icon: HeartHandshake,
      active: currentStage === 'start',
      completed:
        currentStage === 'clarify_choices' ||
        currentStage === 'draft_generated' ||
        currentStage === 'review_revise',
    },
    {
      id: 'clarify_choices',
      label: '2. Clarify Facts & Tone',
      desc: 'Recipient, remedy, preferred tone & sensitive claims',
      icon: HelpCircle,
      active: currentStage === 'clarify_choices',
      completed:
        currentStage === 'draft_generated' ||
        currentStage === 'review_revise',
    },
    {
      id: 'draft_generated',
      label: '3. Concise Draft',
      desc: '150–220 words with verified details & placeholders',
      icon: FileEdit,
      active: currentStage === 'draft_generated',
      completed: currentStage === 'review_revise',
    },
    {
      id: 'review_revise',
      label: '4. Review & Refine',
      desc: 'Factual alternatives for unsupported claims',
      icon: CheckCheck,
      active: currentStage === 'review_revise',
      completed: false,
    },
  ];

  return (
    <div className="w-full bg-stone-100/70 border-b border-stone-200 px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCurrent = step.active;
            const isDone = step.completed;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                  isCurrent
                    ? 'bg-white shadow-xs border border-amber-300 ring-1 ring-amber-200'
                    : isDone
                    ? 'bg-white/60 border border-stone-200/80 text-stone-700'
                    : 'bg-stone-50/50 border border-stone-200/50 text-stone-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    isCurrent
                      ? 'bg-stone-900 text-amber-300'
                      : isDone
                      ? 'bg-stone-800 text-stone-100'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-semibold truncate ${
                      isCurrent
                        ? 'text-stone-900'
                        : isDone
                        ? 'text-stone-800'
                        : 'text-stone-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate hidden lg:block">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
