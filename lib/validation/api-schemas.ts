import { z } from 'zod';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
  timestamp: z.number().optional(),
});

export const ChatResponseSchema = z.object({
  id: z.string(),
  choices: z.array(z.object({
    message: ChatMessageSchema,
    finish_reason: z.string(),
  })),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

export const TTSResponseSchema = z.object({
  audio: z.instanceof(ArrayBuffer),
  metadata: z.object({
    duration: z.number(),
    voice_id: z.string(),
  }).optional(),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type TTSResponse = z.infer<typeof TTSResponseSchema>; 