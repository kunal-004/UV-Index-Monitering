/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import GaugeChart from "react-gauge-chart";
import axios from "axios";
import "../assets/styles.css";

const recommendations = [
  { minUv: 0, maxUv: 2, message: "No protection needed. Safe to be outdoors." },
  {
    minUv: 3,
    maxUv: 5,
    message: "Wear sunglasses. Use sunscreen if staying out.",
  },
  {
    minUv: 6,
    maxUv: 7,
    message: "Use sunscreen SPF 30+, sunglasses, and hats. Avoid midday sun.",
  },
  {
    minUv: 8,
    maxUv: 10,
    message: "Minimize exposure. Use SPF 30+, sunglasses, and cover up.",
  },
  {
    minUv: 11,
    maxUv: Infinity,
    message: "Avoid the sun. Stay indoors or cover up completely.",
  },
];

function UVIndexMonitor() {
  const [todayData, setTodayData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [currentUV, setCurrentUV] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  const fetchUVData = async (endpoint, setDataFunction) => {
    try {
      const response = await axios.get(endpoint);
      const formattedData = response.data.map((item) => ({
        time: new Date(item.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        uv: parseFloat(item.uvIndex.toFixed(2)),
        day: new Date(item.createdAt).toLocaleDateString(),
      }));
      setDataFunction(formattedData);
      if (endpoint.includes("today") && formattedData.length > 0) {
        setCurrentUV(formattedData[formattedData.length - 1].uv);
      }
    } catch (error) {
      console.error(`Error fetching UV data from ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchUVData("/api/UvData/today", setTodayData);
    fetchUVData("/api/UvData/weekly", setWeekData);
  }, []);

  useEffect(() => {
    if (subscribed) {
      const intervalId = setInterval(() => {
        const recommendation = getRecommendation(currentUV);
        sendNotification("UV Index Update", recommendation);
      }, 3600000); // Check every hour

      return () => clearInterval(intervalId);
    }
  }, [subscribed, currentUV]);

  const getRecommendation = (uvIndex) => {
    const recommendation = recommendations.find(
      (r) => uvIndex >= r.minUv && uvIndex <= r.maxUv
    );
    return recommendation
      ? recommendation.message
      : "No recommendation available.";
  };

  const sendNotification = (title, message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body: message });
    } else if (
      "Notification" in window &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body: message });
        }
      });
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const uvValue = payload[0].value;
      const uvLabel = uvValue >= 6 ? "High" : "Low";
      return (
        <div className="custom-tooltip">
          <p>{`Time: ${payload[0].payload.time}`}</p>
          <p>{`UV Index: ${uvValue} (${uvLabel})`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <button
        onClick={() => setSubscribed(!subscribed)}
        className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
      >
        {subscribed ? "Subscribed (Unsubscribe)" : "Subscribe for UV Alerts"}
      </button>

      <h1>UV Index Monitoring System</h1>

      <GaugeChart
        className="uv-monitor-container"
        id="gauge-chart"
        nrOfLevels={15}
        percent={currentUV / 150}
        textColor="#000"
        colors={["#00FF00", "#FFA500", "#FF0000"]}
        arcWidth={0.1}
        needleColor="#757575"
        formatTextValue={(value) => `${(value * 15).toFixed(2)} %`}
      />
      <h2>Current UV Index: {currentUV.toFixed(2)}</h2>

      <div className="recommendation-box">
        <h3>Recommendations:</h3>
        <p>{getRecommendation(currentUV)}</p>
      </div>

      <div className="chart-container">
        <div className="chart">
          <h3>Todays UV Index Values</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={todayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 15]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="uv"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Weekly UV Index Values</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 15]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="uv"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default UVIndexMonitor;
