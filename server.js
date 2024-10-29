require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const body_parser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

const StudentRoute = require('./byteClassroom/student/views/StudentRegistration')

// establishing database connection
// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI||'mongodb://localhost:27017/testDB';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000, // Keep trying to send operations for 5 seconds

})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
app.use('/api/student',StudentRoute)
