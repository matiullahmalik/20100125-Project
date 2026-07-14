// This file contains all the "logic" for handling bike requests.
// Each function here matches one API endpoint.

const Bike = require("../models/Bike");

async function getAllBikes(req, res) {
  try {
    const search = req.query.search;
    const sortBy = req.query.sortBy;

    let filter = {};
    if (search) {
      const searchPattern = new RegExp(search, "i"); // "i" = ignore case
      filter = {
        $or: [
          { bikeNumber: searchPattern },
          { brand: searchPattern },
          { bikeType: searchPattern },
          { status: searchPattern },
          { personName: searchPattern },
        ],
      };
    }

    let sortOption = { createdAt: -1 };

    if (sortBy === "type") sortOption = { bikeType: 1 };
    if (sortBy === "brand") sortOption = { brand: 1 };
    if (sortBy === "dailyRate") sortOption = { dailyRate: 1 };
    if (sortBy === "weeklyRate") sortOption = { weeklyRate: 1 };
    if (sortBy === "status") sortOption = { status: 1 };

    const bikes = await Bike.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count: bikes.length,
      data: bikes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching bikes",
    });
  }
}

async function getBikeById(req, res) {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    res.status(200).json({
      success: true,
      data: bike,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the bike",
    });
  }
}

async function createBike(req, res) {
  try {
    const newBike = await Bike.create(req.body);

    res.status(201).json({
      success: true,
      message: "Bike added successfully",
      data: newBike,
    });
  } catch (error) {
    // Mongoose validation errors (missing fields, bad rate, etc.)
    if (error.name === "ValidationError") {
      const firstMessage = Object.values(error.errors)[0].message;
      return res.status(400).json({
        success: false,
        message: firstMessage,
      });
    }

    // Duplicate bike number error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bike number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong while adding the bike",
    });
  }
}


// PUT /api/bikes/:id
// Updates an existing bike.

async function updateBike(req, res) {
  try {
    const updatedBike = await Bike.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the UPDATED bike, not the old one
      runValidators: true, // still check our schema rules
    });

    if (!updatedBike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bike updated successfully",
      data: updatedBike,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstMessage = Object.values(error.errors)[0].message;
      return res.status(400).json({
        success: false,
        message: firstMessage,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bike number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the bike",
    });
  }
}

// Removes a retired bike.
async function deleteBike(req, res) {
  try {
    const deletedBike = await Bike.findByIdAndDelete(req.params.id);

    if (!deletedBike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bike deleted successfully",
      data: deletedBike,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the bike",
    });
  }
}

// A simple report: total bikes, available bikes, bikes in maintenance.
async function getBikeReport(req, res) {
  try {
    const totalBikes = await Bike.countDocuments({});
    const availableBikes = await Bike.countDocuments({ status: "Available" });
    const rentedBikes = await Bike.countDocuments({ status: "Rented" });
    const maintenanceBikes = await Bike.countDocuments({
      status: "Maintenance",
    });

    res.status(200).json({
      success: true,
      data: {
        totalBikes: totalBikes,
        availableBikes: availableBikes,
        rentedBikes: rentedBikes,
        maintenanceBikes: maintenanceBikes,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while building the report",
    });
  }
}

module.exports = {
  getAllBikes,
  getBikeById,
  createBike,
  updateBike,
  deleteBike,
  getBikeReport,
};
