const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  unit: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', itemSchema);
