// Configuration-driven questionnaire engine.
// Keeps conditional-visibility and validation logic out of the UI components.

export function shouldShowQuestion(question, answers) {
  if (!question.condition) return true;

  const { field, equals } = question.condition;
  return answers[field] === equals;
}

export function getVisibleQuestions(questions, answers) {
  return questions.filter((question) => shouldShowQuestion(question, answers));
}

export function validateAnswer(question, value) {
  if (question.type === "confirmation") return null;

  const isEmpty = value === undefined || value === null || value === "";

  if (question.required && isEmpty) {
    return "This field is required.";
  }

  if (isEmpty) return null;

  if (question.type === "number") {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return "Please enter a valid number.";
    }

    const min = question.min ?? 0;
    if (numericValue <= min) {
      return `Value must be greater than ${min}.`;
    }

    if (question.max !== undefined && numericValue > question.max) {
      return `Value must be ${question.max} or less.`;
    }
  }

  if (question.type === "select" && question.options) {
    if (!question.options.includes(value)) {
      return "Please select a valid option.";
    }
  }

  return null;
}
