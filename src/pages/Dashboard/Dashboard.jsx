import { useMemo } from "react";
import { useIntakes } from "../../context/IntakesContext";
import { calculateAnalytics } from "../../utils/analytics";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import BloodSugarBarChart from "../../components/Charts/BloodSugarBarChart";
import GenderPieChart from "../../components/Charts/GenderPieChart";
import IntakesOverTimeChart from "../../components/Charts/IntakesOverTimeChart";
import EmptyState from "../../components/EmptyState/EmptyState";
import "./Dashboard.css";

export default function Dashboard() {
  const { intakes } = useIntakes();
  const analytics = useMemo(() => calculateAnalytics(intakes), [intakes]);

  if (intakes.length === 0) {
    return <EmptyState title="No intake data available" message="Start a new intake to see dashboard analytics." icon="📊" />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-summary-grid">
        <SummaryCard label="Total Intakes" value={analytics.total} icon="🗂️" accent="blue" />
        <SummaryCard label="Completed" value={analytics.completed} icon="✅" accent="green" />
        <SummaryCard label="In Progress" value={analytics.inProgress} icon="⏳" accent="amber" />
        <SummaryCard label="Average BMI" value={analytics.averageBMI || "-"} icon="⚖️" accent="purple" />
      </div>

      <div className="dashboard-charts-grid">
        <BloodSugarBarChart distribution={analytics.bloodSugarDistribution} />
        <GenderPieChart distribution={analytics.genderDistribution} />
        <IntakesOverTimeChart data={analytics.intakesOverTime} />
      </div>
    </div>
  );
}
