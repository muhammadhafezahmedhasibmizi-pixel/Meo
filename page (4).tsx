"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Worker } from "@/lib/types";
export default function Admin(){
 const [rows,setRows]=useState<Worker[]>([]);const [msg,setMsg]=useState("লোড হচ্ছে...");const [busy,setBusy]=useState("");
 async function load(){const sb=getSupabase();if(!sb){setMsg("Supabase সেটআপ করুন।");return;}const {data:{user}}=await sb.auth.getUser();if(!user){setMsg("অ্যাডমিন অ্যাকাউন্টে লগইন করুন।");return;}const {data:profile}=await sb.from("profiles").select("role").eq("id",user.id).maybeSingle();if(profile?.role!=="admin"){setMsg("অ্যাক্সেস নেই। এই পেজ দেখতে অ্যাডমিন অনুমতি প্রয়োজন।");return;}const {data,error}=await sb.from("workers").select("*").order("created_at",{ascending:false}).limit(100);if(error){setMsg(error.message);return;}setRows((data||[]) as Worker[]);setMsg("");}
 useEffect(()=>{load();},[]);
 async function setStatus(id:string,status:"approved"|"rejected"){const sb=getSupabase();if(!sb)return;setBusy(id);const {error}=await sb.from("workers").update({status}).eq("id",id);setBusy("");if(error){setMsg("আপডেট ব্যর্থ: "+error.message);return;}setRows(old=>old.map(r=>r.id===id?{...r,status}:r));}
 return <main className="container section"><div className="panel"><Link href="/" className="muted">← হোম</Link><h1>অ্যাডমিন প্যানেল</h1><p className="muted">মিস্ত্রির আবেদন যাচাই ও অনুমোদন করুন।</p>{msg&&<div className="notice">{msg}</div>}{rows.map(w=><div className="admin-row" key={w.id}><div><strong>{w.name}</strong><div className="small muted">{w.category} · {w.phone}</div><div className="small muted">{w.district}, {w.thana}{w.area?`, ${w.area}`:""}</div><span className={"status "+w.status}>{w.status==="approved"?"অনুমোদিত":w.status==="rejected"?"প্রত্যাখ্যাত":"অপেক্ষমাণ"}</span></div><div style={{display:"flex",gap:7,flexWrap:"wrap"}}><button disabled={!!busy} onClick={()=>setStatus(w.id,"approved")}>অনুমোদন</button><button className="secondary" disabled={!!busy} onClick={()=>setStatus(w.id,"rejected")}>প্রত্যাখ্যান</button></div></div>)}</div></main>
}
