const mongoose = require("mongoose");
const { Schema } = mongoose;

const DataSchema = new Schema(
  {
    position: String,
    companyName: String,
    salary: String,
    posted: String,
    link: String,
    //description: String,
    code: { type: String, default: "GQL" },
    insertDate: Number,
  },
  { timestamps: true }
);

const Jobs = mongoose.model("job", DataSchema);

module.exports = Jobs;
