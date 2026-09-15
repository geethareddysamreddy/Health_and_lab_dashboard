import "./EmptyState.css";

export default function EmptyState({ title = "Nothing here yet", message, icon = "📋" }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-message">{message}</p>}
    </div>
  );
}
