const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// In-memory storage for trips (replace with database in production)
let trips = [];

// API Routes
app.post('/api/trips', (req, res) => {
  try {
    const tripData = req.body;
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      createdAt: new Date().toISOString(),
      driver: {
        id: "1", // This should be replaced with actual user ID from auth
        name: "John Doe", // This should be replaced with actual user name from auth
        avatar: "/avatars/default.png" // Default avatar
      },
      status: "active",
      passengers: []
    };
    
    trips.push(newTrip);
    console.log('New trip created:', newTrip);
    
    // Emit the new trip to all connected clients
    io.emit('tripCreated', newTrip);
    
    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

app.get('/api/trips', (req, res) => {
  console.log('Fetching all trips:', trips);
  res.json(trips);
});

app.get('/api/trips/:id', (req, res) => {
  try {
    console.log('Fetching trip with ID:', req.params.id);
    console.log('Current trips:', trips);
    
    const trip = trips.find(t => t.id === req.params.id);
    if (!trip) {
      console.log('Trip not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    console.log('Found trip:', trip);
    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Handle trip creation
  socket.on('newTrip', (tripData) => {
    console.log('New trip created via socket:', tripData);
    io.emit('tripCreated', tripData);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});