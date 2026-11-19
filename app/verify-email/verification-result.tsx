"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function VerificationResult({ confirmed }: { confirmed: boolean }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include", cache: "no-store" })
      .then((response) => setSignedIn(response.ok))
      .catch(() => setSignedIn(false));
  }, []);

  const invalidLinkMessage = signedIn
    ? "This confirmation link is invalid, expired, or has already been used. You're already signed in, so you can continue to your account."
    : "This confirmation link is invalid, expired, or has already been used. Sign in to request a new confirmation email.";

  return <main className="shell">
    <nav className="nav">
      <a className="logo" href="/">buy me a <span>random</span> gift.</a>
      <a className="pill" href="/">← Home</a>
    </nav>
    <section className="order verification-result" aria-labelledby="verification-heading">
      <div className="eyebrow">Email verification</div>
      <h2 id="verification-heading">{confirmed ? "You're all set." : "This link can't be used."}</h2>
      {confirmed ? <>
        <p className="muted">Your email is confirmed. You can now place a surprise request.</p>
        <a className="submit verification-action" href="/dashboard">Continue to my account</a>
      </> : signedIn === null ? <p className="muted">Checking your account…</p> : <>
        <p className="muted">{invalidLinkMessage}</p>
        <a className="submit verification-action" href={signedIn ? "/dashboard" : "/auth"}>{signedIn ? "Go to my account" : "Sign in to resend email"}</a>
      </>}
    </section>
  </main>;
}
