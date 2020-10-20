const mongoose = require("mongoose");
const { Schema } = mongoose;

const DataSchema = new Schema(
  {
    searchTerm: String,
    numberOfJobs: Number,
    code: String,
    label: String,
    insertDate: Number,
  },
  { timestamps: true }
);

const SearchTerm = mongoose.model("SearchTerm", DataSchema);

module.exports = SearchTerm;
