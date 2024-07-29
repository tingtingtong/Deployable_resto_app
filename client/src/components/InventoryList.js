import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Correct import path

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/inventory/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setInventory(response.data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setError('Failed to fetch inventory. Please try again.');
    }
  };

  return (
    <div className="inventory-container">
      <h2>Inventory List</h2>
      {error && <p className="error">{error}</p>}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Stock Taken</th>
            <th>Remaining Stock</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>{item.stockTaken}</td>
              <td>{item.remainingStock}</td>
              <td>{new Date(item.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
