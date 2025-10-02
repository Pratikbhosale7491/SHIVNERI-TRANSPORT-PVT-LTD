// backend/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'bookings.json');

app.use(cors());
app.use(express.json()); // to parse JSON bodies

app.post('/api/quote', (req, res) => {
  const booking = req.body;
  if (!booking.origin || !booking.destination || !booking.weight || !booking.date || !booking.name || !booking.phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Read existing bookings
  let bookings = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      bookings = JSON.parse(fs.readFileSync(DATA_FILE));
      if (!Array.isArray(bookings)) bookings = [];
    } catch (err) {
      bookings = [];
    }
  }

  bookings.push(booking);

  // Save to file
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
    res.json({ message: 'Booking saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
