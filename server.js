// Needed for dotenv
require("dotenv").config();

const express = require('express');
const { Client } = require('pg'); // Postgres client library

const app = express();
const port = process.env.PORT || 5432; // Use environment variable for port

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Needed for parsing JSON data
const { bodyParser } = require('body-parser'); 

// Needed for public directory
app.use(express.static(__dirname));
//app.use(express.static("views"));


// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Database connection details (replace with your actual values)
const url = process.env.DATABASE_URL; // Replace with your actual Render URL

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error:', err.stack));

// Index page
app.get('/', function(req, res) {

//    console.log(result);
//   const result = client.query("SELECT * FROM users"); 
//   console.log(result); 
   
    res.render('index');
});

/* app.get('/user-ids', async (req, res) => {
  try {
    const sql = 'SELECT user_id FROM users';
    const result = await client.query(sql);
    console.log(result); // Debugging
    const userids = result.rows.map(row => row.user_id);
    res.json(userids);
    console.log(userids); 
  } catch (err) {
    console.error('Error fetching user_ids:', err.stack);
    res.status(500).send('Error retrieving user data');
  }
});
*/

app.get('/user-ids', async (req, res) => {
  try {
    const sql = 'SELECT uid, user_id FROM users';
    const result = await client.query(sql);
    console.log(result); // Debugging
    const userids = result.rows.map(row => ({uid: row.uid, user_id: row.user_id}));
    res.json(userids);
    console.log(userids); 
  } catch (err) {
    console.error('Error fetching user_ids:', err.stack);
    res.status(500).send('Error retrieving user data');
  }
});

app.post('/adduser', async (req, res) => {
  try {
    //const input = req.body()
    const { user_id, email } = req.body;
    const result = await client.query("INSERT INTO users(user_id, email) VALUES ($1, $2)", [user_id, email]); 
    console.log(result); // Debugging

  } catch (err) {
    console.error('Error adding new user:', err.stack);
    res.status(500).send('Error adding new user');
  }

  res.redirect('/');

});

app.listen(port, () => console.log(`Server listening on port ${port}`));