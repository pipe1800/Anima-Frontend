import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if they have an active agent configured
  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .eq("owner_id", user.id)
    .limit(1);

  const hasAgent = agents && agents.length > 0;
  const agent = hasAgent ? agents[0] : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      <nav className="w-full h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#111] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src="/anima-logo.svg" alt="Anima Logo" width={24} height={24} />
          <span className="font-bold tracking-widest text-sm text-white/90">ANIMA <span className="text-amber-500 font-black">{'//'}</span> COMMAND</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-white/40">{user.email}</span>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-xs font-bold text-amber-500">{user.email?.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-black tracking-tight mb-2">Workspace</h1>
            <p className="text-white/50 text-lg">Manage your autonomous agents and orchestrate their visual environments.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1: Agent Connection */}
            <div className={`rounded-xl border border-white/10 p-6 flex flex-col gap-4 transition-all ${hasAgent ? 'bg-amber-500/5 border-amber-500/20' : 'bg-[#111]'}`}>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-amber-500 font-black">1.</span> Agent Link
                </h3>
                {hasAgent && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-mono rounded uppercase tracking-widest border border-green-500/20">Active</span>
                )}
              </div>
              
              {!hasAgent ? (
                <>
                  <p className="text-sm text-white/50 font-light leading-relaxed">Connect your local OpenClaw gateway using your secure token. Token will be encrypted client-side.</p>
                  <Link href="/dashboard/setup" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg mt-auto text-center transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    Setup Connection
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-xs text-white/40 uppercase tracking-widest">Name</span>
                    <span className="text-lg font-bold">{agent.name}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-xs text-white/40 uppercase tracking-widest">Gateway Route</span>
                    <span className="text-sm font-mono text-amber-500/80">{agent.gateway_url}</span>
                  </div>
                  <Link href="/dashboard/setup" className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-2 rounded-lg mt-auto text-center transition-colors border border-white/10 text-sm">
                    Reconfigure
                  </Link>
                </>
              )}
            </div>
            
            {/* Step 2: Canvas Design */}
            <div className={`rounded-xl border border-white/10 p-6 flex flex-col gap-4 transition-all ${!hasAgent ? 'opacity-40 grayscale pointer-events-none bg-[#111]' : 'bg-[#111] hover:border-white/20'}`}>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="text-amber-500 font-black">2.</span> Theme Builder
              </h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">Customize your Glassmorphism UI, rooms, and background assets.</p>
              <button className="w-full bg-white/5 text-white font-semibold py-3 rounded-lg mt-auto border border-white/10 transition-colors hover:bg-white/10" disabled={!hasAgent}>
                {hasAgent ? "Open Designer" : "Locked (Requires Agent)"}
              </button>
            </div>

            {/* Step 3: Launch */}
            <div className={`rounded-xl border border-amber-500/30 p-6 flex flex-col gap-4 transition-all relative overflow-hidden ${!hasAgent ? 'opacity-40 grayscale pointer-events-none bg-[#111]' : 'bg-gradient-to-br from-[#111] to-amber-900/10'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="text-amber-500 font-black">3.</span> Launch Interface
              </h3>
              <p className="text-sm text-white/50 font-light leading-relaxed">Enter the fully immersive spatial UI and interact with your agent.</p>
              <Link href="/canvas" className={`w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg mt-auto text-center transition-all ${hasAgent ? 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)] hover:scale-[1.02]' : ''}`} aria-disabled={!hasAgent}>
                {hasAgent ? "Launch Command Center" : "Locked"}
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
