require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db.js");
const morgan = require("morgan");

const app = express();

// Middleware init
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Static Files
app.use(express.static("public"));

// Logging
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

// Connecting database
connectDB();

// PORT
const PORT = process.env.PORT || 3000;

// Verify Login
app.use("/api/verify", require("./routes/api/verify"));

// Define routes
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/organization", require("./routes/api/organization"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));

// request to handle undefined or all other routes
app.get("*", async (req, res) => {
  try {
    console.log("Undefined Route Accessed");
    res.status(404).json({
      msg: "Route not found",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Info] Server running on PORT ${PORT}`);
});
