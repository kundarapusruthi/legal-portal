import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Link, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import FindLawyer from "./pages/FindLawyer";
import Book from "./pages/Book";
import Appointments from "./pages/Appointments";
import Documents from "./pages/Documents";
import Generate from "./pages/Generate";
import Analyze from "./pages/Analyze";
import Rights from "./pages/Rights";
import Risk from "./pages/Risk";
import Court from "./pages/Court";
import CyberHelp from "./pages/CyberHelp";

const TOOLS = [
  { to: "/documents", icon: "📄", label: "Document guidance" },
  { to: "/generate", icon: "📝", label: "Document generator" },
  { to: "/analyze", icon: "🔍", label: "AI document analysis" },
  { to: "/risk", icon: "⚠️", label: "Legal risk check" },
  { to: "/rights", icon: "📜", label: "Know your rights" },
  { to: "/court", icon: "🏛️", label: "Court case tracker" },
  { to: "/cyber-help", icon: "🛡️", label: "Cybercrime help" },
];

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ToolsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { pathname } = useLocation();
  const active = TOOLS.some((t) => t.to === pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button className={`dd-btn ${active ? "active" : ""}`} onClick={() => setOpen(!open)}>
        Legal tools ▾
      </button>
      {open && (
        <div className="dd-panel">
          {TOOLS.map((t) => (
            <NavLink key={t.to} to={t.to} className={({ isActive }) => (isActive ? "active" : "")}>
              <span>{t.icon}</span> {t.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function Nav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const cls = ({ isActive }) => "link" + (isActive ? " active" : "");

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="logo">⚖️</span> Legal Portal
        </Link>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
        <div className={`menu ${open ? "open" : ""}`}>
          <NavLink to="/chat" className={cls}>Ask AI</NavLink>
          <NavLink to="/find-lawyer" className={cls}>Find a lawyer</NavLink>
          <ToolsMenu />
          {user && <NavLink to="/appointments" className={cls}>My appointments</NavLink>}
          <span className="spacer" />
          {user ? (
            <>
              <span className="hello">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn sm outline" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={cls}>Login</NavLink>
              <Link to="/signup" className="btn sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h4>⚖️ Legal Portal</h4>
          <p>Making legal information simple, affordable and accessible, especially for people who cannot easily reach a lawyer.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/chat">Ask the AI chatbot</Link>
          <Link to="/find-lawyer">Find a lawyer</Link>
          <Link to="/rights">Know your rights</Link>
          <Link to="/generate">Document generator</Link>
        </div>
        <div>
          <h4>Get help now</h4>
          <a href="tel:112">Emergency: 112</a>
          <a href="tel:1930">Cyber fraud: 1930</a>
          <a href="tel:15100">Free legal aid: 15100</a>
          <a href="tel:181">Women helpline: 181</a>
        </div>
        <div className="legal">
          This portal provides general legal information and is not a substitute for advice from a qualified lawyer. Laws change and differ by state, so please verify important details before acting.
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/find-lawyer" element={<FindLawyer />} />
          <Route path="/book/:lawyerId" element={<RequireAuth><Book /></RequireAuth>} />
          <Route path="/appointments" element={<RequireAuth><Appointments /></RequireAuth>} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/risk" element={<Risk />} />
          <Route path="/rights" element={<Rights />} />
          <Route path="/court" element={<Court />} />
          <Route path="/cyber-help" element={<CyberHelp />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}