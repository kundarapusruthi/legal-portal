import { Link } from "react-router-dom";

const GROUPS = [
  {
    title: "Get answers",
    items: [
      { icon: "💬", title: "AI legal chatbot", text: "Ask any legal question in English, Hindi or Telugu, by typing or speaking. Answers cite their sources.", to: "/chat" },
      { icon: "📜", title: "Know your rights", text: "Plain-language guides to your rights as a citizen, woman, consumer, worker or tenant.", to: "/rights" },
      { icon: "⚠️", title: "Legal risk check", text: "Answer a few questions to see how prepared your case is and what to fix first.", to: "/risk" },
    ],
  },
  {
    title: "Get a lawyer",
    items: [
      { icon: "🔎", title: "Find a lawyer", text: "Describe your problem. We identify the area of law and match you with suitable lawyers.", to: "/find-lawyer" },
      { icon: "📅", title: "Book an appointment", text: "Choose a free time slot and book a consultation in under a minute.", to: "/find-lawyer" },
    ],
  },
  {
    title: "Handle your documents and case",
    items: [
      { icon: "🔍", title: "AI document analysis", text: "Upload a PDF and get a simple summary, risky clauses and what to ask for.", to: "/analyze" },
      { icon: "📝", title: "Document generator", text: "Create a rental agreement, RTI application or legal notice as a ready-to-print PDF.", to: "/generate" },
      { icon: "📄", title: "Document guidance", text: "A checklist of the papers you need for FIRs, consumer cases, property disputes and more.", to: "/documents" },
      { icon: "🏛️", title: "Court case tracker", text: "Understand each stage of a case and keep track of your hearing dates.", to: "/court" },
      { icon: "🛡️", title: "Cybercrime help", text: "A step-by-step guide to follow if you are a victim of online fraud or harassment.", to: "/cyber-help" },
    ],
  },
];

const STEPS = [
  { t: "Tell us your problem", d: "Type or speak in your own words. No legal terms needed." },
  { t: "Understand your options", d: "Get a clear explanation, the relevant area of law and the documents you need." },
  { t: "Take the next step", d: "Generate a document, check your risk, or book a lawyer when you need one." },
];

const HELPLINES = [
  { n: "112", l: "Emergency (police, fire, ambulance)" },
  { n: "1930", l: "Cyber fraud helpline" },
  { n: "15100", l: "Free legal aid (NALSA)" },
  { n: "181", l: "Women helpline" },
  { n: "1915", l: "National Consumer Helpline" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <span className="pill">✨ AI-powered legal information for everyone</span>
        <h1>Understand your rights. <span>Find the right help.</span></h1>
        <p>
          Simple answers, document tools and lawyer search, so you can make informed decisions before you spend time and money on consultations.
        </p>
        <Link to="/chat" className="btn light">💬 Ask a legal question</Link>
        <Link to="/find-lawyer" className="btn ghost">Find a lawyer</Link>
      </section>

      <div className="trust">
        <span>🌐 English · हिन्दी · తెలుగు</span>
        <span>🎤 Voice input</span>
        <span>📚 Answers cite their sources</span>
        <span>🔒 Your data stays private</span>
      </div>

      <section className="section">
        <h2>How it works</h2>
        <p className="lead">From confusion to a clear next step in three simple stages.</p>
        <div className="how">
          {STEPS.map((s, i) => (
            <div className="card" key={s.t}>
              <div className="n">{i + 1}</div>
              <h3>{s.t}</h3>
              <p className="muted" style={{ margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Everything in one place</h2>
        <p className="lead">Tools for understanding the law, finding a lawyer and managing your case.</p>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="group-title">{g.title}</div>
            <div className="grid">
              {g.items.map((f) => (
                <Link key={f.title} to={f.to} className="card feature">
                  <div className="icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="section">
        <h2>Need help right now?</h2>
        <p className="lead">Save these numbers. All of them are free to call in India.</p>
        <div className="helplines">
          {HELPLINES.map((h) => (
            <a key={h.n} href={`tel:${h.n}`} className="helpline" style={{ textDecoration: "none" }}>
              <b>{h.n}</b>
              <span>{h.l}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}