import Modal from "../Modal/Modal";
import Questionnaire from "../Questionnaire/Questionnaire";

export default function IntakeModal({ isOpen, intake, onClose, onSaveDraft, onSubmit }) {
  if (!intake) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Health Intake" size="md">
      <Questionnaire
        key={intake.id}
        intake={intake}
        onSaveDraft={onSaveDraft}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
