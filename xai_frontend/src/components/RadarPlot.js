// RadarPlot.js
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

const RadarPlot = ({ name, data }) => (
    <div key={name} style={{ width: '100%' }}>
       {/*  <h5>{name}</h5> */}
        <ResponsiveContainer height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name={name} dataKey={name} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    </div>
);

export default RadarPlot;
