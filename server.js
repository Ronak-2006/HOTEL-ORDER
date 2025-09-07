// server.js

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000; // or any other port you want

// Connect to MongoDB (change URL if you're using MongoDB Atlas)
require('dotenv').config(); // Add this at the top if using .env

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// Define a schema
const accountSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String
});

// Create a model
const Account = mongoose.model('Account', accountSchema);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve your HTML file

// API route to handle form data
app.post('/api/create-account', async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  // Simple validation
  if (!firstName || !lastName || !email || phone.length !== 10) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const newAccount = new Account({ firstName, lastName, email, phone });
    await newAccount.save();
    res.status(200).json({ message: 'Account created successfully!' });
  } catch (error) {
    console.error('❌ Error saving to DB:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
