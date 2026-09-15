import "./Loading.css";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="loading-state" role="status">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
