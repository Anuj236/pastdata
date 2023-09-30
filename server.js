// server.js

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// MongoDB Connection
mongoose.connect('mongodb://localhost/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema and model for your data
const DataSchema = new mongoose.Schema({
  // Define your schema fields here
});

const DataModel = mongoose.model('Data', DataSchema);

// Multer Configuration for File Upload
const storage = multer.memoryStorage(); // Store the CSV file in memory
const upload = multer({ storage: storage });

// API Endpoint to Upload CSV
app.post('/api/data', upload.single('file'), (req, res) => {
  // Parse CSV file
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const results = [];

  fs.createReadStream(file.buffer)
    .pipe(csv())
    .on('data', (row) => {
      // Process each row of the CSV and store it in the MongoDB
      results.push(row);
    })
    .on('end', () => {
      // Store the JSON data in MongoDB
      DataModel.insertMany(results, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error storing data.' });
        }

        res.status(200).json({ message: 'Data uploaded and stored successfully.' });
      });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
