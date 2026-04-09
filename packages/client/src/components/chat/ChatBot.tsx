import axios from 'axios';
import { useRef, useState } from 'react';
import ChatInput, { type ChatFormData } from './ChatInput';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import TypingIndicator from './TypingIndicator';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');
   const conversationId = useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         setError('');
         popAudio.play();

         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationAudio.play();
      } catch (error) {
         console.error(error);
         setError('Something went wrong, try again!');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-full bg-gray-50 rounded-2xl shadow-lg border border-gray-200">
         {/* Messages */}
         <div className="flex flex-col flex-1 overflow-y-auto px-3 py-4">
            <ChatMessages messages={messages} />

            {isBotTyping && <TypingIndicator />}

            {error && <p className="text-red-500 text-sm px-2">{error}</p>}
         </div>

         {/* Input */}
         <div className="border-t border-gray-200 bg-white p-3">
            <ChatInput onSubmit={onSubmit} />
         </div>
      </div>
   );
};

export default ChatBot;
