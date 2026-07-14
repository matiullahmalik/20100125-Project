// This is the main file that starts our backend server.
// It brings together Express,database connection and our routes.

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDatabase = require("./config/db");
const bikeRoutes = require("./routes/bikeRoutes");

// Load variables from the .env file into process.env
dotenv.config();

const app = express();

//        Middleware
// cors: allows our frontend to talk to this backend
app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

//       Database 

if (process.env.NODE_ENV !== "test") {
  connectDatabase(process.env.MONGO_URI);
}

//        Routes 
// Every bike-related URL starts with /api/bikes
app.use("/api/bikes", bikeRoutes);

app.get("/", function (req, res) {
  res.json({
    success: true,
    message: "Green Wheels Bicycle Rental API is running",
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, function () {
    console.log("Server is running on http://localhost:" + PORT);
  });
}

module.exports = app;
