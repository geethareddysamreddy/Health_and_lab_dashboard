import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartCard from "./ChartCard";

const GENDER_COLORS = {
  Male: "#2a78d6",
  Female: "#eb6834",
};

export default function GenderPieChart({ distribution }) {
  const data = Object.entries(distribution)
    .map(([name, value]) => ({ name, value }))
    .filter((entry) => entry.value > 0);

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <ChartCard title="Gender Distribution">
      {total === 0 ? (
        <div className="chart-empty">No gender data yet</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={GENDER_COLORS[entry.name] ?? "#1baf7a"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e1e0d9", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {data.map((entry) => (
              <span className="chart-legend-item" key={entry.name}>
                <span
                  className="chart-legend-dot"
                  style={{ background: GENDER_COLORS[entry.name] ?? "#1baf7a" }}
                />
                {entry.name} ({entry.value})
              </span>
            ))}
          </div>
        </>
      )}
    </ChartCard>
  );
}
