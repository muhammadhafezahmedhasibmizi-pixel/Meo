"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { CATEGORIES, Worker } from "@/lib/types";

const icons: Record<string,string> = {
  "ইলেকট্রিশিয়ান":"⚡","প্লাম্বার":"🔧","এসি টেকনিশিয়ান":"❄️","রাজমিস্ত্রি":"🧱",
  "রংমিস্ত্রি":"🖌️","টাইলস মিস্ত্রি":"◻️","কাঠমিস্ত্রি":"🪚","ওয়েল্ডার":"🧰",
  "গৃহকর্মী":"🏠","পরিচ্ছন্নতাকর্মী":"🧹","অন্যান্য":"🛠️"
};
const fallback = [
 {id:"demo-1",name:"রহিম উদ্দিন",category:"ইলেকট্রিশিয়ান",district:"ঢাকা",thana:"মিরপুর",area:"পল্লবী",experience_years:7,phone:"",photo_url:null,status:"approved"},
 {id:"demo-2",name:"করিম মিয়া",category:"প্লাম্বার",district:"ঢাকা",thana:"মোহাম্মদপুর",area:"আদাবর",experience_years:5,phone:"",photo_url:null,status:"approved"},
 {id:"demo-3",name:"সোহেল রানা",category:"এসি টেকনিশিয়ান",district:"ঢাকা",thana:"উত্তরা",area:"সেক্টর ৭",experience_years:6,phone:"",photo_url:null,status:"approved"}
] as Worker[];

export default function Home() {
 const [workers,setWorkers] = useState<Worker[]>([]);
 const [query,setQuery] = useState("");
 const [category,setCategory] = useState("");
 const [loading,setLoading] = useState(true);
 const [connected,setConnected] = useState(false);
 useEffect(()=>{(async()=>{
   const sb=getSupabase();
   if(sb){
     const {data,error}=await sb.from("workers").select("*").eq("status","approved").order("created_at",{ascending:false}).limit(60);
     if(!error){setWorkers((data||[]) as Worker[]);setConnected(true);}
     else setWorkers([]);
   }
   setLoading(false);
 })();},[]);
 const shown=useMemo(()=>workers.filter(w=>{
   const q=query.trim().toLowerCase();
   return (!category||w.category===category)&&(!q||[w.name,w.category,w.district,w.thana,w.area||""].some(v=>v?.toLowerCase().includes(q)));
 }),[workers,query,category]);
 return <><header className="topbar"><div className="container nav"><Link className="brand" href="/"><span className="brand-mark">দ</span><span>দক্ষ হাত<small style={{display:"block",fontSize:10,color:"#66736e",fontWeight:500,lineHeight:1}}>DOKKHO HAAT</small></span></Link><nav className="navlinks"><a className="optional" href="#categories">সেবাসমূহ</a><a className="optional" href="#workers">মিস্ত্রি</a><Link href="/join">মিস্ত্রি যোগ দিন</Link><Link className="btn" href="/login">লগইন</Link></nav></div></header>
 <main className="container"><section className="hero"><div className="hero-content"><span className="eyebrow">বাংলাদেশের দক্ষ কর্মীদের খুঁজুন</span><h1>কাজের জন্য চাই<br/>দক্ষ হাতের ছোঁয়া</h1><p>আপনার এলাকার ইলেকট্রিশিয়ান, প্লাম্বার, এসি টেকনিশিয়ান ও অন্যান্য দক্ষ কর্মী খুঁজুন সহজেই।</p><form className="searchbar" onSubmit={e=>{e.preventDefault();document.getElementById("workers")?.scrollIntoView({behavior:"smooth"});}}><input aria-label="মিস্ত্রি খুঁজুন" value={query} onChange={e=>setQuery(e.target.value)} placeholder="নাম, কাজ, জেলা বা এলাকা লিখুন..."/><button type="submit">⌕ মিস্ত্রি খুঁজুন</button></form></div></section>
 <section className="section" id="categories"><div className="section-head"><div><h2>কোন সেবা প্রয়োজন?</h2><p className="muted">আপনার প্রয়োজন অনুযায়ী কাজের ধরন বেছে নিন</p></div><button className="secondary" onClick={()=>setCategory("")}>সব দেখুন</button></div><div className="categories">{CATEGORIES.slice(0,6).map(c=><button className="category" key={c} onClick={()=>{setCategory(category===c?"":c);document.getElementById("workers")?.scrollIntoView({behavior:"smooth"});}}><span className="emoji">{icons[c]||"🛠️"}</span>{c}</button>)}</div></section>
 <section className="section" id="workers"><div className="section-head"><div><h2>{category||"অনুমোদিত মিস্ত্রি"}</h2><p className="muted">প্রোফাইল দেখে সরাসরি যোগাযোগ করুন</p></div>{category&&<button className="secondary" onClick={()=>setCategory("")}>ফিল্টার সরান</button>}</div>
 {loading?<div className="empty">মিস্ত্রির তথ্য লোড হচ্ছে...</div>:shown.length===0?<div className="empty"><div style={{fontSize:30}}>🔎</div><strong>এখনো কোনো অনুমোদিত মিস্ত্রি পাওয়া যায়নি</strong><p>{connected?"অন্য নাম, কাজ বা এলাকা দিয়ে খুঁজুন।":"ডাটাবেস সংযুক্ত হলে অনুমোদিত মিস্ত্রির তথ্য এখানে দেখাবে।"}</p><Link className="btn" href="/join">মিস্ত্রি হিসেবে যোগ দিন</Link></div>:<div className="workers">{shown.map(w=><article className="worker-card" key={w.id}><div className="worker-top"><img className="avatar" src={w.photo_url||`https://ui-avatars.com/api/?name=${encodeURIComponent(w.name)}&background=e0eee6&color=0b5b45`} alt={w.name}/><div><h3>{w.name}</h3><span className="verified">✓ যাচাইকৃত তালিকা</span><p>{w.category}</p></div></div><p>📍 {[w.area,w.thana,w.district].filter(Boolean).join(", ")}</p><p>🧰 অভিজ্ঞতা: {w.experience_years||0} বছর</p><div className="worker-actions">{w.phone?<a className="btn" href={`tel:${w.phone}`}>☎ কল করুন</a>:<Link className="btn" href={`/mistri/${w.id}`}>প্রোফাইল দেখুন</Link>}<Link className="btn secondary" href={`/mistri/${w.id}`}>বিস্তারিত</Link></div></article>)}</div>}
 </section></main><footer className="footer"><div className="container footer-inner"><div><div className="brand" style={{color:"white"}}><span className="brand-mark">দ</span> দক্ষ হাত</div><p>দক্ষ কর্মী ও সেবাগ্রহীতার নির্ভরযোগ্য সংযোগ।</p></div><div><Link href="/join">মিস্ত্রি হিসেবে যোগ দিন</Link><p><Link href="/dashboard">আমার ড্যাশবোর্ড</Link></p><p className="small">© {new Date().getFullYear()} Dokkho Haat</p></div></div></footer></>;
}
