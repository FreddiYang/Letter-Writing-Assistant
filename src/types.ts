export type MessageRole = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  letterDraft?: string | null;
  timestamp: string;
}

export type ToneType = 'diplomatic' | 'firm_respectful' | 'urgent';

export type SensitiveClaimHandling = 'omit' | 'neutral_policy' | 'qualified_observation';

export interface LetterPlaceholder {
  key: string;
  rawPlaceholder: string;
  label: string;
  value: string;
}

export interface ScenarioTemplate {
  id: string;
  title: string;
  subtitle: string;
  initialPrompt: string;
}
