import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadIntakes, saveIntakes } from "../utils/storage";
import { MOCK_INTAKES } from "../data/mockIntakes";
import { calculateBMI, getBMICategory } from "../utils/bmi";
import { generateId } from "../utils/id";

const IntakesContext = createContext(null);

export function IntakesProvider({ children }) {
  const [intakes, setIntakes] = useState(() => {
    const stored = loadIntakes();
    return stored && stored.length > 0 ? stored : MOCK_INTAKES;
  });

  useEffect(() => {
    saveIntakes(intakes);
  }, [intakes]);

  function createDraftIntake() {
    const draft = {
      id: generateId(),
      status: "In Progress",
      createdDate: new Date().toISOString().slice(0, 10),
      submittedDate: null,
      currentQuestionId: null,
      answers: {},
      bmi: null,
      bmiCategory: null,
    };
    return draft;
  }

  function upsertIntake(intake) {
    setIntakes((prev) => {
      const exists = prev.some((i) => i.id === intake.id);
      if (exists) {
        return prev.map((i) => (i.id === intake.id ? intake : i));
      }
      return [intake, ...prev];
    });
  }

  function saveDraft(intake, answers, currentQuestionId) {
    const bmi = calculateBMI(answers.weight, answers.height);
    const updated = {
      ...intake,
      answers,
      currentQuestionId,
      bmi,
      bmiCategory: getBMICategory(bmi),
      status: "In Progress",
    };
    upsertIntake(updated);
    return updated;
  }

  function submitIntake(intake, answers) {
    const bmi = calculateBMI(answers.weight, answers.height);
    const completed = {
      ...intake,
      answers,
      status: "Completed",
      submittedDate: new Date().toISOString().slice(0, 10),
      bmi,
      bmiCategory: getBMICategory(bmi),
    };
    upsertIntake(completed);
    return completed;
  }

  function getIntakeById(id) {
    return intakes.find((i) => i.id === id) ?? null;
  }

  const value = useMemo(
    () => ({
      intakes,
      createDraftIntake,
      saveDraft,
      submitIntake,
      getIntakeById,
    }),
    [intakes]
  );

  return <IntakesContext.Provider value={value}>{children}</IntakesContext.Provider>;
}

export function useIntakes() {
  const context = useContext(IntakesContext);
  if (!context) {
    throw new Error("useIntakes must be used within an IntakesProvider");
  }
  return context;
}
