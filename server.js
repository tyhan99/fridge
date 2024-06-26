// Needed for dotenv to work
require("dotenv").config();

// Web framework within Node.js
const express = require('express');
const app = express();
const port = process.env.PORT || 8080; // Use environment variable for port

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Needed for public directory
app.use(express.static(__dirname));
//app.use(express.static("views"));

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Database connection details
const { Client } = require('pg'); // Postgres client library
const url = process.env.DATABASE_URL;

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

// About page
app.get('/about', function(req, res) {
  res.sendFile(__dirname + '/about.html');
});

// Contact page
app.get('/contact', function(req, res) {
  res.sendFile(__dirname + '/contact.html');
});

// For getting existing list of users from database
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

// For adding new user to databse
app.post('/adduser', async (req, res) => {
  try {
    const { user_id, email } = req.body;
    const result = await client.query("INSERT INTO users(user_id, email) VALUES ($1, $2)", [user_id, email]); 
    console.log(result); // Debugging
  } catch (err) {
    console.error('Error adding new user:', err.stack);
    res.status(500).send('Error adding new user');
  }
  res.redirect('/');
});

// For getting existing list of fridge from database
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

// For adding new fridge to database
app.post('/addfridge', async (req, res) => {
  try {
    const { fridge_name, selectedUserID } = req.body;
    const result = await client.query("INSERT INTO fridge(fridge_name, user_id) VALUES ($1, $2)", [fridge_name, selectedUserID]); 
    console.log(result); // Debugging
  } catch (err) {
    console.error('Error adding new fridge:', err.stack);
    res.status(500).send('Error adding new fridge');
  }
  res.redirect('/');
});

// For getting existing food data from database
app.get('/food-data', async (req, res) => {
  try {
    const fridge_id = req.query.fridge_id;
    const food_id = req.query.food_id;

    if (food_id) {
      // Fetch specific food item
      const sql = 'SELECT * FROM food WHERE food_id = $1';
      const result = await client.query(sql, [food_id]);
      res.json(result.rows);
    } else {
      // Fetch all food items in the fridge
      const sql = 'SELECT food.*, users.user_id AS owner FROM food JOIN users ON food.owner = users.uid WHERE food.fridge_id = $1';
      const result = await client.query(sql, [fridge_id]);
      const foodData = result.rows.map(row => ({
        food_id: row.food_id,
        food_name: row.food_name,
        qty: row.qty,
        compartment: row.compartment, // Include compartment data
        expiry_date: row.expiry_date,
        note: row.note,
        owner: row.owner,
        discard: row.discard
      }));
      res.json(foodData);
    }
  } catch (err) {
    console.error('Error fetching food data:', err.stack);
    res.status(500).send('Error retrieving food data');
  }
});

// For adding new food item to database
app.post('/add-food', async (req, res) => {
  try {
    const { food_name, qty, compartment, expiry_date, note, discard, fridge_id, owner } = req.body;
    const result = await client.query("INSERT INTO food(food_name, qty, compartment, expiry_date, note, discard, fridge_id, owner) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [food_name, qty, compartment, expiry_date, note, discard, fridge_id, owner]); 
    console.log(result); // Debugging
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Error adding new food item:', err.stack);
    res.status(500).send('Error adding new food item');
  }
});

// For editing existing food item and updating in database
app.post('/edit-food', async (req, res) => {
  try {
    const { food_name, qty, compartment, expiry_date, note, discard, food_id, owner } = req.body;
    const result = await client.query("UPDATE food SET food_name = $1, qty = $2, compartment = $3, expiry_date = $4, note = $5, discard = $6, owner = $7 WHERE food_id = $8", 
                                      [food_name, qty, compartment, expiry_date, note, discard, owner, food_id]); 
    console.log(result); // Debugging
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Error editing food item:', err.stack);
    res.status(500).send('Error editing food item');
  }
});

// For deleting existing food item from database
app.post('/delete-food', async (req, res) => {
  try {
    const { food_id } = req.body;
    const result = await client.query("DELETE FROM food WHERE food_id = $1", [food_id]); 
    console.log(result); // Debugging
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Error deleting food item:', err.stack);
    res.status(500).send('Error deleting food item');
  }
});

// added 25/5
// For deleting a fridge from database
app.post('/delete-fridge', async (req, res) => {
  try {
    const { fridge_id } = req.body;
    const result = await client.query("DELETE FROM fridge WHERE fridge_id = $1", [fridge_id]);
    console.log(result); // Debugging
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Error deleting fridge:', err.stack);
    res.status(500).send('Error deleting fridge');
  }
});

// port for HTTP server created by Express
app.listen(port, () => console.log(`Server listening on port ${port}`));
