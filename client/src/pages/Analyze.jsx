import { useState } from "react";
import { Link } from "react-router-dom";
import { BASE } from "../api";
import { useAuth } from "../AuthContext";
import PageHeader from "../components/PageHeader";

const SEV = { Low: "confirmed", Medium: "pending", High: "cancelled" };

export default function Analyze() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function analyse() {
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("language", language);
      const res = await fetch(`${BASE}/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not analyse the document");
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  if (!user)
    return (
      <div className="container narrow">
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>🔍</div>
          <h2>AI document analysis</h2>
          <p>Please log in to analyse a document.</p>
          <Link to="/login" state={{ from: "/analyze" }} className="btn">Log in</Link>
        </div>
      </div>
    );

  return (
    <div className="container">
      <PageHeader
        icon="🔍"
        title="AI document analysis"
        subtitle="Upload a PDF and get a plain-language summary and the clauses that need attention."
      />

      <div className="card">
        <label style={{ marginTop: 0 }}>PDF file (max 5 MB)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => { setFile(e.target.files[0] || null); setResult(null); }}
        />
        <label>Explain in</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Hindi</option>
          <option>Telugu</option>
        </select>
        {error && <p className="error">{error}</p>}
        <button className="btn" style={{ marginTop: 12 }} disabled={!file || busy} onClick={analyse}>
          {busy ? "Analysing... this can take up to 30 seconds" : "Analyse document"}
        </button>
        <p className="muted" style={{ marginTop: 10 }}>
          Your file is sent to an AI service for analysis and is not stored by this portal. Avoid uploading documents with sensitive personal data you don't want shared.
        </p>
      </div>

      {result && (
        <>
          <div className="card result">
            <p className="muted" style={{ margin: 0 }}>Document type</p>
            <h3>{result.documentType}</h3>
            <p style={{ margin: 0 }}>{result.summary}</p>
          </div>

          {result.keyPoints.length > 0 && (
            <div className="card">
              <h3>Key points</h3>
              <ul>{result.keyPoints.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          )}

          <div className="card">
            <h3>⚠️ Clauses to review</h3>
            {result.risks.length === 0 && <p className="muted">No major risks were found.</p>}
            {result.risks.map((r, i) => (
              <div className="q" key={i}>
                <span className={`badge ${SEV[r.severity]}`}>{r.severity}</span>
                <b>{r.clause}</b>
                <p style={{ margin: "6px 0 0" }}>{r.issue}</p>
                {r.suggestion && <div className="tip">💡 {r.suggestion}</div>}
              </div>
            ))}
          </div>

          {result.missing.length > 0 && (
            <div className="card">
              <h3>Possibly missing</h3>
              <ul>{result.missing.map((m, i) => <li key={i}>{m}</li>)}</ul>
            </div>
          )}

          {result.nextSteps.length > 0 && (
            <div className="card">
              <h3>Suggested next steps</h3>
              <ol>{result.nextSteps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              <div className="row">
                <Link to="/find-lawyer" className="btn sm">Find a lawyer to review it</Link>
              </div>
            </div>
          )}

          <p className="muted">
            This AI analysis can miss things or make mistakes. It is not legal advice, so have a lawyer review important documents before signing.
          </p>
        </>
      )}
    </div>
  );
}