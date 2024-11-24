const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
const { resolve } = require('path');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './BD4_Assignment1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

// Exercise 1: Get All Restaurants
app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants Found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantById(id) {
  let query = 'SELECT * FROM restaurants where id = ?';
  let response = await db.all(query, [id]);
  return { restaurant: response };
}

// Excercise 2 : Find Restaurant By Id
app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let results = await fetchRestaurantById(id);
    if (results.restaurant.length === 0) {
      return res
        .status(404)
        .json({ message: 'restaurant with id : ' + id + ' not found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants where cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

// Exercise 3: Get Restaurants by Cuisine
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let results = await fetchRestaurantsByCuisine(cuisine);

    if (results.restaurants.length === 0) {
      return res.status(404).json({
        message: 'No Restaurants with cuisine : ' + cuisine + ' were found',
      });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants where isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

// Exercise 4: Get Restaurants by Filter
app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let results = await fetchRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );

    if (results.restaurants.length === 0) {
      return res.status(404).json({
        message:
          'No Restaurants found with isVeg : ' +
          isVeg +
          ', hasOutdoorSeating : ' +
          hasOutdoorSeating +
          ', isLuxury : ' +
          isLuxury,
      });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getRestaurantsOrderedByRatings() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

// Exercise 5: Get Restaurants Sorted by Rating from highest to lowest
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await getRestaurantsOrderedByRatings();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants Found to Sort' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

// Exercise 1: Get All Dishes
app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchDishesById(id) {
  let query = 'SELECT * FROM dishes where id = ?';
  let response = await db.all(query, [id]);
  return { dish: response };
}

// Excercise 7 : Get By Id
app.get('/dishes/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let results = await fetchDishesById(id);
    if (results.dish.length === 0) {
      return res
        .status(404)
        .json({ message: 'dish with id : ' + id + ' not found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchDishesByFilter(isVeg) {
  let query = 'SELECT * FROM dishes where isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

// Exercise 8: Get Dishes by Filter
app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let results = await fetchDishesByFilter(isVeg);

    if (results.dishes.length === 0) {
      return res.status(404).json({
        message: 'No Dishes found with isVeg : ' + isVeg,
      });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getDishesOrderedByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}

// Exercise 9: Get Dishes Sorted by Price
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await getDishesOrderedByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found to Sort' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
