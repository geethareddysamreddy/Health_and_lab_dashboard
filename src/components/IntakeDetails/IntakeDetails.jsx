import { getBMICategory } from "../../utils/bmi";
import "./IntakeDetails.css";

function Row({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="intake-details-row">
      <span className="intake-details-label">{label}</span>
      <span className="intake-details-value">{value}</span>
    </div>
  );
}

export default function IntakeDetails({ intake }) {
  const { answers = {}, bmi, status, submittedDate, createdDate } = intake;
  const category = bmi ? getBMICategory(bmi) : null;
  const hasBP = answers.systolic && answers.diastolic;

  return (
    <div className="intake-details">
      <div className="intake-details-group">
        <Row label="Patient" value={answers.fullName} />
        <Row label="Gender" value={answers.gender} />
        <Row label="Age" value={answers.age ? `${answers.age} years` : null} />
      </div>

      <div className="intake-details-group">
        <Row label="Height" value={answers.height ? `${answers.height} cm` : null} />
        <Row label="Weight" value={answers.weight ? `${answers.weight} kg` : null} />
        <Row label="BMI" value={bmi ? bmi.toFixed(1) : null} />
        <Row label="BMI Category" value={category} />
      </div>

      <div className="intake-details-group">
        <Row label="Systolic BP" value={answers.systolic ? `${answers.systolic} mmHg` : null} />
        <Row label="Diastolic BP" value={answers.diastolic ? `${answers.diastolic} mmHg` : null} />
        <Row label="Blood Pressure" value={hasBP ? `${answers.systolic} / ${answers.diastolic} mmHg` : null} />
        <Row label="Blood Sugar" value={answers.bloodSugar ? `${answers.bloodSugar} mg/dL` : null} />
      </div>

      <div className="intake-details-group">
        <Row label="Diabetes" value={answers.diabetes} />
        <Row label="Medication" value={answers.medication} />
        {answers.medication === "Yes" && <Row label="Medication Details" value={answers.medicationDetails} />}
      </div>

      <div className="intake-details-group">
        <Row label="Status" value={status} />
        <Row label="Submission Date" value={submittedDate} />
        {!submittedDate && <Row label="Started On" value={createdDate} />}
      </div>
    </div>
  );
}
