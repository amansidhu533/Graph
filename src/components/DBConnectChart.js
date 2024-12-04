import React, { useEffect, useState } from "react";
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
  LabelList
} from "recharts";
import { saveAs } from "file-saver";
import {
  Save,
  BarChart as BarIcon,
  LineChart as LineIcon,
  PieChart as PieIcon,
  AreaChart as AreaIcon,
  Radar as RadarIcon,
} from "lucide-react";

function DBConnectChart({ dbData }) {
  const [chartType, setChartType] = useState("Bar");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formattedData, setFormattedData] = useState([]);

  // Transform dbData into a format compatible with Recharts
  useEffect(() => {
    if (dbData && dbData.labels && dbData.datasets && dbData.datasets[0].values) {
      // Assuming the first dataset is always the one we want
      const data = dbData.labels.map((label, index) => ({
        label, // Mapping labels from dbData
        value: dbData.datasets[0].values[index], // Mapping values from the first dataset
      }));
      console.log("Formatted Data:", data);
      setFormattedData(data); // Set formatted data for chart
    }
  }, [dbData]);
  

  // Fallback in case dbData is not available or improperly structured
  if (!formattedData || formattedData.length === 0) return <p>No data available for chart.</p>;

  const handleSave = () => {
    const svgElement = document.querySelector(".recharts-wrapper svg");
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    saveAs(blob, "dbconnect_chart.svg");
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
            <XAxis dataKey="label" label={{ value: "Labels", position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: "Values", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#28a745" radius={[7, 7, 0, 0]} />
          </BarChart>
        );
      case "Line":
        return (
          <LineChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" label={{ value: "Labels", position: "insideBottom", offset: -5 }} />
            <YAxis label={{ value: "Values", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        );
      case "Area":
        return (
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" />
          </AreaChart>
        );
      case "Pie":
        return (
          <PieChart>
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case "Radar":
        return (
          <RadarChart outerRadius={90} data={formattedData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="label" />
            <PolarRadiusAxis />
            <Radar name="Value" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
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
    <div className="dbconnect-graph-container">
      <div className="chart-controls">
        <div className="custom-dropdown">
          <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {chartOptions.find((opt) => opt.value === chartType).icon}
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
                  className={`dropdown-item ${chartType === option.value ? "selected" : ""}`}
                >
                  {option.icon}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button onClick={handleSave} className="save-button">
          <Save size={20} />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

export default DBConnectChart;