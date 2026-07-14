// This file just connects URLs (routes) to the correct controller function.
const express = require("express");
const router = express.Router();

const {
  getAllBikes,
  getBikeById,
  createBike,
  updateBike,
  deleteBike,
  getBikeReport,
} = require("../controllers/bikeController");

router.get("/report/summary", getBikeReport);

router.get("/", getAllBikes);
router.get("/:id", getBikeById);
router.post("/", createBike);
router.put("/:id", updateBike);
router.delete("/:id", deleteBike);

module.exports = router;
