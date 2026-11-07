import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import PageHeader from "../components/PageHeader";

const localToday = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export default function Book() {
  const { lawyerId } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState("");
  const [problem, setProblem] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api(`/lawyers/${lawyerId}`).then(setLawyer).catch((e) => setError(e.message));
  }, [lawyerId]);

  function loadSlots(d) {
    return api(`/appointments/slots?lawyerId=${lawyerId}&date=${d}`)
      .then((r) => setSlots(r.available))
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    if (!date) return;
    setSlot("");
    setError("");
    loadSlots(date);
  }, [date, lawyerId]);

  async function book() {
    setError("");
    setBusy(true);
    try {
      await api("/appointments", {
        method: "POST",
        body: { lawyerId, date, timeSlot: slot, problem },
      });
      setDone(true);
    } catch (err) {
      setError(err.message);
      loadSlots(date);
      setSlot("");
    }
    setBusy(false);
  }

  if (done)
    return (
      <div className="container narrow">
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>✅</div>
          <h2>Appointment requested</h2>
          <p>{lawyer?.name} · {date} at {slot}</p>
          <p className="muted">Status: pending confirmation.</p>
          <Link to="/appointments" className="btn">View my appointments</Link>
        </div>
      </div>
    );

  return (
    <div className="container narrow">
      <PageHeader
        icon="📅"
        title="Book a consultation"
        subtitle="Pick a date and a free time slot. The lawyer will confirm your request."
      />

      {lawyer && (
        <div className="card lawyer">
          <div className="avatar">{lawyer.name.replace("Adv. ", "").charAt(0)}</div>
          <div className="info">
            <h3>{lawyer.name}</h3>
            {lawyer.specialization.map((s) => <span className="badge" key={s}>{s}</span>)}
            <p className="muted" style={{ margin: "4px 0 0" }}>📍 {lawyer.city} · ⭐ {lawyer.rating}</p>
          </div>
        </div>
      )}

      <div className="card">
        <label style={{ marginTop: 0 }}>Choose a date</label>
        <input type="date" min={localToday()} value={date} onChange={(e) => setDate(e.target.value)} />

        {date && (
          <>
            <label>Available time slots</label>
            {slots.length === 0 ? (
              <p className="muted">No free slots on this date. Try another day.</p>
            ) : (
              <div className="slots">
                {slots.map((s) => (
                  <button key={s} className={`slot ${slot === s ? "selected" : ""}`} onClick={() => setSlot(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <label>Briefly describe your problem (optional)</label>
        <textarea rows={3} value={problem} onChange={(e) => setProblem(e.target.value)} />

        {error && <p className="error">{error}</p>}
        <button className="btn" style={{ marginTop: 10 }} disabled={!date || !slot || busy} onClick={book}>
          {busy ? "Booking..." : "Confirm booking"}
        </button>
      </div>
    </div>
  );
}