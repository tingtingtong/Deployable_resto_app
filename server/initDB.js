const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
const Inventory = require('./models/Inventory');
const Counter = require('./models/Counter');

const initializeDatabase = async () => {
  await mongoose.connect('mongodb://localhost:27017/udupi-restaurant', { useNewUrlParser: true, useUnifiedTopology: true });

  console.log('Connected to MongoDB');

  // Initialize Counter collection for Inventory if it doesn't exist
  const counterExists = await Counter.findOne({ id: 'inventory' });
  if (!counterExists) {
    const counter = new Counter({ id: 'inventory', seq: 0 });
    await counter.save();
    console.log('Initialized Counter collection');
  }

  // Initialize collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  const collectionNames = collections.map(col => col.name);

  if (!collectionNames.includes('users')) {
    await User.createCollection();
    console.log('Initialized Users collection');
  }
  
  if (!collectionNames.includes('items')) {
    await Item.createCollection();
    console.log('Initialized Items collection');
  }

  if (!collectionNames.includes('inventories')) {
    await Inventory.createCollection();
    console.log('Initialized Inventories collection');
  }

  console.log('Database initialization complete');
  mongoose.connection.close();
};

initializeDatabase().catch(err => {
  console.error('Database initialization failed', err);
  mongoose.connection.close();
});
