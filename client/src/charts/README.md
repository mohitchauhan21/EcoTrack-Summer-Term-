# Charts

This directory contains reusable Recharts wrapper components.

Example:
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EmissionLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

export default EmissionLineChart;
```
