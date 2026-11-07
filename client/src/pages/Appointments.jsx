import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import PageHeader from "../components/PageHeader";

export default function Appointments() {
  const [list, setList] = useState(null);
  const [error, setError] = useState("");

  const load = () => api("/appointments/mine").then(setList).catch((e) => setError(e.message));

  useEffect(() => { load(); }, []);

  async function cancel(id) {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await api(`/appointments/${id}/cancel`, { method: "PATCH" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <PageHeader icon="🗓️" title="My appointments" subtitle="View, track and cancel your consultations." />
      {error && <p className="error">{error}</p>}
      {list === null && !error && <p>Loading...</p>}
      {list?.length === 0 && (
        <div className="card">
          You have no appointments yet. <Link to="/find-lawyer">Find a lawyer</Link> to book one.
        </div>
      )}
      {list?.map((a) => (
        <div className="card row between" key={a._id}>
          <div>
            <h3>{a.lawyer?.name || "Lawyer"}</h3>
            <p style={{ margin: 0 }}>🗓️ {a.date} at {a.timeSlot}</p>
            {a.problem && <p className="muted" style={{ margin: "4px 0 0" }}>{a.problem}</p>}
          </div>
          <div style={{ textAlign: "right" }}>
            <span className={`badge ${a.status}`}>{a.status}</span>
            {a.status !== "cancelled" && (
              <div style={{ marginTop: 8 }}>
                <button className="btn sm danger" onClick={() => cancel(a._id)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}