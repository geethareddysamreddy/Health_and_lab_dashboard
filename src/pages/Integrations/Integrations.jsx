import { useState } from "react";
import Loading from "../../components/Loading/Loading";
import EmptyState from "../../components/EmptyState/EmptyState";
import "./Integrations.css";

const API_BASE = "https://restcountries.com/v3.1/name";
const FIELDS = "name,capital,region,subregion,population,flags,languages,currencies";

function formatNumber(num) {
  if (typeof num !== "number") return "-";
  return num.toLocaleString("en-US");
}

export default function Integrations() {
  const [query, setQuery] = useState("India");
  const [status, setStatus] = useState("idle");
  const [countries, setCountries] = useState([]);

  async function handleSearch(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setStatus("loading");
    setCountries([]);

    try {
      const response = await fetch(`${API_BASE}/${encodeURIComponent(trimmed)}?fields=${FIELDS}`);

      if (response.status === 404) {
        setStatus("not-found");
        return;
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        setStatus("not-found");
        return;
      }

      setCountries(data.slice(0, 6));
      setStatus("success");
    } catch (error) {
      console.error("Country lookup failed:", error);
      setStatus("error");
    }
  }

  return (
    <div className="integrations-page">
      <div className="card integrations-intro">
        <h2 className="section-title">REST Countries Lookup</h2>
        <p className="integrations-description">
          Search for a country to demonstrate a live integration with the free, public{" "}
          <strong>REST Countries API</strong> (no API key required).
        </p>

        <form className="integrations-search" onSubmit={handleSearch}>
          <input
            type="text"
            className="question-input"
            placeholder="e.g. India"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Country name"
          />
          <button type="submit" className="btn btn-primary" disabled={status === "loading"}>
            Search
          </button>
        </form>
      </div>

      <div className="integrations-results">
        {status === "loading" && <Loading message="Loading country information..." />}

        {status === "error" && (
          <EmptyState
            icon="⚠️"
            title="Unable to fetch country information"
            message="Please check your connection and try again."
          />
        )}

        {status === "not-found" && (
          <EmptyState icon="🌍" title="Country not found" message={`No matches for "${query}". Try a different name.`} />
        )}

        {status === "idle" && (
          <EmptyState icon="🔍" title="Search for a country" message="Try searching for a country name above, e.g. India." />
        )}

        {status === "success" && (
          <div className="country-grid">
            {countries.map((country) => (
              <div className="country-card card" key={country.name.common}>
                <img
                  className="country-flag"
                  src={country.flags?.svg || country.flags?.png}
                  alt={country.flags?.alt || `Flag of ${country.name.common}`}
                />
                <div className="country-info">
                  <h3>{country.name.common}</h3>
                  <dl>
                    <dt>Capital</dt>
                    <dd>{country.capital?.join(", ") || "-"}</dd>
                    <dt>Region</dt>
                    <dd>
                      {country.region}
                      {country.subregion ? ` · ${country.subregion}` : ""}
                    </dd>
                    <dt>Population</dt>
                    <dd>{formatNumber(country.population)}</dd>
                    <dt>Languages</dt>
                    <dd>{country.languages ? Object.values(country.languages).join(", ") : "-"}</dd>
                    <dt>Currencies</dt>
                    <dd>
                      {country.currencies
                        ? Object.values(country.currencies)
                            .map((c) => `${c.name} (${c.symbol ?? ""})`)
                            .join(", ")
                        : "-"}
                    </dd>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
