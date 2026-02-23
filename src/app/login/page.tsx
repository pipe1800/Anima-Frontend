"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* Left Side - Image Panel */}
      <div className="hidden lg:flex w-1/2 relative bg-[#111] items-center justify-center border-r border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
        <Image 
          src="/login-bg.jpg" 
          alt="Anima Dashboard Abstract" 
          fill 
          className="object-cover opacity-80"
          priority
        />
        <div className="relative z-20 flex flex-col items-center text-center px-12 pb-24">
          <div className="w-24 h-24 mb-8">
            <Image src="/anima-logo.svg" alt="Anima Logo" width={96} height={96} className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
          </div>
          <h2 className="text-5xl font-black tracking-tight mb-6">Command.<br/>Control.<br/>Create.</h2>
          <p className="text-white/60 text-lg font-light max-w-sm leading-relaxed">Access your zero-liability agent command center and orchestrate the future.</p>
        </div>
      </div>

      {/* Right Side - Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        {/* Back Link */}
        <Link href="/" className="absolute top-8 left-8 text-sm font-medium text-white/40 hover:text-white transition-colors flex items-center gap-2 group">
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Home
        </Link>

        <div className="w-full max-w-[400px] flex flex-col">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Image src="/anima-logo.svg" alt="Anima Logo" width={56} height={56} className="drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          </div>
          
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black tracking-tight mb-3">Welcome back</h1>
            <p className="text-white/50">Log in to your Anima dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <label className="text-sm font-medium text-white/80" htmlFor="email">Email address</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="you@example.com" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono text-sm disabled:opacity-50"
              />
            </div>
            
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-white/80" htmlFor="password">Password</label>
                <Link href="#" className="text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors">Forgot password?</Link>
              </div>
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••••••" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono text-lg tracking-widest disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm font-medium bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 px-4 rounded-xl mt-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_-5px_rgba(245,158,11,0.4)] disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-10">
            Don&apos;t have an account? <Link href="/signup" className="text-amber-500 hover:text-amber-400 font-bold transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
