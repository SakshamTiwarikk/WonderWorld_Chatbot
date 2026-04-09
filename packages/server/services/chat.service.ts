import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import {
   addMessage,
   getHistory,
} from '../repositories/conversation.repository';

const template = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'chatbot.txt'),
   'utf-8'
);

// ✅ Create client here (or inject later if scaling)
const client = new OpenAI({
   apiKey: process.env.GROQ_API_KEY,
   baseURL: 'https://api.groq.com/openai/v1',
});

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

export async function handleChat(conversationId: string, prompt: string) {
   // ✅ Store user message
   addMessage(conversationId, {
      role: 'user',
      content: prompt,
   });

   const history = getHistory(conversationId);

   // ✅ Call LLM
   const response = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'system', content: instructions }, ...history],
   });

   const reply = response.choices[0].message.content || '';

   // ✅ Store assistant reply
   addMessage(conversationId, {
      role: 'assistant',
      content: reply,
   });

   return reply;
}
