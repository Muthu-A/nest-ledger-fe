import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

interface GoalProgressChartProps {
  data: {
    name: string;
    target: number;
    saved: number;
  }[];
}

export default function GoalProgressChart({ data }: any) {
  return (
    <div className="chart-card">
      <div className="card-header">
        <h3>Goal Progress Overview</h3>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis type="number" />

            <YAxis type="category" dataKey="name" />

            <Tooltip cursor={false}/>

            <Legend />

            <Bar
              dataKey="saved"
              stackId="goal"
              fill="#22c55e"
              radius={[0, 6, 6, 0]}
              name="Saved"
              barSize={30}
            />

            <Bar
              dataKey="remaining"
              stackId="goal"
              fill="#ebe9e5"
              radius={[0, 6, 6, 0]}
              name="Remaining"
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
