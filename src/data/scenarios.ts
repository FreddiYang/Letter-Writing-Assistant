import { ScenarioTemplate } from '../types';

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: 'academic_grading',
    title: 'Academic / Coursework Dispute',
    subtitle: 'Confusing project deduction & unaddressed rubric criteria',
    initialPrompt:
      "I received a 65% on my final group economics paper because the professor wrote 'unoriginal structure and potential unauthorized AI assistance,' but my sections were completely researched from scratch using library JSTOR papers. When I emailed asking for an explanation, they just said grades are final without answering my questions about the rubric.",
  },
  {
    id: 'billing_dispute',
    title: 'Unauthorized Billing Charge',
    subtitle: 'Repeated subscription fee after confirmed cancellation',
    initialPrompt:
      "I cancelled my gym membership back in July and received an email cancellation confirmation number. However, my credit card was just charged $89 for the second month in a row. When I called phone support, the representative told me the system showed no record and refused to process a refund.",
  },
  {
    id: 'landlord_maintenance',
    title: 'Essential Housing Maintenance',
    subtitle: 'Broken heating during cold weather without ETA',
    initialPrompt:
      "The heating unit in my rental apartment stopped working five days ago. Night temperatures have dropped below 40°F. I submitted two maintenance tickets and called the building manager twice, but I haven't received any written timeline or temporary space heater.",
  },
  {
    id: 'workplace_scheduling',
    title: 'Workplace Scheduling Conflict',
    subtitle: 'Shift removed without mandatory advance notice',
    initialPrompt:
      "My scheduled weekend shifts were deleted from the team schedule with less than 12 hours notice, directly conflicting with our department's 48-hour schedule change agreement. This resulted in a lost weekend of wages that I rely on for rent.",
  },
];
