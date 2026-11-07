export default function PageHeader({ icon, title, subtitle }) {
  return (
    <div className="page-head">
      <div className="page-icon">{icon}</div>
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}