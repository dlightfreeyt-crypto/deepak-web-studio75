 "use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, ArrowRight, Instagram, Linkedin, Mail, MapPin, MessageCircle } from "lucide-react";
import type { SiteContent } from "@/lib/types";

const slides = ["Home", "About", "Gallery", "Testimonials", "Contact"];

export default function Portfolio({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const bg = content.backgrounds?.[slides[index].toLowerCase()] || "";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") setIndex(i => Math.min(i + 1, slides.length - 1));
      if (e.key === "ArrowLeft" || e.key === "PageUp") setIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const whatsapp = useMemo(() => content.whatsapp.replace(/\D/g, ""), [content.whatsapp]);

  async function sendFeedback(e: React.FormEvent) {
    e.preventDefault(); setStatus("Sending…");
    const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
    const { error } = await sb.from("feedback").insert(feedback);
    setStatus(!error ? "Thank you for your feedback." : "Could not send. Please try again.");
    if (!error) setFeedback({ name: "", email: "", message: "" });
  }

  return (
    <main className="portfolio" style={{ backgroundImage: bg ? `linear-gradient(rgba(20,18,16,.28),rgba(20,18,16,.28)),url("${bg}")` : undefined }}>
      <div className="ambient" />
      <div className="cursorGlow" />
      <div className="topbar"><span>{String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span><span>{content.siteName}</span></div>

      <section className="viewport">
        <div className="track" style={{ transform: `translateX(-${index * 100}vw)` }}>
          <article className="slide hero">
            <div className="heroCard">
              <p className="eyebrow">DIGITAL PORTFOLIO</p>
              <h1>{content.siteName}</h1>
              <p className="tagline">{content.tagline}</p>
              <button className="primary" onClick={() => setIndex(1)}>Explore <ArrowRight size={17}/></button>
            </div>
          </article>

          <article className="slide">
            <div className="splitCard">
              <div>
                <p className="eyebrow">ABOUT</p><h2>Made with intention.</h2>
                <p className="aboutText">{content.about}</p>
              </div>
              {content.profileImage ? <img className="profile" src={content.profileImage} alt="Profile" /> : <div className="profile placeholder">Profile</div>}
            </div>
          </article>

          <article className="slide">
            <div className="wideCard">
              <p className="eyebrow">SELECTED WORK</p><h2>Gallery</h2>
              <div className="gallery">{content.gallery.map(item => <img key={item.id} src={item.url} alt={item.name} loading="lazy" />)}</div>
            </div>
          </article>

          <article className="slide">
            <div className="testimonialGrid">
              <div><p className="eyebrow">FEEDBACK</p><h2>Your words matter.</h2><p className="muted">Leave a short note about your experience.</p></div>
              <form onSubmit={sendFeedback} className="formCard">
                <input placeholder="Name" value={feedback.name} onChange={e=>setFeedback({...feedback,name:e.target.value})} required />
                <input type="email" placeholder="Email" value={feedback.email} onChange={e=>setFeedback({...feedback,email:e.target.value})} required />
                <textarea placeholder="Message" value={feedback.message} onChange={e=>setFeedback({...feedback,message:e.target.value})} required maxLength={1000}/>
                <button className="primary" type="submit">Send feedback</button><small>{status}</small>
              </form>
            </div>
          </article>

          <article className="slide">
            <div className="contactCard">
              <p className="eyebrow">CONTACT</p><h2>Let&apos;s create something memorable.</h2>
              <div className="contactList">
                <a href={`mailto:${content.contactEmail}`}><Mail size={18}/>{content.contactEmail}</a>
                <span><MapPin size={18}/>{content.location}</span>
                {content.instagram && <a href={content.instagram} target="_blank" rel="noreferrer"><Instagram size={18}/>Instagram</a>}
                {content.linkedin && <a href={content.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18}/>LinkedIn</a>}
              </div>
            </div>
          </article>
        </div>
      </section>

      <div className="controls">
        <button onClick={() => setIndex(i=>Math.max(0,i-1))} disabled={index===0} aria-label="Previous"><ArrowLeft/></button>
        <div className="dots">{slides.map((s,i)=><button key={s} className={i===index?"active":""} onClick={()=>setIndex(i)} aria-label={s}/>)}</div>
        <button onClick={() => setIndex(i=>Math.min(slides.length-1,i+1))} disabled={index===slides.length-1} aria-label="Next"><ArrowRight/></button>
      </div>

      {whatsapp && <a className="whatsapp" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle/></a>}
    </main>
  );
}