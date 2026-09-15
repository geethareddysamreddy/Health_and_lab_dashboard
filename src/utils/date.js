// Parses a "YYYY-MM-DD" string as a local date (avoids UTC-parsing off-by-one
// day shifts that `new Date("YYYY-MM-DD")` can produce near timezone edges).
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function formatDate(dateStr, options = { month: "short", day: "numeric", year: "numeric" }) {
  const date = parseLocalDate(dateStr);
  if (!date || Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", options);
}
