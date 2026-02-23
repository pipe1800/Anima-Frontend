"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleOAuth = async (provider: 'google' | 'discord') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
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
          <h2 className="text-5xl font-black tracking-tight mb-6">Build.<br/>Command.<br/>Dominate.</h2>
          <p className="text-white/60 text-lg font-light max-w-sm leading-relaxed">Join Anima and build the ultimate command center for your local agents.</p>
        </div>
      </div>

      {/* Right Side - Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative overflow-y-auto">
        <Link href="/" className="absolute top-8 left-8 text-sm font-medium text-white/40 hover:text-white transition-colors flex items-center gap-2 group">
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Home
        </Link>

        <div className="w-full max-w-[400px] flex flex-col py-10">
          <div className="lg:hidden flex justify-center mb-10">
            <Image src="/anima-logo.svg" alt="Anima Logo" width={56} height={56} className="drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          </div>
          
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black tracking-tight mb-3">Create an account</h1>
            <p className="text-white/50">Start configuring your zero-liability workspace.</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => handleOAuth('google')}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button 
              onClick={() => handleOAuth('discord')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/50 text-[#5865F2] font-semibold py-3 px-4 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 127.14 96.36"><path fill="currentColor" d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.08 0A72.37 72.37 0 0 0 45.67 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.73 56.6 .37 80.05a105.73 105.73 0 0 0 32.27 16.31 77.7 77.7 0 0 0 6.89-11.1 82.35 82.35 0 0 1-11.1-5.36c1.87-1.4 3.76-2.8 5.39-4.36a96.52 96.52 0 0 0 59.57 0c1.63 1.56 3.52 2.96 5.39 4.36a82.62 82.62 0 0 1-11.1 5.36 77.39 77.39 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.26-16.31c2.69-28.46-4.83-50.54-19.14-71.98zM42.44 65.16c-5.36 0-9.82-4.9-9.82-10.84s4.32-10.84 9.82-10.84c5.56 0 9.94 4.9 9.82 10.84 0 5.94-4.32 10.84-9.82 10.84zm42.27 0c-5.36 0-9.82-4.9-9.82-10.84s4.32-10.84 9.82-10.84c5.56 0 9.94 4.9 9.82 10.84 0 5.94-4.32 10.84-9.82 10.84z"/></svg>
              Discord
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-white/40 text-xs font-medium uppercase tracking-widest">or continue with email</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/80" htmlFor="name">Full Name</label>
              <input 
                id="name" 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
                placeholder="John Doe" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono text-sm disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/80" htmlFor="email">Email address</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="you@example.com" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono text-sm disabled:opacity-50"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/80" htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••••••" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono text-lg tracking-widest disabled:opacity-50"
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
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 px-4 rounded-xl mt-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_-5px_rgba(245,158,11,0.4)] disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-8">
            Already have an account? <Link href="/login" className="text-amber-500 hover:text-amber-400 font-bold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
