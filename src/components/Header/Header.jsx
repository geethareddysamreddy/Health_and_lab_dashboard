import { useLocation } from "react-router-dom";
import "./Header.css";

const PAGE_TITLES = {
  "/": { title: "Dashboard", subtitle: "Overview of patient intake activity" },
  "/intakes": { title: "Intakes", subtitle: "Manage patient health & lab intakes" },
  "/integrations": { title: "Integrations", subtitle: "Connected public data sources" },
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] ?? { title: "HealthIntake", subtitle: "" };

  return (
    <header className="app-header">
      <button type="button" className="header-menu-btn" onClick={onMenuClick} aria-label="Toggle navigation">
        <span />
        <span />
        <span />
      </button>
      <div className="header-titles">
        <h1>{page.title}</h1>
        {page.subtitle && <p>{page.subtitle}</p>}
      </div>
      <div className="header-user">
        <div className="header-avatar" aria-hidden="true">
          A
        </div>
        <span className="header-user-name">Admin</span>
      </div>
    </header>
  );
}
