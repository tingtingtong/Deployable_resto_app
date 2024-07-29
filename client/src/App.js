import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AddInventory from './components/AddInventory';
import InventoryList from './components/InventoryList';
import AddItem from './components/AddItem';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="App">
      <nav>
        <ul>
          {isAuthenticated ? (
            <>
              <li><Link to="/add-inventory">Inventory Transaction</Link></li>
              <li><Link to="/inventory-list">Inventory List</Link></li>
              <li><Link to="/add-item">Add/Update Item Stock</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
        {isAuthenticated && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/add-inventory" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AddInventory /></ProtectedRoute>} />
        <Route path="/inventory-list" element={<ProtectedRoute isAuthenticated={isAuthenticated}><InventoryList /></ProtectedRoute>} />
        <Route path="/add-item" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AddItem /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AddInventory /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
