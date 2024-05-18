const express = require('express');
const { Client } = require('pg'); // Postgres client library

const app = express();
const port = process.env.PORT || 5432; // Use environment variable for port

// Database connection details (replace with your actual values)
const url = process.env.DATABASE_URL; // Replace with your actual Render URL

const client = new Client({ connectionString: url });

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error:', err.stack));

app.get('/user-ids', async (req, res) => {
  try {
    const sql = 'SELECT * FROM users';
    const result = await client.query(sql);

    const userIds = result.rows.map(row => row.userid);
    res.json(userIds);
  } catch (err) {
    console.error('Error fetching user IDs:', err.stack);
    res.status(500).send('Error retrieving user data');
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));