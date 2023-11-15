import React, { useState } from "react";
import { ResponsiveContainer } from "recharts";
import StackedBarPlot from "../components/StackedBarPlot";
import PiePlot from "../components/PiePlot";
import BarPlot from "../components/BarPlot";
import RadarPlot from "../components/RadarPlot";

const stackedBarData = [
  {
    name: "John",
    Satisfaction: 50,
    Unfulfilled: 85 - 50,
  },
  {
    name: "Alice",
    Satisfaction: 120,
    Unfulfilled: 150 - 120,
  },
  {
    name: "Bob",
    Satisfaction: 90,
    Unfulfilled: 160 - 90,
  },
  {
    name: "Emily",
    Satisfaction: 40,
    Unfulfilled: 130 - 40,
  },
  {
    name: "Franck",
    Satisfaction: 150,
    Unfulfilled: 160 - 150,
  },
];

const pieData = [
  { name: "Job 1", value: 600 },
  { name: "Job 2", value: 100 },
  { name: "Job 3", value: 300 },
];

const barData = [
  { name: "John", uv: 5 },
  { name: "Alice", uv: 4 },
  { name: "Bob", uv: 2 },
  { name: "Emily", uv: 3 },
  { name: "Franck", uv: 1 },
];

const employeeData = [
  { subject: "Forklift", John: 50, Alice: 0, Bob: 90, Emily: 65, Franck: 50 },
  { subject: "Sorting", John: 20, Alice: 100, Bob: 25, Emily: 50, Franck: 50 },
  { subject: "Picking", John: 15, Alice: 50, Bob: 45, Emily: 15, Franck: 60 },
];

const employees = ["John", "Alice", "Bob", "Emily", "Franck"];

export default function Visualization() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div>
      <h1>Visualizations</h1>
      <h2>Personal Preference Satisfaction (Stacked Bar Plot)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <StackedBarPlot data={stackedBarData} />
      </ResponsiveContainer>

      <h2> Job Popularity (Donut)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PiePlot
          data={pieData}
          activeIndex={activeIndex}
          onPieEnter={onPieEnter}
        />
      </ResponsiveContainer>

      <h2> Workload Ranking (Bar Chart)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarPlot data={barData} />
      </ResponsiveContainer>

      <h2> Personal Job Preferences (Spider)</h2>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {employees.map((employee) => (
          <div key={employee} style={{ width: "20%" }}>
            <h5> {employee}</h5>
            <ResponsiveContainer height={300}>
              <RadarPlot data={employeeData} name={employee} />
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
