import "./Charts.css";

export default function ChartCard({ title, children }) {
  return (
    <div className="chart-card card">
      <h3 className="chart-card-title">{title}</h3>
      <div className="chart-card-body">{children}</div>
    </div>
  );
}
