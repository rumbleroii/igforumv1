require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db.js');
const morgan = require('morgan');


// Logging
const logger = require('./logger');

const app = express();

// Middleware init
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Connecting database
connectDB();

const PORT = process.env.PORT || 3000;

// Define routes
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/organization', require('./routes/api/organization'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));


// request to handle undefined or all other routes
app.get("*", async (req, res) => {
   logger.info("Undefined Route Accessed");
   res.status(404).json({
     msg : "Route not found"
   })
})

app.listen(PORT, () =>{
  logger.info(`[Info] Server running on PORT ${PORT}`);
})
