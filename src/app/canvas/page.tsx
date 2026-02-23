import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CanvasClient from "./CanvasClient";

export default async function CanvasPage() {
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

  if (!hasAgent) {
    redirect("/dashboard/setup");
  }

  return <CanvasClient agent={agent} />;
}
