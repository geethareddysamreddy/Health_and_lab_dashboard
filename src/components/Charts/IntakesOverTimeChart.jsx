import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "./ChartCard";
import { formatDate } from "../../utils/date";

export default function IntakesOverTimeChart({ data }) {
  const chartData = data.map((entry) => ({
    ...entry,
    label: formatDate(entry.date, { month: "short", day: "numeric" }),
  }));

  return (
    <ChartCard title="Intakes Over Time">
      {chartData.length === 0 ? (
        <div className="chart-empty">No intake history yet</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e1e0d9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#52514e" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#52514e" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e1e0d9", fontSize: 13 }} />
            <Line
              type="monotone"
              dataKey="count"
              name="Intakes"
              stroke="#2a78d6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#2a78d6" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
