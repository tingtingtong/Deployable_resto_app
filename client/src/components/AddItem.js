import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddItem = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [stock, setStock] = useState('');
  const [additionalStock, setAdditionalStock] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

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

  const handleAddItem = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/items/add', 
        { name, unit, stock }, 
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setSuccess('Item added successfully.');
      setError('');
      fetchItems(); // Refresh the item list
      setName('');
      setUnit('');
      setStock('');
    } catch (error) {
      console.error('Failed to add item:', error);
      setError('Failed to add item. Please try again.');
      setSuccess('');
    }
  };

  const handleUpdateStock = (item) => {
    setSelectedItem(item);
    setAdditionalStock('');
    setError('');
    setSuccess('');
    document.getElementById('update-stock-form').style.display = 'block';
  };

  const handleUpdateStockSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:5000/api/items/${selectedItem._id}`, 
        { additionalStock: parseFloat(additionalStock) }, 
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setSuccess(`Stock updated successfully for item ${response.data.name}.`);
      setError('');
      fetchItems(); // Refresh the item list
      document.getElementById('update-stock-form').style.display = 'none';
    } catch (error) {
      console.error('Failed to update stock:', error);
      setError('Failed to update stock. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="add-item-container">
      <h2>Add Item</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <button className="add-item-button" onClick={() => document.getElementById('add-item-form').style.display = 'block'}>
        Add New Item
      </button>
      <form id="add-item-form" onSubmit={handleAddItem} style={{ display: 'none' }}>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Unit (e.g., kg, litre)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <h2>Update Item Stock</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Unit</th>
            <th>Current Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.unit}</td>
              <td>{item.stock}</td>
              <td>
                <button onClick={() => handleUpdateStock(item)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form id="update-stock-form" onSubmit={handleUpdateStockSubmit} style={{ display: 'none' }} className="update-stock-form">
        <h2>Update Stock for {selectedItem && selectedItem.name}</h2>
        <p>Current Stock: {selectedItem && selectedItem.stock} {selectedItem && selectedItem.unit}</p>
        <input
          type="number"
          placeholder="Additional Stock"
          value={additionalStock}
          onChange={(e) => setAdditionalStock(e.target.value)}
          required
        />
        <button type="submit">Update Stock</button>
      </form>
    </div>
  );
};

export default AddItem;
