import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddInventory = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [stockTaken, setStockTaken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/items/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setError('Failed to fetch items. Please try again.');
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/inventory/add', 
        { itemName, stockTaken: parseFloat(stockTaken) }, 
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setSuccess('Inventory item added successfully.');
      setError('');
      fetchItems(); // Refresh the item list
      setItemName('');
      setStockTaken('');
    } catch (error) {
      console.error('Failed to add inventory item:', error);
      setError('Failed to add inventory item. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="add-inventory-container">
      <h2>Add Inventory Item</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleAddInventory}>
        <select value={itemName} onChange={(e) => setItemName(e.target.value)} required>
          <option value="">Select Item</option>
          {items.map(item => (
            <option key={item._id} value={item.name}>{item.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Stock Taken"
          value={stockTaken}
          onChange={(e) => setStockTaken(e.target.value)}
          required
        />
        <button type="submit">Add Inventory Item</button>
      </form>
    </div>
  );
};

export default AddInventory;
