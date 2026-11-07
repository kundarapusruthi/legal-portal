import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const RIGHTS = [
  {
    icon: "🚔",
    title: "If you are arrested or detained",
    points: [
      "You must be told the grounds of your arrest.",
      "You have the right to consult and be defended by a lawyer of your choice.",
      "You must be produced before a Magistrate within 24 hours (excluding travel time).",
      "You can ask the police to inform a relative or friend about your arrest.",
      "You have the right to free legal aid if you cannot afford a lawyer.",
      "You cannot be forced to confess or to be a witness against yourself.",
    ],
  },
  {
    icon: "👩",
    title: "Women's rights",
    points: [
      "You can file a Zero FIR at any police station, regardless of where the crime happened.",
      "You are protected from physical, emotional, sexual and economic abuse at home under the Domestic Violence Act, 2005.",
      "Women are generally not to be called to the police station for questioning; the police should question you at your residence.",
      "Workplaces with 10 or more employees must have an Internal Committee to handle sexual harassment complaints (POSH Act, 2013).",
      "Free legal aid is available to women. Helplines: 181 (women), 112 (emergency).",
    ],
  },
  {
    icon: "🛒",
    title: "Consumer rights",
    points: [
      "Right to safety: protection from goods and services that are hazardous to life.",
      "Right to be informed about quality, quantity, price and standards.",
      "Right to choose from a variety of goods at competitive prices.",
      "Right to be heard and to seek redress, including refund, replacement or compensation.",
      "Right to consumer awareness and education.",
      "You can complain online through e-Daakhil or call the National Consumer Helpline at 1915.",
    ],
  },
  {
    icon: "👷",
    title: "Workers' rights",
    points: [
      "Right to receive wages on time and not less than the minimum wage.",
      "Right to a written appointment letter and salary slips.",
      "Provident fund and other statutory benefits apply to eligible employees.",
      "Right to a safe workplace and, for eligible women, maternity benefits.",
      "Unpaid wages or unfair dismissal can be taken to the Labour Department.",
    ],
  },
  {
    icon: "🏠",
    title: "Tenants' rights",
    points: [
      "Insist on a written rent agreement and keep all rent receipts.",
      "Your security deposit is refundable, subject to lawful deductions.",
      "A landlord cannot evict you by force or cut off water or electricity.",
      "Eviction must follow the notice terms and the legal process under your state's rent law.",
    ],
  },
  {
    icon: "📜",
    title: "Rights every citizen has",
    points: [
      "Right to information from public authorities under the RTI Act, 2005.",
      "Right to equality before the law and equal protection of the law.",
      "Right to life and personal liberty, which includes a fair legal process.",
      "Right to free legal aid for eligible persons.",
      "Right to education for children aged 6 to 14.",
    ],
  },
];

export default function Rights() {
  return (
    <div className="container">
      <PageHeader
        icon="📜"
        title="Know your legal rights"
        subtitle="Tap a topic to read the key rights in simple language. Details can vary by state and situation."
      />

      {RIGHTS.map((r, i) => (
        <details className="card" key={r.title} open={i === 0}>
          <summary>{r.icon} {r.title}</summary>
          <ul>
            {r.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </details>
      ))}

      <div className="card row between">
        <span>Have a specific question about your rights?</span>
        <Link to="/chat" className="btn sm">Ask the chatbot</Link>
      </div>
    </div>
  );
}