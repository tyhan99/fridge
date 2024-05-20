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

    res.render('index');
});


app.get('/user-ids', async (req, res) => {
  try {
    const sql1 = 'SELECT uid, user_id FROM users';
    const result1 = await client.query(sql1);
    console.log(result1); // Debugging
    const userids = result1.rows.map(row => ({uid: row.uid, user_id: row.user_id}));
    res.json(userids);
    console.log(userids); 
  } catch (err) {
    console.error('Error fetching user_ids:', err.stack);
    res.status(500).send('Error retrieving user data');
  }
});


app.get('/fridge-ids', async (req, res) => {
  try {
    const sql2 = 'SELECT fridge_id, fridge_name FROM fridge';
    const result2 = await client.query(sql2);
    console.log(result2); // Debugging
    const fridgenames = result2.rows.map(row => ({fridge_id: row.fridge_id, fridge_name: row.fridge_name}));
    res.json(fridgenames);
    console.log(fridgenames); 
  } catch (err) {
    console.error('Error fetching fridge_ids:', err.stack);
    res.status(500).send('Error retrieving fridge data');
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

app.post('/addfridge', async (req, res) => {
  try {
    //const input = req.body()
    const { fridge_name, uid } = req.body;
    const result = await client.query("INSERT INTO fridge(fridge_name, uid) VALUES ($1, $2)", [fridge_name, user_id]); 
    console.log(result); // Debugging

  } catch (err) {
    console.error('Error adding new fridge:', err.stack);
    res.status(500).send('Error adding new fridge');
  }
  res.redirect('/');

});

app.listen(port, () => console.log(`Server listening on port ${port}`));