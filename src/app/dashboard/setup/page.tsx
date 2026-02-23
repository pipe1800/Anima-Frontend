"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { encryptToken } from "@/utils/encryption";
import Link from "next/link";

export default function SetupAgentPage() {
  const [name, setName] = useState("Lumi Local");
  const [url, setUrl] = useState("ws://localhost:18789");
  const [token, setToken] = useState("");
  
  const [status, setStatus] = useState<"idle" | "testing" | "encrypting" | "saving" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("testing");

    try {
      // 1. Test WebSocket Connection
      await new Promise<void>((resolve, reject) => {
        const wsUrl = new URL(url);
        // Add basic v3 protocol params for OpenClaw
        wsUrl.searchParams.set("token", token);
        wsUrl.searchParams.set("clientId", "anima-dashboard");

        const ws = new WebSocket(wsUrl.toString());
        const timeout = setTimeout(() => {
          ws.close();
          reject(new Error("Connection timed out after 5 seconds."));
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve();
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          ws.close();
          reject(new Error("WebSocket connection refused. Check your URL, Token, and ensure the Gateway is running."));
        };
      });

      // 2. Client-Side Encryption
      setStatus("encrypting");
      const encryptedToken = await encryptToken(token);

      // 3. Save to Supabase (Zero-Knowledge)
      setStatus("saving");
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase
        .from("agents")
        .insert({
          owner_id: user.id,
          name,
          gateway_url: url,
          gateway_token_encrypted: encryptedToken,
          is_active: true
        });

      if (insertError) throw insertError;

      setStatus("success");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);

    } catch (err: any) {
      setStatus("idle");
      setError(err.message || "An unknown error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans p-8">
      <Link href="/dashboard" className="text-sm text-white/40 hover:text-white mb-8 inline-flex items-center gap-2 transition-colors w-fit">
        &larr; Back to Dashboard
      </Link>

      <div className="max-w-xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2 tracking-tight">Configure Your Agent</h1>
          <p className="text-white/50">Link your local OpenClaw gateway securely. Your token never leaves your browser unencrypted.</p>
        </div>

        <form onSubmit={handleSetup} className="flex flex-col gap-6 bg-[#111] border border-white/10 p-8 rounded-2xl">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Agent Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={status !== "idle"}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono text-sm disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Gateway URL</label>
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={status !== "idle"}
              placeholder="ws://localhost:18789" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-amber-500 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono text-sm disabled:opacity-50"
            />
            <p className="text-xs text-white/30 font-mono">Usually ws://localhost:18789 or an ngrok tunnel.</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80 flex justify-between">
              Gateway Token 
              <span className="text-green-400 text-xs flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                E2E Encrypted
              </span>
            </label>
            <input 
              type="password" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              disabled={status !== "idle"}
              placeholder="Your OpenClaw auth token" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono text-sm tracking-widest disabled:opacity-50"
            />
            <p className="text-xs text-white/30 font-mono">Found in your OpenClaw CLI startup logs.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-mono flex items-start gap-3">
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={status !== "idle"}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 px-4 rounded-xl mt-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)] disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
          >
            {status === "idle" && "Test Connection & Save"}
            {status === "testing" && <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Handshaking with Gateway...</>}
            {status === "encrypting" && <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Encrypting Token locally...</>}
            {status === "saving" && <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Saving Configuration...</>}
            {status === "success" && "Connected! Redirecting..."}
          </button>
        </form>
      </div>
    </div>
  );
}
