// PiePlot.js
import { PieChart, Pie, ResponsiveContainer } from "recharts";

const PiePlot = ({ data, activeIndex, onEnter }) => (
    <ResponsiveContainer width="100%" height={400}>
        <PieChart>
            <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onEnter}
            />
        </PieChart>
    </ResponsiveContainer>
);

export default PiePlot;
