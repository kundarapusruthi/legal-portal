import { useEffect, useState } from "react";
import { api, BASE } from "../api";
import PageHeader from "../components/PageHeader";

export default function Generate() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/generate/templates")
      .then((t) => { setTemplates(t); setSelected(t[0]); })
      .catch((e) => setError(e.message));
  }, []);

  function choose(t) {
    setSelected(t);
    setValues({});
    setError("");
  }

  async function download() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`${BASE}/generate/${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not generate the document");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selected.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="container">
      <PageHeader
        icon="📝"
        title="Document generator"
        subtitle="Fill in the details and download a ready-to-print PDF draft."
      />

      <div className="chips">
        {templates.map((t) => (
          <button
            key={t.id}
            className="chip"
            style={selected?.id === t.id ? { background: "var(--primary)", color: "#fff" } : {}}
            onClick={() => choose(t)}
          >
            {t.title.split(" under")[0]}
          </button>
        ))}
      </div>

      {selected && (
        <div className="card">
          <h3>{selected.title}</h3>
          {selected.fields.map((f) => (
            <div key={f.key}>
              <label>{f.label}{f.required && " *"}</label>
              {f.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={values[f.key] || ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                />
              ) : (
                <input
                  type={f.type || "text"}
                  value={values[f.key] || ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          {error && <p className="error">{error}</p>}
          <button className="btn" style={{ marginTop: 14 }} onClick={download} disabled={busy}>
            {busy ? "Generating..." : "Download PDF"}
          </button>
          <p className="muted" style={{ marginTop: 12 }}>
            These are general drafts, not legal advice. Have a lawyer review important documents. PDFs are in English.
          </p>
        </div>
      )}
    </div>
  );
}