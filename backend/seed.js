const mongoose = require("mongoose");
const UVIndex = require("./models/uv.models"); // Replace with your actual model path

// Function to generate a random hour string (HH format)
function generateRandomTime() {
  const hours = Math.floor(Math.random() * 12) + 1; // Generate a random hour between 1 and 12
  const minutes = Math.floor(Math.random() * 60); // Generate a random minute between 0 and 59
  const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure two digits for minutes
  return `${hours}:${formattedMinutes}`;
}

// Function to seed data
async function seedData() {
  const uvindex = [
    { uvIndex: 2.5, time: generateRandomTime() },
    { uvIndex: 3.0, time: generateRandomTime() },
    { uvIndex: 5.1, time: generateRandomTime() },
    { uvIndex: 7.3, time: generateRandomTime() },
    { uvIndex: 9.8, time: generateRandomTime() },
    { uvIndex: 3.0, time: generateRandomTime() },
    { uvIndex: 4.5, time: generateRandomTime() },
    { uvIndex: 2.8, time: generateRandomTime() },
    { uvIndex: 8.0, time: generateRandomTime() },
    { uvIndex: 2.8, time: generateRandomTime() },
  ];

  // Add random hours for each UV index
  const uvindexWithRandomHours = uvindex.map((data) => ({
    ...data,
    time: generateRandomTime(), // Call the function to get a random hour
  }));

  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/uv-index");
    console.log("MongoDB connected");
    await UVIndex.insertMany(uvindexWithRandomHours);
    console.log("Data seeded successfully with random hours");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.disconnect();
  }
}

setInterval(seedData, 120000);
