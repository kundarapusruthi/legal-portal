import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "../api";

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const SUGGESTIONS = [
  "How do I file an FIR?",
  "What are my rights if I am arrested?",
  "How do I file a consumer complaint?",
  "What should I do if my landlord won't return my deposit?",
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en-IN");
  const [listening, setListening] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const data = await api("/chat", { method: "POST", body: { question } });
      setMessages((m) => [...m, { role: "bot", text: data.answer }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "bot", text: "Sorry, something went wrong: " + err.message }]);
    }
    setLoading(false);
  }

  function startVoice() {
    if (!SR) return alert("Voice input is not supported in this browser. Please use Google Chrome.");
    const rec = new SR();
    rec.lang = lang;
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  }

  return (
    <div className="container">
      <h2>💬 Legal FAQ Chatbot</h2>
      <p className="muted">Ask in English, Hindi or Telugu. Answers are general information, not legal advice.</p>

      <div className="card chatbox">
        {messages.length === 0 && (
          <>
            <p>Hello! Ask me anything about legal procedures. Try one of these:</p>
            <div className="chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="avatar">{m.role === "user" ? "🙂" : "⚖️"}</div>
            <div className="bubble">
              {m.role === "bot" ? <ReactMarkdown>{m.text}</ReactMarkdown> : m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg bot"><div className="avatar">⚖️</div><div className="bubble">Thinking...</div></div>
        )}
        <div ref={endRef} />
      </div>

      <div className="row">
        <input
          style={{ flex: 1, margin: 0, minWidth: 180 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type or speak your question..."
        />
        <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ width: 110, margin: 0 }}>
          <option value="en-IN">English</option>
          <option value="hi-IN">हिन्दी</option>
          <option value="te-IN">తెలుగు</option>
        </select>
        <button className={`btn mic ${listening ? "on" : ""}`} onClick={startVoice} title="Speak">
          {listening ? "● Listening" : "🎤"}
        </button>
        <button className="btn" onClick={() => send()} disabled={loading}>Send</button>
      </div>
    </div>
  );
}