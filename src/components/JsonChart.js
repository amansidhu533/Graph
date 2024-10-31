import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function JsonChart({ chartData }) {
  if (!chartData) return <p>No data available for chart.</p>;

  // Transform the data to match the chart format
  const formattedData = chartData.labels.map((label, index) => ({
    label,
    value: chartData.datasets[0].data[index]
  }));

  return (
    <div className="json-graph-container">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#28a745" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default JsonChart;
