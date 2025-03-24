// src/components/dashboard/ComplaintChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComplaintChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-6 text-gray-500">No data available</div>;
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pending" name="Pending" fill="#FCD34D" />
          <Bar dataKey="resolved" name="Resolved" fill="#10B981" />
          <Bar dataKey="dropped" name="Dropped" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComplaintChart;