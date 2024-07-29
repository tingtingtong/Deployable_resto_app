import React, { useState } from 'react';

const UpdateStockModal = ({ item, onClose, onUpdate }) => {
  const [additionalStock, setAdditionalStock] = useState(0);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    const newStock = item.stock + additionalStock;
    setConfirmationMessage(`Current stock is ${item.stock} ${item.unit} of ${item.name}. If you add ${additionalStock} ${item.unit}, total stock would be ${newStock} ${item.unit}. Please confirm.`);
    setIsConfirming(true);
  };

  const handleUpdate = () => {
    onUpdate(item.name, additionalStock);
    setConfirmationMessage('');
    setIsConfirming(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Update Stock for {item.name}</h2>
        <div>
          <p>Item Name: <b>{item.name}</b></p>
          <p>Current Stock: <b>{item.stock} {item.unit}</b></p>
        </div>
        <input
          type="number"
          placeholder="Additional Stock"
          value={additionalStock}
          onChange={(e) => setAdditionalStock(Number(e.target.value))}
          required
        />
        {!isConfirming && (
          <button onClick={handleConfirm}>Confirm</button>
        )}
        {isConfirming && (
          <div>
            <p>{confirmationMessage}</p>
            <button onClick={handleUpdate}>Confirm Update</button>
            <button onClick={() => setIsConfirming(false)}>Cancel</button>
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UpdateStockModal;
