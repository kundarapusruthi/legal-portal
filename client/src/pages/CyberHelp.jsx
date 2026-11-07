import PageHeader from "../components/PageHeader";

const STEPS = [
  {
    title: "Act fast if money was lost",
    text: "Call the national cybercrime helpline 1930 as soon as possible. Quick reporting improves the chance of freezing the transferred money.",
  },
  {
    title: "Inform your bank or wallet provider",
    text: "Call your bank's customer care, report the fraudulent transaction, and ask them to block your card, UPI or net banking if needed.",
  },
  {
    title: "Collect and save evidence",
    text: "Take screenshots of chats, emails, profiles, links and transaction messages. Note the date, time, amount, reference numbers and the offender's phone number or account details. Don't delete anything.",
  },
  {
    title: "File an online complaint",
    text: "Register your complaint on the National Cyber Crime Reporting Portal (cybercrime.gov.in). Keep the acknowledgement number it gives you.",
  },
  {
    title: "Contact your local police if needed",
    text: "If the portal or police ask for it, visit your nearest police station or cyber crime police station with your evidence and ask for an FIR.",
  },
  {
    title: "Secure your accounts",
    text: "Change passwords, enable two-factor authentication, and log out of unknown devices. Never share OTPs, PINs or passwords with anyone.",
  },
];

export default function CyberHelp() {
  return (
    <div className="container">
      <PageHeader
        icon="🛡️"
        title="Cybercrime complaint guide"
        subtitle="Follow these steps if you are a victim of online fraud or harassment."
      />

      <div className="alert">
        <b>Lost money in an online fraud?</b> Call <b>1930</b> right away, then follow the steps below.
        In an emergency or if someone is in danger, call <b>112</b>.
      </div>

      {STEPS.map((s, i) => (
        <div className="card step" key={s.title}>
          <div className="num">{i + 1}</div>
          <div>
            <h3>{s.title}</h3>
            <p style={{ margin: 0 }}>{s.text}</p>
          </div>
        </div>
      ))}

      <a className="btn" href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">
        Open cybercrime.gov.in ↗
      </a>
    </div>
  );
}