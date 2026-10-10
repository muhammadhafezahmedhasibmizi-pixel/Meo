"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
export default function Login(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [msg,setMsg]=useState("");const [busy,setBusy]=useState(false);const router=useRouter();
 async function submit(e:React.FormEvent){e.preventDefault();setMsg("");const sb=getSupabase();if(!sb){setMsg("আগে .env.local ফাইলে Supabase URL ও anon key সেট করুন।");return;}setBusy(true);const {error}=await sb.auth.signInWithPassword({email,password});setBusy(false);if(error){setMsg(error.message);return;}router.push("/dashboard");}
 return <main className="container"><div className="panel form-wrap"><Link href="/" className="muted">← হোমে ফিরে যান</Link><h1>অ্যাকাউন্টে লগইন</h1><p className="muted">আপনার দক্ষ হাত অ্যাকাউন্টে প্রবেশ করুন।</p><form onSubmit={submit}><div className="field"><label>ইমেইল</label><input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div><div className="field"><label>পাসওয়ার্ড</label><input type="password" autoComplete="current-password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর"/></div>{msg&&<div className="notice error">{msg}</div>}<button disabled={busy} style={{width:"100%"}}>{busy?"অপেক্ষা করুন...":"লগইন করুন"}</button></form><p>অ্যাকাউন্ট নেই? <Link href="/join" style={{color:"var(--green)",fontWeight:700}}>মিস্ত্রি হিসেবে যোগ দিন</Link></p></div></main>
}
