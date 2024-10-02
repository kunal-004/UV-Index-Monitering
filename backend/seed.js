// Import your UVIndex model
const mongoose = require("mongoose");
const UVIndex = require("./models/uv.models"); // Replace with your actual model path

// Define your array of objects
const uvindex = [
  { uvIndex: 2.5 },
  { uvIndex: 3.0 },
  { uvIndex: 5.1 },
  { uvIndex: 7.3 },
  { uvIndex: 9.8 },
  { uvIndex: 3.0 },
  { uvIndex: 4.5 },
  { uvIndex: 2.8 },
  { uvIndex: 8.0 },
  { uvIndex: 2.8 },
];

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/uv-index")
  .then(() => {
    console.log("MongoDB connected");
    return UVIndex.insertMany(uvindex);
  })
  .then(() => {
    console.log("Data seeded successfully");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
  });
