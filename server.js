const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const foodItems = []; // Example array to hold food items

app.post('/add-food', (req, res) => {
  try {
    const { food_name, qty, expiry_date, note, discard, fridge_id, owner } = req.body;

    // Add new food item to the array
    const newFoodItem = {
      food_id: foodItems.length + 1,
      food_name,
      qty,
      expiry_date,
      note,
      discard,
      fridge_id,
      owner
    };

    foodItems.push(newFoodItem);

    res.status(201).json({ message: 'Food item added successfully', foodItem: newFoodItem });
  } catch (error) {
    console.error('Error adding new food item:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.get('/food-data', (req, res) => {
  const fridge_id = req.query.fridge_id;
  const filteredFoodItems = foodItems.filter(item => item.fridge_id === parseInt(fridge_id));
  res.json(filteredFoodItems);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
