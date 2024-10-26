import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const ResponseGraph = ({ chartData }) => {
  // Prepare data for the chart
  const data = chartData.data.map((item) => ({
    name: `${item.product} (${item.customer_segment})`,
    total_sales: item.total_sales,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_sales" fill="rgba(75, 192, 192, 0.6)">
          <LabelList position="top" fill="#000" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResponseGraph;
