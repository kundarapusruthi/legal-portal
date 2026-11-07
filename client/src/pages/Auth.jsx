import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext";

export default function Auth({ mode }) {
  const isSignup = mode === "signup";
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { saveLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setError("");
    setBusy(true);
    try {
      const data = await api(isSignup ? "/auth/signup" : "/auth/login", { method: "POST", body: form });
      saveLogin(data);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="container narrow">
      <div className="card">
        <h2>{isSignup ? "Create your free account" : "Welcome back"}</h2>
        <p className="muted">
          {isSignup ? "Book lawyers, track cases and analyse documents." : "Log in to continue where you left off."}
        </p>
        {isSignup && (
          <>
            <label>Full name</label>
            <input value={form.name} onChange={set("name")} />
            <label>City</label>
            <input value={form.city} onChange={set("city")} placeholder="e.g. Hyderabad" />
          </>
        )}
        <label>Email</label>
        <input type="email" value={form.email} onChange={set("email")} />
        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={set("password")}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {error && <p className="error">{error}</p>}
        <button className="btn" style={{ width: "100%", marginTop: 12 }} onClick={submit} disabled={busy}>
          {busy ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
        </button>
        <p className="muted" style={{ marginTop: 14, textAlign: "center" }}>
          {isSignup ? (
            <>Already registered? <Link to="/login">Log in</Link></>
          ) : (
            <>New here? <Link to="/signup">Create an account</Link></>
          )}
        </p>
      </div>
    </div>
  );
}