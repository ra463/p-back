const express = require("express");
const cors = require("cors");
const app = express();
const { error } = require("./middleware/error.js");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config/config.env",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://p-front-one.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// import routes
const userRoutes = require("./routes/userRoutes.js");
const propertyRoutes = require("./routes/propertyRoutes.js");

//import validators
const userValidator = require("./validator/userValidator.js");
const propertyValidator = require("./validator/propertyValidator.js");

// use routes
app.use("/api/user", userValidator, userRoutes);
app.use("/api/property", propertyValidator, propertyRoutes);

app.get("/", (req, res) =>
  res.send(`<h1>Its working. Click to visit Link.</h1>`)
);

app.all("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
app.use(error);
