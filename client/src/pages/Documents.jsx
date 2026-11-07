import { useState } from "react";

const GUIDE = {
  "Filing an FIR / police complaint": [
    "A written complaint describing what happened (date, time, place, people involved)",
    "Your ID proof (Aadhaar, voter ID, passport, etc.)",
    "Address proof",
    "Any evidence: photos, videos, medical report, messages, bills",
    "Details of witnesses, if any",
  ],
  "Consumer complaint (defective product / poor service)": [
    "Bill, invoice or payment receipt",
    "Warranty or guarantee card",
    "Photos or videos of the defect",
    "Emails, messages or letters sent to the seller or company",
    "Your ID and address proof",
    "Written complaint or notice stating your demand (refund, repair, replacement)",
  ],
  "Cyber fraud / online harassment": [
    "Screenshots of messages, emails, profiles, or the fraudulent website",
    "Transaction details: amount, date, UTR/reference number, bank statement",
    "Phone numbers, UPI IDs, links or account details used by the offender",
    "Your ID proof and bank account details",
    "Acknowledgement number once you file the complaint online",
  ],
  "Rental or property dispute": [
    "Rent agreement and rent receipts",
    "Security deposit payment proof",
    "Sale deed, title documents or encumbrance certificate (for property ownership disputes)",
    "Property tax and utility bill receipts",
    "Messages, notices or letters exchanged with the other party",
    "Your ID and address proof",
  ],
  "Family matters (divorce, maintenance, custody)": [
    "Marriage certificate and marriage photographs",
    "ID and address proof of both parties",
    "Children's birth certificates (for custody matters)",
    "Income proof, such as salary slips or tax returns (for maintenance)",
    "Evidence relevant to your case: messages, medical reports, police complaints",
  ],
  "Employment / labour issue": [
    "Appointment letter and employment contract",
    "Salary slips and bank statements",
    "PF and ESI details",
    "Termination or warning letters",
    "Emails or messages with the employer or HR",
    "Your ID proof",
  ],
};

export default function Documents() {
  const topics = Object.keys(GUIDE);
  const [topic, setTopic] = useState(topics[0]);

  return (
    <div className="container">
      <h2>📄 Document guidance</h2>
      <p className="muted">Select your type of case to see which documents to keep ready.</p>

      <div className="chips">
        {topics.map((t) => (
          <button
            key={t}
            className="chip"
            style={t === topic ? { background: "var(--primary)", color: "#fff" } : {}}
            onClick={() => setTopic(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card">
        <h3>{topic}</h3>
        <ul>
          {GUIDE[topic].map((d) => <li key={d} style={{ margin: "8px 0" }}>{d}</li>)}
        </ul>
        <p className="muted">
          This is a general checklist. Exact requirements vary by case and court, so confirm with a lawyer.
          Always keep photocopies and store digital copies safely.
        </p>
      </div>
    </div>
  );
}