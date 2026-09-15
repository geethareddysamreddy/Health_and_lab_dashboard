import { useState } from "react";
import { useIntakes } from "../../context/IntakesContext";
import IntakeTable from "../../components/IntakeTable/IntakeTable";
import IntakeModal from "../../components/IntakeModal/IntakeModal";
import Modal from "../../components/Modal/Modal";
import IntakeDetails from "../../components/IntakeDetails/IntakeDetails";
import "./Intakes.css";

export default function Intakes() {
  const { intakes, createDraftIntake, saveDraft, submitIntake } = useIntakes();
  const [questionnaireIntake, setQuestionnaireIntake] = useState(null);
  const [viewIntake, setViewIntake] = useState(null);

  function handleStartNew() {
    setQuestionnaireIntake(createDraftIntake());
  }

  function handleResume(intake) {
    setQuestionnaireIntake(intake);
  }

  function handleSaveDraft(answers, currentQuestionId) {
    const updated = saveDraft(questionnaireIntake, answers, currentQuestionId);
    setQuestionnaireIntake(updated);
  }

  function handleSubmit(answers) {
    submitIntake(questionnaireIntake, answers);
    setQuestionnaireIntake(null);
  }

  return (
    <div className="intakes-page">
      <div className="intakes-page-header">
        <div>
          <h2 className="intakes-page-title">Patient Intakes</h2>
          <p className="intakes-page-subtitle">{intakes.length} total records</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleStartNew}>
          + Start New Intake
        </button>
      </div>

      <div className="card intakes-table-card">
        <IntakeTable intakes={intakes} onView={setViewIntake} onResume={handleResume} />
      </div>

      <IntakeModal
        isOpen={!!questionnaireIntake}
        intake={questionnaireIntake}
        onClose={() => setQuestionnaireIntake(null)}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
      />

      <Modal
        isOpen={!!viewIntake}
        onClose={() => setViewIntake(null)}
        title={viewIntake ? `Intake · ${viewIntake.answers?.fullName || "Unnamed Patient"}` : "Intake Details"}
        size="lg"
      >
        {viewIntake && <IntakeDetails intake={viewIntake} />}
      </Modal>
    </div>
  );
}
