import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";
import PageHeader from "../components/PageHeader";

function LawyerCard({ lawyer }) {
  return (
    <div className="card lawyer">
      <div className="avatar">{lawyer.name.replace("Adv. ", "").charAt(0)}</div>
      <div className="info">
        <h3>{lawyer.name}</h3>
        <div>{lawyer.specialization.map((s) => <span className="badge" key={s}>{s}</span>)}</div>
        <p className="muted" style={{ margin: "4px 0 0" }}>
          📍 {lawyer.city} · {lawyer.experience} yrs experience · ⭐ {lawyer.rating}
          {lawyer.languages?.length > 0 && <> · 🗣️ {lawyer.languages.join(", ")}</>}
        </p>
      </div>
      <Link to={`/book/${lawyer._id}`} className="btn sm">Book</Link>
    </div>
  );
}

export default function FindLawyer() {
  const { user } = useAuth();
  const [problem, setProblem] = useState("");
  const [city, setCity] = useState(user?.city || "");
  const [result, setResult] = useState(null);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/lawyers").then(setLawyers).catch((e) => setError(e.message));
  }, []);

  async function analyse() {
    if (!problem.trim()) return setError("Please describe your problem first.");
    setError("");
    setLoading(true);
    try {
      const data = await api("/category", {
        method: "POST",
        body: { problem, city: city.trim() || undefined },
      });
      setResult(data);
      setLawyers(data.lawyers);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="container">
      <PageHeader
        icon="🔎"
        title="Find the right lawyer"
        subtitle="Describe what happened in your own words. We'll identify the area of law and suggest matching lawyers."
      />

      <div className="card">
        <label style={{ marginTop: 0 }}>What happened?</label>
        <textarea
          rows={4}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="e.g. Someone hacked my bank account and transferred money online"
        />
        <label>Your city (optional)</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Hyderabad" />
        {error && <p className="error">{error}</p>}
        <button className="btn" style={{ marginTop: 10 }} onClick={analyse} disabled={loading}>
          {loading ? "Analysing..." : "Analyse my problem"}
        </button>
      </div>

      {result && (
        <div className="card result">
          <p className="muted" style={{ margin: 0 }}>Likely area of law</p>
          <h3>
            {result.category}{" "}
            <span className="badge">{Math.round((result.confidence || 0) * 100)}% confidence</span>
          </h3>
          <p style={{ margin: 0 }}>{result.reason}</p>
        </div>
      )}

      <h3 style={{ margin: "18px 0 10px" }}>{result ? "Matching lawyers" : "All lawyers"}</h3>
      {lawyers.length === 0 ? (
        <div className="card">
          No lawyers found{result ? ` for ${result.category}${city ? ` in ${city}` : ""}` : ""}. Try clearing the city field.
        </div>
      ) : (
        lawyers.map((l) => <LawyerCard key={l._id} lawyer={l} />)
      )}
    </div>
  );
}