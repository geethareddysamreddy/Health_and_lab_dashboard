import "./QuestionRenderer.css";

export default function QuestionRenderer({ question, value, error, onChange }) {
  const inputId = `question-${question.id}`;

  return (
    <div className="question-renderer">
      <label className="question-label" htmlFor={inputId}>
        {question.question}
      </label>

      {question.type === "text" && (
        <input
          id={inputId}
          type="text"
          className={`question-input ${error ? "question-input-error" : ""}`}
          value={value ?? ""}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
      )}

      {question.type === "number" && (
        <div className="question-input-with-unit">
          <input
            id={inputId}
            type="number"
            className={`question-input ${error ? "question-input-error" : ""}`}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
          {question.unit && <span className="question-unit">{question.unit}</span>}
        </div>
      )}

      {question.type === "select" && (
        <div className="question-options" role="radiogroup" aria-label={question.question}>
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={value === option}
              className={`question-option ${value === option ? "question-option-selected" : ""}`}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
