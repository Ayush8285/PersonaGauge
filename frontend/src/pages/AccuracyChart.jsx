// src/pages/AccuracyChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const AccuracyChart = () => {
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/accuracy/static-accuracy/")
      .then(res => setAccuracy(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!accuracy) return <div className="text-center mt-10">Loading Accuracy...</div>;

  const chartData = [
    {
      name: "Personality Accuracy",
      Accuracy: accuracy.personality_accuracy_percent || 0,
    },
    {
      name: "Job Role Accuracy",
      Accuracy: accuracy.job_role_accuracy_percent || 0,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Model Accuracy Report</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="Accuracy" fill="#4CAF50" barSize={60} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center mt-4 text-gray-600">
        Based on evaluation of {accuracy.total_users_evaluated} users with ground truth labels.
      </p>
    </div>
  );
};

export default AccuracyChart;
