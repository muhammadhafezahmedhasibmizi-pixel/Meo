"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { useParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Worker } from "@/lib/types";
export default function WorkerPage(){
 const params=useParams<{id:string}>();const [w,setW]=useState<Worker|null>(null);const [msg,setMsg]=useState("লোড হচ্ছে...");
 useEffect(()=>{(async()=>{if(params.id.startsWith("demo-")){setMsg("এটি নমুনা প্রোফাইল। বাস্তব যোগাযোগের তথ্য নেই।");return;}const sb=getSupabase();if(!sb){setMsg("Supabase সেটআপ করুন।");return;}const {data,error}=await sb.from("workers").select("*").eq("id",params.id).eq("status","approved").maybeSingle();if(error||!data){setMsg("প্রোফাইল পাওয়া যায়নি অথবা এখনো অনুমোদিত হয়নি।");return;}setW(data as Worker);setMsg("");})();},[params.id]);
 return <main className="container section"><div className="panel" style={{maxWidth:720,margin:"auto"}}><Link href="/" className="muted">← মিস্ত্রি তালিকা</Link>{w?<><div className="worker-top" style={{marginTop:20}}><img className="avatar" style={{width:90,height:90}} src={w.photo_url||`https://ui-avatars.com/api/?name=${encodeURIComponent(w.name)}&background=e0eee6&color=0b5b45`} alt={w.name}/><div><h1 style={{margin:"0 0 5px"}}>{w.name}</h1><span className="verified">✓ অনুমোদিত প্রোফাইল</span><p className="muted">{w.category}</p></div></div><hr style={{border:0,borderTop:"1px solid var(--line)",margin:"22px 0"}}/><p>📍 {[w.area,w.thana,w.district].filter(Boolean).join(", ")}</p><p>🧰 কাজের অভিজ্ঞতা: {w.experience_years} বছর</p><p>{w.bio||"কাজের বিস্তারিত এখনো যোগ করা হয়নি।"}</p><a className="btn" href={`tel:${w.phone}`}>☎ ফোন করুন: {w.phone}</a></>:<div className="notice">{msg}</div>}</div></main>
}
