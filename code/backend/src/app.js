const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/", routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
