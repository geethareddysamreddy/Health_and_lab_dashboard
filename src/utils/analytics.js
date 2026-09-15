import { getIntakeBMI } from "./bmi";
import { parseLocalDate } from "./date";

const BLOOD_SUGAR_CATEGORIES = ["Normal", "Elevated", "High"];

function categorizeBloodSugar(value) {
  const level = Number(value);
  if (Number.isNaN(level)) return null;
  if (level < 100) return "Normal";
  if (level < 126) return "Elevated";
  return "High";
}

export function calculateAnalytics(intakes = []) {
  const total = intakes.length;
  const completed = intakes.filter((i) => i.status === "Completed").length;
  const inProgress = intakes.filter((i) => i.status === "In Progress").length;

  const bmiValues = intakes
    .map((intake) => intake.bmi ?? getIntakeBMI(intake.answers))
    .filter((bmi) => typeof bmi === "number");

  const averageBMI =
    bmiValues.length > 0
      ? Math.round((bmiValues.reduce((sum, v) => sum + v, 0) / bmiValues.length) * 10) / 10
      : 0;

  const genderDistribution = { Male: 0, Female: 0 };
  intakes.forEach((intake) => {
    const gender = intake.answers?.gender;
    if (gender && genderDistribution[gender] !== undefined) {
      genderDistribution[gender] += 1;
    }
  });

  const bloodSugarDistribution = { Normal: 0, Elevated: 0, High: 0 };
  intakes.forEach((intake) => {
    const category = categorizeBloodSugar(intake.answers?.bloodSugar);
    if (category) {
      bloodSugarDistribution[category] += 1;
    }
  });

  const dateCounts = {};
  intakes.forEach((intake) => {
    const date = intake.submittedDate || intake.createdDate;
    if (!date) return;
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });

  const intakesOverTime = Object.entries(dateCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));

  return {
    total,
    completed,
    inProgress,
    averageBMI,
    genderDistribution,
    bloodSugarDistribution,
    intakesOverTime,
  };
}

export { BLOOD_SUGAR_CATEGORIES };
