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
import "../assets/styles.css"; // Include updated styles
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryTooltip,
} from "victory";

const recommendations = [
  { uv: 0, message: "No protection needed. Safe to be outdoors." },
  { uv: 3, message: "Wear sunglasses. Use sunscreen if staying out." },
  {
    uv: 6,
    message: "Use sunscreen SPF 30+, sunglasses, and hats. Avoid midday sun.",
  },
  {
    uv: 8,
    message: "Minimize exposure. Use SPF 30+, sunglasses, and cover up.",
  },
  { uv: 11, message: "Avoid the sun. Stay indoors or cover up completely." },
];

const dummyUVData2 = [
  // Day 1
  { day: "2024-09-23", time: "10:00 AM", uv: 2 },
  { day: "2024-09-23", time: "11:00 AM", uv: 4 },
  { day: "2024-09-23", time: "12:00 PM", uv: 6 },
  { day: "2024-09-23", time: "01:00 PM", uv: 8 },
  { day: "2024-09-23", time: "02:00 PM", uv: 10 },
  { day: "2024-09-23", time: "03:00 PM", uv: 9 },
  { day: "2024-09-23", time: "04:00 PM", uv: 7 },
  { day: "2024-09-23", time: "05:00 PM", uv: 5 },

  // Day 2
  { day: "2024-09-24", time: "10:00 AM", uv: 3 },
  { day: "2024-09-24", time: "11:00 AM", uv: 5 },
  { day: "2024-09-24", time: "12:00 PM", uv: 7 },
  { day: "2024-09-24", time: "01:00 PM", uv: 9 },
  { day: "2024-09-24", time: "02:00 PM", uv: 11 },
  { day: "2024-09-24", time: "03:00 PM", uv: 10 },
  { day: "2024-09-24", time: "04:00 PM", uv: 8 },
  { day: "2024-09-24", time: "05:00 PM", uv: 6 },

  // Day 3
  { day: "2024-09-25", time: "10:00 AM", uv: 1 },
  { day: "2024-09-25", time: "11:00 AM", uv: 3 },
  { day: "2024-09-25", time: "12:00 PM", uv: 6 },
  { day: "2024-09-25", time: "01:00 PM", uv: 7 },
  { day: "2024-09-25", time: "02:00 PM", uv: 8 },
  { day: "2024-09-25", time: "03:00 PM", uv: 9 },
  { day: "2024-09-25", time: "04:00 PM", uv: 7 },
  { day: "2024-09-25", time: "05:00 PM", uv: 4 },

  // Day 4
  { day: "2024-09-26", time: "10:00 AM", uv: 2 },
  { day: "2024-09-26", time: "11:00 AM", uv: 4 },
  { day: "2024-09-26", time: "12:00 PM", uv: 6 },
  { day: "2024-09-26", time: "01:00 PM", uv: 8 },
  { day: "2024-09-26", time: "02:00 PM", uv: 9 },
  { day: "2024-09-26", time: "03:00 PM", uv: 8 },
  { day: "2024-09-26", time: "04:00 PM", uv: 6 },
  { day: "2024-09-26", time: "05:00 PM", uv: 5 },

  // Day 5
  { day: "2024-09-27", time: "10:00 AM", uv: 3 },
  { day: "2024-09-27", time: "11:00 AM", uv: 6 },
  { day: "2024-09-27", time: "12:00 PM", uv: 8 },
  { day: "2024-09-27", time: "01:00 PM", uv: 9 },
  { day: "2024-09-27", time: "02:00 PM", uv: 10 },
  { day: "2024-09-27", time: "03:00 PM", uv: 9 },
  { day: "2024-09-27", time: "04:00 PM", uv: 7 },
  { day: "2024-09-27", time: "05:00 PM", uv: 6 },
];

function UVIndexMonitor() {
  const [currentUV, setCurrentUV] = useState(5);
  const [uvData, setUvData] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchUVData = async () => {
      const response = await axios.get("/api/UvData/today");

      const uvIndexes = response.data.map((uvdata) => ({
        uv: uvdata.uvIndex,
        time: new Date(uvdata.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setUvData(uvIndexes);
    };

    fetchUVData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomUV = Math.floor(Math.random() * 15);
      setCurrentUV(randomUV);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRecommendation = (uvIndex) => {
    for (let i = recommendations.length - 1; i >= 0; i--) {
      if (uvIndex >= recommendations[i].uv) {
        return recommendations[i].message;
      }
    }
    return recommendations[0].message;
  };

  useEffect(() => {
    if (subscribed) {
      const intervalId = setInterval(() => {
        if (currentUV < 6) {
          sendNotification(
            "UV Index Safe",
            "UV index is safe, you can go outside without much protection."
          );
        } else if (currentUV >= 6) {
          sendNotification(
            "UV Index High",
            "UV index is high, avoid exposure to the sun!"
          );
        }
      }, 5 * 60 * 60 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [subscribed, currentUV]);

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

  const UVIndexBarChart = ({ uvData }) => {
    return (
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ y: [0, 15] }} // Y-axis domain for UV index
      >
        <VictoryAxis tickFormat={(t) => t} />

        <VictoryAxis dependentAxis tickFormat={(t) => `${t}`} />

        <VictoryBar
          data={uvData}
          x="time"
          y="uv"
          labels={({ datum }) => `uv Index: ${datum.uv}`}
          labelComponent={<VictoryTooltip />} // Tooltip for hover effect
          style={{
            data: { fill: "orange" }, // Bar color
          }}
        />
      </VictoryChart>
    );
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
        percent={currentUV / 15}
        textColor="#000"
        colors={["#00FF00", "#FFA500", "#FF0000"]}
        arcWidth={0.1}
        needleColor="#757575"
      />
      <h2>Current UV Index: {currentUV}</h2>

      <div className="recommendation-box">
        <h3>Recommendations:</h3>
        <p>{getRecommendation(currentUV)}</p>
        {/* <p>{uvData}</p> */}
      </div>

      <div className="chart-container">
        <div className="chart">
          <h3>Current UV Index Values</h3> {/* Title for the first chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={uvData}>
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
          <h3>Weekly UV Index Values</h3> {/* Title for the second chart */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyUVData2}>
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

// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import GaugeChart from "react-gauge-chart";
// import "../assets/styles.css"; // Include updated styles

// const dummyUVData = [
//   { time: "10:00 AM", uv: 2 },
//   { time: "11:00 AM", uv: 5 },
//   { time: "12:00 PM", uv: 7 },
//   { time: "01:00 PM", uv: 9 },
//   { time: "02:00 PM", uv: 10 },
//   { time: "03:00 PM", uv: 8 },
//   { time: "04:00 PM", uv: 6 },
//   { time: "05:00 PM", uv: 4 },
// ];

// const recommendations = [
//   { uv: 0, message: "No protection needed. Safe to be outdoors." },
//   { uv: 3, message: "Wear sunglasses. Use sunscreen if staying out." },
//   {
//     uv: 6,
//     message: "Use sunscreen SPF 30+, sunglasses, and hats. Avoid midday sun.",
//   },
//   {
//     uv: 8,
//     message: "Minimize exposure. Use SPF 30+, sunglasses, and cover up.",
//   },
//   { uv: 11, message: "Avoid the sun. Stay indoors or cover up completely." },
// ];

// function UVIndexMonitor() {
//   const [currentUV, setCurrentUV] = useState(5);
//   const [subscribed, setSubscribed] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const randomUV = Math.floor(Math.random() * 15);
//       setCurrentUV(randomUV);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const getRecommendation = (uvIndex) => {
//     for (let i = recommendations.length - 1; i >= 0; i--) {
//       if (uvIndex >= recommendations[i].uv) {
//         return recommendations[i].message;
//       }
//     }
//     return recommendations[0].message;
//   };

//   useEffect(() => {
//     if (subscribed) {
//       const intervalId = setInterval(() => {
//         if (currentUV < 6) {
//           sendNotification(
//             "UV Index Safe",
//             "UV index is safe, you can go outside without much protection."
//           );
//         } else if (currentUV >= 6) {
//           sendNotification(
//             "UV Index High",
//             "UV index is high, avoid exposure to the sun!"
//           );
//         }
//       }, 5 * 60 * 60 * 1000);

//       return () => clearInterval(intervalId);
//     }
//   }, [subscribed, currentUV]);

//   const sendNotification = (title, message) => {
//     if ("Notification" in window && Notification.permission === "granted") {
//       new Notification(title, { body: message });
//     } else if (
//       "Notification" in window &&
//       Notification.permission !== "denied"
//     ) {
//       Notification.requestPermission().then((permission) => {
//         if (permission === "granted") {
//           new Notification(title, { body: message });
//         }
//       });
//     }
//   };

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const uvValue = payload[0].value;
//       const uvLabel = uvValue >= 6 ? "High" : "Low";

//       return (
//         <div className="custom-tooltip">
//           <p>{`Time: ${payload[0].payload.time}`}</p>
//           <p>{`UV Index: ${uvValue} (${uvLabel})`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div>
//       {/* Subscribe Button */}
//       <button
//         onClick={() => setSubscribed(!subscribed)}
//         className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
//       >
//         {subscribed ? "Subscribed (Unsubscribe)" : "Subscribe for UV Alerts"}
//       </button>

//       <h1>UV Index Monitoring System</h1>

//       <GaugeChart
//         className="uv-monitor-container"
//         id="gauge-chart"
//         nrOfLevels={15}
//         percent={currentUV / 15}
//         textColor="#000"
//         colors={["#00FF00", "#FFA500", "#FF0000"]}
//         arcWidth={0.1}
//         needleColor="#757575"
//       />
//       <h2>Current UV Index: {currentUV}</h2>

//       <div className="recommendation-box">
//         <h3>Recommendations:</h3>
//         <p>{getRecommendation(currentUV)}</p>
//       </div>

//       <div className="chart-container">
//         <div className="chart">
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={dummyUVData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="time" />
//               <YAxis domain={[0, 15]} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="uv"
//                 stroke="#8884d8"
//                 activeDot={{ r: 8 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="chart">
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={dummyUVData2}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="day" />
//               <YAxis domain={[0, 15]} />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="uv"
//                 stroke="#8884d8"
//                 activeDot={{ r: 8 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UVIndexMonitor;
