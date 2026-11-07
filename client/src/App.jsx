import { BrowserRouter, Routes, Route, NavLink, Link, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import FindLawyer from "./pages/FindLawyer";
import Book from "./pages/Book";
import Appointments from "./pages/Appointments";
import Documents from "./pages/Documents";
import CyberHelp from "./pages/CyberHelp";

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

function Nav() {
  const { user, logout } = useAuth();
  const cls = ({ isActive }) => "link" + (isActive ? " active" : "");
  return (
    <nav className="nav">
      <Link to="/" className="brand">⚖️ Legal Portal</Link>
      <NavLink to="/chat" className={cls}>Chatbot</NavLink>
      <NavLink to="/find-lawyer" className={cls}>Find a Lawyer</NavLink>
      <NavLink to="/documents" className={cls}>Documents</NavLink>
      <NavLink to="/cyber-help" className={cls}>Cybercrime Help</NavLink>
      {user && <NavLink to="/appointments" className={cls}>My Appointments</NavLink>}
      <span className="spacer" />
      {user ? (
        <>
          <span className="hello">Hi, {user.name}</span>
          <button className="btn sm outline" style={{ color: "#fff", borderColor: "#94a3b8" }} onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={cls}>Login</NavLink>
          <Link to="/signup" className="btn sm light">Sign up</Link>
        </>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/find-lawyer" element={<FindLawyer />} />
          <Route path="/book/:lawyerId" element={<RequireAuth><Book /></RequireAuth>} />
          <Route path="/appointments" element={<RequireAuth><Appointments /></RequireAuth>} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/cyber-help" element={<CyberHelp />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
        </Routes>
        <div className="footer">
          This portal gives general legal information, not legal advice. For your specific situation, consult a qualified lawyer.
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}