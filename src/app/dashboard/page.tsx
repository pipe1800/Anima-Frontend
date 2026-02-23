import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      <nav className="w-full h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#111]">
        <div className="flex items-center gap-3">
          <Image src="/anima-logo.svg" alt="Anima Logo" width={24} height={24} />
          <span className="font-bold tracking-widest text-sm">ANIMA // COMMAND</span>
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
            <h1 className="text-3xl font-black mb-2">Welcome to your Dashboard</h1>
            <p className="text-white/50">Your authentication flow is working perfectly. You are securely logged in.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
              <h3 className="text-lg font-bold">1. Configure Agent</h3>
              <p className="text-sm text-white/50">Connect your local OpenClaw gateway using your secure token.</p>
              <button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-lg mt-auto transition-colors border border-white/10">
                Setup Connection
              </button>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4 opacity-50 pointer-events-none">
              <h3 className="text-lg font-bold">2. Design Canvas</h3>
              <p className="text-sm text-white/50">Customize your Glassmorphism UI, rooms, and background assets.</p>
              <button className="w-full bg-white/10 text-white font-semibold py-2 rounded-lg mt-auto border border-white/10">
                Locked
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4 opacity-50 pointer-events-none">
              <h3 className="text-lg font-bold">3. Launch Interface</h3>
              <p className="text-sm text-white/50">Enter the fully immersive spatial UI and interact with your agent.</p>
              <button className="w-full bg-white/10 text-white font-semibold py-2 rounded-lg mt-auto border border-white/10">
                Locked
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
