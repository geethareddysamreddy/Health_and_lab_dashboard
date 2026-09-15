import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "./ChartCard";

const CATEGORY_COLORS = {
  Normal: "#0ca30c",
  Elevated: "#fab219",
  High: "#d03b3b",
};

export default function BloodSugarBarChart({ distribution }) {
  const data = Object.entries(distribution).map(([category, count]) => ({ category, count }));

  return (
    <ChartCard title="Blood Sugar Distribution">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1e0d9" vertical={false} />
          <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#52514e" }} axisLine={{ stroke: "#c3c2b7" }} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#52514e" }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(11,11,11,0.04)" }}
            contentStyle={{ borderRadius: 10, border: "1px solid #e1e0d9", fontSize: 13 }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={64}>
            {data.map((entry) => (
              <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] ?? "#2a78d6"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
