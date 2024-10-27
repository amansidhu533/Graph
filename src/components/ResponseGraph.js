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

const ResponseGraph = ({ chartData }) => {
  const [chartType, setChartType] = useState("Bar");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Prepare data for the chart, handling both total_quantity_sold and total_sales
  const data = chartData?.data?.map((item) => {
    const key =
      item.total_quantity_sold !== undefined
        ? "total_quantity_sold"
        : "total_sales"; // Determine the correct key
    return {
      product: item.product,
      unitPrice: parseFloat(item[key]), // Use the dynamically determined key
    };
  }) || []; // Fallback to an empty array if data is unavailable

  // Ensure data is valid by filtering out any undefined or invalid entries
  const formattedData = data.filter(
    (item) => item?.product && item?.unitPrice
  );

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
            {/* <Bar dataKey="unitPrice" fill="#4bc0c0" radius={[7, 7, 0, 0]}> */}
            <Bar dataKey="unitPrice" fill="#f55051" radius={[7, 7, 0, 0]}>
              <LabelList position="top" fill="#000" />
            </Bar>
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
    <div className="graph-container h-96">
      <div className="chart-controls">
        <div className="custom-dropdown">
          <button
            className="dropdown-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
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
                  className={`dropdown-item ${
                    chartType === option.value ? "selected" : ""
                  }`}
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
};

export default ResponseGraph;
