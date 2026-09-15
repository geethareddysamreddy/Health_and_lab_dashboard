import EmptyState from "../EmptyState/EmptyState";
import { formatDate, parseLocalDate } from "../../utils/date";
import "./IntakeTable.css";

export default function IntakeTable({ intakes, onView, onResume }) {
  if (!intakes || intakes.length === 0) {
    return <EmptyState title="No intakes yet" message="Click 'Start New Intake' to create the first patient record." icon="🩺" />;
  }

  const sorted = [...intakes].sort((a, b) => {
    const dateA = parseLocalDate(a.submittedDate || a.createdDate) ?? new Date(0);
    const dateB = parseLocalDate(b.submittedDate || b.createdDate) ?? new Date(0);
    return dateB - dateA;
  });

  return (
    <div className="intake-table-wrapper">
      <table className="intake-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Status</th>
            <th>Date</th>
            <th>BMI</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((intake) => {
            const isCompleted = intake.status === "Completed";
            return (
              <tr key={intake.id}>
                <td data-label="Patient">{intake.answers?.fullName || "Unnamed Patient"}</td>
                <td data-label="Gender">{intake.answers?.gender || "-"}</td>
                <td data-label="Age">{intake.answers?.age ?? "-"}</td>
                <td data-label="Status">
                  <span className={`status-badge ${isCompleted ? "status-completed" : "status-in-progress"}`}>
                    {intake.status}
                  </span>
                </td>
                <td data-label="Date">{formatDate(intake.submittedDate || intake.createdDate)}</td>
                <td data-label="BMI">{intake.bmi ? intake.bmi.toFixed(1) : "-"}</td>
                <td data-label="Action">
                  {isCompleted ? (
                    <button type="button" className="table-action-link" onClick={() => onView(intake)}>
                      View
                    </button>
                  ) : (
                    <button type="button" className="table-action-link" onClick={() => onResume(intake)}>
                      Resume
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
