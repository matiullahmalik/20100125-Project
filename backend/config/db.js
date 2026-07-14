// This file is responsible for connecting to MongoDB.
const mongoose = require("mongoose");

// This function connects to MongoDB using the connection string
function connectDatabase(mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(function () {
      console.log("MongoDB connected successfully!");
    })
    .catch(function (error) {
      console.log("MongoDB connection failed:");
      console.log(error);
    });
}

module.exports = connectDatabase;
