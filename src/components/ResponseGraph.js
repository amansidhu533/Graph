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
  // Prepare data for the chart, handling both total_quantity_sold and total_sales
  const data = chartData?.data?.map((item) => {
    const key = item.total_quantity_sold !== undefined ? "total_quantity_sold" : "total_sales"; // Determine the correct key
    return {
      name: item.product,
      value: item[key], // Use the dynamically determined key
    };
  }) || []; // Fallback to an empty array if data is unavailable

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="rgba(75, 192, 192, 0.6)">
          <LabelList position="top" fill="#000" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResponseGraph;
