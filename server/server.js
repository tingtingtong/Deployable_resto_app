const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/udupi-restaurant', { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('./models/User');
const Item = require('./models/Item');
const Inventory = require('./models/Inventory');
const Counter = require('./models/Counter');

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token.split(' ')[1], 'your_jwt_secret', (err, user) => {
      if (err) {
        console.error('JWT verification failed:', err);
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
    });
  } else {
    console.error('Authorization header missing');
    res.sendStatus(401); // Unauthorized
  }
};

// User Registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'User registration failed', error: err.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

// Add Inventory Item
app.post('/api/inventory/add', authenticateJWT, async (req, res) => {
  const { itemName, stockTaken } = req.body;
  const item = await Item.findOne({ name: itemName });

  if (!item) {
    return res.status(400).json({ message: 'Item not found' });
  }

  if (stockTaken > item.stock) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }

  const newStock = item.stock - stockTaken;

  let counter = await Counter.findOneAndUpdate(
    { id: 'inventory' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const newInventory = new Inventory({
    key: counter.seq,
    itemName,
    stockTaken,
    remainingStock: newStock,
    date: new Date()
  });

  await Item.updateOne({ name: itemName }, { stock: newStock, lastUpdated: new Date() });
  await newInventory.save();

  res.status(201).json({ message: 'Inventory item added successfully' });
});

// List Inventory
app.get('/api/inventory/list', authenticateJWT, async (req, res) => {
  try {
    console.log('Fetching inventory for user:', req.user);
    const inventories = await Inventory.find();
    res.json(inventories);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
});

// Add Item
app.post('/api/items/add', authenticateJWT, async (req, res) => {
  const { name, unit, stock } = req.body;
  const newItem = new Item({ name, unit, stock, lastUpdated: new Date() });
  try {
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Item addition failed', error: err.message });
  }
});

// List Items
app.get('/api/items/list', authenticateJWT, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

// Get Item Details
app.get('/api/items/:itemName', authenticateJWT, async (req, res) => {
  const itemName = req.params.itemName;
  try {
    const item = await Item.findOne({ name: itemName });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item details:', error);
    res.status(500).json({ message: 'Failed to fetch item details' });
  }
});

// Update Item Stock
app.put('/api/items/:itemId', authenticateJWT, async (req, res) => {
  const { itemId } = req.params;
  const { additionalStock } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.stock += additionalStock;
    item.lastUpdated = new Date();
    await item.save();

    res.json(item);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Failed to update stock' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
