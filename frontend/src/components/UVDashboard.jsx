import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const UVDashboard = () => {
  const [uvData, setUvData] = useState([]);

  useEffect(() => {
    const fetchUVData = async () => {
      const response = await axios.get("/api/UvData/today");
      setUvData(response);
      console.log(response.data);
    };

    fetchUVData();
  }, []);

  const data = {
    labels: uvData.map((item) => new Date(item.createdAt).toLocaleTimeString()),
    datasets: [
      {
        label: "UV Index",
        data: uvData.map((item) => item.uvIndex),
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>UV Index Today</h2>
      <Line data={data} />
    </div>
  );
};

export default UVDashboard;
