import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function GraphComponent({ data }) {
  // Filtering out any entries where the product name is missing
  const validData = data.filter(item => item.Product && item['Unit Price']);

  // Formatting data for recharts
  const formattedData = validData.map(item => ({
    product: item.Product,
    unitPrice: parseFloat(item['Unit Price']) // Ensure it's a number
  }));

  return (
    <ResponsiveContainer width="100%" >
      <BarChart
        data={formattedData}
        height={80}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="product" label={{ value: "Product", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: "Unit Price", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="unitPrice" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GraphComponent;
