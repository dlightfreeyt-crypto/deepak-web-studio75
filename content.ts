import { supabaseServer } from "./supabase-server";
import type { SiteContent } from "./types";

const defaults: SiteContent = {
  siteName:"Your Name", tagline:"Digital work, thoughtfully designed.",
  about:"Write your introduction here from the admin panel.", profileImage:"",
  whatsapp:"", contactEmail:"hello@example.com", location:"India",
  instagram:"", linkedin:"", backgrounds:{}, gallery:[]
};

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = await supabaseServer();
  const [{ data: site }, { data: gallery }] = await Promise.all([
    supabase.from("site_content").select("*").eq("id",1).maybeSingle(),
    supabase.from("gallery").select("*").order("sort_order",{ascending:true})
  ]);
  return {...defaults, ...(site || {}), gallery:(gallery || []).map(g=>({
    id:g.id, url:g.url, name:g.name, order:g.sort_order, createdAt:g.created_at
  }))};
}