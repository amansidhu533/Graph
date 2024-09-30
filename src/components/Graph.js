import React, { useState } from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { saveAs } from 'file-saver'; // For saving the graph as an image

function GraphComponent({ data }) {
  const [chartType, setChartType] = useState('Bar'); // To switch between different chart types
  
  // Filtering out any entries where the product name is missing
  const validData = data.filter(item => item.Product && item['Unit Price']);

  // Formatting data for recharts
  const formattedData = validData.map(item => ({
    product: item.Product,
    unitPrice: parseFloat(item['Unit Price']) // Ensure it's a number
  }));

  // Function to handle saving the chart as an image
  const handleSave = () => {
    const svgElement = document.querySelector('.recharts-wrapper svg'); // Get the SVG of the chart
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, 'chart.svg');
  };

  // Function to switch between chart types
  const renderChart = () => {
    if (chartType === 'Bar') {
      return (
        <BarChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product" label={{ value: "Product", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "Unit Price", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="unitPrice" fill="#82ca9d" />
        </BarChart>
      );
    } else if (chartType === 'Line') {
      return (
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product" label={{ value: "Product", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "Unit Price", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="unitPrice" stroke="#8884d8" />
        </LineChart>
      );
    }
  };

  return (
    <div className="graph-container">
      <div className="chart-controls">
        <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="chart-dropdown">
          <option value="Bar">Bar Chart</option>
          <option value="Line">Line Chart</option>
        </select>
        <button onClick={handleSave} className="save-button">Save Chart</button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

export default GraphComponent;
