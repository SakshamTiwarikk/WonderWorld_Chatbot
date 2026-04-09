import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type Message = {
   content: string;
   role: 'user' | 'bot';
};

type Props = {
   messages: Message[];
};

const ChatMessages = ({ messages }: Props) => {
   const lastMessageRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onCopyMessage = (e: React.ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   return (
      <div className="flex flex-col gap-4 px-2 py-4">
         {messages.map((message, index) => {
            const isUser = message.role === 'user';

            return (
               <div
                  key={index}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  className={`flex items-end gap-2 ${
                     isUser ? 'justify-end' : 'justify-start'
                  }`}
               >
                  {/* Bot Avatar */}
                  {!isUser && (
                     <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                        🤖
                     </div>
                  )}

                  {/* Message Bubble */}
                  <div
                     onCopy={onCopyMessage}
                     className={`
                group relative px-4 py-2 max-w-[75%] 
                rounded-2xl text-sm leading-relaxed
                shadow-sm transition-all duration-200
                prose prose-sm break-words
                ${
                   isUser
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                }
                hover:shadow-md
              `}
                  >
                     <div
                        className={`
    prose prose-sm max-w-none break-words
    prose-table:border prose-table:border-gray-300
    prose-th:bg-gray-100 prose-th:p-2
    prose-td:p-2
    ${isUser ? 'prose-invert text-white' : ''}
  `}
                     >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                           {message.content}
                        </ReactMarkdown>
                     </div>

                     {/* Copy hint */}
                     <span className="absolute -top-5 right-2 text-xs opacity-0 group-hover:opacity-100 transition">
                        Copy
                     </span>
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                     <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                        U
                     </div>
                  )}
               </div>
            );
         })}
      </div>
   );
};

export default ChatMessages;
