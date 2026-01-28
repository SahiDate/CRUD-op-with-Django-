import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Charts({ studentsPerUser }) {
  const data = studentsPerUser.map((item) => ({
    name: item.owner__username,
    count: item.count
  }));

  return (
    <div style={{ display: "flex", gap: "30px", marginTop: "30px" }}>
      {/* 📊 Bar Chart */}
      <div style={{ width: "50%", height: 300 }}>
        <h3>Students per User</h3>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 Pie Chart */}
      <div style={{ width: "50%", height: 300 }}>
        <h3>User Contribution</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
