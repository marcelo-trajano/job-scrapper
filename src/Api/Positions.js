const mongoose = require("mongoose");
const { Schema } = mongoose;

const DataSchema = new Schema(
  {
    position: String,
    companyName: String,
    salary: String,
    posted: String,
    link: String,
    code: String,
    insertDate: Number,
    //description: String,
  },
  { timestamps: true }
);

const Jobs = mongoose.model("jobTest", DataSchema);

module.exports = Jobs;
