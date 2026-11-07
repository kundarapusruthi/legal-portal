import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const TOPICS = {
  consumer: {
    label: "Consumer complaint",
    questions: [
      { id: "bill", text: "Do you have the bill or payment receipt?", riskIf: "no", points: 2, tip: "Without a bill, proving the purchase is harder. Look for bank or UPI statements, order emails or the warranty card." },
      { id: "proof", text: "Do you have photos, videos or reports showing the defect?", riskIf: "no", points: 2, tip: "Record clear photos or videos of the problem before anything changes." },
      { id: "written", text: "Have you complained to the seller or company in writing (email or letter)?", riskIf: "no", points: 1, tip: "Send a written complaint first. It creates a record and is usually needed before going to a Consumer Commission." },
      { id: "old", text: "Did the problem start more than 2 years ago?", riskIf: "yes", points: 3, tip: "A consumer complaint is generally to be filed within 2 years, so you may need legal advice quickly about a delay." },
    ],
    steps: [
      "Send a written complaint or legal notice to the seller.",
      "Call the National Consumer Helpline (1915) for help in resolving it.",
      "If unresolved, file a complaint on e-Daakhil with the proper Consumer Commission.",
    ],
  },
  rental: {
    label: "Rent / landlord dispute",
    questions: [
      { id: "agreement", text: "Do you have a written rent agreement?", riskIf: "no", points: 2, tip: "A verbal arrangement is hard to prove. Ask for a written agreement and keep proof of every payment." },
      { id: "deposit", text: "Do you have proof that you paid the security deposit?", riskIf: "no", points: 2, tip: "Look for bank transfers, UPI records or a signed receipt." },
      { id: "receipts", text: "Do you have rent receipts or payment records?", riskIf: "no", points: 1, tip: "Bank statements can work as proof of rent paid." },
      { id: "threat", text: "Is the landlord threatening to evict you suddenly or cutting water or electricity?", riskIf: "yes", points: 3, tip: "Forced eviction or cutting essential services is not lawful. Document it and get legal advice quickly." },
    ],
    steps: [
      "Collect the agreement, receipts and all messages with the landlord.",
      "Send a written legal notice stating your demand.",
      "If it is not resolved, consult a lawyer about a civil case or approaching the Rent Authority.",
    ],
  },
  cyber: {
    label: "Cyber fraud",
    questions: [
      { id: "money", text: "Has money already been taken from your account?", riskIf: "yes", points: 3, tip: "Call 1930 immediately. The first hours matter most for freezing the money." },
      { id: "late", text: "Did it happen more than 24 hours ago?", riskIf: "yes", points: 2, tip: "Report right away anyway. Delays reduce the chance of recovery." },
      { id: "bank", text: "Have you informed your bank?", riskIf: "no", points: 2, tip: "Call your bank now and ask them to block your card, UPI or net banking." },
      { id: "evidence", text: "Have you saved screenshots, transaction IDs and phone numbers or links used?", riskIf: "no", points: 2, tip: "Save everything and do not delete chats or emails." },
    ],
    steps: [
      "Call the cybercrime helpline 1930 and inform your bank.",
      "File a complaint at cybercrime.gov.in and keep the acknowledgement number.",
      "Change your passwords and enable two-factor authentication.",
    ],
  },
  employment: {
    label: "Job / salary problem",
    questions: [
      { id: "letter", text: "Do you have an appointment letter or employment contract?", riskIf: "no", points: 2, tip: "Gather any proof of employment such as emails, ID cards or offer letters." },
      { id: "slips", text: "Do you have salary slips or bank statements showing your pay?", riskIf: "no", points: 2, tip: "Bank statements can prove your salary history." },
      { id: "unpaid", text: "Has your salary been unpaid for more than 2 months?", riskIf: "yes", points: 2, tip: "Send a written demand and consider a complaint to the Labour Department." },
      { id: "fired", text: "Were you terminated without written notice or reason?", riskIf: "yes", points: 2, tip: "Ask for the termination in writing and keep all communication." },
    ],
    steps: [
      "Send a written demand to your employer or HR.",
      "Keep copies of all letters, emails and messages.",
      "Complain to the Labour Department or consult a lawyer if there is no response.",
    ],
  },
};

function levelFor(score, max) {
  const pct = score / max;
  if (pct <= 0.25) return { name: "Low", cls: "confirmed", text: "Your position looks fairly well prepared." };
  if (pct <= 0.55) return { name: "Medium", cls: "pending", text: "There are gaps you should fix soon." };
  return { name: "High", cls: "cancelled", text: "There are serious gaps or urgent issues. Act quickly and consider speaking to a lawyer." };
}

export default function Risk() {
  const [topicId, setTopicId] = useState("consumer");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const topic = TOPICS[topicId];
  const complete = topic.questions.every((q) => answers[q.id]);

  function chooseTopic(id) {
    setTopicId(id);
    setAnswers({});
    setResult(null);
  }

  function assess() {
    const max = topic.questions.reduce((s, q) => s + q.points, 0);
    const triggered = topic.questions.filter((q) => answers[q.id] === q.riskIf);
    const score = triggered.reduce((s, q) => s + q.points, 0);
    setResult({ score, max, level: levelFor(score, max), tips: triggered.map((q) => q.tip) });
  }

  return (
    <div className="container">
      <PageHeader
        icon="⚠️"
        title="Legal risk check"
        subtitle="Answer a few quick questions to see how prepared your case is and what to do next. This is an indicative checklist, not legal advice."
      />

      <div className="chips">
        {Object.entries(TOPICS).map(([id, t]) => (
          <button
            key={id}
            className="chip"
            style={id === topicId ? { background: "var(--primary)", color: "#fff" } : {}}
            onClick={() => chooseTopic(id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        <h3>{topic.label}</h3>
        {topic.questions.map((q) => (
          <div className="q" key={q.id}>
            <div>{q.text}</div>
            <div className="yn">
              {["yes", "no"].map((v) => (
                <button
                  key={v}
                  className={`slot ${answers[q.id] === v ? "selected" : ""}`}
                  onClick={() => { setAnswers({ ...answers, [q.id]: v }); setResult(null); }}
                >
                  {v === "yes" ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className="btn" style={{ marginTop: 14 }} disabled={!complete} onClick={assess}>
          Assess my risk
        </button>
      </div>

      {result && (
        <div className="card result">
          <p className="muted" style={{ margin: 0 }}>Your risk level</p>
          <h3>
            <span className={`badge ${result.level.cls}`}>{result.level.name}</span>{" "}
            <span className="muted">({result.score} of {result.max} risk points)</span>
          </h3>
          <p>{result.level.text}</p>

          {result.tips.length > 0 && (
            <>
              <b>What to fix</b>
              {result.tips.map((t) => <div className="tip" key={t}>{t}</div>)}
            </>
          )}

          <b>Suggested next steps</b>
          <ol>{topic.steps.map((s) => <li key={s}>{s}</li>)}</ol>

          <div className="row">
            <Link to="/find-lawyer" className="btn sm">Find a lawyer</Link>
            <Link to="/chat" className="btn sm outline">Ask the chatbot</Link>
          </div>
        </div>
      )}
    </div>
  );
}