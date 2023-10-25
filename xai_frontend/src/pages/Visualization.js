import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Bar,
  BarChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";


const lineData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
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

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`PV ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function Visualization() {
  const [activeIndex, setActiveIndex] = useState(0);
  

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div>
      <h1>Visualizations</h1>
      <h2> Personal Preference Satisfaction (Bar plot)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={lineData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <h2> Job Popularity (Donut)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>

      <h2> Workload Ranking (Bar Chart)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="uv" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2> Personal Job Preferences (Spider)</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          
      {employees.map((employee) => (
        <div key={employee} style={{ width: '20%' }}>
        <h5>   {employee}</h5>
        <ResponsiveContainer height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={employeeData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name={employee} dataKey={employee} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    </div>))}
        </div>
    </div>
  );
}
