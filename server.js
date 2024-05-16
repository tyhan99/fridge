const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'edblog',
  user: 'your_username',
  password: 'your_password',
  database: 'fridge'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL server.');
});

// Define a route to get login_id data
app.get('/login_ids', (req, res) => {
  connection.query('SELECT login_id FROM users', (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
