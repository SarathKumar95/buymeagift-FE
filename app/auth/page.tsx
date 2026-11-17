"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function apiErrorMessage(detail: unknown, fallback: string) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const emailError = detail.some(
      (item) => typeof item === "object" && item && "loc" in item &&
        Array.isArray(item.loc) && item.loc.includes("email")
    );
    if (emailError) return "Enter a valid email address.";
    const messages = detail
      .map((item) => typeof item === "object" && item && "msg" in item ? String(item.msg) : null)
      .filter((message): message is string => Boolean(message));
    if (messages.length) return messages.join(" ");
  }
  return fallback;
}

export default function AuthPage() {
  const [mode,setMode]=useState<"login"|"register">("register");
  const [name,setName]=useState(""); const [email,setEmail]=useState("");
  const [phone,setPhone]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const [confirmationEmail,setConfirmationEmail]=useState("");
  const router=useRouter();
  async function resendVerification(){
    setBusy(true); setError("");
    try {
      const r=await fetch(`${API}/api/auth/resend-verification`,{method:"POST",credentials:"include"});
      const d=await r.json(); if(!r.ok) throw new Error(apiErrorMessage(d.detail,"Could not resend confirmation email"));
    } catch(err) { setError(err instanceof Error?err.message:"Something went wrong"); }
    finally { setBusy(false); }
  }
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      if(mode==="register") {
        const r=await fetch(`${API}/api/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,phone:`+91${phone}`,password})});
        const d=await r.json(); if(!r.ok) throw new Error(apiErrorMessage(d.detail,"Registration failed"));
      }
      const r=await fetch(`${API}/api/auth/login`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      const d=await r.json(); if(!r.ok) throw new Error(apiErrorMessage(d.detail,"Login failed"));
      if(mode==="register") { setConfirmationEmail(email); return; }
      router.push(new URLSearchParams(window.location.search).get("next") || "/dashboard");
    } catch(err) { setError(err instanceof Error?err.message:"Something went wrong"); }
    finally {setBusy(false);}
  }
  if(confirmationEmail) return <main className="shell"><nav className="nav"><a className="logo" href="/">buy me a <span>random</span> gift.</a></nav><section className="order"><div className="eyebrow">One last step</div><h2>Check your inbox</h2><p className="muted">We sent a confirmation link to <b>{confirmationEmail}</b>. Open it to verify your account and continue to your dashboard.</p><button className="submit" onClick={resendVerification} disabled={busy}>{busy?"Sending...":"Resend confirmation email"}</button>{error&&<div className="notice" role="alert">{error}</div>}</section></main>;
  return <main className="shell">
    <nav className="nav"><a className="logo" href="/">buy me a <span>random</span> gift.</a><a className="pill" href="/">← Home</a></nav>
    <section className="order">
      <div className="eyebrow">Your little corner of surprises</div>
      <h2>{mode==="register"?"Create your account":"Welcome back"}</h2>
      <p className="muted">Save your details, track your orders and keep the surprises coming.</p>
      <div className="choices" style={{margin:"22px 0"}}>
        <button type="button" className={`choice ${mode==="register"?"active":""}`} onClick={()=>setMode("register")}>Create account</button>
        <button type="button" className={`choice ${mode==="login"?"active":""}`} onClick={()=>setMode("login")}>Sign in</button>
      </div>
      <form onSubmit={submit}>
        {mode==="register"&&<div className="field"><label>Full name</label><input required value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Your name"/></div>}
        <div className="field"><label>Email address</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com"/></div>
        {mode==="register"&&<div className="field"><label>Phone number</label><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontWeight:700}}>+91</span><input required type="tel" inputMode="numeric" pattern="[0-9]{10}" minLength={10} maxLength={10} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} autoComplete="tel-national" placeholder="98765 43210"/></div></div>}
        <div className="field"><label>Password</label><input required type="password" minLength={10} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==="register"?"new-password":"current-password"} placeholder="At least 10 characters"/></div>
        <button className="submit" disabled={busy}>{busy?"Please wait...":mode==="register"?"Create account":"Sign in"}</button>
      </form>
      <div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0",color:"#999"}}><span style={{height:1,background:"#e9e3da",flex:1}}/>OR<span style={{height:1,background:"#e9e3da",flex:1}}/></div>
      <a className="cta" style={{display:"flex",justifyContent:"center",margin:0,background:"#fff",color:"#24221f",border:"1px solid #e9e3da"}} href={`${API}/api/auth/google`}>Continue with Google</a>
      {error&&<div className="notice" role="alert">{error}</div>}
      <div className="notice">Your phone number is required to place an order. Google sign-in users will be asked to add it before checkout.</div>
    </section>
  </main>;
}
