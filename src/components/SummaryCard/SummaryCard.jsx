import "./SummaryCard.css";

export default function SummaryCard({ label, value, icon, accent = "blue" }) {
  return (
    <div className={`summary-card accent-${accent}`}>
      <div className="summary-card-icon">{icon}</div>
      <div className="summary-card-text">
        <span className="summary-card-value">{value}</span>
        <span className="summary-card-label">{label}</span>
      </div>
    </div>
  );
}
