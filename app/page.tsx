import Link from "next/link";

export default function Home() {
  return <main>
    <div className="shell">
      <nav className="nav"><Link className="logo" href="/">buy me a <span>random</span> gift.</Link><a className="pill" href="#how">How it works</a></nav>
      <section className="hero">
        <div>
          <div className="eyebrow">A little joy, delivered</div>
          <h1>Good things<br/>come to those<br/><em>who don't choose.</em></h1>
          <p className="lead">Pick your budget. Tell us a little about what you like. Then let the surprise find its way to your door.</p>
          <Link className="cta" href="/order">Get me a surprise&nbsp; ↗</Link>
          <p className="muted" style={{fontSize:12,marginTop:14}}>For you, or someone who deserves a little joy.</p>
        </div>
        <div className="hero-art" aria-label="Illustration of a wrapped mystery gift">
          <span className="spark" style={{top:42,left:48}}>✦</span><span className="spark" style={{right:50,bottom:54}}>✧</span>
          <div className="gift"><div className="bow"/></div>
        </div>
      </section>
      <section className="section" id="how">
        <div className="eyebrow">The fun part is not knowing</div><h2>Three steps. Zero spoilers.</h2>
        <p className="muted">A thoughtful surprise, without the endless scrolling.</p>
        <div className="steps">
          <article className="step"><div>01 · YOU PICK</div><b>Choose your budget</b><span className="muted">A little treat or a bigger surprise. Your call.</span></article>
          <article className="step"><div>02 · WE CURATE</div><b>Set your no-go list</b><span className="muted">Tell us what to avoid. We'll keep the actual gift secret.</span></article>
          <article className="step"><div>03 · SURPRISE!</div><b>Wait for the knock</b><span className="muted">Your mystery gift makes its way to the doorstep.</span></article>
        </div>
      </section>
      <section className="section" style={{paddingTop:0}}>
        <div className="panel" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,flexWrap:"wrap"}}>
          <div><div className="eyebrow">A gift from you, to you</div><h2 style={{marginBottom:4}}>You deserve a plot twist.</h2><span className="muted">Make an ordinary day a little less ordinary.</span></div>
          <Link className="cta" href="/order">Surprise me ↗</Link>
        </div>
      </section>
      <footer className="footer">© 2026 Buy Me A Random Gift · A little surprise goes a long way.</footer>
    </div>
  </main>;
}
