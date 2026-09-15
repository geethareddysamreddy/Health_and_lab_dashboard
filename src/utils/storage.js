// Simple localStorage utility for persisting intake data.
// Guards against missing/corrupted data so the app never crashes on startup.

const INTAKES_KEY = "hli_intakes_v1";

export function loadIntakes() {
  try {
    const raw = localStorage.getItem(INTAKES_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    return parsed;
  } catch (error) {
    console.error("Failed to load intakes from localStorage:", error);
    return null;
  }
}

export function saveIntakes(intakes) {
  try {
    localStorage.setItem(INTAKES_KEY, JSON.stringify(intakes ?? []));
  } catch (error) {
    console.error("Failed to save intakes to localStorage:", error);
  }
}
