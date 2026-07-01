const db = require('../config/db');

// Add song to likes
const addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { song_id } = req.body;

  try {
    const [song] = await db.query('SELECT * FROM songs WHERE id = ?', [song_id]);
    if (song.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }

    const [existing] = await db.query(
      'SELECT * FROM likes WHERE user_id = ? AND song_id = ?',
      [userId, song_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Song already liked' });
    }

    await db.query(
      'INSERT INTO likes (user_id, song_id) VALUES (?, ?)',
      [userId, song_id]
    );

    res.status(201).json({ message: 'Song added to likes' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove song from likes
const removeFavorite = async (req, res) => {
  const userId = req.user.id;
  const { songId } = req.params;

  try {
    const [existing] = await db.query(
      'SELECT * FROM likes WHERE user_id = ? AND song_id = ?',
      [userId, songId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Like not found' });
    }

    await db.query('DELETE FROM likes WHERE user_id = ? AND song_id = ?', [userId, songId]);

    res.status(200).json({ message: 'Song removed from likes' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all liked songs for logged-in user
const getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const [likes] = await db.query(
      `SELECT s.* FROM likes l
       JOIN songs s ON l.song_id = s.id
       WHERE l.user_id = ?
       ORDER BY l.liked_at DESC`,
      [userId]
    );

    res.status(200).json({ favorites: likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites };