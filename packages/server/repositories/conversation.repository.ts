type Message = {
   role: 'user' | 'assistant';
   content: string;
};

const conversations = new Map<string, Message[]>();

export function getConversation(conversationId: string): Message[] {
   if (!conversations.has(conversationId)) {
      conversations.set(conversationId, []);
   }
   return conversations.get(conversationId)!;
}

export function addMessage(conversationId: string, message: Message) {
   const history = getConversation(conversationId);
   history.push(message);
}

export function getHistory(conversationId: string): Message[] {
   return getConversation(conversationId);
}
