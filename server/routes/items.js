const express = require('express');
const Item = require('../models/Item');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

router.post('/add', authenticateJWT, async (req, res) => {
  const { name, stock, unit } = req.body;
  const existingItem = await Item.findOne({ name });

  if (existingItem) {
    return res.status(400).send('Item already exists');
  }

  const newItem = new Item({ name, stock, unit });
  await newItem.save();
  res.sendStatus(201);
});

router.put('/update/:name', authenticateJWT, async (req, res) => {
  const { name } = req.params;
  const { stock } = req.body;
  const item = await Item.findOne({ name });

  if (item) {
    item.stock += stock;
    item.lastUpdated = Date.now();
    await item.save();
    res.sendStatus(200);
  } else {
    res.status(404).send('Item not found');
  }
});

router.get('/list', authenticateJWT, async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

router.get('/:name', authenticateJWT, async (req, res) => {
  const { name } = req.params;
  const item = await Item.findOne({ name });
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

module.exports = router;
