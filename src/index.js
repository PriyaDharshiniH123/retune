const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/songs', songRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/playlists', playlistRoutes);

app.get('/', (req, res) => {
  res.send('Retune API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});