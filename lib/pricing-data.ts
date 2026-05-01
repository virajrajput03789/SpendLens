export const PRICING_DATA = {
  Cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
  },
  'GitHub Copilot': {
    Individual: 10,
    Business: 19,
    Enterprise: 39,
  },
  'Claude (Anthropic)': {
    Free: 0,
    Pro: 20,
    Max: 100,
    Team: 30, // min 5 users
  },
  'ChatGPT (OpenAI)': {
    Plus: 20,
    Team: 30, // min 2 users
  },
  Gemini: {
    Pro: 19.99,
  },
  Windsurf: {
    Free: 0,
    Pro: 15,
    Team: 35,
  },
} as const;

// Types
export type ToolName = keyof typeof PRICING_DATA | 'Anthropic API direct' | 'OpenAI API direct' | 'Gemini API';
export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';
