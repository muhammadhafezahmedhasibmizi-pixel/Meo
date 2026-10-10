"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Worker } from "@/lib/types";
export default function Dashboard(){
 const [worker,setWorker]=useState<Worker|null>(null);const [userEmail,setUserEmail]=useState("");const [msg,setMsg]=useState("লোড হচ্ছে...");
 useEffect(()=>{(async()=>{const sb=getSupabase();if(!sb){setMsg("Supabase সেটআপ করুন।");return;}const {data:{user}}=await sb.auth.getUser();if(!user){setMsg("ড্যাশবোর্ড দেখতে লগইন করুন।");return;}setUserEmail(user.email||"");const {data,error}=await sb.from("workers").select("*").eq("user_id",user.id).maybeSingle();if(error){setMsg(error.message);return;}setWorker(data as Worker|null);setMsg(data?"":"আপনার মিস্ত্রি প্রোফাইল এখনো জমা হয়নি।");})();},[]);
 async function logout(){const sb=getSupabase();await sb?.auth.signOut();window.location.href="/";}
 return <main className="container section"><div className="panel"><Link href="/" className="muted">← হোম</Link><h1>আমার ড্যাশবোর্ড</h1><p className="muted">{userEmail}</p>{worker?<><div className="admin-row"><div><h2 style={{margin:"0 0 5px"}}>{worker.name}</h2><div>{worker.category} · {worker.district}, {worker.thana}</div></div><span className={"status "+worker.status}>{worker.status==="approved"?"অনুমোদিত":worker.status==="rejected"?"প্রত্যাখ্যাত":"অনুমোদনের অপেক্ষায়"}</span></div><p>{worker.bio||"প্রোফাইলে অতিরিক্ত বিবরণ নেই।"}</p><p>যোগাযোগ: {worker.phone}</p>{worker.status==="approved"&&<div className="notice">আপনার প্রোফাইল প্রকাশিত হয়েছে।</div>}</>:<div className="notice">{msg}</div>}<div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:18}}><Link className="btn" href="/join">মিস্ত্রি হিসেবে নিবন্ধন</Link><Link className="btn secondary" href="/admin">অ্যাডমিন প্যানেল</Link><button className="secondary" onClick={logout}>লগআউট</button></div></div></main>
}
