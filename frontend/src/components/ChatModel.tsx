"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import chatService from "@/services/chatService";
import { ChatResponse, ChatRequest } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  sender: "user" | "assistant";
  text: string;
  source?: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const dragRef = useRef(null);

  // Scroll to bottom when new message arrives
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Show welcome message on open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ sender: "assistant", text: "Hello! How can I help you?" }]);
    }
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    // Delay AI typing indicator for 2 seconds
    setLoading(false); // Initially false before delay

    // wait 2 seconds before showing typing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(true);

    try {
      const request: ChatRequest = {
        message: input,
        language: "en", // fixed typo from languge
      };

      const response: ChatResponse = await chatService.GetReply(request);

      // Append assistant reply
      if (response) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "assistant",
            text: response.message,
            source: response.source,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "⚠️ Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      ref={dragRef}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      className="fixed bottom-24 right-8 z-50 flex flex-col items-end"
    >
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full w-14 h-14 shadow-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </Button>
      )}

      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-96 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h2 className="font-semibold">Saif Assistant</h2>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl max-w-[85%] ${
                  msg.sender === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100 mr-auto"
                }`}
              >
                <div>{msg.text}</div>
                {msg.source && (
                  <div className="text-[10px] text-gray-500 mt-1">Source: {msg.source}</div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-gray-500 italic">Saif Assistant is typing...</div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
