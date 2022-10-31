require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db.js');

const app = express();

// Middleware init
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Connecting database
connectDB();

const PORT = process.env.PORT || 3000;

// Define routes
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/organization', require('./routes/api/organization'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));

app.listen(PORT, () =>{
  console.log(`[Info] Server running on PORT ${PORT}`);
})
