import React, { useState } from 'react';

function App() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState(null);

  const trackOrder = async () => {
    const res = await fetch(`http://localhost:8080/track/${orderId}`);
    const data = await res.json();
    setStatus(data);
  }

  return (
    <div>
      <h1>Goods Transport Tracker</h1>
      <input 
        type="text" 
        placeholder="Enter Order ID" 
        value={orderId} 
        onChange={e => setOrderId(e.target.value)} 
      />
      <button onClick={trackOrder}>Track</button>
      {status && (
        <div>
          <p>Order ID: {status.order_id}</p>
          <p>Status: {status.status}</p>
          <p>Location: {status.location}</p>
        </div>
      )}
    </div>
  );
}

export default App;
