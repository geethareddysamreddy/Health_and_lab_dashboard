import "./ProgressBar.css";

export default function ProgressBar({ percent }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${clamped}%` }} />
      </div>
      <span className="progress-bar-label">{clamped}%</span>
    </div>
  );
}
