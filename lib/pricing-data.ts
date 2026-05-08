export const PRICING_DATA = {
  Cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
    Enterprise: 50, // Estimate
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
    Enterprise: 45, // Estimate
  },
  'ChatGPT (OpenAI)': {
    Plus: 20,
    Team: 30, // min 2 users
    Enterprise: 60, // Estimate
  },
  'Anthropic API direct': {
    'Usage-based': 0,
  },
  'OpenAI API direct': {
    'Usage-based': 0,
  },
  Gemini: {
    Pro: 19.99,
    Ultra: 29.99, // Estimate
    API: 0,
  },
  Windsurf: {
    Free: 0,
    Pro: 15,
    Team: 35,
  },
} as const;

// Types
export type ToolName = keyof typeof PRICING_DATA;
export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';
