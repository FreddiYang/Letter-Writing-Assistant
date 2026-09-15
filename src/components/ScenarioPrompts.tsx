import React from 'react';
import { SCENARIO_TEMPLATES } from '../data/scenarios';
import { ScenarioTemplate } from '../types';
import { Sparkles } from 'lucide-react';

interface ScenarioPromptsProps {
  onSelectScenario: (scenario: ScenarioTemplate) => void;
}

export const ScenarioPrompts: React.FC<ScenarioPromptsProps> = ({ onSelectScenario }) => {
  return (
    <div className="py-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>Or start with an example situation:</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SCENARIO_TEMPLATES.map((sc) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => onSelectScenario(sc)}
            className="text-left p-3 rounded-lg border border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50/30 transition-all text-xs group"
          >
            <p className="font-semibold text-stone-800 group-hover:text-stone-900 mb-0.5">
              {sc.title}
            </p>
            <p className="text-stone-500 text-[11px] line-clamp-2">
              {sc.subtitle}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
