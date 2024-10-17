const mongoose = require("mongoose");

const uvDataSchema = new mongoose.Schema(
  {
    uvIndex: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const UvData = mongoose.model("Uvindex", uvDataSchema);
module.exports = UvData;
