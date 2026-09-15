// BMI = weight (kg) / height (m)^2

export function calculateBMI(weightKg, heightCm) {
  const weight = Number(weightKg);
  const height = Number(heightCm);

  if (!weight || !height || weight <= 0 || height <= 0) {
    return null;
  }

  const heightMeters = height / 100;
  const bmi = weight / (heightMeters * heightMeters);
  return Math.round(bmi * 10) / 10;
}

export function getBMICategory(bmi) {
  if (bmi === null || bmi === undefined || Number.isNaN(bmi)) return null;

  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function getIntakeBMI(answers = {}) {
  return calculateBMI(answers.weight, answers.height);
}
