"use client";

import { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  documents?: Array<{
    content: string;
    metadata?: Record<string, any>;
  }>;
  usage?: {
    user: string;
    usage_count: number;
    usage_limit: number;
    remaining: number;
  };
}

export default function AskAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI response
  const getAIResponse = async (
    userMessage: string
  ): Promise<{
    response: string;
    documents?: Array<{ content: string; metadata?: Record<string, any> }>;
    usage?: {
      user: string;
      usage_count: number;
      usage_limit: number;
      remaining: number;
    };
  }> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      return {
        response: data.response,
        documents: data.documents,
        usage: data.usage,
      };
    } catch (error) {
      console.error("Error getting AI response:", error);
      return {
        response: "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI",
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.response,
        role: "assistant",
        timestamp: new Date(),
        documents: aiResponse.documents,
        usage: aiResponse.usage,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const shareMessage = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: "AI Chat Message",
        text: content,
      });
    } else {
      copyMessage(content);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: "#f4f6f4" }}
    >
      {/* Header */}
      <header
        className="bg-white shadow-sm px-6 py-4"
        style={{ borderBottom: "1px solid #b3deb2" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
            style={{ backgroundColor: "#50c34e" }}
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#182411" }}>
              AI Assistant
            </h1>
            <p className="text-sm" style={{ color: "#174d20" }}>
              ผู้ช่วย AI ที่พร้อมตอบคำถามของคุณ
            </p>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#b3deb2" }}
              >
                <ChatBubbleLeftRightIcon
                  className="w-10 h-10"
                  style={{ color: "#174d20" }}
                />
              </div>
              <h2
                className="text-3xl font-bold mb-3"
                style={{ color: "#182411" }}
              >
                ยินดีต้อนรับสู่ AI Assistant
              </h2>
              <p className="mb-8 text-lg" style={{ color: "#174d20" }}>
                เริ่มสนทนาด้วยการพิมพ์คำถามหรือข้อความของคุณด้านล่าง
              </p>
              <div className="grid grid-cols-1 gap-3 text-left">
                {[
                  "อธิบายเกี่ยวกับ React Hooks",
                  "วิธีการใช้ Next.js App Router",
                  "Best Practices สำหรับ TypeScript",
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(suggestion)}
                    className="p-4 bg-white rounded-xl transition-all duration-200 hover:shadow-md text-left border hover:scale-105"
                    style={{
                      borderColor: "#b3deb2",
                      color: "#182411",
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                    style={{ backgroundColor: "#50c34e" }}
                  >
                    AI
                  </div>
                )}

                <div
                  className={`group max-w-3xl ${
                    message.role === "user" ? "order-first" : ""
                  }`}
                >
                  <div
                    className={`p-4 rounded-2xl shadow-sm ${
                      message.role === "user"
                        ? "ml-auto text-white"
                        : "bg-white border"
                    }`}
                    style={{
                      backgroundColor:
                        message.role === "user" ? "#50c34e" : "white",
                      borderColor:
                        message.role === "assistant"
                          ? "#b3deb2"
                          : "transparent",
                    }}
                  >
                    <div
                      className="whitespace-pre-wrap"
                      style={{
                        color: message.role === "user" ? "white" : "#182411",
                      }}
                    >
                      {message.content}
                    </div>

                    {message.role === "assistant" &&
                      message.documents &&
                      message.documents.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4
                            className="text-sm font-semibold mb-2"
                            style={{ color: "#174d20" }}
                          >
                            อ้างอิงจากเอกสาร:
                          </h4>
                          <div className="space-y-2">
                            {message.documents.map((doc, index) => (
                              <div
                                key={index}
                                className="text-sm p-2 bg-gray-50 rounded"
                                style={{ color: "#182411" }}
                              >
                                {doc.content}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {message.role === "assistant" && message.usage && (
                      <div
                        className="mt-2 text-xs"
                        style={{ color: "#174d20" }}
                      >
                        <div>ผู้ใช้: {message.usage.user}</div>
                        <div>
                          การใช้งาน: {message.usage.usage_count}/
                          {message.usage.usage_limit}
                        </div>
                        <div>คงเหลือ: {message.usage.remaining}</div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-2 mt-2 text-xs ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    style={{ color: "#174d20" }}
                  >
                    <span>{formatTime(message.timestamp)}</span>
                    {message.role === "assistant" && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="p-1 rounded transition-colors"
                          style={{ color: "#174d20" }}
                          title="คัดลอก"
                        >
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => shareMessage(message.content)}
                          className="p-1 rounded transition-colors"
                          style={{ color: "#174d20" }}
                          title="แชร์"
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {message.role === "user" && (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                    style={{ backgroundColor: "#174d20" }}
                  >
                    คุณ
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                  style={{ backgroundColor: "#50c34e" }}
                >
                  AI
                </div>
                <div
                  className="bg-white rounded-2xl p-4 shadow-sm border"
                  style={{ borderColor: "#b3deb2" }}
                >
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ backgroundColor: "#50c34e" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "#50c34e",
                        animationDelay: "0.1s",
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "#50c34e",
                        animationDelay: "0.2s",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div
        className="bg-white shadow-lg p-6"
        style={{ borderTop: "1px solid #b3deb2" }}
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                disabled={isLoading}
                className="w-full p-4 pr-12 rounded-xl resize-none focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm border text-black placeholder-gray-500"
                style={{
                  minHeight: "60px",
                  maxHeight: "120px",
                  borderColor: "#b3deb2",
                  backgroundColor: "white",
                  color: "#000000",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#50c34e";
                  e.target.style.boxShadow = "0 0 0 3px rgba(80, 195, 78, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#b3deb2";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-4 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 shadow-md hover:shadow-lg"
              style={{ backgroundColor: "#50c34e" }}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
          <div
            className="text-xs mt-3 text-center"
            style={{ color: "#174d20" }}
          >
            กด Enter เพื่อส่งข้อความ, Shift + Enter เพื่อขึ้นบรรทัดใหม่
          </div>
        </form>
      </div>
    </div>
  );
}
