const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  key: {
    type: Number,
    unique: true
  },
  itemName: {
    type: String,
    required: true
  },
  stockTaken: {
    type: Number,
    required: true
  },
  remainingStock: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inventory', inventorySchema);
