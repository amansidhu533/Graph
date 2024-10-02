import React, { useState } from "react";
import {
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  RadarChart,
  Line,
  Bar,
  Area,
  Pie,
  Cell,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { saveAs } from "file-saver";
import { Save, BarChart as BarIcon, LineChart as LineIcon, PieChart as PieIcon, AreaChart as AreaIcon, Radar as RadarIcon } from "lucide-react";

function GraphComponent({ data = [] }) {
  const [chartType, setChartType] = useState("Bar");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Ensure data is valid by filtering out any undefined or invalid entries
  const validData = data.filter((item) => item?.Product && item?.["Unit Price"]);

  const formattedData = validData.map((item) => ({
    product: item.Product,
    unitPrice: parseFloat(item["Unit Price"]),
  }));

  const handleSave = () => {
    const svgElement = document.querySelector(".recharts-wrapper svg");
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    saveAs(blob, "chart.svg");
  };

  const renderChart = () => {
    switch (chartType) {
      case "Bar":
        return (
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="unitPrice" fill="#28a745" radius={[7, 7, 0, 0]} />
          </BarChart>
        );
      case "Line":
        return (
          <LineChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="unitPrice" stroke="#8884d8" />
          </LineChart>
        );
      case "Area":
        return (
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="unitPrice" fill="#8884d8" />
          </AreaChart>
        );
      case "Pie":
        return (
          <PieChart>
            <Pie
              data={formattedData}
              dataKey="unitPrice"
              nameKey="product"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
            >
              {formattedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case "Radar":
        return (
          <RadarChart
            outerRadius={90}
            width={500}
            height={500}
            data={formattedData}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="product" />
            <PolarRadiusAxis />
            <Radar
              name="Unit Price"
              dataKey="unitPrice"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        );
      default:
        return null;
    }
  };

  const chartOptions = [
    { value: "Bar", label: "Bar Chart", icon: <BarIcon size={18} /> },
    { value: "Line", label: "Line Chart", icon: <LineIcon size={18} /> },
    { value: "Area", label: "Area Chart", icon: <AreaIcon size={18} /> },
    { value: "Pie", label: "Pie Chart", icon: <PieIcon size={16} /> },
    { value: "Radar", label: "Radar Chart", icon: <RadarIcon size={18} /> },
  ];

  return (
    <div className="graph-container">
      <div className="chart-controls">
        <div className="custom-dropdown">
          <button
            className="dropdown-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {chartOptions.find((opt) => opt.value === chartType).icon}
            {chartOptions.find((opt) => opt.value === chartType).label}
          </button>
          {dropdownOpen && (
            <ul className="dropdown-list">
              {chartOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    setChartType(option.value);
                    setDropdownOpen(false);
                  }}
                  className={`dropdown-item ${
                    chartType === option.value ? "selected" : ""
                  }`}
                >
                  {option.icon}
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={handleSave} className="save-button">
          <Save size={20} /> 
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

export default GraphComponent;

