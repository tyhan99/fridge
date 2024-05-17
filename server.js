// imports
// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express')
var app = express()

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


  // Example route to test database connection
  app.get('/test-db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        res.send(result.rows[0]);
        client.release();
      } catch (err) {
        console.error(err);
        res.status(500).send('Error connecting to the database');
      }
    });
 
app.get('/login_ids', async (req, res) => {
    try {
        const result = await pool.query('SELECT login_id FROM users');
        res.json(result.rows);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

// Tells the app which port to run on
app.listen(8080);