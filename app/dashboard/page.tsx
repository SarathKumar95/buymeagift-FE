"use client";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
const API=process.env.NEXT_PUBLIC_API_URL||"http://localhost:8000";
type User={id:number;name:string;email:string;phone:string;is_admin:boolean;is_email_confirmed:boolean};
type Order={order_number:string;status:string;budget:number;created_at:string;recipient_type:string};
type Address={id:number;label:string;recipient_name:string;phone:string;line1:string;line2?:string;city:string;state:string;postal_code:string;is_default:boolean};
export default function Dashboard(){
 const router=useRouter();const [user,setUser]=useState<User|null>(null);const [orders,setOrders]=useState<Order[]>([]);const [addresses,setAddresses]=useState<Address[]>([]);const [error,setError]=useState("");
 const [form,setForm]=useState({label:"Home",recipient_name:"",phone:"",line1:"",line2:"",city:"",state:"Kerala",postal_code:"",is_default:true});
 async function load(){
  const requestOptions={credentials:"include" as RequestCredentials,cache:"no-store" as RequestCache};
  const [u,o,a]=await Promise.all([fetch(`${API}/api/auth/me`,requestOptions),fetch(`${API}/api/orders`,requestOptions),fetch(`${API}/api/addresses`,requestOptions)]);
  if(u.status===401){router.replace("/auth?next=/dashboard");return}
  if(!u.ok||!o.ok||!a.ok)throw new Error("Could not load your account");
  setUser(await u.json());setOrders(await o.json());setAddresses(await a.json());
 }
 useEffect(()=>{load().catch(e=>setError(e.message))},[]);
 async function addAddress(e:React.FormEvent){e.preventDefault();setError("");const r=await fetch(`${API}/api/addresses`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const d=await r.json();if(!r.ok){setError(d.detail||"Could not save address");return}setAddresses(x=>[d,...x]);setForm({...form,recipient_name:"",phone:"",line1:"",line2:"",city:"",postal_code:""});}
 async function removeAddress(id:number){const r=await fetch(`${API}/api/addresses/${id}`,{method:"DELETE",credentials:"include"});if(r.ok)setAddresses(x=>x.filter(a=>a.id!==id));}
 async function logout(){
  setError("");
  try {
   const response=await fetch(`${API}/api/auth/logout`,{method:"POST",credentials:"include",cache:"no-store"});
   if(!response.ok) throw new Error("Could not sign out. Please try again.");
   setUser(null); setOrders([]); setAddresses([]);
   window.location.assign("/");
  } catch(err) { setError(err instanceof Error?err.message:"Could not sign out. Please try again."); }
 }
 async function resendVerification(){const r=await fetch(`${API}/api/auth/resend-verification`,{method:"POST",credentials:"include"});const d=await r.json();if(!r.ok){setError(d.detail||"Could not resend confirmation email");return}setError("Confirmation email sent. Check your inbox.");}
 if(!user&&!error)return <main className="shell"><p>Loading your account…</p></main>;
 return <main className="shell"><nav className="nav"><a className="logo" href="/">buy me a <span>random</span> gift.</a><button className="pill" onClick={logout}>Sign out</button></nav>
  <section className="section"><div className="eyebrow">Your account</div><h2>Hello{user?`, ${user.name}`:""} 👋</h2><p className="muted">{user?.email} · {user?.phone}</p>{error&&<div className="notice">{error}</div>}
   {!user?.is_email_confirmed&&<div className="panel"><h3>Confirm your email before ordering</h3><p className="muted">Open the confirmation link sent to {user?.email}.</p><button className="submit" onClick={resendVerification}>Resend confirmation email</button></div>}
   {user?.phone.startsWith("PENDING-")&&<div className="panel"><h3>Add your phone number</h3><PhoneForm onSaved={load}/></div>}
   <div className="panel" style={{marginTop:20}}><h2 style={{fontSize:26}}>Your surprises</h2>{orders.length===0?<p className="muted">No orders yet. Your first surprise is waiting.</p>:orders.map(o=><div key={o.order_number} style={{padding:"14px 0",borderBottom:"1px solid #e9e3da",display:"flex",justifyContent:"space-between",gap:12}}><div><b>{o.order_number}</b><div className="muted" style={{fontSize:13}}>{new Date(o.created_at).toLocaleDateString("en-IN")} · {o.recipient_type==="SELF"?"For you":"A gift"}</div></div><div style={{textAlign:"right"}}><b>₹{o.budget.toLocaleString("en-IN")}</b><div className="muted" style={{fontSize:13}}>{o.status}</div></div></div>)}</div>
   <div className="panel" style={{marginTop:20}}><h2 style={{fontSize:26}}>Saved addresses</h2>{addresses.map(a=><div key={a.id} style={{padding:"12px 0",borderBottom:"1px solid #e9e3da"}}><div style={{display:"flex",justifyContent:"space-between"}}><b>{a.label} {a.is_default?"· Default":""}</b><button className="choice" onClick={()=>removeAddress(a.id)}>Remove</button></div><div className="muted" style={{fontSize:14}}>{a.recipient_name} · {a.phone}<br/>{a.line1} {a.line2} · {a.city}, {a.state} {a.postal_code}</div></div>)}
    <form onSubmit={addAddress}><h3>Add an address</h3><div className="field"><label>Label</label><input value={form.label} onChange={e=>setForm({...form,label:e.target.value})} required/></div>
    {(["recipient_name","phone","line1","line2","city","state","postal_code"] as const).map(k=><div className="field" key={k}><label>{({recipient_name:"Recipient name",phone:"Phone",line1:"Address line 1",line2:"Address line 2",city:"City",state:"State",postal_code:"PIN code"} as Record<string,string>)[k]}</label><input required={k!=="line2"} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></div>)}
    <label style={{display:"flex",gap:8,alignItems:"center"}}><input style={{width:"auto"}} type="checkbox" checked={form.is_default} onChange={e=>setForm({...form,is_default:e.target.checked})}/> Make default address</label><button className="submit">Save address</button></form>
   </div>
  </section></main>
}
function PhoneForm({onSaved}:{onSaved:()=>void}){const [phone,setPhone]=useState("");const [error,setError]=useState("");async function save(e:React.FormEvent){e.preventDefault();const r=await fetch(`${API}/api/me/phone`,{method:"PATCH",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:`+91${phone}`})});const d=await r.json();if(!r.ok){setError(d.detail||"Could not save phone");return}onSaved()}return <form onSubmit={save}><div style={{display:"flex",alignItems:"center",gap:8}}><b>+91</b><input required inputMode="numeric" pattern="[0-9]{10}" minLength={10} maxLength={10} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="98765 43210"/></div><button className="submit">Save phone number</button>{error&&<p>{error}</p>}</form>}
