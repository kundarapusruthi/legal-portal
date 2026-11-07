import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import PageHeader from "../components/PageHeader";

const PROCEDURES = {
  criminal: {
    label: "Criminal case",
    stages: [
      { title: "Complaint / FIR", text: "The offence is reported to the police and recorded as an FIR (or a complaint is made to a Magistrate)." },
      { title: "Investigation", text: "The police collect evidence, record statements and may arrest the accused." },
      { title: "Arrest and bail", text: "The accused is produced before a Magistrate and may apply for bail." },
      { title: "Charge sheet", text: "After investigation the police file a final report (charge sheet) in court." },
      { title: "Cognizance and framing of charges", text: "The court takes note of the case and formally states the charges against the accused." },
      { title: "Trial", text: "The prosecution and the defence present witnesses and evidence." },
      { title: "Final arguments", text: "Both sides sum up their case before the judge." },
      { title: "Judgment", text: "The court gives its verdict: conviction or acquittal, and the sentence if convicted." },
      { title: "Appeal", text: "Either side may appeal to a higher court within the time allowed." },
    ],
  },
  civil: {
    label: "Civil case",
    stages: [
      { title: "Legal notice", text: "A written notice is usually sent first, stating the claim and asking the other side to resolve it." },
      { title: "Filing the plaint", text: "The suit is filed in the proper civil court with documents and court fee." },
      { title: "Summons", text: "The court sends summons to the defendant to appear." },
      { title: "Written statement", text: "The defendant files a reply to the claim." },
      { title: "Framing of issues", text: "The court lists the points in dispute that must be decided." },
      { title: "Evidence", text: "Both sides present documents and witnesses." },
      { title: "Final arguments", text: "Lawyers argue the case based on the evidence." },
      { title: "Judgment and decree", text: "The court decides the case and passes a decree." },
      { title: "Appeal or execution", text: "The losing side may appeal, and the winner may apply to enforce the decree." },
    ],
  },
  consumer: {
    label: "Consumer case",
    stages: [
      { title: "Complaint to seller", text: "Write to the seller or company explaining the problem and your demand." },
      { title: "Legal notice", text: "If unresolved, send a formal legal notice giving a time limit." },
      { title: "File complaint", text: "File the complaint with the District, State or National Consumer Commission, online or in person." },
      { title: "Notice to opposite party", text: "The Commission sends notice and gives the other side time to reply." },
      { title: "Reply and evidence", text: "Both sides submit written replies, affidavits and documents." },
      { title: "Hearing and arguments", text: "The Commission hears both sides." },
      { title: "Final order", text: "The Commission may order refund, replacement, repair or compensation." },
      { title: "Appeal or execution", text: "Either side may appeal to the next level, and the order can be enforced if not followed." },
    ],
  },
  family: {
    label: "Family case (e.g. divorce)",
    stages: [
      { title: "Notice / counselling", text: "Many cases begin with a notice and an attempt at counselling or settlement." },
      { title: "Petition filed", text: "The petition is filed in the Family Court with documents." },
      { title: "Notice to spouse", text: "The court notifies the other party to appear and reply." },
      { title: "Reply", text: "The other party files a written response." },
      { title: "Mediation", text: "The court often refers the parties to mediation to try for a settlement." },
      { title: "Evidence", text: "If there is no settlement, both sides present evidence." },
      { title: "Final arguments", text: "Lawyers argue the case before the judge." },
      { title: "Decree / order", text: "The court passes a decree or order, including any maintenance or custody terms." },
      { title: "Appeal", text: "Either side may appeal to the High Court within the time allowed." },
    ],
  },
};

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateStr + "T00:00:00") - today) / 86400000);
};

function Guide() {
  const [type, setType] = useState("criminal");
  const p = PROCEDURES[type];
  return (
    <>
      <div className="chips">
        {Object.entries(PROCEDURES).map(([id, v]) => (
          <button
            key={id}
            className="chip"
            style={id === type ? { background: "var(--primary)", color: "#fff" } : {}}
            onClick={() => setType(id)}
          >
            {v.label}
          </button>
        ))}
      </div>
      {p.stages.map((s, i) => (
        <div className="card step" key={s.title}>
          <div className="num">{i + 1}</div>
          <div>
            <h3>{s.title}</h3>
            <p style={{ margin: 0 }}>{s.text}</p>
          </div>
        </div>
      ))}
      <p className="muted">
        This is a general outline. Real cases vary by court, state and the specific law, and timelines can differ widely. Ask your lawyer which stages apply to you.
      </p>
    </>
  );
}

const EMPTY = { title: "", type: "consumer", court: "", caseNumber: "", nextHearing: "", notes: "" };

function Tracker() {
  const { user } = useAuth();
  const [cases, setCases] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api("/cases/mine").then(setCases).catch((e) => setError(e.message));
  useEffect(() => { if (user) load(); }, [user]);

  if (!user)
    return (
      <div className="card" style={{ textAlign: "center" }}>
        <p>Please log in to track your cases.</p>
        <Link to="/login" state={{ from: "/court" }} className="btn">Log in</Link>
      </div>
    );

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function add() {
    setError("");
    if (!form.title.trim()) return setError("Please enter a case title.");
    setBusy(true);
    try {
      await api("/cases", { method: "POST", body: form });
      setForm(EMPTY);
      await load();
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  async function update(id, body) {
    setError("");
    try {
      await api(`/cases/${id}`, { method: "PATCH", body });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!confirm("Remove this case from your tracker?")) return;
    try {
      await api(`/cases/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="card">
        <h3>Add a case to track</h3>
        <label>Case title *</label>
        <input value={form.title} onChange={set("title")} placeholder="e.g. Refund case against ABC Mobiles" />
        <label>Type of case</label>
        <select value={form.type} onChange={set("type")}>
          {Object.entries(PROCEDURES).map(([id, v]) => <option key={id} value={id}>{v.label}</option>)}
        </select>
        <label>Court (optional)</label>
        <input value={form.court} onChange={set("court")} placeholder="e.g. District Consumer Commission, Hyderabad" />
        <label>Case number (optional)</label>
        <input value={form.caseNumber} onChange={set("caseNumber")} />
        <label>Next hearing date (optional)</label>
        <input type="date" value={form.nextHearing} onChange={set("nextHearing")} />
        <label>Notes (optional)</label>
        <textarea rows={2} value={form.notes} onChange={set("notes")} />
        {error && <p className="error">{error}</p>}
        <button className="btn" style={{ marginTop: 12 }} onClick={add} disabled={busy}>
          {busy ? "Saving..." : "Add case"}
        </button>
      </div>

      <div className="card row between">
        <span>Want the official status of a filed case?</span>
        <a className="btn sm outline" href="https://services.ecourts.gov.in/ecourtindia_v6/" target="_blank" rel="noreferrer">
          Open eCourts case status ↗
        </a>
      </div>

      {cases === null && !error && <p>Loading...</p>}
      {cases?.length === 0 && <div className="card">No cases yet. Add one above.</div>}

      {cases?.map((c) => {
        const proc = PROCEDURES[c.type];
        const last = proc.stages.length - 1;
        const stage = Math.min(c.stage, last);
        const pct = Math.round(((stage + 1) / proc.stages.length) * 100);
        const days = daysUntil(c.nextHearing);

        return (
          <div className="card" key={c._id}>
            <div className="row between">
              <div>
                <h3 style={{ margin: 0 }}>{c.title}</h3>
                <span className="badge">{proc.label}</span>
                {c.court && <span className="muted"> {c.court}</span>}
                {c.caseNumber && <span className="muted"> · No. {c.caseNumber}</span>}
              </div>
              <button className="btn sm danger" onClick={() => remove(c._id)}>Remove</button>
            </div>

            <div className="progress"><div style={{ width: `${pct}%` }} /></div>
            <p style={{ margin: 0 }}>
              <b>Stage {stage + 1} of {proc.stages.length}:</b> {proc.stages[stage].title}
            </p>
            <p className="muted" style={{ margin: "4px 0 10px" }}>{proc.stages[stage].text}</p>

            <div className="row">
              <button className="btn sm outline" disabled={stage === 0} onClick={() => update(c._id, { stage: stage - 1 })}>
                ← Previous stage
              </button>
              <button className="btn sm" disabled={stage === last} onClick={() => update(c._id, { stage: stage + 1 })}>
                Next stage →
              </button>
            </div>

            <div className="row" style={{ marginTop: 12 }}>
              <label style={{ margin: 0 }}>Next hearing</label>
              <input
                type="date"
                style={{ width: 170, margin: 0 }}
                value={c.nextHearing}
                onChange={(e) => update(c._id, { nextHearing: e.target.value })}
              />
              {days !== null && (
                <span className={`badge ${days < 0 ? "cancelled" : days <= 7 ? "pending" : "confirmed"}`}>
                  {days < 0 ? `${-days} day(s) ago` : days === 0 ? "Today" : `in ${days} day(s)`}
                </span>
              )}
            </div>
            {c.notes && <p className="muted" style={{ marginTop: 10 }}>📝 {c.notes}</p>}
          </div>
        );
      })}
    </>
  );
}

export default function Court() {
  const [tab, setTab] = useState("guide");
  return (
    <div className="container">
      <PageHeader
        icon="🏛️"
        title="Court procedure and case tracker"
        subtitle="Understand the stages of a case and track your own hearings."
      />
      <div className="tabs">
        <button className={`tab ${tab === "guide" ? "active" : ""}`} onClick={() => setTab("guide")}>Procedure guide</button>
        <button className={`tab ${tab === "tracker" ? "active" : ""}`} onClick={() => setTab("tracker")}>My cases</button>
      </div>
      {tab === "guide" ? <Guide /> : <Tracker />}
    </div>
  );
}