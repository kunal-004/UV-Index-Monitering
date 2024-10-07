const express = require("express");
const UvRouter = require("./routes/uvRoute");
require("dotenv").config();

const cors = require("cors");
const connectdb = require("./config/db");

connectdb();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", UvRouter);

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
