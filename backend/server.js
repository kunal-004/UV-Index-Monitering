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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
