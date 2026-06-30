const db = require('../config/db');

// Create a new song
const createSong = async (req, res) => {
  const { title, artist_id, album_id, genre, mood, duration_sec, audio_url, cover_url } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO songs (title, artist_id, album_id, genre, mood, duration_sec, audio_url, cover_url, play_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [title, artist_id, album_id, genre, mood, duration_sec, audio_url, cover_url]
    );

    res.status(201).json({ message: 'Song created successfully', songId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all songs (with optional filters, search, pagination)
const getSongs = async (req, res) => {
  const { genre, mood, artist_id, album_id, search, page = 1, limit = 20 } = req.query;

  try {
    let query = 'SELECT * FROM songs WHERE 1=1';
    const params = [];

    if (genre) {
      query += ' AND genre = ?';
      params.push(genre);
    }
    if (mood) {
      query += ' AND mood = ?';
      params.push(mood);
    }
    if (artist_id) {
      query += ' AND artist_id = ?';
      params.push(artist_id);
    }
    if (album_id) {
      query += ' AND album_id = ?';
      params.push(album_id);
    }
    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [songs] = await db.query(query, params);

    res.status(200).json({ songs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get single song by ID
const getSongById = async (req, res) => {
  const { id } = req.params;

  try {
    const [songs] = await db.query('SELECT * FROM songs WHERE id = ?', [id]);

    if (songs.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }

    res.status(200).json({ song: songs[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update song
const updateSong = async (req, res) => {
  const { id } = req.params;
  const { title, artist_id, album_id, genre, mood, duration_sec, audio_url, cover_url } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM songs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }

    await db.query(
      `UPDATE songs SET title = ?, artist_id = ?, album_id = ?, genre = ?, mood = ?, duration_sec = ?, audio_url = ?, cover_url = ?
       WHERE id = ?`,
      [title, artist_id, album_id, genre, mood, duration_sec, audio_url, cover_url, id]
    );

    res.status(200).json({ message: 'Song updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete song
const deleteSong = async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query('SELECT * FROM songs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }

    await db.query('DELETE FROM songs WHERE id = ?', [id]);

    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Discover songs - anti-trending (lowest play_count first), with optional genre/mood filters
const discoverSongs = async (req, res) => {
  const { genre, mood, limit = 20 } = req.query;

  try {
    let query = 'SELECT * FROM songs WHERE 1=1';
    const params = [];

    if (genre) {
      query += ' AND genre = ?';
      params.push(genre);
    }
    if (mood) {
      query += ' AND mood = ?';
      params.push(mood);
    }

    query += ' ORDER BY play_count ASC LIMIT ?';
    params.push(Number(limit));

    const [songs] = await db.query(query, params);

    res.status(200).json({ songs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { createSong, getSongs, getSongById, updateSong, deleteSong, discoverSongs };