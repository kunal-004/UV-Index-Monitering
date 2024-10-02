import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

// Import and register Chart.js components
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const UVDashboard = () => {
  const [uvData, setUvData] = useState([]);

  useEffect(() => {
    const fetchUVData = async () => {
      const response = await axios.get("/api/UvData/today");
      setUvData(response.data); // Correctly set response.data
      console.log(response.data);
    };

    fetchUVData();
  }, []);

  const data = {
    labels: uvData.map((item) =>
      new Date(item.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    ),
    datasets: [
      {
        label: "UV Index",
        data: uvData.map((item) => item.uvIndex),
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false, // Ensures the chart line is not filled
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "category", // Register 'category' scale for x-axis
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>UV Index Today</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default UVDashboard;
