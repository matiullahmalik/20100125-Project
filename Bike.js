// This file defines what a "Bike" looks like in our database.

const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    bikeNumber: {
      type: String,
      required: [true, "Bike number is required"],
      unique: true, // no two bikes can share the same bike number
      trim: true,
    },
    bikeType: {
      type: String,
      required: [true, "Bike type is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    colour: {
      type: String,
      trim: true,
      default: "Not specified",
    },
    dailyRate: {
      type: Number,
      required: [true, "Daily rate is required"],
      min: [0.01, "Daily rate must be greater than zero"],
    },
    weeklyRate: {
      type: Number,
      required: [true, "Weekly rate is required"],
      min: [0.01, "Weekly rate must be greater than zero"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["Available", "Rented", "Maintenance"],
        message: "Status must be Available, Rented, or Maintenance",
      },
      default: "Available",
    },
 
    personName: {
      type: String,
      trim: true,
      default: "",
    },
    lastServiceDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
 
    timestamps: true,
  }
);


const Bike = mongoose.model("Bike", bikeSchema);

module.exports = Bike;
