"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const budgets = [399, 699, 999, 1499];
const categories = ["Tech", "Home & Living", "Toys", "Fitness"];
const genders = ["Woman", "Man", "Non-binary", "Prefer not to say"];
const exclusions = ["No clothing", "No food", "No electronics", "No cosmetics", "No duplicates"];
export default function OrderPage() {
 const router=useRouter();const [recipientType,setRecipientType]=useState("SELF");const [budget,setBudget]=useState(699);
 const [selectedCategories,setSelectedCategories]=useState<string[]>(categories);const [selectedExclusions,setSelectedExclusions]=useState<string[]>([]);
 const [gender,setGender]=useState("");const [age,setAge]=useState("");const [additionalDetails,setAdditionalDetails]=useState("");
 const [name,setName]=useState("");const [email,setEmail]=useState("");const [address,setAddress]=useState("");const [message,setMessage]=useState("");const [result,setResult]=useState("");const [busy,setBusy]=useState(false);
 function toggle(v:string,list:string[],setter:(v:string[])=>void){setter(list.includes(v)?list.filter(x=>x!==v):[...list,v]);}
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!gender){setResult("Please select a gender.");return}setBusy(true);setResult("");
  try{const auth=await fetch(`${API}/api/auth/me`,{credentials:"include"});if(auth.status===401){router.push("/auth?next=/order");return}if(!auth.ok)throw new Error("Could not verify your account");
   const r=await fetch(`${API}/api/orders`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({recipient_type:recipientType,budget,categories:selectedCategories,exclusions:selectedExclusions,recipient_name:name,recipient_email:email,delivery_address:address,gift_message:message||null})});
   const d=await r.json();if(!r.ok)throw new Error(d.detail||"Could not place request");setResult(`${d.order_number}: ${d.message}`);
  }catch(err){setResult(err instanceof Error?err.message:"Something went wrong")}finally{setBusy(false)}}
 return <main className="shell"><nav className="nav"><a className="logo" href="/">buy me a <span>random</span> gift.</a><a className="pill" href="/dashboard">My account</a></nav>
 <form className="order" onSubmit={submit}><div className="eyebrow">Your surprise starts here</div><h2>Let's make someone's day.</h2><p className="muted">No spoilers. Just a little anticipation.</p>
 <div className="field"><label>Who is this for?</label><div className="choices">{["SELF","SOMEONE_ELSE"].map(v=><button type="button" key={v} className={`choice ${recipientType===v?"active":""}`} onClick={()=>setRecipientType(v)}>{v==="SELF"?"🙋 Myself":"💝 Someone else"}</button>)}</div></div>
 <div className="field"><label>{recipientType==="SELF"?"About you":"About the recipient"}</label><div className="choices">{genders.map(v=><button type="button" key={v} aria-pressed={gender===v} className={`choice ${gender===v?"active":""}`} onClick={()=>setGender(v)}>{v}</button>)}</div></div>
 <div className="field"><label htmlFor="recipient-age">{recipientType==="SELF"?"Your age":"Recipient's age"}</label><input id="recipient-age" required type="number" min="1" max="120" inputMode="numeric" value={age} onChange={e=>setAge(e.target.value)} placeholder="Age"/></div>
 <div className="field"><label htmlFor="additional-details">Anything else we should know? <span className="muted">(optional)</span></label><textarea id="additional-details" maxLength={500} value={additionalDetails} onChange={e=>setAdditionalDetails(e.target.value)} placeholder="Interests, hobbies, favourite things, or useful details..."/></div>
 <div className="field"><label>Choose your budget</label><div className="choices">{budgets.map(v=><button type="button" key={v} className={`choice ${budget===v?"active":""}`} onClick={()=>setBudget(v)}>₹{v.toLocaleString("en-IN")}</button>)}</div></div>
 <div className="field"><label>What kind of things should we consider?</label><div className="choices">{categories.map(v=><button type="button" key={v} className={`choice ${selectedCategories.includes(v)?"active":""}`} onClick={()=>toggle(v,selectedCategories,setSelectedCategories)}>{v}</button>)}</div></div>
 <div className="field"><label>Anything we should avoid?</label><div className="choices">{exclusions.map(v=><button type="button" key={v} className={`choice ${selectedExclusions.includes(v)?"active":""}`} onClick={()=>toggle(v,selectedExclusions,setSelectedExclusions)}>{v}</button>)}</div></div>
 <div className="field"><label>Recipient's name</label><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Name"/></div>
 <div className="field"><label>Recipient email</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="recipient@example.com"/></div>
 <div className="field"><label>Delivery address</label><textarea required minLength={10} value={address} onChange={e=>setAddress(e.target.value)} placeholder="House / flat, street, area, city, PIN code"/></div>
 {recipientType==="SOMEONE_ELSE"&&<div className="field"><label>Gift message (optional)</label><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="A little note..."/></div>}
 <button className="submit" disabled={busy}>{busy?"Sending...":`Request my ₹${budget.toLocaleString("en-IN")} surprise`}</button><div className="notice">Demo mode: this records an order request only. No payment or shipment is enabled yet.</div>{result&&<div className="notice" role="status">{result}</div>}
 </form></main>;
}
