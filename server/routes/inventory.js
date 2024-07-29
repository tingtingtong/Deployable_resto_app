const express = require('express');
const Inventory = require('../models/Inventory');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

router.post('/add', authenticateJWT, async (req, res) => {
  const { itemName, stockTaken, totalStock } = req.body;
  const newInventory = new Inventory({ itemName, stockTaken, totalStock });
  await newInventory.save();
  res.sendStatus(201);
});

module.exports = router;
