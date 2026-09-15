import { useMemo, useState } from "react";
import { QUESTIONS } from "../../data/questions";
import { getVisibleQuestions, validateAnswer } from "../../utils/questionnaireEngine";
import { calculateBMI } from "../../utils/bmi";
import QuestionRenderer from "../QuestionRenderer/QuestionRenderer";
import ProgressBar from "../ProgressBar/ProgressBar";
import IntakeDetails from "../IntakeDetails/IntakeDetails";
import "./Questionnaire.css";

export default function Questionnaire({ intake, onSaveDraft, onSubmit }) {
  const [answers, setAnswers] = useState(intake.answers ?? {});
  const [error, setError] = useState(null);

  const visibleQuestions = useMemo(() => getVisibleQuestions(QUESTIONS, answers), [answers]);

  const initialIndex = useMemo(() => {
    const idx = visibleQuestions.findIndex((q) => q.id === intake.currentQuestionId);
    return idx >= 0 ? idx : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentQuestion = visibleQuestions[currentIndex] ?? visibleQuestions[0];
  const totalSteps = visibleQuestions.length;
  const stepNumber = currentIndex + 1;
  const isConfirmationStep = currentQuestion.type === "confirmation";
  const progressPercent = (stepNumber / totalSteps) * 100;

  function handleChange(value) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    if (error) setError(null);
  }

  function handleContinue() {
    const validationError = validateAnswer(currentQuestion, answers[currentQuestion.id]);
    if (validationError) {
      setError(validationError);
      return;
    }

    const nextVisible = getVisibleQuestions(QUESTIONS, answers);
    const nextIndex = currentIndex + 1;
    const nextQuestion = nextVisible[nextIndex];

    if (!nextQuestion) return;

    setCurrentIndex(nextIndex);
    onSaveDraft(answers, nextQuestion.id);
  }

  function handleBack() {
    if (currentIndex === 0) return;
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    onSaveDraft(answers, visibleQuestions[prevIndex].id);
  }

  function handleSubmit() {
    onSubmit(answers);
  }

  const previewBMI = calculateBMI(answers.weight, answers.height);

  return (
    <div className="questionnaire">
      <div className="questionnaire-meta">
        <span className="questionnaire-title">Health Intake</span>
        <span className="questionnaire-step">
          {isConfirmationStep ? "Final Review" : `Question ${stepNumber} of ${totalSteps}`}
        </span>
      </div>

      <ProgressBar percent={progressPercent} />

      <div className="questionnaire-body">
        {isConfirmationStep ? (
          <div className="questionnaire-confirmation">
            <h3 className="questionnaire-confirmation-title">Review your information</h3>
            <IntakeDetails
              intake={{
                answers,
                bmi: previewBMI,
                status: "In Progress",
                submittedDate: null,
                createdDate: intake.createdDate,
              }}
            />
          </div>
        ) : (
          <QuestionRenderer
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            error={error}
            onChange={handleChange}
          />
        )}
      </div>

      <div className="questionnaire-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleBack}
          disabled={currentIndex === 0}
        >
          Back
        </button>
        {isConfirmationStep ? (
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Submit Intake
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={handleContinue}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
