import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      {/* Navbar Placeholder */}
      <nav className="w-full h-20 flex items-center justify-between px-8 border-b border-white/10 z-50 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder - You'll drop your cleaned logo here later */}
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold">
            A
          </div>
          <span className="text-xl font-bold tracking-widest text-white/90">ANIMA</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/docs" className="text-sm font-medium text-white/60 hover:text-amber-500 transition-colors">Documentation</Link>
          <Link href="/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Log in</Link>
          <Link href="/signup" className="text-sm font-semibold bg-amber-600 hover:bg-amber-500 px-5 py-2.5 rounded-md transition-all">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 w-full max-w-7xl mx-auto pt-20 pb-32">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex flex-col items-center text-center z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-500 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            OpenClaw Gateway v1.0 Ready
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            Your Agent. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Your Canvas.
            </span> <br />
            Your Rules.
          </h1>
          
          <p className="text-xl md:text-2xl text-white/50 mb-12 max-w-2xl font-light leading-relaxed">
            The world&apos;s first fully customizable, zero-liability command center for autonomous AI. Connect your local agent, build your visual dashboard, and take control.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/signup" className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)]">
              Start Building Free
            </Link>
            <Link href="/demo" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all backdrop-blur-sm">
              View Demo
            </Link>
          </div>
        </div>

        {/* Abstract Dashboard Mockup */}
        <div className="mt-24 w-full max-w-5xl rounded-2xl border border-white/10 bg-[#111]/80 backdrop-blur-xl shadow-2xl overflow-hidden z-10 p-2">
          <div className="w-full h-10 flex items-center px-4 gap-2 border-b border-white/10">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="ml-4 text-xs font-mono text-white/30">anima.app / dashboard</div>
          </div>
          <div className="grid grid-cols-12 gap-4 p-4 h-[400px]">
            {/* Sidebar */}
            <div className="col-span-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2 p-4">
              <div className="w-full h-8 rounded-md bg-white/10 mb-4 animate-pulse"></div>
              <div className="w-3/4 h-4 rounded-md bg-white/5"></div>
              <div className="w-1/2 h-4 rounded-md bg-white/5"></div>
              <div className="w-2/3 h-4 rounded-md bg-white/5"></div>
            </div>
            {/* Main Chat/Console */}
            <div className="col-span-6 rounded-xl bg-[#0a0a0a] border border-white/5 flex flex-col justify-end p-4 relative">
              <div className="absolute top-4 right-4 px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-mono border border-green-500/20">CONNECTED: ws://localhost:18789</div>
              <div className="w-full h-12 rounded-lg bg-white/5 border border-white/10 mt-auto flex items-center px-4">
                <div className="w-4 h-4 rounded-sm bg-amber-500/50 mr-3 animate-pulse"></div>
                <div className="w-1/3 h-2 rounded bg-white/20"></div>
              </div>
            </div>
            {/* Right Widget Panel */}
            <div className="col-span-3 flex flex-col gap-4">
              <div className="flex-1 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-900/10 border border-amber-500/20 flex items-center justify-center">
                 <div className="text-amber-500/50 font-mono text-sm">[ Emotion Engine ]</div>
              </div>
              <div className="flex-1 rounded-xl bg-white/5 border border-white/5"></div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
