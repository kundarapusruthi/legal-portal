import { Link } from "react-router-dom";

const features = [
  { icon: "💬", title: "Legal FAQ Chatbot", text: "Ask legal questions in simple language, by text or voice.", to: "/chat" },
  { icon: "🔎", title: "Find a Lawyer", text: "Describe your problem and we suggest the area of law and matching lawyers.", to: "/find-lawyer" },
  { icon: "📄", title: "Document Guidance", text: "Know which documents to keep ready for your case.", to: "/documents" },
  { icon: "📝", title: "Document Generator", text: "Create a rental agreement, RTI application or legal notice as a PDF.", to: "/generate" },
  { icon: "🛡️", title: "Cybercrime Help", text: "Step-by-step guide if you are a victim of online fraud or abuse.", to: "/cyber-help" },
  { icon: "📅", title: "Book Appointment", text: "Pick a lawyer, choose a free slot and book in a minute.", to: "/find-lawyer" },
  { icon: "📜", title: "Know Your Rights", text: "Simple guides to your rights as a citizen, consumer, worker, tenant and more.", to: "/rights" },
  { icon: "⚠️", title: "Legal Risk Check", text: "Answer a few questions to see how prepared your case is and what to do next.", to: "/risk" },
  { icon: "🔍", title: "AI Document Analysis", text: "Upload a PDF and get a simple explanation plus risky clauses.", to: "/analyze" },
  { icon: "🏛️", title: "Court Procedure Tracker", text: "Learn the stages of a case and track your hearings.", to: "/court" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Legal help that is simple, affordable and within reach</h1>
        <p>
          Understand your rights, find the right lawyer and know your next step, before you spend on consultations.
        </p>
        <Link to="/chat" className="btn light">Ask the chatbot</Link>
        <Link to="/find-lawyer" className="btn outline" style={{ color: "#fff", borderColor: "#fff" }}>
          Find a lawyer
        </Link>
      </section>
      <div className="container">
        <h2 style={{ marginBottom: 14 }}>What you can do here</h2>
        <div className="grid">
          {features.map((f) => (
            <Link key={f.title} to={f.to} className="card feature">
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}