const express = require('express');
const { Client } = require('pg'); // Postgres client library

const app = express();
const port = process.env.PORT || 5432; // Use environment variable for port 3000

// Use external URL from Render (replace with placeholder)
const url = process.env.DATABASE_URL;

const client = new Client({ connectionString: url });

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error:', err.stack));

// imports
// Needed for dotenv
require("dotenv").config();

// Needed for EJS
// app.set('view engine', 'ejs');

// Needed for public directory
app.use(express.static(__dirname));

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Index page
app.get('/', function(req, res) {
    // How to connect to database without Prisma

    // SELECT + FROM
    // console.log(data)

    res.render('index');
});

// Create a new pool instance with the connection string
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Render's PostgreSQL SSL
    }
  });



app.get('/user-ids', async (req, res) => {
  try {
    const sql = 'SELECT userid FROM users';
    const result = await client.query(sql);

    const userIds = result.rows.map(row => row.userid);
    res.json(userIds);
  } catch (err) {
    console.error('Error fetching user IDs:', err.stack);
    res.status(500).send('Error retrieving user data');
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
