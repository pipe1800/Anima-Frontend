"use client";

import { useEffect, useState, useRef } from "react";
import { decryptToken } from "@/utils/encryption";
import Image from "next/image";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "model" | "system";
  content: string;
}

export default function CanvasClient({ agent }: { agent: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"decrypting" | "connecting" | "connected" | "disconnected" | "error">("decrypting");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [emotion, setEmotion] = useState("idle");

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    let ws: WebSocket;
    
    const init = async () => {
      try {
        setStatus("decrypting");
        const token = await decryptToken(agent.gateway_token_encrypted);
        
        setStatus("connecting");
        const wsUrl = new URL(agent.gateway_url);
        // Protocol v3 often accepts token via query param
        wsUrl.searchParams.set("token", token);
        wsUrl.searchParams.set("clientId", "webchat");

        ws = new WebSocket(wsUrl.toString());
        wsRef.current = ws;

        ws.onopen = () => {
          setStatus("connected");
          
          // Send Connect Request for Protocol v3
          ws.send(JSON.stringify({
            type: "req",
            method: "connect",
            params: {
              minProtocol: 3,
              maxProtocol: 3,
              client: { id: "webchat", mode: "webchat" },
              auth: { token: token }
            },
            id: crypto.randomUUID()
          }));

          // Optional: Fetch History
          ws.send(JSON.stringify({
            type: "req",
            method: "chat.history",
            params: { sessionKey: "default", limit: 50 },
            id: crypto.randomUUID()
          }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle History Response
            if (data.type === "res" && data.method === "chat.history" && data.result?.messages) {
              const history = data.result.messages.map((m: any) => ({
                id: m.id || crypto.randomUUID(),
                role: m.role,
                content: m.content?.map((c: any) => c.text).join("") || "",
              }));
              setMessages(history);
            }

            // Handle Live Chat Events
            if (data.type === "event" && data.event === "chat") {
              const { state, message } = data.payload;
              const msgId = message.id || "live-msg";
              const textContent = message.content?.map((c: any) => c.text).join("") || "";

              setMessages((prev) => {
                const existingIndex = prev.findIndex(m => m.id === msgId);
                if (existingIndex > -1) {
                  const updated = [...prev];
                  updated[existingIndex] = { ...updated[existingIndex], content: textContent };
                  return updated;
                } else {
                  return [...prev, { id: msgId, role: message.role, content: textContent }];
                }
              });

              // Extract Emotion Tags if present (e.g. [[emotion:name=joy...]])
              const emotionMatch = textContent.match(/\[\[emotion:name=([^|]+)/);
              if (emotionMatch && emotionMatch[1]) {
                setEmotion(emotionMatch[1]);
              }
            }
          } catch (err) {
            console.error("Failed to parse WS message", err);
          }
        };

        ws.onclose = () => setStatus("disconnected");
        ws.onerror = () => setStatus("error");

      } catch (err) {
        console.error("Setup Error", err);
        setStatus("error");
      }
    };

    init();

    return () => {
      if (ws) ws.close();
    };
  }, [agent]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "connected" || !wsRef.current) return;

    const reqId = crypto.randomUUID();
    const userMsg: Message = { id: reqId, role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);

    wsRef.current.send(JSON.stringify({
      type: "req",
      method: "chat.send",
      params: {
        sessionKey: "default",
        message: input,
        deliver: false
      },
      id: reqId
    }));

    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-[#0a0a0a] to-[#0a0a0a] z-0 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <Image 
        src="/login-bg.jpg" 
        alt="Canvas Background" 
        fill 
        className="object-cover opacity-10 pointer-events-none mix-blend-screen"
      />

      {/* Navbar */}
      <nav className="w-full h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-xl z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10 text-white/50">
            &larr;
          </Link>
          <div className="flex items-center gap-3">
            <Image src="/anima-logo.svg" alt="Anima Logo" width={24} height={24} />
            <span className="font-bold tracking-widest text-sm text-white/90 uppercase">{agent.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse' : status === 'error' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'}`} />
            <span className="text-xs font-mono uppercase tracking-wider text-white/60">
              {status}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden z-10 p-6 gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* Left Panel - Agent State */}
        <aside className="w-80 hidden lg:flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#111]/60 backdrop-blur-xl p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-4 border-white/5 bg-gradient-to-b from-white/10 to-transparent flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-amber-500/20 blur-xl animate-pulse" />
              <Image src="/anima-logo.svg" alt="Agent Avatar" width={64} height={64} className="opacity-80" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest">{agent.name}</h2>
            <p className="text-sm font-mono text-amber-500 mt-1 uppercase tracking-wider">Status: Online</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111]/60 backdrop-blur-xl p-6 flex-1 flex flex-col">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Emotion Engine</h3>
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="w-24 h-24 rounded-full bg-amber-500/20 blur-2xl absolute" />
              <div className="w-16 h-16 rounded-full border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center z-10 bg-[#111]">
                <span className="text-amber-500 font-mono text-xs uppercase">{emotion}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Panel - Chat Canvas */}
        <section className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-[#111]/60 backdrop-blur-xl overflow-hidden relative shadow-2xl">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
            {messages.length === 0 && status === "connected" && (
              <div className="flex flex-col items-center justify-center h-full text-white/30 gap-4">
                <Image src="/anima-logo.svg" alt="Anima Logo" width={48} height={48} className="opacity-20 grayscale" />
                <p className="font-mono text-sm uppercase tracking-widest">Connection established. Ready for input.</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={msg.id || i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  msg.role === 'user' 
                    ? 'bg-amber-600 text-white shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]' 
                    : 'bg-white/5 border border-white/10 text-white/90 font-light leading-relaxed'
                }`}>
                  <p className="whitespace-pre-wrap">
                    {/* Strip emotion tags for display */}
                    {msg.content.replace(/\[\[.*?\]\]/g, '').trim()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <form onSubmit={sendMessage} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={status !== "connected"}
                placeholder="Message your agent..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-6 pr-16 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || status !== "connected"}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 disabled:text-white/20 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </form>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
