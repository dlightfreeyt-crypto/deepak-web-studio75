 "use client";

import { useEffect, useState } from "react";
import { Trash2, Upload, LogOut, Save, GripVertical } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import type { SiteContent, Feedback, GalleryItem } from "@/lib/types";

const empty:SiteContent={siteName:"",tagline:"",about:"",profileImage:"",whatsapp:"",contactEmail:"",location:"",instagram:"",linkedin:"",backgrounds:{},gallery:[]};

export default function AdminDashboard(){
  const [logged,setLogged]=useState<boolean|null>(null),[content,setContent]=useState(empty),[feedback,setFeedback]=useState<Feedback[]>([]),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[msg,setMsg]=useState("");
  const sb=createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);

  async function load(){
    const {data:{user}}=await sb.auth.getUser();
    if(!user || user.email!==process.env.NEXT_PUBLIC_ADMIN_EMAIL){setLogged(false);return}
    setLogged(true);
    const [{data:site},{data:g},{data:f}]=await Promise.all([
      sb.from("site_content").select("*").eq("id",1).maybeSingle(),
      sb.from("gallery").select("*").order("sort_order",{ascending:true}),
      sb.from("feedback").select("*").order("created_at",{ascending:false})
    ]);
    setContent({...empty,...(site||{}),gallery:(g||[]).map(x=>({id:x.id,url:x.url,name:x.name,order:x.sort_order,createdAt:x.created_at}))});
    setFeedback(f||[]);
  }
  useEffect(()=>{load()},[]);

  async function login(e:React.FormEvent){e.preventDefault();setMsg("Signing in…");const {error}=await sb.auth.signInWithPassword({email,password});if(error)setMsg(error.message);else{setPassword("");await load()}}
  async function save(){const {error}=await sb.from("site_content").upsert({...content,id:1,gallery:undefined},{onConflict:"id"});setMsg(error?error.message:"Saved successfully.")}
  async function upload(file:File,folder:string){
    const path=`${folder}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
    const {error}=await sb.storage.from("portfolio").upload(path,file,{cacheControl:"31536000",upsert:false,contentType:file.type});
    if(error){setMsg(error.message);return null}
    return sb.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
  }
  async function addGallery(file:File){const url=await upload(file,"gallery");if(!url)return;await sb.from("gallery").insert({url,name:file.name,sort_order:content.gallery.length});await load()}
  async function removeGallery(id:string){await sb.from("gallery").delete().eq("id",id);await load()}
  async function removeFeedback(id:string){await sb.from("feedback").delete().eq("id",id);await load()}
  async function logout(){await sb.auth.signOut();setLogged(false)}

  if(logged===null)return <div className="adminShell"><div className="adminCard">Loading…</div></div>;
  if(!logged)return <div className="adminShell"><form className="loginCard" onSubmit={login}><p className="eyebrow">PRIVATE AREA</p><h1>Admin login</h1><input type="email" placeholder="Admin email" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="primary">Enter dashboard</button><small>{msg}</small></form></div>;

  const set=(k:keyof SiteContent,v:any)=>setContent({...content,[k]:v});
  return <div className="adminShell">
    <header className="adminHeader"><div><p className="eyebrow">CONTROL CENTER</p><h1>Portfolio Admin</h1></div><button className="ghost" onClick={logout}><LogOut size={16}/>Logout</button></header>
    <div className="adminGrid">
      <section className="adminCard"><h2>Site identity</h2>
        <label>Brand name<input value={content.siteName} onChange={e=>set("siteName",e.target.value)}/></label>
        <label>Tagline<input value={content.tagline} onChange={e=>set("tagline",e.target.value)}/></label>
        <label>WhatsApp number<input value={content.whatsapp} onChange={e=>set("whatsapp",e.target.value)} placeholder="919876543210"/></label>
        <label>Contact email<input value={content.contactEmail} onChange={e=>set("contactEmail",e.target.value)}/></label>
        <label>Location<input value={content.location} onChange={e=>set("location",e.target.value)}/></label>
        <label>Instagram URL<input value={content.instagram} onChange={e=>set("instagram",e.target.value)}/></label>
        <label>LinkedIn URL<input value={content.linkedin} onChange={e=>set("linkedin",e.target.value)}/></label>
        <button className="primary" onClick={save}><Save size={16}/>Save changes</button><small>{msg}</small>
      </section>
      <section className="adminCard"><h2>About</h2><label>About Me<textarea rows={10} value={content.about} onChange={e=>set("about",e.target.value)}/></label>
        <UploadField label="Profile image" onFile={async f=>{const url=await upload(f,"profile");if(url){set("profileImage",url);await sb.from("site_content").upsert({id:1,profileImage:url})}}}/>
      </section>
      <section className="adminCard"><h2>Slide backgrounds</h2>{["home","about","gallery","testimonials","contact"].map(key=><div className="uploadRow" key={key}><div><b>{key}</b><span>{content.backgrounds?.[key]?"Image set":"No image"}</span></div><UploadField label="Change" onFile={async f=>{const url=await upload(f,`backgrounds/${key}`);if(url){const backgrounds={...content.backgrounds,[key]:url};set("backgrounds",backgrounds);await sb.from("site_content").upsert({id:1,backgrounds})}}}/></div>)}</section>
      <section className="adminCard full"><h2>Gallery</h2><UploadField label="Add photo" onFile={addGallery}/><div className="adminGallery">{content.gallery.map((g:GalleryItem)=><div className="adminThumb" key={g.id}><img src={g.url} alt=""/><button onClick={()=>removeGallery(g.id)}><Trash2 size={15}/></button><GripVertical className="grip"/></div>)}</div></section>
      <section className="adminCard full"><h2>Feedback inbox</h2>{feedback.length===0?<p className="muted">No feedback yet.</p>:feedback.map(f=><div className="feedbackItem" key={f.id}><div><b>{f.name}</b><span>{f.email} · {f.created_at?new Date(f.created_at).toLocaleString():""}</span><p>{f.message}</p></div><button className="danger" onClick={()=>removeFeedback(f.id)}><Trash2 size={15}/>Delete</button></div>)}</section>
    </div>
  </div>
}
function UploadField({label,onFile}:{label:string,onFile:(f:File)=>void}){return <label className="uploadButton"><Upload size={15}/>{label}<input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f)onFile(f);e.currentTarget.value=""}}/></label>}