import type { Request, Response } from 'express';
import z from 'zod';
import { handleChat } from '../services/chat.service';

// ✅ Validation schema
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long'),
   conversationId: z.string().uuid(),
});

export async function chatController(req: Request, res: Response) {
   try {
      const parseResult = chatSchema.safeParse(req.body);

      if (!parseResult.success) {
         return res.status(400).json(parseResult.error.format());
      }

      const { prompt, conversationId } = parseResult.data;

      const reply = await handleChat(conversationId, prompt);

      res.json({
         message: reply,
         conversationId,
      });
   } catch (error: any) {
      console.error('❌ Controller Error:', error);

      res.status(500).json({
         error: error.message || 'Internal Server Error',
      });
   }
}
